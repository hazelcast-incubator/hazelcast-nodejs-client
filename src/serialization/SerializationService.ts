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

import {AggregatorFactory} from '../aggregation/AggregatorFactory';
import {ClusterDataFactory} from '../ClusterDataFactory';
import {ClusterDataFactoryHelper} from '../ClusterDataFactoryHelper';
import {SerializationConfigImpl} from '../config/SerializationConfig';
import {
    RELIABLE_TOPIC_MESSAGE_FACTORY_ID,
    ReliableTopicMessageFactory,
} from '../proxy/topic/ReliableTopicMessage';
import * as Util from '../Util';
import {Data, DataInput, DataOutput} from './Data';
import * as DefaultPredicates from './DefaultPredicates';
import {
    Serializer,
    BooleanArraySerializer,
    BooleanSerializer,
    ByteArraySerializer,
    ByteSerializer,
    CharArraySerializer,
    CharSerializer,
    DateSerializer,
    DoubleArraySerializer,
    DoubleSerializer,
    FloatArraySerializer,
    FloatSerializer,
    HazelcastJsonValueSerializer,
    IdentifiedDataSerializableSerializer,
    IntegerArraySerializer,
    IntegerSerializer,
    JavaClassSerializer,
    JsonSerializer,
    LongArraySerializer,
    LongSerializer,
    NullSerializer,
    ShortArraySerializer,
    ShortSerializer,
    StringArraySerializer,
    StringSerializer,
} from './DefaultSerializer';
import {DATA_OFFSET, HeapData} from './HeapData';
import {ObjectDataInput, PositionalObjectDataOutput} from './ObjectData';
import {PortableSerializer} from './portable/PortableSerializer';
import {PREDICATE_FACTORY_ID, PredicateFactory} from './PredicateFactory';
import {IdentifiedDataSerializableFactory} from './Serializable';
import {JsonStringDeserializationPolicy} from '../config/JsonStringDeserializationPolicy';
import {RestValueFactory, REST_VALUE_FACTORY_ID} from '../core/RestValue';

export interface SerializationService {

    toData(object: any, paritioningStrategy?: any): Data;

    toObject(data: Data): any;

    writeObject(out: DataOutput, object: any): void;

    readObject(inp: DataInput): any;

}

export class SerializationServiceV1 implements SerializationService {

    private registry: { [id: number]: Serializer };
    private serializerNameToId: { [name: string]: number };
    private serializationConfig: SerializationConfigImpl;

    constructor(serializationConfig: SerializationConfigImpl) {
        this.serializationConfig = serializationConfig;
        this.registry = {};
        this.serializerNameToId = {};
        this.registerDefaultSerializers();
        this.registerCustomSerializers();
        this.registerGlobalSerializer();
    }

    public isData(object: any): boolean {
        if (object instanceof HeapData) {
            return true;
        } else {
            return false;
        }
    }

    toData(object: any, partitioningStrategy: any = this.defaultPartitionStrategy): Data {
        if (this.isData(object)) {
            return object as Data;
        }
        const dataOutput = new PositionalObjectDataOutput(this, this.serializationConfig.isBigEndian);
        const serializer = this.findSerializerFor(object);
        // Check if object is partition aware
        if (object != null && object.getPartitionKey) {
            const partitionKey = object.getPartitionKey();
            const serializedPartitionKey = this.toData(partitionKey);
            dataOutput.writeIntBE(this.calculatePartitionHash(serializedPartitionKey, partitioningStrategy));
        } else {
            dataOutput.writeIntBE(this.calculatePartitionHash(object, partitioningStrategy));
        }
        dataOutput.writeIntBE(serializer.id);
        serializer.write(dataOutput, object);
        return new HeapData(dataOutput.toBuffer());
    }

    toObject(data: Data): any {
        if (data == null) {
            return data;
        }
        if (!data.getType) {
            return data;
        }
        const serializer = this.findSerializerById(data.getType());
        const dataInput = new ObjectDataInput(data.toBuffer(), DATA_OFFSET, this, this.serializationConfig.isBigEndian);
        return serializer.read(dataInput);
    }

