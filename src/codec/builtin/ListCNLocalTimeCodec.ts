import {ClientMessage} from '../../protocol/ClientMessage';
import {ListCNFixedSizeCodec} from './ListCNFixedSizeCodec';
import {BitsUtil} from '../../util/BitsUtil';
import {FixSizedTypesCodec} from './FixSizedTypesCodec';
import {HzLocalTime} from '../../sql/DataTypes';

/** @internal */
export class ListCNLocalTimeCodec {

    static encode(clientMessage: ClientMessage, items: HzLocalTime[]): void {
        ListCNFixedSizeCodec.encode(clientMessage, items, BitsUtil.LOCAL_TIME_SIZE_IN_BYTES, FixSizedTypesCodec.encodeLocalTime);
    }

    static decode(clientMessage: ClientMessage): HzLocalTime[] {
        return ListCNFixedSizeCodec.decode(
            clientMessage.nextFrame(),
            BitsUtil.LOCAL_TIME_SIZE_IN_BYTES,
            FixSizedTypesCodec.decodeLocalTime
        );
    }
}
