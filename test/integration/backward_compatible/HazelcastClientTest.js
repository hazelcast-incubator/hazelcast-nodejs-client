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
'use strict';

const { expect } = require('chai');
const RC = require('../RC');
const { Client } = require('../../../');
const { deferredPromise } = require('../../../lib/util/Util');
const TestUtil = require('../../TestUtil');

class ManagedObjects {

    constructor() {
        this.managedObjects = [];
    }

    getObject(func, name) {
        return func(name).then((obj) => {
            this.managedObjects.push(obj);
            return obj;
        });
    }

    async destroyAll() {
        const promises = [];
        this.managedObjects.forEach((obj) => {
            promises.push(obj.destroy());
        });
        return Promise.all(promises);
    }

    destroy(name) {
        const deferred = deferredPromise();
        this.managedObjects.filter((el) => {
            if (el.getName() === name) {
                el.destroy().then(() => {
                    deferred.resolve();
                });
            }
        });
        return deferred.promise;
    }

}

const dummyConfig = {
    network: {
        smartRouting: false
    }
};

const smartConfig = {
    network: {
        smartRouting: true
    }
};

const configParams = [
    dummyConfig,
    smartConfig
];

configParams.forEach((cfg) => {
    describe('HazelcastClientTest[smart=' + cfg.network.smartRouting + ']', function () {

        let cluster;
        let client;
        let managed;

        before(async function () {
            cluster = await RC.createCluster(null, null);
            await RC.startMember(cluster.id);
            cfg.clusterName = cluster.id;
            client = await Client.newHazelcastClient(cfg);
        });

        beforeEach(function () {
            managed = new ManagedObjects();
        });

        afterEach(async function () {
            await managed.destroyAll();
        });

        after(async function () {
            await client.shutdown();
            await RC.terminateCluster(cluster.id);
        });

        it('getDistributedObject returns array with one element when there is no distributed object', async function () {
            const distributedObjects = await client.getDistributedObjects();
            expect(distributedObjects).to.be.an('array');
            expect(distributedObjects).to.have.lengthOf(0);
        });

        it('getLocalEndpoint returns correct info', function () {
            const info = client.getLocalEndpoint();
            const localAddress = TestUtil.getRandomConnection(client).localAddress;
            expect(info.localAddress.host).to.equal(localAddress.host);
            expect(info.localAddress.port).to.equal(localAddress.port);
            expect(info.uuid).to.deep.equal(client.getConnectionManager().getClientUuid());
            expect(info.type).to.equal('NodeJS');
            expect(info.labels).to.deep.equal(new Set());
        });

        it('getDistributedObjects returns all dist objects', function () {
            managed.getObject(client.getMap.bind(client, 'map'));
            managed.getObject(client.getSet.bind(client, 'set'));
            return TestUtil.assertTrueEventually(async () => {
                const distObjects = await client.getDistributedObjects();
                const names = distObjects.map((o) => {
                    return o.getName();
                });
                expect(names).to.include.members(['map', 'set']);
            }, 100, 5000);
        });

        it('getDistributedObjects does not return removed object', function () {
            managed.getObject(client.getMap.bind(client, 'map1'));
            managed.getObject(client.getMap.bind(client, 'map2'));
            managed.getObject(client.getMap.bind(client, 'map3'));

            return TestUtil.assertTrueEventually(async () => {
                await managed.destroy('map1');
                const distObjects = await client.getDistributedObjects();
                const names = distObjects.map(o => {
                    return o.getName();
                });
                expect(names).to.include.members(['map2', 'map3']);
            }, 100, 5000);
        });
    });
});
