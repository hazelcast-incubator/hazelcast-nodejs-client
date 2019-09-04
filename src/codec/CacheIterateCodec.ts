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

/* tslint:disable */
import * as Long from 'long';
import {Address} from '../Address';
import {AddressCodec} from'../builtin/AddressCodec';
import {MemberCodec} from '../builtin/MemberCodec';
import {Data} from '../serialization/Data';
import {SimpleEntryViewCodec} from '../builtin/SimpleEntryViewCodec';
import {DistributedObjectInfoCodec} from '../builtin/DistributedObjectInfoCodec';
import {DistributedObjectInfo} from '../builtin/DistributedObjectInfo';
import {Member} from '../core/Member';
import {UUID} from '../core/UUID';
import {FixedSizeTypes} from '../builtin/FixedSizeTypes'
import {BitsUtil} from '../BitsUtil'
import {ClientConnection} from '../invocation/ClientConnection'
import {ClientMessage, Frame} from '../ClientMessage'
import {Buffer} from 'safe-buffer'
import {ClientProtocolErrorCodes} from '../protocol/ClientProtocolErrorCodes'
import {CodecUtil} from '../builtin/CodecUtil'
import {DataCodec} from '../builtin/DataCodec'
import {ErrorCodec} from '../protocol/ErrorCodec'
import {ErrorsCodec} from '../protocol/ErrorsCodec'
import {ListIntegerCodec} from '../builtin/ListIntegerCodec'
import {ListUUIDCodec} from '../builtin/ListUUIDCodec'
import {ListLongCodec} from '../builtin/ListLongCodec'
import {ListMultiFrameCodec} from '../builtin/ListMultiFrameCodec'
import {LongArrayCodec} from '../builtin/LongArrayCodec'
import {MapCodec} from '../builtin/MapCodec'
import {MapIntegerLongCodec} from '../builtin/MapIntegerLongCodec'
import {MapIntegerUUIDCodec} from '../builtin/MapIntegerUUIDCodec'
import {MapStringLongCodec} from '../builtin/MapStringLongCodec'
import {MapUUIDLongCodec} from '../builtin/MapUUIDLongCodec'
import {StackTraceElementCodec} from '../protocol/StackTraceElementCodec'
import {StringCodec} from '../builtin/StringCodec'

    /* tslint:disabled:URF-UNREAD-PUBLIC-OR-PROTECTED-FIELD */
   export class RequestParameters {

        /**
         * Name of the cache.
         */
        public name: string;

        /**
         * The slot number (or index) to start the iterator
         */
        public tableIndex: number;

        /**
         * The number of items to be batched
         */
        public batch: number;
    };

    /* tslint:disable:urf-unread-public-or-protected-field */
   export class ResponseParameters {

        /**
         * The slot number (or index) to start the iterator
         */
        public tableIndex : number;

        /**
         * TODO DOC
         */
        public keys : Array<Data>;
    };

/**
 * The ordering of iteration over entries is undefined. During iteration, any entries that are a). read will have
 * their appropriate CacheEntryReadListeners notified and b). removed will have their appropriate
 * CacheEntryRemoveListeners notified. java.util.Iterator#next() may return null if the entry is no longer present,
 * has expired or has been evicted.
 */
export class CacheIterateCodec {
    //hex: 0x150F00
    public static REQUEST_MESSAGE_TYPE = 1380096;
    //hex: 0x150F01
    public static RESPONSE_MESSAGE_TYPE = 1380097;
    private static REQUEST_TABLE_INDEX_FIELD_OFFSET = ClientMessage.PARTITION_ID_FIELD_OFFSET + FixedSizeTypes.INT_SIZE_IN_BYTES;
    private static REQUEST_BATCH_FIELD_OFFSET = CacheIterateCodec.REQUEST_TABLE_INDEX_FIELD_OFFSET + FixedSizeTypes.INT_SIZE_IN_BYTES;
    private static REQUEST_INITIAL_FRAME_SIZE = CacheIterateCodec.REQUEST_BATCH_FIELD_OFFSET + FixedSizeTypes.INT_SIZE_IN_BYTES;
    private static RESPONSE_TABLE_INDEX_FIELD_OFFSET = ClientMessage.CORRELATION_ID_FIELD_OFFSET + FixedSizeTypes.LONG_SIZE_IN_BYTES;
    private static RESPONSE_INITIAL_FRAME_SIZE = CacheIterateCodec.RESPONSE_TABLE_INDEX_FIELD_OFFSET + FixedSizeTypes.INT_SIZE_IN_BYTES;

