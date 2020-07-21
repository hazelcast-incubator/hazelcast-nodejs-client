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
'use strict';

const Controller = require('./RC');
const expect = require('chai').expect;
const HazelcastClient = require('../.').Client;

describe('ClusterService', function () {

    this.timeout(25000);
    let cluster, member1, client;

    beforeEach(function () {
        return Controller.createCluster(null, null).then(function (res) {
            cluster = res;
            return Controller.startMember(cluster.id);
        }).then(function (res) {
            member1 = res;
            return HazelcastClient.newHazelcastClient({
                clusterName: cluster.id,
                properties: {
                    'hazelcast.client.heartbeat.interval': 1000,
                    'hazelcast.client.heartbeat.timeout': 5000
                }
            });
        }).then(function (res) {
            client = res;
        });
    });

    afterEach(function () {
        client.shutdown();
        return Controller.terminateCluster(cluster.id);
    });

    it('should know when a new member joins to cluster', function (done) {
        let member2;

        const membershipListener = {
            memberAdded: (membershipEvent) => {
                expect(client.clusterService.getSize()).to.be.eq(2);
                done();
            }
        };

        client.clusterService.addMembershipListener(membershipListener);

        Controller.startMember(cluster.id).then(function (res) {
            member2 = res;
        });
    });

    it('should know when a member leaves cluster', function (done) {
        let member2;

        const membershipListener = {
            memberRemoved: (membershipEvent) => {
                expect(client.getClusterService().getSize()).to.be.eq(1);
                done();
            }
        };

        client.clusterService.addMembershipListener(membershipListener);

        Controller.startMember(cluster.id).then(function (res) {
            member2 = res;
            Controller.shutdownMember(cluster.id, member2.uuid);
        });
    });

    it('getMemberList returns correct list after a member is removed', function (done) {
        let member2, member3;

        const membershipListener = {
            memberRemoved: (membershipEvent) => {
                const remainingMemberList = client.getClusterService().getMemberList();
                expect(remainingMemberList).to.have.length(2);
                const portList = remainingMemberList.map(function (member) {
                    return member.address.port;
                });
                expect(portList).to.have.members([member1.port, member3.port]);
                done();
            }
        };

        client.clusterService.addMembershipListener(membershipListener);

        Controller.startMember(cluster.id).then(function (res) {
            member2 = res;
            return Controller.startMember(cluster.id);
        }).then(function (res) {
            member3 = res;
            Controller.shutdownMember(cluster.id, member2.uuid);
        });
    });

    it('should throw when wrong host addresses given in config', function (done) {
        let falseStart = false;
        HazelcastClient.newHazelcastClient({
            clusterName: cluster.id,
            network: {
                clusterMembers: [
                    '0.0.0.0:5709',
                    '0.0.0.1:5710'
                ]
            },
            connectionStrategy: {
                connectionRetry: {
                    clusterConnectTimeoutMillis: 2000
                }
            }
        }).catch(function (err) {
            done();
        }).then(function (client) {
            if (client) {
                falseStart = true;
                return client.shutdown();
            }
        }).then(function () {
            if (falseStart) {
                done(Error('Client falsely started with wrong addresses'));
            }
        });
    });

    it('should throw with wrong cluster name', function (done) {
        HazelcastClient.newHazelcastClient({
            clusterName: 'wrong',
            connectionStrategy: {
                connectionRetry: {
                    clusterConnectTimeoutMillis: 2000
                }
            }
        }).then(function (newClient) {
            newClient.shutdown();
            done(new Error('Client falsely started with wrong cluster name'));
        }).catch(function (err) {
            done();
        });
    });
})
;
