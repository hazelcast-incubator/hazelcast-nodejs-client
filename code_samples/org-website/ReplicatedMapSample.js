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

var Client = require('hazelcast-client').Client;
// Start the Hazelcast Client and connect to an already running Hazelcast Cluster on 127.0.0.1
Client.newHazelcastClient().then(function (hz) {
    var map;
    // Get a Replicated Map called "my-replicated-map"
    hz.getReplicatedMap('my-replicated-map').then(function (rmp) {
        map = rmp;
        // Put and Get a value from the Replicated Map
        // key/value replicated to all members
        return map.put('key', 'value');
    }).then(function (replacedValue) {
        console.log('replaced value = ' + replacedValue); // Will be null as its first update
        return map.get('key');
    }).then(function (value) {
        // The value is retrieved from a random member in the cluster
        console.log('value for key = ' + value);
        // Shutdown this Hazelcast Client
        hz.shutdown();
    });
});
