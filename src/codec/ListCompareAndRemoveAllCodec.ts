/* tslint:disable */
import ClientMessage = require('../ClientMessage');
import {BitsUtil} from '../BitsUtil';
import Address = require('../Address');
import {AddressCodec} from './AddressCodec';
import {MemberCodec} from './MemberCodec';
import {Data} from '../serialization/Data';
import {EntryViewCodec} from './EntryViewCodec';
import DistributedObjectInfoCodec = require('./DistributedObjectInfoCodec');
import {ListMessageType} from './ListMessageType';

var REQUEST_TYPE = ListMessageType.LIST_COMPAREANDREMOVEALL;
var RESPONSE_TYPE = 101;
var RETRYABLE = false;


export class ListCompareAndRemoveAllCodec{



static calculateSize(name : string  , values : any ){
// Calculates the request payload size
var dataSize : number = 0;
            dataSize += BitsUtil.calculateSizeString(name);
        dataSize += BitsUtil.INT_SIZE_IN_BYTES;

        values.forEach((valuesItem : any) => {
            dataSize += BitsUtil.calculateSizeData(valuesItem);
        });
return dataSize;
}

static encodeRequest(name : string, values : any){
// Encode request into clientMessage
var clientMessage = ClientMessage.newClientMessage(this.calculateSize(name, values));
clientMessage.setMessageType(REQUEST_TYPE);
clientMessage.setRetryable(RETRYABLE);
    clientMessage.appendString(name);
    clientMessage.appendInt32(values.length);

    values.forEach((valuesItem : any) => {
    clientMessage.appendData(valuesItem);
    });

clientMessage.updateFrameLength();
return clientMessage;
}

static decodeResponse(clientMessage : ClientMessage,  toObjectFunction: (data: Data) => any = null){
// Decode response from client message
var parameters :any = { 'response' : null  };
                    parameters['response'] = clientMessage.readBoolean();
return parameters;

}


}
