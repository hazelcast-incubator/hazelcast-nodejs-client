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
/** @ignore *//** */

import {ClassDefinition, FieldDefinition} from './ClassDefinition';
import {FieldType} from '../Portable';
import {HazelcastSerializationError} from '../../core';

/** @internal */
export class ClassDefinitionBuilder {
    private readonly factoryId: number;
    private readonly classId: number;
    private readonly version: number;

    private fieldDefinitions: FieldDefinition[] = [];

    private index = 0;
    private done: boolean;

    constructor(factoryId: number, classId: number, version = 0) {
        this.factoryId = factoryId;
        this.classId = classId;
        this.version = version;
    }

    getFactoryId(): number {
        return this.factoryId;
    }

    getClassId(): number {
        return this.classId;
    }

    getVersion(): number {
        return this.version;
    }

    addByteField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.BYTE, this.version));
    }

    addBooleanField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.BOOLEAN, this.version));
    }

    addCharField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.CHAR, this.version));
    }

    addShortField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.SHORT, this.version));
    }

    addIntField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.INT, this.version));
    }

    addLongField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.LONG, this.version));
    }

    addFloatField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.FLOAT, this.version));
    }

    addDoubleField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.DOUBLE, this.version));
    }

    addStringField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.STRING, this.version));
    }

    addUTFField(fieldName: string): ClassDefinitionBuilder {
        return this.addStringField(fieldName);
    }

    addPortableField(fieldName: string, def: ClassDefinition): ClassDefinitionBuilder {
        if (def.getClassId() === 0) {
            throw new RangeError('Portable class ID cannot be zero!');
        }

        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.PORTABLE, def.getVersion(),
            def.getFactoryId(), def.getClassId()));
    }

    addDecimalField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.DECIMAL, this.version));
    }

    addTimeField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.TIME, this.version));
    }

    addDateField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.DATE, this.version));
    }

    addTimestampField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.TIMESTAMP, this.version));
    }

    addTimestampWithTimezoneField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.TIMESTAMP_WITH_TIMEZONE, this.version));
    }

    addByteArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.BYTE_ARRAY, this.version));
    }

    addBooleanArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.BOOLEAN_ARRAY, this.version));
    }

    addCharArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.CHAR_ARRAY, this.version));
    }

    addShortArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.SHORT_ARRAY, this.version));
    }

    addIntArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.INT_ARRAY, this.version));
    }

    addLongArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.LONG_ARRAY, this.version));
    }

    addFloatArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.FLOAT_ARRAY, this.version));
    }

    addDoubleArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.DOUBLE_ARRAY, this.version));
    }

    addStringArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.STRING_ARRAY, this.version));
    }

    addUTFArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addStringArrayField(fieldName);
    }

    addPortableArrayField(fieldName: string, def: ClassDefinition): ClassDefinitionBuilder {
        if (def.getClassId() === 0) {
            throw new RangeError('Portable class ID cannot be zero!');
        }

        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.PORTABLE_ARRAY, def.getVersion(),
            def.getFactoryId(), def.getClassId()));
    }

    addDecimalArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.DECIMAL_ARRAY, this.version));
    }

    addTimeArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.TIME_ARRAY, this.version));
    }

    addDateArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.DATE_ARRAY, this.version));
    }

    addTimestampArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.TIMESTAMP_ARRAY, this.version));
    }

    addTimestampWithTimezoneArrayField(fieldName: string): ClassDefinitionBuilder {
        return this.addField(new FieldDefinition(this.index, fieldName, FieldType.TIMESTAMP_WITH_TIMEZONE_ARRAY, this.version));
    }

    addField(fieldDefinition: FieldDefinition): ClassDefinitionBuilder {
        if (this.done) {
            throw new HazelcastSerializationError(`ClassDefinition is already built for ${this.classId}`);
        }

        if (this.index !== fieldDefinition.getIndex()) {
            throw new RangeError('Invalid field index');
        }

        this.fieldDefinitions.push(fieldDefinition);
        this.index++;
        return this;
    }

    build(): ClassDefinition {
        this.done = true;
        const cd = new ClassDefinition(this.factoryId, this.classId, this.version);
        for (const fd of this.fieldDefinitions) {
            cd.addFieldDefinition(fd);
        }
        return cd;
    }

}
