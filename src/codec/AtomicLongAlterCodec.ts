import {ClientMessage} from "../ClientMessage";
import {BitsUtil} from '../BitsUtil';
import {CustomCodec} from './CustomCodec';
import {AtomicLongMessageType} from './AtomicLongMessageType';

var REQUEST_TYPE = AtomicLongMessageType.ATOMICLONG_ALTER
var RESPONSE_TYPE = 100
var RETRYABLE = false


export class AtomicLongAlterCodec{

constructor() {
}




static calculateSize(name, arr){
    // Calculates the request payload size
    var dataSize = 0;
    dataSize += BitsUtil.calculateSizeStr(name);
    dataSize += BitsUtil.calculateSizeData(arr);
    return dataSize;
}

static encodeRequest(name, arr){
    // Encode request into clientMessage
    var payloadSize;
    var clientMessage = new ClientMessage(payloadSize=this.calculateSize(name, arr));
    clientMessage.setMessageType(REQUEST_TYPE);
    clientMessage.setRetryable(RETRYABLE);
    clientMessage.appendStr(name);
    clientMessage.appendData(arr);
    clientMessage.updateFrameLength();
    return clientMessage;
}

static decodeResponse(clientMessage){
    // Decode response from client message
    var parameters;
    return parameters;

}


}
