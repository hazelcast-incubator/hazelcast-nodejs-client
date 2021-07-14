'use strict';
const fs = require('fs');
const os = require('os');
const net = require('net');
const {spawnSync, spawn} = require('child_process');

const {
    HAZELCAST_RC_VERSION,
    HAZELCAST_TEST_VERSION,
    HAZELCAST_ENTERPRISE_VERSION,
    HAZELCAST_ENTERPRISE_TEST_VERSION,
    HAZELCAST_VERSION,
    downloadRC
} = require('./download-rc.js');

const ON_WINDOWS = os.platform() === 'win32';
const HAZELCAST_ENTERPRISE_KEY = process.env.HAZELCAST_ENTERPRISE_KEY ? process.env.HAZELCAST_ENTERPRISE_KEY : '';
const PATH_SEPARATOR = ON_WINDOWS ? ';' : ':';

let testCommand;
let testType;
let rcProcess;
let testProcess;
let runTests = true;
let CLASSPATH = `hazelcast-remote-controller-${HAZELCAST_RC_VERSION}.jar${PATH_SEPARATOR}`
              + `hazelcast-${HAZELCAST_TEST_VERSION}-tests.jar${PATH_SEPARATOR}`
              + `hazelcast-sql-${HAZELCAST_VERSION}.jar${PATH_SEPARATOR}`
              + 'test/javaclasses';

if (HAZELCAST_ENTERPRISE_KEY) {
    CLASSPATH = `hazelcast-enterprise-${HAZELCAST_ENTERPRISE_VERSION}.jar${PATH_SEPARATOR}`
              + `hazelcast-enterprise-${HAZELCAST_ENTERPRISE_TEST_VERSION}-tests.jar${PATH_SEPARATOR}`
              + CLASSPATH;
} else {
    CLASSPATH = `hazelcast-${HAZELCAST_VERSION}.jar${PATH_SEPARATOR}${CLASSPATH}`;
}

const isAddressReachable = (host, port, timeoutMs) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(timeoutMs);
        const onError = () => {
            socket.destroy();
            resolve(false);
        };
        socket.once('error', onError);
        socket.once('timeout', onError);
        socket.connect(port, host, () => {
            socket.end();
            resolve(true);
        });
    });
};

