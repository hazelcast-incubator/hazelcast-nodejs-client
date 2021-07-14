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

import {PortableSerializer} from './PortableSerializer';
import {DataOutput, PositionalDataOutput} from '../Data';
import {ClassDefinition, FieldDefinition} from './ClassDefinition';
import {BitsUtil} from '../../util/BitsUtil';
import {FieldType, Portable, PortableWriter} from '../Portable';
import * as Long from 'long';
import {
    BigDecimal,
    HazelcastSerializationError,
    HzLocalDate,
    HzLocalDateTime,
    HzLocalTime,
    HzOffsetDateTime
} from '../../core';
import {IOUtil} from '../../util/IOUtil';
import {PortableUtil} from '../../util/PortableUtil';

/** @internal */
export class DefaultPortableWriter implements PortableWriter {

    private serializer: PortableSerializer;
    private readonly output: PositionalDataOutput;
    private classDefinition: ClassDefinition;

    private readonly offset: number;
    private readonly begin: number;
    private readonly writtenFields: Set<string>;

    constructor(serializer: PortableSerializer, output: PositionalDataOutput, classDefinition: ClassDefinition) {
        this.serializer = serializer;
        this.output = output;
        this.classDefinition = classDefinition;
        this.writtenFields = new Set<string>();
        this.begin = this.output.position();

        this.output.writeZeroBytes(4);
        this.output.writeInt(this.classDefinition.getFieldCount());
        this.offset = this.output.position();

        const fieldIndexesLength: number = (this.classDefinition.getFieldCount() + 1) * BitsUtil.INT_SIZE_IN_BYTES;
        this.output.writeZeroBytes(fieldIndexesLength);
    }

    writeInt(fieldName: string, value: number): void {
        this.setPosition(fieldName, FieldType.INT);
        this.output.writeInt(value);
    }

    writeLong(fieldName: string, long: Long): void {
        this.setPosition(fieldName, FieldType.LONG);
        this.output.writeLong(long);
    }

    writeUTF(fieldName: string, str: string): void {
        this.writeString(fieldName, str);
    }

    writeString(fieldName: string, str: string): void {
        this.setPosition(fieldName, FieldType.STRING);
        this.output.writeString(str);
    }

    writeBoolean(fieldName: string, value: boolean): void {
        this.setPosition(fieldName, FieldType.BOOLEAN);
        this.output.writeBoolean(value);
    }

    writeByte(fieldName: string, value: number): void {
        this.setPosition(fieldName, FieldType.BYTE);
        this.output.writeByte(value);
    }

    writeChar(fieldName: string, char: string): void {
        this.setPosition(fieldName, FieldType.CHAR);
        this.output.writeChar(char);
    }

    writeDouble(fieldName: string, double: number): void {
        this.setPosition(fieldName, FieldType.DOUBLE);
        this.output.writeDouble(double);
    }

    writeFloat(fieldName: string, float: number): void {
        this.setPosition(fieldName, FieldType.FLOAT);
        this.output.writeFloat(float);
    }

    writeShort(fieldName: string, value: number): void {
        this.setPosition(fieldName, FieldType.SHORT);
        this.output.writeShort(value);
    }

    writePortable(fieldName: string, portable: Portable): void {
        const fieldDefinition = this.setPosition(fieldName, FieldType.PORTABLE);
        const isNullPortable = (portable == null);
        this.output.writeBoolean(isNullPortable);
        this.output.writeInt(fieldDefinition.getFactoryId());
        this.output.writeInt(fieldDefinition.getClassId());
        if (!isNullPortable) {
            this.serializer.writeObject(this.output, portable);
        }
    }

    writeNullPortable(fieldName: string, factoryId: number, classId: number): void {
        this.setPosition(fieldName, FieldType.PORTABLE);
        this.output.writeBoolean(true);
        this.output.writeInt(factoryId);
        this.output.writeInt(classId);
    }

    writeDecimal(fieldName: string, value: BigDecimal): void {
        this.writeNullable(fieldName, FieldType.DECIMAL, value, IOUtil.writeDecimal);
    }

    writeTime(fieldName: string, value: HzLocalTime): void {
        this.writeNullable(fieldName, FieldType.TIME, value, IOUtil.writeHzLocalTime);
    }

    writeDate(fieldName: string, value: HzLocalDate): void {
        this.writeNullable(fieldName, FieldType.DATE, value, PortableUtil.writeHzLocalDateForPortable);
    }

    writeTimestamp(fieldName: string, value: HzLocalDateTime): void {
        this.writeNullable(fieldName, FieldType.TIMESTAMP, value, PortableUtil.writeHzLocalDatetimeForPortable);
    }

    writeTimestampWithTimezone(fieldName: string, value: HzOffsetDateTime): void {
        this.writeNullable(fieldName, FieldType.TIMESTAMP_WITH_TIMEZONE, value, PortableUtil.writeHzOffsetDatetimeForPortable);
    }

    writeNullable<T>(fieldName: string, fieldType: FieldType, value: T | null, writeFn: (out: DataOutput, value: T) => void) {
        this.setPosition(fieldName, fieldType);
        const isNull = value === null;
        this.output.writeBoolean(isNull);
        if (!isNull) {
            writeFn(this.output, value);
        }
    }

    writeByteArray(fieldName: string, bytes: Buffer | null): void {
        this.setPosition(fieldName, FieldType.BYTE_ARRAY);
        this.output.writeByteArray(bytes);
    }

    writeBooleanArray(fieldName: string, booleans: boolean[] | null): void {
        this.setPosition(fieldName, FieldType.BOOLEAN_ARRAY);
        this.output.writeBooleanArray(booleans);
    }

