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

var expect = require('chai').expect;
var Long = require('long');
var Config = require('../../.').Config;
var SerializationService = require('../../lib/serialization/SerializationService');
var Predicates = require('../../.').Predicates;
describe('Default serializers Test', function () {

    var serializationService;

    function testObject(obj, serializationService) {
        var serialized = serializationService.toData(obj);
        expect(serializationService.toObject(serialized)).to.deep.equal(obj);
    }

    var parameters = [
        14,
        545.3,
        1 << 63,
        true,
        [true, false, false, true],
        [],
        ['client', 'test'],
        [''],
        '',
        'client',
        '1⚐中💦2😭‍🙆😔5',
        'Iñtërnâtiônàlizætiøn',
        '\u0040\u0041\u01DF\u06A0\u12E0\u{1D306}',
        [12, 56, 54, 12],
        [43546.6, 2343.4, 8988, 4],
        [23545798.6],
        null,
        {abc: 'abc', 'five': 5},
        Predicates.sql('test'),
        Predicates.and(Predicates.truePredicate(), Predicates.truePredicate()),
        Predicates.isBetween('this', 0, 1),
        Predicates.isFalse(),
        Predicates.isEqualTo('this', 10),
        Predicates.greaterThan('this', 10),
        Predicates.greaterEqual('this', 10),
        Predicates.lessThan('this', 10),
        Predicates.lessEqual('this', 10),
        Predicates.like('this', '*'),
        Predicates.ilike('this', '*'),
        Predicates.inPredicate('this', 10, 11, 12),
        Predicates.instanceOf('java.lang.Serializable'),
        Predicates.notEqual('this', 10),
        Predicates.not(Predicates.truePredicate()),
        Predicates.or(Predicates.truePredicate(), Predicates.truePredicate()),
        Predicates.regex('this', '/abc/'),
        Predicates.truePredicate(),
        Predicates.falsePredicate(),
        Predicates.paging(Predicates.greaterEqual('this', 10), 10)
    ];

    parameters.forEach(function (obj) {
        it('type: ' + typeof obj + ', isArray: ' + Array.isArray(obj) + ', value: ' + JSON.stringify(obj), function () {
            var serializationService = new SerializationService.SerializationServiceV1(new Config.ClientConfig().serializationConfig);
            var serialized = serializationService.toData(obj);
            expect(serializationService.toObject(serialized)).to.deep.equal(obj);
        })
    });

    var defaultNumberTypes = [
        'double',
        'short',
        'integer',
        'long',
        'float'
    ];

    defaultNumberTypes.forEach(function (type) {
        it('convert default number type: ' + type, function () {
            if (type === 'long') {
                var num = Long.fromNumber(56);
            } else {
                var num = 56;
            }
            var serializationConfig = new Config.ClientConfig().serializationConfig;
            serializationConfig.defaultNumberType = type;
            var serializationService = new SerializationService.SerializationServiceV1(serializationConfig);
            var serialized = serializationService.toData(num);
            expect(serializationService.toObject(serialized)).to.deep.equal(num);
        })
    });

    defaultNumberTypes.forEach(function (type) {
        it('convert array of default number type: ' + type, function () {
            if (type === 'long') {
                var nums = [Long.fromNumber(56), Long.fromNumber(101)];
            } else {
                var nums = [56, 101];
            }
            var serializationConfig = new Config.ClientConfig().serializationConfig;
            serializationConfig.defaultNumberType = type;
            var serializationService = new SerializationService.SerializationServiceV1(serializationConfig);
            var serialized = serializationService.toData(nums);
            expect(serializationService.toObject(serialized)).to.deep.equal(nums);
        })
    });
});
