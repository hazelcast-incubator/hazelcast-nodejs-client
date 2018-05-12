/*
 * Copyright (c) 2008-2018, Hazelcast, Inc. All Rights Reserved.
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

import {SerializationService, SerializationServiceV1} from './serialization/SerializationService';
import {InvocationService} from './invocation/InvocationService';
import {ListenerService} from './ListenerService';
import {ClientConfig} from './config/Config';
import * as Promise from 'bluebird';
import {IMap} from './proxy/IMap';
import {ISet} from './proxy/ISet';
import {LoggingService} from './logging/LoggingService';
import {LifecycleEvent, LifecycleService} from './LifecycleService';
import {ClientGetDistributedObjectsCodec} from './codec/ClientGetDistributedObjectsCodec';
import {DistributedObject} from './DistributedObject';
import {ClientInfo} from './ClientInfo';
import {ClientConnectionManager} from './invocation/ClientConnectionManager';
import {ProxyManager} from './proxy/ProxyManager';
import {PartitionService} from './PartitionService';
import {ClusterService} from './invocation/ClusterService';
import {Heartbeat} from './HeartbeatService';
import {IQueue} from './proxy/IQueue';
import {IList} from './proxy/IList';
import {ILock} from './proxy/ILock';
import {MultiMap} from './proxy/MultiMap';
import {IRingbuffer} from './proxy/IRingbuffer';
import {ITopic} from './proxy/topic/ITopic';
import {IReplicatedMap} from './proxy/IReplicatedMap';
import {ISemaphore} from './proxy/ISemaphore';
import {IAtomicLong} from './proxy/IAtomicLong';
import {LockReferenceIdGenerator} from './LockReferenceIdGenerator';
import {RepairingTask} from './nearcache/RepairingTask';
import {ConfigBuilder} from './config/ConfigBuilder';
import {ClientErrorFactory} from './protocol/ErrorFactory';
import {FlakeIdGenerator} from './proxy/FlakeIdGenerator';
import {PNCounter} from './proxy/PNCounter';

export default class HazelcastClient {

    private config: ClientConfig = new ClientConfig();
    private loggingService: LoggingService;
    private serializationService: SerializationService;
    private invocationService: InvocationService;
    private listenerService: ListenerService;
    private connectionManager: ClientConnectionManager;
    private partitionService: PartitionService;
    private clusterService: ClusterService;
    private lifecycleService: LifecycleService;
    private proxyManager: ProxyManager;
    private heartbeat: Heartbeat;
    private lockReferenceIdGenerator: LockReferenceIdGenerator;
    private mapRepairingTask: RepairingTask;
    private errorFactory: ClientErrorFactory;

    constructor(config?: ClientConfig) {
        if (config) {
            this.config = config;
        }

        LoggingService.initialize(<string>this.config.properties['hazelcast.logging']);
        this.loggingService = LoggingService.getLoggingService();
        this.invocationService = new InvocationService(this);
        this.listenerService = new ListenerService(this);
        this.serializationService = new SerializationServiceV1(this.config.serializationConfig);
        this.proxyManager = new ProxyManager(this);
        this.partitionService = new PartitionService(this);
        this.connectionManager = new ClientConnectionManager(this);
        this.clusterService = new ClusterService(this);
        this.lifecycleService = new LifecycleService(this);
        this.heartbeat = new Heartbeat(this);
        this.lockReferenceIdGenerator = new LockReferenceIdGenerator();
        this.errorFactory = new ClientErrorFactory();
    }

    /**
     * Creates a new client object and automatically connects to cluster.
     * @param config Default {@link ClientConfig} is used when this parameter is absent.
     * @returns a new client instance
     */
    public static newHazelcastClient(config?: ClientConfig): Promise<HazelcastClient> {
        if (config == null) {
            let configBuilder = new ConfigBuilder();
            return configBuilder.loadConfig().then(() => {
                let client = new HazelcastClient(configBuilder.build());
                return client.init();
            });
        } else {
            let client = new HazelcastClient(config);
            return client.init();
        }
    }

    /**
     * Gathers information of this local client.
     * @returns {ClientInfo}
     */
    getLocalEndpoint(): ClientInfo {
        return this.clusterService.getClientInfo();
    }

    /**
     * Gives all known distributed objects in cluster.
     * @returns {Promise<DistributedObject[]>|Promise<T>}
     */
    getDistributedObjects(): Promise<DistributedObject[]> {
        var clientMessage = ClientGetDistributedObjectsCodec.encodeRequest();
        var toObjectFunc = this.serializationService.toObject.bind(this);
        var proxyManager = this.proxyManager;
        return this.invocationService.invokeOnRandomTarget(clientMessage).then(function (resp) {
            var response = ClientGetDistributedObjectsCodec.decodeResponse(resp, toObjectFunc).response;
            return response.map((objectInfo: { [key: string]: any }) => {
                return proxyManager.getOrCreateProxy(objectInfo['value'], objectInfo['key'], false);
            });
        });
    }

    /**
     * Returns the distributed map instance with given name.
     * @param name
     * @returns {IMap<K, V>}
     */
    getMap<K, V>(name: string): IMap<K, V> {
        return <IMap<K, V>>this.proxyManager.getOrCreateProxy(name, ProxyManager.MAP_SERVICE);
    }

    /**
     * Returns the distributed set instance with given name.
     * @param name
     * @returns {ISet<E>}
     */
    getSet<E>(name: string): ISet<E> {
        return <ISet<E>>this.proxyManager.getOrCreateProxy(name, ProxyManager.SET_SERVICE);
    }

    /**
     * Returns the distributed lock instance with given name.
     * @param name
     * @returns {ILock}
     */
    getLock(name: string): ILock {
        return <ILock>this.proxyManager.getOrCreateProxy(name, ProxyManager.LOCK_SERVICE);
    }

    /**
     * Returns the distributed queue instance with given name.
     * @param name
     * @returns {IQueue<E>}
     */
    getQueue<E>(name: string): IQueue<E> {
        return <IQueue<E>>this.proxyManager.getOrCreateProxy(name, ProxyManager.QUEUE_SERVICE);
    }

    /**
     * Returns the distributed list instance with given name.
     * @param name
     * @returns {IQueue<E>}
     */
    getList<E>(name: string): IList<E> {
        return <IList<E>>this.proxyManager.getOrCreateProxy(name, ProxyManager.LIST_SERVICE);
    }

    /**
     * Returns the distributed multi-map instance with given name.
     * @param name
     * @returns {MultiMap<K, V>}
     */
    getMultiMap<K, V>(name: string): MultiMap<K, V> {
        return <MultiMap<K, V>>this.proxyManager.getOrCreateProxy(name, ProxyManager.MULTIMAP_SERVICE);
    }

    /**
     * Returns a distributed ringbuffer instance with the given name.
     * @param name
     * @returns {IRingbuffer<E>}
     */
    getRingbuffer<E>(name: string): IRingbuffer<E> {
        return <IRingbuffer<E>>this.proxyManager.getOrCreateProxy(name, ProxyManager.RINGBUFFER_SERVICE);
    }

    /**
     * Returns a distributed reliable topic instance with the given name.
     * @param name
     * @returns {ITopic<E>}
     */
    getReliableTopic<E>(name: string): ITopic<E> {
        return <ITopic<E>>this.proxyManager.getOrCreateProxy(name, ProxyManager.RELIABLETOPIC_SERVICE);
    }

    getReplicatedMap<K, V>(name: string): IReplicatedMap<K, V> {
        return <IReplicatedMap<K, V>>this.proxyManager.getOrCreateProxy(name, ProxyManager.REPLICATEDMAP_SERVICE);
    }

    getAtomicLong(name: string): IAtomicLong {
        return <IAtomicLong>this.proxyManager.getOrCreateProxy(name, ProxyManager.ATOMICLONG_SERVICE);
    }

    getFlakeIdGenerator(name: string): FlakeIdGenerator {
        return <FlakeIdGenerator>this.proxyManager.getOrCreateProxy(name, ProxyManager.FLAKEID_SERVICE);
    }

    getPNCounter(name: string): PNCounter {
        return <PNCounter>this.proxyManager.getOrCreateProxy(name, ProxyManager.PNCOUNTER_SERVICE);
    }

    /**
     * Returns the distributed semaphore instance with given name.
     * @param name
     * @returns {ISemaphore}
     */
    getSemaphore(name: string): ISemaphore {
        return <ISemaphore>this.proxyManager.getOrCreateProxy(name, ProxyManager.SEMAPHORE_SERVICE);
    }

    /**
     * Return configuration that this instance started with.
     * Returned configuration object should not be modified.
     * @returns {ClientConfig}
     */
    getConfig(): ClientConfig {
        return this.config;
    }

    getSerializationService(): SerializationService {
        return this.serializationService;
    }

    getInvocationService(): InvocationService {
        return this.invocationService;
    }

    getListenerService(): ListenerService {
        return this.listenerService;
    }

    getConnectionManager(): ClientConnectionManager {
        return this.connectionManager;
    }

    getPartitionService(): PartitionService {
        return this.partitionService;
    }

    getProxyManager(): ProxyManager {
        return this.proxyManager;
    }

    getClusterService(): ClusterService {
        return this.clusterService;
    }

    getHeartbeat(): Heartbeat {
        return this.heartbeat;
    }

    getLifecycleService(): LifecycleService {
        return this.lifecycleService;
    }

    getRepairingTask(): RepairingTask {
        if (this.mapRepairingTask == null) {
            this.mapRepairingTask = new RepairingTask(this);
        }
        return this.mapRepairingTask;
    }

    /**
     * Registers a distributed object listener to cluster.
     * @param listenerFunc Callback function will be called with following arguments.
     * <ul>
     *     <li>service name</li>
     *     <li>distributed object name</li>
     *     <li>name of the event that happened: either 'created' or 'destroyed'</li>
     * </ul>
     * @returns registration id of the listener.
     */
    addDistributedObjectListener(listenerFunc: Function): Promise<string> {
        return this.proxyManager.addDistributedObjectListener(listenerFunc);
    }

    /**
     * Removes a distributed object listener from cluster.
     * @param listenerId id of the listener to be removed.
     * @returns `true` if registration is removed, `false` otherwise.
     */
    removeDistributedObjectListener(listenerId: string): Promise<boolean> {
        return this.proxyManager.removeDistributedObjectListener(listenerId);
    }

    getLockReferenceIdGenerator(): LockReferenceIdGenerator {
        return this.lockReferenceIdGenerator;
    }

    getErrorFactory(): ClientErrorFactory {
        return this.errorFactory;
    }

    /**
     * Shuts down this client instance.
     */
    shutdown(): void {
        if (this.mapRepairingTask !== undefined) {
            this.mapRepairingTask.shutdown();
        }
        this.partitionService.shutdown();
        this.lifecycleService.emitLifecycleEvent(LifecycleEvent.shuttingDown);
        this.heartbeat.cancel();
        this.connectionManager.shutdown();
        this.listenerService.shutdown();
        this.invocationService.shutdown();
        this.lifecycleService.emitLifecycleEvent(LifecycleEvent.shutdown);
    }

    private init(): Promise<HazelcastClient> {
        return this.clusterService.start().then(() => {
            return this.partitionService.initialize();
        }).then(() => {
            return this.heartbeat.start();
        }).then(() => {
            this.lifecycleService.emitLifecycleEvent(LifecycleEvent.started);
        }).then(() => {
            this.proxyManager.init();
            this.listenerService.start();
            this.loggingService.info('HazelcastClient', 'Client started');
            return this;
        }).catch((e) => {
            this.loggingService.error('HazelcastClient', 'Client failed to start', e);
            throw e;
        });
    }
}

