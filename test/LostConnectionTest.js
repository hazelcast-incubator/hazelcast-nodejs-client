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
describe('Lost connection', function () {
    var cluster;
    var member1;
    var client;
    before(function (done) {
        Controller.createCluster(null, null).then(function (res) {
            cluster = res;
            Controller.startMember(cluster.id).then(function (res) {
                member1 = res;
                var cfg = new Config.ClientConfig();
                cfg.properties['hazelcast.client.heartbeat.interval'] = 500;
                cfg.properties['hazelcast.client.heartbeat.timeout'] = 2000;
                return HazelcastClient.newHazelcastClient(cfg);
            }).then(function (res) {
                client = res;
                done();
            }).catch(function (err) {
                done(err);
            });
        }).catch(function (err) {
            done(err);
        });
    });

    after(function () {
        client.shutdown();
        return Controller.shutdownCluster(cluster.id);
    });

    it('M2 starts, M1 goes down, client sets M2 as owner', function (done) {
        this.timeout(12000);
        var newMember;
        client.clusterService.on('memberAdded', function () {
            Controller.shutdownMember(cluster.id, member1.uuid).then(function () {
                setTimeout(function () {
                    try {
                        expect(client.clusterService.getOwnerConnection().address.host).to.be.eq(newMember.host);
                        expect(client.clusterService.getOwnerConnection().address.port).to.be.eq(newMember.port);
                        done();
                    } catch (e) {
                        done(e);
                    }
                }, 2500)
            });
        });
        Controller.startMember(cluster.id).then(function (m) {
            newMember = m;
        });
    });
});
