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

/*
 This file should be in sync with ReferenceObjects.js file

 When you want to add a new serialization type:

 Update this file and ReferenceObjects.js accordingly. Then use this file to replace
 ReferenceObjects.java in hazelcast repo. Then run BinaryCompatibilityFileGenerator.java to generate the new binary file.
 Then put it here.
*/

package com.hazelcast.nio.serialization.compatibility;

import com.hazelcast.internal.serialization.impl.HeapData;
import com.hazelcast.internal.serialization.Data;
import com.hazelcast.nio.serialization.Portable;
import java.math.BigDecimal;
import java.nio.CharBuffer;
import java.time.LocalTime;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

class ReferenceObjects {

    /**
     * PORTABLE IDS
     **/
    static int PORTABLE_FACTORY_ID = 1;
    static int PORTABLE_CLASS_ID = 1;
    static int INNER_PORTABLE_CLASS_ID = 2;

    /**
     * IDENTIFIED DATA SERIALIZABLE IDS
     **/
    static int IDENTIFIED_DATA_SERIALIZABLE_FACTORY_ID = 1;
    static int DATA_SERIALIZABLE_CLASS_ID = 1;

    /**
     * CUSTOM SERIALIZER IDS
     */
    static int CUSTOM_STREAM_SERIALIZABLE_ID = 1;
    static int CUSTOM_BYTE_ARRAY_SERIALIZABLE_ID = 2;

    /**
     * OBJECTS
     */
    static Object aNullObject = null;
    static boolean aBoolean = true;
    static byte aByte = 113;
    static char aChar = 'x';
    static double aDouble = -897543.3678909d;
    static short aShort = -500;
    static float aFloat = 900.5678f;
    static int anInt = 56789;
    static long aLong = -50992225L;
    static String aString;
    static UUID aUUID = new UUID(aLong, anInt);
    static String aSmallString = "😊 Hello Приве́т नमस्ते שָׁלוֹם";

    static {
        CharBuffer cb = CharBuffer.allocate(Character.MAX_VALUE);
        for (char c = 0; c < Character.MAX_VALUE; c++) {
            if (!(c >= Character.MIN_SURROGATE && c < (Character.MAX_SURROGATE + 1))) {
                cb.append(c);
            }
        }
        aString = new String(cb.array());
    }

    static boolean[] booleans = {true, false, true};

    static byte[] bytes = {112, 4, -1, 4, 112, -35, 43};
    static char[] chars = {'a', 'b', 'c'};
    static double[] doubles = {-897543.3678909d, 11.1d, 22.2d, 33.3d};
    static short[] shorts = {-500, 2, 3};
    static float[] floats = {900.5678f, 1.0f, 2.1f, 3.4f};
    static int[] ints = {56789, 2, 3};
    static long[] longs = {-50992225L, 1231232141L, 2L, 3L};
    static String[] strings = {
            "Pijamalı hasta, yağız şoföre çabucak güvendi.",
            "イロハニホヘト チリヌルヲ ワカヨタレソ ツネナラム",
            "The quick brown fox jumps over the lazy dog",
    };

    static Data aData = new HeapData("111313123131313131".getBytes());

    static AnInnerPortable anInnerPortable = new AnInnerPortable(anInt, aFloat);
    static CustomStreamSerializable aCustomStreamSerializable = new CustomStreamSerializable(anInt, aFloat);
    static CustomByteArraySerializable aCustomByteArraySerializable = new CustomByteArraySerializable(anInt, aFloat);
    static Portable[] portables = {anInnerPortable, anInnerPortable, anInnerPortable};

    static AnIdentifiedDataSerializable anIdentifiedDataSerializable = new AnIdentifiedDataSerializable(
            aBoolean, aByte, aChar, aDouble, aShort, aFloat, anInt, aLong, aSmallString,
            booleans, bytes, chars, doubles, shorts, floats, ints, longs, strings,
            anInnerPortable, null,
            aCustomStreamSerializable,
            aCustomByteArraySerializable, aData);
    static APortable aPortable = new APortable(
            aBoolean, aByte, aChar, aDouble, aShort, aFloat, anInt, aLong, aSmallString, anInnerPortable,
            booleans, bytes, chars, doubles, shorts, floats, ints, longs, strings, portables,
            anIdentifiedDataSerializable,
            aCustomStreamSerializable,
            aCustomByteArraySerializable, aData);

    static Date aDate;

    static LocalDate aLocalDate;
    static LocalTime aLocalTime;
    static LocalDateTime aLocalDateTime;
    static OffsetDateTime aOffsetDateTime;

    static {
        Calendar calendar = Calendar.getInstance();
        calendar.set(1990, Calendar.FEBRUARY, 1, 0, 0, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.ZONE_OFFSET, 0);
        aDate = calendar.getTime();
        aLocalDate = LocalDate.of(2021, 6, 28);
        aLocalTime = LocalTime.of(11, 22, 41, 123456789);
        aLocalDateTime = LocalDateTime.of(aLocalDate, aLocalTime);
        aOffsetDateTime = OffsetDateTime.of(aLocalDateTime, ZoneOffset.ofHours(18));
    }

    static BigDecimal aBigDecimal = new BigDecimal(31231);
    static Class aClass = BigDecimal.class;


    static Object[] allTestObjects = {
            aNullObject, aBoolean, aByte, aChar, aDouble, aShort, aFloat, anInt, aLong, aString, aUUID, anInnerPortable,
            booleans, bytes, chars, doubles, shorts, floats, ints, longs, strings,
            aCustomStreamSerializable, aCustomByteArraySerializable,
            anIdentifiedDataSerializable, aPortable,
            aDate, aLocalDate, aLocalTime, aLocalDateTime, aOffsetDateTime, aBigDecimal, aClass
    };
}
