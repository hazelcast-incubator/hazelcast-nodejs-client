import ClientConnection = require('./ClientConnection');
import ClientMessage = require('../ClientMessage');
import Long = require('long');
import Address = require('../Address');
import ExceptionCodec = require('../codec/ExceptionCodec');
import * as Promise from 'bluebird';
import {BitsUtil} from '../BitsUtil';
import {LoggingService} from '../logging/LoggingService';
import {EventEmitter} from 'events';
import HazelcastClient from '../HazelcastClient';
import {ClientEventRegistration} from './ClientEventRegistration';
import {RegistrationKey} from './RegistrationKey';
import {Member} from '../core/Member';
import {HazelcastError} from '../HazelcastError';
import {ConnectionHeartbeatListener} from '../core/ConnectionHeartbeatListener';
import {UuidUtil} from '../util/UuidUtil';
import {copyObjectShallow} from '../Util';

var EXCEPTION_MESSAGE_TYPE = 109;
const MAX_FAST_INVOCATION_COUNT = 5;
const PROPERTY_INVOCATION_RETRY_PAUSE_MILLIS = 'hazelcast.client.invocation.retry.pause.millis';
const PROPERTY_INVOCATION_TIMEOUT_MILLIS = 'hazelcast.client.invocation.timeout.millis';

/**
 * A request to be sent to a hazelcast node.
 */
export class Invocation {

    constructor(client: HazelcastClient, request: ClientMessage) {
        this.client = client;
        this.invocationService = client.getInvocationService();
        this.deadline = new Date(new Date().getTime() + this.invocationService.getInvocationTimeoutMillis());
        this.request = request;
    }

    client: HazelcastClient;

    invocationService: InvocationService;

    /**
     * Representatiton of the request in binary form.
     */
    request: ClientMessage;
    /**
     * Partition id of the request. If request is not bound to a specific partition, should be set to -1.
     */
    partitionId: number;
    /**
     * Address of the request. If request is not bound to any specific address, should be set to null.
     */
    address: Address;
    /**
     * Deadline of validity. Client will not try to send this request to server after the deadline passes.
     */
    deadline: Date;
    /**
     * Connection of the request. If request is not bound to any specific address, should be set to null.
     */
    connection: ClientConnection;

    /**
     * Promise managing object.
     */
    deferred: Promise.Resolver<ClientMessage>;

    invokeCount: number = 0;

    /**
     * If this is an event listener registration, handler should be set to the function to be called on events.
     * Otherwise, should be set to null.
     */
    handler: (...args: any[]) => any;

    /**
     * @returns {boolean}
     */
    hasPartitionId(): boolean {
        return this.hasOwnProperty('partitionId') && this.partitionId >= 0;
    }
}

/**
 * Sends requests to appropriate nodes. Resolves waiting promises with responses.
 */
export class InvocationService {
    private correlationCounter = 1;
    private eventHandlers: {[id: number]: Invocation} = {};
    private pending: {[id: number]: Invocation} = {};
    private client: HazelcastClient;
    private smartRoutingEnabled: boolean;
    private readonly invocationRetryPauseMillis: number;
    private readonly invocationTimeoutMillis: number;
    private logger = LoggingService.getLoggingService();
    private isShutdown: boolean;

    doInvoke: (invocation: Invocation) => void;

    constructor(hazelcastClient: HazelcastClient) {
        this.client = hazelcastClient;
        this.smartRoutingEnabled = hazelcastClient.getConfig().networkConfig.smartRouting;
        if (hazelcastClient.getConfig().networkConfig.smartRouting) {
            this.doInvoke = this.invokeSmart;
        } else {
            this.doInvoke = this.invokeNonSmart;
        }
        this.invocationRetryPauseMillis = this.client.getConfig().properties[PROPERTY_INVOCATION_RETRY_PAUSE_MILLIS];
        this.invocationTimeoutMillis = this.client.getConfig().properties[PROPERTY_INVOCATION_TIMEOUT_MILLIS];
        this.isShutdown = false;
    }

    shutdown(): void {
        this.isShutdown = true;
    }

    invoke(invocation: Invocation): Promise<ClientMessage> {
        var newCorrelationId = Long.fromNumber(this.correlationCounter++);
        invocation.deferred = Promise.defer<ClientMessage>();
        invocation.request.setCorrelationId(newCorrelationId);
        this.doInvoke(invocation);
        return invocation.deferred.promise;
    }

