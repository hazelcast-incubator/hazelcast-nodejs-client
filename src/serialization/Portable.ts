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

import * as Long from 'long';
import {
    BigDecimal,
    HzLocalDate,
    HzLocalDateTime,
    HzLocalTime,
    HzOffsetDateTime
} from '../core';

/**
 * Portable field type.
 */
export enum FieldType {
    PORTABLE = 0,
    BYTE = 1,
    BOOLEAN = 2,
    CHAR = 3,
    SHORT = 4,
    INT = 5,
    LONG = 6,
    FLOAT = 7,
    DOUBLE = 8,
    UTF = 9, // Defined for backwards compatibility.
    STRING = 9,
    PORTABLE_ARRAY = 10,
    BYTE_ARRAY = 11,
    BOOLEAN_ARRAY = 12,
    CHAR_ARRAY = 13,
    SHORT_ARRAY = 14,
    INT_ARRAY = 15,
    LONG_ARRAY = 16,
    FLOAT_ARRAY = 17,
    DOUBLE_ARRAY = 18,
    UTF_ARRAY = 19, // Defined for backwards compatibility.
    STRING_ARRAY = 19,
    DECIMAL = 20,
    DECIMAL_ARRAY = 21,
    TIME = 22,
    TIME_ARRAY = 23,
    DATE = 24,
    DATE_ARRAY = 25,
    TIMESTAMP = 26,
    TIMESTAMP_ARRAY = 27,
    TIMESTAMP_WITH_TIMEZONE,
    TIMESTAMP_WITH_TIMEZONE_ARRAY = 29
}

/**
 * Writer helper for {@link Portable} objects.
 */
export interface PortableWriter {

    /**
     * Writes a primitive int.
     *
     * @param fieldName name of the field
     * @param value     int value to be written
     */
    writeInt(fieldName: string, value: number): void;

    /**
     * Writes a primitive long.
     *
     * @param fieldName name of the field
     * @param value     long value to be written
     */
    writeLong(fieldName: string, value: Long): void;

    /**
     * Writes an UTF string.
     *
     * @param fieldName name of the field
     * @param value     utf string value to be written
     * @deprecated since version 4.2 for the sake of better naming. Please use {@link writeString} instead.
     * This method will be removed in the next major version.
     */
    writeUTF(fieldName: string, value: string | null): void;

    /**
     * Writes an UTF string.
     *
     * @param fieldName name of the field
     * @param value     utf string value to be written
     */
    writeString(fieldName: string, value: string | null): void;

    /**
     * Writes a primitive boolean.
     *
     * @param fieldName name of the field
     * @param value     int value to be written
     */
    writeBoolean(fieldName: string, value: boolean): void;

    /**
     * Writes a primitive byte.
     *
     * @param fieldName name of the field
     * @param value     int value to be written
     */
    writeByte(fieldName: string, value: number): void;

    /**
     * Writes a primitive char.
     *
     * @param fieldName name of the field
     * @param value     int value to be written
     */
    writeChar(fieldName: string, value: string): void;

    /**
     * Writes a primitive double.
     *
     * @param fieldName name of the field
     * @param value     int value to be written
     */
    writeDouble(fieldName: string, value: number): void;

    /**
     * Writes a primitive float.
     *
     * @param fieldName name of the field
     * @param value     int value to be written
     */
    writeFloat(fieldName: string, value: number): void;

    /**
     * Writes a primitive short.
     *
     * @param fieldName name of the field
     * @param value     int value to be written
     */
    writeShort(fieldName: string, value: number): void;

    /**
     * Writes a Portable.
     * Use {@link writeNullPortable} to write a `null` Portable
     *
     * @param fieldName name of the field
     * @param portable  Portable to be written
     */
    writePortable(fieldName: string, portable: Portable | null): void;

    /**
     * To write a null portable value, user needs to provide class and factoryIds of related class.
     *
     * @param fieldName name of the field
     * @param factoryId factory ID of related portable class
     * @param classId   class ID of related portable class
     */
    writeNullPortable(fieldName: string, factoryId: number, classId: number): void;

    /**
     * Writes a decimal which is arbitrary precision and scale floating-point number
     *
     * @param fieldName name of the field
     * @param value     BigDecimal value to be written
     */
    writeDecimal(fieldName: string, value: BigDecimal | null): void;

