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

/*tslint:disable:max-line-length*/
import {BitsUtil} from '../BitsUtil';
import {ClientMessage, Frame, PARTITION_ID_OFFSET, UNFRAGMENTED_MESSAGE} from '../ClientMessage';
import {StringCodec} from './builtin/StringCodec';

// hex: 0x030F00
const REQUEST_MESSAGE_TYPE = 200448;
// hex: 0x030F01
const RESPONSE_MESSAGE_TYPE = 200449;

const REQUEST_INITIAL_FRAME_SIZE = PARTITION_ID_OFFSET + BitsUtil.INT_SIZE_IN_BYTES;

export class QueueClearCodec {
    static encodeRequest(name: string): ClientMessage {
        const clientMessage = ClientMessage.createForEncode();
        clientMessage.setRetryable(false);

        const initialFrame = Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE, UNFRAGMENTED_MESSAGE);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);

        StringCodec.encode(clientMessage, name);
        return clientMessage;
    }
}
