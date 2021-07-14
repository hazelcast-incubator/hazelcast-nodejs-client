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

/** @internal */
export class BitsUtil {

    static readonly BYTE_SIZE_IN_BYTES = 1;
    static readonly BOOLEAN_SIZE_IN_BYTES = 1;
    static readonly SHORT_SIZE_IN_BYTES = 2;
    static readonly CHAR_SIZE_IN_BYTES = 2;
    static readonly INT_SIZE_IN_BYTES = 4;
    static readonly FLOAT_SIZE_IN_BYTES = 4;
    static readonly LONG_SIZE_IN_BYTES = 8;
    static readonly DOUBLE_SIZE_IN_BYTES = 8;
    static readonly LOCAL_DATE_SIZE_IN_BYTES = BitsUtil.INT_SIZE_IN_BYTES + BitsUtil.BYTE_SIZE_IN_BYTES * 2;
    static readonly LOCAL_TIME_SIZE_IN_BYTES = BitsUtil.INT_SIZE_IN_BYTES + BitsUtil.BYTE_SIZE_IN_BYTES * 3;
    static readonly LOCAL_DATETIME_SIZE_IN_BYTES = BitsUtil.LOCAL_DATE_SIZE_IN_BYTES + BitsUtil.LOCAL_TIME_SIZE_IN_BYTES;
    static readonly OFFSET_DATE_TIME_SIZE_IN_BYTES = BitsUtil.LOCAL_DATETIME_SIZE_IN_BYTES + BitsUtil.INT_SIZE_IN_BYTES;

    static readonly UUID_SIZE_IN_BYTES = BitsUtil.BOOLEAN_SIZE_IN_BYTES + 2 * BitsUtil.LONG_SIZE_IN_BYTES;

    static readonly NULL_ARRAY_LENGTH = -1;

    static writeUInt32(buffer: Buffer, pos: number, val: number, isBigEndian: boolean): void {
        if (isBigEndian) {
            buffer.writeUInt32BE(val, pos);
        } else {
            buffer.writeUInt32LE(val, pos);
        }
    }

    static writeUInt16(buffer: Buffer, pos: number, val: number, isBigEndian: boolean): void {
        if (isBigEndian) {
            buffer.writeUInt16BE(val, pos);
        } else {
            buffer.writeUInt16LE(val, pos);
        }
    }

    static writeUInt8(buffer: Buffer, pos: number, val: number): void {
        buffer.writeUInt8(val, pos);
    }

    static writeInt32(buffer: Buffer, pos: number, val: number, isBigEndian: boolean): void {
        if (isBigEndian) {
            buffer.writeInt32BE(val, pos);
        } else {
            buffer.writeInt32LE(val, pos);
        }
    }

    static writeInt16(buffer: Buffer, pos: number, val: number, isBigEndian: boolean): void {
        if (isBigEndian) {
            buffer.writeInt16BE(val, pos);
        } else {
            buffer.writeInt16LE(val, pos);
        }
    }

    static writeInt8(buffer: Buffer, pos: number, val: number): void {
        buffer.writeInt8(val, pos);
    }

    static writeFloat(buffer: Buffer, pos: number, val: number, isBigEndian: boolean): void {
        if (isBigEndian) {
            buffer.writeFloatBE(val, pos);
        } else {
            buffer.writeFloatLE(val, pos);
        }
    }

    static writeDouble(buffer: Buffer, pos: number, val: number, isBigEndian: boolean): void {
        if (isBigEndian) {
            buffer.writeDoubleBE(val, pos);
        } else {
            buffer.writeDoubleLE(val, pos);
        }
    }

    static readDouble(buffer: Buffer, pos: number, isBigEndian: boolean): number {
        if (isBigEndian) {
            return buffer.readDoubleBE(pos);
        } else {
            return buffer.readDoubleLE(pos);
        }
    }

    static readFloat(buffer: Buffer, pos: number, isBigEndian: boolean): number {
        if (isBigEndian) {
            return buffer.readFloatBE(pos);
        } else {
            return buffer.readFloatLE(pos);
        }
    }

    static readInt8(buffer: Buffer, pos: number): number {
        return buffer.readInt8(pos);
    }

    static readInt16(buffer: Buffer, pos: number, isBigEndian: boolean): number {
        if (isBigEndian) {
            return buffer.readInt16BE(pos);
        } else {
            return buffer.readInt16LE(pos);
        }
    }

    static readInt32(buffer: Buffer, pos: number, isBigEndian: boolean): number {
        if (isBigEndian) {
            return buffer.readInt32BE(pos);
        } else {
            return buffer.readInt32LE(pos);
        }
    }

    static readUInt8(buffer: Buffer, pos: number): number {
        return buffer.readUInt8(pos);
    }

    static readUInt16(buffer: Buffer, pos: number, isBigEndian: boolean): number {
        if (isBigEndian) {
            return buffer.readUInt16BE(pos);
        } else {
            return buffer.readUInt16LE(pos);
        }
    }

    static readUInt32(buffer: Buffer, pos: number, isBigEndian: boolean): number {
        if (isBigEndian) {
            return buffer.readUInt32BE(pos);
        } else {
            return buffer.readUInt32LE(pos);
        }
    }
}