    /**
     * Invokes given invocation on specified connection.
     * @param connection
     * @param request
     * @param handler called with values returned from server for this invocation.
     * @returns
     */
    invokeOnConnection(connection: ClientConnection, request: ClientMessage,
                       handler?: (...args: any[]) => any): Promise<ClientMessage> {
        var invocation = new Invocation(this.client, request);
        invocation.connection = connection;
        if (handler) {
            invocation.handler = handler;
        }
        return this.invoke(invocation);
    }

    /**
     * Invokes given invocation on the node that owns given partition.
     * @param request
     * @param partitionId
     * @returns
     */
    invokeOnPartition(request: ClientMessage, partitionId: number): Promise<ClientMessage> {
        var invocation = new Invocation(this.client, request);
        invocation.partitionId = partitionId;
        return this.invoke(invocation);
    }

    /**
     * Invokes given invocation on the host with given address.
     * @param request
     * @param target
     * @returns
     */
    invokeOnTarget(request: ClientMessage, target: Address): Promise<ClientMessage> {
        var invocation = new Invocation(this.client, request);
        invocation.address = target;
        return this.invoke(invocation);
    }

    /**
     * Invokes given invocation on any host.
     * Useful when an operation is not bound to any host but a generic operation.
     * @param request
     * @returns
     */
    invokeOnRandomTarget(request: ClientMessage): Promise<ClientMessage> {
        return this.invoke(new Invocation(this.client, request));
    }

    getInvocationTimeoutMillis(): number {
        return this.invocationTimeoutMillis;
    }

    getInvocationRetryPauseMillis(): number {
        return this.invocationRetryPauseMillis;
    }

    private invokeSmart(invocation: Invocation): void {
        if (this.isShutdown) {
            return;
        }
        try {
            invocation.invokeCount++;
            if (invocation.hasOwnProperty('connection')) {
                this.send(invocation, invocation.connection);
            } else if (invocation.hasPartitionId()) {
                this.invokeOnPartitionOwner(invocation, invocation.partitionId);
            } else if (invocation.hasOwnProperty('address')) {
                this.invokeOnAddress(invocation, invocation.address);
            } else {
                this.send(invocation, this.client.getClusterService().getOwnerConnection());
            }
        } catch (e) {
            this.notifyError(invocation, e);
        }
    }

    private invokeNonSmart(invocation: Invocation): void {
        if (this.isShutdown) {
            return;
        }
        try {
            invocation.invokeCount++;
            if (invocation.hasOwnProperty('connection')) {
                this.send(invocation, invocation.connection);
            } else {
                this.send(invocation, this.client.getClusterService().getOwnerConnection());
            }
        } catch (e) {
            this.notifyError(invocation, e);
        }
    }

    private invokeOnAddress(invocation: Invocation, address: Address): void {
        this.client.getConnectionManager().getOrConnect(address).then((connection: ClientConnection) => {
            if (connection == null) {
                this.notifyError(invocation, new Error(address.toString() + ' is not available.'));
                return;
            }
            this.send(invocation, connection);
        });
    }

    private invokeOnPartitionOwner(invocation: Invocation, partitionId: number): void {
        var ownerAddress = this.client.getPartitionService().getAddressForPartition(partitionId);
        this.client.getConnectionManager().getOrConnect(ownerAddress).then((connection: ClientConnection) => {
            if (connection == null) {
                this.notifyError(invocation, new Error(ownerAddress.toString() + '(partition owner) is not available.'));
                return;
            }
            this.send(invocation, connection);
        });
    }

    private send(invocation: Invocation, connection: ClientConnection): void {
        this.registerInvocation(invocation);
        this.write(invocation, connection);
    }

    private write(invocation: Invocation, connection: ClientConnection): void {
        connection.write(invocation.request.getBuffer(), (err: any) => {
            if (err) {
                this.notifyError(invocation, err);
            }
        });
    }