    /**
     * Write a time field consisting of hour, minute, seconds and nanos parts
     *
     * @param fieldName name of the field
     * @param value     HzLocalTime value to be written
     */
    writeTime(fieldName: string, value: HzLocalTime | null): void

    /**
     * Writes a date field consisting of year, month of the year and day of the month
     *
     * **Note**: Year in HzLocalDate must be between [-32,768, 32,767] range due to a backward compatibility restriction.
     *
     * @param fieldName name of the field
     * @param value     HzLocalDate value to be written
     */
    writeDate(fieldName: string, value: HzLocalDate | null): void;

    /**
     * Writes a timestamp field consisting of
     * year, month of the year, day of the month, hour, minute, seconds, nanos parts
     *
     * **Note**: Year in HzLocalDateTime must be between [-32,768, 32,767] range due to a backward compatibility restriction.
     *
     * @param fieldName name of the field
     * @param value     HzLocalDateTime value to be written
     */
    writeTimestamp(fieldName: string, value: HzLocalDateTime | null): void;

    /**
     * Writes a timestamp with timezone field consisting of
     * year, month of the year, day of the month, offset seconds, hour, minute, seconds, nanos parts
     *
     * **Note**: Year in HzOffsetDateTime must be between [-32,768, 32,767] range due to a backward compatibility restriction.
     *
     * @param fieldName name of the field
     * @param value     HzOffsetDateTime value to be written
     */
    writeTimestampWithTimezone(fieldName: string, value: HzOffsetDateTime | null): void;

    /**
     * Writes a primitive byte-array.
     *
     * @param fieldName name of the field
     * @param bytes     byte array to be written
     */
    writeByteArray(fieldName: string, bytes: Buffer | null): void;

    /**
     * Writes a primitive boolean-array.
     *
     * @param fieldName name of the field
     * @param booleans  boolean array to be written
     */
    writeBooleanArray(fieldName: string, booleans: boolean[] | null): void;

    /**
     * Writes a primitive char-array.
     *
     * @param fieldName name of the field
     * @param chars     char array to be written
     */
    writeCharArray(fieldName: string, chars: string[] | null): void;

    /**
     * Writes a primitive int-array.
     *
     * @param fieldName name of the field
     * @param ints      int array to be written
     */
    writeIntArray(fieldName: string, ints: number[] | null): void;

    /**
     * Writes a primitive long-array.
     *
     * @param fieldName name of the field
     * @param longs     long array to be written
     */
    writeLongArray(fieldName: string, longs: Long[] | null): void;

    /**
     * Writes a primitive double array.
     *
     * @param fieldName name of the field
     * @param values    double array to be written
     */
    writeDoubleArray(fieldName: string, values: number[] | null): void;

    /**
     * Writes a primitive float array.
     *
     * @param fieldName name of the field
     * @param values    float array to be written
     */
    writeFloatArray(fieldName: string, values: number[] | null): void;

    /**
     * Writes a primitive short-array.
     *
     * @param fieldName name of the field
     * @param values    short array to be written
     */
    writeShortArray(fieldName: string, values: number[] | null): void;

    /**
     * Writes a String-array.
     *
     * @param fieldName name of the field
     * @param values    String array to be written
     * @deprecated  since version 4.2. for the sake of better naming. Please use {@link writeStringArray} instead.
     * This method will be removed in next major version.
     */
    writeUTFArray(fieldName: string, values: string[] | null): void;

    /**
     * Writes a String-array.
     *
     * @param fieldName name of the field
     * @param values    String array to be written
     */
    writeStringArray(fieldName: string, values: string[] | null): void;

    /**
     * Writes a an array of Portables.
     *
     * @param fieldName name of the field
     * @param values    portable array to be written
     */
    writePortableArray(fieldName: string, values: Portable[] | null): void;

    /**
     * Writes an array of Decimals
     *
     * @param fieldName name of the field
     * @param values    BigDecimal array to be written
     * @see {@link writeDecimal}
     */
    writeDecimalArray(fieldName: string, values: BigDecimal[] | null): void;

    /**
     * Writes an array of Time's
     *
     * @param fieldName name of the field
     * @param values    HzLocalTime array to be written
     * @see {@link writeTime}
     */
    writeTimeArray(fieldName: string, values: HzLocalTime[] | null): void;

