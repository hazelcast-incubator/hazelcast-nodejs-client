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

import {DefaultPortableReader} from './DefaultPortableReader';
import {PortableSerializer} from './PortableSerializer';
import {DataInput} from '../Data';
import {ClassDefinition, FieldDefinition} from './ClassDefinition';
import {Portable, FieldType} from '../Portable';
import * as Long from 'long';
import {
    BigDecimal,
    HzLocalDate,
    HzLocalDateTime,
    HzLocalTime,
    HzOffsetDateTime
} from '../../core';

/** @internal */
export class MorphingPortableReader extends DefaultPortableReader {

    constructor(portableSerializer: PortableSerializer,
                input: DataInput,
                classDefinition: ClassDefinition) {
        super(portableSerializer, input, classDefinition);
    }

    readInt(fieldName: string): number {
        const fieldDef = this.classDefinition.getField(fieldName);
        if (fieldDef == null) {
            return undefined;
        }
        switch (fieldDef.getType()) {
            case FieldType.INT:
                return super.readInt(fieldName);
            case FieldType.BYTE:
                return super.readByte(fieldName);
            case FieldType.CHAR:
                return super.readChar(fieldName).charCodeAt(0);
            case FieldType.SHORT:
                return super.readShort(fieldName);
            default:
                throw this.createIncompatibleClassChangeError(fieldDef, FieldType.INT);
        }
    }

    readLong(fieldName: string): Long {
        const fieldDef = this.classDefinition.getField(fieldName);
        if (fieldDef == null) {
            return undefined;
        }
        switch (fieldDef.getType()) {
            case FieldType.LONG:
                return super.readLong(fieldName);
            case FieldType.INT:
                return Long.fromNumber(super.readInt(fieldName));
            case FieldType.BYTE:
                return Long.fromNumber(super.readByte(fieldName));
            case FieldType.CHAR:
                return Long.fromNumber(super.readChar(fieldName).charCodeAt(0));
            case FieldType.SHORT:
                return Long.fromNumber(super.readShort(fieldName));
            default:
                throw this.createIncompatibleClassChangeError(fieldDef, FieldType.LONG);
        }
    }

    readDouble(fieldName: string): number {
        const fieldDef = this.classDefinition.getField(fieldName);
        if (fieldDef == null) {
            return undefined;
        }
        switch (fieldDef.getType()) {
            case FieldType.DOUBLE:
                return super.readDouble(fieldName);
            case FieldType.LONG:
                return super.readLong(fieldName).toNumber();
            case FieldType.FLOAT:
                return super.readFloat(fieldName);
            case FieldType.INT:
                return super.readInt(fieldName);
            case FieldType.BYTE:
                return super.readByte(fieldName);
            case FieldType.CHAR:
                return super.readChar(fieldName).charCodeAt(0);
            case FieldType.SHORT:
                return super.readShort(fieldName);
            default:
                throw this.createIncompatibleClassChangeError(fieldDef, FieldType.DOUBLE);
        }
    }

    readFloat(fieldName: string): number {
        const fieldDef = this.classDefinition.getField(fieldName);
        if (fieldDef == null) {
            return undefined;
        }
        switch (fieldDef.getType()) {
            case FieldType.FLOAT:
                return super.readFloat(fieldName);
            case FieldType.INT:
                return super.readInt(fieldName);
            case FieldType.BYTE:
                return super.readByte(fieldName);
            case FieldType.CHAR:
                return super.readChar(fieldName).charCodeAt(0);
            case FieldType.SHORT:
                return super.readShort(fieldName);
            default:
                throw this.createIncompatibleClassChangeError(fieldDef, FieldType.FLOAT);
        }
    }

    readShort(fieldName: string): number {
        const fieldDef = this.classDefinition.getField(fieldName);
        if (fieldDef == null) {
            return undefined;
        }
        switch (fieldDef.getType()) {
            case FieldType.BYTE:
                return super.readByte(fieldName);
            case FieldType.SHORT:
                return super.readShort(fieldName);
            default:
                throw this.createIncompatibleClassChangeError(fieldDef, FieldType.SHORT);
        }
    }

