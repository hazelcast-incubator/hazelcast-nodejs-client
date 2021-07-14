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

/**
 * Constructs and returns timezone for ISO string from offsetSeconds
 * @internal
 *
 * @param offsetSeconds Offset in seconds, can be negative or positive. must be in valid timezone range [-64800, 64800]. If out of
 * this range, the limit values are assumed.
 * @throws RangeError if offset seconds is not number
 * @return Timezone string, can be 'Z', +hh:mm or -hh:mm
 */
export function getTimezoneOffsetFromSeconds(offsetSeconds: number): string {
    if (!Number.isInteger(offsetSeconds)) {
        throw new RangeError('Expected integer');
    }

    if (offsetSeconds > 64800 || offsetSeconds < -64800) {
        throw new RangeError('Offset seconds should be in the range [-64800,64800]');
    }

    const offsetMinutes = Math.floor(Math.abs(offsetSeconds) / 60);

    let timezoneString = '';
    if (offsetSeconds === 0) {
        timezoneString = 'Z';
    } else {
        if (offsetSeconds < 0) {
            timezoneString += '-';
        } else {
            timezoneString += '+';
        }

        const hours = Math.floor(offsetMinutes / 60);
        timezoneString += leftZeroPadInteger(hours, 2);

        timezoneString += ':';

        const minutes = offsetMinutes % 60;
        timezoneString += leftZeroPadInteger(minutes, 2);
    }
    return timezoneString;
}

/**
 * Parses timezone string and returns offset in seconds
 * @internal
 *
 * @param timezoneString string, can be 'Z', +hh:mm or -hh:mm
 * @throws RangeError If timezoneString is invalid
 * @return Timezone Offset in seconds, can be negative or positive. must be in valid timezone range [-64800, 64800]
 */
export function getOffsetSecondsFromTimezoneString(timezoneString: string): number {
    if (typeof timezoneString !== 'string') {
        throw new RangeError('String expected');
    }
    let positive;
    if (timezoneString.toUpperCase() === 'Z') {
        return 0;
    } else if (timezoneString[0] === '-') {
        positive = false;
    } else if (timezoneString[0] === '+') {
        positive = true;
    } else {
        throw new RangeError('Invalid format');
    }

    const substring = timezoneString.substring(1);
    const split = substring.split(':');
    if (split.length !== 2) {
        throw new RangeError('Invalid format');
    }
    const hourAsNumber = +split[0]
    const minuteAsNumber = +split[1];

    if (isNaN(hourAsNumber) || isNaN(minuteAsNumber)) {
        throw new RangeError('Invalid format');
    }

    const offsetSeconds = hourAsNumber * 3600 + minuteAsNumber * 60;

    if (offsetSeconds > 64800) {
        throw new RangeError('Invalid offset');
    }
    return positive ? offsetSeconds : -offsetSeconds;
}

/**
 * @internal
 * Give this function integer and it will zero pad to the given length.
 *
 * @param value
 * @param length total length after padding
 * @returns Zero padded string
 */
export function leftZeroPadInteger(value: number, length: number): string {
    return value.toString().padStart(length, '0');
}