    writeObject(out: DataOutput, object: any): void {
        const serializer = this.findSerializerFor(object);
        out.writeInt(serializer.id);
        serializer.write(out, object);
    }

    readObject(inp: DataInput): any {
        const serializerId = inp.readInt();
        const serializer = this.findSerializerById(serializerId);
        return serializer.read(inp);
    }

    registerSerializer(name: string, serializer: Serializer): void {
        if (this.serializerNameToId[name]) {
            throw new RangeError('Given serializer name is already in the registry.');
        }
        if (this.registry[serializer.id]) {
            throw new RangeError('Given serializer id is already in the registry.');
        }
        this.serializerNameToId[name] = serializer.id;
        this.registry[serializer.id] = serializer;
    }

    /**
     * Serialization precedence
     *  1. NULL
     *  2. DataSerializable
     *  3. Portable
     *  4. Default Types
     *      * Byte, Boolean, Character, Short, Integer, Long, Float, Double, String
     *      * Array of [Byte, Boolean, Character, Short, Integer, Long, Float, Double, String]
     *      * Java types [Date, BigInteger, BigDecimal, Class, Enum]
     *  5. Custom serializers
     *  6. Global Serializer
     *  7. Fallback (JSON)
     * @param obj
     * @returns
     */
    findSerializerFor(obj: any): Serializer {
        if (obj === undefined) {
            throw new RangeError('undefined cannot be serialized.');
        }
        let serializer: Serializer = null;
        if (obj === null) {
            serializer = this.findSerializerByName('null', false);
        }
        if (serializer === null) {
            serializer = this.lookupDefaultSerializer(obj);
        }
        if (serializer === null) {
            serializer = this.lookupCustomSerializer(obj);
        }
        if (serializer === null) {
            serializer = this.lookupGlobalSerializer();
        }
        if (serializer === null) {
            serializer = this.findSerializerByName('!json', false);
        }
        if (serializer === null) {
            throw new RangeError('There is no suitable serializer for ' + obj + '.');
        }
        return serializer;

    }

    protected lookupDefaultSerializer(obj: any): Serializer {
        let serializer: Serializer = null;
        if (this.isIdentifiedDataSerializable(obj)) {
            return this.findSerializerByName('identified', false);
        }
        if (this.isPortableSerializable(obj)) {
            return this.findSerializerByName('!portable', false);
        }
        const objectType = Util.getType(obj);
        if (objectType === 'array') {
            if (obj.length === 0) {
                serializer = this.findSerializerByName('number', true);
            } else {
                serializer = this.findSerializerByName(Util.getType(obj[0]), true);
            }
        } else {
            serializer = this.findSerializerByName(objectType, false);
        }
        return serializer;
    }

    protected lookupCustomSerializer(obj: any): Serializer {
        if (this.isCustomSerializable(obj)) {
            return this.findSerializerById(obj.hzCustomId);
        }
        return null;
    }

    protected lookupGlobalSerializer(): Serializer {
        return this.findSerializerByName('!global', false);
    }

    protected isIdentifiedDataSerializable(obj: any): boolean {
        return (obj.readData && obj.writeData
            && typeof obj.factoryId === 'number' && typeof obj.classId === 'number');
    }

    protected isPortableSerializable(obj: any): boolean {
        return (obj.readPortable && obj.writePortable
            && typeof obj.factoryId === 'number' && typeof obj.classId === 'number');
    }

