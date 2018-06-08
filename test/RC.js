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

var RemoteController = require('hazelcast-remote-controller');
var Promise = require('bluebird');

var controller = new RemoteController('localhost', 9701);

function createCluster(hzVersion, config) {
    var deferred = Promise.defer();
    controller.createCluster(hzVersion, config, function (err, cluster) {
        if (err) return deferred.reject(err);
        return deferred.resolve(cluster);
    });
    return deferred.promise;
}

function startMember(clusterId) {
    var deferred = Promise.defer();
    controller.startMember(clusterId, function (err, member) {
        if (err) return deferred.reject(err);
        return deferred.resolve(member);
    });
    return deferred.promise;
}

function exit() {
    var deferred = Promise.defer();
    controller.exit(function (err, res) {
        if (err) return deferred.reject(err);
        return deferred.resolve(res);
    });
    return deferred.promise;
}

function shutdownMember(clusterId, memberUuid) {
    var deferred = Promise.defer();
    controller.shutdownMember(clusterId, memberUuid, function (err, res) {
        if (err) return deferred.reject(err);
        return deferred.resolve(res);
    });
    return deferred.promise;
}

function shutdownCluster(clusterId) {
    var deferrred = Promise.defer();
    controller.shutdownCluster(clusterId, function (err, res) {
        if (err) return deferrred.reject(err);
        return deferrred.resolve(res);
    });
    return deferrred.promise;
}

function terminateMember(clusterId, memberUuid) {
    var deferred = Promise.defer();
    controller.terminateMember(clusterId, memberUuid, function (err, res) {
        if (err) return deferred.reject(err);
        return deferred.resolve(res);
    });
    return deferred.promise;
}

function executeOnController(clusterId, script, lang) {
    var deferred = Promise.defer();
    controller.executeOnController(clusterId, script, lang, function (err, res) {
        if (err) return deferred.reject(err);
        if (res.success === false) return deferred.reject(res.message);
        return deferred.resolve(res);
    });
    return deferred.promise;
}

exports.exit = exit;
exports.createCluster = createCluster;
exports.startMember = startMember;
exports.shutdownMember = shutdownMember;
exports.shutdownCluster = shutdownCluster;
exports.executeOnController = executeOnController;
exports.terminateMember = terminateMember;
