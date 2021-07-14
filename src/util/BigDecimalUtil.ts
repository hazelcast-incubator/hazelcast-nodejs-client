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

/**
 * Constructs a big decimal string from a buffer and a scale
 * @param buffer
 * @param scale
 */
export function fromBufferAndScale(buffer: Buffer, scale: number): string {
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
    const bigIntString = bigint.toString();

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
