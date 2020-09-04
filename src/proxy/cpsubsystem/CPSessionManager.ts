/*
 * Copyright (c) 2008-2020, Hazelcast, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** @ignore *//** */

import * as Long from 'long';
import {RaftGroupId} from './RaftGroupId';
import {HazelcastClient} from '../../HazelcastClient';
import {
    IllegalStateError,
    SessionExpiredError,
    CPGroupDestroyedError
} from '../../core';
import {
    CPSessionCreateSessionCodec,
    CPSessionCreateSessionResponseParams
} from '../../codec/CPSessionCreateSessionCodec';
import {CPSessionCloseSessionCodec} from '../../codec/CPSessionCloseSessionCodec';
import {CPSessionHeartbeatSessionCodec} from '../../codec/CPSessionHeartbeatSessionCodec';
import {CPSessionGenerateThreadIdCodec} from '../../codec/CPSessionGenerateThreadIdCodec';
import {
    scheduleWithRepetition,
    cancelRepetitionTask,
    Task
} from '../../util/Util';

/** @internal */
export class SessionState {

    readonly id: Long;
    readonly groupId: RaftGroupId;
    readonly ttlMillis: number;
    readonly creationTime: number;
    acquireCount = 0;

    constructor(id: Long, groupId: RaftGroupId, ttlMillis: number) {
        this.id = id;
        this.groupId = groupId;
        this.ttlMillis = ttlMillis;
        this.creationTime = Date.now();
    }

    acquire(count: number): Long {
        this.acquireCount += count;
        return this.id;
    }

    release(count: number): void {
        this.acquireCount -= count;
    }

    isValid(): boolean {
        return this.isInUse() || !this.isExpired(Date.now());
    }

    isInUse(): boolean {
        return this.acquireCount > 0;
    }

    private isExpired(timestamp: number): boolean {
        let expirationTime = this.creationTime + this.ttlMillis;
        if (expirationTime < 0) {
            expirationTime = Number.MAX_SAFE_INTEGER;
        }
        return timestamp > expirationTime;
    }
}

/** @internal */
export const NO_SESSION_ID = Long.fromNumber(-1);

/** @internal */
export class CPSessionManager {

    private readonly client: HazelcastClient;
    // <group_id, session_state> map
    private readonly sessions: Map<string, SessionState> = new Map();
    // <group_id, cluster wide unique thread id> map
    private readonly uniqueThreadIds: Map<string, Long> = new Map();
    private heartbeatTask: Task;
    private isShutdown = false;

    constructor(client: HazelcastClient) {
        this.client = client;
    }

    getSessionId(groupId: RaftGroupId): Long {
        const session = this.sessions.get(groupId.getStringId());
        return session !== undefined ? session.id : NO_SESSION_ID;
    }

    acquireSession(groupId: RaftGroupId, permits: number): Promise<Long> {
        return this.getOrCreateSession(groupId).then((state) => {
            return state.acquire(permits);
        });
    }

    releaseSession(groupId: RaftGroupId, sessionId: Long, permits: number): void {
        const session = this.sessions.get(groupId.getStringId());
        if (session !== undefined && session.id.equals(sessionId)) {
            session.release(permits);
        }
    }

    invalidateSession(groupId: RaftGroupId, sessionId: Long): void {
        const session = this.sessions.get(groupId.getStringId());
        if (session !== undefined && session.id.equals(sessionId)) {
            this.sessions.delete(groupId.getStringId());
        }
    }

    getOrCreateUniqueThreadId(groupId: RaftGroupId): Promise<Long> {
        if (this.isShutdown) {
            return Promise.reject(new IllegalStateError('Session manager is already shut down'));
        }
        const groupIdStr = groupId.getStringId();
        const threadId = this.uniqueThreadIds.get(groupIdStr);
        if (threadId === undefined) {
            return this.requestGenerateThreadId(groupId)
                .then((globalThreadId) => {
                    const existing = this.uniqueThreadIds.get(groupIdStr);
                    if (existing !== undefined) {
                        return existing;
                    }
                    this.uniqueThreadIds.set(groupIdStr, globalThreadId);
                    return globalThreadId;
                });
        }
        return Promise.resolve(threadId);
    }

