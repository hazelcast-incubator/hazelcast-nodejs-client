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

var Controller = require('./RC');
var expect = require('chai').expect;
var HazelcastClient = require('../.').Client;
var Config = require('../.').Config;
var Util = require('./Util');
var Promise = require('bluebird');

describe('Listeners on reconnect', function () {

    this.timeout(120000);
    var client;
    var members = [];
    var cluster;

    beforeEach(function () {
        return Controller.createCluster(null, null).then(function (cl) {
            cluster = cl;
        });
    });

    afterEach(function () {
        this.timeout(30000);
        client.shutdown();
        return Controller.shutdownCluster(cluster.id);
    });

    [true, false].forEach(function (isSmart) {

        function closeTwoMembersOfThreeAndTestListener(done, membersToClose, turnoffMember) {
            var map;
            Controller.startMember(cluster.id).then(function (m) {
                members[0] = m;
                return Controller.startMember(cluster.id);
            }).then(function (m) {
                members[1] = m;
                return Controller.startMember(cluster.id);
            }).then(function (m) {
                members[2] = m;
                var cfg = new Config.ClientConfig();
                cfg.properties['hazelcast.client.heartbeat.interval'] = 1000;
                cfg.properties['hazelcast.client.heartbeat.timeout'] = 3000;
                cfg.networkConfig.smartRouting = isSmart;
                return HazelcastClient.newHazelcastClient(cfg);
            }).then(function (cl) {
                client = cl;
                map = client.getMap('testmap');
                var listenerObject = {
                    added: function (key, oldValue, value, mergingValue) {
                        try {
                            expect(key).to.equal('keyx');
                            expect(oldValue).to.be.undefined;
                            expect(value).to.equal('valx');
                            expect(mergingValue).to.be.undefined;
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }
                };
                return map.addEntryListener(listenerObject, 'keyx', true);
            }).then(function () {
                return Promise.all([
                    turnoffMember(cluster.id, members[membersToClose[0]].uuid),
                    turnoffMember(cluster.id, members[membersToClose[1]].uuid)
                ]);
            }).then(function () {
                map.put('keyx', 'valx');
            });
        }

        /**
         * We use three members to simulate all configurations where connection is closed to;
         *  - ownerconnection
         *  - connection that has the local listener that will react to map.put event
         *  - the other unrelated connection
         */

        it('kill two members [1,2], listener still receives map.put event [smart=' + isSmart + ']', function (done) {
            closeTwoMembersOfThreeAndTestListener(done, [1, 2], Controller.terminateMember);
        });

        it('kill two members [0,1], listener still receives map.put event [smart=' + isSmart + ']', function (done) {
            closeTwoMembersOfThreeAndTestListener(done, [0, 1], Controller.terminateMember);
        });

        it('kill two members [0,2], listener still receives map.put event [smart=' + isSmart + ']', function (done) {
            closeTwoMembersOfThreeAndTestListener(done, [0, 2], Controller.terminateMember);
        });

        it('shutdown two members [1,2], listener still receives map.put event [smart=' + isSmart + ']', function (done) {
            closeTwoMembersOfThreeAndTestListener(done, [1, 2], Controller.shutdownMember);
        });

        it('shutdown two members [0,1], listener still receives map.put event [smart=' + isSmart + ']', function (done) {
            closeTwoMembersOfThreeAndTestListener(done, [0, 1], Controller.shutdownMember);
        });

        it('shutdown two members [0,2], listener still receives map.put event [smart=' + isSmart + ']', function (done) {
            closeTwoMembersOfThreeAndTestListener(done, [0, 2], Controller.shutdownMember);
        });

        it('restart member, listener still receives map.put event [smart=' + isSmart + ']', function (done) {
            this.timeout(7000);
            var map;
            var member;
            Controller.startMember(cluster.id).then(function (m) {
                member = m;
                var cfg = new Config.ClientConfig();
                cfg.networkConfig.smartRouting = isSmart;
                cfg.properties['hazelcast.client.heartbeat.interval'] = 1000;
                return HazelcastClient.newHazelcastClient(cfg);
            }).then(function (cl) {
                client = cl;
                map = client.getMap('testmap');
                var listenerObject = {
                    added: function (key, oldValue, value, mergingValue) {
                        try {
                            expect(key).to.equal('keyx');
                            expect(oldValue).to.be.undefined;
                            expect(value).to.equal('valx');
                            expect(mergingValue).to.be.undefined;
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }
                };
                return map.addEntryListener(listenerObject, 'keyx', true);
            }).then(function () {
                return Controller.terminateMember(cluster.id, member.uuid);
            }).then(function () {
                return Controller.startMember(cluster.id);
            }).then(function () {
                return map.put('keyx', 'valx');
            });
        });
    });


});
