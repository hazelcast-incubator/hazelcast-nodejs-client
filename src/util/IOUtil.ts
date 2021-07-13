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
import {
    Big,
    BigDecimal,
    HzLocalDate,
    HzLocalDateClass,
    HzLocalDateTime,
    HzLocalDateTimeClass,
    HzLocalTime,
    HzLocalTimeClass,
    HzOffsetDateTime,
    HzOffsetDateTimeClass
} from '../core';
import {fromBufferAndScale, bigintToByteArray} from './BigDecimalUtil';
import {DataInput, DataOutput} from '../serialization';
import {Buffer} from 'buffer';

/** @internal */
export class IOUtil {

    static readDecimal(inp: DataInput): BigDecimal {
        const buffer = inp.readByteArray();
        const scale = inp.readInt();
        return Big(fromBufferAndScale(buffer, scale));
    }

    static readHzLocalTime(inp: DataInput): HzLocalTimeClass {
        const hour = inp.readByte();
        const minute = inp.readByte();
        const second = inp.readByte();
        const nano = inp.readInt();
        return HzLocalTime(hour, minute, second, nano);
    }

    static readHzLocalDate(inp: DataInput): HzLocalDateClass {
        const year = inp.readInt();
        const month = inp.readByte();
        const date = inp.readByte();
        return HzLocalDate(year, month, date);
    }

    static readHzLocalDatetime(inp: DataInput): HzLocalDateTimeClass {
        const hzLocalDate = IOUtil.readHzLocalDate(inp);
        const hzLocalTime = IOUtil.readHzLocalTime(inp);

        return HzLocalDateTime(hzLocalDate, hzLocalTime);
    }

    static readHzOffsetDatetime(inp: DataInput): HzOffsetDateTimeClass {
        const hzLocalDate = IOUtil.readHzLocalDate(inp);
        const hzLocalTime = IOUtil.readHzLocalTime(inp);

        const offsetSeconds = inp.readInt();

        return HzOffsetDateTime(
            HzLocalDateTime(
                hzLocalDate,
                hzLocalTime
            ),
            offsetSeconds
        );
    }

    static writeDecimal(out: DataOutput, value: BigDecimal): void {
        out.writeByteArray(bigintToByteArray(value.unscaledValue));
        out.writeInt(value.scale);
    }

    static writeHzLocalTime(out: DataOutput, value: HzLocalTimeClass): void {
        out.writeByte(value.hour);
        out.writeByte(value.minute);
        out.writeByte(value.second);
        out.writeInt(value.nano);
    }

    static writeHzLocalDate(out: DataOutput, value: HzLocalDateClass): void {
        out.writeInt(value.year);
        out.writeByte(value.month);
        out.writeByte(value.date);
    }

    static writeHzLocalDatetime(out: DataOutput, value: HzLocalDateTimeClass): void {
        IOUtil.writeHzLocalDate(out, value.hzLocalDate);
        IOUtil.writeHzLocalTime(out, value.hzLocalTime);
    }

    static writeHzOffsetDatetime(out: DataOutput, value: HzOffsetDateTimeClass): void {
        IOUtil.writeHzLocalDatetime(out, value.hzLocalDateTime);
        out.writeInt(value.offsetSeconds);
    }

    /**
     * Reads a BigInt from a buffer
     * @param buffer
     */
    static readBigInt(buffer: Buffer): BigInt {
        const isNegative = (buffer[0] & 0x80) > 0;
        if (isNegative) { // negative, convert two's complement to positive
            for (let i = 0; i < buffer.length; i++) {
                buffer[i] = ~buffer[i];
            }
        }
        const hexString = '0x' + buffer.toString('hex');

        let bigint = BigInt(hexString);
        if (isNegative) {
            // When converting from 2 s complement, need to add 1 to the inverted bits.
            // Since adding 1 to a buffer is hard, it is done here.
            bigint += BigInt(1);
        }
        return bigint;
    }
}
