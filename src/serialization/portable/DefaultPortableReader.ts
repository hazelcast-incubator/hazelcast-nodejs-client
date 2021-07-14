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

import * as Long from 'long';
import {BitsUtil} from '../../util/BitsUtil';
import {IOUtil} from '../../util/IOUtil';
import {
    BigDecimal,
    HzLocalDate,
    HzLocalDateTime,
    HzLocalTime,
    HzOffsetDateTime,
    HazelcastSerializationError
} from '../../core';
import {DataInput} from '../Data';
import {FieldType, Portable, PortableReader} from '../Portable';
import {ClassDefinition, FieldDefinition} from './ClassDefinition';
import {PortableSerializer} from './PortableSerializer';
import {PortableUtil} from '../../util/PortableUtil';

/** @internal */
export class DefaultPortableReader implements PortableReader {

    protected serializer: PortableSerializer;
    protected input: DataInput;
    protected classDefinition: ClassDefinition;

    private offset: number;
    private finalPos: number;
    private raw = false;

    constructor(serializer: PortableSerializer, input: DataInput, classDefinition: ClassDefinition) {
        this.serializer = serializer;
        this.input = input;
        this.classDefinition = classDefinition;
        this.initFinalPositionAndOffset();
    }

    getVersion(): number {
        return this.classDefinition.getVersion();
    }

    hasField(fieldName: string): boolean {
        return this.classDefinition.hasField(fieldName);
    }

    getFieldNames(): string[] {
        return this.classDefinition.getFieldNames();
    }

    getFieldType(fieldName: string): FieldType {
        return this.classDefinition.getFieldType(fieldName);
    }

    readInt(fieldName: string): number {
        const pos = this.positionByField(fieldName, FieldType.INT);
        return this.input.readInt(pos);
    }

    readLong(fieldName: string): Long {
        const pos = this.positionByField(fieldName, FieldType.LONG);
        return this.input.readLong(pos);
    }

    readUTF(fieldName: string): string | null {
        return this.readString(fieldName);
    }

    readString(fieldName: string): string | null {
        const pos = this.positionByField(fieldName, FieldType.STRING);
        return this.input.readString(pos);
    }

    readBoolean(fieldName: string): boolean {
        const pos = this.positionByField(fieldName, FieldType.BOOLEAN);
        return this.input.readBoolean(pos);
    }

    readByte(fieldName: string): number {
        const pos = this.positionByField(fieldName, FieldType.BYTE);
        return this.input.readByte(pos);
    }

    readChar(fieldName: string): string {
        const pos = this.positionByField(fieldName, FieldType.CHAR);
        return this.input.readChar(pos);
    }

    readDouble(fieldName: string): number {
        const pos = this.positionByField(fieldName, FieldType.DOUBLE);
        return this.input.readDouble(pos);
    }

    readFloat(fieldName: string): number {
        const pos = this.positionByField(fieldName, FieldType.FLOAT);
        return this.input.readFloat(pos);
    }

    readShort(fieldName: string): number {
        const pos = this.positionByField(fieldName, FieldType.SHORT);
        return this.input.readShort(pos);
    }

    readPortable(fieldName: string): Portable | null {
        const backupPos = this.input.position();
        try {
            const pos = this.positionByField(fieldName, FieldType.PORTABLE);
            this.input.position(pos);
            const isNull = this.input.readBoolean();
            const factoryId = this.input.readInt();
            const classId = this.input.readInt();
            if (isNull) {
                return null;
            } else {
                return this.serializer.readObject(this.input, factoryId, classId);
            }
        } finally {
            this.input.position(backupPos);
        }
    }

    readDecimal(fieldName: string): BigDecimal | null {
        return this.readNullableField(fieldName, FieldType.DECIMAL, IOUtil.readDecimal);
    }

    readTime(fieldName: string): HzLocalTime | null {
        return this.readNullableField(fieldName, FieldType.TIME, IOUtil.readHzLocalTime);
    }

    readDate(fieldName: string): HzLocalDate | null {
        return this.readNullableField(fieldName, FieldType.DATE, PortableUtil.readHzLocalDateForPortable);
    }

    readTimestamp(fieldName: string): HzLocalDateTime | null {
        return this.readNullableField(fieldName, FieldType.TIMESTAMP, PortableUtil.readHzLocalDatetimeForPortable);
    }

