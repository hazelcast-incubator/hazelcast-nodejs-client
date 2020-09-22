#!/bin/bash

HAZELCAST_TEST_VERSION="4.0.2"
HAZELCAST_VERSION="4.0.2"

CLASSPATH="../../hazelcast-${HAZELCAST_VERSION}.jar:../../hazelcast-${HAZELCAST_TEST_VERSION}-tests.jar"
CMD_CONFIGS="-Dhazelcast.multicast.group=224.206.1.1 -Djava.net.preferIPv4Stack=true"
java ${CMD_CONFIGS} -cp ${CLASSPATH} \
    # uncomment for Java 9+ compatibility
    # --add-modules java.se --add-exports java.base/jdk.internal.ref=ALL-UNNAMED --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.nio=ALL-UNNAMED --add-opens java.base/sun.nio.ch=ALL-UNNAMED --add-opens java.management/sun.management=ALL-UNNAMED --add-opens jdk.management/com.sun.management.internal=ALL-UNNAMED \
    com.hazelcast.core.server.HazelcastMemberStarter \
    > hazelcast-${HAZELCAST_VERSION}-out.log 2>hazelcast-${HAZELCAST_VERSION}-err.log &
SERVER_PID=$!

sleep 8

node map_soak_test.js localhost:5701 > client-out.log 2>client-err.log
echo "Client shutdown"
kill -9 $SERVER_PID
