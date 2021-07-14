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

import {DataInput, DataOutput} from '../serialization';
import {
    LocalDate,
    HzLocalDate,
    LocalDateTime,
    HzLocalDateTime,
    OffsetDateTime,
    HzOffsetDateTime
} from '../core';
import {IOUtil} from './IOUtil';

/** @internal */
export class PortableUtil {

    static readHzLocalDateForPortable(inp: DataInput): HzLocalDate {
        const year = inp.readShort(); // this is different due to backward compatibility
        const month = inp.readByte();
        const date = inp.readByte();
        return LocalDate(year, month, date);
    }

    static readHzLocalDatetimeForPortable(inp: DataInput): HzLocalDateTime {
        const hzLocalDate = PortableUtil.readHzLocalDateForPortable(inp);
        const hzLocalTime = IOUtil.readHzLocalTime(inp);

        return LocalDateTime(hzLocalDate, hzLocalTime);
    }

    static readHzOffsetDatetimeForPortable(inp: DataInput): HzOffsetDateTime {
        const hzLocalDate = PortableUtil.readHzLocalDateForPortable(inp);
        const hzLocalTime = IOUtil.readHzLocalTime(inp);

        const offsetSeconds = inp.readInt();

        return OffsetDateTime(
            LocalDateTime(
                hzLocalDate,
                hzLocalTime
            ),
            offsetSeconds
        );
    }


    static writeHzLocalDateForPortable(out: DataOutput, value: HzLocalDate): void {
        out.writeShort(value.year); // this is different due to backward compatibility
        out.writeByte(value.month);
        out.writeByte(value.date);
    }

    static writeHzLocalDatetimeForPortable(out: DataOutput, value: HzLocalDateTime): void {
        PortableUtil.writeHzLocalDateForPortable(out, value.hzLocalDate);
        IOUtil.writeHzLocalTime(out, value.hzLocalTime);
    }

    static writeHzOffsetDatetimeForPortable(out: DataOutput, value: HzOffsetDateTime): void {
        PortableUtil.writeHzLocalDatetimeForPortable(out, value.hzLocalDateTime);
        out.writeInt(value.offsetSeconds);
    }

}
