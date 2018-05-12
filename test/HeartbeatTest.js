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

var RC = require('./RC');
var HazelcastClient = require('../.').Client;
var expect = require('chai').expect;
var Config = require('../.').Config;
var Util = require('./Util');
var Address = require('../.').Address;

describe('Heartbeat', function () {
    this.timeout(30000);

    var cluster;

    beforeEach(function () {
        return RC.createCluster(null, null).then(function (resp) {
            cluster = resp;
        });
    });

    afterEach(function () {
        return RC.shutdownCluster(cluster.id);
    });

    it('Heartbeat stopped fired when second member stops heartbeating', function (done) {
        var client;
        RC.startMember(cluster.id).then(function () {
            var cfg = new Config.ClientConfig();
            cfg.properties['hazelcast.client.heartbeat.interval'] = 500;
            cfg.properties['hazelcast.client.heartbeat.timeout'] = 2000;
            return HazelcastClient.newHazelcastClient(cfg);
        }).then(function (resp) {
            client = resp;
        }).then(function () {
            client.clusterService.on('memberAdded', function (member) {
                var address = new Address(member.address.host, member.address.port);
                warmUpConnectionToAddressWithRetry(client, address);
            });
            client.heartbeat.addListener({
                onHeartbeatStopped: function (connection) {
                    client.shutdown();
                    done();
                }
            })
        }).then(function () {
            return RC.startMember(cluster.id);
        }).then(function (member2) {
            simulateHeartbeatLost(client, member2.host + ':' + member2.port, 2000);
        }).catch(done);
    });

    it('Heartbeat restored fired when second member comes back', function (done) {
        var client;
        var member1;
        var member2;
        RC.startMember(cluster.id).then(function (m) {
            member1 = m;
            var cfg = new Config.ClientConfig();
            cfg.properties['hazelcast.client.heartbeat.interval'] = 500;
            cfg.properties['hazelcast.client.heartbeat.timeout'] = 2000;
            return HazelcastClient.newHazelcastClient(cfg);
        }).then(function (resp) {
            client = resp;
            client.clusterService.on('memberAdded', function (member) {
                warmUpConnectionToAddressWithRetry(client, member.address, 3).then(function () {
                    simulateHeartbeatLost(client, member.address, 2000);
                }).catch(done);
            });
            client.heartbeat.addListener({
                onHeartbeatRestored: function (connection) {
                    client.shutdown();
                    done();
                }
            });
            return RC.startMember(cluster.id);
        }).then(function (resp) {
            member2 = resp;
        }).catch(done);
    });

    it('emits shutdown when lost connection to cluster', function (done) {
        var member;
        RC.startMember(cluster.id).then(function (m) {
            member = m;
            var cfg = new Config.ClientConfig();
            cfg.properties['hazelcast.client.heartbeat.interval'] = 500;
            cfg.properties['hazelcast.client.heartbeat.timeout'] = 2000;
            return HazelcastClient.newHazelcastClient(cfg);
        }).then(function (client) {
            var expected = 'shuttingDown';
            client.lifecycleService.on('lifecycleEvent', function (state) {
                if (state === 'shuttingDown' && expected === 'shuttingDown') {
                    expected = 'shutdown';
                } else if (state === 'shutdown' && expected === 'shutdown') {
                    done();
                } else {
                    done('Expected ' + expected + '. Got ' + state);
                }
            });
            RC.terminateMember(cluster.id, member.uuid);
        });
    });

    function simulateHeartbeatLost(client, address, timeout) {
        client.connectionManager.establishedConnections[address].lastRead = client.connectionManager.establishedConnections[address].lastRead - timeout;
    }

    function warmUpConnectionToAddressWithRetry(client, address, retryCount) {
        return client.connectionManager.getOrConnect(address).then(function (conn) {
            if (conn != null) {
                return conn;
            } else if (conn == null && retryCount > 0) {
                return Util.promiseWaitMilliseconds(300).then(function () {
                    return warmUpConnectionToAddressWithRetry(client, address, retryCount - 1);
                });
            } else {
                throw new Error('Could not warm up connection to ' + address);
            }
        });
    }
});
