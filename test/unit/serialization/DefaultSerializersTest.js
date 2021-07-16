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
const Long = require('long');
const { SerializationServiceV1 } = require('../../../lib/serialization/SerializationService');
const { SerializationConfigImpl } = require('../../../lib/config/SerializationConfig');
const {
    Predicates,
    RestValue,
    UUID,
    LocalDateTime,
    OffsetDateTime,
    LocalTime,
    LocalDate,
    BigDecimal
} = require('../../../');

describe('DefaultSerializersTest', function () {

    const restValue = new RestValue();
    restValue.value = '{"test":"data"}';
    restValue.contentType = 'text/plain';
    const uuid = new UUID(Long.fromNumber(1), Long.fromNumber(2));

    const parameters = [
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
        Buffer.from('abc'),
        [12, 56, 54, 12],
        [43546.6, 2343.4, 8988, 4],
        [23545798.6],
        null,
        {abc: 'abc', 'five': 5},
        [{foo: 'bar'}, {bar: 'baz'}],
        Predicates.sql('test'),
        Predicates.and(Predicates.alwaysTrue(), Predicates.alwaysTrue()),
        Predicates.between('this', 0, 1),
        Predicates.equal('this', 10),
        Predicates.greaterThan('this', 10),
        Predicates.greaterEqual('this', 10),
        Predicates.lessThan('this', 10),
        Predicates.lessEqual('this', 10),
        Predicates.like('this', '*'),
        Predicates.ilike('this', '*'),
        Predicates.inPredicate('this', 10, 11, 12),
        Predicates.instanceOf('java.lang.Serializable'),
        Predicates.notEqual('this', 10),
        Predicates.not(Predicates.alwaysTrue()),
        Predicates.or(Predicates.alwaysTrue(), Predicates.alwaysTrue()),
        Predicates.regex('this', '/abc/'),
        Predicates.alwaysTrue(),
        Predicates.alwaysFalse(),
        Predicates.paging(Predicates.greaterEqual('this', 10), 10),
        restValue,
        uuid,
        new LocalDate(2021, 6, 28),
        new LocalTime(11, 22, 41, 123456789),
        new LocalDateTime(new LocalDate(2022, 7, 29), new LocalTime(12, 23, 42, 123456789)),
        new OffsetDateTime(new LocalDateTime(new LocalDate(2022, 7, 29), new LocalTime(12, 23, 42, 123456789)), -64800),
        new BigDecimal('1.11111111111111111111111111')
    ];

    parameters.forEach((obj) => {
        it('type: ' + typeof obj + ', isArray: ' + Array.isArray(obj) + ', value: '
            + (obj instanceof BigDecimal ? `BigDecimal ${obj.toString()}` : JSON.stringify(obj)), function () {
                const config = new SerializationConfigImpl();
                const serializationService = new SerializationServiceV1(config);
                const serialized = serializationService.toData(obj);
                expect(serializationService.toObject(serialized)).to.deep.equal(obj);
            }
        );
    });

    const defaultNumberTypes = [
        'double',
        'short',
        'integer',
        'long',
        'float',
        'byte'
    ];

    defaultNumberTypes.forEach((type) => {
        it('convert default number type: ' + type, function () {
            let num = 56;
            if (type === 'long') {
                num = Long.fromNumber(56);
            }
            const config = new SerializationConfigImpl();
            config.defaultNumberType = type;
            const serializationService = new SerializationServiceV1(config);
            const serialized = serializationService.toData(num);
            expect(serializationService.toObject(serialized)).to.deep.equal(num);
        });
    });

    defaultNumberTypes.forEach((type) => {
        it('convert array of default number type: ' + type, function () {
            let nums = [56, 101];
            if (type === 'long') {
                nums = [Long.fromNumber(56), Long.fromNumber(101)];
            }
            if (type === 'byte') {
                nums = Buffer.from(nums);
            }
            const config = new SerializationConfigImpl();
            config.defaultNumberType = type;
            const serializationService = new SerializationServiceV1(config);
            const serialized = serializationService.toData(nums);
            expect(serializationService.toObject(serialized)).to.deep.equal(nums);
        });
    });
});
