/*
 * Copyright (c) 2008-2020, Hazelcast, Inc. All Rights Reserved.
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

import {BEGIN_FRAME, ClientMessage, END_FRAME, ForwardFrameIterator} from '../../ClientMessage';
import {UUID} from '../../core/UUID';
import {ListIntegerCodec} from './ListIntegerCodec';
import {ListUUIDCodec} from './ListUUIDCodec';
import {ListMultiFrameCodec} from './ListMultiFrameCodec';

export class EntryListUUIDListIntegerCodec {
    static encode(clientMessage: ClientMessage, entries: Array<[UUID, number[]]>): void {
        const entryCount = entries.length;
        const keys = new Array<UUID>(entryCount);
        clientMessage.add(BEGIN_FRAME.copy());
        for (let i = 0; i < entryCount; i++) {
            keys[i] = entries[i][0];
            ListIntegerCodec.encode(clientMessage, entries[i][1]);
        }
        clientMessage.add(END_FRAME.copy());
        ListUUIDCodec.encode(clientMessage, keys);
    }

    static decode(iterator: ForwardFrameIterator): Array<[UUID, number[]]> {
        const values = ListMultiFrameCodec.decode(iterator, ListIntegerCodec.decode);
        const keys = ListUUIDCodec.decode(iterator);

        const result = new Array<[UUID, number[]]>(keys.length);
        for (let i = 0; i < result.length; i++) {
            result[i] = [keys[i], values[i]];
        }
        return result;
    }
}
