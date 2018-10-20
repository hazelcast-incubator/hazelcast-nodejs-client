var Client = require('hazelcast-client').Client;
// Start the Hazelcast Client and connect to an already running Hazelcast Cluster on 127.0.0.1
Client.newHazelcastClient().then(function (hz) {
    var multiMap;
    // Get the Distributed MultiMap from Cluster.
    hz.getMultiMap('my-distributed-multimap').then(function (mmp) {
        multiMap = mmp;
        // Put values in the map against the same key
        return multiMap.put('my-key', 'value1');
    }).then(function () {
        return multiMap.put('my-key', 'value2');
    }).then(function () {
        return multiMap.put('my-key', 'value3');
    }).then(function () {
        // Print out all the values for associated with key called "my-key"
        return multiMap.get('my-key')
    }).then(function (values) {
        for (value of values) {
            console.log(value);
        }
        // remove specific key/value pair
        return multiMap.remove('my-key', 'value2');
    }).then(function () {
        // Shutdown this Hazelcast client
        hz.shutdown();
    });
});
