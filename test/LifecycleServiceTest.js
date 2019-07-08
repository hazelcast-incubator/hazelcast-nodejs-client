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

var RC = require('./RC');
var HazelcastClient = require('../.').Client;
var Config = require('../.').Config;
var ConfigBuilder = require('../.').ConfigBuilder;
var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');

describe('LifecycleService', function () {
    var cluster;

    before(function () {
        return RC.createCluster(null, null).then(function (res) {
            cluster = res;
            return RC.startMember(cluster.id);
        });
    });

    after(function () {
        return RC.shutdownCluster(cluster.id);
    });

    it('client should emit starting, started, shuttingDown and shutdown events in order', function (done) {
        var cfg = new Config.ClientConfig();
        var expectedState = 'starting';
        cfg.listeners.addLifecycleListener(
            function (state) {
                if (state === 'starting' && expectedState === 'starting') {
                    expectedState = 'started'
                } else if (state === 'started' && expectedState === 'started') {
                    expectedState = 'shuttingDown';
                } else if (state === 'shuttingDown' && expectedState === 'shuttingDown') {
                    expectedState = 'shutdown';
                } else if (state === 'shutdown' && expectedState === 'shutdown') {
                    done();
                } else {
                    done('Got lifecycle event ' + state + ' instead of ' + expectedState);
                }
            }
        );
        HazelcastClient.newHazelcastClient(cfg).then(function (client) {
            client.shutdown();
        });
    });

    it('event listener should get shuttingDown and shutdown events when added after startup', function (done) {
        var expectedState = 'shuttingDown';
        HazelcastClient.newHazelcastClient().then(function (client) {
            client.lifecycleService.on('lifecycleEvent', function (state) {
                if (state === 'shuttingDown' && expectedState === 'shuttingDown') {
                    expectedState = 'shutdown';
                } else if (state === 'shutdown' && expectedState === 'shutdown') {
                    done();
                } else {
                    done('Got lifecycle event ' + state + ' instead of ' + expectedState);
                }
            });
            client.shutdown();
        });
    });

    it('isRunning returns correct values at lifecycle stages', function (done) {
        HazelcastClient.newHazelcastClient().then(function (client) {
            client.lifecycleService.on('lifecycleEvent',
                function (state) {
                    if (state === 'starting') {
                        expect(client.lifecycleService.isRunning()).to.be.false;
                    } else if (state === 'started') {
                        expect(client.lifecycleService.isRunning()).to.be.true;
                    } else if (state === 'shuttingDown') {
                        expect(client.lifecycleService.isRunning()).to.be.false;
                    } else if (state === 'shutdown') {
                        expect(client.lifecycleService.isRunning()).to.be.false;
                        done();
                    } else {
                        done('Got lifecycle event ' + state + ' instead of ' + expectedState);
                    }
                }
            );
            client.shutdown();
        });
    });

    it('emitLifecycleEvent throws for invalid event', function (done) {
        HazelcastClient.newHazelcastClient().then(function (client) {
            expect(client.lifecycleService.emitLifecycleEvent.bind(client.lifecycleService, 'invalid')).to.throw(Error);
            client.shutdown();
            done();
        });
    });

    describe('DeclarativeConfiguration', function () {
        var JSON_LOCATION = path.resolve(process.cwd(), 'hazelcast-client-listener.json');
        var ENV_VARIABLE_NAME = 'HAZELCAST_CLIENT_CONFIG';

        beforeEach(function () {
            process.env[ENV_VARIABLE_NAME] = JSON_LOCATION;
        });
        
        afterEach(function () {
            try {
                fs.unlinkSync(JSON_LOCATION);
            } catch (e) {
            } finally {
                delete process.env[ENV_VARIABLE_NAME];
            }
        });
        
        it('client should emit starting, started, shuttingDown and shutdown events in order', function (done) {
            fs.writeFileSync(JSON_LOCATION, '' +
                '{' +
                '   "listeners": [' +
                '       {' +
                '           "type": "lifecycle",' +
                '           "path": "' + __filename + '",' +
                '           "exportedName": "lifecycleListener"' +
                 '       }' +
                '   ]' +
                '}');

            var expectedState = 'starting';
            exports.lifecycleListener = function (state) {
                if (state === 'starting' && expectedState === 'starting') {
                    expectedState = 'started'
                } else if (state === 'started' && expectedState === 'started') {
                    expectedState = 'shuttingDown';
                } else if (state === 'shuttingDown' && expectedState === 'shuttingDown') {
                    expectedState = 'shutdown';
                } else if (state === 'shutdown' && expectedState === 'shutdown') {
                    done();
                } else {
                    done('Got lifecycle event ' + state + ' instead of ' + expectedState);
                }
            };

            var configBuilder = new ConfigBuilder();
            configBuilder.loadConfig().then(function () {
                return HazelcastClient.newHazelcastClient(configBuilder.build()).then(function (client) {
                    return client.shutdown();
                });
            });
        });
    });
});
