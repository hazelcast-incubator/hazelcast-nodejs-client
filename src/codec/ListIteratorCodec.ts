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

var REQUEST_TYPE = ListMessageType.LIST_ITERATOR;
var RESPONSE_TYPE = 106;
var RETRYABLE = true;


export class ListIteratorCodec{



static calculateSize(name : string ){
// Calculates the request payload size
var dataSize : number = 0;
            dataSize += BitsUtil.calculateSizeString(name);
return dataSize;
}

static encodeRequest(name : string){
// Encode request into clientMessage
var clientMessage = ClientMessage.newClientMessage(this.calculateSize(name));
clientMessage.setMessageType(REQUEST_TYPE);
clientMessage.setRetryable(RETRYABLE);
    clientMessage.appendString(name);
clientMessage.updateFrameLength();
return clientMessage;
}

static decodeResponse(clientMessage : ClientMessage,  toObjectFunction: (data: Data) => any = null){
// Decode response from client message
var parameters :any = { 'response' : null  };
        var responseSize = clientMessage.readInt32();
            var response : any = [];
                    for(var responseIndex = 0 ;  responseIndex < responseSize ; responseIndex++){
        var responseItem : Data;
                    responseItem = clientMessage.readData();
        response.push(responseItem)
        }
            parameters['response'] = response;
return parameters;

}


}