    readTimestampWithTimezone(fieldName: string): HzOffsetDateTime | null {
        return this.readNullableField(fieldName, FieldType.TIMESTAMP_WITH_TIMEZONE, PortableUtil.readHzOffsetDatetimeForPortable);
    }

    readByteArray(fieldName: string): Buffer | null {
        const pos = this.positionByField(fieldName, FieldType.BYTE_ARRAY);
        if (DefaultPortableReader.isNullOrEmpty(pos)) {
            return null;
        }
        return this.input.readByteArray(pos);
    }

    readBooleanArray(fieldName: string): boolean[] | null {
        const pos = this.positionByField(fieldName, FieldType.BOOLEAN_ARRAY);
        if (DefaultPortableReader.isNullOrEmpty(pos)) {
            return null;
        }
        return this.input.readBooleanArray(pos);
    }

    readCharArray(fieldName: string): string[] | null {
        const pos = this.positionByField(fieldName, FieldType.CHAR_ARRAY);
        if (DefaultPortableReader.isNullOrEmpty(pos)) {
            return null;
        }
        return this.input.readCharArray(pos);
    }

    readIntArray(fieldName: string): number[] | null {
        const pos = this.positionByField(fieldName, FieldType.INT_ARRAY);
        if (DefaultPortableReader.isNullOrEmpty(pos)) {
            return null;
        }
        return this.input.readIntArray(pos);
    }

    readLongArray(fieldName: string): Long[] | null {
        const pos = this.positionByField(fieldName, FieldType.LONG_ARRAY);
        if (DefaultPortableReader.isNullOrEmpty(pos)) {
            return null;
        }
        return this.input.readLongArray(pos);
    }

    readDoubleArray(fieldName: string): number[] | null {
        const pos = this.positionByField(fieldName, FieldType.DOUBLE_ARRAY);
        if (DefaultPortableReader.isNullOrEmpty(pos)) {
            return null;
        }
        return this.input.readDoubleArray(pos);
    }

    readFloatArray(fieldName: string): number[] | null {
        const pos = this.positionByField(fieldName, FieldType.FLOAT_ARRAY);
        if (DefaultPortableReader.isNullOrEmpty(pos)) {
            return null;
        }
        return this.input.readFloatArray(pos);
    }

    readShortArray(fieldName: string): number[] | null {
        const pos = this.positionByField(fieldName, FieldType.SHORT_ARRAY);
        if (DefaultPortableReader.isNullOrEmpty(pos)) {
            return null;
        }
        return this.input.readShortArray(pos);
    }

    readUTFArray(fieldName: string): string[] | null {
        return this.readStringArray(fieldName);
    }

    readStringArray(fieldName: string): string[] | null {
        const pos = this.positionByField(fieldName, FieldType.STRING_ARRAY);
        if (DefaultPortableReader.isNullOrEmpty(pos)) {
            return null;
        }
        return this.input.readStringArray(pos);
    }

    readPortableArray(fieldName: string): Portable[] | null {
        const backupPos = this.input.position();
        try {
            const pos = this.positionByField(fieldName, FieldType.PORTABLE_ARRAY);
            if (DefaultPortableReader.isNullOrEmpty(pos)) {
                return null;
            }
            this.input.position(pos);
            const len = this.input.readInt();
            const factoryId = this.input.readInt();
            const classId = this.input.readInt();
            if (len === BitsUtil.NULL_ARRAY_LENGTH) {
                return null;
            } else {
                const portables: Portable[] = [];
                if (len > 0) {
                    const offset = this.input.position();
                    for (let i = 0; i < len; i++) {
                        const start = this.input.readInt(offset + i * BitsUtil.INT_SIZE_IN_BYTES);
                        this.input.position(start);
                        portables[i] = this.serializer.readObject(this.input, factoryId, classId);
                    }
                }
                return portables;
            }
        } finally {
            this.input.position(backupPos);
        }
    }

    readDecimalArray(fieldName: string): BigDecimal[] | null {
        return this.readObjectArrayField(fieldName, FieldType.DECIMAL_ARRAY, IOUtil.readDecimal);
    }

