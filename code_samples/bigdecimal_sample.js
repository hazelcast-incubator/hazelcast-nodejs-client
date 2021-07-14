/*
 * Copyright (c) 2008-2021, Hazelcast, Inc. All Rights Reserved.
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
'use strict';

// This sample code demonstrates big decimal usage.

const { Client, Big } = require('..');

class CustomNumber {
    constructor(decimal) {
        this.decimal = decimal;
        this.factoryId = 1;
        this.classId = 1;
    }

    readPortable(reader) {
        // decimal is supported for portable serialization
        this.decimal = reader.readDecimal('decimal');
    }

    writePortable(writer) {
        writer.writeDecimal('decimal', this.decimal);
    }
}

function portableFactory(classId) {
    if (classId === 1) {
        return new CustomNumber();
    }
    return null;
}

(async () => {
    try {
        const cfg = {
            serialization: {
                portableFactories: {
                    1: portableFactory
                }
            }
        };

        const client = await Client.newHazelcastClient(cfg);
        const map = await client.getMap('decimalMap');

        // You can use big decimals for any operation
        // Let's add some big decimals using big decimal constructor `Big`:

        await map.set('1', Big('1.12345678910111213'));
        await map.set('2', Big('2.12345678910111213'));
        await map.set('3', Big('3.12345678910111213'));
        await map.set('4', Big('4.12345678910111213'));

        // You can also use other data structures

        const queue = await client.getQueue('decimalQueue');

        await queue.add(Big('1231.1231231e-13'));

        // BigDecimal has toString() method but no arithmetic methods:
        console.log((await queue.take()).toString()); // 0.00000000012311231231

        console.log(await map.get('1')); // BigDecimal object: { unscaledValue: 112345678910111213n, scale: 17 }

        // You can run an SQL query:

        const result = client.getSql().execute('SELECT * FROM decimalMap WHERE this > ?', [Big('2.22222222222222222')]);

        // The following for loop prints:
        // key: 4, value: 4.12345678910111213
        // key: 3, value: 3.12345678910111213

        for await (const row of result) {
            console.log(`key: ${row['__key']}, value: ${row['this']}`);
        }

    } catch (err) {
        console.error('Error occurred:', err);
    }
})();
