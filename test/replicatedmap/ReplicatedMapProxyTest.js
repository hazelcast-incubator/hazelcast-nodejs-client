'use strict';

var expect = require('chai').expect;
var HazelcastClient = require('../../lib/index.js').Client;
var Controller = require('./../RC');
var Util = require('./../Util');
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var Predicates = require('../../lib/index.js').Predicates;

describe('ReplicatedMap Proxy', function () {

    var cluster;
    var client;
    var rm;
    var ONE_HOUR = 3600000;

    before(function () {
        this.timeout(10000);
        var config = fs.readFileSync(path.join(__dirname, 'hazelcast_replicatedmap.xml'), 'utf8');
        return Controller.createCluster(null, config).then(function (response) {
            cluster = response;
            return Controller.startMember(cluster.id);
        }).then(function () {
            return HazelcastClient.newHazelcastClient().then(function (hazelcastClient) {
                client = hazelcastClient;
            });
        });
    });

    beforeEach(function () {
        rm = client.getReplicatedMap('test');
    });

    afterEach(function () {
        return rm.destroy();
    });

    after(function () {
        client.shutdown();
        return Controller.shutdownCluster(cluster.id);
    });

    it('puts one entry and gets one entry', function () {
        return rm.put('key', 'value', ONE_HOUR)
            .then(function () {
                return rm.get('key')
            })
            .then(function (val) {
                expect(val).to.equal('value');
            });
    });

    it('puts entry with 0 ttl', function () {
        return rm.put('zerottl', 'value')
            .then(function () {
                return rm.get('zerottl');
            })
            .then(function (val) {
                expect(val).to.equal('value');
            });
    });

    it('puts entry with 1000 ttl', function () {
        return rm.put('1000ttl', 'value', 1000)
            .then(function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve();
                    }, 2000)
                });
            })
            .then(function () {
                return rm.get('1000ttl');
            })
            .then(function (val) {
                expect(val).to.be.null;
            });
    }).timeout(5000);

    it('should contain the key', function () {
        return rm.put('key', 'value', ONE_HOUR)
            .then(function (val) {
                return rm.containsKey('key')
            })
            .then(function (res) {
                expect(res).to.equal(true);
            });
    });

    // TODO(zemd): need to be verified separately due to strange NullPointerException from the server
    // it('should not contain the key', function () {
    //     return rm.containsKey('key')
    //         .then(function (res) {
    //             expect(res).to.equal(false);
    //         });
    // });

    it('should contain the value', function () {
        return rm.put('key', 'value', ONE_HOUR)
            .then(function () {
                return rm.containsValue('value')
            })
            .then(function (res) {
                expect(res).to.equal(true);
            });
    });

    it('should not contain the value', function () {
        return rm.containsValue('value')
            .then(function (res) {
                expect(res).to.equal(false);
            });
    });

    it('putting items into the map should increase it\'s size', function () {
        return rm.put('key', 'value', ONE_HOUR)
            .then(function () {
                return rm.size()
            })
            .then(function (size) {
                expect(size).to.equal(1);
            });
    });

    it('returns isEmpty true if map is empty', function () {
        return rm.isEmpty()
            .then(function (res) {
                expect(res).to.equal(true);
            });
    });

    it('returns isEmpty false if map is not empty', function () {
        return rm.put('key', 'value', ONE_HOUR)
            .then(function () {
                return rm.isEmpty()
            })
            .then(function (res) {
                expect(res).to.equal(false);
            });
    });

    it('removes entry from map', function () {
        return rm.put('key', 'value', ONE_HOUR)
            .then(function () {
                return rm.containsKey('key');
            })
            .then(function (contains) {
                expect(contains).to.equal(true);
                return rm.remove('key')
            })
            .then(function () {
                return rm.containsKey('key')
            })
            .then(function (contains) {
                expect(contains).to.equal(false);
            });
    });

    it('clears map', function () {
        return rm.put('key', 'value', ONE_HOUR)
            .then(function () {
                return rm.size();
            })
            .then(function (size) {
                expect(size).to.equal(1);
                return rm.clear();
            })
            .then(function () {
                return rm.size();
            })
            .then(function (size) {
                expect(size).to.equal(0);
            });
    });

    it('returns entry set', function () {
        return Promise.all([
            rm.put('key1', 'value1', ONE_HOUR),
            rm.put('key2', 'value2', ONE_HOUR),
            rm.put('key3', 'value3', ONE_HOUR)
        ])
            .then(function () {
                return rm.entrySet();
            })
            .then(function (entrySet) {
                expect(entrySet).to.eql([
                    ['key1', 'value1'],
                    ['key2', 'value2'],
                    ['key3', 'value3']
                ]);
            });
    });

    it('batch put entries with putAll', function () {
        return rm.putAll([
            ['key1', 'value1'],
            ['key2', 'value2'],
            ['key3', 'value3']
        ])
            .then(function () {
                return rm.entrySet();
            })
            .then(function (entrySet) {
                expect(entrySet).to.eql([
                    ['key1', 'value1'],
                    ['key2', 'value2'],
                    ['key3', 'value3']
                ]);
            });
    });

    it('returns values array', function () {
        return rm.putAll([
            ['key1', 'value1'],
            ['key2', 'value2'],
            ['key3', 'value3']
        ])
            .then(function () {
                return rm.values();
            })
            .then(function (values) {
                expect(values).to.eql(['value1', 'value2', 'value3']);
            });
    });

    it('returns values array sorted with custom comparator', function () {
        var expectedArray = ['value3', 'value2', 'value1'];
        return rm.putAll([
            ['key2', 'value2'],
            ['key3', 'value3'],
            ['key1', 'value1']
        ])
            .then(function () {
                return rm.values(function (a, b) {
                    return b[b.length - 1] - a[a.length - 1];
                });
            })
            .then(function (values) {
                values.forEach(function (value, index) {
                    expect(value).to.equal(expectedArray[index]);
                });
            });
    });

    it('returns keySet', function () {
        return rm.putAll([
            ['key1', 'value1'],
            ['key2', 'value2'],
            ['key3', 'value3']
        ])
            .then(function () {
                return rm.keySet();
            })
            .then(function (values) {
                expect(values).to.eql(['key1', 'key2', 'key3']);
            });
    });

    it('addEntryListener should be fired on adding new key-value pair', function (done) {
        var registrationId;

        var listener = {
            added: function (key, oldValue, value, mergingValue) {
                var error;
                try {
                    expect(key).to.equal('new-key');
                    expect(oldValue).to.be.undefined;
                    expect(value).to.equal('value');
                    expect(mergingValue).to.be.undefined;
                } catch (err) {
                    error = err;
                }

                rm.removeEntryListener(registrationId)
                    .then(function () {
                        done(error);
                    });
            }
        };

        rm.addEntryListener(listener)
            .then(function (listenerId) {
                registrationId = listenerId;
                return rm.put('new-key', 'value', ONE_HOUR);
            });

    });

    it('addEntryListener listens to remove event', function (done) {
        var registrationId;
        var listener = {
            removed: function (key, value, oldValue, mergingValue, numberOfAffectedEntries) {
                var error;
                try {
                    expect(key).to.equal('key-to-remove');
                    expect(value).to.equal('value');
                    expect(numberOfAffectedEntries).to.equal(1);
                } catch (err) {
                    error = err;
                }

                rm.removeEntryListener(registrationId)
                    .then(function () {
                        done(error);
                    });
            }
        };
        rm.addEntryListener(listener)
            .then(function (listenerId) {
                registrationId = listenerId;
                return rm.put('key-to-remove', 'value', ONE_HOUR);
            })
            .then(function () {
                return rm.remove('key-to-remove');
            });
    });

    it('addEntryListener listens to updated event', function (done) {
        var registrationId;
        var listener = {
            updated: function (key, oldValue, value, mergingValue, numberOfAffectedEntries) {
                var error;
                try {
                    expect(key).to.equal('key-to-update');
                    expect(value).to.equal('value2');
                    expect(oldValue).to.equal('value1');
                    expect(numberOfAffectedEntries).to.equal(1);
                } catch (err) {
                    error = err;
                }

                rm.removeEntryListener(registrationId)
                    .then(function () {
                        done(error);
                    });
            }
        };
        rm.addEntryListener(listener)
            .then(function (listenerId) {
                registrationId = listenerId;
                return rm.put('key-to-update', 'value1', ONE_HOUR);
            })
            .then(function () {
                return rm.put('key-to-update', 'value2', ONE_HOUR);
            });
    });

    it('addEntryListener listens to clearedAll event', function (done) {
        var registrationId;
        var listener = {
            clearedAll: function (key, oldValue, value, mergingValue, numberOfAffectedEntries) {
                var error;
                try {
                    expect(key).to.be.undefined;
                    expect(value).to.be.undefined;
                    expect(oldValue).to.be.undefined;
                    expect(numberOfAffectedEntries).to.equal(4);
                } catch (err) {
                    error = err;
                }

                rm.removeEntryListener(registrationId)
                    .then(function () {
                        done(error);
                    });
            }
        };
        rm.addEntryListener(listener)
            .then(function (listenerId) {
                registrationId = listenerId;
                return Promise.all([
                    rm.put('key-to-clear1', 'value1', ONE_HOUR),
                    rm.put('key-to-clear2', 'value2', ONE_HOUR),
                    rm.put('key-to-clear3', 'value2', ONE_HOUR),
                    rm.put('key-to-clear4', 'value2', ONE_HOUR)
                ])
            })
            .then(function () {
                return rm.clear();
            });
    });

    it('addEntryListenerToKey should be fired only for selected key', function (done) {
        var listeners = [];

        var listener1 = {
            added: function () {
                done(new Error('This listener must not be fired'));
            }
        };
        var listener2 = {
            added: function (key, oldValue, value, merginValue) {
                var error;
                try {
                    expect(key).to.equal('key1');
                    expect(oldValue).to.be.undefined;
                    expect(value).to.equal('value');
                    expect(merginValue).to.be.undefined;
                } catch (err) {
                    error = err;
                }

                Promise.all([
                    rm.removeEntryListener(listeners[0]),
                    rm.removeEntryListener(listeners[1])
                ])
                    .then(function () {
                        done(error);
                    });
            }
        };

        Promise.all([
            rm.addEntryListenerToKey(listener1, 'key'),
            rm.addEntryListenerToKey(listener2, 'key1')
        ])
            .then(function (res) {
                listeners = res;
                return rm.put('key1', 'value', ONE_HOUR);
            });
    });

    it('addEntryListenerWithPredicate', function (done) {
        var listenerId;
        var listenerObject = {
            added: function (key, oldValue, value, mergingValue) {
                var error;
                try {
                    expect(key).to.equal('key10');
                    expect(oldValue).to.be.undefined;
                    expect(value).to.equal('val10');
                    expect(mergingValue).to.be.undefined;
                } catch (err) {
                    error = err;
                }
                rm.removeEntryListener(listenerId)
                    .then(function () {
                        done(error);
                    });

            }
        };
        rm.addEntryListenerWithPredicate(listenerObject, Predicates.sql('this == val10'))
            .then(function (registrationId) {
                listenerId = registrationId;
                return rm.put('key10', 'val10', ONE_HOUR);
            });
    });

    it('addEntryListenerToKeyWithPredicate', function (done) {
        var listenerId;
        var listenerObject = {
            added: function (key, oldValue, value, mergingValue) {
                var error;
                try {
                    expect(key).to.equal('key');
                    expect(oldValue).to.be.undefined;
                    expect(value).to.be.equal('value');
                    expect(mergingValue).to.be.undefined;

                } catch (err) {
                    error = err;
                }

                rm.removeEntryListener(listenerId)
                    .then(function () {
                        done(error);
                    });
            }
        };
        rm.addEntryListenerToKeyWithPredicate(listenerObject, 'key', Predicates.sql('this == value'))
            .then(function (registrationId) {
                listenerId = registrationId;
                return rm.put('key', 'value', ONE_HOUR);
            });
    });
});