const startRC = async () => {
    console.log('Starting Hazelcast Remote Controller ... oss ...');
    if (ON_WINDOWS) {
        const outFD = fs.openSync('rc_stdout.txt', 'w');
        const errFD = fs.openSync('rc_stderr.txt', 'w');
        rcProcess = spawn('java', [
            `-Dhazelcast.enterprise.license.key=${HAZELCAST_ENTERPRISE_KEY}`,
            '-cp',
            CLASSPATH,
            'com.hazelcast.remotecontroller.Main',
            '--use-simple-server'
        ], {
            stdio: [
                'ignore',
                outFD,
                errFD
            ]
        });
        rcProcess.on('close', () => {
            fs.closeSync(outFD);
            fs.closeSync(errFD);
        });
    } else {
        const outFD = fs.openSync('rc_stdout.log', 'w');
        const errFD = fs.openSync('rc_stderr.log', 'w');
        rcProcess = spawn('java', [
            `-Dhazelcast.enterprise.license.key=${HAZELCAST_ENTERPRISE_KEY}`,
            '-cp',
            CLASSPATH,
            'com.hazelcast.remotecontroller.Main',
            '--use-simple-server'
        ], {
            stdio: [
                'ignore',
                outFD,
                errFD
            ]
        });
        rcProcess.on('close', () => {
            fs.closeSync(outFD);
            fs.closeSync(errFD);
        });
    }

    console.log('Please wait for Hazelcast Remote Controller to start ...');

    const retryCount = 10;

    for (let i = 0; i < retryCount; i++) {
        console.log('Trying to connect to Hazelcast Remote Controller (127.0.0.1:9701)...');
        const addressReachable = await isAddressReachable('127.0.0.1', 9701, 5000);
        if (addressReachable) {
            return;
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    throw `Could not reach to Hazelcast Remote Controller (127.0.0.1:9701) after trying ${retryCount} times.`;
};

const shutdownProcesses = () => {
    console.log('Stopping remote controller and test processes...');
    shutdownRC();
    if (ON_WINDOWS) {
        spawnSync('taskkill', ['/pid', testProcess.pid, '/f', '/t']); // simple sigkill not enough on windows
    } else {
        if (testProcess && testProcess.exitCode === null) {
            testProcess.kill('SIGKILL');
        }
    }
};

const shutdownRC = () => {
    if (ON_WINDOWS) {
        spawnSync('taskkill', ['/pid', rcProcess.pid, '/f', '/t']);
    } else {
        if (rcProcess && rcProcess.exitCode === null) {
            rcProcess.kill('SIGKILL');
        }
    }
};

if (process.argv.length === 3 || process.argv.length === 4) {
    if (process.argv[2] === 'unit') {
        if (process.argv.length === 4) {
            testCommand = `node node_modules/mocha/bin/mocha --recursive -g "${process.argv[3]}" "test/unit/**/*.js"`;
        } else {
            testCommand = 'node node_modules/mocha/bin/mocha "test/unit/**/*.js"';
        }
        testType = 'unit';
    } else if (process.argv[2] === 'integration') {
        if (process.argv.length === 4) {
            testCommand = 'node node_modules/mocha/bin/mocha --recursive -g ' +
                          `"${process.argv[3]}" "test/integration/**/*.js"`;
        } else {
            testCommand = 'node node_modules/mocha/bin/mocha "test/integration/**/*.js"';
        }
        testType = 'integration';
    } else if (process.argv[2] === 'all') {
        if (process.argv.length === 4) {
            testCommand = `node node_modules/mocha/bin/mocha --recursive -g "${process.argv[3]}" "test/**/*.js"`;
        } else {
            testCommand = 'node node_modules/mocha/bin/mocha "test/**/*.js"';
        }
        testType = 'all';
    } else if (process.argv[2] === 'startrc') {
        runTests = false;
    } else if (process.argv[2] === 'coverage') {
        testCommand = 'node node_modules/nyc/bin/nyc node_modules/mocha/bin/_mocha "test/**/*.js"';
        testType = 'coverage';
    } else {
        throw 'Operation type can be one of "unit", "integration", "all", "startrc"';
    }
} else {
    throw 'Usage: node <script-file> <operation-type> [test regex].\n'
        + 'Operation type can be one of "unit", "integration", "all", "startrc", "coverage".\n'
        + '[test regex] only used in "unit", "all" and "integration" operations.';
}

// generate lib folder to be able to test if it does not exist
if (!fs.existsSync('./lib')) {
    console.log('./lib folder does not exist, so compiling...');
    spawnSync('npm run compile', [], {
        stdio: 'inherit',
        shell: true
    });
}

// If running unit test, no need to start rc.
if (testType === 'unit') {
    console.log(`Running unit tests... Test command: ${testCommand}`);
    spawnSync(testCommand, [], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
    });
    process.exit(0);
}

// For other tests, download rc files if needed.
try {
    downloadRC();
} catch (err) {
    console.log('An error occurred downloading remote controller:');
    throw err;
}

process.on('SIGINT', shutdownProcesses);
process.on('SIGTERM', shutdownProcesses);
process.on('SIGHUP', shutdownProcesses);

startRC().then(() => {
    console.log('Hazelcast Remote Controller is started!');
    if (runTests) {
        console.log(`Running tests... Test type: ${testType}, Test command: ${testCommand}`);
        testProcess = spawn(testCommand, [], {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true
        });
        testProcess.on('exit', shutdownRC);
    }
}).catch(err => {
    console.log('Could not start Hazelcast Remote Controller due to an error:');
    throw err;
});
