import {ClientMessage} from "../ClientMessage";
import {BitsUtil} from '../BitsUtil';
import {CustomCodec} from './CustomCodec';
import {QueueMessageType} from './QueueMessageType';

var REQUEST_TYPE = QueueMessageType.QUEUE_DRAINTO
var RESPONSE_TYPE = 106
var RETRYABLE = false


export class QueueDrainToCodec{

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
    responseSize = clientMessage.readInt();
    response = [];
    for(var responseIndex = 0 ;  responseIndex <= responseSize ; responseIndex++){
    responseItem = clientMessage.readData();
        response.push(responseItem)
    }
    parameters['response'] = response
    return parameters;

}


}
