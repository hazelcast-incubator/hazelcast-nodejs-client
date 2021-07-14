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
import {BitsUtil} from '../util/BitsUtil';
import {DataInput, DataOutput} from './Data';
import {
    Serializer,
    IdentifiedDataSerializable,
    IdentifiedDataSerializableFactory
} from './Serializable';
import {
    Big,
    BigDecimal,
    HazelcastJsonValue,
    HzLocalDate,
    HzLocalDateTime,
    HzLocalTime,
    HzOffsetDateTime,
    UUID
} from '../core';
import {fromBufferAndScale, unscaledValueToBuffer} from '../util/BigDecimalUtil';
import {Buffer} from 'buffer';
import {IOUtil} from '../util/IOUtil';

/** @internal */
export class StringSerializer implements Serializer<string> {

    id = -11;

    read(input: DataInput): string {
        return input.readString();
    }

    write(output: DataOutput, object: string): void {
        output.writeString(object);
    }
}

/** @internal */
export class DoubleSerializer implements Serializer<number> {

    id = -10;

    read(input: DataInput): number {
        return input.readDouble();
    }

    write(output: DataOutput, object: number): void {
        output.writeDouble(object);
    }
}

/** @internal */
export class BooleanSerializer implements Serializer<boolean> {

    id = -4;

    read(input: DataInput): boolean {
        return input.readBoolean();
    }

    write(output: DataOutput, object: boolean): void {
        output.writeBoolean(object);
    }
}

/** @internal */
export const NULL_TYPE_ID = 0;

/** @internal */
export class NullSerializer implements Serializer<null> {

    id = NULL_TYPE_ID;

    read(input: DataInput): null {
        return null;
    }

    write(output: DataOutput, object: any): void {
        // no-op
    }
}

/** @internal */
export class ShortSerializer implements Serializer<number> {

    id = -6;

    read(input: DataInput): number {
        return input.readShort();
    }

    write(output: DataOutput, object: number): void {
        output.writeShort(object);
    }
}

/** @internal */
export class IntegerSerializer implements Serializer<number> {

    id = -7;

    read(input: DataInput): number {
        return input.readInt();
    }

    write(output: DataOutput, object: number): void {
        output.writeInt(object);
    }
}

/** @internal */
export class LongSerializer implements Serializer<Long> {

    id = -8;

    read(input: DataInput): Long {
        return input.readLong();
    }

    write(output: DataOutput, object: Long): void {
        output.writeLong(object);
    }
}

/** @internal */
export class FloatSerializer implements Serializer<number> {

    id = -9;

    read(input: DataInput): number {
        return input.readFloat();
    }

    write(output: DataOutput, object: number): void {
        output.writeFloat(object);
    }
}

/** @internal */
export class DateSerializer implements Serializer<Date> {

    id = -25;

    read(input: DataInput): Date {
        return new Date(input.readLong().toNumber());
    }

    write(output: DataOutput, object: Date): void {
        output.writeLong(Long.fromNumber(object.getTime()));
    }
}

/** @internal */
export class BooleanArraySerializer implements Serializer<boolean[]> {

    id = -13;

    read(input: DataInput): boolean[] {
        return input.readBooleanArray();
    }

    write(output: DataOutput, object: boolean[]): void {
        output.writeBooleanArray(object);
    }
}

/** @internal */
export class ShortArraySerializer implements Serializer<number[]> {

    id = -15;

    read(input: DataInput): any {
        return input.readShortArray();
    }

    write(output: DataOutput, object: number[]): void {
        output.writeShortArray(object);
    }
}

/** @internal */
export class IntegerArraySerializer implements Serializer<number[]> {

    id = -16;

    read(input: DataInput): number[] {
        return input.readIntArray();
    }

    write(output: DataOutput, object: number[]): void {
        output.writeIntArray(object);
    }
}

/** @internal */
export class LongArraySerializer implements Serializer<Long[]> {

    id = -17;

    read(input: DataInput): Long[] {
        return input.readLongArray();
    }

    write(output: DataOutput, object: Long[]): void {
        output.writeLongArray(object);
    }
}

/** @internal */
export class DoubleArraySerializer implements Serializer<number[]> {

    id = -19;

    read(input: DataInput): number[] {
        return input.readDoubleArray();
    }

    write(output: DataOutput, object: number[]): void {
        output.writeDoubleArray(object);
    }
}

/** @internal */
export class StringArraySerializer implements Serializer<string[]> {

    id = -20;

    read(input: DataInput): string[] {
        return input.readStringArray();
    }

    write(output: DataOutput, object: string[]): void {
        output.writeStringArray(object);
    }
}

/** @internal */
export class ByteSerializer implements Serializer<number> {

    id = -3;

    read(input: DataInput): number {
        return input.readByte();
    }

    write(output: DataOutput, object: number): void {
        output.writeByte(object);
    }
}

/** @internal */
export class ByteArraySerializer implements Serializer<Buffer> {

    id = -12;

    read(input: DataInput): Buffer {
        return input.readByteArray();
    }

    write(output: DataOutput, object: Buffer): void {
        output.writeByteArray(object);
    }
}

/** @internal */
export class CharSerializer implements Serializer<string> {

    id = -5;

    read(input: DataInput): string {
        return input.readChar();
    }

    write(output: DataOutput, object: string): void {
        output.writeChar(object);
    }
}