    private CacheIterateCodec() {
    }


    static encodeRequest(name: string, tableIndex: number, batch: number) {
        var clientMessage = ClientMessage.createForEncode();
        clientMessage.setRetryable(false);
        clientMessage.setAcquiresResource(false);
        clientMessage.setOperationName("Cache.Iterate");
        var initialFrame : Frame= new Frame(Buffer.allocUnsafe(CacheIterateCodec.REQUEST_INITIAL_FRAME_SIZE), ClientMessage.UNFRAGMENTED_MESSAGE);
        FixedSizeTypes.encodeInt(initialFrame.content, ClientMessage.TYPE_FIELD_OFFSET, CacheIterateCodec.REQUEST_MESSAGE_TYPE);
        FixedSizeTypes.encodeInt(initialFrame.content, CacheIterateCodec.REQUEST_TABLE_INDEX_FIELD_OFFSET, tableIndex);
        FixedSizeTypes.encodeInt(initialFrame.content, CacheIterateCodec.REQUEST_BATCH_FIELD_OFFSET, batch);
        clientMessage.add(initialFrame);
        StringCodec.encode(clientMessage, name);
        return clientMessage;
    }

    static decodeRequest(clientMessage : ClientMessage) {
        var frame : Frame = clientMessage.get();
        var request : RequestParameters = new RequestParameters();
        var initialFrame : Frame= frame.next;
        request.tableIndex =  FixedSizeTypes.decodeInt(initialFrame.content, CacheIterateCodec.REQUEST_TABLE_INDEX_FIELD_OFFSET);
        request.batch =  FixedSizeTypes.decodeInt(initialFrame.content, CacheIterateCodec.REQUEST_BATCH_FIELD_OFFSET);
        request.name = StringCodec.decode(frame);
        return request;
    }


     static encodeResponse(tableIndex: number , keys: Array<Data> ) {
        var clientMessage = ClientMessage.createForEncode();
        var initialFrame : Frame = new Frame(Buffer.allocUnsafe(CacheIterateCodec.RESPONSE_INITIAL_FRAME_SIZE), ClientMessage.UNFRAGMENTED_MESSAGE);
        FixedSizeTypes.encodeInt(initialFrame.content, ClientMessage.TYPE_FIELD_OFFSET, CacheIterateCodec.RESPONSE_MESSAGE_TYPE);
        clientMessage.add(initialFrame);

        FixedSizeTypes.encodeInt(initialFrame.content, CacheIterateCodec.RESPONSE_TABLE_INDEX_FIELD_OFFSET, tableIndex);
        ListMultiFrameCodec.encode(clientMessage, keys , DataCodec.encode);
        return clientMessage;
    }

     static decodeResponse(clientMessage: ClientMessage) {
        var frame : Frame = clientMessage.get();
        var response : ResponseParameters = new ResponseParameters();
        var initialFrame : Frame = frame.next;
        response.tableIndex =  FixedSizeTypes.decodeInt(initialFrame.content, CacheIterateCodec.RESPONSE_TABLE_INDEX_FIELD_OFFSET);
        response.keys = ListMultiFrameCodec.decode(frame, DataCodec.decode);
        return response;
    }


static handle(clientMessage : ClientMessage,  toObjectFunction: (data: Data) => any = null) {
            var messageType = clientMessage.getMessageType();
            var frame : Frame = clientMessage.get();
        }
}