    shutdown(): Promise<void> {
        if (this.isShutdown) {
            return;
        }
        this.isShutdown = true;
        this.cancelHeartbeatTask();
        const closePromises = [];
        for (const session of this.sessions.values()) {
            closePromises.push(this.requestCloseSession(session.groupId, session.id));
        }
        return Promise.all(closePromises)
            .catch(() => {
                // no-op
            })
            .then(() => this.sessions.clear());
    }

    private getOrCreateSession(groupId: RaftGroupId): Promise<SessionState> {
        if (this.isShutdown) {
            return Promise.reject(new IllegalStateError('Session manager is already shut down'));
        }
        const session = this.sessions.get(groupId.getStringId());
        if (session === undefined || !session.isValid()) {
            return this.createNewSession(groupId);
        }
        return Promise.resolve(session);
    }

    private createNewSession(groupId: RaftGroupId): Promise<SessionState> {
        return this.requestNewSession(groupId).then((response) => {
            const state = new SessionState(response.sessionId, groupId, response.ttlMillis.toNumber());
            this.sessions.set(groupId.getStringId(), state);
            this.scheduleHeartbeatTask(response.heartbeatMillis.toNumber());
            return state;
        });
    }

    private requestNewSession(groupId: RaftGroupId): Promise<CPSessionCreateSessionResponseParams> {
        const clientMessage = CPSessionCreateSessionCodec.encodeRequest(groupId, this.client.getName());
        return this.client.getInvocationService().invokeOnRandomTarget(clientMessage)
            .then((clientMessage) => {
                const response = CPSessionCreateSessionCodec.decodeResponse(clientMessage);
                return response;
            });
    }

    private requestCloseSession(groupId: RaftGroupId, sessionId: Long): Promise<boolean> {
        const clientMessage = CPSessionCloseSessionCodec.encodeRequest(groupId, sessionId);
        return this.client.getInvocationService().invokeOnRandomTarget(clientMessage)
            .then((clientMessage) => {
                const response = CPSessionCloseSessionCodec.decodeResponse(clientMessage);
                return response.response;
            });
    }

    private requestHeartbeat(groupId: RaftGroupId, sessionId: Long): Promise<void> {
        const clientMessage = CPSessionHeartbeatSessionCodec.encodeRequest(groupId, sessionId);
        return this.client.getInvocationService().invokeOnRandomTarget(clientMessage).then();
    }

    private requestGenerateThreadId(groupId: RaftGroupId): Promise<Long> {
        const clientMessage = CPSessionGenerateThreadIdCodec.encodeRequest(groupId);
        return this.client.getInvocationService().invokeOnRandomTarget(clientMessage)
            .then((clientMessage) => {
                const response = CPSessionGenerateThreadIdCodec.decodeResponse(clientMessage);
                return response.response;
            });
    }

    private scheduleHeartbeatTask(heartbeatMillis: number): void {
        if (this.heartbeatTask !== undefined) {
            return;
        }
        this.heartbeatTask = scheduleWithRepetition(() => {
            for (const session of this.sessions.values()) {
                if (session.isInUse()) {
                    this.requestHeartbeat(session.groupId, session.id)
                        .catch((err) => {
                            if (err instanceof SessionExpiredError || err instanceof CPGroupDestroyedError) {
                                this.invalidateSession(session.groupId, session.id);
                            }
                        });
                }
            }
        }, heartbeatMillis, heartbeatMillis);
    }

    private cancelHeartbeatTask(): void {
        if (this.heartbeatTask !== undefined) {
            cancelRepetitionTask(this.heartbeatTask);
        }
    }
}
