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
import {Buffer} from 'safe-buffer';
import {BitsUtil} from '../BitsUtil';
import {FixSizedTypesCodec} from './builtin/FixSizedTypesCodec';
import {ClientMessage, Frame, RESPONSE_BACKUP_ACKS_OFFSET, MESSAGE_TYPE_OFFSET, PARTITION_ID_OFFSET, UNFRAGMENTED_MESSAGE} from '../ClientMessage';
import {StringCodec} from './builtin/StringCodec';
import {Data} from '../serialization/Data';
import {DataCodec} from './builtin/DataCodec';
import {UUID} from '../core/UUID';
import {CodecUtil} from './builtin/CodecUtil';

// hex: 0x011800
const REQUEST_MESSAGE_TYPE = 71680;
// hex: 0x011801
const RESPONSE_MESSAGE_TYPE = 71681;
// hex: 0x011802
const EVENT_ENTRY_MESSAGE_TYPE = 71682;

const REQUEST_INCLUDE_VALUE_OFFSET = PARTITION_ID_OFFSET + BitsUtil.INT_SIZE_IN_BYTES;
const REQUEST_LISTENER_FLAGS_OFFSET = REQUEST_INCLUDE_VALUE_OFFSET + BitsUtil.BOOLEAN_SIZE_IN_BYTES;
const REQUEST_LOCAL_ONLY_OFFSET = REQUEST_LISTENER_FLAGS_OFFSET + BitsUtil.INT_SIZE_IN_BYTES;
const REQUEST_INITIAL_FRAME_SIZE = REQUEST_LOCAL_ONLY_OFFSET + BitsUtil.BOOLEAN_SIZE_IN_BYTES;
const RESPONSE_RESPONSE_OFFSET = RESPONSE_BACKUP_ACKS_OFFSET + BitsUtil.BYTE_SIZE_IN_BYTES;
const EVENT_ENTRY_EVENT_TYPE_OFFSET = PARTITION_ID_OFFSET + BitsUtil.INT_SIZE_IN_BYTES;
const EVENT_ENTRY_UUID_OFFSET = EVENT_ENTRY_EVENT_TYPE_OFFSET + BitsUtil.INT_SIZE_IN_BYTES;
const EVENT_ENTRY_NUMBER_OF_AFFECTED_ENTRIES_OFFSET = EVENT_ENTRY_UUID_OFFSET + BitsUtil.UUID_SIZE_IN_BYTES;

export interface MapAddEntryListenerToKeyResponseParams {
    response: UUID;
}
export class MapAddEntryListenerToKeyCodec {
    static encodeRequest(name: string, key: Data, includeValue: boolean, listenerFlags: number, localOnly: boolean): ClientMessage {
        const clientMessage = ClientMessage.createForEncode();
        clientMessage.setRetryable(false);

        const initialFrame = new Frame(Buffer.allocUnsafe(REQUEST_INITIAL_FRAME_SIZE), UNFRAGMENTED_MESSAGE);
        FixSizedTypesCodec.encodeInt(initialFrame.content, MESSAGE_TYPE_OFFSET, REQUEST_MESSAGE_TYPE);
        FixSizedTypesCodec.encodeInt(initialFrame.content, PARTITION_ID_OFFSET, -1);
        FixSizedTypesCodec.encodeBoolean(initialFrame.content, REQUEST_INCLUDE_VALUE_OFFSET, includeValue);
        FixSizedTypesCodec.encodeInt(initialFrame.content, REQUEST_LISTENER_FLAGS_OFFSET, listenerFlags);
        FixSizedTypesCodec.encodeBoolean(initialFrame.content, REQUEST_LOCAL_ONLY_OFFSET, localOnly);
        clientMessage.add(initialFrame);

        StringCodec.encode(clientMessage, name);
        DataCodec.encode(clientMessage, key);
        return clientMessage;
    }

    static decodeResponse(clientMessage: ClientMessage): MapAddEntryListenerToKeyResponseParams {
        const iterator = clientMessage.frameIterator();
        const initialFrame = iterator.next();

        return {
            response: FixSizedTypesCodec.decodeUUID(initialFrame.content, RESPONSE_RESPONSE_OFFSET),
        };
    }

    static handle(clientMessage: ClientMessage, handleEntryEvent: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void = null): void {
        const messageType = clientMessage.getMessageType();
        const iterator = clientMessage.frameIterator();
        if (messageType === EVENT_ENTRY_MESSAGE_TYPE && handleEntryEvent !== null) {
            const initialFrame = iterator.next();
            const eventType = FixSizedTypesCodec.decodeInt(initialFrame.content, EVENT_ENTRY_EVENT_TYPE_OFFSET);
            const uuid = FixSizedTypesCodec.decodeUUID(initialFrame.content, EVENT_ENTRY_UUID_OFFSET);
            const numberOfAffectedEntries = FixSizedTypesCodec.decodeInt(initialFrame.content, EVENT_ENTRY_NUMBER_OF_AFFECTED_ENTRIES_OFFSET);
            const key = CodecUtil.decodeNullable(iterator, DataCodec.decode);
            const value = CodecUtil.decodeNullable(iterator, DataCodec.decode);
            const oldValue = CodecUtil.decodeNullable(iterator, DataCodec.decode);
            const mergingValue = CodecUtil.decodeNullable(iterator, DataCodec.decode);
            handleEntryEvent(key, value, oldValue, mergingValue, eventType, uuid, numberOfAffectedEntries);
            return;
        }
    }
}