    private notifyError(invocation: Invocation, error: Error) {
        var correlationId = invocation.request.getCorrelationId().toNumber();
        if (this.isRetryable(invocation)) {
            this.logger.debug('InvocationService',
                'Retrying(' + invocation.invokeCount + ') on correlation-id=' + correlationId, error);
            if (invocation.invokeCount < MAX_FAST_INVOCATION_COUNT) {
                this.doInvoke(invocation);
            } else {
                setTimeout(this.doInvoke.bind(this, invocation), this.getInvocationRetryPauseMillis());
            }
        } else {
            this.logger.warn('InvocationService', 'Sending message ' + correlationId + 'failed');
            delete this.pending[invocation.request.getCorrelationId().toNumber()];
            invocation.deferred.reject(error);
        }
    }

    private isRetryable(invocation: Invocation) {
        if (invocation.connection != null || invocation.address != null) {
            return false;
        }
        if (invocation.deadline.getTime() < Date.now()) {
            this.logger.debug('InvocationService', 'Invocation ' + invocation.request.getCorrelationId() + ')' +
                ' reached its deadline.');
            return false;
        }
        return true;
    }

    private registerInvocation(invocation: Invocation) {
        var message = invocation.request;
        var correlationId = message.getCorrelationId().toNumber();
        if (invocation.hasPartitionId()) {
            message.setPartitionId(invocation.partitionId);
        } else {
            message.setPartitionId(-1);
        }
        if (invocation.hasOwnProperty('handler')) {
            this.eventHandlers[correlationId] = invocation;
        }
        this.pending[correlationId] = invocation;
    }

    /**
     * Removes the handler for all event handlers with a specific correlation id.
     * @param id correlation id
     */
    removeEventHandler(id: number): void {
        if (this.eventHandlers.hasOwnProperty('' + id)) {
            delete this.eventHandlers[id];
        }
    }

    /**
     * Extract codec specific properties in a protocol message and resolves waiting promise.
     * @param buffer
     */
    processResponse(buffer: Buffer): void {
        var clientMessage = new ClientMessage(buffer);
        var correlationId = clientMessage.getCorrelationId().toNumber();
        var messageType = clientMessage.getMessageType();

        if (clientMessage.hasFlags(BitsUtil.LISTENER_FLAG)) {
            setImmediate(() => {
                if (this.eventHandlers[correlationId] !== undefined) {
                    this.eventHandlers[correlationId].handler(clientMessage);
                }
            });
            return;
        }

        var invocationFinished = true;
        var pendingInvocation = this.pending[correlationId];
        var deferred = pendingInvocation.deferred;
        if (messageType === EXCEPTION_MESSAGE_TYPE) {
            var remoteException = ExceptionCodec.decodeResponse(clientMessage);
            var boundToConnection = pendingInvocation.connection;
            var deadlineExceeded = new Date().getTime() > pendingInvocation.deadline.getTime();
            var shouldRetry = !boundToConnection && !deadlineExceeded && remoteException.isRetryable();

            if (shouldRetry) {
                invocationFinished = false;
                setTimeout(() => {
                    this.invoke(pendingInvocation);
                }, this.getInvocationRetryPauseMillis());
            } else {
                this.logger.trace('InvocationService', 'Received exception as response', remoteException);
                deferred.reject(remoteException);
            }
        } else {
            deferred.resolve(clientMessage);
        }

        if (invocationFinished) {
            delete this.pending[correlationId];
        }
    }
}

/**
 * Handles registration and de-registration of cluster-wide events listeners.
 */
export class ListenerService implements ConnectionHeartbeatListener {
    private client: HazelcastClient;
    private internalEventEmitter: EventEmitter;
    private logger = LoggingService.getLoggingService();
    private isShutdown: boolean;
    private isSmartService: boolean;

    private activeRegistrations: Map<string, Map<ClientConnection, ClientEventRegistration>>;
    private failedRegistrations: Map<ClientConnection, Set<string>>;
    private userRegistrationKeyInformation: Map<string, RegistrationKey>;
    private connectionRefreshTask: any;
    private connectionRefreshTaskInterval: number;

    constructor(client: HazelcastClient) {
        this.isShutdown = false;
        this.client = client;
        this.isSmartService = this.client.getConfig().networkConfig.smartRouting;
        this.internalEventEmitter = new EventEmitter();
        this.internalEventEmitter.setMaxListeners(0);
        this.activeRegistrations = new Map();
        this.failedRegistrations = new Map();
        this.userRegistrationKeyInformation = new Map();
        this.connectionRefreshTaskInterval = 2000;
    }

