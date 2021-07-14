/*
 * Copyright (c) 2008-2021, Hazelcast, Inc. All Rights Reserved.
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

import {
    ClientInfo,
    Cluster,
    DistributedObject,
    DistributedObjectListener,
    LoadBalancer,
    IllegalStateError
} from './core';
import {ClientGetDistributedObjectsCodec} from './codec/ClientGetDistributedObjectsCodec';
import {ClientConfig, ClientConfigImpl} from './config/Config';
import {ClientFailoverConfig, ClientFailoverConfigImpl} from './config/FailoverConfig';
import {ConfigBuilder} from './config/ConfigBuilder';
import {FailoverConfigBuilder} from './config/FailoverConfigBuilder';
import {ConnectionManager} from './network/ConnectionManager';
import {ClusterService} from './invocation/ClusterService';
import {InvocationService} from './invocation/InvocationService';
import {LifecycleService, LifecycleServiceImpl} from './LifecycleService';
import {ListenerService} from './listener/ListenerService';
import {LoggingService} from './logging/LoggingService';
import {RepairingTask} from './nearcache/RepairingTask';
import {PartitionService, PartitionServiceImpl} from './PartitionService';
import {ClientErrorFactory} from './protocol/ErrorFactory';
import {
    FlakeIdGenerator,
    IList,
    IMap,
    IQueue,
    ISet,
    ITopic,
    MultiMap,
    ReplicatedMap,
    Ringbuffer,
    PNCounter
} from './proxy';
import {ProxyManager, NAMESPACE_SEPARATOR} from './proxy/ProxyManager';
import {CPSubsystem, CPSubsystemImpl} from './CPSubsystem';
import {
    ClusterFailoverService,
    ClusterFailoverServiceBuilder
} from './ClusterFailoverService';
import {LockReferenceIdGenerator} from './proxy/LockReferenceIdGenerator';
import {SerializationService, SerializationServiceV1} from './serialization/SerializationService';
import {Statistics} from './statistics/Statistics';
import {NearCacheManager} from './nearcache/NearCacheManager';
import {LoadBalancerType} from './config/LoadBalancerConfig';
import {RandomLB} from './util/RandomLB';
import {RoundRobinLB} from './util/RoundRobinLB';
import {ClusterViewListenerService} from './listener/ClusterViewListenerService';
import {ClientMessage} from './protocol/ClientMessage';
import {Connection} from './network/Connection';
import {ConnectionRegistryImpl} from './network/ConnectionManager';
import {SqlService, SqlServiceImpl} from './sql/SqlService';

/**
 * Hazelcast client instance. When you want to use Hazelcast's distributed
 * data structures, you must first create a client instance. Multiple
 * instances can be created on a single Node.js process.
 *
 * Client instances should be shut down explicitly.
 */
export class HazelcastClient {

    /** @internal */
    private static CLIENT_ID = 0;

    /** @internal */
    private readonly instanceName: string;
    /** @internal */
    private readonly id: number = HazelcastClient.CLIENT_ID++;
    /** @internal */
    private readonly config: ClientConfigImpl;
    /** @internal */
    private readonly failoverConfig?: ClientFailoverConfigImpl;
    /** @internal */
    private readonly clusterFailoverService: ClusterFailoverService;
    /** @internal */
    private readonly loggingService: LoggingService;
    /** @internal */
    private readonly serializationService: SerializationService;
    /** @internal */
    private readonly invocationService: InvocationService;
    /** @internal */
    private readonly listenerService: ListenerService;
    /** @internal */
    private readonly connectionManager: ConnectionManager;
    /** @internal */
    private readonly partitionService: PartitionServiceImpl;
    /** @internal */
    private readonly clusterService: ClusterService;
    /** @internal */
    private readonly lifecycleService: LifecycleServiceImpl;
    /** @internal */
    private readonly proxyManager: ProxyManager;
    /** @internal */
    private readonly cpSubsystem: CPSubsystemImpl;
    /** @internal */
    private readonly nearCacheManager: NearCacheManager;
    /** @internal */
    private readonly lockReferenceIdGenerator: LockReferenceIdGenerator;
    /** @internal */
    private readonly errorFactory: ClientErrorFactory;
    /** @internal */
    private readonly statistics: Statistics;
    /** @internal */
    private readonly loadBalancer: LoadBalancer;
    /** @internal */
    private readonly clusterViewListenerService: ClusterViewListenerService;
    /** @internal */
    private mapRepairingTask: RepairingTask;
    /** @internal */
    private readonly connectionRegistry: ConnectionRegistryImpl;
    /** @internal */
    private readonly sqlService: SqlService;

