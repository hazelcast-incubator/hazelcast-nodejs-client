import {ClientMessage} from '../../protocol/ClientMessage';
import {ListCNFixedSizeCodec} from './ListCNFixedSizeCodec';
import {BitsUtil} from '../../util/BitsUtil';
import {FixSizedTypesCodec} from './FixSizedTypesCodec';
import {HzLocalTime} from '../../core';

/** @internal */
export class ListCNLocalTimeCodec {
    static decode(clientMessage: ClientMessage): HzLocalTime[] {
        return ListCNFixedSizeCodec.decode(
            clientMessage.nextFrame(),
            BitsUtil.LOCAL_TIME_SIZE_IN_BYTES,
            FixSizedTypesCodec.decodeLocalTime
        );
    }
}
