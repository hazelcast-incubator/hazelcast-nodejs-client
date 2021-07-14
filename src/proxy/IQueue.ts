/*
 * Copyright (c) 2008-2021, Hazelcast, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ItemListener} from './ItemListener';
import {DistributedObject} from '../core';

/**
 * Concurrent, distributed, observable queue.
 *
 * Methods that require serialization/deserialization may throw RangeError, e.g when there is no suitable
 * serializer for a certain type.
 */
export interface IQueue<E> extends DistributedObject {
    /**
     * Adds given item to the end of the queue. Operation is successful only
     * if queue has required capacity.
     * @param item element to add.
     * @throws `IllegalStateError` if queue is full.
     * @return `true`.
     */
    add(item: E): Promise<boolean>;

    /**
     * Adds all items in the specified item array to this queue. If items array changes during
     * this operation, behaviour is unspecified.
     * @param items items to be added.
     * @return `true` if this queue changed, `false` otherwise.
     */
    addAll(items: E[]): Promise<boolean>;

    /**
     * Adds an item listener for this queue.
     * Listener will be invoked for any add/remove item events.
     * @param listener
     * @param includeValue `true` if updated item should be included in the event.
     * @return Registration id of the listener.
     */
    addItemListener(listener: ItemListener<E>, includeValue: boolean): Promise<string>;

    /**
     * Removes all of the elements in this queue.
     */
    clear(): Promise<void>;

    /**
     * Returns `true` if this queue contains the given item.
     * @param item
     * @return `true` if this queue containse the item, `false` otherwise.
     */
    contains(item: E): Promise<boolean>;

    /**
     * Checks if this queue contains all of the items in given array.
     * @param items
     * @return `true` if thi queue contains all items, `false` otherwise.
     */
    containsAll(items: E[]): Promise<boolean>;

    /**
     * Removes all items in this queue and add them to the end of given `arr`.
     * @param arr
     * @param maxElements maximum number of elements that would be moved.
     * @return number of items moved from this queue to the array.
     */
    drainTo(arr: E[], maxElements?: number): Promise<number>;

    /**
     * Checks if this queue contains any element.
     * @return `true` if number of elements in this queue is 0.
     */
    isEmpty(): Promise<boolean>;

    /**
     * Inserts given item at the end of the queue if there is room.
     * If queue capacity is full, offer operation fails.
     * @param item
     * @param time if specified, operation waits for `time` milliseconds for
     *         space to become available before returning false.
     * @return `true` if the item is successfully added, `false` otherwise.
     */
    offer(item: E, time?: number): Promise<boolean>;

    /**
     * Retrieves, but does not remove the head of this queue.
     * @return the head of this queue or `null` if the queue is empty.
     */
    peek(): Promise<E>;

    /**
     * Retrieves and removes the top of this queue.
     * @param time operation waits upto `time` milliseconds if this queue is empty.
     * @return the head of this queue or `null` if no element is available.
     */
    poll(time?: number): Promise<E>;

    /**
     * Inserts the item at the end of this queue. It waits to return until
     * space becomes available if neccessary.
     * @param item
     */
    put(item: E): Promise<void>;

    /**
     * Returns the number of additional items, this queue can contain.
     * @return remaining capacity or `Integer.MAX_VALUE` at server side.
     */
    remainingCapacity(): Promise<number>;

    /**
     * Removes an instance of given item from this queue.
     * @return `true` if this queue changed, `false` otherwise.
     */
    remove(item: E): Promise<boolean>;

    /**
     * Removes all items in given `items` from this queue.
     * @param items
     * @return `true` if this queue changed, `false` otherwise.
     */
    removeAll(items: E[]): Promise<boolean>;

    /**
     * Removes an item listener for this queue.
     * @param registrationId Registration id of the listener to be removed.
     * @return `true` if the item listener is removed, `false` otherwise.
     */
    removeItemListener(registrationId: string): Promise<boolean>;

    /**
     * Retains only the items that are present it given `items`.
     * @param items
     * @return `true` if this queue changed, `false` otherwise.
     */
    retainAll(items: E[]): Promise<boolean>;

    /**
     * Returns the number of items in this queue.
     * @return number of items or `Integer.MAX_VALUE` if number of elements is more than `Integer.MAX_VALUE`
     *          on server side.
     */
    size(): Promise<number>;

    /**
     * Retrieves and removes the head of this queue, waiting if necessary
     * until an element becomes available.
     * @param item
     * @return head of the queue.
     */
    take(): Promise<E>;

    /**
     * Returns an array that contains all items of this queue in proper sequence.
     */
    toArray(): Promise<E[]>;
}
