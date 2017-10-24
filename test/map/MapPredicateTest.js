var expect = require("chai").expect;
var HazelcastClient = require("../..").Client;
var Config = require('../..').Config;
var Predicates = require("../..").Predicates;
var assert = require('assert');
var Promise = require("bluebird");
var Controller = require('./../RC');
var ReverseValueComparator = require('./ComparatorFactory').ReverseValueComparator;
var ComparatorFactory = require('./ComparatorFactory').ComparatorFactory;
var PortableFactory = require('./NestedVersionedPortables').PortableFactory;
var OuterPortable = require('./NestedVersionedPortables').OuterPortable;
var InnerPortable = require('./NestedVersionedPortables').InnerPortable;
var fs = require('fs');

describe("Predicates", function() {

    var cluster;
    var client;
    var map;

    function _createConfig() {
        var cfg = new Config.ClientConfig();
        cfg.serializationConfig.dataSerializableFactories[1] = ComparatorFactory;
        cfg.serializationConfig.portableFactories[10] = PortableFactory;
        return cfg;
    }

    before(function () {
        this.timeout(32000);
        return Controller.createCluster(null, fs.readFileSync(__dirname + '/hazelcast_predicate.xml', 'utf8')).then(function(res) {
            cluster = res;
            return Controller.startMember(cluster.id);
        }).then(function(member) {
            return HazelcastClient.newHazelcastClient(_createConfig()).then(function(hazelcastClient) {
                client = hazelcastClient;
            });
        });
    });

    beforeEach(function() {
        map = client.getMap('test');
        return _fillMap();
    });

    afterEach(function() {
        return map.destroy();
    });

    after(function() {
        client.shutdown();
        return Controller.shutdownCluster(cluster.id);
    });

    function _fillMap(size) {
        if (size == void 0) {
            size = 50;
        }
        var promises = [];
        for (var i = 0; i< size; i++) {
            promises.push(map.put('key' + i, i));
        }
        return Promise.all(promises);
    }

    function testPredicate(predicate, expecteds, orderMatters) {
        return map.valuesWithPredicate(predicate).then(function(values) {
            if (orderMatters) {
                return expect(values).to.deep.equal(expecteds);
            } else {
                return expect(values).to.have.members(expecteds);
            }
        });
    }

    it('Sql', function () {
        return testPredicate(Predicates.sql('this == 10'), [10]);
    });

    it('And', function() {
        return testPredicate(Predicates.and(Predicates.isEqualTo('this', 10), Predicates.isEqualTo('this', 11)), []);
    });

    it('GreaterThan', function() {
        return testPredicate(Predicates.greaterThan('this', 47), [48, 49]);
    });

    it('GreaterEqual', function() {
        return testPredicate(Predicates.greaterEqual('this', 47), [47, 48, 49]);
    });

    it('LessThan', function() {
        return testPredicate(Predicates.lessThan('this', 4), [0, 1, 2, 3]);
    });

    it('LessEqual', function () {
        return testPredicate(Predicates.lessEqual('this', 4), [0, 1, 2, 3, 4]);
    });

    it('Like', function() {
        var localMap = client.getMap('likePredMap');
        return localMap.put('temp', 'tempval').then(function() {
            return localMap.valuesWithPredicate(Predicates.like('this', 'tempv%'));
        }).then(function (values) {
            return expect(values).to.have.members(['tempval']);
        }).then(function() {
            return localMap.destroy();
        });
    });

    it('ILike', function() {
        var localMap = client.getMap('likePredMap');
        return localMap.putAll([['temp', 'tempval'], ['TEMP', 'TEMPVAL']]).then(function() {
            return localMap.valuesWithPredicate(Predicates.ilike('this', 'tempv%'));
        }).then(function (values) {
            return expect(values).to.have.members(['tempval', 'TEMPVAL']);
        }).then(function() {
            return localMap.destroy();
        });
    });

    it('In', function () {
        return testPredicate(Predicates.inPredicate('this', 48, 49, 50, 51, 52), [48, 49]);
    });

    it('InstanceOf', function () {
        var assertionList = Array.apply(null, {length: 50}).map(Number.call, Number);
        return testPredicate(Predicates.instanceOf('java.lang.Double'), assertionList);
    });

    it('NotEqual', function() {
        var assertionList = Array.apply(null, {length: 49}).map(Number.call, Number);
        return testPredicate(Predicates.notEqual('this', 49), assertionList);
    });

    it('Not', function() {
        return testPredicate(Predicates.not(Predicates.greaterEqual('this', 2)), [0, 1]);
    });

    it('Or', function() {
        return testPredicate(Predicates.or(Predicates.greaterEqual('this', 49), Predicates.lessEqual('this', 0)), [0, 49]);
    });

    it('Null predicate throws error', function() {
        return expect(testPredicate.bind(null, null, [0, 49])).throw(assert.AssertionError);
    });

    it('Regex', function() {
        var localMap = client.getMap('regexMap');
        return localMap.putAll([['06', 'ankara'], ['07', 'antalya']]).then(function() {
            return localMap.valuesWithPredicate(Predicates.regex('this', '^.*ya$'));
        }).then(function (values) {
            return expect(values).to.have.members(['antalya']);
        }).then(function() {
            return localMap.destroy();
        });
    });

    it('False', function() {
        return testPredicate(Predicates.falsePredicate(), []);
    });

    it('True', function () {
        var assertionList = Array.apply(null, {length: 50}).map(Number.call, Number);
        return testPredicate(Predicates.truePredicate(), assertionList);
    });

    it('Paging with reverse comparator should have elements in reverse order', function() {
        var paging = Predicates.paging(Predicates.lessThan('this', 40), 3, new ReverseValueComparator());
        return testPredicate(paging, [39, 38, 37], true);
    });

    it('Paging first page should have first two items', function() {
        var paging = Predicates.paging(Predicates.greaterEqual('this', 40), 2);
        return testPredicate(paging, [40, 41]);
    });

    it('Paging nextPage should have 3rd and 4th items', function() {
        var paging = Predicates.paging(Predicates.greaterEqual('this', 40), 2);
        paging.nextPage();

        return testPredicate(paging, [42, 43]);
    });

    it('Paging fourth page should have 7th and 8th items', function() {
        var paging = Predicates.paging(Predicates.greaterEqual('this', 40), 2);
        paging.setPage(4);

        return testPredicate(paging, [48, 49]);
    });

    it('Paging #getPage should return approprate value', function() {
        var paging = Predicates.paging(Predicates.greaterEqual('this', 40), 2);
        paging.setPage(4);
        return expect(paging.getPage()).to.equal(4);
    });

    it('Paging #getPageSize should return 2', function() {
        var paging = Predicates.paging(Predicates.greaterEqual('this', 40), 2);
        return expect(paging.getPageSize()).to.equal(2);
    });

    it('Paging previousPage', function () {
        var paging = Predicates.paging(Predicates.greaterEqual('this', 40), 2);
        paging.setPage(4);
        paging.previousPage();

        return testPredicate(paging, [46, 47]);
    });

    it('Get 4th page, then previous page', function() {
        var paging = Predicates.paging(Predicates.greaterEqual('this', 40), 2);
        paging.setPage(4);
        return map.valuesWithPredicate(paging).then(function() {
            paging.previousPage();
            return testPredicate(paging, [46, 47]);
        });
    });

    it('Get 3rd page, then next page', function() {
        var paging = Predicates.paging(Predicates.greaterEqual('this', 40), 2);
        paging.setPage(3);
        return map.valuesWithPredicate(paging).then(function() {
            paging.nextPage();
            return testPredicate(paging, [48, 49]);
        });
    });

    it('Get 10th page (which does not exist) should return empty list', function() {
        var paging = Predicates.paging(Predicates.greaterEqual('this', 40), 2);
        paging.setPage(10);

        return testPredicate(paging, []);
    });

    it('Last page has only one element although page size is 2', function() {
        var paging = Predicates.paging(Predicates.greaterEqual('this', 41), 2);
        paging.setPage(4);

        return testPredicate(paging, [49]);
    });

    it('There is no element satisfying paging predicate returns empty array', function() {
        var paging = Predicates.paging(Predicates.lessThan('this', 0), 2);
        return testPredicate(paging, []);
    });

    it('Null inner predicate in PagingPredicate does not filter out items, only does paging', function() {
        var paging = Predicates.paging(null, 2);
        return testPredicate(paging, [0, 1]);
    });

    it('Nested portable', function () {
        var map_portable = client.getMap('portable_map');
        return map_portable.putAll([
            ['one', new OuterPortable(new InnerPortable('x', 'y'))],
            ['two', new OuterPortable(new InnerPortable('z', 'y'))],
            ['three', new OuterPortable(new InnerPortable('a', 'b'))],
        ]).then(function () {
            return map_portable.valuesWithPredicate(Predicates.isEqualTo('inner_portable.r', 'y'));
        }).then(function (s) {
            return expect(s).to.have.deep.members([
                new OuterPortable(new InnerPortable('x', 'y')),
                new OuterPortable(new InnerPortable('z', 'y'))
            ]);
        });
    });
});