    /** @internal */
    constructor(config?: ClientConfigImpl, failoverConfig?: ClientFailoverConfigImpl) {
        if (config != null) {
            this.config = config;
        } else {
            this.config = failoverConfig.clientConfigs[0];
        }
        this.loadBalancer = this.initLoadBalancer();
        this.failoverConfig = failoverConfig;
        this.errorFactory = new ClientErrorFactory();
        this.serializationService = new SerializationServiceV1(this.config.serialization);
        this.instanceName = this.config.instanceName || 'hz.client_' + this.id;
        this.loggingService = new LoggingService(this.config.customLogger,
            this.config.properties['hazelcast.logging.level'] as string);
        this.nearCacheManager = new NearCacheManager(
            this.config,
            this.serializationService
        );
        this.partitionService = new PartitionServiceImpl(
            this.loggingService.getLogger(),
            this.serializationService
        );
        this.lifecycleService = new LifecycleServiceImpl(
            this.config.lifecycleListeners,
            this.loggingService.getLogger()
        );
        this.clusterFailoverService = this.initClusterFailoverService();
        this.clusterService = new ClusterService(
            this.config,
            this.loggingService.getLogger(),
            this.clusterFailoverService
        );
        this.connectionRegistry = new ConnectionRegistryImpl(
            this.config.connectionStrategy,
            this.config.network.smartRouting,
            this.loadBalancer,
            this.clusterService
        );
        this.invocationService = new InvocationService(
            this.config,
            this.loggingService.getLogger(),
            this.partitionService as PartitionServiceImpl,
            this.errorFactory,
            this.lifecycleService,
            this.connectionRegistry
        );
        this.connectionManager = new ConnectionManager(
            this,
            this.instanceName,
            this.config,
            this.loggingService.getLogger(),
            this.partitionService,
            this.serializationService,
            this.lifecycleService,
            this.clusterFailoverService,
            this.failoverConfig != null,
            this.clusterService,
            this.invocationService,
            this.connectionRegistry
        );
        this.listenerService = new ListenerService(
            this.loggingService.getLogger(),
            this.config.network.smartRouting,
            this.connectionManager,
            this.invocationService,
            this.connectionRegistry
        );
        this.lockReferenceIdGenerator = new LockReferenceIdGenerator();
        this.proxyManager = new ProxyManager(
            this.config,
            this.loggingService.getLogger(),
            this.invocationService,
            this.listenerService,
            this.partitionService,
            this.serializationService,
            this.nearCacheManager,
            () => this.getRepairingTask(),
            this.clusterService,
            this.lockReferenceIdGenerator,
            this.connectionRegistry
        );
        this.statistics = new Statistics(
            this.loggingService.getLogger(),
            this.config.properties,
            this.instanceName,
            this.invocationService,
            this.nearCacheManager,
            this.connectionRegistry
        );
        this.clusterViewListenerService = new ClusterViewListenerService(
            this.loggingService.getLogger(),
            this.connectionManager,
            this.partitionService as PartitionServiceImpl,
            this.clusterService,
            this.invocationService,
            this.connectionRegistry
        );
        this.cpSubsystem = new CPSubsystemImpl(
            this.loggingService.getLogger(),
            this.instanceName,
            this.invocationService,
            this.serializationService
        );
        this.sqlService = new SqlServiceImpl(
            this.connectionRegistry,
            this.serializationService,
            this.invocationService,
            this.connectionManager
        );
    }

    /**
     * Creates a new client object and automatically connects to cluster.
     * @param config Client config. Default client config is used when this parameter
     *               is absent.
     * @returns a new client instance
     */
    static newHazelcastClient(config?: ClientConfig): Promise<HazelcastClient> {
        const configBuilder = new ConfigBuilder(config);
        const effectiveConfig = configBuilder.build();
        const client = new HazelcastClient(effectiveConfig);
        return client.init();
    }

