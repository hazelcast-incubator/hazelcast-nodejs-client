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

export class ClassDefinition {
    private factoryId: number;
    private classId: number;
    private version: number;
    private fields: { [name: string]: FieldDefinition } = {};

    constructor(factoryId: number, classId: number, version: number) {
        this.factoryId = factoryId;
        this.classId = classId;
        this.version = version;
    }

    addFieldDefinition(definition: FieldDefinition) {
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
        var field = this.fields[name];
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
        var field = this.fields[name];
        return field || null;
    }

    getFieldById(index: number): FieldDefinition {
        if (!Number.isInteger(index) || index < 0 || index >= this.getFieldCount()) {
            throw new RangeError(`Index: ${index}, fields count: ${this.getFieldCount()}.`);
        }
        for (var fieldName in this.fields) {
            if (this.fields[fieldName].getIndex() === index) {
                return this.fields[fieldName];
            }
        }
        throw new RangeError(`There is no field with index ${index}`);
    }


    equals(o: ClassDefinition): boolean {
        if (!(o instanceof ClassDefinition)) {
            return false;
        }
        if (o.factoryId !== this.factoryId || o.classId !== this.classId || o.version !== this.version) {
            return false;
        }
        return true;
    }
}

export class FieldDefinition {
    private index: number;
    private fieldName: string;
    private type: FieldType;
    private factoryId: number;
    private classId: number;

    constructor(index: number, fieldName: string, type: FieldType, factoryId: number, classId: number) {
        this.index = index;
        this.fieldName = fieldName;
        this.type = type;
        this.factoryId = factoryId;
        this.classId = classId;
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
}

export enum FieldType {
    PORTABLE = 0,
    BYTE = 1,
    BOOLEAN = 2,
    CHAR = 3,
    SHORT = 4,
    INT = 5,
    LONG = 6,
    FLOAT = 7,
    DOUBLE = 8,
    UTF = 9,
    PORTABLE_ARRAY = 10,
    BYTE_ARRAY = 11,
    BOOLEAN_ARRAY = 12,
    CHAR_ARRAY = 13,
    SHORT_ARRAY = 14,
    INT_ARRAY = 15,
    LONG_ARRAY = 16,
    FLOAT_ARRAY = 17,
    DOUBLE_ARRAY = 18,
    UTF_ARRAY = 19
}
