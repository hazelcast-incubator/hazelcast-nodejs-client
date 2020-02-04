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

/*tslint:disable:max-line-length*/
import {Buffer} from 'safe-buffer';
import {BitsUtil} from '../BitsUtil';
import {FixSizedTypesCodec} from './builtin/FixSizedTypesCodec';
import {ClientMessage, Frame, MESSAGE_TYPE_OFFSET, PARTITION_ID_OFFSET, UNFRAGMENTED_MESSAGE} from '../ClientMessage';
import {UUID} from '../core/UUID';
import * as Long from 'long';
import {StringCodec} from './builtin/StringCodec';
import {Data} from '../serialization/Data';
import {DataCodec} from './builtin/DataCodec';
import {CodecUtil} from './builtin/CodecUtil';

// hex: 0x120400
const REQUEST_MESSAGE_TYPE = 1180672;
// hex: 0x120401
const RESPONSE_MESSAGE_TYPE = 1180673;

const REQUEST_TXN_ID_OFFSET = PARTITION_ID_OFFSET + BitsUtil.INT_SIZE_IN_BYTES;
const REQUEST_THREAD_ID_OFFSET = REQUEST_TXN_ID_OFFSET + BitsUtil.UUID_SIZE_IN_BYTES;
const REQUEST_TIMEOUT_OFFSET = REQUEST_THREAD_ID_OFFSET + BitsUtil.LONG_SIZE_IN_BYTES;
const REQUEST_INITIAL_FRAME_SIZE = REQUEST_TIMEOUT_OFFSET + BitsUtil.LONG_SIZE_IN_BYTES;

export interface TransactionalQueuePeekResponseParams {
    response: Data;
}
export class TransactionalQueuePeekCodec {
    static encodeRequest(name: string, txnId: UUID, threadId: Long, timeout: Long): ClientMessage {
        const clientMessage = ClientMessage.createForEncode();
        clientMessage.setRetryable(false);

        const initialFrame = new Frame(Buffer.allocUnsafe(REQUEST_INITIAL_FRAME_SIZE), UNFRAGMENTED_MESSAGE);
        FixSizedTypesCodec.encodeInt(initialFrame.content, MESSAGE_TYPE_OFFSET, REQUEST_MESSAGE_TYPE);
        FixSizedTypesCodec.encodeInt(initialFrame.content, PARTITION_ID_OFFSET, -1);
        FixSizedTypesCodec.encodeUUID(initialFrame.content, REQUEST_TXN_ID_OFFSET, txnId);
        FixSizedTypesCodec.encodeLong(initialFrame.content, REQUEST_THREAD_ID_OFFSET, threadId);
        FixSizedTypesCodec.encodeLong(initialFrame.content, REQUEST_TIMEOUT_OFFSET, timeout);
        clientMessage.add(initialFrame);

        StringCodec.encode(clientMessage, name);
        return clientMessage;
    }

    static decodeResponse(clientMessage: ClientMessage): TransactionalQueuePeekResponseParams {
        const iterator = clientMessage.frameIterator();
        // empty initial frame
        iterator.next();

        return {
            response: CodecUtil.decodeNullable(iterator, DataCodec.decode),
        };
    }
}