/** @internal */
export class CharArraySerializer implements Serializer<string[]> {

    id = -14;

    read(input: DataInput): string[] {
        return input.readCharArray();
    }

    write(output: DataOutput, object: string[]): void {
        output.writeCharArray(object);
    }
}

/** @internal */
export class FloatArraySerializer implements Serializer<number[]> {

    id = -18;

    read(input: DataInput): any {
        return input.readFloatArray();
    }

    write(output: DataOutput, object: any): void {
        output.writeFloatArray(object);
    }
}

/** @internal */
export class JavaClassSerializer implements Serializer {

    id = -24;

    read(input: DataInput): any {
        return input.readString();
    }

    write(output: DataOutput, object: any): void {
        output.writeString(object);
    }
}

/** @internal */
export class LinkedListSerializer implements Serializer<any[]> {

    id = -30;

    read(input: DataInput): any[] {
        const size = input.readInt();
        let result: any = null;
        if (size > BitsUtil.NULL_ARRAY_LENGTH) {
            result = [];
            for (let i = 0; i < size; i++) {
                result.push(input.readObject());
            }
        }
        return result;
    }

    write(output: DataOutput, object: any[]): void {
        // no-op
    }
}

/** @internal */
export class ArrayListSerializer extends LinkedListSerializer {

    id = -29;
}

/** @internal */
export class IdentifiedDataSerializableSerializer implements Serializer {

    id = -2;
    private readonly factories: { [id: number]: IdentifiedDataSerializableFactory };

    constructor(factories: { [id: number]: IdentifiedDataSerializableFactory }) {
        this.factories = factories;
    }

    read(input: DataInput): any {
        const isIdentified = input.readBoolean();
        if (!isIdentified) {
            throw new RangeError('Native clients does not support Data Serializable. Please use Identified Data Serializable');
        }
        const factoryId = input.readInt();
        const classId = input.readInt();
        const factoryFn = this.factories[factoryId];
        if (!factoryFn) {
            throw new RangeError('There is no Identified Data Serializer factory with id ' + factoryId + '.');
        }
        const object = factoryFn(classId);
        object.readData(input);
        return object;
    }

    write(output: DataOutput, object: IdentifiedDataSerializable): void {
        output.writeBoolean(true);
        output.writeInt(object.factoryId);
        output.writeInt(object.classId);
        object.writeData(output);
    }
}

/** @internal */
export class JsonSerializer implements Serializer {

    id = -130;

    read(input: DataInput): any {
        return JSON.parse(input.readString());
    }

    write(output: DataOutput, object: any): void {
        if (object instanceof HazelcastJsonValue) {
            output.writeString(object.toString());
        } else {
            output.writeString(JSON.stringify(object));
        }

    }
}

/** @internal */
export class HazelcastJsonValueSerializer extends JsonSerializer {

    read(input: DataInput): HazelcastJsonValue {
        return new HazelcastJsonValue(input.readString());
    }
}

/** @internal */
export class UuidSerializer implements Serializer<UUID> {

    id = -21;

    read(input: DataInput): UUID {
        return new UUID(input.readLong(), input.readLong());
    }

    write(output: DataOutput, uuid: UUID): void {
        output.writeLong(uuid.mostSignificant);
        output.writeLong(uuid.leastSignificant);
    }
}

/** @internal */
export class LocalDateSerializer implements Serializer<HzLocalDate> {

    id = -51;

    read(input: DataInput): HzLocalDate {
        return IOUtil.readHzLocalDate(input);
    }

    write(output: DataOutput, hzLocalDate: HzLocalDate): void {
        IOUtil.writeHzLocalDate(output, hzLocalDate);
    }
}

/** @internal */
export class LocalTimeSerializer implements Serializer<HzLocalTime> {

    id = -52;

    read(input: DataInput): HzLocalTime {
        return IOUtil.readHzLocalTime(input);
    }

    write(output: DataOutput, hzLocalTime: HzLocalTime): void {
        IOUtil.writeHzLocalTime(output, hzLocalTime);
    }
}

/** @internal */
export class LocalDateTimeSerializer implements Serializer<HzLocalDateTime> {

    id = -53;

    read(input: DataInput): HzLocalDateTime {
        return IOUtil.readHzLocalDatetime(input);
    }

    write(output: DataOutput, hzLocalDateTime: HzLocalDateTime): void {
        IOUtil.writeHzLocalDatetime(output, hzLocalDateTime);
    }
}

/** @internal */
export class OffsetDateTimeSerializer implements Serializer<HzOffsetDateTime> {

    id = -54;

    read(input: DataInput): HzOffsetDateTime {
        return IOUtil.readHzOffsetDatetime(input);
    }

    write(output: DataOutput, hzOffsetDateTime: HzOffsetDateTime): void {
       IOUtil.writeHzOffsetDatetime(output, hzOffsetDateTime);
    }
}

/** @internal */
export class BigDecimalSerializer implements Serializer<BigDecimal> {

    id = -27;

    read(input: DataInput): BigDecimal {
        const body = input.readByteArray();
        const scale = input.readInt();

        return Big(fromBufferAndScale(body, scale));
    }

    write(output: DataOutput, bigDecimal: BigDecimal): void {
        output.writeByteArray(unscaledValueToBuffer(bigDecimal.unscaledValue));
        output.writeInt(bigDecimal.scale);
    }
}
