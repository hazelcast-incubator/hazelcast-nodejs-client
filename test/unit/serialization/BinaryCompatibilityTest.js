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
'use strict';

const fs = require('fs');
const { ObjectDataInput } = require('../../../lib/serialization/ObjectData');
const { HeapData } = require('../../../lib/serialization/HeapData');
const ReferenceObjects = require('./ReferenceObjects');
const { SerializationServiceV1 } = require('../../../lib/serialization/SerializationService');
const { SerializationConfigImpl } = require('../../../lib/config/SerializationConfig');

const AnInnerPortable = require('./AnInnerPortable');
const AnIdentifiedDataSerializable = require('./AnIdentifiedDataSerializable');
const APortable = require('./APortable');
const { CustomByteArraySerializable } = require('./CustomSerializable');
const { CustomStreamSerializable } = require('./CustomSerializable');
const { expectAlmostEqual } = require('../../TestUtil');

describe('BinaryCompatibilityTest', function () {

    const NULL_LENGTH = -1;
    const versions = [1];
    const objects = ReferenceObjects.testObjects;
    const isBigEndianValues = [true, false];

    const dataMap = {};

    function createFileName(version) {
        return version + '.serialization.compatibility.binary';
    }

    function convertEndiannesToByteOrder(isBigEndian) {
        if (isBigEndian) {
            return 'BIG_ENDIAN';
        } else {
            return 'LITTLE_ENDIAN';
        }
    }

    function stripArticle(name) {
        if (name.startsWith('an')) {
            return name.slice(2);
        } else if (name.startsWith('a')) {
            return name.slice(1);
        } else {
            if (name.endsWith('s')) {
                return name.slice(0, -1) + '[]';
            } else {
                return name;
            }
        }
    }

    function createObjectKey(varName, version, isBigEndian) {
        return version + '-' + stripArticle(varName) + '-' + convertEndiannesToByteOrder(isBigEndian);
    }

    function createSerializationService(isBigEndian, defaultNumberType) {
        const cfg = new SerializationConfigImpl();
        cfg.portableFactories[ReferenceObjects.PORTABLE_FACTORY_ID] =
            (classId) => {
                if (classId === ReferenceObjects.INNER_PORTABLE_CLASS_ID) {
                    return new AnInnerPortable();
                } else if (classId === ReferenceObjects.PORTABLE_CLASS_ID) {
                    return new APortable();
                }
            };
        cfg.dataSerializableFactories[ReferenceObjects.IDENTIFIED_DATA_SERIALIZABLE_FACTORY_ID] =
            (classId) => {
                if (classId === ReferenceObjects.IDENTIFIED_DATA_SERIALIZABLE_CLASS_ID) {
                    return new AnIdentifiedDataSerializable();
                }
            };
        cfg.customSerializers = [
            {
                id: ReferenceObjects.CUSTOM_BYTE_ARRAY_SERIALIZABLE_ID,
                write: (out, obj) => {
                    out.writeInt(8);
                    out.writeInt(obj.i);
                    out.writeFloat(obj.f);
                },
                read: (inp) => {
                    const buf = inp.readByteArray();
                    return new CustomByteArraySerializable(buf.readInt32BE(0), buf.readFloatBE(4));
                }
            },
            {
                id: ReferenceObjects.CUSTOM_STREAM_SERIALIZABLE_ID,
                write: (out, obj) => {
                    out.writeInt(obj.int);
                    out.writeFloat(obj.float);
                },
                read: (inp) => {
                    return new CustomStreamSerializable(inp.readInt(), inp.readFloat());
                }
            }
        ];
        cfg.isBigEndian = isBigEndian;
        cfg.defaultNumberType = defaultNumberType;
        return new SerializationServiceV1(cfg);
    }

    before(function () {
        versions.forEach((version) => {
            const input = new ObjectDataInput(fs.readFileSync(__dirname + '/' + createFileName(version)), 0, null, true, true);
            while (input.available() > 0) {
                const utflen = input.readUnsignedShort();
                const namebuf = input.readRaw(utflen);
                const objectKey = namebuf.toString();
                const len = input.readInt();
                if (len !== NULL_LENGTH) {
                    const otherBuffer = input.readRaw(len);
                    dataMap[objectKey] = new HeapData(otherBuffer);
                }
            }
            dataMap[version + '-NULL-' + convertEndiannesToByteOrder(true)] = new HeapData(null);
            dataMap[version + '-NULL-' + convertEndiannesToByteOrder(false)] = new HeapData(null);
        });
    });

    for (const varName in objects) {
        const object = objects[varName];
        if (Object.prototype.hasOwnProperty.call(objects, varName)) {
            versions.forEach((version) => {
                isBigEndianValues.forEach((isBigEndian) => {
                    it(varName + '-' + convertEndiannesToByteOrder(isBigEndian) + '-' + version, function () {
                        const key = createObjectKey(varName, version, isBigEndian);
                        const service = createSerializationService(isBigEndian, 'integer');
                        const deserialized = service.toObject(dataMap[key]);
                        expectAlmostEqual(deserialized, object);
                    });

                    if (!ReferenceObjects.skipOnSerialize[varName]) {
                        it(varName + '-' + convertEndiannesToByteOrder(isBigEndian) + '-' + version + ' serialize deserialize',
                            function () {
                                const service = createSerializationService(isBigEndian, stripArticle(varName).toLowerCase());
                                const data = service.toData(object);
                                const deserialized = service.toObject(data);
                                expectAlmostEqual(deserialized, object);
                            }
                        );
                    }
                });
            });
        }
    }
});
