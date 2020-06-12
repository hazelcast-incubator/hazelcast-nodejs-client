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

var Controller = require('../RC');
var Client = require('../../').Client;
var Config = require('../../.').Config;
var Aggregators = require('../../').Aggregators;
var Predicates = require('../../').Predicates;
var Long = require('long');
var expect = require('chai').expect;

describe('MapAggregatorsLongTest', function () {
    var cluster;
    var client;
    var map;
    var entryCount = 50;

    before(function () {
        return Controller.createCluster(null, null).then(function (cl) {
            cluster = cl;
            return Controller.startMember(cluster.id);
        }).then(function () {
            const cfg = new Config.ClientConfig();
            cfg.clusterName = cluster.id;
            cfg.serializationConfig.defaultNumberType = 'long';
            return Client.newHazelcastClient(cfg);
        }).then(function (cl) {
            client = cl;
            return client.getMap('aggregatorsMap');
        }).then(function (mp) {
            map = mp;
        });
    });

    after(function () {
        client.shutdown();
        return Controller.terminateCluster(cluster.id);
    });

    beforeEach(function () {
        var entries = [];
        for (var i = 0; i < entryCount; i++) {
            entries.push(['key' + i, Long.fromNumber(i)]);
        }
        return map.putAll(entries);
    });

    afterEach(function () {
        return map.destroy();
    });

    it('longAvg', function () {
        return map.aggregate(Aggregators.longAvg()).then(function (avg) {
            return expect(avg).to.equal(24.5);
        });
    });

    it('longAvg with attribute path', function () {
        return map.aggregate(Aggregators.longAvg('this')).then(function (avg) {
            return expect(avg).to.equal(24.5);
        });
    });

    it('longAvg with predicate', function () {
        return map.aggregateWithPredicate(Aggregators.longAvg(), Predicates.greaterEqual('this', Long.fromNumber(47))).then(function (avg) {
            return expect(avg).to.equal(48);
        });
    });

    it('longSum', function () {
        return map.aggregate(Aggregators.longSum()).then(function (sum) {
            return expect(sum.toNumber()).to.equal(1225);
        });
    });

    it('longSum with attribute path', function () {
        return map.aggregate(Aggregators.longSum('this')).then(function (sum) {
            return expect(sum.toNumber()).to.equal(1225);
        });
    });

    it('longSum with predicate', function () {
        return map.aggregateWithPredicate(Aggregators.longSum(), Predicates.greaterEqual('this', Long.fromNumber(47))).then(function (sum) {
            return expect(sum.toNumber()).to.equal(144);
        });
    });
});
