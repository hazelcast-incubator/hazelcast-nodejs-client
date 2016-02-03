import {ClientMessage} from "../ClientMessage";
import {BitsUtil} from '../BitsUtil';
import {CustomCodec} from './CustomCodec';
import {AtomicReferenceMessageType} from './AtomicReferenceMessageType';

var REQUEST_TYPE = AtomicReferenceMessageType.ATOMICREFERENCE_APPLY
var RESPONSE_TYPE = 105
var RETRYABLE = false


export class AtomicReferenceApplyCodec{

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

if(clientMessage.readBool() === true){
    parameters['response'] = clientMessage.readData();
}
    return parameters;

}


}
