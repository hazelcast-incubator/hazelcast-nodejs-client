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
/** @ignore *//** */

import * as assert from 'assert';
import * as util from 'util';
import {InvalidConfigurationError} from '../core';
import {
    assertPositiveNumber,
    assertNonNegativeNumber,
    tryGetArray,
    tryGetNumber
} from '../util/Util';
import {ConfigBuilder} from './ConfigBuilder';
import {ClientConfigImpl} from './Config';
import {ClientFailoverConfig, ClientFailoverConfigImpl} from './FailoverConfig';

/**
 * Responsible for user-defined config validation. Builds the effective config with necessary defaults.
 * @internal
 */
export class FailoverConfigBuilder {

    private readonly originalConfig: ClientFailoverConfig;
    private effectiveConfig: ClientFailoverConfigImpl = new ClientFailoverConfigImpl();

    constructor(failoverConfig?: ClientFailoverConfig) {
        this.originalConfig = failoverConfig || {};
    }

    build(): ClientFailoverConfigImpl {
        try {
            this.handleConfig(this.originalConfig);
            this.validate();
            return this.effectiveConfig;
        } catch (err) {
            throw new InvalidConfigurationError('Config validation error: ' + err.message, err);
        }
    }

    private handleConfig(jsonObject: any): void {
        for (const key in jsonObject) {
            const value = jsonObject[key];
            if (key === 'tryCount') {
                const tryCount = tryGetNumber(value);
                assertNonNegativeNumber(tryCount, 'tryCount must be a non-negative integer.');
                this.effectiveConfig.tryCount = tryCount;
            } else if (key === 'clientConfigs') {
                const configs = tryGetArray(value);
                for (const rawConfig of configs) {
                    const builder = new ConfigBuilder(rawConfig);
                    const config = builder.build();
                    this.effectiveConfig.clientConfigs.push(config);
                }
            } else {
                throw new RangeError(`Unexpected config key '${key}' is passed to the Hazelcast Failover Client`);
            }
        }
    }

    private validate(): void {
        const clientConfigs = this.effectiveConfig.clientConfigs;
        assertPositiveNumber(clientConfigs.length, 'FailoverConfig must have at least one client config.');
        const main = clientConfigs[0];
        for (const alternative of clientConfigs.slice(1)) {
            this.validateAlternativeConfigs(main, alternative);
        }
    }

    private validateAlternativeConfigs(main: ClientConfigImpl,
                                       alternative: ClientConfigImpl): void {
        const mainCopy = this.copyWithoutAllowedFields(main);
        const alternativeCopy = this.copyWithoutAllowedFields(alternative);

        assert(
            util.isDeepStrictEqual(mainCopy, alternativeCopy),
            'Alternative config with cluster name ' + alternative.clusterName
                + ' must have the same config as the initial config with cluster name '
                + main.clusterName + ' except for the following options: '
                + 'clusterName, customCredentials, network.clusterMembers, '
                + 'network.ssl, network.hazelcastCloud'
        );
    }

    private copyWithoutAllowedFields(config: ClientConfigImpl): Record<string, unknown> {
        // make a shallow copy of the config
        const copy = {
            ...config
        };
        // now make a copy of config.network, as we're going to mutate it
        copy.network = {
            ...copy.network
        };
        // now get rid of allowed fields
        // note: make sure to update assertion message in validateAlternativeConfigs
        //       when this list changes
        delete copy.clusterName;
        delete copy.customCredentials;
        delete copy.network.clusterMembers;
        delete copy.network.ssl;
        delete copy.network.hazelcastCloud;
        return copy;
    }
}
