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

import {Portable, PortableWriter} from '../Portable';
import {ClassDefinition} from './ClassDefinition';
import {PortableContext} from './PortableContext';
import * as Long from 'long';
import {ClassDefinitionBuilder} from './ClassDefinitionBuilder';
import {
    HazelcastSerializationError,
    BigDecimal,
    HzLocalDate,
    HzLocalDateTime,
    HzLocalTime,
    HzOffsetDateTime
} from '../../core';

/** @internal */
export class ClassDefinitionWriter implements PortableWriter {

    private readonly context: PortableContext;
    private builder: ClassDefinitionBuilder;

    constructor(context: PortableContext, builder: ClassDefinitionBuilder) {
        this.context = context;
        this.builder = builder;
    }

    writeInt(fieldName: string, value: number): void {
        this.builder.addIntField(fieldName);
    }

    writeLong(fieldName: string, long: Long): void {
        this.builder.addLongField(fieldName);
    }

    writeString(fieldName: string, str: string): void {
        this.builder.addStringField(fieldName);
    }

    writeUTF(fieldName: string, str: string): void {
        this.writeString(fieldName, str);
    }

    writeBoolean(fieldName: string, value: boolean): void {
        this.builder.addBooleanField(fieldName);
    }

    writeByte(fieldName: string, value: number): void {
        this.builder.addByteField(fieldName);
    }

    writeChar(fieldName: string, char: string): void {
        this.builder.addCharField(fieldName);
    }

    writeDouble(fieldName: string, double: number): void {
        this.builder.addDoubleField(fieldName);
    }

    writeFloat(fieldName: string, float: number): void {
        this.builder.addFloatField(fieldName);
    }

    writeShort(fieldName: string, value: number): void {
        this.builder.addShortField(fieldName);
    }

    writePortable(fieldName: string, portable: Portable): void {
        if (portable == null) {
            throw new HazelcastSerializationError('Cannot write null portable without explicitly '
                + 'registering class definition!');
        }
        const version = this.context.getClassVersion(portable);
        const nestedClassDef = this.createNestedClassDef(portable,
            new ClassDefinitionBuilder(portable.factoryId, portable.classId, version));
        this.builder.addPortableField(fieldName, nestedClassDef);
    }

    writeNullPortable(fieldName: string, factoryId: number, classId: number): void {
        const nestedClassDef = this.context.lookupClassDefinition(factoryId, classId, this.context.getVersion());
        if (nestedClassDef == null) {
            throw new HazelcastSerializationError('Cannot write null portable without explicitly '
                + 'registering class definition!');
        }
        this.builder.addPortableField(fieldName, nestedClassDef);
    }

    writeDecimal(fieldName: string, value: BigDecimal): void {
        this.builder.addDecimalField(fieldName);
    }

    writeTime(fieldName: string, value: HzLocalTime): void {
        this.builder.addTimeField(fieldName);
    }

    writeDate(fieldName: string, value: HzLocalDate): void {
        this.builder.addDateField(fieldName);
    }

    writeTimestamp(fieldName: string, value: HzLocalDateTime): void {
        this.builder.addTimestampField(fieldName);
    }

    writeTimestampWithTimezone(fieldName: string, value: HzOffsetDateTime): void {
        this.builder.addTimestampWithTimezoneField(fieldName);
    }

    writeByteArray(fieldName: string, bytes: Buffer): void {
        this.builder.addByteArrayField(fieldName);
    }

    writeBooleanArray(fieldName: string, booleans: boolean[]): void {
        this.builder.addBooleanArrayField(fieldName);
    }

    writeCharArray(fieldName: string, chars: string[]): void {
        this.builder.addCharArrayField(fieldName);
    }

    writeIntArray(fieldName: string, ints: number[]): void {
        this.builder.addIntArrayField(fieldName);
    }

    writeLongArray(fieldName: string, longs: Long[]): void {
        this.builder.addLongArrayField(fieldName);
    }

    writeDoubleArray(fieldName: string, doubles: number[]): void {
        this.builder.addDoubleArrayField(fieldName);
    }

    writeFloatArray(fieldName: string, floats: number[]): void {
        this.builder.addFloatArrayField(fieldName);
    }

    writeShortArray(fieldName: string, shorts: number[]): void {
        this.builder.addShortArrayField(fieldName);
    }

    writeStringArray(fieldName: string, val: string[]): void {
        this.builder.addStringArrayField(fieldName);
    }

    writeUTFArray(fieldName: string, val: string[]): void {
        this.writeStringArray(fieldName, val);
    }

    writePortableArray(fieldName: string, portables: Portable[]): void {
        if (portables == null || portables.length === 0) {
            throw new HazelcastSerializationError('Cannot write null portable array without explicitly '
                + 'registering class definition!');
        }
        const portable = portables[0];
        const classId = portable.classId;
        for (let i = 1; i < portables.length; i++) {
            if (portables[i].classId !== classId) {
                throw new RangeError('Detected different class-ids in portable array!');
            }
        }

        const version = this.context.getClassVersion(portable);
        const nestedClassDef = this.createNestedClassDef(portable,
            new ClassDefinitionBuilder(portable.factoryId, portable.classId, version));
        this.builder.addPortableArrayField(fieldName, nestedClassDef);
    }

    writeDecimalArray(fieldName: string, values: BigDecimal[]): void {
        this.builder.addDecimalArrayField(fieldName);
    }

    writeTimeArray(fieldName: string, values: HzLocalTime[]): void {
        this.builder.addTimeArrayField(fieldName);
    }

    writeDateArray(fieldName: string, values: HzLocalDate[]): void {
        this.builder.addDateArrayField(fieldName);
    }

    writeTimestampArray(fieldName: string, values: HzLocalDateTime[]): void {
        this.builder.addTimestampArrayField(fieldName);
    }

    writeTimestampWithTimezoneArray(fieldName: string, values: HzOffsetDateTime[]): void {
        this.builder.addTimestampWithTimezoneArrayField(fieldName);
    }

    registerAndGet(): ClassDefinition {
        const cd = this.builder.build();
        return this.context.registerClassDefinition(cd);
    }

    private createNestedClassDef(portable: Portable, nestedBuilder: ClassDefinitionBuilder): ClassDefinition {
        const writer = new ClassDefinitionWriter(this.context, nestedBuilder);
        portable.writePortable(writer);
        return this.context.registerClassDefinition(nestedBuilder.build());
    }
}
