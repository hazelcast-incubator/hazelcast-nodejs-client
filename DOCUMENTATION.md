# Table of Contents

* [Introduction](#introduction)
* [1. Getting Started](#1-getting-started)
  * [1.1. Requirements](#11-requirements)
  * [1.2. Working with Hazelcast IMDG Clusters](#12-working-with-hazelcast-imdg-clusters)
    * [1.2.1. Setting Up a Hazelcast IMDG Cluster](#121-setting-up-a-hazelcast-imdg-cluster)
      * [1.2.1.1. Running Standalone JARs](#1211-running-standalone-jars)
      * [1.2.1.2. Adding User Library to CLASSPATH](#1212-adding-user-library-to-classpath)
  * [1.3. Downloading and Installing](#13-downloading-and-installing)
  * [1.4. Basic Configuration](#14-basic-configuration)
    * [1.4.1. Configuring Hazelcast IMDG](#141-configuring-hazelcast-imdg)
    * [1.4.2. Configuring Hazelcast Node.js Client](#142-configuring-hazelcast-nodejs-client)
      * [1.4.2.1. Cluster Name Setting](#1421-cluster-name-setting)
      * [1.4.2.2. Network Settings](#1422-network-settings)
  * [1.5. Basic Usage](#15-basic-usage)
  * [1.6. Code Samples](#16-code-samples)
* [2. Features](#2-features)
* [3. Configuration Overview](#3-configuration-overview)
  * [3.1. Configuration Options](#31-configuration-options)
    * [3.1.1. Programmatic Configuration](#311-programmatic-configuration)
    * [3.1.2. Declarative Configuration (JSON)](#312-declarative-configuration-json)
  * [3.2. Importing Multiple Configurations](#32-importing-multiple-configurations)
  * [3.3. Loading Objects and Path Resolution](#33-loading-objects-and-path-resolution)
* [4. Serialization](#4-serialization)
  * [4.1. IdentifiedDataSerializable Serialization](#41-identifieddataserializable-serialization)
  * [4.2. Portable Serialization](#42-portable-serialization)
	* [4.2.1. Versioning for Portable Serialization](#421-versioning-for-portable-serialization)
  * [4.3. Custom Serialization](#43-custom-serialization)
  * [4.4. Global Serialization](#44-global-serialization)
  * [4.5. JSON Serialization](#45-json-serialization)
* [5. Setting Up Client Network](#5-setting-up-client-network)
  * [5.1. Providing Member Addresses](#51-providing-member-addresses)
  * [5.2. Setting Smart Routing](#52-setting-smart-routing)
  * [5.3. Enabling Redo Operation](#53-enabling-redo-operation)
  * [5.4. Setting Connection Timeout](#54-setting-connection-timeout)
  * [5.5. Enabling Client TLS/SSL](#55-enabling-client-tlsssl)
  * [5.6. Enabling Hazelcast Cloud Discovery](#56-enabling-hazelcast-cloud-discovery)
  * [5.7. Configuring Backup Acknowledgment](#57-configuring-backup-acknowledgment)
  * [5.8. External Client Public Address Discovery](#58-external-client-public-address-discovery)
* [6. Client Connection Strategy](#6-client-connection-strategy)
  * [6.1. Configuring Client Connection Retry](#61-configuring-client-connection-retry)
* [7. Blue-Green Deployment and Disaster Recovery](#7-blue-green-deployment-and-disaster-recovery)
  * [7.1. Configuring Client](#71-configuring-client)
* [8. Using Node.js Client with Hazelcast IMDG](#8-using-nodejs-client-with-hazelcast-imdg)
  * [8.1. Node.js Client API Overview](#81-nodejs-client-api-overview)
  * [8.2. Node.js Client Operation Modes](#82-nodejs-client-operation-modes)
      * [8.2.1. Smart Client](#821-smart-client)
      * [8.2.2. Unisocket Client](#822-unisocket-client)
  * [8.3. Handling Failures](#83-handling-failures)
    * [8.3.1. Handling Client Connection Failure](#831-handling-client-connection-failure)
    * [8.3.2. Handling Retry-able Operation Failure](#832-handling-retry-able-operation-failure)
  * [8.4. Using Distributed Data Structures](#84-using-distributed-data-structures)
    * [8.4.1. Using Map](#841-using-map)
    * [8.4.2. Using MultiMap](#842-using-multimap)
    * [8.4.3. Using Replicated Map](#843-using-replicated-map)
    * [8.4.4. Using Queue](#844-using-queue)
    * [8.4.5. Using Set](#845-using-set)
    * [8.4.6. Using List](#846-using-list)
    * [8.4.7. Using Ringbuffer](#847-using-ringbuffer)
    * [8.4.8. Using Reliable Topic](#848-using-reliable-topic)
      * [8.4.8.1. Configuring Reliable Topic](#8481-configuring-reliable-topic)
    * [8.4.9. Using PN Counter](#849-using-pn-counter)
    * [8.4.10. Using Flake ID Generator](#8410-using-flake-id-generator)
      * [8.4.10.1. Configuring Flake ID Generator](#84101-configuring-flake-id-generator)
    * [8.4.11. CP Subsystem](#8411-cp-subsystem)
      * [8.4.11.1. Using Atomic Long](#84111-using-atomic-long)
      * [8.4.11.2. Using Lock](#84112-using-lock)
      * [8.4.11.3. Using Semaphore](#84113-using-semaphore)
      * [8.4.11.4. Using CountDownLatch](#84114-using-countdownlatch)
      * [8.4.11.5. Using AtomicReference](#84115-using-atomicreference)
  * [8.5. Distributed Events](#85-distributed-events)
    * [8.5.1. Listening for Cluster Events](#851-listening-for-cluster-events)
      * [8.5.1.1. Membership Listener](#8511-membership-listener)
      * [8.5.1.2. Distributed Object Listener](#8512-distributed-object-listener)
      * [8.5.1.3. Lifecycle Listener](#8513-lifecycle-listener)
    * [8.5.2. Listening for Distributed Data Structure Events](#852-listening-for-distributed-data-structure-events)
      * [8.5.2.1. Map Listener](#8521-map-listener)
      * [8.5.2.2. Entry Listener](#8522-entry-listener)
      * [8.5.2.3. Item Listener](#8523-item-listener)
      * [8.5.2.4. Message Listener](#8524-message-listener)
  * [8.6. Distributed Computing](#86-distributed-computing)
    * [8.6.1. Using EntryProcessor](#861-using-entryprocessor)
  * [8.7. SQL](#87-sql)
    * [8.7.1. SQL Statements](#871-sql-statements)
    * [8.7.2. Querying IMap](#872-querying-imap)
    * [8.7.3. Data Types](#873-data-types)
    * [8.7.4. Casting](#874-casting)
    * [8.7.5. Expressions](#875-expressions)
    * [8.7.6. Source and Sink Connectors](#876-source-and-sink-connectors)
    * [8.7.7. More information](#877-more-information)
  * [8.8. Distributed Query](#88-distributed-query)
    * [8.8.1. How Distributed Query Works](#881-how-distributed-query-works)
      * [8.8.1.1. Employee Map Query Example](#8811-employee-map-query-example)
      * [8.8.1.2. Querying by Combining Predicates with AND, OR, NOT](#8812-querying-by-combining-predicates-with-and-or-not)
      * [8.8.1.3. Querying with SQL](#8813-querying-with-sql)
      * [8.8.1.4. Querying with JSON Strings](#8814-querying-with-json-strings)
      * [8.8.1.5. Filtering with Paging Predicates](#8815-filtering-with-paging-predicates)
    * [8.8.2. Fast-Aggregations](#882-fast-aggregations)
  * [8.9. Performance](#89-performance)
    * [8.9.1. Partition Aware](#891-partition-aware)
    * [8.9.2. Near Cache](#892-near-cache)
      * [8.9.2.1. Configuring Near Cache](#8921-configuring-near-cache)
      * [8.9.2.2. Near Cache Example for Map](#8922-near-cache-example-for-map)
      * [8.9.2.3. Near Cache Eviction](#8923-near-cache-eviction)
      * [8.9.2.4. Near Cache Expiration](#8924-near-cache-expiration)
      * [8.9.2.5. Near Cache Invalidation](#8925-near-cache-invalidation)
      * [8.9.2.6. Near Cache Eventual Consistency](#8926-near-cache-eventual-consistency)
    * [8.9.3. Automated Pipelining](#893-automated-pipelining)
  * [8.10. Monitoring and Logging](#810-monitoring-and-logging)
    * [8.10.1. Enabling Client Statistics](#8101-enabling-client-statistics)
    * [8.10.2. Logging Configuration](#8102-logging-configuration)
  * [8.11. Defining Client Labels](#811-defining-client-labels)
  * [8.12. Defining Instance Name](#812-defining-instance-name)
  * [8.13. Configuring Load Balancer](#813-configuring-load-balancer)
* [9. Securing Client Connection](#9-securing-client-connection)
  * [9.1. TLS/SSL](#91-tlsssl)
    * [9.1.1. TLS/SSL for Hazelcast Members](#911-tlsssl-for-hazelcast-members)
    * [9.1.2. TLS/SSL for Hazelcast Node.js Clients](#912-tlsssl-for-hazelcast-nodejs-clients)
    * [9.1.3. Mutual Authentication](#913-mutual-authentication)
  * [9.2. Credentials](#92-credentials)
* [10. Development and Testing](#10-development-and-testing)
  * [10.1. Building and Using Client From Sources](#101-building-and-using-client-from-sources)
  * [10.2. Testing](#102-testing)
* [11. Getting Help](#11-getting-help)
* [12. Contributing](#12-contributing)
* [13. License](#13-license)
* [14. Copyright](#14-copyright)


# Introduction

This document provides information about the Node.js client for [Hazelcast](https://hazelcast.com/). This client uses Hazelcast's [Open Client Protocol](https://github.com/hazelcast/hazelcast-client-protocol) and works with Hazelcast IMDG 4.0 and higher versions.

### Resources

See the following for more information on Node.js and Hazelcast IMDG:

* Hazelcast IMDG [website](https://hazelcast.com/)
* Hazelcast IMDG [Reference Manual](https://docs.hazelcast.com/imdg/latest/)
* About [Node.js](https://nodejs.org/en/about/)

### Release Notes

See the [Releases](https://github.com/hazelcast/hazelcast-nodejs-client/releases) page of this repository.

# 1. Getting Started

This chapter provides information on how to get started with your Hazelcast Node.js client. It outlines the requirements, installation and configuration of the client, setting up a cluster, and provides a simple application that uses a distributed map in Node.js client.

## 1.1. Requirements

- Windows, Linux or MacOS
- Node.js 10 or newer
- Java 8 or newer
- Hazelcast IMDG 4.0 or newer
- Latest Hazelcast Node.js client

## 1.2. Working with Hazelcast IMDG Clusters

Hazelcast Node.js client requires a working Hazelcast IMDG cluster to run. This cluster handles storage and manipulation of the user data.
Clients are a way to connect to the Hazelcast IMDG cluster and access such data.

Hazelcast IMDG cluster consists of one or more cluster members. These members generally run on multiple virtual or physical machines
and are connected to each other via network. Any data put on the cluster is partitioned to multiple members transparent to the user.
It is therefore very easy to scale the system by adding new members as the data grows. Hazelcast IMDG cluster also offers resilience. Should
any hardware or software problem causes a crash to any member, the data on that member is recovered from backups, and the cluster
continues to operate without any downtime. Hazelcast clients are an easy way to connect to a Hazelcast IMDG cluster and perform tasks on
distributed data structures that live on the cluster.

In order to use Hazelcast Node.js client, we first need to set up a Hazelcast IMDG cluster.

### 1.2.1. Setting Up a Hazelcast IMDG Cluster

There are following options to start a Hazelcast IMDG cluster easily:

* You can run standalone members by downloading and running JAR files from the website.
* You can embed members to your Java projects.
* You can use our [Docker images](https://hub.docker.com/r/hazelcast/hazelcast/).

We are going to download JARs from the website and run a standalone member for this guide.

#### 1.2.1.1. Running Standalone JARs

Follow the instructions below to create a Hazelcast IMDG cluster:

1. Go to Hazelcast's download [page](https://hazelcast.com/open-source-projects/downloads/) and download either the `.zip` or `.tar` distribution of Hazelcast IMDG.
2. Decompress the contents into any directory that you
want to run members from.
3. Change into the directory that you decompressed the Hazelcast content and then into the `bin` directory.
4. Use either `start.sh` or `start.bat` depending on your operating system. Once you run the start script, you should see the Hazelcast IMDG logs in the terminal.

You should see a log similar to the following, which means that your 1-member cluster is ready to be used:

```
INFO: [192.168.1.10]:5701 [dev] [4.0.1] [192.168.1.10]:5701 is STARTING
May 22, 2020 2:59:11 PM com.hazelcast.internal.cluster.ClusterService
INFO: [192.168.1.10]:5701 [dev] [4.0.1]

Members {size:1, ver:1} [
	Member [192.168.1.10]:5701 - 60255b17-d31c-43c4-a1c1-30f19b90f1ea this
]

May 22, 2020 2:59:11 PM com.hazelcast.core.LifecycleService
INFO: [192.168.1.10]:5701 [dev] [4.0.1] [192.168.1.10]:5701 is STARTED
```

#### 1.2.1.2. Adding User Library to CLASSPATH

When you want to use features such as querying and language interoperability, you might need to add your own Java classes to the Hazelcast member in order to use them from your Node.js client. This can be done by adding your own compiled code to the `CLASSPATH`. To do this, compile your code with the `CLASSPATH` and add the compiled files to the `user-lib` directory in the extracted `hazelcast-<version>.zip` (or `tar`). Then, you can start your Hazelcast member by using the start scripts in the `bin` directory. The start scripts will automatically add your compiled classes to the `CLASSPATH`.

Note that if you are adding an `IdentifiedDataSerializable` or a `Portable` class, you need to add its factory too. Then, you should configure the factory in the `hazelcast.xml` configuration file. This file resides in the `bin` directory where you extracted the `hazelcast-<version>.zip` (or `tar`).

The following is an example configuration when you are adding an `IdentifiedDataSerializable` class:

```xml
<hazelcast>
     ...
     <serialization>
        <data-serializable-factories>
            <data-serializable-factory factory-id=<identified-factory-id>>
                IdentifiedFactoryClassName
            </data-serializable-factory>
        </data-serializable-factories>
    </serialization>
    ...
</hazelcast>
```
If you want to add a `Portable` class, you should use `<portable-factories>` instead of `<data-serializable-factories>` in the above configuration.

See the [Hazelcast IMDG Reference Manual](https://docs.hazelcast.com/imdg/latest/getting-started.html) for more information on setting up the clusters.

## 1.3. Downloading and Installing

Hazelcast Node.js client is on [NPM](https://www.npmjs.com/package/hazelcast-client). Just add `hazelcast-client` as a dependency to your Node.js project, and you are good to go.

```
npm install hazelcast-client --save
```

## 1.4. Basic Configuration

If you are using Hazelcast IMDG and Node.js Client on the same machine, generally the default configuration should be fine. This is great for
trying out the client. However, if you run the client on a different machine than any of the cluster members, you may
need to do some simple configurations such as specifying the member addresses.

The Hazelcast IMDG members and clients have their own configuration options. You may need to reflect some member side configurations on the client side to properly connect to the cluster.

This section describes the most common configuration elements to get you started in no time.
It discusses some member side configuration options to ease the understanding of Hazelcast's ecosystem. Then, the client side configuration options
regarding the cluster connection are discussed. The configurations for the Hazelcast IMDG data structures that can be used in the Node.js client are discussed in the following sections.

See the [Hazelcast IMDG Reference Manual](https://docs.hazelcast.com/imdg/latest/) and [Configuration Overview section](#3-configuration-overview) for more information.

### 1.4.1. Configuring Hazelcast IMDG

Hazelcast IMDG aims to run out-of-the-box for most common scenarios. However, if you have limitations on your network such as multicast being disabled,
you may have to configure your Hazelcast IMDG members so that they can find each other on the network. Also, since most of the distributed data structures are configurable, you may want to configure them according to your needs. We will show you the basics about network configuration here.

You can use the following options to configure Hazelcast IMDG:

* Using the `hazelcast.xml` configuration file.
* Programmatically configuring the member before starting it from the Java code.

Since we use standalone servers, we will use the `hazelcast.xml` file to configure our cluster members.

When you download and unzip `hazelcast-<version>.zip` (or `tar`), you see the `hazelcast.xml` in the `bin` directory. When a Hazelcast member starts, it looks for the `hazelcast.xml` file to load the configuration from. A sample `hazelcast.xml` is shown below.

```xml
<hazelcast>
    <cluster-name>dev</cluster-name>
    <network>
        <port auto-increment="true" port-count="100">5701</port>
        <join>
            <multicast enabled="true">
                <multicast-group>224.2.2.3</multicast-group>
                <multicast-port>54327</multicast-port>
            </multicast>
            <tcp-ip enabled="false">
                <interface>127.0.0.1</interface>
                <member-list>
                    <member>127.0.0.1</member>
                </member-list>
            </tcp-ip>
        </join>
        <ssl enabled="false"/>
    </network>
    <partition-group enabled="false"/>
    <map name="default">
        <backup-count>1</backup-count>
    </map>
</hazelcast>
```

We will go over some important configuration elements in the rest of this section.

- `<cluster-name>` : Specifies which cluster this member belongs to. A member connects only to the other members that are in the same cluster as
itself. You may give your clusters different names so that they can live in the same network without disturbing each other. Note that the cluster name should be the same across all members and clients that belong
to the same cluster.
- `<network>`
    - `<port>`: Specifies the port number to be used by the member when it starts. Its default value is 5701. You can specify another port number, and if
     you set `auto-increment` to `true`, then Hazelcast will try the subsequent ports until it finds an available port or the `port-count` is reached.
    - `<join>`: Specifies the strategies to be used by the member to find other cluster members. Choose which strategy you want to
    use by setting its `enabled` attribute to `true` and the others to `false`.
        - `<multicast>`: Members find each other by sending multicast requests to the specified address and port. It is very useful if IP addresses
        of the members are not static.
        - `<tcp>`: This strategy uses a pre-configured list of known members to find an already existing cluster. It is enough for a member to
        find only one cluster member to connect to the cluster. The rest of the member list is automatically retrieved from that member. We recommend
        putting multiple known member addresses there to avoid disconnectivity should one of the members in the list is unavailable at the time
        of connection.

These configuration elements are enough for most connection scenarios. Now we will move onto the configuration of the Node.js client.

### 1.4.2. Configuring Hazelcast Node.js Client

To configure your Hazelcast Node.js client you need to create a config object and set the appropriate options. Then you can
supply this object to your client at the startup. The structure of the config object is similar to the `hazelcast.xml` configuration file used when configuring the member. It is done this way to make it easier to transfer Hazelcast skills to multiple platforms.

This section describes some network configuration settings to cover common use cases in connecting the client to a cluster. See the [Configuration Overview section](#3-configuration-overview) and the following sections for information about detailed network configurations and/or additional features of Hazelcast Node.js client configuration.

You need to create a `ClientConfig` object and adjust its properties. Then you can pass this object to the client when starting it.

```javascript
const { Client } = require('hazelcast-client');

// ...

const client = await Client.newHazelcastClient({
    clusterName: 'name of your cluster'
});
// Some operations
```

It's also possible to omit the config object in order to use the default settings.

```javascript
const client = await Client.newHazelcastClient();
// Some operations
```

If you run the Hazelcast IMDG members on a different server than the client, you most probably have configured the members' ports and cluster names as explained in the previous section. If you did, then you need to make certain changes to the network settings of your client.

#### 1.4.2.1. Cluster Name Setting

You need to provide the name of the cluster, if it is defined on the server side, to which you want the client to connect.

```javascript
const cfg = {
    clusterName: 'name of your cluster'
};
```

#### 1.4.2.2. Network Settings

You need to provide the IP address and port of at least one member in your cluster, so the client can find it.

```javascript
const cfg = {
    network: {
        clusterMembers: [
            'some-ip-address:port'
        ]
    }
};
```

## 1.5. Basic Usage

Now we have a working cluster, and we know how to configure both our cluster and client, we can run a simple program to use a
distributed map in the Node.js client.

The following example first creates a programmatic configuration object. Then, it starts a client.

```javascript
const { Client } = require('hazelcast-client');

(async () => {
    try {
        // Connect to Hazelcast cluster
        const client = await Client.newHazelcastClient();
        // Print some information about this client
        console.log(client.getLocalEndpoint());

        await client.shutdown();
    } catch (err) {
        console.error('Error occurred:', err);
    }
})();
```

> **NOTE: For the sake of brevity we are going to omit boilerplate parts, like `require` or the root `async` function, in the later code snippets. Refer to the [Code Samples section](#16-code-samples) to see samples with the complete code.**

This should print logs about the cluster members and information about the client itself such as the client type, UUID and address.

```
[DefaultLogger] INFO at LifecycleService: HazelcastClient is STARTING
[DefaultLogger] INFO at LifecycleService: HazelcastClient is STARTED
[DefaultLogger] INFO at ConnectionManager: Trying to connect to localhost:5701
[DefaultLogger] INFO at LifecycleService: HazelcastClient is CONNECTED
[DefaultLogger] INFO at ConnectionManager: Authenticated with server 172.17.0.2:5701:255e4c83-cc19-445e-b7e1-9084ee423767, server version: 4.0.2, local address: 127.0.0.1:53988
[DefaultLogger] INFO at ClusterService:

Members [1] {
	Member [172.17.0.2]:5701 - 255e4c83-cc19-445e-b7e1-9084ee423767
}

ClientInfo {
  type: 'NodeJS',
  uuid: UUID {
    mostSignificant: Long { low: 20157807, high: 1081410737, unsigned: false },
    leastSignificant: Long { low: 314555559, high: 1465580554, unsigned: false }
  },
  localAddress: Address {
    host: '127.0.0.1',
    port: 53988,
    type: 4,
    addrStr: '127.0.0.1:53988'
  },
  labels: Set {},
  name: 'hz.client_0'
}
```

Congratulations! You just started a Hazelcast Node.js client.

**Using a Map**

Let's manipulate a distributed map on a cluster using the client.

Save the following file as `it.js` and run it using `node it.js`.

**it.js**
```javascript
const client = await Client.newHazelcastClient();

const personnelMap = await client.getMap('personnelMap');
await personnelMap.put('Alice', 'IT');
await personnelMap.put('Bob', 'IT');
await personnelMap.put('Clark', 'IT');
console.log('Added IT personnel. Logging all known personnel');

const allPersonnel = await personnelMap.entrySet();
allPersonnel.forEach(function (person) {
    console.log(`${person[0]} is in ${person[1]} department`);
});
```

**Output**

```
Added IT personnel. Logging all known personnel
Alice is in IT department
Clark is in IT department
Bob is in IT department
```

You see this example puts all the IT personnel into a cluster-wide `personnelMap` and then prints all the known personnel.

Now create a `sales.js` file as shown below and run it using `node sales.js`.

**Sales.js**

```javascript
const client = await Client.newHazelcastClient();

const personnelMap = await client.getMap('personnelMap');
await personnelMap.put('Denise', 'Sales');
await personnelMap.put('Erwing', 'Sales');
await personnelMap.put('Faith', 'Sales');
console.log('Added Sales personnel. Logging all known personnel');

const allPersonnel = await personnelMap.entrySet();
allPersonnel.forEach(function (person) {
    console.log(`${person[0]} is in ${person[1]} department`);
});
```

**Output**

```
Added Sales personnel. Logging all known personnel
Denise is in Sales department
Erwing is in Sales department
Faith is in Sales department
Alice is in IT department
Clark is in IT department
Bob is in IT department
```

You will see this time we add only the sales employees, but we get the list all known employees including the ones in IT.
That is because our map lives in the cluster and no matter which client we use, we can access the whole map.

## 1.6. Code Samples

See the Hazelcast Node.js [code samples](https://github.com/hazelcast/hazelcast-nodejs-client/tree/master/code_samples) for more examples.

You can also see the Hazelcast Node.js [API Documentation](http://hazelcast.github.io/hazelcast-nodejs-client/api/current/docs/).


# 2. Features

Hazelcast Node.js client supports the following data structures and features:

* Map
* Queue
* Set
* List
* MultiMap
* Replicated Map
* Ringbuffer
* Reliable Topic
* CRDT PN Counter
* Flake Id Generator
* FencedLock (CP Subsystem)
* Semaphore (CP Subsystem)
* AtomicLong (CP Subsystem)
* AtomicReference (CP Subsystem)
* CountDownLatch (CP Subsystem)
* Event Listeners
* Entry Processor
* Query (Predicates)
* Paging Predicate
* Built-in Predicates
* Listener with Predicate
* Fast Aggregations
* Near Cache Support
* Eventual Consistency Control
* Programmatic Configuration
* Client Configuration Import
* Fail Fast on Invalid Configuration
* SSL Support (requires Enterprise server)
* Mutual Authentication (requires Enterprise server)
* Authorization
* Management Center Integration / Awareness
* Client Near Cache Stats
* Client Runtime Stats
* Client Operating Systems Stats
* Hazelcast Cloud Discovery
* Smart Client
* Unisocket Client
* Lifecycle Service
* IdentifiedDataSerializable Serialization
* Portable Serialization
* Custom Serialization
* Global Serialization
* Connection Strategy
* Connection Retry
* External Client Public Address Discovery
* Blue-Green Deployment and Disaster Recovery (requires Enterprise server)


# 3. Configuration Overview

This chapter describes the options to configure your Node.js client. If an invalid value is given to any configuration option, an `InvalidConfigurationError` error will be thrown.

## 3.1. Configuration Options

For configuration of the Hazelcast Node.js client, just instantiate a config object and configure the desired aspects. An example is shown below.

```javascript
const cfg = {
    network: {
        clusterMembers: [
            '127.0.0.1:5701'
        ]
    }
};
const client = await Client.newHazelcastClient(cfg);
// Some operations
```

In the following chapters you will learn the description of all options supported by Hazelcast Node.js client.


# 4. Serialization

Serialization is the process of converting an object into a stream of bytes to store the object in the memory, a file or database, or transmit it through the network. Its main purpose is to save the state of an object in order to be able to recreate it when needed. The reverse process is called deserialization. Hazelcast offers you its own native serialization methods. You will see these methods throughout this chapter.

Hazelcast serializes all your objects before sending them to the server. Certain types, like `boolean`, `number`, `string`, and `Long`, are serialized natively and you cannot override this behavior. The following table is the conversion of types for the Java server side.

| Node.js         | Java                                  |
|-----------------|---------------------------------------|
| boolean         | Boolean                               |
| number          | Byte, Short, Integer, Float, Double   |
| string          | String                                |
| Long            | Long                                  |
| Buffer          | byte[]                                |
| Object          | com.hazelcast.core.HazelcastJsonValue |

> **NOTE: The `Long` type means the type provided by [long.js library](https://github.com/dcodeIO/long.js).**

> **NOTE: A `number` is serialized as `Double` by default. You can configure this behavior using the `defaultNumberType` serialization config option. See [API Documentation](http://hazelcast.github.io/hazelcast-nodejs-client/api/current/docs/) for more information.**

Arrays of the `boolean`, `number`, `string`, and `Long` types can be serialized as `boolean[]`, `byte[]`, `short[]`, `int[]`, `float[]`, `double[]`, `string[]`, and `long[]` for the Java server side, respectively.

**Serialization Priority**

When Hazelcast Node.js client serializes an object:

1. It first checks whether the object is `null`.

2. If the above check fails, then it checks if it is an instance of `IdentifiedDataSerializable`.

3. If the above check fails, then it checks if it is an instance of `Portable`.

4. If the above check fails, then it checks if it is an instance of one of the default types (see above default types).

5. If the above check fails, then it looks for a user-specified [Custom Serialization](#43-custom-serialization).

6. If the above check fails, it will use the registered [Global Serialization](#44-global-serialization) if one exists.

7. If the above check fails, then the Node.js client uses `JSON Serialization` by default.

However, `JSON Serialization` may be not the best way of serialization in terms of performance and interoperability between the clients in different languages. If you want the serialization to work faster or you use the clients in different languages, Hazelcast offers its own native serialization methods, such as [`IdentifiedDataSerializable` Serialization](#41-identifieddataserializable-serialization) and [`Portable` Serialization](#42-portable-serialization).

Or, if you want to use your own serialization method, you can use [Custom Serialization](#43-custom-serialization).

> **NOTE: Hazelcast Node.js client is a TypeScript-based project but JavaScript does not have interfaces. Therefore, some interfaces are given to the user by using the TypeScript files that have `.ts` extension. In this guide, implementing an interface means creating an object to have the necessary functions that are listed in the interface inside the `.ts` file. Also, this object is mentioned as `an instance of the interface`. You can search the [API Documentation](http://hazelcast.github.io/hazelcast-nodejs-client/api/current/docs/) or GitHub repository for a required interface.**

## 4.1. IdentifiedDataSerializable Serialization

For a faster serialization of objects, Hazelcast recommends to implement the `IdentifiedDataSerializable` interface. The following is an example of an object implementing this interface:

```javascript
class Employee {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        // IdentifiedDataSerializable interface properties:
        this.factoryId = 1000;
        this.classId = 100;
    }

    readData(input) {
        this.id = input.readInt();
        this.name = input.readString();
    }

    writeData(output) {
        output.writeInt(this.id);
        output.writeString(this.name);
    }
}
```

> **NOTE: Refer to `DataInput`/`DataOutput` interfaces in the [API Documentation](http://hazelcast.github.io/hazelcast-nodejs-client/api/current/docs/) to understand methods available on the `input`/`output` objects.**

The `IdentifiedDataSerializable` interface uses `classId` and `factoryId` properties to reconstitute the object. To complete the implementation, `IdentifiedDataSerializableFactory` factory function should also be implemented and put into the `serialization.dataSerializableFactories` config option. The factory's responsibility is to return an instance of the right `IdentifiedDataSerializable` object, given the `classId`.

A sample `IdentifiedDataSerializableFactory` function could be implemented as follows:

```javascript
function sampleDataSerializableFactory(classId) {
    if (classId === 100) {
        return new Employee();
    }
    return null;
}
```

The last step is to register the `IdentifiedDataSerializableFactory` in the config.

```javascript
const cfg = {
    serialization: {
        dataSerializableFactories: {
            1000: sampleDataSerializableFactory
        }
    }
};
```

Note that the key used in the `serialization.dataSerializableFactories` option is the same as the `factoryId` that the `Employee` object returns.

## 4.2. Portable Serialization

As an alternative to the existing serialization methods, Hazelcast offers portable serialization. To use it, you need to implement the `Portable` interface. Portable serialization has the following advantages:

- Supporting multiversion of the same object type.
- Fetching individual fields without having to rely on the reflection.
- Querying and indexing support without deserialization and/or reflection.

In order to support these features, a serialized `Portable` object contains meta information like the version and concrete location of the each field in the binary data. This way Hazelcast is able to navigate in the binary data and deserialize only the required field without actually deserializing the whole object which improves the query performance.

With multiversion support, you can have two members each having different versions of the same object; Hazelcast stores both meta information and uses the correct one to serialize and deserialize portable objects depending on the member. This is very helpful when you are doing a rolling upgrade without shutting down the cluster.

Also note that portable serialization is totally language independent and is used as the binary protocol between Hazelcast server and clients.

A sample portable implementation of a `Customer` class looks like the following:

```javascript
class Customer {
    constructor(name, id, lastOrder) {
        this.name = name;
        this.id = id;
        this.lastOrder = lastOrder;
        // Portable interface properties:
        this.factoryId = 1;
        this.classId = 1;
    }

    readPortable(reader) {
        this.name = reader.readString('name');
        this.id = reader.readInt('id');
        this.lastOrder = reader.readLong('lastOrder').toNumber();
    }

    writePortable(writer) {
        writer.writeString('name', this.name);
        writer.writeInt('id', this.id);
        writer.writeLong('lastOrder', Long.fromNumber(this.lastOrder));
    }
}
```

> **NOTE: Refer to `PortableReader`/`PortableWriter` interfaces in the [API Documentation](http://hazelcast.github.io/hazelcast-nodejs-client/api/current/docs/) to understand methods available on the `reader`/`writer` objects.**

Similar to `IdentifiedDataSerializable`, a `Portable` object must provide `classId` and `factoryId`. The factory function will be used to create the `Portable` object given the `classId`.

A sample `PortableFactory` function could be implemented as follows:

```javascript
function portableFactory(classId) {
    if (classId === 1) {
        return new Customer();
    }
    return null;
}
```

The last step is to register the `PortableFactory` in the config.

```javascript
const cfg = {
    serialization: {
        portableFactories: {
            1: portableFactory
        }
    }
};
```

Note that the ID that the key used in the `serialization.portableFactories` option is the same as the `factoryId` that the `Customer` object returns.

### 4.2.1. Versioning for Portable Serialization

More than one version of the same class may need to be serialized and deserialized. For example, a client may have an older version of a class and the member to which it is connected may have a newer version of the same class.

Portable serialization supports versioning. It is a global versioning, meaning that all portable classes that are serialized through a client get the globally configured portable version.

You can declare the version using the `serialization.portableVersion` option, as shown below.

```javascript
const cfg = {
    serialization: {
        portableVersion: 0
    }
}
```

If you update the class by changing the type of one of the fields or by adding a new field, it is a good idea to upgrade the version of the class, rather than sticking to the global version specified in the configuration. In the Node.js client, you can achieve this by simply adding the `version` property to your implementation of `Portable`, and setting the `version` to be different than the default global version.

> **NOTE: If you do not use the `version` property in your `Portable` implementation, it will have the global version, by default.**

Here is an example implementation of creating a version 2 for the `Foo` class:

```javascript
class Foo {
    constructor(foo, foo2) {
        this.foo = foo;
        this.foo2 = foo2;
        // VersionedPortable interface properties:
        this.factoryId = 1;
        this.classId = 1;
        this.version = 2;
    }

    readPortable(reader) {
        this.foo = reader.readString('foo');
        this.foo2 = reader.readString('foo2');
    }

    writePortable(writer) {
        writer.writeString('foo', this.foo);
        writer.writeString('foo2', this.foo2);
    }
}
```

You should consider the following when you perform versioning:

- It is important to change the version whenever an update is performed in the serialized fields of a class, for example by incrementing the version.
- If a client performs a Portable deserialization on a field and then that `Portable` is updated by removing that field on the cluster side, this may lead to problems such as a `TypeError` being thrown when an older version of the client tries to access the removed field.
- Portable serialization does not use reflection and hence, fields in the class and in the serialized content are not automatically mapped. Field renaming is a simpler process. Also, since the class ID is stored, renaming the Portable does not lead to problems.
- Types of fields need to be updated carefully. Hazelcast performs basic type upgrades, such as `int` to `float`.

#### Example Portable Versioning Scenarios:

Assume that a new client joins to the cluster with a class that has been modified and class's version has been upgraded due to this modification.

If you modified the class by adding a new field, the new client’s put operations include that new field. If the new client tries to get an object that was put from the older clients, it gets `null` for the newly added field.

If you modified the class by removing a field, the old clients get `null` for the objects that are put by the new client.

If you modified the class by changing the type of a field to an incompatible type (such as from `int` to `String`), a `TypeError` is generated as the client tries accessing an object with the older version of the class. The same applies if a client with the old version tries to access a new version object.

If you did not modify a class at all, it works as usual.

## 4.3. Custom Serialization

Hazelcast lets you plug a custom serializer to be used for serialization of objects.

Let's say you have an object `CustomSerializable` and you would like to customize the serialization, since you may want to use an external serializer for only one object.

```javascript
class CustomSerializable {
    constructor(value) {
        this.value = value;
        // CustomSerializable interface properties:
        this.hzCustomId = 10;
    }
}
```

Note that the `hzCustomId` property should return type id of the `CustomSerializable`.

Now you need to implement a custom `Serializer` which will serialize `CustomSerializable` objects.

```javascript
class CustomSerializer {
    constructor() {
        // Serializer interface properties:
        this.id = 10;
    }

    read(input) {
        const len = input.readInt();
        let str = '';
        for (let i = 0; i < len; i++) {
            str = str + String.fromCharCode(input.readInt());
        }
        return new CustomSerializable(str);
    }

    write(output, obj) {
        output.writeInt(obj.value.length);
        for (let i = 0; i < obj.value.length; i++) {
            output.writeInt(obj.value.charCodeAt(i));
        }
    }
}
```

Note that the serializer `id` must be unique as Hazelcast will use it to lookup the `CustomSerializer` while it deserializes the object. Now the last required step is to register the `CustomSerializer` to the configuration.

```javascript
const cfg ={
    serialization: {
        customSerializers: [
            10: new CustomSerializer()
        ]
    }
};
```

From now on, Hazelcast will use `CustomSerializer` to serialize `CustomSerializable` objects.

## 4.4. Global Serialization

The global serializer is identical to custom serializers from the implementation perspective. The global serializer is registered as a fallback serializer to handle all other objects if a serializer cannot be located for them.

By default, JSON serialization is used if the object is not `IdentifiedDataSerializable` or `Portable` or there is no custom serializer for it. When you configure a global serializer, it is used instead of JSON serialization.

**Use cases:**

* Third party serialization frameworks can be integrated using the global serializer.
* For your custom objects, you can implement a single serializer to handle all of them.

A sample global serializer that integrates with a third party serializer is shown below.

```javascript
class GlobalSerializer {
    constructor() {
        // Serializer interface properties:
        this.id = 20;
    }

    read(input) {
        return MyFavoriteSerializer.deserialize(input.readByteArray());
    }

    write(output, obj) {
        output.writeByteArray(MyFavoriteSerializer.serialize(obj));
    }
}
```

You should register the global serializer in the configuration.

**Programmatic Configuration:**

```javascript
const cfg = {
    serialization: {
        globalSerializer: new GlobalSerializer()
    }
};
```

## 4.5. JSON Serialization

If the Hazelcast Node.js client cannot find a suitable serializer for an object, it uses `JSON Serialization` by default. With `JSON Serialization`, objects are converted to JSON strings and transmitted to the Hazelcast members as such.

When the Hazelcast Node.js client retrieves a JSON serialized data from a member, it parses the JSON string and returns the object represented by that string to the user. However, you may want to defer the string parsing and work with the raw JSON strings.

For this purpose, you can configure your client to return `HazelcastJsonValue` objects when it retrieves a JSON serialized data from a member.

`HazelcastJsonValue` is a lightweight wrapper around the raw JSON strings. You may get the JSON string representation of the object using the `toString()` method.

Below is the configuration required to return `HazelcastJsonValue` objects instead of JavaScript objects.

**Programmatic Configuration:**

```javascript
const cfg = {
    serialization: {
        jsonStringDeserializationPolicy = 'NO_DESERIALIZATION'
    }
};
```


# 5. Setting Up Client Network

Main parts of network related configuration for Hazelcast Node.js client may be tuned via the `network` configuration option.

Here is an example of configuring the network for Hazelcast Node.js client.

```javascript
const cfg = {
    network: {
        clusterMembers: ['10.1.1.21', '10.1.1.22:5703'],
        smartRouting: true,
        redoOperation: true,
        connectionTimeout: 6000
    }
};
```

## 5.1. Providing Member Addresses

Address list is the initial list of cluster addresses which the client will connect to. The client uses this
list to find an alive member. Although it may be enough to give only one address of a member in the cluster
(since all members communicate with each other), it is recommended that you give the addresses for all the members.

```javascript
const cfg = {
    network: {
        clusterMembers: [
            "10.1.1.21",
            "10.1.1.22:5703"
        ]
    }
};
```

If the port part is omitted, then `5701`, `5702` and `5703` ports will be tried in a random order.

You can specify multiple addresses with or without the port information as seen above. The provided list is shuffled and tried in a random order. Its default value is `localhost`.

## 5.2. Setting Smart Routing

Smart routing defines whether the client mode is smart or unisocket. See the [Node.js Client Operation Modes section](#82-nodejs-client-operation-modes) for the description of smart and unisocket modes.

```javascript
const cfg = {
    network: {
        smartRouting: true
    }
};
```

Its default value is `true` (smart client mode).

## 5.3. Enabling Redo Operation

It enables/disables redo-able operations. While sending the requests to the related members, the operations can fail due to various reasons. Read-only operations are retried by default. If you want to enable retry for the other operations, you can set the `redoOperation` to `true`.

```javascript
const cfg = {
    network: {
        redoOperation: true
    }
};
```

Its default value is `false` (disabled).

## 5.4. Setting Connection Timeout

Connection timeout is the timeout value in milliseconds for the members to accept the client connection requests.

```javascript
const cfg = {
    network: {
        connectionTimeout: 6000
    }
};
```

Its default value is `5000` milliseconds.

## 5.5. Enabling Client TLS/SSL

You can use TLS/SSL to secure the connection between the clients and members. If you want to enable TLS/SSL
for the client-cluster connection, you should set an SSL configuration. Please see [TLS/SSL section](#91-tlsssl).

As explained in the TLS/SSL section, Hazelcast members have key stores used to identify themselves (to other members) and Hazelcast Node.js clients have certificate authorities used to define which members they can trust. Hazelcast has the mutual authentication feature which allows the Node.js clients also to have their private keys and public certificates, and members to have their certificate authorities so that the members can know which clients they can trust. See the [Mutual Authentication section](#913-mutual-authentication).

## 5.6. Enabling Hazelcast Cloud Discovery

Hazelcast Node.js client can discover and connect to Hazelcast clusters running on [Hazelcast Cloud](https://cloud.hazelcast.com/). For this, provide authentication information as `clusterName` and enable cloud discovery by setting your `discoveryToken` as shown below.

```javascript
const cfg = {
    clusterName: 'hzCluster',
    network: {
        hazelcastCloud: {
            discoveryToken: 'EXAMPLE_TOKEN'
        }
    }
};
```

If you have enabled encryption for your cluster, you should also enable TLS/SSL configuration for the client to secure communication between your client and cluster members as described in the [TLS/SSL section](#91-tlsssl).

## 5.7. Configuring Backup Acknowledgment

When an operation with sync backup is sent by a client to the Hazelcast member(s), the acknowledgment of the operation's backup is sent to the client by the backup replica member(s). This improves the performance of the client operations.

To disable backup acknowledgement, you should use the `backupAckToClientEnabled` configuration option.

```javascript
const cfg = {
    backupAckToClientEnabled: false
};
```

Its default value is `true`. This option has no effect for unisocket clients.

You can also fine-tune this feature using entries of the `properties` config option as described below:

- `hazelcast.client.operation.backup.timeout.millis`: Default value is `5000` milliseconds. If an operation has
backups, this property specifies how long (in milliseconds) the invocation waits for acks from the backup replicas. If acks are not received from some of the backups, there will not be any rollback on the other successful replicas.

- `hazelcast.client.operation.fail.on.indeterminate.state`: Default value is `false`. When it is `true`, if an operation has sync backups and acks are not received from backup replicas in time, or the member which owns primary replica of the target partition leaves the cluster, then the invocation fails. However, even if the invocation fails, there will not be any rollback on other successful replicas.

## 5.8. External Client Public Address Discovery

> **NOTE: This feature requires Hazelcast IMDG 4.2 or higher version.**

When you set up a Hazelcast cluster in the Cloud (AWS, Azure, GCP, Kubernetes) and would like to use it from outside the Cloud network, the client needs to communicate with all cluster members via their public IP addresses. Whenever Hazelcast cluster members are able to resolve their own public external IP addresses, they pass this information to the client. As a result, the client can use public addresses for communication, if it cannot access members via private IPs.

Hazelcast Node.js client has a built-in mechanism to detect such situation. When the client starts, it executes the following steps:

1. Check if private addresses reported by members are the same as defined in the client configuration. If they are the same, no need to use public addresses. If not, then
2. Check if every member is reachable via public address but not reachable via private address (for the performance reason, only 3 members are checked). If the check succeeds, the client uses public addresses for further communication.

For more details on member-side configuration, refer to the [Discovery SPI section](https://docs.hazelcast.com/imdg/latest/extending-hazelcast/discovery-spi.html) in the Hazelcast IMDG Reference Manual.

You can disable the detection mechanism and specify the client behavior by using the following `properties` config option:

- `hazelcast.discovery.public.ip.enabled`: Default value is `null` (detection enabled). When set to `true`, the client will assume that it needs to use public IP addresses reported by members. When set to `false`, the client will always use private addresses reported by members.

> **NOTE: The detection mechanism is disabled when the client is configured to use [TLS/SSL encryption](#91-tlsssl). In such setup you should explicitly set the `hazelcast.discovery.public.ip.enabled` property.**

> **NOTE: This feature is disabled when the client is configured to use [Hazelcast Cloud Discovery](#56-enabling-hazelcast-cloud-discovery).**

# 6. Client Connection Strategy

Node.js client can be configured to connect to a cluster in an async manner during the client start and reconnecting
after a cluster disconnect. Both of these options are configured via `ClientConnectionStrategyConfig`.

You can configure the client’s starting mode as async or sync using the configuration element `asyncStart`. When it is set to `true` (async), the behavior of `Client.newHazelcastClient()` call changes. It resolves a client instance without waiting to establish a cluster connection. In this case, the client rejects any network dependent operation with `ClientOfflineError` immediately until it connects to the cluster. If it is `false`, the call is not resolved and the client is not created until a connection with the cluster is established. Its default value is `false` (sync).

You can also configure how the client reconnects to the cluster after a disconnection. This is configured using the
configuration element `reconnectMode`; it has three options:

* `OFF`:  Client rejects to reconnect to the cluster and triggers the shutdown process.
* `ON`: Client opens a connection to the cluster in a blocking manner by not resolving any of the waiting invocations.
* `ASYNC`: Client opens a connection to the cluster in a non-blocking manner by resolving all the waiting invocations with `ClientOfflineError`.

Its default value is `ON`.

The example configuration below show how to configure a Node.js client’s starting and reconnecting modes.

```javascript
const cfg = {
    connectionStrategy: {
        asyncStart: false,
        reconnectMode: 'ON'
    }
};
```

## 6.1. Configuring Client Connection Retry

When the client is disconnected from the cluster, it searches for new connections to reconnect. You can configure the frequency of the reconnection attempts and client shutdown behavior using the `connectionStrategy.connectionRetry` configuration option.

```javascript
const cfg = {
    connectionStrategy: {
        asyncStart: false,
        reconnectMode: 'ON',
        connectionRetry: {
            initialBackoffMillis: 1000,
            maxBackoffMillis: 60000,
            multiplier: 2,
            clusterConnectTimeoutMillis: 50000,
            jitter: 0.2
        }
    }
};
```

The following are configuration element descriptions:

* `initialBackoffMillis`: Specifies how long to wait (backoff), in milliseconds, after the first failure before retrying. Its default value is `1000` ms. It must be non-negative.
* `maxBackoffMillis`: Specifies the upper limit for the backoff in milliseconds. Its default value is `30000` ms. It must be non-negative.
* `multiplier`: Factor to multiply the backoff after a failed retry. Its default value is `1.05`. It must be greater than or equal to `1`.
* `clusterConnectTimeoutMillis`: Timeout value in milliseconds for the client to give up to connect to the current cluster. If set to -1, the client tries to connect forever. If set to 0, the client won't try to connect anymore after the first attempt fails. The default value is `-1` (No timeout).
* `jitter`: Specifies by how much to randomize backoffs. Its default value is `0`. It must be in range `0` to `1`.

A pseudo-code for connection retry logic is as follows:

```text
begin_time = getCurrentTime()
current_backoff_millis = INITIAL_BACKOFF_MILLIS
while (tryConnect(connectionTimeout)) != SUCCESS) {
    if (getCurrentTime() - begin_time >= CLUSTER_CONNECT_TIMEOUT_MILLIS) {
        // Give up to connecting to the current cluster and switch to another if exists.
    }
    Sleep(current_backoff_millis + UniformRandom(-JITTER * current_backoff_millis, JITTER * current_backoff_millis))
    current_backoff = Min(current_backoff_millis * MULTIPLIER, MAX_BACKOFF_MILLIS)
}
```

Note that, `tryConnect` above tries to connect to any member that the client knows, and for each connection we have a connection timeout; see the [Setting Connection Timeout](#54-setting-connection-timeout) section.


# 7. Blue-Green Deployment and Disaster Recovery

Hazelcast provides disaster recovery for the client-cluster connections and can use the well-known blue-green mechanism, so that a Node.js client is automatically diverted to another cluster on demand or when the intended cluster becomes unavailable. These features require **Hazelcast IMDG Enterprise** edition.

Using the blue-green system, the clients can connect to another cluster automatically when they are blacklisted from their currently connected cluster. See the [Blue-Green Mechanism section](https://docs.hazelcast.com/imdg/latest/clients/java.html#blue-green-mechanism) in the Hazelcast IMDG Reference Manual for information on the blue-green deployment support.

With the disaster recovery, the clients tries to connect to alternative clusters described in the failover config when one of your clusters is gone due to a failure. See the [Disaster Recovery Mechanism section](https://docs.hazelcast.com/imdg/latest/clients/java.html#disaster-recovery-mechanism) in the Hazelcast IMDG Reference Manual for information on the disaster recovery.

## 7.1. Configuring Client

In order to configure the client for blue-green deployment or disaster recovery you need to start it with the `Client.newHazelcastFailoverClient` function and provide the client failover configuration, like shown below.

```javascript
const client = await Client.newHazelcastFailoverClient({
    tryCount: 3,
    // Client configs for alternative clusters go here:
    clientConfigs: [
        // Each config has the same structure as in `Client.newHazelcastClient`.
        {
            clusterName: 'clusterA',
            network: {
                clusterMembers: ['clusterA.member1', 'clusterA.member2']
            }
        },
        {
            clusterName: 'clusterB',
            network: {
                clusterMembers: ['clusterB.member1', 'clusterB.member2']
            }
        }
    ]
});
// Some operations
```

The following are configuration element descriptions:

* `tryCount`: Specifies the count of attempts to connect to a cluster. Its default value is `Number.MAX_SAFE_INTEGER`. It must be non-negative. For each alternative cluster, the client will try to connect to the cluster respecting related `connectionRetry`. When the client can not connect a cluster, it will try to connect `tryCount` times going over the alternative client configs in a round-robin fashion. This is triggered at the start and also when the client disconnects from the cluster and can not connect back to it by exhausting attempts described in connectionRetry config. In that case, the client will continue from where it is left off in `clientConfigs` list, and try the next one again in round-robin `tryCount` times. For example, if two alternative clusters are given in the `clientConfigs` list and the tryCount is set as 4, the maximum number of subsequent connection attempts done by the client is 4 x 2 = 8.
* `clientConfigs`: The list of client configs for alternative clusters to be used by the client. The client configurations must be exactly the same except the following configuration options:
  - `clusterName`
  - `customCredentials`
  - `network.clusterMembers`
  - `network.ssl`
  - `network.hazelcastCloud`


# 8. Using Node.js Client with Hazelcast IMDG

This chapter provides information on how you can use Hazelcast IMDG's data structures in the Node.js client, after giving some basic information including an overview to the client API, operation modes of the client and how it handles the failures.

## 8.1. Node.js Client API Overview

Most of the functions in the API return Promises. Therefore, you need to be familiar with the concept of promises to use the Node.js client. If not, you can learn about them using various online resources. Also, you can use async/await.

If you are ready to go, let's start to use Hazelcast Node.js client.

The first step is the configuration. See the [Programmatic Configuration section](#311-programmatic-configuration) for details.

The following is an example on how to create a `ClientConfig` object and configure it programmatically:

The fist step is to define configuration and initialize the `HazelcastClient` to be connected to the cluster:

```javascript
const client = await Client.newHazelcastClient({
    clusterName: 'dev',
    network: {
        clusterMembers: ['10.90.0.1', '10.90.0.2:5702']
    }
});
// Some operations
```

This client object is your gateway to access all the Hazelcast distributed objects.

Let's create a map and populate it with some data, as shown below.

```javascript
// Get a Map called 'my-distributed-map'
const map = await client.getMap('my-distributed-map');
// Write and read some data
await map.put('key', 'value');
const val = await map.get('key');
```

As the final step, if you are done with your client, you can shut it down as shown below. This will release all the used resources and close connections to the cluster.

```javascript
...
await client.shutdown();
```

## 8.2. Node.js Client Operation Modes

The client has two operation modes because of the distributed nature of the data and cluster: smart and unisocket. Refer to the [Setting Smart Routing](#52-setting-smart-routing) section to see how to configure the client for different operation modes.

### 8.2.1. Smart Client

In the smart mode, the clients connect to each cluster member. Since each data partition uses the well-known and consistent hashing algorithm, each client can send an operation to the relevant cluster member, which increases the overall throughput and efficiency. Smart mode is the default mode.

### 8.2.2. Unisocket Client

For some cases, the clients can be required to connect to a single member instead of each member in the cluster. Firewalls, security or some custom networking issues can be the reason for these cases.

In the unisocket client mode, the client will only connect to one of the configured addresses. This single member will behave as a gateway to the other members. For any operation requested from the client, it will redirect the request to the relevant member and return the response back to the client connected to this member.

## 8.3. Handling Failures

There are two main failure cases you should be aware of. Below sections explain these, and the configuration options you can use to achieve proper behavior.

### 8.3.1. Handling Client Connection Failure

While the client is trying to connect initially to one of the members for the `network.addresses` array, all the members might not be available. Instead of giving up, throwing an error and stopping the client, the client retries to connect as configured. This behavior is described in the [Configuring Client Connection Retry](#61-configuring-client-connection-retry) section.

The client executes each operation through the already established connection to the cluster. If this connection(s) disconnects or drops, the client will try to reconnect as configured.

### 8.3.2. Handling Retry-able Operation Failure

While sending requests to cluster members, the operations may fail due to various reasons. Read-only operations are retried by default. If you want to enable retrying for non-read-only operations, you can set the `redoOperation` to `true`. See the [Enabling Redo Operation section](#53-enabling-redo-operation).

You can set a timeout for retrying the operations sent to a member. This can be provided by using the property `hazelcast.client.invocation.timeout.millis` in the `properties` option. The client will retry an operation within this given period, of course, if it is a read-only operation or you enabled the `redoOperation` as stated in the above paragraph. This timeout value is important when there is a failure resulted by either of the following causes:

* Member throws an exception.
* Connection between the client and member is closed.
* Client’s heartbeat requests are timed out.

When a connection problem occurs, an operation is retried if it is certain that it has not run on the member yet or if it is idempotent such as a read-only operation, i.e., retrying does not have a side effect. If it is not certain whether the operation has run on the member, then the non-idempotent operations are not retried. However, as explained in the first paragraph of this section, you can force all the client operations to be retried (`redoOperation`) when there is a connection failure between the client and member. But in this case, you should know that some operations may run multiple times causing conflicts. For example, assume that your client sent a `queue.offer` operation to the member and then the connection is lost. Since there will be no response for this operation, you will not know whether it has run on the member or not. If you enabled `redoOperation`, it means this operation may run again, which may cause two instances of the same object in the queue.

## 8.4. Using Distributed Data Structures

Most of the distributed data structures available in IMDG are supported by the Node.js client. In this chapter, you will learn how to use these distributed data structures.

### 8.4.1. Using Map

Hazelcast Map (`IMap`) is a distributed map. Through the Node.js client, you can perform operations like reading and writing from/to a Hazelcast Map with the well known get and put methods. For details, see the [Map section](https://docs.hazelcast.com/imdg/latest/data-structures/map.html) in the Hazelcast IMDG Reference Manual.

A Map usage example is shown below.

```javascript
// Get a Map called 'my-distributed-map'
const map = await client.getMap('my-distributed-map');
// Run Put and Get operations
await map.put('key', 'value');
const val = await map.get('key');
// Run concurrent Map operations (optimistic updates)
await map.putIfAbsent('somekey', 'somevalue');
await map.replace('key', 'value', 'newvalue');
```

Hazelcast Map supports a Near Cache for remotely stored entries to increase the performance of read operations. See the [Near Cache section](#882-near-cache) for a detailed explanation of the Near Cache feature and its configuration.

Hazelcast Map uses `MapListener` to listen to the events that occur when the entries are added to, updated/merged in or evicted/removed from the Map. See the [Map Listener section](#8521-map-listener) for information on how to create a map listener object and register it.

### 8.4.2. Using MultiMap

Hazelcast `MultiMap` is a distributed and specialized map where you can store multiple values under a single key. For details, see the [MultiMap section](https://docs.hazelcast.com/imdg/latest/data-structures/multimap.html) in the Hazelcast IMDG Reference Manual.

A MultiMap usage example is shown below.

```javascript
// Get a MultiMap called 'my-distributed-multimap'
const multiMap = await client.getMultiMap('my-distributed-multimap');
// Put values in the map against the same key
await multiMap.put('my-key', 'value1');
await multiMap.put('my-key', 'value2');
await multiMap.put('my-key', 'value3');
// Read and print out all the values for associated with key called 'my-key'
const values = await multiMap.get('my-key')
for (const value of values) {
    console.log(value);
}
// Remove specific key/value pair
await multiMap.remove('my-key', 'value2');
```

Hazelcast MultiMap uses `EntryListener` to listen to the events that occur when the entries are added to or removed from the MultiMap. See the [Entry Listener section](#8522-entry-listener) for information on how to create an entry listener object and register it.

### 8.4.3. Using Replicated Map

Hazelcast `ReplicatedMap` is a distributed key-value data structure where the data is replicated to all members in the cluster. It provides full replication of entries to all members for high speed access. For details, see the [Replicated Map section](https://docs.hazelcast.com/imdg/latest/data-structures/replicated-map.html) in the Hazelcast IMDG Reference Manual.

A Replicated Map usage example is shown below.

```javascript
// Get a ReplicatedMap called 'my-replicated-map'
const map = await client.getReplicatedMap('my-replicated-map');
// Put and get a value from the Replicated Map
// (key/value is replicated to all members)
const replacedValue = await map.put('key', 'value');
// Will print 'Replaced value: null' as it's the first update
console.log('Replaced value:', replacedValue);
const value = map.get('key');
// The value is retrieved from a random member in the cluster
console.log('Value:', value);
```

Hazelcast Replicated Map uses `EntryListener` to listen to the events that occur when the entries are added to, updated in or evicted/removed from the Replicated Map. See the [Entry Listener section](#8522-entry-listener) for information on how to create an entry listener object and register it.

### 8.4.4. Using Queue

Hazelcast Queue (`IQueue`) is a distributed queue which enables all cluster members to interact with it. For details, see the [Queue section](https://docs.hazelcast.com/imdg/latest/data-structures/queue.html) in the Hazelcast IMDG Reference Manual.

A Queue usage example is shown below.

```javascript
// Get a Queue called 'my-distributed-queue'
const queue = await client.getQueue('my-distributed-queue');
// Offer a string into the Queue
await queue.offer('item');
// Poll the Queue and return the string
let item = queue.poll();
// Timed-restricted operations
await queue.offer('anotheritem', 500); // waits up to 500 millis
await queue.poll(5000); // waits up to 5000 millis
// Indefinitely-waiting operations
await queue.put('yetanotheritem');
const item = queue.take();
console.log('Item:', item);
```

Hazelcast Queue uses `ItemListener` to listen to the events that occur when the items are added to or removed from the Queue. See the [Item Listener section](#8523-item-listener) for information on how to create an item listener object and register it.

### 8.4.5. Using Set

Hazelcast Set (`ISet`) is a distributed set which does not allow duplicate elements. For details, see the [Set section](https://docs.hazelcast.com/imdg/latest/data-structures/set.html) in the Hazelcast IMDG Reference Manual.

A Set usage example is shown below.

```javascript
// Get a Set called 'my-distributed-set'
const set = await client.getSet('my-distributed-set');
// Add items to the Set with duplicates
await set.add('item1');
await set.add('item1');
await set.add('item2');
await set.add('item2');
await set.add('item2');
await set.add('item3');
// Get the items. Note that there are no duplicates
const values = await set.toArray();
console.log('Values:', values);
```

Hazelcast Set uses `ItemListener` to listen to the events that occur when the items are added to or removed from the Set. See the [Item Listener section](#8523-item-listener) for information on how to create an item listener object and register it.

### 8.4.6. Using List

Hazelcast List (`IList`) is a distributed list which allows duplicate elements and preserves the order of elements. For details, see the [List section](https://docs.hazelcast.com/imdg/latest/data-structures/list.html) in the Hazelcast IMDG Reference Manual.

A List usage example is shown below.

```javascript
// Get a List called 'my-distributed-list'
const list = await client.getList('my-distributed-list');
// Add elements to the list
await list.add('item1');
await list.add('item2');
// Remove the first element
const value = await list.removeAt(0);
console.log('Value:', value);
// There is only one element left
const len = await list.size();
console.log('Length:', len);
// Clear the list
await list.clear();
```

Hazelcast List uses `ItemListener` to listen to the events that occur when the items are added to or removed from the List. See the [Item Listener section](#8523-item-listener) for information on how to create an item listener object and register it.

### 8.4.7. Using Ringbuffer

Hazelcast `Ringbuffer` is a replicated but not partitioned data structure that stores its data in a ring-like structure. You can think of it as a circular array with a given capacity. Each Ringbuffer has a tail and a head. The tail is where the items are added and the head is where the items are overwritten or expired. You can reach each element in a Ringbuffer using a sequence ID, which is mapped to the elements between the head and tail (inclusive) of the Ringbuffer. For details, see the [Ringbuffer section](https://docs.hazelcast.com/imdg/latest/data-structures/ringbuffer.html) in the Hazelcast IMDG Reference Manual.

A Ringbuffer usage example is shown below.

```javascript
// Get a Ringbuffer called 'my-distributed-ringbuffer'
const rb = await client.getRingbuffer('my-distributed-ringbuffer');
// Add some elements to the Ringbuffer
await rb.add(100);
await rb.add(200);
// We start from the oldest item.
// If you want to start from the next item, call rb.tailSequence()+1
const sequence = await rb.headSequence();
let value = await rb.readOne(sequence);
console.log('Value:', value);
value = await rb.readOne(sequence.add(1));
console.log('Next value:', value);
```

### 8.4.8. Using Reliable Topic

Hazelcast `ReliableTopic` is a distributed topic implementation backed up by the `Ringbuffer` data structure. For details, see the [Reliable Topic section](https://docs.hazelcast.com/imdg/latest/data-structures/reliable-topic.html) in the Hazelcast IMDG Reference Manual.

A Reliable Topic usage example is shown below.

```javascript
// Get a Topic called 'my-distributed-topic'
const topic = await client.getReliableTopic('my-distributed-topic');
// Add a Listener to the Topic
topic.addMessageListener((message) => {
    console.log('Message:', message);
});
// Publish a message to the Topic
await topic.publish('Hello to the distributed world!');
```

Hazelcast Reliable Topic uses `MessageListener` to listen to the events that occur when a message is received. See the [Message Listener section](#8524-message-listener) for information on how to create a message listener object and register it.

#### 8.4.8.1 Configuring Reliable Topic

You may configure `ReliableTopic`s as the following:

```javascript
const cfg = {
    reliableTopics: {
        'rt1': {
            readBatchSize: 35,
            overloadPolicy: 'DISCARD_NEWEST'
        }
    }
};
```

The following are the descriptions of configuration elements and attributes:

* key (`rt1` in the above example): Name of your Reliable Topic. Hazelcast client supports wildcard configuration for Reliable Topics. Using an asterisk (`*`) character in the name, different instances of topics can be configured by a single configuration.
* `readBatchSize`: Minimum number of messages that Reliable Topic tries to read in batches. Its default value is `10`.
* `overloadPolicy`: Policy to handle an overloaded topic. Available values are `DISCARD_OLDEST`, `DISCARD_NEWEST`, `BLOCK` and `ERROR`. Its default value is `BLOCK`. See [Slow Consumers](https://docs.hazelcast.com/imdg/latest/data-structures/reliable-topic.html#slow-consumers) for definitions of these policies.

> **NOTE: When you use `default` as the Reliable Topic configuration key, it has a special meaning. Hazelcast client will use that configuration as the default one for all Reliable Topics, unless there is a specific configuration for the topic.**

### 8.4.9. Using PN Counter

Hazelcast `PNCounter` (Positive-Negative Counter) is a CRDT positive-negative counter implementation. It is an eventually consistent counter given there is no member failure. For details, see the [PN Counter section](https://docs.hazelcast.com/imdg/latest/data-structures/pn-counter.html) in the Hazelcast IMDG Reference Manual.

A PN Counter usage example is shown below.

```javascript
// Get a PN Counter called 'my-pn-counter'
const pnCounter = await client.getPNCounter('my-pn-counter');
// Get the current value
let value = await pnCounter.get();
console.log('Counter started with value:', value); // 0

// Increment and get
value = await pnCounter.addAndGet(5);
console.log('Value after operation:', value); // 5
// Get and increment
value = await pnCounter.getAndAdd(2);
console.log('Value before operation:', value); // 5

value = await pnCounter.get();
console.log('New value:', value); // 7
value = await pnCounter.decrementAndGet();
console.log('Decremented counter by one. New value:', value); // 6
```

### 8.4.10. Using Flake ID Generator

Hazelcast `FlakeIdGenerator` is used to generate cluster-wide unique identifiers. Generated identifiers are long primitive values and are k-ordered (roughly ordered). IDs are in the range from `0` to `2^63-1` (maximum value for Java's `long` type). For details, see the [FlakeIdGenerator section](https://docs.hazelcast.com/imdg/latest/data-structures/flake-id-generator.html) in the Hazelcast IMDG Reference Manual.

A Flake ID Generator usage example is shown below.

```javascript
// Get a Flake ID Generator called 'my-flake-id-generator'
const flakeIdGenerator = await client.getFlakeIdGenerator('my-flake-id-generator');
// Generate an id (returns a Long)
const id = flakeIdGenerator.newId();
console.log('New id:', id.toString());
```

#### 8.4.10.1 Configuring Flake ID Generator

You may configure `FlakeIdGenerator`s as the following:

```javascript
const cfg = {
    flakeIdGenerators: {
        'flakeidgenerator': {
            prefetchCount: 123,
            prefetchValidityMillis: 150000
        }
    }
};
```
> **NOTE: Since JavaScript's `number` type cannot represent numbers greater than `2^53` without precision loss, you need to put long numbers in quotes as a string.**

The following are the descriptions of configuration elements and attributes:

* key (`flakeidgenerator` in the above example): Name of your Flake ID Generator. Hazelcast client supports wildcard configuration for Flake ID Generators. Using an asterisk (`*`) character in the name, different instances of generators can be configured by a single configuration.
* `prefetchCount`: Count of IDs which are pre-fetched on the background when one call to `FlakeIdGenerator.newId()` is made. Its value must be in the range `1` - `100,000`. Its default value is `100`.
* `prefetchValidityMillis`: Specifies for how long the pre-fetched IDs can be used. After this time elapses, a new batch of IDs are fetched. Time unit is milliseconds. Its default value is `600,000` milliseconds (`10` minutes). The IDs contain a timestamp component, which ensures a rough global ordering of them. If an ID is assigned to an object that was created later, it will be out of order. If ordering is not important, set this value to `0`.

> **NOTE: When you use `default` as the Flake ID Generator configuration key, it has a special meaning. Hazelcast client will use that configuration as the default one for all Flake ID Generators, unless there is a specific configuration for the generator.**

### 8.4.11. CP Subsystem

Hazelcast IMDG 4.0 introduces CP concurrency primitives with respect to the [CAP principle](http://awoc.wolski.fi/dlib/big-data/Brewer_podc_keynote_2000.pdf), i.e., they always maintain [linearizability](https://aphyr.com/posts/313-strong-consistency-models) and prefer consistency to availability during network partitions and client or server failures.

All data structures within CP Subsystem are available through `client.getCPSubsystem()` component of the client.

Before using Atomic Long, Lock, and Semaphore, CP Subsystem has to be enabled on cluster-side. Refer to [CP Subsystem](https://docs.hazelcast.com/imdg/latest/cp-subsystem/cp-subsystem.html) documentation for more information.

Data structures in CP Subsystem run in CP groups. Each CP group elects its own Raft leader and runs the Raft consensus algorithm independently. The CP data structures differ from the other Hazelcast data structures in two aspects. First, an internal commit is performed on the METADATA CP group every time you fetch a proxy from this interface. Hence, callers should cache returned proxy objects. Second, if you call `DistributedObject.destroy()` on a CP data structure proxy, that data structure is terminated on the underlying CP group and cannot be reinitialized until the CP group is force-destroyed. For this reason, please make sure that you are completely done with a CP data structure before destroying its proxy.

#### 8.4.11.1. Using Atomic Long

Hazelcast `IAtomicLong` is the distributed implementation of atomic 64-bit integer counter. It offers various atomic operations such as `get`, `set`, `getAndSet`, `compareAndSet` and `incrementAndGet`. This data structure is a part of CP Subsystem.

An Atomic Long usage example is shown below.

```javascript
// Get an AtomicLong called 'my-atomic-long'
const atomicLong = await client.getCPSubsystem().getAtomicLong('my-atomic-long');
// Get current value (returns a Long)
const value = await atomicLong.get();
console.log('Value:', value);
// Prints:
// Value: 0
// Increment by 42
await atomicLong.addAndGet(42);
// Set to 0 atomically if the current value is 42
const result = atomicLong.compareAndSet(42, 0);
console.log('CAS operation result:', result);
// Prints:
// CAS operation result: true
```

AtomicLong implementation does not offer exactly-once / effectively-once execution semantics. It goes with at-least-once execution semantics by default and can cause an API call to be committed multiple times in case of CP member failures. It can be tuned to offer at-most-once execution semantics. Please see `fail-on-indeterminate-operation-state` option in [CP Subsystem server-side configuration](https://docs.hazelcast.com/imdg/latest/cp-subsystem/configuration.html#cp-subsystem-configuration).

#### 8.4.11.2. Using Lock

Hazelcast `FencedLock` is the distributed implementation of a linearizable lock. It offers multiple  operations for acquiring the lock. This data structure is a part of CP Subsystem.

A basic Lock usage example is shown below.

```javascript
// Get a FencedLock called 'my-lock'
const lock = await client.getCPSubsystem().getLock('my-lock');
// Acquire the lock (returns a fencing token of Long type)
const fence = await lock.lock();
try {
    // Your guarded code goes here
} finally {
    // Make sure to release the lock
    await lock.unlock(fence);
}
```

FencedLock works on top of CP sessions. It keeps a CP session open while the lock is acquired. Please refer to [CP Session](https://docs.hazelcast.com/imdg/latest/cp-subsystem/sessions.html) documentation for more information.

Distributed locks are unfortunately *not equivalent* to single-node mutexes because of the complexities in distributed systems, such as uncertain communication patterns, and independent and partial failures. In an asynchronous network, no lock service can guarantee mutual exclusion, because there is no way to distinguish between a slow and a crashed process. Consider the following scenario, where a Hazelcast client acquires a FencedLock, then hits a long GC pause. Since it will not be able to commit session heartbeats while paused, its CP session will be eventually closed. After this moment, another Hazelcast client can acquire this lock. If the first client wakes up again, it may not immediately notice that it has lost ownership of the lock. In this case, multiple clients think they hold the lock. If they attempt to perform an operation on a shared resource, they can break the system. To prevent such situations, you can choose to use an infinite session timeout, but this time probably you are going to deal with liveliness issues. For the scenario above, even if the first client actually crashes, requests sent by 2 clients can be re-ordered in the network and hit the external resource in reverse order.

There is a simple solution for this problem. Lock holders are ordered by a monotonic fencing token, which increments each time the lock is assigned to a new owner. This fencing token can be passed to external services or resources to ensure sequential execution of side effects performed by lock holders.

You can read more about the fencing token idea in Martin Kleppmann's "How to do distributed locking" blog post and Google's Chubby paper.

FencedLocks in Hazelcast Node.js client are different from the Java implementation as they are *non-reentrant*. Once a caller acquires the lock, it can not acquire the lock reentrantly in the same asynchronous call chain. So, the next acquire attempt made within the same async chain will lead to a dead lock.

```javascript
const fence = await lock.lock();
// The following Promise will never be resolved
// (i.e., it's a dead lock)
await lock.lock();
```

Considering this, you should always call the `lock()` method only once per async call chain and make sure to release the lock as early as possible.

As an alternative approach, you can use the `tryLock()` method of FencedLock. It tries to acquire the lock in optimistic manner and immediately returns with either a valid fencing token or `undefined`. It also accepts an optional `timeout` argument which specifies the timeout in milliseconds to acquire the lock before giving up.

```javascript
// Try to acquire the lock
const fence = await lock.tryLock();
// Check for valid fencing token
if (fence !== undefined) {
    try {
        // Your guarded code goes here
    } finally {
        // Make sure to release the lock
        await lock.unlock(fence);
    }
}
```

#### 8.4.11.3. Using Semaphore

Hazelcast `ISemaphore` is the distributed implementation of a linearizable and distributed semaphore. It offers multiple operations for acquiring the permits. This data structure is a part of CP Subsystem.

Semaphore is a cluster-wide counting semaphore. Conceptually, it maintains a set of permits. Each `acquire()` waits if necessary until a permit is available, and then takes it. Dually, each `release()` adds a permit, potentially releasing a waiting acquirer. However, no actual permit objects are used; the semaphore just keeps a count of the number available and acts accordingly.

A basic Semaphore usage example is shown below.

```javascript
// Get a Semaphore called 'my-semaphore'
const semaphore = await client.getCPSubsystem().getSemaphore('my-semaphore');
// Try to initialize the semaphore
// (does nothing if the semaphore is already initialized)
await semaphore.init(3);
// Acquire 3 permits out of 3
await semaphore.acquire(3);
// Release 2 permits
await semaphore.release(2);
// Check available permits
const available = await semaphore.availablePermits();
console.log('Available:', available);
// Prints:
// Available: 1
```

Beware of the increased risk of indefinite postponement when using the multiple-permit acquire. If permits are released one by one, a caller waiting for one permit will acquire it before a caller waiting for multiple permits regardless of the call order. Correct usage of a semaphore is established by programming convention in the application.

As an alternative, potentially safer approach to the multiple-permit acquire, you can use the `tryAcquire()` method of Semaphore. It tries to acquire the permits in optimistic manner and immediately returns with a `boolean` operation result. It also accepts an optional `timeout` argument which specifies the timeout in milliseconds to acquire the permits before giving up.

```javascript
// Try to acquire 2 permits
const success = await semaphore.tryAcquire(2);
// Check for valid fencing token
if (success) {
    try {
        // Your guarded code goes here
    } finally {
        // Make sure to release the permits
        await semaphore.release(2);
    }
}
```

 Semaphore data structure has two variations:

 * The default implementation is session-aware. In this one, when a caller makes its very first `acquire()` call, it starts a new CP session with the underlying CP group. Then, liveliness of the caller is tracked via this CP session. When the caller fails, permits acquired by this caller are automatically and safely released. However, the session-aware version comes with a limitation, that is, a Hazelcast client cannot release permits before acquiring them first. In other words, a client can release only the permits it has acquired earlier.
 * The second implementation is sessionless. This one does not perform auto-cleanup of acquired permits on failures. Acquired permits are not bound to callers and permits can be released without acquiring first. However, you need to handle failed permit owners on your own. If a Hazelcast server or a client fails while holding some permits, they will not be automatically released. You can use the sessionless CP Semaphore implementation by enabling JDK compatibility `jdk-compatible` server-side setting. Refer to [Semaphore configuration](https://docs.hazelcast.com/imdg/latest/cp-subsystem/configuration.html#semaphore-configuration) documentation for more details.

#### 8.4.11.4. Using CountDownLatch

Hazelcast `ICountDownLatch` is the distributed implementation of a linearizable and distributed countdown latch. This data structure is a cluster-wide synchronization aid that allows one or more callers to wait until a set of operations being performed in other callers completes. This data structure is a part of CP Subsystem.

A basic CountDownLatch usage example is shown below.

```javascript
// Get a CountDownLatch called 'my-latch'
const latch = await client.getCPSubsystem().getCountDownLatch('my-latch');
// Try to initialize the latch
// (does nothing if the count is not zero)
const initialized = await latch.trySetCount(1);
console.log('Initialized:', initialized);
// Check count
let count = await latch.getCount();
console.log('Count:', count);
// Prints:
// Count: 1
// Bring the count down to zero after 10ms
setTimeout(() => {
    latch.countDown().catch(console.error);
}, 10);
// Wait up to 1 second for the count to become zero up
const countIsZero = await latch.await(1000);
console.log('Count is zero:', countIsZero);
```

> **NOTE: CountDownLatch count can be reset with `trySetCount()` after a countdown has finished, but not during an active count.**

#### 8.4.11.5. Using AtomicReference

Hazelcast `IAtomicReference` is the distributed implementation of a linearizable object reference. It provides a set of atomic operations allowing to modify the value behind the reference. This data structure is a part of CP Subsystem.

A basic AtomicReference usage example is shown below.

```javascript
// Get a AtomicReference called 'my-ref'
const ref = await client.getCPSubsystem().getAtomicReference('my-ref');
// Set the value atomically
await ref.set(42);
// Read the value
const value = await ref.get();
console.log('Value:', value);
// Prints:
// Value: 42
// Try to replace the value with 'value'
// with a compare-and-set atomic operation
const result = await ref.compareAndSet(42, 'value');
console.log('CAS result:', result);
// Prints:
// CAS result: true
```

The following are some considerations you need to know when you use AtomicReference:

* IAtomicReference works based on the byte-content and not on the object-reference. If you use the `compareAndSet()` method, do not change to the original value because its serialized content will then be different.
* All methods returning an object return a private copy. You can modify the private copy, but the rest of the world is shielded from your changes. If you want these changes to be visible to the rest of the world, you need to write the change back to the AtomicReference; but be careful about introducing a data-race.
* The 'in-memory format' of an AtomicReference is `binary`. The receiving side does not need to have the class definition available unless it needs to be deserialized on the other side., e.g., because a method like `alter()` is executed. This deserialization is done for every call that needs to have the object instead of the binary content, so be careful with expensive object graphs that need to be deserialized.
* If you have an object with many fields or an object graph and you only need to calculate some information or need a subset of fields, you can use the `apply()` method. With the `apply()` method, the whole object does not need to be sent over the line; only the information that is relevant is sent.

> **NOTE: `IFunction`-based methods, like `alter()` or `apply()` are not yet supported by Hazelcast Node.js client.**

AtomicReference does not offer exactly-once / effectively-once execution semantics. It goes with at-least-once execution semantics by default and can cause an API call to be committed multiple times in case of CP member failures. It can be tuned to offer at-most-once execution semantics. Please see `fail-on-indeterminate-operation-state` option in [CP Subsystem server-side configuration](https://docs.hazelcast.com/imdg/latest/cp-subsystem/configuration.html#cp-subsystem-configuration).

## 8.5. Distributed Events

This chapter explains when various events are fired and describes how you can add event listeners on a Hazelcast Node.js client. These events can be categorized as cluster and distributed data structure events.

### 8.5.1. Listening for Cluster Events

You can add event listeners to a Hazelcast Node.js client. You can configure the following listeners to listen to the events on the client side:

* Membership Listener: Notifies when a member joins to/leaves the cluster, or when an attribute is changed in a member.
* Distributed Object Listener: Notifies when a distributed object is created or destroyed throughout the cluster.
* Lifecycle Listener: Notifies when the client is starting, started, shutting down and shutdown.

#### 8.5.1.1. Membership Listener

The Membership Listener interface has methods that are invoked for the following events.

* `memberAdded`: A new member is added to the cluster.
* `memberRemoved`: An existing member leaves the cluster.

For these events, a `MembershipEvent` object is passed to the listener function.

After you create the listener object, you can configure your cluster to include the membership listener. You can also add one or more membership listeners.

The following is a membership listener registration by using the `ClusterService.addMembershipListener()` function.

```javascript
const membershipListener = {
    memberAdded: (event) => {
        console.log('Member Added: The address is', event.member.address.toString());
    },
};
client.getClusterService().addMembershipListener(membershipListener);
```

Also, if you want to receive the list of available members when the client connects to cluster you may register an
`InitialMembershipListener`. This listener receives an only-once `InitialMembershipEvent` when the member list becomes
available. After the event has been received, the listener will receive the normal `MembershipEvent`s.

The following is an initial membership listener registration by using the `config.membershipListeners` config option.

```javascript
const membershipListener = {
    init: function (event) {
      console.log("Initial member list received -> " + event.members);
    },
    memberAdded: function (event) {
        console.log('Member Added: The address is', event.member.address.toString());
    },
};
const cfg = {
    membershipListeners: [membershipListener]
};
```

#### 8.5.1.2. Distributed Object Listener

The events for distributed objects are invoked when they are created and destroyed in the cluster. After the events, a listener callback function is called. The interface of the callback function should be `DistributedObjectListener`. The parameter of the function is `DistributedObjectEvent` including following fields:

* `serviceName`: Service name of the distributed object.
* `objectName`: Name of the distributed object.
* `eventType`: Type of the invoked event. It can be `created` or `destroyed`.

The following is an example of adding a `DistributedObjectListener`.

```javascript
await client.addDistributedObjectListener((event) => {
    console.log('Distributed object event >>> ',
        event.serviceName,
        event.objectName,
        event.eventType
    );
});
const mapname = 'test';
// This causes a created event
await client.getMap(mapname);
// This causes no event because map was already created
await client.getMap(mapname);
```

#### 8.5.1.3. Lifecycle Listener

The `LifecycleListener` interface notifies for the following events:

* `STARTING`: The client is starting.
* `STARTED`: The client has started.
* `CONNECTED`: The client connected to a member.
* `CHANGED_CLUSTER`: The client connected to a new cluster.
* `SHUTTING_DOWN`: The client is shutting down.
* `DISCONNECTED`: The client disconnected from a member.
* `SHUTDOWN`: The client has shutdown.

The following is an example of the `LifecycleListener` that is added to the config object and its output.

```javascript
const lifecycleListener = (state) => {
    console.log('Lifecycle Event >>> ' + state);
};
const cfg = {
    lifecycleListeners: [lifecycleListener]
};

const client = await Client.newHazelcastClient(cfg);
await client.shutdown();
```

**Output:**

```
[DefaultLogger] INFO at LifecycleService: HazelcastClient is STARTING
Lifecycle Event >>> STARTING
[DefaultLogger] INFO at LifecycleService: HazelcastClient is STARTED
Lifecycle Event >>> STARTED
[DefaultLogger] INFO at ConnectionManager: Trying to connect to localhost:5701
[DefaultLogger] INFO at LifecycleService: HazelcastClient is CONNECTED
Lifecycle Event >>> CONNECTED
[DefaultLogger] INFO at ConnectionManager: Authenticated with server 192.168.1.10:5701:8d69d670-fa8a-4278-a91f-b43875fccfe8, server version: 4.1-SNAPSHOT, local address: 127.0.0.1:59316
[DefaultLogger] INFO at ClusterService:

Members [1] {
	Member [192.168.1.10]:5701 - 8d69d670-fa8a-4278-a91f-b43875fccfe8
}

[DefaultLogger] INFO at LifecycleService: HazelcastClient is SHUTTING_DOWN
Lifecycle Event >>> SHUTTING_DOWN
[DefaultLogger] INFO at ConnectionManager: Removed connection to endpoint: 192.168.1.10:5701:8d69d670-fa8a-4278-a91f-b43875fccfe8, connection: Connection{alive=false, connectionId=0, remoteAddress=192.168.1.10:5701}
[DefaultLogger] INFO at LifecycleService: HazelcastClient is DISCONNECTED
Lifecycle Event >>> DISCONNECTED
[DefaultLogger] INFO at LifecycleService: HazelcastClient is SHUTDOWN
Lifecycle Event >>> SHUTDOWN
```

### 8.5.2. Listening for Distributed Data Structure Events

You can add event listeners to the distributed data structures.

> **NOTE: Hazelcast Node.js client is a TypeScript-based project but JavaScript does not have interfaces. Therefore, some interfaces are given to the user by using the TypeScript files that have `.ts` extension. In this guide, implementing an interface means creating an object to have the necessary functions that are listed in the interface inside the `.ts` file. Also, this object is mentioned as "an instance of the interface". You can search the [API Documentation](http://hazelcast.github.io/hazelcast-nodejs-client/api/current/docs/) or GitHub repository for the required interface.**

#### 8.5.2.1. Map Listener

The Map Listener is used by the Hazelcast Map (`IMap`).

You can listen to map-wide or entry-based events by using the functions in the `MapListener` interface. Every function type in this interface is one of the `EntryEventListener` and `MapEventListener` types. To listen to these events, you need to implement the relevant `EntryEventListener` and `MapEventListener` functions in the `MapListener` interface.

An entry-based event is fired after the operations that affect a specific entry. For example, `IMap.put()`, `IMap.remove()` or `IMap.evict()`. You should use the `EntryEventListener` type to listen to these events. An `EntryEvent` object is passed to the listener function.

See the following example.

```javascript
const entryEventListener = {
    added: (entryEvent) => {
        console.log('Entry added:', entryEvent.key, '-->', entryEvent.value);
    }
};

await map.addEntryListener(entryEventListener, undefined, true);
await map.put('1', 'My new entry');
// Prints:
// Entry added: 1 --> My new entry
```

The second argument in the `addEntryListener` method is `key`. It stands for the key to listen for. When it is set to `undefined` (or omitted, which is the same), the listener will be fired for all entries in the Map.

The third argument in the `addEntryListener` method is `includeValue`. It is a boolean parameter, and if it is `true`, the entry event contains the entry value.

A map-wide event is fired as a result of a map-wide operation. For example, `IMap.clear()` or `IMap.evictAll()`. You should use the `MapEventListener` type to listen to these events. A `MapEvent` object is passed to the listener function.

See the following example.

```javascript
const mapEventListener = {
    mapCleared: (mapEvent) => {
        console.log('Map cleared:', mapEvent.numberOfAffectedEntries);
    }
};
await map.addEntryListener(mapEventListener);

await map.put('1', 'Muhammad Ali');
await map.put('2', 'Mike Tyson');
await map.put('3', 'Joe Louis');
await map.clear();
// Prints:
// Map cleared: 3
```

#### 8.5.2.2. Entry Listener

The Entry Listener is used by the Hazelcast `MultiMap` and `ReplicatedMap`.

You can listen to map-wide or entry-based events by using the functions in the `EntryListener` interface. Every function type in this interface is one of the `EntryEventListener` and `MapEventListener` types. To listen to these events, you need to implement the relevant `EntryEventListener` and `MapEventListener` functions in the `EntryListener` interface.

An entry-based event is fired after the operations that affect a specific entry. For example, `MultiMap.put()`, `MultiMap.remove()`. You should use the `EntryEventListener` type to listen to these events. An `EntryEvent` object is passed to the listener function.

```javascript
const entryEventListener = {
    added: (entryEvent) => {
        console.log('Entry added:', entryEvent.key, '-->', entryEvent.value);
    }
};
await mmp.addEntryListener(entryEventListener, undefined, true);

await mmp.put('1', 'My new entry');
// Prints:
// Entry Added: 1 --> My new entry
```

The second argument in the `addEntryListener` method is `key`. It stands for the key to listen for. When it is set to `undefined` (or omitted, which is the same), the listener will be fired for all entries in the MultiMap or Replicated Map.

The third argument in the `addEntryListener` method is `includeValue`. It is a boolean parameter, and if it is `true`, the entry event contains the entry value.

A map-wide event is fired as a result of a map-wide operation. For example, `MultiMap.clear()`. You should use the `MapEventListener` type to listen to these events. A `MapEvent` object is passed to the listener function.

See the following example.

```javascript
const mapEventListener = {
    mapCleared: (mapEvent) => {
        console.log('Map cleared:', mapEvent.numberOfAffectedEntries);
    }
};
await mmp.addEntryListener(mapEventListener);

await mmp.put('1', 'Muhammad Ali');
await mmp.put('1', 'Mike Tyson');
await mmp.put('1', 'Joe Louis');
await mmp.clear();
// Prints:
// Map cleared: 1
```

Note that some methods in the `EntryListener` interface are not supported by MultiMap and Replicated Map. See the following headings to see supported listener methods for each data structure.

**Entry Listener Functions Supported by MultiMap**

- `added`
- `removed`
- `mapCleared`

**Entry Listener Functions Supported by Replicated Map**

- `added`
- `removed`
- `updated`
- `evicted`
- `mapCleared`

#### 8.5.2.3. Item Listener

The Item Listener is used by the Hazelcast `Queue`, `Set` and `List`.

You can listen to item events by implementing the functions in the `ItemListener` interface including `itemAdded` and `itemRemoved`. These functions are invoked when an item is added or removed.

The following is an example of item listener object and its registration to the `Set`. It also applies to `Queue` and `List`.

```javascript
const itemListener = {
    itemAdded: (itemEvent) => {
        console.log('Item added:', itemEvent.item);
    },
    itemRemoved: (itemEvent) => {
        console.log('Item removed:', itemEvent.item);
    }
};
await set.addItemListener(itemListener, true);

await set.add('Item1');
// Prints:
// Item added: Item1
await set.remove('Item1');
// Prints:
// Item removed: Item1
```

The second argument in the `addItemListener` function is `includeValue`. It is a boolean parameter, and if it is `true`, the item event contains the item value.

#### 8.5.2.4. Message Listener

The Message Listener is used by the Hazelcast `ReliableTopic`.

You can listen to message events. To listen to these events, you need to implement the `MessageListener` function to which a `Message` object is passed.

See the following example.

```javascript
topic.addMessageListener((message) => {
    console.log('Message received:', message.messageObject);
});

topic.publish('Message1');
// Prints:
// Message received: Message1
```

## 8.6. Distributed Computing

This chapter explains how you can use Hazelcast IMDG's entry processor implementation in the Node.js client.

### 8.6.1. Using EntryProcessor

Hazelcast supports entry processing. An entry processor is a function that executes your code on a map entry in an atomic way.

An entry processor is a good option if you perform bulk processing on an `IMap`. Usually you perform a loop of keys -- executing `IMap.get(key)`, mutating the value and finally putting the entry back in the map using `IMap.put(key, value)`. If you perform this process from a client or from a member where the keys do not exist, you effectively perform two network hops for each update: the first to retrieve the data and the second to update the mutated value.

If you are doing the process described above, you should consider using entry processors. An entry processor executes a read and updates upon the member where the data resides. This eliminates the costly network hops described above.

> **NOTE: Entry processor is meant to process a single entry per call. Processing multiple entries and data structures in an entry processor is not supported as it may result in deadlocks on the server side.**

Hazelcast sends the entry processor to each cluster member and these members apply it to the map entries. Therefore, if you add more members, your processing completes faster.

#### Processing Entries

The `IMap` interface provides the following functions for entry processing:

* `executeOnKey` processes an entry mapped by a key.
* `executeOnKeys` processes entries mapped by a list of keys.
* `executeOnEntries` can process all entries in a map with a defined predicate. Predicate is optional.

In the Node.js client, an `EntryProcessor` should be `IdentifiedDataSerializable` or `Portable` because the server should be able to deserialize it to process.

The following is an example for `EntryProcessor` which is an `IdentifiedDataSerializable`.

```javascript
class IdentifiedEntryProcessor {
    constructor(value) {
        this.value = value;
        this.factoryId = 5;
        this.classId = 1;
    }

    readData(input) {
        this.value = input.readString();
    }

    writeData(output) {
        output.writeString(this.value);
    }
}
```

Now, you need to make sure that the Hazelcast member recognizes the entry processor. For this, you need to implement the Java equivalent of your entry processor and its factory, and create your own compiled class or JAR files. For adding your own compiled class or JAR files to the server's `CLASSPATH`, see the [Adding User Library to CLASSPATH section](#1212-adding-user-library-to-classpath).

The following is the Java counterpart of the entry processor in Node.js client given above:

```java
package com.example;

import com.hazelcast.map.EntryProcessor;
import com.hazelcast.nio.ObjectDataInput;
import com.hazelcast.nio.ObjectDataOutput;
import com.hazelcast.nio.serialization.IdentifiedDataSerializable;
import java.io.IOException;
import java.util.Map;

public class IdentifiedEntryProcessor
        implements EntryProcessor<String, String, String>, IdentifiedDataSerializable {

    static final int CLASS_ID = 1;
    private String value;

    public IdentifiedEntryProcessor() {
    }

    @Override
    public int getFactoryId() {
        return IdentifiedFactory.FACTORY_ID;
    }

    @Override
    public int getClassId() {
        return CLASS_ID;
    }

    @Override
    public void writeData(ObjectDataOutput out) throws IOException {
        out.writeString(value);
    }

    @Override
    public void readData(ObjectDataInput in) throws IOException {
        value = in.readString();
    }

    @Override
    public String process(Map.Entry<String, String> entry) {
        entry.setValue(value);
        return value;
    }
}
```

Notice the `process` method which contains processor's logic.

You can implement the above processor’s factory as follows:

```java
package com.example;

import com.hazelcast.nio.serialization.DataSerializableFactory;
import com.hazelcast.nio.serialization.IdentifiedDataSerializable;

public class IdentifiedFactory implements DataSerializableFactory {

    public static final int FACTORY_ID = 5;

    @Override
    public IdentifiedDataSerializable create(int typeId) {
        if (typeId == IdentifiedEntryProcessor.CLASS_ID) {
            return new IdentifiedEntryProcessor();
        }
        return null;
    }
}
```

Now you need to configure the `hazelcast.xml` to add your factory as shown below.

```xml
<hazelcast>
    <serialization>
        <data-serializable-factories>
            <data-serializable-factory factory-id="5">
                com.example.IdentifiedFactory
            </data-serializable-factory>
        </data-serializable-factories>
    </serialization>
</hazelcast>
```

In this example the code that runs on the entries is implemented in Java on the server side. The client side entry processor is used to specify which entry processor should be called. For more details about the Java implementation of the entry processor, see the [Entry Processor section](https://docs.hazelcast.com/imdg/latest/computing/entry-processor.html) in the Hazelcast IMDG Reference Manual.

After the above implementations and configuration are done and you start the server where your library is added to its `CLASSPATH`, you can use the entry processor in the `IMap` functions. See the following example.

```javascript
const map = await client.getMap('my-distributed-map');
await map.put('key', 'not-processed');

// Run the entry processor
await map.executeOnKey('key', new IdentifiedEntryProcessor('processed'));

const value = await map.get('key');
// Prints:
// processed
console.log(value);
```

## 8.7. SQL

The SQL service provided by Hazelcast Node.js client allows you to run SQL queries.

> **WARNING: The SQL feature became stable in 5.0. In order client and server to be compatible with each other, major
> versions should be the same.**

> **WARNING: A [Unisocket Client](#822-unisocket-client) should connect to a data member,
> otherwise Data Manipulation Language(DML) Statements won't work for it.**

### 8.7.1 SQL Statements

#### Data Manipulation Language(DML) Statements

- [SELECT:](https://docs.hazelcast.com/hazelcast/latest/sql/select.html) Read data from a table.
- [SINK INTO/INSERT INTO:](https://docs.hazelcast.com/hazelcast/latest/sql/sink-into.html) Ingest data into a map and/or forward data to other systems.
- [UPDATE:](https://docs.hazelcast.com/hazelcast/latest/sql/update.html) Overwrite values in map entries.
- [DELETE:](https://docs.hazelcast.com/hazelcast/latest/sql/delete.html) Delete map entries.

####  Data Definition Language(DDL) Statements

- [CREATE MAPPING:](https://docs.hazelcast.com/hazelcast/latest/sql/create-mapping.html) Map a local or remote data object to a table that Hazelcast can access.
- [SHOW MAPPINGS:](https://docs.hazelcast.com/hazelcast/latest/sql/show-mappings.html) Get the names of existing mappings.
- [DROP MAPPING](https://docs.hazelcast.com/hazelcast/latest/sql/drop-mapping.html) Remove a mapping.

#### Job Management Statements

- [CREATE JOB:](https://docs.hazelcast.com/hazelcast/latest/sql/create-job.html) Create a job that is not tied to the client session.
- [ALTER JOB:](https://docs.hazelcast.com/hazelcast/latest/sql/alter-job.html) Restart, suspend, or resume a job.
- [SHOW JOBS:](https://docs.hazelcast.com/hazelcast/latest/sql/show-jobs.html) Get the names of all running jobs.
- [DROP JOB:](https://docs.hazelcast.com/hazelcast/latest/sql/drop-job.html) Cancel a job.
- [CREATE OR REPLACE SNAPSHOT (Enterprise only):](https://docs.hazelcast.com/hazelcast/latest/sql/create-snapshot.html) Create a snapshot of a running job, so you can stop and restart it at a later date.
- [DROP SNAPSHOT (Enterprise only):](https://docs.hazelcast.com/hazelcast/latest/sql/drop-snapshot.html) Cancel a running job.

### 8.7.2. Querying IMap

> **WARNING: SQL queries against heterogenous maps is not supported and it may not work as expected.**

This SQL query returns map entries whose values are more than 1:

```javascript
const map = await client.getMap('my-distributed-map');
await map.put('key1', 1);
await map.put('key2', 2);
await map.put('key3', 3);

const result = client.getSql().execute(`SELECT __key, this FROM my-distributed-map WHERE this > 1`);

for await (const row of result) {
    console.log(row); // {__key: 'key3', this: 3} and {__key: 'key2', this: 2}
}
```

The following subsections describe how you can access Hazelcast map objects and perform queries on them.

#### Names

The SQL service exposes `IMap` objects as tables in the predefined `partitioned` schema using exact names.
This schema is in the SQL service search path so that you can access the `IMap` objects with or without the schema name.

Schema and table names are case-sensitive; you can access the `employee` map, for example, as employee or `partitioned.employee`,
but not as `Employee`:
```sql
SELECT * FROM employee
SELECT * FROM partitioned.employee
```

#### Fields

The SQL service resolves fields accessible from the SQL automatically. The service reads the first local entry pair of
the `IMap` to construct the list of fields.

Field names are case-sensitive.

##### Key and Value Objects

An `IMap` entry consists of a key and a value. These are accessible through the `__key` and `this` aliases. The following
query returns the keys and values of all entries in a map:

```sql
SELECT __key, this FROM employee
```

##### Key and Value Fields

You may also access the nested fields of a key or value. The list of exposed fields depends on the serialization format, as described below:

* For [IdentifiedDataSerializable](#41-identifieddataserializable-serialization) objects, you can use public field name or getter names.
* For [Portable](#42-portable-serialization) objects, the fields written with `PortableWriter` methods are exposed using their exact names.

> **NOTE: You cannot query JSON fields in SQL. If you want to query JSON, see [Querying with JSON Strings](#8814-querying-with-json-strings).**

For example, consider this portable class:

```javascript
class Employee {
    constructor(age, name) {
        this.age = age;
        this.name = name;
        this.factoryId = 321;
        this.classId = 1;
    }

    readPortable(reader) {
        this.age = reader.readInt('age');
        this.name = reader.readString('name');
    }

    writePortable(writer) {
        writer.writeInt('age', this.age);
        writer.writeString('name', this.name);
    }
}
```

The SQL service can access the following fields:

|  Name  |  Type     |
|--------|-----------|
|  name  |  VARCHAR  |
|  age   |  INTEGER  |

Together with the key and value objects, you may query the following fields from `IMap<number, Employee>`:

```sql
SELECT __key, this, name, age FROM employee
```

If both the key and value have fields with the same name, then the field of the value is exposed.

#### "SELECT *" Queries

You may use the `SELECT * FROM <table>` syntax to get all the table fields.

The `__key` and `this` fields are returned by the `SELECT *` queries if they do not have nested fields. For `IMap<number, Employee>`,
the following query does not return the `this` field, because the value has nested fields `name` and `age`:

```sql
-- Returns __key, name, age
SELECT * FROM employee
```

### 8.7.3. Data Types

The SQL service supports a set of SQL data types. The  table below shows SQL data types and corresponding Javascript types:

| Column Type                  | Javascript           |
|------------------------------|----------------------|
| **VARCHAR**                  | `string`             |
| **BOOLEAN**                  | `boolean`            |
| **TINYINT**                  | `number`             |
| **SMALLINT**                 | `number`             |
| **INTEGER**                  | `number`             |
| **BIGINT**                   | `long`               |
| **DECIMAL**                  | `BigDecimal`         |
| **REAL**                     | `number`             |
| **DOUBLE**                   | `number`             |
| **DATE**                     | `HzLocalDate`        |
| **TIME**                     | `HzLocalTime`        |
| **TIMESTAMP**                | `HzLocalDateTime`    |
| **TIMESTAMP_WITH_TIME_ZONE** | `HzOffsetDateTime`   |
| **OBJECT**                   | Any class            |
| **NULL**                     | `null`               |

See [API documentation](http://hazelcast.github.io/hazelcast-nodejs-client/api/current/docs/) for how you can use
`BigDecimal`, `HzLocalDate`, `HzLocalTime`, `HzLocalDateTime` and `HzOffsetDateTime` classes.

### 8.7.4. Casting

In general, you should try to send parameters having same data type with its related column. Otherwise, you need to cast parameters to suitable types.

#### How to Cast

Casting syntax: `CAST(? AS TYPE)`

Example casting:

```sql
SELECT * FROM someMap WHERE this = CAST(? AS INTEGER)
```

#### An Example of Casting

Since Node.js client uses double as default number type, to compare with an integer based column you need to use casting.

In the example below, age column is of type `INTEGER`. Since numbers are sent as `DOUBLE` by default and `DOUBLE` is not comparable with `INTEGER`, the query needs a `CAST`.
Note that, the cast can fail if the sent number cannot be converted to an integer.

```javascript
const result = client.getSql().execute('SELECT * FROM myMap WHERE age > CAST(? AS INTEGER) AND age < CAST(? AS INTEGER)',
    [13, 18]
);
```

##### Important Notes About Comparison and Casting

* In case of comparison operators (=, <, <>, ...), if one side is `?`, it's assumed to be exactly the other side's type.

* String parameters can be cast to any type. The cast operation may fail though.

### 8.7.5. Expressions

Hazelcast SQL supports logical predicates, `IS` predicates, comparison operators, mathematical functions and operators, string functions, and special functions.
Refer to [Hazelcast](https://docs.hazelcast.com/hazelcast/latest/sql/expressions.html) for all possible operations.

### 8.7.6 Source and Sink Connectors

SQL connectors are extensions that allow you to communicate with external systems such as databases, using SQL.
These connectors are configured to read and write data in the most efficient way for their respective system.

Available connectors:

- Apache Kafka: Read from and write to Kafka topics.
- File: Read from a local or remote file.
- IMap: Read from and write to an IMap.

To learn how you can use them, refer to [SQL Connectors section](https://docs.hazelcast.com/hazelcast/latest/sql/connectors.html) in Hazelcast docs.

### 8.7.7. More Information

Please refer to [Hazelcast SQL docs](https://docs.hazelcast.com/hazelcast/latest/sql/sql-statements.html) for more information.

For basic usage of SQL, see [this](code_samples/sql-basic-usage.js) code sample.

For usages of SQL with different data types, see [this](code_samples/sql-data-types.js) code sample.

## 8.8. Distributed Query

Hazelcast partitions your data and spreads it across cluster of members. You can iterate over the map entries and look for certain entries (specified by predicates) you are interested in. However, this is not very efficient because you will have to bring the entire entry set and iterate locally. Instead, Hazelcast allows you to run distributed queries on your distributed map.

### 8.8.1. How Distributed Query Works

1. The requested predicate is sent to each member in the cluster.
2. Each member looks at its own local entries and filters them according to the predicate. At this stage, key-value pairs of the entries are deserialized and then passed to the predicate.
3. The predicate requester merges all the results coming from each member into a single set.

Distributed query is highly scalable. If you add new members to the cluster, the partition count for each member is reduced and thus the time spent by each member on iterating its entries is reduced. In addition, the pool of partition threads evaluates the entries concurrently in each member, and the network traffic is also reduced since only filtered data is sent to the requester.

**Predicates Object Operators**

The `Predicates` object offered by the Node.js client includes many operators for your query requirements. Some of them are described below.

* `equal`: Checks if the result of an expression is equal to a given value.
* `notEqual`: Checks if the result of an expression is not equal to a given value.
* `instanceOf`: Checks if the result of an expression has a certain type.
* `like`: Checks if the result of an expression matches some string pattern. `%` (percentage sign) is the placeholder for many characters, `_` (underscore) is the placeholder for only one character.
* `greaterThan`: Checks if the result of an expression is greater than a certain value.
* `greaterEqual`: Checks if the result of an expression is greater than or equal to a certain value.
* `lessThan`: Checks if the result of an expression is less than a certain value.
* `lessEqual`: Checks if the result of an expression is less than or equal to a certain value.
* `between`: Checks if the result of an expression is between two values, inclusively.
* `inPredicate`: Checks if the result of an expression is an element of a certain list.
* `not`: Checks if the result of an expression is false.
* `regex`: Checks if the result of an expression matches some regular expression.

Hazelcast offers the following ways for distributed query purposes:

* Combining Predicates with AND, OR, NOT
* Distributed SQL Query

#### 8.8.1.1. Employee Map Query Example

Assume that you have an `employee` map containing the values of `Employee` objects, as shown below.

```javascript
class Employee {
    constructor(name, age, active, salary) {
        this.name = name;
        this.age = age;
        this.active = active;
        this.salary = salary;
        this.factoryId = 1;
        this.classId = 1;
    }

    readPortable(reader) {
        this.name = reader.readString();
        this.age = reader.readInt();
        this.active = reader.readBoolean();
        this.salary = reader.readDouble();
    }

    writePortable(writer) {
        writer.writeString(this.name);
        writer.writeInt(this.age);
        writer.writeBoolean(this.active);
        writer.writeDouble(this.salary);
    }
}
```

Note that `Employee` is a `Portable` object. As portable types are not deserialized on the server side for querying, you do not need to implement its Java counterpart on the server side.

For the non-portable types, you need to implement its Java counterpart and its serializable factory on the server side for server to reconstitute the objects from binary formats. In this case before starting the server, you need to compile the Employee and related factory classes with server's CLASSPATH and add them to the user-lib directory in the extracted hazelcast-<version>.zip (or tar).  See the [Adding User Library to CLASSPATH section](#1212-adding-user-library-to-classpath).

> **NOTE: Querying with `Portable` object is faster as compared to `IdentifiedDataSerializable`.**

#### 8.8.1.2. Querying by Combining Predicates with AND, OR, NOT

You can combine predicates by using the `and`, `or` and `not` operators, as shown in the below example.

```javascript
const { Predicates } = require('hazelcast-client');
// ...
const map = await client.getMap('employee');
// Define the predicate
const predicate = Predicates.and(
    Predicates.equal('active', true),
    Predicates.lessThan('age', 30)
);
// Run the query
const employees = await map.valuesWithPredicate(predicate);
// Some operations
```

In the above example code, `predicate` verifies whether the entry is active and its `age` value is less than `30`. This `predicate` is applied to the `employee` map using the `map.valuesWithPredicate(predicate)` method. This method sends the predicate to all cluster members and merges the results coming from them.

> **NOTE: Predicates can also be applied to `keySet` and `entrySet` methods of the Hazelcast IMDG's distributed map.**

#### 8.8.1.3. Querying with SQL

You can query with SQL by using the predicate returned from the `Predicates.sql` function. Its argument takes a regular SQL `where` clause, as shown in the below example.

```javascript
const { Predicates } = require('hazelcast-client');
// ...
const map = await client.getMap('employee');
// Define the predicate
const predicate = Predicates.sql('active AND age < 30');
// Run the query
const employees = await map.valuesWithPredicate(predicate);
// Some operations
```

##### Supported SQL Syntax

**AND/OR:** `<expression> AND <expression> AND <expression>…`

- `active AND age > 30`
- `active = false OR age = 45 OR name = 'Joe'`
- `active AND ( age > 20 OR salary < 60000 )`

**Equality:** `=, !=, <, ⇐, >, >=`

- `<expression> = value`
- `age <= 30`
- `name = 'Joe'`
- `salary != 50000`

**BETWEEN:** `<attribute> [NOT] BETWEEN <value1> AND <value2>`

- `age BETWEEN 20 AND 33 ( same as age >= 20 AND age ⇐ 33 )`
- `age NOT BETWEEN 30 AND 40 ( same as age < 30 OR age > 40 )`

**IN:** `<attribute> [NOT] IN (val1, val2,…)`

- `age IN ( 20, 30, 40 )`
- `age NOT IN ( 60, 70 )`
- `active AND ( salary >= 50000 OR ( age NOT BETWEEN 20 AND 30 ) )`
- `age IN ( 20, 30, 40 ) AND salary BETWEEN ( 50000, 80000 )`

**LIKE:** `<attribute> [NOT] LIKE 'expression'`

The `%` (percentage sign) is the placeholder for multiple characters, an `_` (underscore) is the placeholder for only one character.

- `name LIKE 'Jo%'` (`true` for `Joe`, `Josh`, `Joseph`, etc.)
- `name LIKE 'Jo_'` (`true` for `Joe`; `false` for `Josh`)
- `name NOT LIKE 'Jo_'` (`true` for `Josh`; `false` for `Joe`)
- `name LIKE 'J_s%'` (`true` for `Josh`, `Joseph`; `false` for `John`, `Joe`)

**ILIKE:** `<attribute> [NOT] ILIKE 'expression'`

ILIKE is similar to the LIKE predicate but in a case-insensitive manner.

- `name ILIKE 'Jo%'` (`true` for `Joe`, `joe`, `jOe`, `Josh`, `joSH`, etc.)
- `name ILIKE 'Jo_'` (`true` for `Joe` or `jOE`; `false` for `Josh`)

**REGEX:** `<attribute> [NOT] REGEX 'expression'`

- `name REGEX 'abc-.*'` (`true` for `abc-123`; `false` for `abx-123`)

##### Querying Examples with Predicates

You can use the `__key` attribute to perform a predicated search for the entry keys, as shown in the below example.

```javascript
const personMap = await client.getMap('persons');
// Generate some data
await personMap.put('Alice', 35);
await personMap.put('Andy', 37);
await personMap.put('Bob', 22);
// Run the query
const predicate = Predicates.sql('__key like A%');
const startingWithA = await personMap.valuesWithPredicate(predicate);
// Prints:
// 35
console.log(startingWithA.get(0));
```

In this example, the code creates a list with the values whose keys start with the letter `A`. Note that the returned object is an instance of `ReadOnlyLazyList` class.

You can use the `this` attribute to perform a predicated search for entry values. See the following example:

```javascript
const personMap = await client.getMap('persons');
// Generate some data
await personMap.put('Alice', 35);
await personMap.put('Andy', 37);
await personMap.put('Bob', 22);
// Run the query
const predicate = Predicates.greaterEqual('this', 27);
const olderThan27 = await return personMap.valuesWithPredicate(predicate);
// Prints:
// 35 37
console.log(olderThan27.get(0), olderThan27.get(1));
```

In this example, the code creates a list with the values greater than or equal to `27`.

#### 8.8.1.4. Querying with JSON Strings

You can query the JSON strings stored inside your Hazelcast clusters. To query a JSON string, you can use `HazelcastJsonValue` or plain JavaScript objects.

`HazelcastJsonValue` objects can be used both as keys and values in the distributed data structures. Then, it is possible to query these objects using the query methods explained in this section.

```javascript
const { HazelcastJsonValue } = require('hazelcast-client');
// ...

const personMap = await client.getMap('personsMap');
// Generate some data
const person1 = '{ "name": "John", "age": 35 }';
const person2 = '{ "name": "Jane", "age": 24 }';
const person3 = '{ "name": "Trey", "age": 17 }';
await personMap.put(1, new HazelcastJsonValue(person1));
await personMap.put(2, new HazelcastJsonValue(person2));
await personMap.put(3, new HazelcastJsonValue(person3));
// Run the query
const personsUnder21 = await personMap.valuesWithPredicate(Predicates.lessThan('age', 21));
// Prints:
// HazelcastJsonValue { jsonString: '{ "name": "Trey", "age": 17 }' }
for (const person of personsUnder21) {
    console.log(person);
});
```

When running the queries, Hazelcast treats values extracted from the JSON documents as Java types so they can be compared with the query attribute. JSON specification defines five primitive types to be used in the JSON documents: `number`, `string`, `true`, `false` and `null`. The `string`, `true`/`false` and `null` types are treated as `String`, `boolean` and `null`, respectively. `Number` values treated as `long`s if they can be represented by a `long`. Otherwise, `number`s are treated as `double`s.

`HazelcastJsonValue` is a lightweight wrapper around your JSON strings. It is used merely as a way to indicate that the contained string should be treated as a valid JSON value. Hazelcast does not check the validity of JSON strings put into to maps. Putting an invalid JSON string in a map is permissible. However, in that case whether such an entry is going to be returned or not from a query is not defined.

It is possible to query nested attributes and arrays in JSON documents. The query syntax is the same as querying other Hazelcast objects using the `Predicate`s.

```javascript
const departments = [
    {
        departmentId: 1,
        room: 'alpha',
        people: [
            {
                name: 'Peter',
                age: 26,
                salary: 50000

            },
            {
                name: 'Jonah',
                age: 50,
                salary: 140000
            }
        ]
    },
    {
        departmentId: 2,
        room: 'beta',
        people: [
            {
                name: 'Terry',
                age: 44,
                salary: 100000
            }
        ]
    }
];
const departmentsMap = await client.getMap('departmentsMap');
await departmentsMap.putAll(departments.map((department, index) => {
    return [index, department];
}));
// Run the query which finds all the departments that have a person named "Peter"
const departmentsWithPeter =
    await departmentsMap.valuesWithPredicate(Predicates.equal('people[any].name', 'Peter'))
// Prints the first department
for (const department of departmentsWithPeter) {
    console.log(department);
});
```

##### Querying with HazelcastJsonValue Objects

If the Hazelcast Node.js client cannot find a suitable serializer for an object, it uses JSON Serialization.

This means that, you can run queries over your JavaScript objects if they are serialized as JSON strings. However, when the results of your query are ready, they are parsed from JSON strings and returned to you as JavaScript objects.

For the purposes of your application, you may want to get rid of the parsing and just work with the raw JSON strings using `HazelcastJsonValue` objects. Then, you can configure your client to do so as described in the [JSON Serialization](#45-json-serialization) section.

```javascript
const client = await Client.newHazelcastClient({
    serialization: {
        jsonStringDeserializationPolicy: 'NO_DESERIALIZATION'
    }
});

const moviesMap = await client.getMap('moviesMap');
// Generate some data
const movies = [
    [1, new HazelcastJsonValue('{ "name": "The Dark Knight", "rating": 9.1 }')],
    [2, new HazelcastJsonValue('{ "name": "Inception", "rating": 8.8 }')],
    [3, new HazelcastJsonValue('{ "name": "The Prestige", "rating": 8.5 }')]
];
await moviesMap.putAll(movies);
// Run the query
const highRatedMovies =
    await moviesMap.valuesWithPredicate(Predicates.greaterEqual('rating', 8.8));
// Prints the first two movies
for (const movie of highRatedMovies) {
    console.log(movie.toString());
});
```

##### Metadata Creation for JSON Querying

Hazelcast stores a metadata object per JSON serialized object stored. This metadata object is created every time a JSON serialized object is put into an `IMap`. Metadata is later used to speed up the query operations. Metadata creation is on by default. Depending on your application’s needs, you may want to turn off the metadata creation to decrease the put latency and increase the throughput.

You can configure this using `metadata-policy` element for the map configuration on the member side as follows:

```xml
<hazelcast>
    ...
    <map name="map-a">
        <!--
        valid values for metadata-policy are:
          - OFF
          - CREATE_ON_UPDATE (default)
        -->
        <metadata-policy>OFF</metadata-policy>
    </map>
    ...
</hazelcast>
```

#### 8.8.1.5. Filtering with Paging Predicates

The Node.js client provides paging for defined predicates. With its `PagingPredicate` object, you can get a list of keys, values or entries page by page by filtering them with predicates and giving the size of the pages. Also, you can sort the entries by specifying comparators.

```javascript
const map = await client.getMap('students');
// Define the paging predicate
const greaterEqual = Predicates.greaterEqual('age', 18);
const pagingPredicate = Predicates.paging(greaterEqual, 5);
// Set page to retrieve the third page
pagingPredicate.setPage(3);
// Retrieve third page
let values = await map.valuesWithPredicate(pagingPredicate);
// Some operations
// ...
// Set up next page
pagingPredicate.nextPage();
// Retrieve the next page
values = await map.valuesWithPredicate(pagingPredicate);
// Some operations
```

If you want to sort the result before paging, you need to specify a comparator object that implements the `Comparator` interface. Also, this comparator object should be one of `IdentifiedDataSerializable` or `Portable`. After implementing this object in Node.js, you need to implement the Java counterpart of it and its factory. The Java counterpart of the comparator should implement `java.util.Comparator`. Note that the `compare` function of `Comparator` on the Java side is the counterpart of the `sort` function of `Comparator` on the Node.js side. When you implement the `Comparator` and its factory, you can add them to the `CLASSPATH` of the server side. See the [Adding User Library to CLASSPATH section](#1212-adding-user-library-to-classpath).

Also, you can access a specific page more easily with the help of the `setPage` function. This way, if you make a query for the 100th page, for example, it will get all 100 pages at once instead of reaching the 100th page one by one using the `nextPage` function.

### 8.8.2. Fast-Aggregations

Fast-Aggregations feature provides some aggregate functions, such as `sum`, `average`, `max`, and `min`, on top of Hazelcast `IMap` entries. Their performance is high since they run in parallel for each partition and are highly optimized for speed and low memory consumption.

The `Aggregators` object provides a wide variety of built-in aggregators. The full list is presented below:

- `count`
- `doubleAvg`
- `doubleSum`
- `numberAvg`
- `fixedPointSum`
- `floatingPointSum`
- `max`
- `min`
- `integerAvg`
- `integerSum`
- `longAvg`
- `longSum`

You can use these aggregators with the `IMap.aggregate()` and `IMap.aggregateWithPredicate()` functions.

See the following example.

```javascript
const { Aggregators } = require('hazelcast-client');
// ...
const map = await client.getMap('employees');
// Generate some data
await map.putAll([
    ['John Stiles', 23],
    ['Judy Doe', 29],
    ['Richard Miles', 38],
]);

// Run count aggregate
let count = await map.aggregate(Aggregators.count());
// Prints:
// There are 3 employees
console.log('There are ' + count + ' employees');
// Run count aggregate with a predicate
count = await map.aggregateWithPredicate(Aggregators.count(), Predicates.greaterThan('this', 25));
// Prints:
// There are 2 employees older than 25
console.log('There are ' + count + ' employees older than 25');

// Run avg aggregate
const avgAge = await map.aggregate(Aggregators.numberAvg());
// Prints:
// Average age is 30
console.log('Average age is ' + avgAge);
```

## 8.9. Performance

### 8.9.1. Partition Aware

Partition Aware ensures that the related entries exist on the same member. If the related data is on the same member, operations can be executed without the cost of extra network calls and extra wire data, and this improves the performance. This feature is provided by using the same partition keys for related data.

Hazelcast has a standard way of finding out which member owns/manages each key object. The following operations are routed to the same member, since all of them are operating based on the same key `'key1'`.

```javascript
const mapA = await client.getMap('mapA');
const mapB = await client.getMap('mapB');
const mapC = await client.getMap('mapC');

// Since map names are different, operation is manipulating
// different entries, but the operation takes place on the
// same member since the keys ('key1') are the same
await mapA.put('key1', 'value1');
const res = await mapB.get('key1');
await mapC.remove('key1');
// Lock operation is executed on the same member
// of the cluster since the key ("key1") is same
await mapA.lock('key1');
```

When the keys are the same, entries are stored on the same member. However, we sometimes want to have the related entries, such as a customer and their order entries, stored on the same member even if they are stored in different maps and have different keys.

Let's consider a `customers` map with `customerId` as the key and an `orders` map with `orderId` as the key. Since `customerId` and `orderId` are different keys, a customer and their orders may fall into different members in your cluster. So how can we have them stored on the same member? We create an affinity between the customer and orders. If we make them part of the same partition then these entries will be co-located. We achieve this by making `OrderKey`s `PartitionAware`.

```javascript
class OrderKey {
    constructor(orderId, customerId) {
        this.orderId = orderId;
        this.customerId = customerId;
        // PartitionAware interface properties:
        this.partitionKey = customerId;
    }
}
```

Notice that `OrderKey` implements `PartitionAware` interface and that `partitionKey` property contains the `customerId`. This will make sure that the `Customer` entry and its `Order`s will be stored on the same member.

```javascript
const customersMap = await client.getMap('customers');
const ordersMap = await client.getMap('orders');
// Create the customer entry with customer id = 1
await customersMap.put(1, customer);
// Now create orders for this customer
await ordersMap.putAll([
    [new OrderKey(21, 1), order],
    [new OrderKey(22, 1), order],
    [new OrderKey(23, 1), order]
]);
```

For more details, see the [PartitionAware section](https://docs.hazelcast.com/imdg/latest/performance/data-affinity.html#partitionaware) in the Hazelcast IMDG Reference Manual.

### 8.9.2. Near Cache

Map entries in Hazelcast are partitioned across the cluster members. Hazelcast clients do not have local data at all. Suppose you read the key `k` a number of times from a Hazelcast client and `k` is owned by a member in your cluster. Then each `map.get('k')` will be a remote operation, which creates a lot of network trips. If you have a map that is mostly read, then you should consider creating a local Near Cache, so that reads are sped up and less network traffic is created.

These benefits do not come for free, please consider the following trade-offs:

- If invalidation is enabled and entries are updated frequently, then invalidations will be costly.

- Near Cache breaks the strong consistency guarantees; you might be reading stale data.

- Clients with a Near Cache will have to hold the extra cached data, which increases memory consumption.

Near Cache is highly recommended for maps that are mostly read.

#### 8.9.2.1. Configuring Near Cache

The following snippets show how a Near Cache is configured in the Node.js client, presenting all available values for each element:

```javascript
const cfg = {
    nearCaches: {
        'mostlyReadMap': {
            invalidateOnChange: false,
            maxIdleSeconds: 2,
            inMemoryFormat: 'OBJECT',
            timeToLiveSeconds: 3,
            evictionPolicy: "lru",
            evictionMaxSize: 3000,
            evictionSamplingCount: 4,
            evictionSamplingPoolSize: 8
        }
    }
};
```

Following are the descriptions of all configuration elements:

- key (`mostlyReadMap` in the above example): Name of your Map for which the Near Cache will be enabled. Hazelcast client supports wildcard configuration for Near Caches. Using an asterisk (`*`) character in the name, different instances of maps can be configured by a single configuration.

- `inMemoryFormat`: Specifies in which format data will be stored in your Near Cache. Note that a map’s in-memory format can be different from that of its Near Cache. Available values are as follows:
  - `BINARY`: Data will be stored in serialized binary format (default value).
  - `OBJECT`: Data will be stored in deserialized form.

- `invalidateOnChange`: Specifies whether the cached entries are evicted when the entries are updated or removed in members. Its default value is `true`.

- `timeToLiveSeconds`: Maximum number of seconds for each entry to stay in the Near Cache. Entries that are older than this period are automatically evicted from the Near Cache. Regardless of the eviction policy used, `timeToLiveSeconds` still applies. Any integer between `0` and `Number.MAX_SAFE_INTEGER`. Its default value is `0` (means infinite).

- `maxIdleSeconds`: Maximum number of seconds each entry can stay in the Near Cache as untouched (not read). Entries that are not read more than this period are removed from the Near Cache. Any integer between `0` and `Number.MAX_SAFE_INTEGER`. Its default value is `0` (means infinite).

- `evictionPolicy`: Eviction policy configuration. Available values are as follows:
  - `LRU`: Least Recently Used (default value).
  - `LFU`: Least Frequently Used.
  - `RANDOM`: A random item is evicted.
  - `NONE`: No items are evicted and the `evictionMaxSize` property is ignored. You still can combine it with `timeToLiveSeconds` and `maxIdleSeconds` to evict items from the Near Cache.

- `evictionMaxSize`: Maximum number of entries kept in the memory before eviction kicks in. Its default value is `Number.MAX_SAFE_INTEGER`.
- `evictionSamplingCount`: Number of random entries that are evaluated to see if some of them are already expired. If there are expired entries, those are removed and there is no need for eviction. Its default value is `8`.
- `evictionSamplingPoolSize`: Size of the pool for eviction candidates. The pool is kept sorted according to eviction policy. The entry with the highest score is evicted. Its default value is `16`.

> **NOTE: When you use `default` as the Near Cache configuration key, it has a special meaning. Hazelcast client will use that configuration as the default one for all Maps, unless there is a specific configuration for a Map.**

#### 8.9.2.2. Near Cache Example for Map

The following is an example configuration for a Near Cache defined in the `mostlyReadMap` map. According to this configuration, the entries are stored as `OBJECT`'s in this Near Cache and eviction starts when the count of entries reaches `5000`; entries are evicted based on the `LRU` (Least Recently Used) policy. In addition, when an entry is updated or removed on the member side, it is eventually evicted on the client side.

```javascript
const cfg = {
    nearCaches: {
        'mostlyReadMap': {
            inMemoryFormat: 'OBJECT',
            invalidateOnChange: true,
            evictionPolicy: 'LRU',
            evictionMaxSize: 5000,
        }
    }
};
```

#### 8.9.2.3. Near Cache Eviction

In the scope of Near Cache, eviction means evicting (clearing) the entries selected according to the given `evictionPolicy` when the specified `evictionMaxSize` has been reached.

The `evictionMaxSize` defines the entry count when the Near Cache is full and determines whether the eviction should be triggered.

Once the eviction is triggered the configured `evictionPolicy` determines which, if any, entries must be evicted.

#### 8.9.2.4. Near Cache Expiration

Expiration means the eviction of expired records. A record is expired:

- if it is not touched (accessed/read) for `maxIdleSeconds`

- `timeToLiveSeconds` passed since it is put to Near Cache

The actual expiration is performed when a record is accessed: it is checked if the record is expired or not. If it is expired, it is evicted and `undefined` is returned as the value to the caller.

#### 8.9.2.5. Near Cache Invalidation

Invalidation is the process of removing an entry from the Near Cache when its value is updated or it is removed from the original map (to prevent stale reads). See the [Near Cache Invalidation section](https://docs.hazelcast.com/imdg/latest/performance/near-cache.html#near-cache-invalidation) in the Hazelcast IMDG Reference Manual.

#### 8.9.2.6. Near Cache Eventual Consistency

Near Caches are invalidated by invalidation events. Invalidation events can be lost due to the fire-and-forget fashion of eventing system. If an event is lost, reads from Near Cache can indefinitely be stale.

To solve this problem, Hazelcast provides eventually consistent behavior for Map Near Caches by detecting invalidation losses. After detection of an invalidation loss, stale data will be made unreachable and Near Cache’s `get` calls to that data will be directed to underlying Map to fetch the fresh data.

You can configure eventual consistency with entries of the `properties` config option as described below:

- `hazelcast.invalidation.max.tolerated.miss.count`: Default value is `10`. If missed invalidation count is bigger than this value, relevant cached data will be made unreachable.

- `hazelcast.invalidation.reconciliation.interval.seconds`: Default value is `60` seconds. This is a periodic task that scans cluster members periodically to compare generated invalidation events with the received ones from the client Near Cache.

### 8.9.3. Automated Pipelining

Hazelcast Node.js client performs automated pipelining of operations. It means that the library pushes all operations into an internal queue and tries to send them in batches. This reduces the count of executed `Socket.write()` calls and significantly improves throughtput for read operations.

You can configure automated operation pipelining with entries of the `properties` config option as described below:

- `hazelcast.client.autopipelining.enabled`: Default value is `true`. Turns automated pipelining feature on/off. If your application does only writes operations, like `IMap.set()`, you can try disabling automated pipelining to get a slightly better throughtput.

- `hazelcast.client.autopipelining.threshold.bytes`: Default value is `65536` bytes (64 KB). This is the coalescing threshold for the internal queue used by automated pipelining. Once the total size of operation payloads taken from the queue reaches this value during batch preparation, these operations are written to the socket. Notice that automated pipelining will still send operations if their total size is smaller than the threshold and there are no more operations in the internal queue.

## 8.10. Monitoring and Logging

### 8.10.1. Enabling Client Statistics

You can monitor your clients using Hazelcast Management Center.

As a prerequisite, you need to enable the client statistics in the Node.js client. There are two entries supported by the `properties` config option which are related to client statistics:

- `hazelcast.client.statistics.enabled`: If set to `true`, it enables collecting the client statistics and sending them to the cluster. When it is `true` you can monitor the clients that are connected to your Hazelcast cluster, using Hazelcast Management Center. Its default value is `false`.

- `hazelcast.client.statistics.period.seconds`: Period in seconds the client statistics are collected and sent to the cluster. Its default value is `3`.

You can enable client statistics and set a non-default period in seconds as follows:

```javascript
const cfg = {
    properties: {
        'hazelcast.client.statistics.enabled': true,
        'hazelcast.client.statistics.period.seconds': 4
    }
};
```

After enabling the client statistics, you can monitor your clients using Hazelcast Management Center. Please refer to the [Monitoring Clients section](https://docs.hazelcast.com/management-center/latest/monitor-imdg/monitor-clients.html) in the Hazelcast Management Center Reference Manual for more information on the client statistics.

> **NOTE: Statistics sent by Hazelcast Node.js client 4.0 are compatible with Management Center 4.0. Management Center 4.2020.08 and newer versions will be supported in version 4.1 of the client.**

### 8.10.2. Logging Configuration

 By default, Hazelcast Node.js client uses a default logger which logs to the `stdout` with the `INFO` log level. You can change the log level using the `hazelcast.logging.level` entry of the `properties` config option.

Below is an example of the logging configuration with the `OFF` log level which disables logging.

```javascript
const cfg = {
    properties: {
        'hazelcast.logging.level': 'OFF'
    }
};
```

 You can also implement a custom logger depending on your needs. Your custom logger must have `log`, `error`, `warn`, `info`, `debug`, `trace` methods. After implementing it, you can use your custom logger using the `customLogger` config option.

See the following for a custom logger example.

```javascript
const winstonAdapter = {
    logger: winston.createLogger({
        level: 'info',
        transports: [
            new winston.transports.Console({
                format: winston.format.simple()
            })
        ]
    }),
    levels: [
        'error',
        'warn',
        'info',
        'debug',
        'silly'
    ],
    log: function (level, objectName, message, furtherInfo) {
        this.logger.log(this.levels[level], objectName + ': ' + message, furtherInfo);
    },
    error: function (objectName, message, furtherInfo) {
        this.log(LogLevel.ERROR, objectName, message, furtherInfo);
    },
    warn: function (objectName, message, furtherInfo) {
        this.log(LogLevel.WARN, objectName, message, furtherInfo);
    },
    info: function (objectName, message, furtherInfo) {
        this.log(LogLevel.INFO, objectName, message, furtherInfo);
    },
    debug: function (objectName, message, furtherInfo) {
        this.log(LogLevel.DEBUG, objectName, message, furtherInfo);
    },
    trace: function (objectName, message, furtherInfo) {
        this.log(LogLevel.TRACE, objectName, message, furtherInfo);
    }
};
const cfg = {
    customLogger: winstonAdapter
};
```

## 8.11. Defining Client Labels

Through the client labels, you can assign special roles for your clients and use these roles to perform some actions
specific to those client connections.

You can also group your clients using the client labels. These client groups can be blacklisted in Hazelcast Management Center so that they can be prevented from connecting to a cluster. See the [related section](https://docs.hazelcast.com/management-center/latest/monitor-imdg/monitor-clients.html#changing-cluster-client-filtering) in the Hazelcast Management Center Reference Manual for more information on this topic.

You can define the client labels using the `clientLabels` config option. See the below example.

```javascript
const cfg = {
    clientLabels: [
        'role admin',
        'region foo'
    ]
};
```

## 8.12. Defining Instance Name

Each client has a name associated with it. By default, it is set to `hz.client_${CLIENT_ID}`. Here `CLIENT_ID` starts from `0` and it is incremented by `1` for each new client. This id is incremented and set by the client, so it may not be unique between different clients used by different applications.

You can set the client name using the `instanceName` configuration element.

```javascript
const cfg = {
    instanceName: 'blue_client_0'
};
```

## 8.13. Configuring Load Balancer

Load Balancer configuration allows you to specify which cluster member to send next operation when queried.

If it is a [smart client](#821-smart-client), only the operations that are not key-based are routed to the member
that is returned by the `LoadBalancer`. If it is not a smart client, `LoadBalancer` is ignored.

By default, client uses round robin Load Balancer which picks each cluster member in turn. Also, the client provides random Load Balancer which picks the next member randomly as the name suggests. You can use one of them by specifying `ROUND_ROBIN` or `RANDOM` value on the `loadBalancer.type` config option.

The following are example configurations.

```javascript
const cfg = {
  loadBalancer: {
    type: 'RANDOM'
  }
};
```

You can also provide a custom Load Balancer implementation to use different load balancing policies. To do so, you should implement the `LoadBalancer` interface or extend the `AbstractLoadBalancer` class for that purpose and provide the Load Balancer object into the `loadBalancer.customLoadBalancer` config option.

# 9. Securing Client Connection

This chapter describes the security features of Hazelcast Node.js client. These include using TLS/SSL for connections between members and between clients and members, mutual authentication and credentials. These security features require **Hazelcast IMDG Enterprise** edition.

## 9.1. TLS/SSL

One of the offers of Hazelcast is the TLS/SSL protocol which you can use to establish an encrypted communication across your cluster with key stores and trust stores.

* A Java `keyStore` is a file that includes a private key and a public certificate. The equivalent of a key store is the combination of `key` and `cert` files at the Node.js client side.
* A Java `trustStore` is a file that includes a list of certificates trusted by your application which is named as  "certificate authority". The equivalent of a trust store is a `ca` file at the Node.js client side.

You should set `keyStore` and `trustStore` before starting the members. See the next section on setting `keyStore` and `trustStore` on the server side.

### 9.1.1. TLS/SSL for Hazelcast Members

Hazelcast allows you to encrypt socket level communication between Hazelcast members and between Hazelcast clients and members, for end to end encryption. To use it, see the [TLS/SSL for Hazelcast Members section](https://docs.hazelcast.com/imdg/latest/security/tls-ssl.html#tlsssl-for-hazelcast-members).

### 9.1.2. TLS/SSL for Hazelcast Node.js Clients

TLS/SSL for the Hazelcast Node.js client can be configured using the `SSLConfig` class. In order to turn it on, `enabled` property of the `network.ssl` config option should be set to `true`:

```javascript
const cfg = {
    network: {
        ssl: {
            enabled: true
        }
    }
};
```

SSL config takes various SSL options defined in the [Node.js TLS Documentation](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback). You can set your custom options object to `network.ssl.sslOptions`.

### 9.1.3. Mutual Authentication

As explained above, Hazelcast members have key stores used to identify themselves (to other members) and Hazelcast clients have trust stores used to define which members they can trust.

Using mutual authentication, the clients also have their key stores and members have their trust stores so that the members can know which clients they can trust.

To enable mutual authentication, firstly, you need to set the following property on the server side in the `hazelcast.xml` file:

```xml
<network>
    <ssl enabled="true">
        <properties>
            <property name="javax.net.ssl.mutualAuthentication">REQUIRED</property>
        </properties>
    </ssl>
</network>
```

You can see the details of setting mutual authentication on the server side in the [Mutual Authentication section](https://docs.hazelcast.com/imdg/latest/security/tls-ssl.html#mutual-authentication) of the Hazelcast IMDG Reference Manual.

At the Node.js client side, you need to supply an SSL `options` object to pass to [`tls.connect`](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback) of Node.js.

There are two ways to provide this object to the client:

1. Using the built-in `BasicSSLOptionsFactory` bundled with the client.
2. Writing an `SSLOptionsFactory`.

Below subsections describe each way.

**Using the Built-in `BasicSSLOptionsFactory`**

Hazelcast Node.js client includes a utility factory class that creates the necessary `options` object out of the supplied
properties. All you need to do is to specify your factory as `BasicSSLOptionsFactory` and provide the following options:

- `caPath`
- `keyPath`
- `certPath`
- `servername`
- `rejectUnauthorized`
- `ciphers`

See [`tls.connect`](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback) of Node.js for the descriptions of each option.

> **NOTE: `caPath`, `keyPath` and `certPath` define the file path to the respective file that stores such information.**

```javascript
const cfg = {
    network: {
        ssl: {
            enabled: true,
            sslOptionsFactoryProperties: {
                caPath: 'ca.pem',
                keyPath: 'key.pem',
                certPath: 'cert.pem',
                rejectUnauthorized: false
            }
        }
    }
};
```

If these options are not enough for your application, you may write your own options factory and instruct the client
to get the options from it, as explained below.

**Writing an `SSLOptionsFactory`**

In order to use the full range of options provided to [`tls.connect`](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback) of Node.js, you may write your own factory object.

An example configuration is shown below.

```javascript
const readFile = util.promisify(fs.readFile);

class SSLOptionsFactory {
    async init(properties) {
        const promises = [];
        this.keepOrder = properties.userDefinedProperty1;
        const self = this;

        promises.push(readFile(properties.caPath).then((data) => {
            self.ca = data;
        }));
        promises.push(readFile(properties.keyPath).then((data) => {
            self.key = data;
        }));
        promises.push(readFile(properties.certPath).then((data) => {
            self.cert = data;
        }));

        return Promise.all(promises);
    }

    getSSLOptions() {
        const sslOpts = {
            ca: this.ca,
            key: this.key,
            cert: this.cert,
            servername: 'foo.bar.com',
            rejectUnauthorized: true
        };
        if (this.keepOrder) {
            sslOpts.honorCipherOrder = true;
        }
        return sslOpts;
    }
}

const cfg = {
    network: {
        ssl: {
            enabled: true,
            sslOptionsFactory: new SSLOptionsFactory(),
            sslOptionsFactoryProperties: {
                caPath: 'ca.pem',
                keyPath: 'key.pem',
                certPath: 'cert.pem',
                keepOrder: true
            }
        }
    }
};
```

The client calls the `init()` method with the `properties` configuration option. Then the client calls the `getSSLOptions()` method of `SSLOptionsFactory` to create the `options` object.

## 9.2. Credentials

One of the key elements in Hazelcast security is the `Credentials` object, which can be used to carry all security attributes of the Hazelcast Node.js client to Hazelcast members. Then, Hazelcast members can authenticate the clients and perform access control checks on the client operations using this `Credentials` object.

With Hazelcast's extensible, `JAAS` based security features you can do much more than just authentication.
See the [JAAS code sample](code_samples/jaas_sample) to learn how to perform access control checks on the client operations based on user groups.

> **NOTE: It is almost always a bad idea to write the credentials to wire in a clear-text format. Therefore, using TLS/SSL encryption is highly recommended while using the custom credentials as described in [TLS/SSL section](#91-tlsssl).**

Also, see the [Security section](https://docs.hazelcast.com/imdg/latest/security/security.html) of Hazelcast IMDG Reference Manual for more information.


# 10. Development and Testing

Hazelcast Node.js client is developed using TypeScript. If you want to help with bug fixes, develop new features or tweak the implementation to your application's needs, you can follow the steps in this section.

## 10.1. Building and Using Client From Sources

Follow the below steps to build and install Hazelcast Node.js client from its source:

1. Clone the GitHub repository (https://github.com/hazelcast/hazelcast-nodejs-client.git).
2. Run `npm install` to automatically download and install all the required modules under `node_modules` directory. Note that,
there may be vulnerabilities reported due to `devDependencies`. In that case, run `npm audit fix` to automatically install any compatible updates to vulnerable dependencies.
3. Run `npm run compile` to compile TypeScript files to JavaScript.

At this point you have all the runnable code (`.js`) and type declarations (`.d.ts`) in the `lib` directory. You may create a link to this module so that your local applications can depend on your local copy of Hazelcast Node.js client. In order to create a link, run the below command:

```
npm link
```

This will create a global link to this module in your machine. Whenever you need to depend on this module from another
local project, run the below command:

```
npm link hazelcast-client
```

If you are planning to contribute, please run the style checker, as shown below, and fix the reported issues before sending a pull request:

```
npm run lint
```

## 10.2. Testing

In order to test Hazelcast Node.js client locally, you will need the following:

* Java 8 or newer
* Maven

Following command starts the tests:

```
npm test
```

Test script automatically downloads `hazelcast-remote-controller` and Hazelcast IMDG. The script uses Maven to download those.

# 11. Getting Help

You can use the following channels for your questions and development/usage issues:

* This repository by opening an issue.
* [Slack](https://slack.hazelcast.com)
* [Google Groups](https://groups.google.com/forum/#!forum/hazelcast)
* [Stack Overflow](https://stackoverflow.com/questions/tagged/hazelcast)

# 12. Contributing

Besides your development contributions as explained in the [Development and Testing chapter](#10-development-and-testing) above, you can always open a pull request on this repository for your other requests such as documentation changes.

# 13. License

[Apache 2 License](https://github.com/hazelcast/hazelcast-nodejs-client/blob/master/LICENSE).

# 14. Copyright

Copyright (c) 2008-2021, Hazelcast, Inc. All Rights Reserved.

Visit [www.hazelcast.com](http://www.hazelcast.com) for more information.
