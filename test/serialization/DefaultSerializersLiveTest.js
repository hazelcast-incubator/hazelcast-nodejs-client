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

var Client = require('../../.').Client;
var Config = require('../../.').Config;
var RC = require('../RC');
var expect = require('chai').expect;
var RestValue = require('../../lib/core/RestValue').RestValue;

describe('Default serializers with live instance', function () {
    var cluster;
    var client;
    var map;

    before(function () {
        return RC.createCluster(null, null).then(function (res) {
            cluster = res;
        }).then(function () {
            return RC.startMember(cluster.id);
        }).then(function () {
            var config = new Config.ClientConfig();
            config.clusterName = cluster.id;
            return Client.newHazelcastClient(config);
        }).then(function (cl) {
            client = cl;
            return client.getMap('test').then(function (mp) {
                map = mp;
            });
        });
    });

    after(function () {
        client.shutdown();
        return RC.shutdownCluster(cluster.id);
    });

    function _generateGet(key) {
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
            'result = ""+foo();'
    }

    it('string', function () {
        return map.put('testStringKey', 'testStringValue').then(function () {
            return RC.executeOnController(cluster.id, _generateGet('testStringKey'), 1);
        }).then(function (response) {
            return expect(response.result.toString()).to.equal('testStringValue');
        })
    });

    it('utf8 sample string test', function () {
        return map.put('key', 'Iñtërnâtiônàlizætiøn').then(function () {
            return RC.executeOnController(cluster.id, _generateGet('key'), 1);
        }).then(function (response) {
            return expect(response.result.toString()).to.equal('Iñtërnâtiônàlizætiøn');
        });
    });

    it('number', function () {
        return map.put('a', 23).then(function () {
            return RC.executeOnController(cluster.id, _generateGet('a'), 1);
        }).then(function (response) {
            return expect(Number.parseInt(response.result.toString())).to.equal(23);
        })
    });

    it('array', function () {
        return map.put('a', ['a', 'v', 'vg']).then(function () {
            return RC.executeOnController(cluster.id, _generateGet('a'), 1);
        }).then(function (response) {
            return expect(response.result.toString()).to.equal(['a', 'v', 'vg'].toString());
        })
    });

    it('emoji string test on client', function () {
        return map.put('key', '1⚐中💦2😭‍🙆😔5').then(function () {
            return map.get('key');
        }).then(function (response) {
            return expect(response).to.equal('1⚐中💦2😭‍🙆😔5');
        });
    });

    it('utf8 characters test on client', function () {
        return map.put('key', '\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}').then(function () {
            return map.get('key');
        }).then(function (response) {
            return expect(response).to.equal('\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}');
        });
    });

    it('utf8 characters test on client with surrogates', function () {
        return map.put('key', '\u0040\u0041\u01DF\u06A0\u12E0\uD834\uDF06').then(function () {
            return map.get('key');
        }).then(function (response) {
            return expect(response).to.equal('\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}');
        });
    });

    it('emoji string test on RC', function () {
        return map.put('key', '1⚐中💦2😭‍🙆😔5').then(function () {
            return RC.executeOnController(cluster.id, _generateGet('key'), 1);
        }).then(function (response) {
            return expect(response.result.toString()).to.equal('1⚐中💦2😭‍🙆😔5');
        });
    });

    it('utf8 characters test on RC', function () {
        return map.put('key', '\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}').then(function () {
            return RC.executeOnController(cluster.id, _generateGet('key'), 1);
        }).then(function (response) {
            return expect(response.result.toString()).to.equal('\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}');
        });
    });

    it('utf8 characters test on RC with surrogates', function () {
        return map.put('key', '\u0040\u0041\u01DF\u06A0\u12E0\uD834\uDF06').then(function () {
            return RC.executeOnController(cluster.id, _generateGet('key'), 1);
        }).then(function (response) {
            return expect(response.result.toString()).to.equal('\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}');
        });
    });

    it('rest value', function () {
        // Making sure that the object is properly de-serialized at the server
        var restValue = new RestValue();
        restValue.value = '{\'test\':\'data\'}';
        restValue.contentType = 'text/plain';

        var script = 'var map = instance_0.getMap("' + map.getName() + '");\n' +
            'var restValue = map.get("key");\n' +
            'var contentType = restValue.getContentType();\n' +
            'var value = restValue.getValue();\n' +
            'var String = Java.type("java.lang.String");\n' +
            'result = "{\\"contentType\\": \\"" + new String(contentType) + "\\", ' +
            '\\"value\\": \\"" +  new String(value) + "\\"}"\n';

        return map.put('key', restValue)
            .then(function () {
                return RC.executeOnController(cluster.id, script, 1);
            })
            .then(function (response) {
                var result = JSON.parse(response.result.toString());
                expect(result.contentType).to.equal(restValue.contentType);
                expect(result.value).to.equal(restValue.value);
            });
    });
});
