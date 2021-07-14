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
const { SerializationConfigImpl } = require('../../../lib/config/SerializationConfig');
const {
    HazelcastSerializationError,
    HzLocalDate,
    HzLocalDateTime,
    HzLocalTime,
    HzOffsetDateTime,
    Big
} = require('../../../lib/core');
const { SerializationServiceV1 } = require('../../../lib/serialization/SerializationService');
const {
    PortableObject,
    PortableObjectV2,
    InnerPortable,
    SimplePortableV3,
    SameFieldNamePortable
} = require('./PortableObjects');
const TestUtil = require('../../TestUtil');
const chai = require('chai');

chai.should();

describe('PortableSerializationTest', function () {

    function createSerializationService(Ctor) {
        const cfg = new SerializationConfigImpl();
        cfg.portableFactories[10] = (classId) => {
            if (classId === 111) {
                return new Ctor({});
            } else if (classId === 222) {
                return new InnerPortable();
            } else if (classId === 21) {
                return new SimplePortableV3();
            } else if (classId === 1) {
                return new SameFieldNamePortable();
            }
        };
        return new SerializationServiceV1(cfg);
    }

    const createNewPortableObject = () => {
        return new PortableObject(
            {
                a_byte: 99,
                a_boolean: true,
                a_character: 'a',
                a_short: 23,
                an_integer: 54375456,
                a_long: Long.fromBits(243534, 43543654),
                a_float: 24.1,
                a_double: 32435.6533,
                a_string: 'hazelcast',
                a_portable: new InnerPortable('a', 'b'),
                a_decimal: Big('1.111111111111111111'),
                a_time: new HzLocalTime(1, 2, 3, 4),
                a_date: new HzLocalDate(1, 2, 3),
                a_timestamp: new HzLocalDateTime(new HzLocalDate(1, 2, 3), new HzLocalTime(4, 5, 6, 7)),
                a_timestamp_with_timezone:
                    new HzOffsetDateTime(new HzLocalDateTime(new HzLocalDate(1, 2, 3), new HzLocalTime(4, 5, 6, 7)), 8),
                bytes: Buffer.from([0x99, 0x100, 0x101]),
                booleans: [true, false, false, true],
                chars: ['a', 'b', 'v'],
                shorts: [12, 545, 23, 6],
                integers: [325, 6547656, 345],
                longs: [Long.fromNumber(342534654), Long.fromNumber(-3215243654), Long.fromNumber(123123)],
                floats: [233.2, 65.88, 657.345],
                doubles: [43645.325, 887.56756],
                strings: ['hazelcast', 'ankara', 'istanbul', 'london', 'palo alto'],
                portables: [new InnerPortable('elma', 'armut'), new InnerPortable('masa', 'sandalye')],
                decimals: [Big('1.111111111111111111'), Big('2.222222222222222222222')],
                times: [new HzLocalTime(1, 2, 3, 4), new HzLocalTime(2, 3, 4, 5)],
                dates: [new HzLocalDate(1, 2, 3), new HzLocalDate(2, 3, 4)],
                timestamps: [
                    new HzLocalDateTime(new HzLocalDate(1, 2, 3), new HzLocalTime(4, 5, 6, 7)),
                    new HzLocalDateTime(new HzLocalDate(2, 3, 4), new HzLocalTime(5, 6, 7, 8))
                ],
                timestamp_with_timezones: [
                    new HzOffsetDateTime(new HzLocalDateTime(new HzLocalDate(1, 2, 3), new HzLocalTime(4, 5, 6, 7)), 8),
                    new HzOffsetDateTime(new HzLocalDateTime(new HzLocalDate(2, 3, 4), new HzLocalTime(5, 6, 7, 8)), 9)
                ]
            }
        );
    };
    const createNewPortableObjectV2 = (newValue) => {
        return new PortableObjectV2({
            a_new_prop: newValue,
            a_byte: 99,
            a_boolean: true,
            a_character: 'a',
            a_short: 23,
            an_integer: 54375456,
            a_long: Long.fromBits(243534, 43543654),
            a_float: 24.1,
            a_double: 32435.6533,
            a_portable: new InnerPortable('a', 'b'),
            a_decimal: Big('1.111111111111111111'),
            a_time: new HzLocalTime(1, 2, 3, 4),
            a_date: new HzLocalDate(1, 2, 3),
            a_timestamp: new HzLocalDateTime(new HzLocalDate(1, 2, 3), new HzLocalTime(4, 5, 6, 7)),
            a_timestamp_with_timezone:
                new HzOffsetDateTime(new HzLocalDateTime(new HzLocalDate(1, 2, 3), new HzLocalTime(4, 5, 6, 7)), 8),
            bytes: Buffer.from([0x99, 0x100, 0x101]),
            booleans: [true, false, false, true],
            chars: ['a', 'b', 'v'],
            shorts: [12, 545, 23, 6],
            integers: [325, 6547656, 345],
            longs: [Long.fromNumber(342534654), Long.fromNumber(-3215243654), Long.fromNumber(123123)],
            floats: [233.2, 65.88, 657.345],
            doubles: [43645.325, 887.56756],
            strings: ['hazelcast', 'ankara', 'istanbul', 'london', 'palo alto'],
            portables: [new InnerPortable('elma', 'armut'), new InnerPortable('masa', 'sandalye')],
            decimals: [Big('1.111111111111111111'), Big('2.222222222222222222222')],
            times: [new HzLocalTime(1, 2, 3, 4), new HzLocalTime(2, 3, 4, 5)],
            dates: [new HzLocalDate(1, 2, 3), new HzLocalDate(2, 3, 4)],
            timestamps: [
                new HzLocalDateTime(new HzLocalDate(1, 2, 3), new HzLocalTime(4, 5, 6, 7)),
                new HzLocalDateTime(new HzLocalDate(2, 3, 4), new HzLocalTime(5, 6, 7, 8))
            ],
            timestamp_with_timezones: [
                new HzOffsetDateTime(new HzLocalDateTime(new HzLocalDate(1, 2, 3), new HzLocalTime(4, 5, 6, 7)), 8),
                new HzOffsetDateTime(new HzLocalDateTime(new HzLocalDate(2, 3, 4), new HzLocalTime(5, 6, 7, 8)), 9)
            ]
        });
    };

    it('write-read', function () {
        const service = createSerializationService(PortableObject);
        const emp = createNewPortableObject();

        const serialized = service.toData(emp);
        const deserialized = service.toObject(serialized);

        TestUtil.expectAlmostEqual(deserialized, emp);
    });

    it('write-read v2', function () {
        const service = createSerializationService(PortableObjectV2);

        const emp = createNewPortableObjectV2('a_new_value');

        const serialized = service.toData(emp);
        const deserialized = service.toObject(serialized);

        TestUtil.expectAlmostEqual(deserialized, emp);
    });

    it('old write - new read cross versions', function () {
        const oldService = createSerializationService(PortableObject);
        const newService = createSerializationService(PortableObjectV2);

        const empv1 = createNewPortableObject();
        const empv2 = createNewPortableObjectV2(undefined);

        const serialized = oldService.toData(empv1);
        const deserialized = newService.toObject(serialized);

        TestUtil.expectAlmostEqual(deserialized, empv2);
    });

    it('v3 portable containing a v2 inner portable', function () {
        const service = createSerializationService(PortableObjectV2);

        const innerPortableV2 = createNewPortableObjectV2('propstring');

        const portableV3 = new SimplePortableV3(innerPortableV2);
        const serialized = service.toData(portableV3);
        const deserialized = service.toObject(serialized);

        TestUtil.expectAlmostEqual(deserialized, portableV3);
    });

    it('should throw when same field name is used again', function () {
        const service = createSerializationService(PortableObject);
        const emp = new SameFieldNamePortable('Name', 'Surname');

        (() => service.toData(emp)).should.throw(HazelcastSerializationError);
    });
});
