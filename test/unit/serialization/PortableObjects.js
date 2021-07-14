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

const TestUtil = require('../../TestUtil');

class InnerPortable {

    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.factoryId = 10;
        this.classId = 222;
    }

    readPortable(reader) {
        this.p1 = TestUtil.readStringFromReader(reader, 'p1');
        this.p2 = TestUtil.readStringFromReader(reader, 'p2');
    }

    writePortable(writer) {
        TestUtil.writeStringToWriter(writer, 'p1', this.p1);
        TestUtil.writeStringToWriter(writer, 'p2', this.p2);
    }

}

class PortableObject {

    constructor(
        {
            a_byte, a_boolean, a_character, a_short, an_integer,
            a_long, a_float, a_double, a_string, a_portable, a_decimal,
            a_time, a_date, a_timestamp, a_timestamp_with_timezone,
            bytes, booleans, chars, shorts, integers, longs,
            floats, doubles, strings, portables, decimals, times,
            dates, timestamps, timestamp_with_timezones
        }
    ) {
        this.a_byte = a_byte;
        this.a_boolean = a_boolean;
        this.a_character = a_character;
        this.a_short = a_short;
        this.an_integer = an_integer;
        this.a_long = a_long;
        this.a_float = a_float;
        this.a_double = a_double;
        this.a_string = a_string;
        this.a_portable = a_portable;
        this.a_null_portable = null;
        this.a_decimal = a_decimal;
        this.a_time = a_time;
        this.a_date = a_date;
        this.a_timestamp = a_timestamp;
        this.a_timestamp_with_timezone = a_timestamp_with_timezone;

        this.bytes = bytes;
        this.booleans = booleans;
        this.chars = chars;
        this.shorts = shorts;
        this.integers = integers;
        this.longs = longs;
        this.floats = floats;
        this.doubles = doubles;
        this.strings = strings;
        this.portables = portables;
        this.decimals = decimals;
        this.times = times;
        this.dates = dates;
        this.timestamps = timestamps;
        this.timestamp_with_timezones = timestamp_with_timezones;
        this.factoryId = 10;
        this.classId = 111;
    }

    writePortable(writer) {
        writer.writeByte('a_byte', this.a_byte);
        writer.writeBoolean('a_boolean', this.a_boolean);
        writer.writeChar('a_char', this.a_character);
        writer.writeShort('a_short', this.a_short);
        writer.writeInt('an_integer', this.an_integer);
        writer.writeLong('a_long', this.a_long);
        writer.writeFloat('a_float', this.a_float);
        writer.writeDouble('a_double', this.a_double);
        writer.writeString('a_string', this.a_string);
        writer.writePortable('a_portable', this.a_portable);
        const tmpInnerObj = new InnerPortable();
        writer.writeNullPortable('a_null_portable', tmpInnerObj.factoryId, tmpInnerObj.classId);
        writer.writeDecimal('a_decimal', this.a_decimal);
        writer.writeTime('a_time', this.a_time);
        writer.writeDate('a_date', this.a_date);
        writer.writeTimestamp('a_timestamp', this.a_timestamp);
        writer.writeTimestampWithTimezone('a_timestamp_with_timezone', this.a_timestamp_with_timezone);

        writer.writeByteArray('bytes', this.bytes);
        writer.writeBooleanArray('booleans', this.booleans);
        writer.writeCharArray('chars', this.chars);
        writer.writeShortArray('shorts', this.shorts);
        writer.writeIntArray('integers', this.integers);
        writer.writeLongArray('longs', this.longs);
        writer.writeFloatArray('floats', this.floats);
        writer.writeDoubleArray('doubles', this.doubles);
        writer.writeStringArray('strings', this.strings);
        writer.writePortableArray('portables', this.portables);
        writer.writeDecimalArray('decimals', this.decimals);
        writer.writeTimeArray('times', this.times);
        writer.writeDateArray('dates', this.dates);
        writer.writeTimestampArray('timestamps', this.timestamps);
        writer.writeTimestampWithTimezoneArray('timestamp_with_timezones', this.timestamp_with_timezones);
    }

