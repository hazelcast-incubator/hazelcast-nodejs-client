/*
 * Copyright (c) 2008-2020, Hazelcast, Inc. All Rights Reserved.
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

import {Member} from './Member';

/**
 * Item event listener for IQueue, ISet, IList.
 */
export interface ItemListener<E> {

    /**
     * Triggered when an item is added.
     */
    itemAdded?: ItemEventListener<E>;

    /**
     * Triggered when an item is removed.
     */
    itemRemoved?: ItemEventListener<E>;

}

/**
 * Item event hander function.
 */
export type ItemEventListener<E> = (itemEvent: ItemEvent<E>) => void;

/**
 * IQueue, ISet, IList item event.
 */
/**
 * IQueue, ISet, IList item event.
 */
export interface ItemEvent<E> {

    /**
     * The name of the data structure for this event.
     */
    name: string;

    /**
     * The value of the item event.
     */
    item: E;

    /**
     * The event type.
     */
    eventType: ItemEventType;

    /**
     * The member that fired this event.
     */
    member: Member;

}

export class ItemEventImpl<E> implements ItemEvent<E> {

    name: string;
    item: E;
    eventType: ItemEventType;
    member: Member;

    constructor(name: string, itemEventType: ItemEventType, item: E, member: Member) {
        this.name = name;
        this.eventType = itemEventType;
        this.item = item;
        this.member = member;
    }

}

/**
 * Item event type.
 */
export enum ItemEventType {

    /**
     * Item was added.
     */
    ADDED = 'ADDED',

    /**
     * Item was removed.
     */
    REMOVED = 'REMOVED',

}

export const itemEventTypeFromId = (typeId: number): ItemEventType => {
    switch (typeId) {
        case 1:
            return ItemEventType.ADDED;
        case 2:
            return ItemEventType.REMOVED;
        default:
            throw new TypeError('Unexpected type id: ' + typeId);
    }
}
