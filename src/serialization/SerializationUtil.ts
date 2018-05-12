/*
 * Copyright (c) 2008-2018, Hazelcast, Inc. All Rights Reserved.
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

import {Data} from './Data';

export function deserializeEntryList<K, V>(toObject: Function, entrySet: [Data, Data][]): [K, V][] {
    var deserializedSet: [K, V][] = [];
    entrySet.forEach(function (entry) {
        deserializedSet.push([toObject(entry[0]), toObject(entry[1])]);
    });
    return deserializedSet;
}


export function serializeList(toData: Function, input: Array<any>): Array<Data> {
    return input.map((each) => {
        return toData(each);
    });
}