    readPortable(reader) {
        this.a_byte = reader.readByte('a_byte');
        this.a_boolean = reader.readBoolean('a_boolean');
        this.a_character = reader.readChar('a_char');
        this.a_short = reader.readShort('a_short');
        this.an_integer = reader.readInt('an_integer');
        this.a_long = reader.readLong('a_long');
        this.a_float = reader.readFloat('a_float');
        this.a_double = reader.readDouble('a_double');
        this.a_string = reader.readString('a_string');
        this.a_portable = reader.readPortable('a_portable');
        this.a_null_portable = reader.readPortable('a_null_portable');
        this.a_decimal = reader.readDecimal('a_decimal');
        this.a_time = reader.readTime('a_time');
        this.a_date = reader.readDate('a_date');
        this.a_timestamp = reader.readTimestamp('a_timestamp');
        this.a_timestamp_with_timezone = reader.readTimestampWithTimezone('a_timestamp_with_timezone');

        this.bytes = reader.readByteArray('bytes');
        this.booleans = reader.readBooleanArray('booleans');
        this.chars = reader.readCharArray('chars');
        this.shorts = reader.readShortArray('shorts');
        this.integers = reader.readIntArray('integers');
        this.longs = reader.readLongArray('longs');
        this.floats = reader.readFloatArray('floats');
        this.doubles = reader.readDoubleArray('doubles');
        this.strings = reader.readStringArray('strings');
        this.portables = reader.readPortableArray('portables');
        this.decimals = reader.readDecimalArray('decimals');
        this.times = reader.readTimeArray('times');
        this.dates = reader.readDateArray('dates');
        this.timestamps = reader.readTimestampArray('timestamps');
        this.timestamp_with_timezones = reader.readTimestampWithTimezoneArray('timestamp_with_timezones');
    }

}

class PortableObjectV2 {

    constructor(
        {
            a_new_prop, a_byte, a_boolean, a_character, a_short, an_integer,
            a_long, a_float, a_double, a_portable, a_decimal,
            a_time, a_date, a_timestamp, a_timestamp_with_timezone,
            bytes, booleans, chars, shorts, integers, longs,
            floats, doubles, strings, portables, decimals, times,
            dates, timestamps, timestamp_with_timezones
        }
    ) {
        this.a_new_prop = a_new_prop; // this prop is newly added
        this.a_byte = a_byte;
        this.a_boolean = a_boolean;
        this.a_character = a_character;
        this.a_short = a_short;
        this.an_integer = an_integer;
        this.a_long = a_long;
        this.a_float = a_float; // this is a double in this version
        this.a_double = a_double;
        // a_string is removed
        this.a_portable = a_portable;
        this.a_null_portable = null;
        this.a_decimal = a_decimal;
        this.a_time = a_time;
        this.a_date = a_date;
        this.a_timestamp = a_timestamp;
        this.a_timestamp_with_timezone = a_timestamp_with_timezone;

        this.bytes = bytes;
        this.booleans = booleans;
        this.chars = chars;
        this.shorts = shorts;
        this.integers = integers;
        this.longs = longs;
        this.floats = floats;
        this.doubles = doubles;
        this.strings = strings;
        this.portables = portables;
        this.decimals = decimals;
        this.times = times;
        this.dates = dates;
        this.timestamps = timestamps;
        this.timestamp_with_timezones = timestamp_with_timezones;
        this.factoryId = 10;
        this.classId = 111;
        this.version = 2;
    }

    writePortable(writer) {
        writer.writeString('a_new_prop', this.a_new_prop);
        writer.writeByte('a_byte', this.a_byte);
        writer.writeBoolean('a_boolean', this.a_boolean);
        writer.writeChar('a_char', this.a_character);
        writer.writeShort('a_short', this.a_short);
        writer.writeInt('an_integer', this.an_integer);
        writer.writeLong('a_long', this.a_long);
        writer.writeDouble('a_float', this.a_float); // Floats are Double
        writer.writeDouble('a_double', this.a_double);
        writer.writePortable('a_portable', this.a_portable);
        const tmpInnerObj = new InnerPortable();
        writer.writeNullPortable('a_null_portable', tmpInnerObj.factoryId, tmpInnerObj.classId);
        writer.writeDecimal('a_decimal', this.a_decimal);
        writer.writeTime('a_time', this.a_time);
        writer.writeDate('a_date', this.a_date);
        writer.writeTimestamp('a_timestamp', this.a_timestamp);
        writer.writeTimestampWithTimezone('a_timestamp_with_timezone', this.a_timestamp_with_timezone);

        writer.writeByteArray('bytes', this.bytes);
        writer.writeBooleanArray('booleans', this.booleans);
        writer.writeCharArray('chars', this.chars);
        writer.writeShortArray('shorts', this.shorts);
        writer.writeIntArray('integers', this.integers);
        writer.writeLongArray('longs', this.longs);
        writer.writeFloatArray('floats', this.floats);
        writer.writeDoubleArray('doubles', this.doubles);
        writer.writeStringArray('strings', this.strings);
        writer.writePortableArray('portables', this.portables);
        writer.writeDecimalArray('decimals', this.decimals);
        writer.writeTimeArray('times', this.times);
        writer.writeDateArray('dates', this.dates);
        writer.writeTimestampArray('timestamps', this.timestamps);
        writer.writeTimestampWithTimezoneArray('timestamp_with_timezones', this.timestamp_with_timezones);
    }

