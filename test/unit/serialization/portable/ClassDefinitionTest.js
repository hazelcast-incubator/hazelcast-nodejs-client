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

const { expect, should } = require('chai');
const { ClassDefinition, FieldDefinition } = require('../../../../lib/serialization/portable/ClassDefinition');

should();

describe('ClassDefinitionTest', function () {

    let cd;
    beforeEach(function () {
        cd = new ClassDefinition(1, 2, 3);
    });

    it('getFieldNames(): should work', function () {
        cd.addFieldDefinition(new FieldDefinition(0, 'firstField', FieldDefinition.INT, 10, 10));
        cd.addFieldDefinition(new FieldDefinition(1, 'secondField', FieldDefinition.CHAR_ARRAY, 11, 11));
        const fieldNames = cd.getFieldNames();
        Array.isArray(fieldNames).should.be.true;
        fieldNames.length.should.be.eq(2);
        fieldNames.should.include('firstField');
        fieldNames.should.include('secondField');
    });

    it('getFieldType():firstField should be type of FD.INT.', function () {
        cd.addFieldDefinition(new FieldDefinition(0, 'firstField', FieldDefinition.INT, 10, 10));
        const type = cd.getFieldType('firstField');
        expect(type).equal(FieldDefinition.INT);
    });

    it('getFieldType():secondField should be type of FD.STRING.', function () {
        cd.addFieldDefinition(new FieldDefinition(1, 'secondField', FieldDefinition.CHAR_ARRAY, 11, 11));
        const type = cd.getFieldType('secondField');
        expect(type).equal(FieldDefinition.CHAR_ARRAY);
    });

    it('getFieldType():thirdField should be null because we will not add it. (It does not exist.)', function () {
        expect(cd.getFieldType.bind(cd, 'thirdField')).to.throw(RangeError);
    });

    it('hasField():field was added so it should be return true.', function () {
        cd.addFieldDefinition(new FieldDefinition(2, 'aField', FieldDefinition.INT, 10, 10));
        expect(cd.hasField('aField')).to.be.true;
    });

    it('hasField():field was not added so it should be return false.', function () {
        const res = cd.hasField('anotherField');
        expect(res).to.be.false;
    });

    it('getFieldById():When index is not an integer it should throw an range exception.', function () {
        expect(cd.getFieldById.bind(cd, 0.3)).to.throw(RangeError);
    });

    it('getFieldById():When index is negative it should throw an range exception.', function () {
        expect(cd.getFieldById.bind(cd, -2)).to.throw(RangeError);
    });

    it('getFieldById():When a field with given index is found.', function () {
        cd.addFieldDefinition(new FieldDefinition(0, 'firstField', FieldDefinition.INT, 10, 10));
        expect(cd.getFieldById.bind(cd, 0)).to.not.throw(RangeError);
    });

    it('getFieldById():When index is more than or equal to total number of fields it should throw an range exception.',
        function () {
            expect(cd.getFieldById.bind(cd, 3)).to.throw(RangeError);
        }
    );

    it('equals():When parameter passed is not a ClassDefinitionObject.', function () {
        const a1 = new ClassDefinition();
        const b1 = new FieldDefinition();
        const res = a1.equals(b1);
        expect(res).to.equal(false);
    });

    it('equals():When one of the fields (or more) is not matched with the parameter.', function () {
        const a1 = new ClassDefinition(1, 3, 4);
        const b1 = new ClassDefinition(1, 3, 6);
        const res = a1.equals(b1);
        expect(res).to.equal(false);
    });

    it('equals():When parameter is equal.', function () {
        const a1 = new ClassDefinition(1, 3, 6);
        const b1 = new ClassDefinition(1, 3, 6);
        const res = a1.equals(b1);
        expect(res).to.equal(true);
    });
});
