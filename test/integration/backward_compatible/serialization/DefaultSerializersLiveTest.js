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

const Long = require('long');
const { expect } = require('chai');
const RC = require('../../RC');
const { Lang } = require('../../remote_controller/remote-controller_types');
const { Client, RestValue, UUID } = require('../../../../');
const TestUtil = require('../../../TestUtil');

describe('DefaultSerializersLiveTest', function () {

    let cluster, client;
    let map;

    before(async function () {
        cluster = await RC.createCluster(null, null);
        await RC.startMember(cluster.id);
        client = await Client.newHazelcastClient({ clusterName: cluster.id });
        map = await client.getMap('test');
    });

    after(async function () {
        await client.shutdown();
        return RC.terminateCluster(cluster.id);
    });

    function generateGet(key) {
        return 'var StringArray = Java.type("java.lang.String[]");' +
            'function foo() {' +
            '   var map = instance_0.getMap("' + map.getName() + '");' +
            '   var res = map.get("' + key + '");' +
            '   if (res.getClass().isArray()) {' +
            '       return Java.from(res);' +
            '   } else {' +
            '       return res;' +
            '   }' +
            '}' +
            'result = ""+foo();';
    }

    it('string', async function () {
        await map.put('testStringKey', 'testStringValue');
        const response = await RC.executeOnController(cluster.id, generateGet('testStringKey'), Lang.JAVASCRIPT);
        expect(response.result.toString()).to.equal('testStringValue');
    });

    it('utf8 sample string test', async function () {
        await map.put('key', 'Iñtërnâtiônàlizætiøn');
        const response = await RC.executeOnController(cluster.id, generateGet('key'), Lang.JAVASCRIPT);
        expect(response.result.toString()).to.equal('Iñtërnâtiônàlizætiøn');
    });

    it('number', async function () {
        await map.put('a', 23);
        const response = await RC.executeOnController(cluster.id, generateGet('a'), 1);
        expect(Number.parseInt(response.result.toString())).to.equal(23);
    });

    it('bigint', async function () {
        await map.put('a', 23n);
        expect(await map.get('a')).to.equal(23n);
    });

    it('array', async function () {
        await map.put('a', ['a', 'v', 'vg']);
        const response = await RC.executeOnController(cluster.id, generateGet('a'), Lang.JAVASCRIPT);
        expect(response.result.toString()).to.equal(['a', 'v', 'vg'].toString());
    });

    it('buffer on client', async function () {
        await map.put('foo', Buffer.from('bar'));
        const response = await map.get('foo');
        expect(Buffer.isBuffer(response)).to.be.true;
        expect(response.toString()).to.equal('bar');
    });

    it('emoji string test on client', async function () {
        await map.put('key', '1⚐中💦2😭‍🙆😔5');
        const response = await map.get('key');
        expect(response).to.equal('1⚐中💦2😭‍🙆😔5');
    });

    it('utf8 characters test on client', async function () {
        await map.put('key', '\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}');
        const response = await map.get('key');
        expect(response).to.equal('\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}');
    });

    it('utf8 characters test on client with surrogates', async function () {
        await map.put('key', '\u0040\u0041\u01DF\u06A0\u12E0\uD834\uDF06');
        const response = await map.get('key');
        expect(response).to.equal('\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}');
    });

    it('emoji string test on RC', async function () {
        await map.put('key', '1⚐中💦2😭‍🙆😔5');
        const response = await RC.executeOnController(cluster.id, generateGet('key'), Lang.JAVASCRIPT);
        expect(response.result.toString()).to.equal('1⚐中💦2😭‍🙆😔5');
    });

    it('utf8 characters test on RC', async function () {
        await map.put('key', '\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}');
        const response = await RC.executeOnController(cluster.id, generateGet('key'), Lang.JAVASCRIPT);
        expect(response.result.toString()).to.equal('\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}');
    });

    it('utf8 characters test on RC with surrogates', async function () {
        await map.put('key', '\u0040\u0041\u01DF\u06A0\u12E0\uD834\uDF06');
        const response = await RC.executeOnController(cluster.id, generateGet('key'), Lang.JAVASCRIPT);
        expect(response.result.toString()).to.equal('\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}');
    });

    it('rest value', async function () {
        // Make sure that the object is properly de-serialized at the server
        const restValue = new RestValue();
        restValue.value = '{\'test\':\'data\'}';
        restValue.contentType = 'text/plain';

        const script = 'var map = instance_0.getMap("' + map.getName() + '");\n' +
            'var restValue = map.get("key");\n' +
            'var contentType = restValue.getContentType();\n' +
            'var value = restValue.getValue();\n' +
            'var String = Java.type("java.lang.String");\n' +
            'result = "{\\"contentType\\": \\"" + new String(contentType) + "\\", ' +
            '\\"value\\": \\"" +  new String(value) + "\\"}"\n';

        await map.put('key', restValue);
        const response = await RC.executeOnController(cluster.id, script, Lang.JAVASCRIPT);
        const result = JSON.parse(response.result.toString());
        expect(result.contentType).to.equal(restValue.contentType);
        expect(result.value).to.equal(restValue.value);
    });

    it('UUID', async function () {
        // Make sure that the object is properly de-serialized at the server
        const uuid = new UUID(Long.fromNumber(24), Long.fromNumber(42));

        const script = 'var map = instance_0.getMap("' + map.getName() + '");\n' +
            'var uuid = map.get("key");\n' +
            'result = "\\"" + uuid.toString() + "\\"";\n';

        await map.put('key', uuid);
        const response = await RC.executeOnController(cluster.id, script, Lang.JAVASCRIPT);
        const result = JSON.parse(response.result);
        expect(result).to.equal(uuid.toString());
    });

    it('should deserialize ArrayList', async function () {
        TestUtil.markClientVersionAtLeast(this, '4.2');
        const script = 'var map = instance_0.getMap("' + map.getName() + '");\n' +
            'var list = new java.util.ArrayList();\n' +
            'list.add(1);\n' +
            'list.add(2);\n' +
            'list.add(3);\n' +
            'map.set("key", list);\n';

        await RC.executeOnController(cluster.id, script, Lang.JAVASCRIPT);

        const actualValue = await map.get('key');
        expect(actualValue).to.deep.equal([1, 2, 3]);
    });

    it('should deserialize LinkedList', async function () {
        TestUtil.markClientVersionAtLeast(this, '4.2');
        const script = 'var map = instance_0.getMap("' + map.getName() + '");\n' +
            'var list = new java.util.LinkedList();\n' +
            'list.add(1);\n' +
            'list.add(2);\n' +
            'list.add(3);\n' +
            'map.set("key", list);\n';

        await RC.executeOnController(cluster.id, script, Lang.JAVASCRIPT);

        const actualValue = await map.get('key');
        expect(actualValue).to.deep.equal([1, 2, 3]);
    });
});