    /**
     * Writes an array of Date's
     *
     * **Note**: Year in HzLocalDates must be between [-32,768, 32,767] range due to a backward compatibility restriction.
     *
     * @param fieldName name of the field
     * @param values    HzLocalDate array to be written
     * @see {@link writeDate}
     */
    writeDateArray(fieldName: string, values: HzLocalDate[] | null): void;

    /**
     * Writes an array of Timestamp's
     *
     * **Note**: Year in HzLocalDateTime must be between [-32,768, 32,767] range due to a backward compatibility restriction.
     *
     * @param fieldName name of the field
     * @param values    HzLocalDateTime array to be written
     * @see {@link writeTimestamp}
     */
    writeTimestampArray(fieldName: string, values: HzLocalDateTime[] | null): void;

    /**
     * Writes an array of TimestampWithTimezone's
     *
     * **Note**: Year in HzOffsetDateTime must be between [-32,768, 32,767] range due to a backward compatibility restriction.
     *
     * @param fieldName name of the field
     * @param values    HzOffsetDateTime array to be written
     * @see {@link writeTimestampWithTimezone}
     */
    writeTimestampWithTimezoneArray(fieldName: string, values: HzOffsetDateTime[] | null): void;
}

/**
 * Reader helper for {@link Portable} objects.
 */
export interface PortableReader {
    /**
     * @return global version of portable classes
     */
    getVersion(): number;

    /**
     * @param fieldName name of the field (does not support nested paths)
     * @return true if field exist in this class.
     */
    hasField(fieldName: string): boolean;

    /**
     * @return set of field names on this portable class
     */
    getFieldNames(): string[];

    /**
     * @param fieldName name of the field
     * @return field type of given fieldName
     * @throws RangeError if the field does not exist.
     */
    getFieldType(fieldName: string): FieldType;

    /**
     * @param fieldName name of the field
     * @return the int value read
     */
    readInt(fieldName: string): number;

    /**
     * @param fieldName name of the field
     * @return the long value read
     */
    readLong(fieldName: string): Long;

    /**
     * @param fieldName name of the field
     * @return the utf string value read
     * @deprecated since version 4.2 for the sake of better naming. Please use {@link readString} instead.
     * This method will be removed in next major version.
     */
    readUTF(fieldName: string): string | null;

    /**
     * @param fieldName name of the field
     * @return the string value read
     */
    readString(fieldName: string): string | null;

    /**
     * @param fieldName name of the field
     * @return the boolean value read
     */
    readBoolean(fieldName: string): boolean;

    /**
     * @param fieldName name of the field
     * @return the byte value read
     */
    readByte(fieldName: string): number;

    /**
     * @param fieldName name of the field
     * @return the char value read
     */
    readChar(fieldName: string): string;

    /**
     * @param fieldName name of the field
     * @return the double value read
     */
    readDouble(fieldName: string): number;

    /**
     * @param fieldName name of the field
     * @return the float value read
     */
    readFloat(fieldName: string): number;

    /**
     * @param fieldName name of the field
     * @return the short value read
     */
    readShort(fieldName: string): number;

    /**
     * @param fieldName name of the field
     * @return the portable value read
     */
    readPortable(fieldName: string): Portable | null;

    /**
     * Reads a decimal which is arbitrary precision and scale floating-point number to BigDecimal
     *
     * @param fieldName name of the field
     * @return the BigDecimal value read
     */
    readDecimal(fieldName: string): BigDecimal | null;

    /**
     * Reads a time field consisting of hour, minute, seconds and nanos parts to HzLocalTime
     *
     * @param fieldName name of the field
     * @return the HzLocalTime value read
     */
    readTime(fieldName: string): HzLocalTime | null;

    /**
     * Reads a date field consisting of year, month of the year and day of the month to HzLocalDate
     *
     * @param fieldName name of the field
     * @return the HzLocalDate value read
     */
    readDate(fieldName: string): HzLocalDate | null;

    /**
     * Reads a timestamp field consisting of
     * year, month of the year, day of the month, hour, minute, seconds, nanos parts to HzLocalDateTime
     *
     * @param fieldName name of the field
     * @return the LocalDateTime value read
     */
    readTimestamp(fieldName: string): HzLocalDateTime | null;

