import * as Q from 'q';
import GetPartitionsCodec = require('./codec/GetPartitionsCodec');
import ClientMessage = require('./ClientMessage');
import Address = require('./Address');
import HazelcastClient from './HazelcastClient';

class PartitionService {

    private client: HazelcastClient;
    private partitionMap: {[partitionId: number]: Address};
    private partitionCount: number;

    constructor(client: HazelcastClient) {
        this.client = client;
    }

    initialize(): Q.Promise<PartitionService> {
        var deferred = Q.defer<PartitionService>();
        this.refresh().then(() => {
            deferred.resolve(this);
        });

        return deferred.promise;
    }

    /**
     * Refreshes the internal partition table.
     * @returns {Q.Promise<U>}
     */
    refresh(): Q.Promise<void> {
        var ownerConnection = this.client.getClusterService().getOwnerConnection();
        var clientMessage: ClientMessage = GetPartitionsCodec.encodeRequest();

        return this.client.getInvocationService()
            .invokeOnConnection(ownerConnection, clientMessage)
            .then((clientMessage: ClientMessage) => {
                this.partitionMap = GetPartitionsCodec.decodeResponse(clientMessage);
                this.partitionCount = Object.keys(this.partitionMap).length;
            });
    };

    /**
     * Returns the {@link Address} of the node which owns given partition id.
     * @param partitionId
     * @returns the address of the node.
     */
    getAddressForPartition(partitionId: number): Address {
        return this.partitionMap[partitionId];
    }

    /**
     * Computes the partition id for a given key.
     * @param key
     * @returns the partition id.
     */ath.abs(partitionHash) % this.partitionCount;
    }
}

export = PartitionService;
