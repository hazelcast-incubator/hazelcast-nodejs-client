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

const { expect } = require('chai');
const fs = require('fs');
const Long = require('long');
const RC = require('./../RC');
const {
    Client,
    DistributedObjectDestroyedError
} = require('../../');

describe('AtomicLongProxyTest', function () {

    this.timeout(30000);

    let cluster;
    let client;
    let long;

    function expectLong(expected, long) {
        expect(long.toString()).to.equal(Long.fromValue(expected).toString());
    }

    before(async function () {
        cluster = await RC.createCluster(null, fs.readFileSync(__dirname + '/hazelcast_cpsubsystem.xml', 'utf8'))
        await Promise.all([
            RC.startMember(cluster.id),
            RC.startMember(cluster.id),
            RC.startMember(cluster.id)
        ]);
        client = await Client.newHazelcastClient({ clusterName: cluster.id });
        long = await client.getAtomicLong('along');
    });

    afterEach(async function () {
        // return to default value
        await long.set(0);
    });

    after(async function () {
        client.shutdown();
        return RC.shutdownCluster(cluster.id);
    });

    it('should create AtomicLong with respect to given CP group', async function () {
        const longInAnotherGroup = await client.getAtomicLong('along@mygroup');

        const value1 = await longInAnotherGroup.incrementAndGet();
        expectLong(1, value1);
        // the following value has to be 0,
        // as `long` belongs to the default CP group
        const value2 = await long.get();
        expectLong(0, value2);
    });

    it('destroy: should destroy AtomicLong and throw on operation', async function () {
        const anotherLong = await client.getAtomicLong('another-long-1');
        await anotherLong.destroy();
        // the next destroy call should be ignored
        await anotherLong.destroy();

        try {
            await anotherLong.get();
        } catch (err) {
            expect(err).to.be.instanceOf(DistributedObjectDestroyedError);
        }
    });

    it('destroy: should destroy AtomicLong and throw on getAtomitLong call', async function () {
        const anotherLong = await client.getAtomicLong('another-long-2');
        await anotherLong.destroy();

        try {
            await client.getAtomicLong('another-long-2');
        } catch (err) {
            expect(err).to.be.instanceOf(DistributedObjectDestroyedError);
        }
    });

    it('get: should return 0 initially', async function () {
        const value = await long.get();
        expectLong(0, value);
    });

    it('addAndGet: should return added value', async function () {
        const value = await long.addAndGet(33);
        expectLong(33, value);
    });

    it('addAndGet: should add', async function () {
        await long.addAndGet(33);
        const value = await long.get();
        expectLong(33, value);
    });

    it('getAndAdd: should return old value', async function () {
        const value = await long.getAndAdd(123);
        expectLong(0, value);
    });

    it('getAndAdd: should add', async function () {
        await long.getAndAdd(123);
        const value = await long.get();
        expectLong(123, value);
    });

    it('decrementAndGet: should decrement', async function () {
        const value = await long.decrementAndGet();
        expectLong(-1, value);
    });

    it('compareAndSet: should set the value when condition is met', async function () {
        await long.set(42);
        const result = await long.compareAndSet(42, 13);
        expect(result).to.be.true;
        const value = await long.get();
        expectLong(13, value);
    });

    it('compareAndSet: should have no effect when condition is not met', async function () {
        await long.set(42);
        const result = await long.compareAndSet(13, 13);
        expect(result).to.be.false;
        const value = await long.get();
        expectLong(42, value);
    });

    it('set: should set new value', async function () {
        await long.set(1001);
        const value = await long.get();
        expectLong(1001, value);
    });

    it('getAndSet: should return old value', async function () {
        const value = await long.getAndSet(-123);
        expectLong(0, value);
    });

    it('getAndSet: should set the value', async function () {
        await long.getAndSet(-123);
        const value = await long.get();
        expectLong(-123, value);
    });

    it('incrementAndGet: should increment', async function () {
        const value = await long.incrementAndGet();
        expectLong(1, value);
    });

    it('getAndIncrement: should return old value', async function () {
        const value = await long.getAndIncrement();
        expectLong(0, value);
    });

    it('getAndIncrement: should increment', async function () {
        await long.getAndIncrement();
        const value = await long.get();
        expectLong(1, value);
    });
});
