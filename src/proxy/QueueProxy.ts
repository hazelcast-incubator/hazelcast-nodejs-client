import {IQueue} from './IQueue';
import {ItemEventType, ItemListener} from '../core/ItemListener';
import {PartitionSpecificProxy} from './PartitionSpecificProxy';
import {QueueSizeCodec} from '../codec/QueueSizeCodec';
import {QueueOfferCodec} from '../codec/QueueOfferCodec';
import {QueuePeekCodec} from '../codec/QueuePeekCodec';
import * as Promise from 'bluebird';
import {QueuePollCodec} from '../codec/QueuePollCodec';
import {QueueRemainingCapacityCodec} from '../codec/QueueRemainingCapacityCodec';
import {QueueRemoveCodec} from '../codec/QueueRemoveCodec';
import {QueueContainsCodec} from '../codec/QueueContainsCodec';
import {QueueIteratorCodec} from '../codec/QueueIteratorCodec';
import {Data} from '../serialization/Data';
import {QueueClearCodec} from '../codec/QueueClearCodec';
import {QueueDrainToCodec} from '../codec/QueueDrainToCodec';
import {QueueDrainToMaxSizeCodec} from '../codec/QueueDrainToMaxSizeCodec';
import {QueueIsEmptyCodec} from '../codec/QueueIsEmptyCodec';
import {QueueTakeCodec} from '../codec/QueueTakeCodec';
import {QueueAddAllCodec} from '../codec/QueueAddAllCodec';
import {QueueContainsAllCodec} from '../codec/QueueContainsAllCodec';
import {QueuePutCodec} from '../codec/QueuePutCodec';
import {QueueCompareAndRemoveAllCodec} from '../codec/QueueCompareAndRemoveAllCodec';
import {QueueCompareAndRetainAllCodec} from '../codec/QueueCompareAndRetainAllCodec';
import {QueueAddListenerCodec} from '../codec/QueueAddListenerCodec';
import {QueueRemoveListenerCodec} from '../codec/QueueRemoveListenerCodec';
import {IllegalStateError} from '../HazelcastError';
import ClientMessage = require('../ClientMessage');

export class QueueProxy<E> extends PartitionSpecificProxy implements IQueue<E> {

    add(item: E): Promise<boolean> {
        return this.offer(item).then(function(ret) {
            if (ret) {
                return true;
            } else {
                throw new IllegalStateError('Queue is full.');
            }
        });
    }

    addAll(items: E[]): Promise<boolean> {
        var rawList: Data[] = [];
        var toData = this.toData.bind(this);
        items.forEach(function(item) {
            rawList.push(toData(item));
        });
        return this.encodeInvoke<boolean>(QueueAddAllCodec, rawList);
    }

    addItemListener(listener: ItemListener<E>, includeValue: boolean): Promise<string> {
        var encodeFunc = (localOnly: boolean) => {
            return QueueAddListenerCodec.encodeRequest(this.name, includeValue, localOnly);
        };
        var handler = (message: ClientMessage) => {
            QueueAddListenerCodec.handle(message, (item: Data, uuid: string, eventType: number) => {
                var responseObject: E;
                if (item == null) {
                    responseObject = null;
                } else {
                    responseObject = this.toObject(item);
                }
                if (eventType === ItemEventType.ADDED) {
                    listener.itemAdded(responseObject, null, eventType);
                } else if (eventType === ItemEventType.REMOVED) {
                    listener.itemRemoved(responseObject, null, eventType);
                }
            });
        };
        return this.client.getListenerService().registerListener(encodeFunc, handler, QueueAddListenerCodec.decodeResponse);
    }

    clear(): Promise<void> {
        return this.encodeInvoke<void>(QueueClearCodec);
    }

    contains(item: E): Promise<boolean> {
        var itemData = this.toData(item);
        return this.encodeInvoke<boolean>(QueueContainsCodec, itemData);
    }

    containsAll(items: E[]): Promise<boolean> {
        var toData = this.toData.bind(this);
        var rawItems: Data[] = items.map<Data>(toData);
        return this.encodeInvoke<boolean>(QueueContainsAllCodec, rawItems);
    }

    drainTo(arr: E[], maxElements: number = null): Promise<number> {
        var toObject = this.toObject.bind(this);
        var promise: Promise<any>;
        if (maxElements === null) {
            promise = this.encodeInvoke<any>(QueueDrainToCodec);
        } else {
            promise = this.encodeInvoke<any>(QueueDrainToMaxSizeCodec, maxElements);
        }
        return promise.then(function(rawArr: Data[]) {
            rawArr.forEach(function (rawItem) {
                arr.push(toObject(rawItem));
            });
            return rawArr.length;
        });
    }

    isEmpty(): Promise<boolean> {
        return this.encodeInvoke<boolean>(QueueIsEmptyCodec);
    }

    offer(item: E, time: number = 0): Promise<boolean> {
        var itemData = this.toData(item);
        return this.encodeInvoke<boolean>(QueueOfferCodec, itemData, time);
    }

    peek(): Promise<E> {
        return this.encodeInvoke<E>(QueuePeekCodec);
    }

    poll(time: number = 0): Promise<E> {
        return this.encodeInvoke<E>(QueuePollCodec, time);
    }

    put(item: E): Promise<void> {
        var itemData = this.toData(item);
        return this.encodeInvoke<void>(QueuePutCodec, itemData);
    }

    remainingCapacity(): Promise<number> {
        return this.encodeInvoke<number>(QueueRemainingCapacityCodec);
    }

    remove(item: E): Promise<boolean> {
        var itemData = this.toData(item);
        return this.encodeInvoke<boolean>(QueueRemoveCodec, itemData);
    }

    removeAll(items: E[]): Promise<boolean> {
        var toData = this.toData.bind(this);
        var rawItems = items.map<Data>(toData);
        return this.encodeInvoke<boolean>(QueueCompareAndRemoveAllCodec, rawItems);
    }

    removeItemListener(registrationId: string): Promise<boolean> {
        var encodeFunc = (serverKey: string) => {
            return QueueRemoveListenerCodec.encodeRequest(this.name, serverKey);
        };
        return this.client.getListenerService().deregisterListener(
            encodeFunc,
            QueueRemoveListenerCodec.decodeResponse,
            registrationId
        );
    }

    retainAll(items: E[]): Promise<boolean> {
        var toData = this.toData.bind(this);
        var rawItems = items.map<Data>(toData);
        return this.encodeInvoke<boolean>(QueueCompareAndRetainAllCodec, rawItems);
    }

    size(): Promise<number> {
        return this.encodeInvoke<number>(QueueSizeCodec);
    }

    take(): Promise<E> {
        return this.encodeInvoke<E>(QueueTakeCodec);
    }

    toArray(): Promise<E[]> {
        var arr: E[] = [];
        var toObject = this.toObject.bind(this);
        return this.encodeInvoke<Data[]>(QueueIteratorCodec).then(function(dataArray) {
            dataArray.forEach(function(data) {
                arr.push(toObject(data));
            });
            return arr;
        });
    }
}