    readPortableArray(fieldName: string): Portable[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.PORTABLE_ARRAY, super.readPortableArray);
    }

    readStringArray(fieldName: string): string[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.STRING_ARRAY, super.readStringArray);
    }

    readUTFArray(fieldName: string): string[] {
        return this.readStringArray(fieldName);
    }

    readShortArray(fieldName: string): number[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.SHORT_ARRAY, super.readShortArray);
    }

    readFloatArray(fieldName: string): number[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.FLOAT_ARRAY, super.readFloatArray);
    }

    readDoubleArray(fieldName: string): number[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.DOUBLE_ARRAY, super.readDoubleArray);
    }

    readLongArray(fieldName: string): Long[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.LONG_ARRAY, super.readLongArray);
    }

    readIntArray(fieldName: string): number[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.INT_ARRAY, super.readIntArray);
    }

    readCharArray(fieldName: string): string[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.CHAR_ARRAY, super.readCharArray);
    }

    readBooleanArray(fieldName: string): boolean[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.BOOLEAN_ARRAY, super.readBooleanArray);
    }

    readByteArray(fieldName: string): Buffer {
        return this.validateCompatibleAndRead(fieldName, FieldType.BYTE_ARRAY, super.readByteArray);
    }

    readChar(fieldName: string): string {
        return this.validateCompatibleAndRead(fieldName, FieldType.CHAR, super.readChar);
    }

    readByte(fieldName: string): number {
        return this.validateCompatibleAndRead(fieldName, FieldType.BYTE, super.readByte);
    }

    readBoolean(fieldName: string): boolean {
        return this.validateCompatibleAndRead(fieldName, FieldType.BOOLEAN, super.readBoolean);
    }

    readString(fieldName: string): string {
        return this.validateCompatibleAndRead(fieldName, FieldType.STRING, super.readString);
    }

    readUTF(fieldName: string): string {
        return this.readString(fieldName);
    }

    readDecimal(fieldName: string): BigDecimal {
        return this.validateCompatibleAndRead(fieldName, FieldType.DECIMAL, super.readDecimal);
    }

    readTime(fieldName: string): HzLocalTime {
        return this.validateCompatibleAndRead(fieldName, FieldType.TIME, super.readTime);
    }

    readDate(fieldName: string): HzLocalDate {
        return this.validateCompatibleAndRead(fieldName, FieldType.DATE, super.readDate);
    }

    readTimestamp(fieldName: string): HzLocalDateTime {
        return this.validateCompatibleAndRead(fieldName, FieldType.TIMESTAMP, super.readTimestamp);
    }

    readTimestampWithTimezone(fieldName: string): HzOffsetDateTime {
        return this.validateCompatibleAndRead(fieldName, FieldType.TIMESTAMP_WITH_TIMEZONE, super.readTimestampWithTimezone);
    }

    readDecimalArray(fieldName: string): BigDecimal[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.DECIMAL_ARRAY, super.readDecimalArray);
    }

    readTimeArray(fieldName: string): HzLocalTime[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.TIME_ARRAY, super.readTimeArray);
    }

    readDateArray(fieldName: string): HzLocalDate[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.DATE_ARRAY, super.readDateArray);
    }

    readTimestampArray(fieldName: string): HzLocalDateTime[] {
        return this.validateCompatibleAndRead(fieldName, FieldType.TIMESTAMP_ARRAY, super.readTimestampArray);
    }

    readTimestampWithTimezoneArray(fieldName: string): HzOffsetDateTime[] {
        return this.validateCompatibleAndRead(
            fieldName, FieldType.TIMESTAMP_WITH_TIMEZONE_ARRAY, super.readTimestampWithTimezoneArray
        );
    }

    private validateCompatibleAndRead(fieldName: string,
                                      expectedType: FieldType,
                                      readFn: (fieldName: string) => any): any {
        const fd = this.classDefinition.getField(fieldName);
        if (fd === null) {
            return undefined;
        }
        if (fd.getType() !== expectedType) {
            throw this.createIncompatibleClassChangeError(fd, expectedType);
        }
        return readFn.call(this, fieldName);
    }

    private createIncompatibleClassChangeError(fd: FieldDefinition, expectedType: FieldType): Error {
        return new TypeError(`Incompatible to read ${expectedType} from ${fd.getType()} while reading field : ${fd.getName()}`);
    }
}
