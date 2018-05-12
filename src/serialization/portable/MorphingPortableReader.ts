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

import {DefaultPortableReader} from './DefaultPortableReader';
import {PortableSerializer} from './PortableSerializer';
import {DataInput} from '../Data';
import {ClassDefinition, FieldDefinition, FieldType} from './ClassDefinition';
import {Portable} from '../Serializable';
import * as Long from 'long';

export class MorphingPortableReader extends DefaultPortableReader {
    constructor(portableSerializer: PortableSerializer, input: DataInput, classDefinition: ClassDefinition) {
        super(portableSerializer, input, classDefinition);
    }

    readInt(fieldName: string): number {
        var fieldDef = this.classDefinition.getField(fieldName);
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
        var fieldDef = this.classDefinition.getField(fieldName);
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
        var fieldDef = this.classDefinition.getField(fieldName);
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
        var fieldDef = this.classDefinition.getField(fieldName);
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
        var fieldDef = this.classDefinition.getField(fieldName);
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
        return this.validateCompatibleAndCall(fieldName, FieldType.PORTABLE_ARRAY, super.readPortableArray);
    }

    readUTFArray(fieldName: string): string[] {
        return this.validateCompatibleAndCall(fieldName, FieldType.UTF_ARRAY, super.readUTFArray);
    }

    readShortArray(fieldName: string): number[] {
        return this.validateCompatibleAndCall(fieldName, FieldType.SHORT_ARRAY, super.readShortArray);
    }

    readFloatArray(fieldName: string): number[] {
        return this.validateCompatibleAndCall(fieldName, FieldType.FLOAT_ARRAY, super.readFloatArray);
    }

    readDoubleArray(fieldName: string): number[] {
        return this.validateCompatibleAndCall(fieldName, FieldType.DOUBLE_ARRAY, super.readDoubleArray);
    }

    readLongArray(fieldName: string): Long[] {
        return this.validateCompatibleAndCall(fieldName, FieldType.LONG_ARRAY, super.readLongArray);
    }

    readIntArray(fieldName: string): number[] {
        return this.validateCompatibleAndCall(fieldName, FieldType.INT_ARRAY, super.readIntArray);
    }

    readCharArray(fieldName: string): string[] {
        return this.validateCompatibleAndCall(fieldName, FieldType.CHAR_ARRAY, super.readCharArray);
    }

    readBooleanArray(fieldName: string): boolean[] {
        return this.validateCompatibleAndCall(fieldName, FieldType.BOOLEAN_ARRAY, super.readBooleanArray);
    }

    readByteArray(fieldName: string): number[] {
        return this.validateCompatibleAndCall(fieldName, FieldType.BYTE_ARRAY, super.readByteArray);
    }

    readChar(fieldName: string): string {
        return this.validateCompatibleAndCall(fieldName, FieldType.CHAR, super.readChar);
    }

    readByte(fieldName: string): number {
        return this.validateCompatibleAndCall(fieldName, FieldType.BYTE, super.readByte);
    }

    readBoolean(fieldName: string): boolean {
        return this.validateCompatibleAndCall(fieldName, FieldType.BOOLEAN, super.readBoolean);
    }

    readUTF(fieldName: string): string {
        return this.validateCompatibleAndCall(fieldName, FieldType.UTF, super.readUTF);
    }

    private validateCompatibleAndCall(fieldName: string, expectedType: FieldType, superFunc: Function) {
        var fd = this.classDefinition.getField(fieldName);
        if (fd === null) {
            return undefined;
        }
        if (fd.getType() !== expectedType) {
            throw this.createIncompatibleClassChangeError(fd, expectedType);
        }
        return superFunc.call(this, fieldName);
    }

    private createIncompatibleClassChangeError(fd: FieldDefinition, expectedType: FieldType) {
        return new TypeError(`Incompatible to read ${expectedType} from ${fd.getType()} while reading field : ${fd.getName()}`);
    }
}
