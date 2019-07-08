/*
 * Copyright (c) 2008-2019, Hazelcast, Inc. All Rights Reserved.
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

var expect = require('chai').expect;
var SerializationService = require('../../lib/serialization/SerializationService').SerializationServiceV1;
var IdentifiedEntryProcessor = require('../javaclasses/IdentifiedEntryProcessor');
var ConfigBuilder = require('../../').ConfigBuilder;
var path = require('path');
var fs = require('fs');

describe('SerializationServiceTest', function () {

    var JSON_LOCATION = path.resolve(process.cwd(), 'hazelcast-client-serialization-service.json');
    var ENV_VARIABLE_NAME = 'HAZELCAST_CLIENT_CONFIG';

    before(function () {
        process.env[ENV_VARIABLE_NAME] = JSON_LOCATION;
    });

    after(function () {
       delete process.env[ENV_VARIABLE_NAME];
    });

    afterEach(function () {
        try {
            fs.unlinkSync(JSON_LOCATION);
        } catch (e) {
        }
    });

    it('adds data serializable factory by its name', function () {
        fs.writeFileSync(JSON_LOCATION, '' +
            '{' +
            '   "serialization": {' +
            '       "dataSerializableFactories": [' +
            '           {' +
            '               "path": "' + __filename + '",' +
            '               "exportedName": "IDataSerializableFactory",' +
            '               "factoryId": 1' +
            '           }' +
            '       ]' +
            '   }' +
            '}');

        var configBuilder = new ConfigBuilder();
        return configBuilder.loadConfig().then(function () {
            var serializationConfig = configBuilder.build().serializationConfig;

            var serializationService = new SerializationService(undefined, serializationConfig);

            var data = serializationService.toData(new IDataSerializable(3));
            var object = serializationService.toObject(data);

            expect(object.val).to.equal(3);
        });
    });

    it('adds portable factory by its name', function () {
        fs.writeFileSync(JSON_LOCATION, '' +
            '{' +
            '   "serialization": {' +
            '       "portableFactories": [' +
            '           {' +
            '               "path": "' + __filename + '",' +
            '               "exportedName": "PortableFactory",' +
            '               "factoryId": 2' +
            '           }' +
            '       ]' +
            '   }' +
            '}');

        var configBuilder = new ConfigBuilder();
        return configBuilder.loadConfig().then(function () {
            var serializationConfig = configBuilder.build().serializationConfig;

            var serializationService = new SerializationService(undefined, serializationConfig);

            var data = serializationService.toData(new Portable(3));
            var object = serializationService.toObject(data);

            expect(object.val).to.equal(3);
        });
    });

    it('adds custom serializer by its name', function () {
        fs.writeFileSync(JSON_LOCATION, '' +
            '{' +
            '   "serialization": {' +
            '       "serializers": [' +
            '           {' +
            '               "path": "' + __filename + '",' +
            '               "exportedName": "CustomSerializer",' +
            '               "typeId": 44' +
            '           }' +
            '       ]' +
            '   }' +
            '}');

        var configBuilder = new ConfigBuilder();
        return configBuilder.loadConfig().then(function () {
            var serializationConfig = configBuilder.build().serializationConfig;

            var serializationService = new SerializationService(undefined, serializationConfig);

            var data = serializationService.toData(new CustomObject(3));
            var object = serializationService.toObject(data);

            expect(object.val).to.equal(3);
            expect(object.self).to.equal(object);
        });

    });

    it('adds global serializer by its name', function () {
        fs.writeFileSync(JSON_LOCATION, '' +
            '{' +
            '   "serialization": {' +
            '       "globalSerializer": {' +
            '           "path": "' + __filename + '",' +
            '           "exportedName": "GlobalSerializer"' +
            '       }' +
            '   }' +
            '}');

        var configBuilder = new ConfigBuilder();
        return configBuilder.loadConfig().then(function () {
            var serializationConfig = configBuilder.build().serializationConfig;

            var serializationService = new SerializationService(undefined, serializationConfig);

            var data = serializationService.toData(new AnyObject(3));
            var object = serializationService.toObject(data);

            expect(object.val).to.equal(3);
            expect(object.self).to.equal(object);
        });
    });

    it('adds identified factory without named export', function () {
        fs.writeFileSync(JSON_LOCATION, '' +
            '{' +
            '   "serialization": {' +
            '       "dataSerializableFactories": [' +
            '           {' +
            '               "path": "' + path.resolve(__filename, '../../javaclasses/IdentifiedFactory.js') + '",' +
            '               "factoryId": 66' +
            '           }' +
            '       ]' +
            '   }' +
            '}');

        var configBuilder = new ConfigBuilder();
        return configBuilder.loadConfig().then(function () {
            var serializationConfig = configBuilder.build().serializationConfig;

            var serializationService = new SerializationService(undefined, serializationConfig);

            var data = serializationService.toData(new IdentifiedEntryProcessor('x'));
            var object = serializationService.toObject(data);

            expect(object.value).to.equal('x');
        });
    })
});

function IDataSerializable(val) {
    this.val = val;
}

IDataSerializable.prototype.readData = function (input) {
    this.val = input.readInt();
};

IDataSerializable.prototype.writeData = function (output) {
    output.writeInt(this.val);
};

IDataSerializable.prototype.getClassId = function () {
    return 11;
};

IDataSerializable.prototype.getFactoryId = function () {
    return 1;
};

function IDataSerializableFactory() {

}

IDataSerializableFactory.prototype.create = function (type) {
    if (type === 11) {
        return new IDataSerializable();
    }
};

function Portable(val) {
    this.val = val;
}

Portable.prototype.getClassId = function () {
    return 22;
};

Portable.prototype.getFactoryId = function () {
    return 2;
};

Portable.prototype.readPortable = function (reader) {
    this.val = reader.readInt('val');
};

Portable.prototype.writePortable = function (writer) {
    writer.writeInt('val', this.val);
};

function PortableFactory() {

}

PortableFactory.prototype.create = function (classId) {
    if (classId === 22) {
        return new Portable();
    }
};

function AnyObject(val) {
    this.val = val;
    this.self = this;//putting a reference to self so json serializer cannot be used. making sure global serializer is used in test.
}

function GlobalSerializer() {

}

GlobalSerializer.prototype.getId = function () {
    return 33;
};

GlobalSerializer.prototype.read = function (inp) {
    var obj = new AnyObject();
    obj.val = inp.readInt();
    return obj;
};

GlobalSerializer.prototype.write = function (outp, obj) {
    outp.writeInt(obj.val);
};

function CustomObject(val) {
    this.val = val;
    this.self = this;//putting a reference to self so json serializer cannot be used. making sure global serializer is used in test.
}

CustomObject.prototype.hzGetCustomId = function () {
    return 44;
};

function CustomSerializer() {

}

CustomSerializer.prototype.getId = function () {
    return 44;
};

CustomSerializer.prototype.read = function (reader) {
    var obj = new CustomObject();
    obj.val = reader.readInt();
    return obj;
};

CustomSerializer.prototype.write = function (writer, obj) {
    writer.writeInt(obj.val);
};


exports.IDataSerializableFactory = IDataSerializableFactory;
exports.PortableFactory = PortableFactory;
exports.GlobalSerializer = GlobalSerializer;
exports.CustomSerializer = CustomSerializer;
