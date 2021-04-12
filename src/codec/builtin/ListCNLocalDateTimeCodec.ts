import {ClientMessage} from '../../protocol/ClientMessage';
import * as Long from 'long';
import {ListCNFixedSizeCodec} from './ListCNFixedSizeCodec';
import {BitsUtil} from '../../util/BitsUtil';
import {FixSizedTypesCodec} from './FixSizedTypesCodec';
import {HzLocalDateTime} from '../../sql/DataTypes';

/** @internal */
export class ListCNLocalDateTimeCodec {

    static decode(clientMessage: ClientMessage): HzLocalDateTime[] {
        return ListCNFixedSizeCodec.decode(
            clientMessage.nextFrame(),
            BitsUtil.LOCAL_DATETIME_SIZE_IN_BYTES,
            FixSizedTypesCodec.decodeLocalDatetime
        );
    }
}
