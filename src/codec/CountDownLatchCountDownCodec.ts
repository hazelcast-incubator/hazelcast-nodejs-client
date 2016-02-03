import {ClientMessage} from "../ClientMessage";
import {BitsUtil} from '../BitsUtil';
import {CustomCodec} from './CustomCodec';
import {CountDownLatchMessageType} from './CountDownLatchMessageType';

var REQUEST_TYPE = CountDownLatchMessageType.COUNTDOWNLATCH_COUNTDOWN
var RESPONSE_TYPE = 100
var RETRYABLE = false


export class CountDownLatchCountDownCodec{

constructor() {
}




static calculateSize(name){
    // Calculates the request payload size
    var dataSize = 0;
    dataSize += BitsUtil.calculateSizeStr(name);
    return dataSize;
}

static encodeRequest(name){
    // Encode request into clientMessage
    var payloadSize;
    var clientMessage = new ClientMessage(payloadSize=this.calculateSize(name));
    clientMessage.setMessageType(REQUEST_TYPE);
    clientMessage.setRetryable(RETRYABLE);
    clientMessage.appendStr(name);
    clientMessage.updateFrameLength();
    return clientMessage;
}

static decodeResponse(clientMessage){
    // Decode response from client message
    var parameters;
    return parameters;

}


}
