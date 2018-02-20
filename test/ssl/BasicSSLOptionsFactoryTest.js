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

var chai = require("chai");
var expect = chai.expect;
var Path = require('path');
var HazelcastError = require('../..').HazelcastErrors.HazelcastError;
var BasicSSLOptionsFactory = require('../../lib/connection/BasicSSLOptionsFactory').BasicSSLOptionsFactory;

describe('BasicSSLOptionsFactoryTest', function () {
    it('factory creates options object with all supported fields', function () {
        var options = {
            servername: 'foo.bar.com',
            rejectUnauthorized: true,
            certPath: Path.join(__dirname, './client1.pem'),
            caPath: Path.join(__dirname, './server1.pem'),
            ciphers: 'cipherliststring'
        };
        var factory = new BasicSSLOptionsFactory();
        return factory.init(options).then(function () {
            var optsObject = factory.getSSLOptions();
            expect(optsObject.servername).to.equal('foo.bar.com');
            expect(optsObject.rejectUnauthorized).to.be.true;
            expect(optsObject.cert).to.be.instanceOf(Buffer);
            expect(optsObject.ca).to.be.instanceOf(Buffer);
            expect(optsObject.ciphers).to.equal('cipherliststring');
        });
    });

    it('BasicSSLOptionsFactory throws when provided with non-object properties', function () {
        var factory = new BasicSSLOptionsFactory();
        return expect(factory.init.bind(factory, 3)).to.throw(HazelcastError);
    })
});
