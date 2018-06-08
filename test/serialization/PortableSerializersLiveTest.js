var Client = require('../../.').Client;
var Config = require('../../.').Config;
var RC = require('../RC');
var expect = require('chai').expect;
var SimplePortable = require('./PortableObjects').SimplePortable;
var InnerPortable = require('./PortableObjects').InnerPortableObject;
var Promise = require('bluebird');

describe('Default serializers with live instance', function () {
    var cluster;
    var member;
    var client;
    var map;

    function getClientConfig() {
        var cfg = new Config.ClientConfig();
        cfg.serializationConfig.portableFactories[10] = {
            create: function (classId) {
                if (classId === 222) {
                    return new InnerPortable();
                } else if (classId === 21) {
                    return new SimplePortable();
                } else {
                    return null;
                }
            }
        };
        return cfg;
    }

    before(function () {
        return RC.createCluster(null, null).then(function (res) {
            cluster = res;
        }).then(function () {
            return RC.startMember(cluster.id);
        }).then(function (m) {
            member = m;
            return Client.newHazelcastClient(getClientConfig());
        }).then(function (cl) {
            client = cl;
            map = client.getMap('test');
        });
    });

    after(function () {
        client.shutdown();
        return RC.shutdownCluster(cluster.id);
    });

    it('client can write and read two different serializable objects of the same factory', function () {
        var simplePortable = new SimplePortable('atext');
        var innerPortable = new InnerPortable('str1', 'str2');
        return map.put('simpleportable', simplePortable).then(function () {
            return map.put('innerportable', innerPortable);
        }).then(function () {
            return map.get('simpleportable');
        }).then(function (sp) {
            return map.get('innerportable').then(function (ip) {
                expect(sp).to.deep.equal(simplePortable);
                expect(ip).to.deep.equal(innerPortable);
                return Promise.resolve();
            });
        });
    });

    it('client can read two different serializable objects of the same factory (written by another client)', function () {
        var simplePortable = new SimplePortable('atext');
        var innerPortable = new InnerPortable('str1', 'str2');
        return map.putAll([['simpleportable', simplePortable], ['innerportable', innerPortable]]).then(function () {
            client.shutdown();
        }).then(function () {
            return Client.newHazelcastClient(getClientConfig());
        }).then(function (cl) {
            client = cl;
            map = client.getMap('test');
            return map.get('simpleportable');
        }).then(function (sp) {
            return map.get('innerportable').then(function (ip) {
                expect(sp).to.deep.equal(simplePortable);
                expect(ip).to.deep.equal(innerPortable);
                return Promise.resolve();
            });
        });
    });

});
