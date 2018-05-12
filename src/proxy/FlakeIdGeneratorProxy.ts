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

import {BaseProxy} from './BaseProxy';
import {FlakeIdGenerator} from './FlakeIdGenerator';
import * as Promise from 'bluebird';
import * as Long from 'long';
import HazelcastClient from '../HazelcastClient';
import {FlakeIdGeneratorNewIdBatchCodec} from '../codec/FlakeIdGeneratorNewIdBatchCodec';
import {FlakeIdGeneratorConfig} from '../config/FlakeIdGeneratorConfig';
import {AutoBatcher, Batch} from './flakeid/AutoBatcher';

export class FlakeIdGeneratorProxy extends BaseProxy implements FlakeIdGenerator {

    private autoBatcher: AutoBatcher;
    private config: FlakeIdGeneratorConfig;

    constructor(client: HazelcastClient, serviceName: string, name: string) {
        super(client, serviceName, name);
        this.config = client.getConfig().getFlakeIdGeneratorConfig(name);
        this.autoBatcher = new AutoBatcher(() => {
            return this.encodeInvokeOnRandomTarget(FlakeIdGeneratorNewIdBatchCodec, this.config.prefetchCount).then((re: any) => {
                return new Batch(this.config.prefetchValidityMillis, re.base, re.increment, re.batchSize);
            });
        });
    }

    newId(): Promise<Long> {
        return this.autoBatcher.nextId();
    }
}