    start() {
        this.client.getConnectionManager().on('connectionOpened', this.onConnectionAdded.bind(this));
        this.client.getConnectionManager().on('connectionClosed', this.onConnectionRemoved.bind(this));
        this.connectionRefreshTask = this.connectionRefreshHandler();
    }

    protected connectionRefreshHandler(): void {
        if (this.isShutdown) {
            return;
        }
        this.trySyncConnectToAllConnections().finally(() => {
            this.connectionRefreshTask =
                setTimeout(this.connectionRefreshHandler.bind(this), this.connectionRefreshTaskInterval);
        });
    }

    onConnectionAdded(connection: ClientConnection) {
        this.reregisterListenersOnConnection(connection);

    }

    onConnectionRemoved(connection: ClientConnection) {
        this.removeRegistrationsOnConnection(connection);
    }

    onHeartbeatRestored(connection: ClientConnection): void {
        var failedRegistrationsOnConn: Set<string> = this.failedRegistrations.get(connection);
        failedRegistrationsOnConn.forEach((userKey: string, ignored: string) => {
            this.invokeRegistrationFromRecord(userKey, connection);
        });
    }

    reregisterListeners() {
        var connections = this.client.getConnectionManager().getActiveConnections();
        for (var connAddress in connections) {
            this.reregisterListenersOnConnection(connections[connAddress]);
        }
    }

    reregisterListenersOnConnection(connection: ClientConnection) {
        this.activeRegistrations.forEach((registrationMap: Map<ClientConnection, ClientEventRegistration>, userKey: string) => {
            if (registrationMap.has(connection)) {
                return;
            }
            this.invokeRegistrationFromRecord(userKey, connection).then((eventRegistration: ClientEventRegistration) => {
                registrationMap.set(connection, eventRegistration);
            }).catch((e) => {
                this.logger.warn('ListenerService', e);
            });
        }, this);
    }

    removeRegistrationsOnConnection(connection: ClientConnection) {
        this.failedRegistrations.delete(connection);
        this.activeRegistrations.forEach((registrationsOnUserKey: Map<ClientConnection, ClientEventRegistration>,
                                          userKey: string) => {
            var eventRegistration: ClientEventRegistration = registrationsOnUserKey.get(connection);
            if (eventRegistration !== undefined) {
                this.client.getInvocationService().removeEventHandler(eventRegistration.correlationId.toNumber());
            }
        });
    }

    invokeRegistrationFromRecord(userRegistrationKey: string, connection: ClientConnection): Promise<ClientEventRegistration> {
        let deferred = Promise.defer<ClientEventRegistration>();
        let activeRegsOnUserKey = this.activeRegistrations.get(userRegistrationKey);
        if (activeRegsOnUserKey !== undefined && activeRegsOnUserKey.has(connection)) {
            deferred.resolve(activeRegsOnUserKey.get(connection));
            return deferred.promise;
        }
        let registrationKey = this.userRegistrationKeyInformation.get(userRegistrationKey);
        let encoder = registrationKey.getEncoder();
        let decoder = registrationKey.getDecoder();
        let invocation = new Invocation(this.client, encoder(this.isSmart()));
        invocation.handler = <any>registrationKey.getHandler();
        invocation.connection = connection;
        this.client.getInvocationService().invoke(invocation).then((responseMessage) => {
            var correlationId = responseMessage.getCorrelationId();
            var response = decoder(responseMessage);
            var eventRegistration = new ClientEventRegistration(response.response, correlationId, invocation.connection);
            this.logger.debug('ListenerService',
                'Listener ' + userRegistrationKey + ' re-registered on ' + connection.address.toString());

            deferred.resolve(eventRegistration);
        }).catch((e => {
            var failedRegsOnConnection = this.failedRegistrations.get(connection);
            if (failedRegsOnConnection === undefined) {
                failedRegsOnConnection = new Set<string>();
                failedRegsOnConnection.add(userRegistrationKey);
                this.failedRegistrations.set(connection, failedRegsOnConnection);
            } else {
                failedRegsOnConnection.add(userRegistrationKey);
            }
            deferred.reject(new HazelcastError('Could not add listener[' + userRegistrationKey +
                '] to connection[' + connection.toString() + ']', e));
        }));
        return deferred.promise;
    }