    /**
     * Creates a client with cluster switch capability. Client will try to connect
     * to alternative clusters according to failover configuration when it disconnects
     * from a cluster.
     *
     * @param failoverConfig Configuration object describing the failover client configs and try count
     * @returns a new client instance
     * @throws InvalidConfigurationError if the provided failover configuration is not valid
     */
    static newHazelcastFailoverClient(failoverConfig?: ClientFailoverConfig): Promise<HazelcastClient> {
        const configBuilder = new FailoverConfigBuilder(failoverConfig);
        const effectiveConfig = configBuilder.build();
        const client = new HazelcastClient(null, effectiveConfig);
        return client.init();
    }

    /**
     * Returns the name of this Hazelcast instance.
     */
    getName(): string {
        return this.instanceName;
    }

    /**
     * Gathers information of this local client.
     */
    getLocalEndpoint(): ClientInfo {
        const connection: Connection = this.connectionRegistry.getRandomConnection();
        const localAddress = connection != null ? connection.getLocalAddress() : null;
        const info = new ClientInfo();
        info.uuid = this.connectionManager.getClientUuid();
        info.localAddress = localAddress;
        info.labels = new Set(this.config.clientLabels);
        info.name = this.instanceName;
        return info;
    }

    /**
     * Gives all known distributed objects in the cluster.
     */
    getDistributedObjects(): Promise<DistributedObject[]> {
        const clientMessage = ClientGetDistributedObjectsCodec.encodeRequest();
        let localDistributedObjects: Set<string>;
        let responseMessage: ClientMessage;
        return this.invocationService.invokeOnRandomTarget(clientMessage)
            .then((resp) => {
                responseMessage = resp;
                return this.proxyManager.getDistributedObjects();
            })
            .then((distributedObjects) => {
                localDistributedObjects = new Set<string>();
                distributedObjects.forEach((obj) => {
                    localDistributedObjects.add(obj.getServiceName() + NAMESPACE_SEPARATOR + obj.getName());
                });

                const newDistributedObjectInfos = ClientGetDistributedObjectsCodec.decodeResponse(responseMessage);
                const createLocalProxiesPromise = newDistributedObjectInfos.map((doi) => {
                    return this.proxyManager.getOrCreateProxy(doi.name, doi.serviceName, false)
                        .then(() => localDistributedObjects.delete(doi.serviceName + NAMESPACE_SEPARATOR + doi.name));
                });

                return Promise.all(createLocalProxiesPromise);
            })
            .then(() => {
                const destroyLocalProxiesPromises = new Array<Promise<void>>(localDistributedObjects.size);
                let index = 0;
                localDistributedObjects.forEach((namespace) => {
                    destroyLocalProxiesPromises[index++] = this.proxyManager.destroyProxyLocally(namespace);
                });
                return Promise.all(destroyLocalProxiesPromises);
            })
            .then(() => {
                return this.proxyManager.getDistributedObjects();
            });
    }