    protected registerDefaultSerializers(): void {
        this.registerSerializer('string', new StringSerializer());
        this.registerSerializer('double', new DoubleSerializer());
        this.registerSerializer('byte', new ByteSerializer());
        this.registerSerializer('boolean', new BooleanSerializer());
        this.registerSerializer('null', new NullSerializer());
        this.registerSerializer('short', new ShortSerializer());
        this.registerSerializer('integer', new IntegerSerializer());
        this.registerSerializer('long', new LongSerializer());
        this.registerSerializer('float', new FloatSerializer());
        this.registerSerializer('char', new CharSerializer());
        this.registerSerializer('date', new DateSerializer());
        this.registerSerializer('byteArray', new ByteArraySerializer());
        this.registerSerializer('charArray', new CharArraySerializer());
        this.registerSerializer('booleanArray', new BooleanArraySerializer());
        this.registerSerializer('shortArray', new ShortArraySerializer());
        this.registerSerializer('integerArray', new IntegerArraySerializer());
        this.registerSerializer('longArray', new LongArraySerializer());
        this.registerSerializer('doubleArray', new DoubleArraySerializer());
        this.registerSerializer('stringArray', new StringArraySerializer());
        this.registerSerializer('javaClass', new JavaClassSerializer());
        this.registerSerializer('floatArray', new FloatArraySerializer());
        this.registerIdentifiedFactories();
        this.registerSerializer(
            '!portable',
            new PortableSerializer(this, this.serializationConfig),
        );
        if (this.serializationConfig.jsonStringDeserializationPolicy === JsonStringDeserializationPolicy.EAGER) {
            this.registerSerializer('!json', new JsonSerializer());
        } else {
            this.registerSerializer('!json', new HazelcastJsonValueSerializer());
        }
    }

    protected registerIdentifiedFactories(): void {
        const factories: { [id: number]: IdentifiedDataSerializableFactory } = {};
        for (const id in this.serializationConfig.dataSerializableFactories) {
            factories[id] = this.serializationConfig.dataSerializableFactories[id];
        }
        factories[PREDICATE_FACTORY_ID] = new PredicateFactory(DefaultPredicates);
        factories[RELIABLE_TOPIC_MESSAGE_FACTORY_ID] = new ReliableTopicMessageFactory();
        factories[ClusterDataFactoryHelper.FACTORY_ID] = new ClusterDataFactory();
        factories[AggregatorFactory.FACTORY_ID] = new AggregatorFactory();
        factories[REST_VALUE_FACTORY_ID] = new RestValueFactory();
        this.registerSerializer('identified', new IdentifiedDataSerializableSerializer(factories));
    }

    protected registerCustomSerializers(): void {
        const customSerializers = this.serializationConfig.customSerializers;
        for (const key in customSerializers) {
            const candidate = customSerializers[key];
            this.assertValidCustomSerializer(candidate);
            this.registerSerializer('!custom' + candidate.id, candidate);
        }
    }

    protected registerGlobalSerializer(): void {
        const candidate: any = this.serializationConfig.globalSerializer;
        if (candidate == null) {
            return;
        }
        this.assertValidCustomSerializer(candidate);
        this.registerSerializer('!global', candidate);
    }

    protected assertValidCustomSerializer(candidate: any): void {
        const idProp = 'id';
        const fRead = 'read';
        const fWrite = 'write';
        if (typeof candidate[idProp] !== 'number') {
            throw new TypeError('Custom serializer should have ' + idProp + ' property.');
        }
        if (typeof candidate[fRead] !== 'function' || typeof candidate[fWrite] !== 'function') {
            throw new TypeError('Custom serializer should have ' + fRead + ' and ' + fWrite + ' methods.');
        }
        const typeId = candidate[idProp];
        if (!Number.isInteger(typeId) || typeId < 1) {
            throw new TypeError('Custom serializer should have its typeId greater than or equal to 1.');
        }
    }

    protected isCustomSerializable(object: any): boolean {
        const prop = 'hzCustomId';
        return (typeof object[prop] === 'number' && object[prop] >= 1);
    }

    protected findSerializerByName(name: string, isArray: boolean): Serializer {
        let convertedName: string;
        if (name === 'number') {
            convertedName = this.serializationConfig.defaultNumberType;
        } else {
            convertedName = name;
        }
        const serializerName = convertedName + (isArray ? 'Array' : '');
        const serializerId = this.serializerNameToId[serializerName];
        if (serializerId == null) {
            return null;
        }
        return this.findSerializerById(serializerId);
    }

    protected findSerializerById(id: number): Serializer {
        const serializer = this.registry[id];
        return serializer;
    }

    protected calculatePartitionHash(object: any, strategy: Function): number {
        return strategy(object);
    }

    private defaultPartitionStrategy(obj: any): number {
        if (obj == null || !obj['getPartitionHash']) {
            return 0;
        } else {
            return obj.getPartitionHash();
        }
    }
}