    writeCharArray(fieldName: string, chars: string[] | null): void {
        this.setPosition(fieldName, FieldType.CHAR_ARRAY);
        this.output.writeCharArray(chars);
    }

    writeIntArray(fieldName: string, ints: number[] | null): void {
        this.setPosition(fieldName, FieldType.INT_ARRAY);
        this.output.writeIntArray(ints);
    }

    writeLongArray(fieldName: string, longs: Long[] | null): void {
        this.setPosition(fieldName, FieldType.LONG_ARRAY);
        this.output.writeLongArray(longs);
    }

    writeDoubleArray(fieldName: string, doubles: number[] | null): void {
        this.setPosition(fieldName, FieldType.DOUBLE_ARRAY);
        this.output.writeDoubleArray(doubles);
    }

    writeFloatArray(fieldName: string, floats: number[] | null): void {
        this.setPosition(fieldName, FieldType.FLOAT_ARRAY);
        this.output.writeFloatArray(floats);
    }

    writeShortArray(fieldName: string, shorts: number[] | null): void {
        this.setPosition(fieldName, FieldType.SHORT_ARRAY);
        this.output.writeShortArray(shorts);
    }

    writeUTFArray(fieldName: string, val: string[] | null): void {
        this.writeStringArray(fieldName, val);
    }

    writeStringArray(fieldName: string, val: string[] | null): void {
        this.setPosition(fieldName, FieldType.STRING_ARRAY);
        this.output.writeStringArray(val);
    }

    writePortableArray(fieldName: string, portables: Portable[] | null): void {
        let innerOffset: number;
        let sample: Portable;
        let i: number;
        const fieldDefinition = this.setPosition(fieldName, FieldType.PORTABLE_ARRAY);
        const len = (portables == null) ? BitsUtil.NULL_ARRAY_LENGTH : portables.length;
        this.output.writeInt(len);
        this.output.writeInt(fieldDefinition.getFactoryId());
        this.output.writeInt(fieldDefinition.getClassId());
        if (len > 0) {
            innerOffset = this.output.position();
            this.output.writeZeroBytes(len * 4);
            for (i = 0; i < len; i++) {
                sample = portables[i];
                const posVal = this.output.position();
                this.output.pwriteInt(innerOffset + i * BitsUtil.INT_SIZE_IN_BYTES, posVal);
                this.serializer.writeObject(this.output, sample);
            }
        }
    }

    writeDecimalArray(fieldName: string, values: BigDecimal[] | null): void {
        this.writeObjectArrayField(fieldName, FieldType.DECIMAL_ARRAY, values, IOUtil.writeDecimal)
    }

    writeTimeArray(fieldName: string, values: HzLocalTime[] | null): void {
        this.writeObjectArrayField(fieldName, FieldType.TIME_ARRAY, values, IOUtil.writeHzLocalTime)
    }

    writeDateArray(fieldName: string, values: HzLocalDate[] | null): void {
        this.writeObjectArrayField(fieldName, FieldType.DATE_ARRAY, values, PortableUtil.writeHzLocalDateForPortable)
    }

    writeTimestampArray(fieldName: string, values: HzLocalDateTime[] | null): void {
        this.writeObjectArrayField(fieldName, FieldType.TIMESTAMP_ARRAY, values, PortableUtil.writeHzLocalDatetimeForPortable)
    }

    writeTimestampWithTimezoneArray(fieldName: string, values: HzOffsetDateTime[] | null): void {
        this.writeObjectArrayField(
            fieldName, FieldType.TIMESTAMP_WITH_TIMEZONE_ARRAY, values, PortableUtil.writeHzOffsetDatetimeForPortable
        );
    }

    writeObjectArrayField<T>(
        fieldName: string, fieldType: FieldType, values: T[] | null, writeFn: (out: DataOutput, value: T) => void
    ) {
        this.setPosition(fieldName, fieldType);
        const len = values === null ? BitsUtil.NULL_ARRAY_LENGTH : values.length;
        this.output.writeInt(len);

        if (len > 0) {
            const offset = this.output.position();
            this.output.writeZeroBytes(len * BitsUtil.INT_SIZE_IN_BYTES);
            for (let i = 0; i < len; i++) {
                const position = this.output.position();
                if (values[i] === null) {
                    throw new HazelcastSerializationError('Array items cannot be null');
                }
                this.output.pwriteInt(offset + i * BitsUtil.INT_SIZE_IN_BYTES, position);
                writeFn(this.output, values[i]);
            }
        }
    }

    end(): void {
        const position = this.output.position();
        this.output.pwriteInt(this.begin, position);
    }

    private setPosition(fieldName: string, fieldType: FieldType): FieldDefinition {
        const field: FieldDefinition = this.classDefinition.getField(fieldName);
        if (field === null) {
            throw new HazelcastSerializationError(`Invalid field name: '${fieldName}' for ClassDefinition`
                + `{id: ${this.classDefinition.getClassId()}, version: ${this.classDefinition.getVersion()}}`);
        }

        if (this.writtenFields.has(fieldName)) {
            throw new HazelcastSerializationError(`Field ${fieldName} has already been written!`);
        }
        this.writtenFields.add(fieldName);

        const pos: number = this.output.position();
        const index: number = field.getIndex();

        this.output.pwriteInt(this.offset + index * BitsUtil.INT_SIZE_IN_BYTES, pos);
        this.output.writeShort(fieldName.length);
        this.output.write(Buffer.from(fieldName));
        this.output.writeByte(fieldType);

        return field;
    }
}
