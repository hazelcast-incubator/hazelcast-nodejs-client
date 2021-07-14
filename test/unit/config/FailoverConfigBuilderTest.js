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

const { expect } = require('chai');
const { HazelcastError, InvalidConfigurationError } = require('../../../lib');
const { FailoverConfigBuilder } = require('../../../lib/config/FailoverConfigBuilder');
const { ClientConfigImpl } = require('../../../lib/config/Config');

describe('FailoverConfigBuilderTest', function () {

    it('should throw for non-number tryCount', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 'foo',
            clientConfigs: [{}, {}]
        });

        expect(() => builder.build()).to.throw(HazelcastError);
    });

    it('should throw for negative tryCount', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: -1,
            clientConfigs: [{}, {}]
        });

        expect(() => builder.build()).to.throw(HazelcastError);
    });

    it('should set tryCount to Number.MAX_SAFE_INTEGER by default', function () {
        const builder = new FailoverConfigBuilder({
            clientConfigs: [{}, {}]
        });

        const config = builder.build();
        expect(config.tryCount).to.be.equal(Number.MAX_SAFE_INTEGER);
    });

    it('should throw for empty client configs list', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 1,
            clientConfigs: []
        });

        expect(() => builder.build()).to.throw(HazelcastError);
    });

    it('should throw for missing client configs list', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 1
        });

        expect(() => builder.build()).to.throw(HazelcastError);
    });

    it('should build valid client config for single empty object', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 42,
            clientConfigs: [{}]
        });

        const config = builder.build();
        expect(config.tryCount).to.be.equal(42);
        expect(config.clientConfigs).to.have.lengthOf(1);
        expect(config.clientConfigs[0]).to.be.instanceOf(ClientConfigImpl);
    });

    it('should build valid client config for single non-empty object', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 24,
            clientConfigs: [{
                clusterName: 'foobar'
            }]
        });

        const config = builder.build();
        expect(config.tryCount).to.be.equal(24);
        expect(config.clientConfigs).to.have.lengthOf(1);
        expect(config.clientConfigs[0]).to.be.instanceOf(ClientConfigImpl);
        expect(config.clientConfigs[0].clusterName).to.be.equal('foobar');
    });

    it('should build valid client config for objects with allowed different non-Cloud options', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 1,
            clientConfigs: [
                {
                    clusterName: 'foobar',
                    customCredentials: { foo: 'bar' },
                    network: {
                        clusterMembers: ['foo'],
                        ssl: {
                            enabled: true
                        }
                    }
                },
                {
                    clusterName: 'barbaz',
                    customCredentials: { bar: 'baz' },
                    network: {
                        clusterMembers: ['bar'],
                        ssl: {
                            enabled: false
                        }
                    }
                }
            ]
        });

        const config = builder.build();
        expect(config.clientConfigs).to.have.lengthOf(2);
        expect(config.clientConfigs[0]).to.be.instanceOf(ClientConfigImpl);
        expect(config.clientConfigs[1]).to.be.instanceOf(ClientConfigImpl);
    });

    it('should build valid client config for objects with allowed different Cloud options', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 1,
            clientConfigs: [
                {
                    network: {
                        hazelcastCloud: {
                            discoveryToken: 'FOO'
                        }
                    }
                },
                {
                    network: {
                        hazelcastCloud: {
                            discoveryToken: 'BAR'
                        }
                    }
                }
            ]
        });

        const config = builder.build();
        expect(config.clientConfigs).to.have.lengthOf(2);
        expect(config.clientConfigs[0]).to.be.instanceOf(ClientConfigImpl);
        expect(config.clientConfigs[1]).to.be.instanceOf(ClientConfigImpl);
    });

    it('should throw for config objects with forbidden different options', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 1,
            clientConfigs: [
                {
                    network: {
                        connectionTimeout: 1
                    }
                },
                {
                    network: {
                        connectionTimeout: 2
                    }
                }
            ]
        });

        expect(() => builder.build()).to.throw(HazelcastError);
    });

    it('should throw for config objects with different root-level options', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 1,
            clientConfigs: [
                {},
                {
                    customLogger: {}
                }
            ]
        });

        expect(() => builder.build()).to.throw(HazelcastError);
    });

    it('should throw for config objects with different nested options', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 1,
            clientConfigs: [
                {
                    network: {
                        connectionTimeout: 1
                    }
                },
                {
                    network: {
                        connectionTimeout: 2
                    }
                }
            ]
        });

        expect(() => builder.build()).to.throw(HazelcastError);
    });

    it('should throw for config objects with different properties', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 1,
            clientConfigs: [
                {
                    properties: {
                        'hazelcast.logging.level': 'DEBUG'
                    }
                },
                {}
            ]
        });

        expect(() => builder.build()).to.throw(HazelcastError);
    });

    it('should throw for config objects with different listeners', function () {
        const builder = new FailoverConfigBuilder({
            tryCount: 1,
            clientConfigs: [
                {
                    lifecycleListeners: [ () => console.log('foo') ]
                },
                {
                    lifecycleListeners: [ () => console.log('bar') ]
                }
            ]
        });

        expect(() => builder.build()).to.throw(HazelcastError);
    });

    it('should build valid client config for objects with equal listeners', function () {
        const listener1 = () => console.log('foo');
        const listener2 = () => console.log('bar');
        const builder = new FailoverConfigBuilder({
            tryCount: 1,
            clientConfigs: [
                {
                    lifecycleListeners: [ listener1, listener2 ]
                },
                {
                    lifecycleListeners: [ listener1, listener2 ]
                }
            ]
        });

        const config = builder.build();
        expect(config.clientConfigs).to.have.lengthOf(2);
        expect(config.clientConfigs[0]).to.be.instanceOf(ClientConfigImpl);
        expect(config.clientConfigs[1]).to.be.instanceOf(ClientConfigImpl);
    });

    it('should throw InvalidConfigurationError when invalid config key is passed', function () {
        const listener1 = () => console.log('foo');
        const builder = new FailoverConfigBuilder({
            tryCount: 1,
            clientCofigs: [
                {
                    lifecycleListeners: [ listener1 ]
                }
            ]
        });

        expect((() => {
            builder.build();
        })).to.throw(InvalidConfigurationError);
    });
});
