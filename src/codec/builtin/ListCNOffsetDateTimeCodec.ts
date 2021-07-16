import {ClientMessage} from '../../protocol/ClientMessage';
import {ListCNFixedSizeCodec} from './ListCNFixedSizeCodec';
import {BitsUtil} from '../../util/BitsUtil';
import {FixSizedTypesCodec} from './FixSizedTypesCodec';
import {OffsetDateTime} from '../../core';

/** @internal */
export class ListCNOffsetDateTimeCodec {
    static decode(clientMessage: ClientMessage): OffsetDateTime[] {
        return ListCNFixedSizeCodec.decode(
            clientMessage.nextFrame(),
            BitsUtil.OFFSET_DATE_TIME_SIZE_IN_BYTES,
            FixSizedTypesCodec.decodeOffsetDateTime
        );
    }
}
