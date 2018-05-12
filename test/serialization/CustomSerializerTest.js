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

var Config = require('../../.').Config;
var SerializationService = require('../../lib/serialization/SerializationService');
var expect = require('chai').expect;
describe('Custom Serializer', function () {
    var service;

    function CustomObject(surname) {
        this.surname = surname;
    }

    CustomObject.prototype.hzGetCustomId = function () {
        return 10;
    };
    before(function () {
        var cfg = new Config.ClientConfig();
        cfg.serializationConfig.customSerializers.push({
            getId: function () {
                return 10;
            },
            write: function (out, emp) {
                out.writeUTF(emp.surname);
            },
            read: function (inp) {
                var obj = new CustomObject();
                obj.surname = inp.readUTF();
                return obj;
            }
        });
        service = new SerializationService.SerializationServiceV1(cfg.serializationConfig);
    });

    it('write-read', function () {
        var emp = new CustomObject('iman');
        var serialized = service.toData(emp);
        var deserialized = service.toObject(serialized);
        return expect(deserialized).to.deep.equal(emp);
    });
});