    /**
     * Returns the distributed Map instance with given name.
     */
    getMap<K, V>(name: string): Promise<IMap<K, V>> {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager.MAP_SERVICE) as Promise<IMap<K, V>>;
    }

    /**
     * Returns the distributed Set instance with given name.
     */
    getSet<E>(name: string): Promise<ISet<E>> {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager.SET_SERVICE) as Promise<ISet<E>>;
    }

    /**
     * Returns the distributed Queue instance with given name.
     */
    getQueue<E>(name: string): Promise<IQueue<E>> {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager.QUEUE_SERVICE) as Promise<IQueue<E>>;
    }

    /**
     * Returns the distributed List instance with given name.
     */
    getList<E>(name: string): Promise<IList<E>> {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager.LIST_SERVICE) as Promise<IList<E>>;
    }

    /**
     * Returns the distributed MultiMap instance with given name.
     */
    getMultiMap<K, V>(name: string): Promise<MultiMap<K, V>> {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager.MULTIMAP_SERVICE) as Promise<MultiMap<K, V>>;
    }

    /**
     * Returns a distributed Ringbuffer instance with the given name.
     */
    getRingbuffer<E>(name: string): Promise<Ringbuffer<E>> {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager.RINGBUFFER_SERVICE) as Promise<Ringbuffer<E>>;
    }

    /**
     * Returns a distributed Reliable Topic instance with the given name.
     */
    getReliableTopic<E>(name: string): Promise<ITopic<E>> {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager.RELIABLETOPIC_SERVICE) as Promise<ITopic<E>>;
    }

    /**
     * Returns the distributed Replicated Map instance with given name.
     */
    getReplicatedMap<K, V>(name: string): Promise<ReplicatedMap<K, V>> {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager.REPLICATEDMAP_SERVICE) as Promise<ReplicatedMap<K, V>>;
    }

    /**
     * Returns the distributed Flake ID Generator instance with given name.
     */
    getFlakeIdGenerator(name: string): Promise<FlakeIdGenerator> {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager.FLAKEID_SERVICE) as Promise<FlakeIdGenerator>;
    }

    /**
     * Returns the distributed PN Counter instance with given name.
     */
    getPNCounter(name: string): Promise<PNCounter> {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager.PNCOUNTER_SERVICE) as Promise<PNCounter>;
    }

    /**
     * Returns the CP subsystem that offers a set of in-memory linearizable
     * data structures.
     */
    getCPSubsystem(): CPSubsystem {
        return this.cpSubsystem;
    }

    /**
     * Returns configuration that this instance started with.
     * The returned object should not be modified.
     */
    getConfig(): ClientConfig {
        return this.config;
    }

    /**
     * Returns the Cluster to which this client is connected.
     */
    getCluster(): Cluster {
        return this.clusterService;
    }

    /**
     * Returns the lifecycle service for this client.
     */
    getLifecycleService(): LifecycleService {
        return this.lifecycleService;
    }

    /**
     * Returns the partition service of this client.
     */
    getPartitionService(): PartitionService {
        return this.partitionService;
    }

    /** @internal */
    getSerializationService(): SerializationService {
        return this.serializationService;
    }

    /** @internal */
    getInvocationService(): InvocationService {
        return this.invocationService;
    }

    /** @internal */
    getListenerService(): ListenerService {
        return this.listenerService;
    }

    /** @internal */
    getConnectionManager(): ConnectionManager {
        return this.connectionManager;
    }

    /** @internal */
    getClusterService(): ClusterService {
        return this.clusterService;
    }

    /** @internal */
    getRepairingTask(): RepairingTask {
        if (this.mapRepairingTask == null) {
            this.mapRepairingTask = new RepairingTask(
                this.config.properties,
                this.loggingService.getLogger(),
                this.partitionService,
                this.lifecycleService,
                this.invocationService,
                this.clusterService,
                this.connectionManager.getClientUuid()
            );
        }
        return this.mapRepairingTask;
    }

    /** @internal */
    getLoggingService(): LoggingService {
        return this.loggingService;
    }

    /**
     * Returns a service to execute distributed SQL queries.
     * The service is in beta state. Behavior and API might be changed in future releases.
     *
     * @returns SQL service
     *
     * see {@link SqlService}
     */
    getSql(): SqlService {
        return this.sqlService;
    }

    /**
     * Registers a distributed object listener to cluster.
     * @param listener distributed object listener function.
     * @returns registration id of the listener.
     */
    addDistributedObjectListener(listener: DistributedObjectListener): Promise<string> {
        return this.proxyManager.addDistributedObjectListener(listener);
    }

    /**
     * Removes a distributed object listener from the cluster.
     * @param listenerId id of the listener to be removed.
     * @returns `true` if registration was removed, `false` otherwise.
     */
    removeDistributedObjectListener(listenerId: string): Promise<boolean> {
        return this.proxyManager.removeDistributedObjectListener(listenerId);
    }

    /** @internal */
    getErrorFactory(): ClientErrorFactory {
        return this.errorFactory;
    }

    /**
     * Shuts down this client instance.
     */
    shutdown(): Promise<void> {
        if (!this.lifecycleService.isRunning()) {
            return Promise.resolve();
        }
        this.lifecycleService.onShutdownStart();

        if (this.mapRepairingTask !== undefined) {
            this.mapRepairingTask.shutdown();
        }
        this.nearCacheManager.destroyAllNearCaches();
        this.proxyManager.destroy();
        this.statistics.stop();
        return this.cpSubsystem.shutdown()
            .then(() => {
                this.invocationService.shutdown();
                this.connectionManager.shutdown();
            })
            .then(() => {
                this.lifecycleService.onShutdownFinished();
            });
    }

    /** @internal */
    onClusterRestart(): void {
        this.getLoggingService().getLogger()
            .info('HazelcastClient', 'Clearing local state of the client, because of a cluster restart.');
        this.nearCacheManager.clearAllNearCaches();
        this.clusterService.clearMemberList(this.connectionRegistry);
    }

    /** @internal */
    sendStateToCluster(): Promise<void> {
        return this.proxyManager.createDistributedObjectsOnCluster();
    }

    /** @internal */
    onClusterChange(): void {
        this.getLoggingService().getLogger()
            .info('HazelcastClient', 'Resetting local state of the client, because of a cluster change.');
        // clear near caches
        this.nearCacheManager.clearAllNearCaches();
        // clear the member lists
        this.clusterService.reset();
        // clear partition service
        this.partitionService.reset();
        // close all the connections, consequently waiting invocations get TargetDisconnectedError;
        // non retryable client messages will fail immediately;
        // retryable client messages will be retried, but they will wait for new partition table
        this.connectionManager.reset();
    }

    /** @internal */
    private init(): Promise<HazelcastClient> {
        const logger = this.loggingService.getLogger();
        try {
            this.lifecycleService.start();
            const configuredMembershipListeners = this.config.membershipListeners;
            this.clusterService.start(configuredMembershipListeners);
            this.clusterViewListenerService.start();
        } catch (e) {
            logger.error('HazelcastClient', 'Client failed to start.', e);
            throw e;
        }

        return this.connectionManager.start()
            .then(() => {
                const connectionStrategyConfig = this.config.connectionStrategy;
                if (!connectionStrategyConfig.asyncStart) {
                    return this.clusterService.waitForInitialMemberList()
                        .then(() => this.connectionManager.connectToAllClusterMembers());
                }
            })
            .then(() => {
                this.listenerService.start();
                this.proxyManager.init();
                this.loadBalancer.initLoadBalancer(this.clusterService, this.config);
                this.statistics.start();
                return this.invocationService.start(this.listenerService);
            })
            .then(() => {
                return this.sendStateToCluster();
            })
            .then(() => {
                return this;
            })
            .catch((e) => {
                this.shutdown()
                    .catch((e) => {
                        logger.warn('HazelcastClient', 'Could not shut down after start failure.', e);
                    });
                logger.error('HazelcastClient', 'Client failed to start.', e);
                throw e;
            });
    }

    /** @internal */
    private initLoadBalancer(): LoadBalancer {
        let lb = this.config.loadBalancer.customLoadBalancer;
        if (lb == null) {
            if (this.config.loadBalancer.type === LoadBalancerType.ROUND_ROBIN) {
                lb = new RoundRobinLB();
            } else if (this.config.loadBalancer.type === LoadBalancerType.RANDOM) {
                lb = new RandomLB();
            } else {
                throw new IllegalStateError('Load balancer type ' + this.config.loadBalancer.type
                    + ' is not supported.');
            }
        }
        return lb;
    }

    /** @internal */
    private initClusterFailoverService(): ClusterFailoverService {
        let tryCount: number;
        let clientConfigs: ClientConfigImpl[];
        if (this.failoverConfig == null) {
            tryCount = 0;
            clientConfigs = [this.config];
        } else {
            tryCount = this.failoverConfig.tryCount;
            clientConfigs = this.failoverConfig.clientConfigs;
        }
        const builder = new ClusterFailoverServiceBuilder(
            tryCount, clientConfigs, this.lifecycleService, this.loggingService);
        return builder.build();
    }
}
