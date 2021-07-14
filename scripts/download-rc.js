'use strict';
const HZ_VERSION = '5.0-SNAPSHOT';
const HZ_TEST_VERSION = '5.0-SNAPSHOT';
const HAZELCAST_TEST_VERSION = HZ_TEST_VERSION;
const HAZELCAST_VERSION = HZ_VERSION;
const HAZELCAST_ENTERPRISE_VERSION = HZ_VERSION;
const HAZELCAST_ENTERPRISE_TEST_VERSION = HZ_VERSION;
const HAZELCAST_RC_VERSION = '0.8-SNAPSHOT';
const SNAPSHOT_REPO = 'https://oss.sonatype.org/content/repositories/snapshots';
const RELEASE_REPO = 'http://repo1.maven.apache.org/maven2';
const ENTERPRISE_RELEASE_REPO = 'https://repository.hazelcast.com/release/';
const ENTERPRISE_SNAPSHOT_REPO = 'https://repository.hazelcast.com/snapshot/';

const downloadRC = () => {
    const fs = require('fs');
    const os = require('os');
    const {spawnSync} = require('child_process');

    const ON_WINDOWS = os.platform() === 'win32';
    const HAZELCAST_ENTERPRISE_KEY = process.env.HAZELCAST_ENTERPRISE_KEY ? process.env.HAZELCAST_ENTERPRISE_KEY : '';

    let REPO;
    let ENTERPRISE_REPO;
    let TEST_REPO;
    let ENTERPRISE_TEST_REPO;

    if (HZ_VERSION.endsWith('-SNAPSHOT')) {
        REPO = SNAPSHOT_REPO;
        ENTERPRISE_REPO = ENTERPRISE_SNAPSHOT_REPO;
    } else {
        REPO = RELEASE_REPO;
        ENTERPRISE_REPO = ENTERPRISE_RELEASE_REPO;
    }

    if (HZ_TEST_VERSION.endsWith('-SNAPSHOT')) {
        TEST_REPO = SNAPSHOT_REPO;
        ENTERPRISE_TEST_REPO = ENTERPRISE_SNAPSHOT_REPO;
    } else {
        TEST_REPO = RELEASE_REPO;
        ENTERPRISE_TEST_REPO = ENTERPRISE_RELEASE_REPO;
    }

    if (fs.existsSync(`hazelcast-remote-controller-${HAZELCAST_RC_VERSION}.jar`)) {
        console.log('remote controller already exists, not downloading from maven.');
    } else {
        console.log('Downloading: remote-controller jar com.hazelcast:hazelcast-remote-controller:'
            + HAZELCAST_RC_VERSION);
        const subprocess = spawnSync('mvn',
            [
                '-q',
                'dependency:get',
                '-Dtransitive=false',
                `-DrepoUrl=${SNAPSHOT_REPO}`,
                `-Dartifact=com.hazelcast:hazelcast-remote-controller:${HAZELCAST_RC_VERSION}`,
                `-Ddest=hazelcast-remote-controller-${HAZELCAST_RC_VERSION}.jar`
            ], {
                stdio: 'inherit',
                shell: ON_WINDOWS
            });
        if (subprocess.status !== 0) {
            const subprocessTrace = subprocess.error ? subprocess.error.stack : '';
            throw 'Failed download remote-controller jar '
                + `com.hazelcast:hazelcast-remote-controller:${HAZELCAST_RC_VERSION} ${subprocessTrace}`;
        }
    }

    if (fs.existsSync(`hazelcast-${HAZELCAST_TEST_VERSION}-tests.jar`)) {
        console.log('hazelcast-test.jar already exists, not downloading from maven.');
    } else {
        console.log(`Downloading: hazelcast test jar com.hazelcast:hazelcast:${HAZELCAST_TEST_VERSION}:jar:tests`);
        const subprocess = spawnSync('mvn',
            [
                '-q',
                'dependency:get',
                '-Dtransitive=false',
                `-DrepoUrl=${TEST_REPO}`,
                `-Dartifact=com.hazelcast:hazelcast:${HAZELCAST_TEST_VERSION}:jar:tests`,
                `-Ddest=hazelcast-${HAZELCAST_TEST_VERSION}-tests.jar`
            ], {
                stdio: 'inherit',
                shell: ON_WINDOWS
            });
        if (subprocess.status !== 0) {
            const subprocessTrace = subprocess.error ? subprocess.error.stack : '';
            throw 'Failed download hazelcast test jar com.hazelcast:hazelcast:'
                + `${HAZELCAST_TEST_VERSION}:jar:tests ${subprocessTrace}`;
        }
    }

    if (fs.existsSync(`hazelcast-sql-${HAZELCAST_VERSION}.jar`)) {
        console.log('hazelcast-sql.jar already exists, not downloading from maven.');
    } else {
        console.log(`Downloading: hazelcast sql jar com.hazelcast:hazelcast-sql:${HAZELCAST_VERSION}`);
        const subprocess = spawnSync('mvn', [
            '-q',
            'dependency:get',
            '-Dtransitive=false',
            `-DrepoUrl=${REPO}`,
            `-Dartifact=com.hazelcast:hazelcast-sql:${HAZELCAST_VERSION}`,
            `-Ddest=hazelcast-sql-${HAZELCAST_VERSION}.jar`
        ], {
            stdio: 'inherit',
            shell: ON_WINDOWS
        });
        if (subprocess.status !== 0) {
            const subprocessTrace = subprocess.error ? subprocess.error.stack : '';
            throw 'Failed download hazelcast sql jar'
                + `com.hazelcast:hazelcast-sql:${HAZELCAST_VERSION} ${subprocessTrace}`;
        }
    }

    if (HAZELCAST_ENTERPRISE_KEY) {
        if (fs.existsSync(`hazelcast-enterprise-${HAZELCAST_ENTERPRISE_VERSION}.jar`)) {
            console.log('hazelcast-enterprise.jar already exists, not downloading from maven.');
        } else {
            console.log('Downloading: hazelcast enterprise jar '
                + `com.hazelcast:hazelcast-enterprise:${HAZELCAST_ENTERPRISE_VERSION}`);
            const subprocess = spawnSync('mvn', [
                '-q',
                'dependency:get',
                '-Dtransitive=false',
                `-DrepoUrl=${ENTERPRISE_REPO}`,
                `-Dartifact=com.hazelcast:hazelcast-enterprise:${HAZELCAST_ENTERPRISE_VERSION}`,
                `-Ddest=hazelcast-enterprise-${HAZELCAST_ENTERPRISE_VERSION}.jar`
            ], {
                stdio: 'inherit',
                shell: ON_WINDOWS
            });
            if (subprocess.status !== 0) {
                const subprocessTrace = subprocess.error ? subprocess.error.stack : '';
                throw 'Failed download hazelcast enterprise jar '
                    + `com.hazelcast:hazelcast-enterprise:${HAZELCAST_ENTERPRISE_VERSION} ${subprocessTrace}`;
            }
        }

        if (fs.existsSync(`hazelcast-enterprise-${HAZELCAST_TEST_VERSION}-tests.jar`)) {
            console.log('hazelcast-enterprise-tests.jar already exists, not downloading from maven.');
        } else {
            console.log('Downloading: hazelcast enterprise test jar '
                + `com.hazelcast:hazelcast-enterprise:${HAZELCAST_TEST_VERSION}:jar:tests`);
            const subprocess = spawnSync('mvn', [
                '-q',
                'org.apache.maven.plugins:maven-dependency-plugin:2.8:get',
                '-Dtransitive=false',
                `-DrepoUrl=${ENTERPRISE_TEST_REPO}`,
                `-Dartifact=com.hazelcast:hazelcast-enterprise:${HAZELCAST_TEST_VERSION}:jar:tests`,
                `-Ddest=hazelcast-enterprise-${HAZELCAST_TEST_VERSION}-tests.jar`
            ], {
                stdio: 'inherit',
                shell: ON_WINDOWS
            });
            if (subprocess.status !== 0) {
                const subprocessTrace = subprocess.error ? subprocess.error.stack : '';
                throw 'Failed to download hazelcast enterprise test jar '
                    + `com.hazelcast:hazelcast-enterprise:${HAZELCAST_TEST_VERSION}:jar:tests ${subprocessTrace}`;
            }
        }
        console.log('Starting Remote Controller ... enterprise ...');
    } else {
        if (fs.existsSync(`hazelcast-${HAZELCAST_VERSION}.jar`)) {
            console.log('hazelcast.jar already exists, not downloading from maven.');
        } else {
            console.log(`Downloading: hazelcast jar com.hazelcast:hazelcast:${HAZELCAST_VERSION}`);
            const subprocess = spawnSync('mvn', [
                '-q',
                'dependency:get',
                '-Dtransitive=false',
                `-DrepoUrl=${REPO}`,
                `-Dartifact=com.hazelcast:hazelcast:${HAZELCAST_VERSION}`,
                `-Ddest=hazelcast-${HAZELCAST_VERSION}.jar`
            ], {
                stdio: 'inherit',
                shell: ON_WINDOWS
            });
            if (subprocess.status !== 0) {
                const subprocessTrace = subprocess.error ? subprocess.error.stack : '';
                throw `Failed download hazelcast jar com.hazelcast:hazelcast:${HAZELCAST_VERSION} ${subprocessTrace}`;
            }
        }
    }
};

module.exports = {
    HAZELCAST_VERSION: HAZELCAST_VERSION,
    HAZELCAST_TEST_VERSION: HAZELCAST_TEST_VERSION,
    HAZELCAST_ENTERPRISE_VERSION: HAZELCAST_ENTERPRISE_VERSION,
    HAZELCAST_ENTERPRISE_TEST_VERSION: HAZELCAST_ENTERPRISE_TEST_VERSION,
    HAZELCAST_RC_VERSION: HAZELCAST_RC_VERSION,
    downloadRC: downloadRC
};
