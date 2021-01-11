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

import {ClientMessage, Frame} from '../../protocol/ClientMessage';
import * as Long from 'long';
import {BitsUtil} from '../../util/BitsUtil';
import {FixSizedTypesCodec} from './FixSizedTypesCodec';

/** @internal */
export class ListLongCodec {
    static encode(clientMessage: ClientMessage, list: Long[]): void {
        const itemCount = list.length;
        const frame = new Frame(Buffer.allocUnsafe(itemCount * BitsUtil.LONG_SIZE_IN_BYTES));
        for (let i = 0; i < itemCount; i++) {
            FixSizedTypesCodec.encodeLong(frame.content, i * BitsUtil.LONG_SIZE_IN_BYTES, list[i]);
        }
        clientMessage.addFrame(frame);
    }

    static decode(clientMessage: ClientMessage): Long[] {
        const frame = clientMessage.nextFrame();
        const itemCount = frame.content.length / BitsUtil.LONG_SIZE_IN_BYTES;
        const result = new Array<Long>(itemCount);
        for (let i = 0; i < itemCount; i++) {
            result[i] = FixSizedTypesCodec.decodeLong(frame.content, i * BitsUtil.LONG_SIZE_IN_BYTES);
        }
        return result;
    }
}
