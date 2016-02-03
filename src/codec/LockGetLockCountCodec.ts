import {ClientMessage} from "../ClientMessage";
import {BitsUtil} from '../BitsUtil';
import {CustomCodec} from './CustomCodec';
import {LockMessageType} from './LockMessageType';

var REQUEST_TYPE = LockMessageType.LOCK_GETLOCKCOUNT
var RESPONSE_TYPE = 102
var RETRYABLE = true


export class LockGetLockCountCodec{

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
    parameters['response'] = clientMessage.readInt();
    return parameters;

}


}
