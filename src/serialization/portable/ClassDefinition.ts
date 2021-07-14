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
/** @ignore *//** */

import {deepStrictEqual} from 'assert';
import {FieldType} from '../Portable';

/** @internal */
export class ClassDefinition {
    private readonly factoryId: number;
    private readonly classId: number;
    private readonly version: number;
    private fields: { [name: string]: FieldDefinition } = {};

    constructor(factoryId: number, classId: number, version: number) {
        this.factoryId = factoryId;
        this.classId = classId;
        this.version = version;
    }

    addFieldDefinition(definition: FieldDefinition): void {
        this.fields[definition.getName()] = definition;
    }

    getFieldCount(): number {
        return Object.keys(this.fields).length;
    }

    getFactoryId(): number {
        return this.factoryId;
    }

    getClassId(): number {
        return this.classId;
    }

    getVersion(): number {
        return this.version;
    }

    getFieldType(name: string): FieldType {
        const field = this.fields[name];
        if (field != null) {
            return field.getType();
        } else {
            throw new RangeError(`Field ${field} does not exist.`);
        }
    }

    hasField(name: string): boolean {
        return this.fields[name] != null;
    }

    getField(name: string): FieldDefinition {
        const field = this.fields[name];
        return field || null;
    }

    getFieldById(index: number): FieldDefinition {
        if (!Number.isInteger(index) || index < 0 || index >= this.getFieldCount()) {
            throw new RangeError(`Index: ${index}, fields count: ${this.getFieldCount()}.`);
        }
        for (const fieldName in this.fields) {
            if (this.fields[fieldName].getIndex() === index) {
                return this.fields[fieldName];
            }
        }
        throw new RangeError(`There is no field with index ${index}`);
    }

    getFieldNames() {
        return Object.keys(this.fields);
    }

    equals(o: ClassDefinition): boolean {
        if (!(o instanceof ClassDefinition)) {
            return false;
        }
        if (o.factoryId !== this.factoryId || o.classId !== this.classId || o.version !== this.version) {
            return false;
        }
        try {
            deepStrictEqual(o.fields, this.fields);
        } catch (e) {
            return false;
        }
        return true;
    }
}

/** @internal */
export class FieldDefinition {
    private readonly index: number;
    private readonly fieldName: string;
    private readonly type: FieldType;
    private readonly factoryId: number;
    private readonly classId: number;
    private readonly version: number;

    constructor(index: number, fieldName: string, type: FieldType, version: number, factoryId = 0, classId = 0) {
        this.index = index;
        this.fieldName = fieldName;
        this.type = type;
        this.factoryId = factoryId;
        this.classId = classId;
        this.version = version;
    }

    getType(): FieldType {
        return this.type;
    }

    getName(): string {
        return this.fieldName;
    }

    getIndex(): number {
        return this.index;
    }

    getClassId(): number {
        return this.classId;
    }

    getFactoryId(): number {
        return this.factoryId;
    }

    getVersion(): number {
        return this.version;
    }
}