    readPortable(reader) {
        this.a_new_prop = reader.readString('a_new_prop');
        this.a_byte = reader.readByte('a_byte');
        this.a_boolean = reader.readBoolean('a_boolean');
        this.a_character = reader.readChar('a_char');
        this.a_short = reader.readShort('a_short');
        this.an_integer = reader.readInt('an_integer');
        this.a_long = reader.readLong('a_long');
        this.a_float = reader.readDouble('a_float'); // Floats are double
        this.a_double = reader.readDouble('a_double');
        this.a_portable = reader.readPortable('a_portable');
        this.a_null_portable = reader.readPortable('a_null_portable');
        this.a_decimal = reader.readDecimal('a_decimal');
        this.a_time = reader.readTime('a_time');
        this.a_date = reader.readDate('a_date');
        this.a_timestamp = reader.readTimestamp('a_timestamp');
        this.a_timestamp_with_timezone = reader.readTimestampWithTimezone('a_timestamp_with_timezone');

        this.bytes = reader.readByteArray('bytes');
        this.booleans = reader.readBooleanArray('booleans');
        this.chars = reader.readCharArray('chars');
        this.shorts = reader.readShortArray('shorts');
        this.integers = reader.readIntArray('integers');
        this.longs = reader.readLongArray('longs');
        this.floats = reader.readFloatArray('floats');
        this.doubles = reader.readDoubleArray('doubles');
        this.strings = reader.readStringArray('strings');
        this.portables = reader.readPortableArray('portables');
        this.decimals = reader.readDecimalArray('decimals');
        this.times = reader.readTimeArray('times');
        this.dates = reader.readDateArray('dates');
        this.timestamps = reader.readTimestampArray('timestamps');
        this.timestamp_with_timezones = reader.readTimestampWithTimezoneArray('timestamp_with_timezones');
    }

}

class SimplePortable {

    constructor(str) {
        this.aString = str;
        this.factoryId = 10;
        this.classId = 21;
    }

    readPortable(reader) {
        this.aString = TestUtil.readStringFromReader(reader, 'aString');
    }

    writePortable(writer) {
        TestUtil.writeStringToWriter(writer, 'aString', this.aString);
    }

}

class SimplePortableV3 {

    constructor(innerObject) {
        this.innerObject = innerObject;
        this.factoryId = 10;
        this.classId = 21;
        this.version = 3;
    }

    readPortable(reader) {
        this.innerObject = reader.readPortable('innerObject');
    }

    writePortable(writer) {
        writer.writePortable('innerObject', this.innerObject);
    }

}

class Parent {

    constructor(child) {
        this.child = child;
        this.factoryId = 1;
        this.classId = 1;
    }

    writePortable(writer) {
        writer.writePortable('child', this.child);
    }

    readPortable(reader) {
        this.child = reader.readPortable('child');
    }

}

class Child {

    constructor(name) {
        this.name = name;
        this.factoryId = 1;
        this.classId = 2;
    }

    writePortable(writer) {
        writer.writeString('name', this.name);
    }

    readPortable(reader) {
        this.name = reader.readString('name');
    }

}

class SameFieldNamePortable {

    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
        this.factoryId = 10;
        this.classId = 1;
    }

    writePortable(writer) {
        writer.writeString('name', this.name);
        writer.writeString('name', this.surname); // should throw an error
    }

    readPortable(reader) {
        this.name = reader.readString('name');
        this.surname = reader.readString('name');
    }

}

exports.PortableObject = PortableObject;
exports.PortableObjectV2 = PortableObjectV2;
exports.InnerPortable = InnerPortable;
exports.SimplePortable = SimplePortable;
exports.SimplePortableV3 = SimplePortableV3;
exports.Parent = Parent;
exports.Child = Child;
exports.SameFieldNamePortable = SameFieldNamePortable;
