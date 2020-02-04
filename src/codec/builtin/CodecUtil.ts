/*
 * Copyright (c) 2008-2019, Hazelcast, Inc. All Rights Reserved.
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

import {ClientMessage, ForwardFrameIterator, Frame, NULL_FRAME} from '../../ClientMessage';

export class CodecUtil {
    static fastForwardToEndFrame(iterator: ForwardFrameIterator): void {
        // We are starting from 1 because of the BEGIN_FRAME we read
        // in the beginning of the decode method
        let numberOfExpectedEndFrames = 1;
        let frame: Frame;
        while (numberOfExpectedEndFrames !== 0) {
            frame = iterator.next();
            if (frame.isEndFrame()) {
                numberOfExpectedEndFrames--;
            } else if (frame.isBeginFrame()) {
                numberOfExpectedEndFrames++;
            }
        }
    }

    static encodeNullable<T>(clientMessage: ClientMessage, value: T, encoder: (msg: ClientMessage, val: T) => void): void {
        if (value === null) {
            clientMessage.add(NULL_FRAME.copy());
        } else {
            encoder(clientMessage, value);
        }
    }

    static decodeNullable<T>(iterator: ForwardFrameIterator, decoder: (it: ForwardFrameIterator) => T): T {
        return CodecUtil.nextFrameIsNullEndFrame(iterator) ? null : decoder(iterator);
    }

    static nextFrameIsDataStructureEndFrame(iterator: ForwardFrameIterator): boolean {
        return iterator.peekNext().isEndFrame();
    }

    static nextFrameIsNullEndFrame(iterator: ForwardFrameIterator): boolean {
        const isNull = iterator.peekNext().isNullFrame();
        if (isNull) {
            iterator.next();
        }
        return isNull;
    }
}
