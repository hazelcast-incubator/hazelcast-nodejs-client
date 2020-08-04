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

import {DataInput, DataOutput} from './Data';
import {PortableReader, PortableWriter} from './portable/PortableSerializer';

export interface IdentifiedDataSerializable {

    factoryId: number;

    classId: number;

    readData(input: DataInput): any;

    writeData(output: DataOutput): void;

}

export interface IdentifiedDataSerializableFactory {

    create(type: number): IdentifiedDataSerializable;

}

export interface Portable {

    factoryId: number;

    classId: number;

    readPortable(reader: PortableReader): void;

    writePortable(writer: PortableWriter): void;

}

export interface VersionedPortable extends Portable {

    version: number;

}

export interface PortableFactory {

    create(classId: number): Portable;

}

export interface CustomSerializable {

    /**
     * Custom serializable id. Should match custom serializer's id.
     */
    hzCustomId: number;

}
