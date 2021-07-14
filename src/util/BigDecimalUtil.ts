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

import {Buffer} from 'buffer';
import {IOUtil} from './IOUtil';

/**
 * Constructs a big decimal string from a buffer and a scale
 * @param buffer
 * @param scale
 */
export function fromBufferAndScale(buffer: Buffer, scale: number): string {
    const isNegative = (buffer[0] & 0x80) > 0;
    const bigIntString = IOUtil.readBigInt(buffer).toString();

    if (scale === 0) {
        return (isNegative ? '-' : '') + bigIntString;
    } else if (scale > 0) {
        if (scale < bigIntString.length) {
            return (isNegative ? '-' : '') + bigIntString.substring(0, bigIntString.length - scale) + '.'
                + bigIntString.substring(bigIntString.length - scale);
        } else {
            const numberOfZerosAfterDecimal = scale - bigIntString.length;
            return (isNegative ? '-0.' : '0.') + '0'.repeat(numberOfZerosAfterDecimal) + bigIntString
        }
    } else {
        return (isNegative ? '-' : '') + bigIntString + '0'.repeat(-1 * scale);
    }
}

/**
 * Returns byte array form of a Bigint
 * @param bigint
 */
export function bigintToByteArray(bigint: BigInt): Buffer {
    const isNegative = bigint < BigInt(0);
    let hex;

    // for getting two's complement of it
    if (isNegative) {
        bigint = bigint.valueOf() + BigInt(1);
        hex = bigint.toString(16).slice(1); // exclude minus sign
    } else {
        hex = bigint.toString(16);
    }

    // prepend 0 to get a even length string
    if (hex.length % 2) {
        hex = '0' + hex;
    }

    const numberOfBytes = hex.length / 2;
    const byteArray = new Array(numberOfBytes);

    let i = 0;
    let j = 0;
    while (i < numberOfBytes) {
        const byte = parseInt(hex.slice(j, j + 2), 16);
        byteArray[i] = isNegative ? ~byte : byte; // for two's complement
        i += 1;
        j += 2;
    }

    return Buffer.from(byteArray);
}