    registerListener(encodeFunc: any, handler: any, decoder: any): Promise<string> {
        return this.trySyncConnectToAllConnections().then(() => {
            return this.registerListenerInternal(encodeFunc, handler, decoder);
        });
    }

    protected registerListenerInternal(encodeFunc: any, handler: any, decoder: any): Promise<string> {
        let activeConnections = copyObjectShallow(this.client.getConnectionManager().getActiveConnections());
        let userRegistrationKey: string = UuidUtil.generate();
        let connectionsOnUserKey: Map<ClientConnection, ClientEventRegistration>;
        let deferred = Promise.defer<string>();
        connectionsOnUserKey = this.activeRegistrations.get(userRegistrationKey);
        if (connectionsOnUserKey === undefined) {
            connectionsOnUserKey = new Map();
            this.activeRegistrations.set(userRegistrationKey, connectionsOnUserKey);
            this.userRegistrationKeyInformation.set(userRegistrationKey,
                new RegistrationKey(userRegistrationKey, encodeFunc, decoder, handler));
        }
        for (let address in activeConnections) {
            if (connectionsOnUserKey.has(activeConnections[address])) {
                continue;
            }
            let invocation = new Invocation(this.client, encodeFunc(this.isSmart()));
            invocation.handler = handler;
            invocation.connection = activeConnections[address];
            this.client.getInvocationService().invoke(invocation).then((responseMessage) => {
                let correlationId = responseMessage.getCorrelationId();
                let response = decoder(responseMessage);
                let clientEventRegistration = new ClientEventRegistration(response.response,
                    correlationId, invocation.connection);
                this.logger.debug('ListenerService',
                    'Listener ' + userRegistrationKey + ' registered on ' + invocation.connection.address.toString());
                connectionsOnUserKey.set(activeConnections[address], clientEventRegistration);
            }).then(() => {
                deferred.resolve(userRegistrationKey);
            }).catch((e) => {
                let err = new HazelcastError('Listener registration failed on ' + address.toString() + '\n' +
                    e + e.stack);
                this.logger.warn('ListenerService', err.toString());
            });
        }
        return deferred.promise;
    }

    deregisterListener(encodeFunc: any, decodeFunc: any, userRegistrationKey: string): Promise<boolean> {
        let deferred = Promise.defer<boolean>();
        let registrationsOnUserKey = this.activeRegistrations.get(userRegistrationKey);
        if (registrationsOnUserKey === undefined) {
            deferred.resolve(false);
            return deferred.promise;
        }
        registrationsOnUserKey.forEach((eventRegistration: ClientEventRegistration, connection: ClientConnection) => {
            let invocation = new Invocation(this.client, encodeFunc(eventRegistration.serverRegistrationId));
            invocation.connection = eventRegistration.subscriber;
            this.client.getInvocationService().invoke(invocation).then((responseMessage) => {
                registrationsOnUserKey.delete(connection);
                this.client.getInvocationService().removeEventHandler(eventRegistration.correlationId.low);
                this.logger.debug('ListenerService',
                    'Listener ' + userRegistrationKey + ' unregistered from ' + invocation.connection.address.toString());

                var response = decodeFunc(responseMessage);
                deferred.resolve(response.response);
            }).then(() => {
                this.activeRegistrations.delete(userRegistrationKey);
                this.userRegistrationKeyInformation.delete(userRegistrationKey);
            });
        });

        return deferred.promise;
    }

    private trySyncConnectToAllConnections(): Promise<void> {
        if (this.isSmart()) {
            var members = this.client.getClusterService().getMembers();
            var promises: Promise<ClientConnection>[] = [];
            members.forEach((member: Member) => {
                promises.push(this.client.getConnectionManager().getOrConnect(member.address));
            });
            return Promise.all(promises).thenReturn();
        } else {
            let owner = this.client.getClusterService().getOwnerConnection();
            return this.client.getConnectionManager().getOrConnect(owner.address).thenReturn();
        }
    }

    isSmart(): boolean {
        return this.isSmartService;
    }

    shutdown(): void {
        this.isShutdown = true;
        clearTimeout(this.connectionRefreshTask);
    }
}