    readTimeArray(fieldName: string): HzLocalTime[] | null {
        return this.readObjectArrayField(fieldName, FieldType.TIME_ARRAY, IOUtil.readHzLocalTime);
    }

    readDateArray(fieldName: string): HzLocalDate[] | null {
        return this.readObjectArrayField(fieldName, FieldType.DATE_ARRAY, PortableUtil.readHzLocalDateForPortable);
    }

    readTimestampArray(fieldName: string): HzLocalDateTime[] | null {
        return this.readObjectArrayField(fieldName, FieldType.TIMESTAMP_ARRAY, PortableUtil.readHzLocalDatetimeForPortable);
    }

    readTimestampWithTimezoneArray(fieldName: string): HzOffsetDateTime[] | null {
        return this.readObjectArrayField(
            fieldName, FieldType.TIMESTAMP_WITH_TIMEZONE_ARRAY, PortableUtil.readHzOffsetDatetimeForPortable
        );
    }

    private static isNullOrEmpty(pos: number) {
        return pos === -1;
    }

    private readNullableField<T>(fieldName: string, fieldType: FieldType, readFn: (inp: DataInput) => T): T {
        const currentPos = this.input.position();

        try {
            const pos = this.positionByField(fieldName, fieldType);
            this.input.position(pos);
            const isNull = this.input.readBoolean();
            if (isNull) {
                return null;
            }
            return readFn(this.input);
        } finally {
            this.input.position(currentPos);
        }
    }

    private readObjectArrayField<T>(fieldName: string, fieldType: FieldType, readFn: (inp: DataInput) => T): T[] | null {
        const currentPos = this.input.position();

        try {
            const pos = this.positionByField(fieldName, fieldType);
            if (DefaultPortableReader.isNullOrEmpty(pos)) {
                return null;
            }
            this.input.position(pos);
            const len = this.input.readInt();

            if (len === BitsUtil.NULL_ARRAY_LENGTH) {
                return null;
            }

            const values = new Array<T>(len);

            if (len > 0) {
                const offset = this.input.position();
                for (let i = 0; i < len; i++) {
                    const pos = this.input.readInt(offset + i * BitsUtil.INT_SIZE_IN_BYTES);
                    this.input.position(pos);
                    values[i] = readFn(this.input);
                }
            }

            return values;
        } finally {
            this.input.position(currentPos);
        }
    }

    getRawDataInput(): DataInput {
        let pos: number;
        if (!this.raw) {
            pos = this.input.readInt(this.offset + this.classDefinition.getFieldCount() * BitsUtil.INT_SIZE_IN_BYTES);
            this.input.position(pos);
            this.raw = true;
        }
        return this.input;
    }

    end(): void {
        this.input.position(this.finalPos);
    }

    private positionByFieldDefinition(field: FieldDefinition): number {
        if (this.raw) {
            throw new HazelcastSerializationError('Cannot read portable fields after getRawDataInput called!');
        }
        const pos = this.input.readInt(this.offset + field.getIndex() * BitsUtil.INT_SIZE_IN_BYTES);
        const len = this.input.readShort(pos);
        return pos + BitsUtil.SHORT_SIZE_IN_BYTES + len + 1;
    }

    private positionByField(fieldName: string, fieldType: FieldType): number {
        const definition = this.classDefinition.getField(fieldName);
        if (definition === null) {
            throw new HazelcastSerializationError(`Unknown field name: '${fieldName}' for ClassDefinition`
                + `{id: ${this.classDefinition.getClassId()}, version: ${this.classDefinition.getVersion()}}`)
        }
        if (definition.getType() !== fieldType) {
            throw new HazelcastSerializationError(`Not a '${fieldType}' field: ${fieldName}`);
        }
        return this.positionByFieldDefinition(definition);
    }

    private initFinalPositionAndOffset(): void {
        this.finalPos = this.input.readInt();
        const fieldCount = this.input.readInt();
        const expectedFieldCount = this.classDefinition.getFieldCount();
        if (fieldCount !== expectedFieldCount) {
            // eslint-disable-next-line max-len
            throw new HazelcastSerializationError(`Field count[${fieldCount}] in stream does not match with class definition[${expectedFieldCount}]`);
        }
        this.offset = this.input.position();
    }
}