    /**
     * Reads a timestamp with timezone field consisting of
     * year, month of the year, day of the month, offset seconds, hour, minute, seconds, nanos parts
     * to HzOffsetDateTime
     *
     * @param fieldName name of the field
     * @return the OffsetDateTime value read
     */
    readTimestampWithTimezone(fieldName: string): HzOffsetDateTime | null;

    /**
     * @param fieldName name of the field
     * @return the byte array value read
     */
    readByteArray(fieldName: string): Buffer | null;

    /**
     * @param fieldName name of the field
     * @return the boolean array value read
     */
    readBooleanArray(fieldName: string): boolean[] | null;

    /**
     * @param fieldName name of the field
     * @return the char array value read
     */
    readCharArray(fieldName: string): string[] | null;

    /**
     * @param fieldName name of the field
     * @return the int array value read
     */
    readIntArray(fieldName: string): number[] | null;

    /**
     * @param fieldName name of the field
     * @return the long array value read
     */
    readLongArray(fieldName: string): Long[] | null;

    /**
     * @param fieldName name of the field
     * @return the double array value read
     */
    readDoubleArray(fieldName: string): number[] | null;

    /**
     * @param fieldName name of the field
     * @return the float array value read
     */
    readFloatArray(fieldName: string): number[] | null;

    /**
     * @param fieldName name of the field
     * @return the short array value read
     */
    readShortArray(fieldName: string): number[] | null;

    /**
     * @param fieldName name of the field
     * @return the String array value read
     * @deprecated since version 4.2 for the sake of better naming. This method will be removed in next major version.
     * Please use {@link readStringArray} instead
     */
    readUTFArray(fieldName: string): string[] | null;

    /**
     * @param fieldName name of the field
     * @return the String array value read
     */
    readStringArray(fieldName: string): string[] | null;

    /**
     * @param fieldName name of the field
     * @return the portable array read
     */
    readPortableArray(fieldName: string): Portable[] | null;

    /**
     * Reads an array of Decimal's to BigDecimal[]
     *
     * @param fieldName name of the field
     * @return the BigDecimal array read
     * @see {@link readDecimal}
     */
    readDecimalArray(fieldName: string): BigDecimal[] | null;

    /**
     * Reads an array of Time's to HzLocalTime[]
     *
     * @param fieldName name of the field
     * @return the HzLocalTime array read
     * @see {@link readTime}
     */
    readTimeArray(fieldName: string): HzLocalTime[] | null;

    /**
     * Reads an array of Date's to HzLocalDate[]
     *
     * @param fieldName name of the field
     * @return the HzLocalDate array read
     * @see {@link readDate}
     */
    readDateArray(fieldName: string): HzLocalDate[] | null;

    /**
     * Reads an array of Timestamp's to HzLocalDateTime[]
     *
     * @param fieldName name of the field
     * @return the HzLocalDateTime array read
     * @see {@link readTimestamp}
     */
    readTimestampArray(fieldName: string): HzLocalDateTime[] | null;

    /**
     * Reads an array of Time's to HzOffsetDateTime[]
     *
     * @param fieldName name of the field
     * @return the HzOffsetDateTime array read
     * @see {@link readTimestampWithTimezone}
     */
    readTimestampWithTimezoneArray(fieldName: string): HzOffsetDateTime[] | null;
}

/**
 * Interface for objects with Portable serialization support.
 */
export interface Portable {

    /**
     * Factory id of the portable object.
     */
    factoryId: number;

    /**
     * Class id of the portable object.
     */
    classId: number;

    /**
     * Reads fields of the portable object from the binary representation.
     *
     * @param reader read helper
     */
    readPortable(reader: PortableReader): void;

    /**
     * Writes fields of the portable object into the binary representation.
     *
     * @param writer write helper
     */
    writePortable(writer: PortableWriter): void;

}

/**
 * Interface for Portable serialization with multiversion support.
 */
export interface VersionedPortable extends Portable {

    /**
     * Version of the portable object.
     */
    version: number;

}

/**
 * Factory function for {@link Portable}. Should return
 * an instance of the right {@link Portable} object, given
 * the matching `classId`.
 *
 * @param classId class id
 * @returns object for further initialization
 */
export type PortableFactory = (classId: number) => Portable;
