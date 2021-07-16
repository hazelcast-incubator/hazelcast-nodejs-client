/* eslint-disable mocha/no-skipped-tests */
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

const RC = require('../../RC');
const TestUtil = require('../../../TestUtil');
const { Client } = require('../../../../');

const chai = require('chai');

chai.should();

describe('Jet Test', function () {
    let client;
    let cluster;
    let map;
    let map2;

    const mapName = 'a';
    const mapName2 = 'b';
    const jetEnabledConfig = `<?xml version="1.0" encoding="UTF-8"?>
        <hazelcast xmlns="http://www.hazelcast.com/schema/config"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.hazelcast.com/schema/config
            http://www.hazelcast.com/schema/config/hazelcast-config-4.0.xsd">
            <jet enabled="true"></jet>
        </hazelcast>`;

    before(async function () {
        TestUtil.markClientVersionAtLeast(this, '5.0');
        TestUtil.markServerVersionAtLeast(this, client, '5.0');
    });

    beforeEach(async function () {
        map = undefined;
        map2 = undefined;
        cluster = await RC.createCluster(null, jetEnabledConfig);
        await RC.startMember(cluster.id);
        client = await Client.newHazelcastClient({
            clusterName: cluster.id
        });
    });

    afterEach(async function () {
        if (map) {
            await map.destroy();
        }
        if (map2) {
            await map2.destroy();
        }
        await client.shutdown();
        await RC.terminateCluster(cluster.id);
    });

    it('should be able to run a generate_series query', async function () {
        const result = client.getSql().execute('SELECT * FROM TABLE(generate_series(1,3))');
        let counter = 0;
        // eslint-disable-next-line no-unused-vars
        for await (const row of result) {
            counter++;
        }
        counter.should.be.eq(3);
    });

    it('should be able to run an infinite query', async function () {
        const result = client.getSql().execute('SELECT * FROM TABLE(generate_stream(500))');
        let counter = 0;

        // eslint-disable-next-line no-unused-vars
        for await (const row of result) {
            counter++;
            if (counter > 500) {
                break;
            }
        }
    });

    it('should be able to run join query', async function () {
        map = await client.getMap(mapName);
        map2 = await client.getMap(mapName2);

        const result = client.getSql().execute(`
            CREATE MAPPING ${mapName} (__key DOUBLE, age INTEGER, name VARCHAR) TYPE IMap OPTIONS (
              'keyFormat'='double',
              'valueFormat'='json')
        `);

        await result.executeDeferred.promise; // wait for execution to end

        const result2 = client.getSql().execute(`
            CREATE MAPPING ${mapName2} (__key DOUBLE, name VARCHAR, height DOUBLE) TYPE IMap OPTIONS (
              'keyFormat'='double',
              'valueFormat'='json')
        `);

        await result2.executeDeferred.promise; // wait for execution to end

        await map.set(1, {
            age: 11,
            name: 'a'
        });

        await map.set(2, {
            age: 12,
            name: 'b'
        });

        await map2.set(1, {
            name: 'a',
            height: 111.11
        });

        const result3 = client.getSql().execute(`
                SELECT ${mapName}.__key, ${mapName}.age, ${mapName}.name, ${mapName2}.height
                FROM ${mapName}
                JOIN ${mapName2} ON ${mapName}.name = ${mapName2}.name
        `);

        const rows = [];

        for await (const row of result3) {
            rows.push(row);
        }
        rows.length.should.be.eq(1);
        rows[0].should.deep.eq({
            __key: 1,
            age: 11,
            height: 111.11,
            name: 'a'
        });
    });

    it('should be able to run create mapping and insert into query', async function () {
        map = await client.getMap(mapName);

        const result = client.getSql().execute(`
            CREATE MAPPING ${mapName} (__key DOUBLE, this DOUBLE) TYPE IMap OPTIONS (
              'keyFormat'='double',
              'valueFormat'='double')
        `);

        await result.executeDeferred.promise; // wait for execution to end

        const result2 = client.getSql().execute(`INSERT INTO ${mapName} VALUES (1, 2)`);

        await result2.executeDeferred.promise; // wait for execution to end

        (await map.get(1)).should.be.eq(2);
    });

    it('should be able to run aggregate methods', async function () {
        const mapName = 'a';
        const map = await client.getMap(mapName);

        await map.set(1, 2);
        await map.set(2, 3);
        await map.set(3, 4);

        const result = client.getSql().execute(`SELECT COUNT(*) FROM ${mapName}`);

        const rowMetadata = await result.getRowMetadata();
        const columnName = rowMetadata.getColumn(0).name;
        for await (const row of result) {
            row[columnName].toNumber().should.be.eq(3); // count always returns BIGINT
        }

        const result2 = client.getSql().execute(`SELECT SUM(this) FROM ${mapName}`);

        const rowMetadata2 = await result2.getRowMetadata();
        const columnName2 = rowMetadata2.getColumn(0).name;
        for await (const row of result2) {
            row[columnName2].should.be.eq(9); // doubles added, so sum returns DOUBLE
        }

        const result3 = client.getSql().execute(`SELECT MAX(this) FROM ${mapName}`);

        const rowMetadata3 = await result3.getRowMetadata();
        const columnName3 = rowMetadata3.getColumn(0).name;
        for await (const row of result3) {
            row[columnName3].should.be.eq(4); // doubles added, so max returns DOUBLE
        }
        await map.destroy();
    });
});
