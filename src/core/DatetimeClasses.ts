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

import {
    getOffsetSecondsFromTimezoneString,
    getTimezoneOffsetFromSeconds
} from '../util/DatetimeUtil';

/**
 * ### Local time object
 * * Represents time in day without timezone.
 */
export class HzLocalTime {
    private static readonly timeStringRegex = /(\d\d):(\d\d):(\d\d)(\.\d+)?/;

    private constructor(readonly hour: number, readonly minute: number, readonly second: number, readonly nano: number) {
        if (!Number.isInteger(hour) || !Number.isInteger(minute) || !Number.isInteger(second) || !Number.isInteger(nano)) {
            throw new RangeError('Illegal arguments given to HzLocalTime. All arguments must be integers.');
        }
        if (!(hour >= 0 && hour <= 23)) {
            throw new RangeError('Hour-of-day must be between 0-23');
        }
        if (!(minute >= 0 && minute <= 59)) {
            throw new RangeError('Minute-of-hour must be between 0-59');
        }
        if (!(second >= 0 && second <= 59)) {
            throw new RangeError('Second-of-minute must be between 0-59');
        }
        if (!(nano >= 0 && nano <= 999_999_999)) {
            throw new RangeError('Nano-of-second must be between 0-999_999_999');
        }
    }

    /**
     * @internal
     * Static constructor that is used by constructor function
     */
    static _new(hour: number, minute: number, second: number, nano: number) {
        return new HzLocalTime(hour, minute, second, nano);
    }

    /**
     * Constructs a new {@link HzLocalTime} object from timeString.
     * @param timeString A string in the form HH:mm:ss.SSS, where the last part represents nanoseconds and optional.
     * At most 9 digits allowed for nanosecond value. If more than 9 digits are given, the first 9 of them are used.
     * @throws RangeError if invalid timeString is given
     */
    static fromString(timeString: string): HzLocalTime {
        if (typeof timeString !== 'string') {
            throw new RangeError('String expected.');
        }
        const match = timeString.match(HzLocalTime.timeStringRegex);
        if (!match) {
            throw new RangeError('Illegal time string. Expected a string in HH:mm:ss.SSS format');
        }
        const hours = +match[1];
        const minutes = +match[2];
        const seconds = +match[3];

        let nano = 0;
        if (match[4] !== undefined) { // nano second included
            let nanoStr = match[4].substring(1, 10); // does not include first dot
            nanoStr = nanoStr.padEnd(9, '0');
            nano = +nanoStr;
        }

        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || isNaN(nano)) {
            throw new RangeError('Illegal time string. Expected a string in HH:mm:ss.SSS format');
        }
        return new HzLocalTime(hours, minutes, seconds, nano);
    }

    /**
     * Returns the string representation of this local time.
     *
     * @returns A string in the form HH:mm:ss.SSS (9 digits, nano second precision). The constructed string is
     * zero-padded from left. If nanosecond is 0, it is not included in the constructed string.
     */
    toString(): string {
        const hour = this.hour.toString().padStart(2, '0');
        const minute = this.minute.toString().padStart(2, '0');
        const second = this.second.toString().padStart(2, '0');

        let hourMinuteSecondString = `${hour}:${minute}:${second}`;
        // Do not add .000000000 if nano is 0
        if (this.nano !== 0) {
            hourMinuteSecondString += `.${this.nano.toString().padStart(9, '0')}`;
        }
        return hourMinuteSecondString;
    }
}

/**
 * Months for HzLocalDate
 * @internal
 */
enum Months {
    January = 1,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December
}

/**
 * ### Local date object
 * * Represents date in year without timezone.
 */
export class HzLocalDate {
    private static readonly dateRegex = /(-?\d+)-(\d\d)-(\d\d)/;

    private constructor(readonly year: number, readonly month: number, readonly date: number) {
        if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(date)) {
            throw new RangeError('Illegal arguments given to HzLocalTime. All arguments must be integers.');
        }
        if (!(month >= 1 && month <= 12)) {
            throw new RangeError('Month must be between 1-12');
        }
        if (!(year >= -999_999_999 && year <= 999_999_999)) {
            throw new RangeError('Year must be between -999_999_999 - 999_999_999');
        }

        if (date < 1) {
            throw new RangeError('Invalid date. Date cannot be less than 1');
        }

        if (date > 28) {
            let maxDate = 31;
            switch (month) {
                case 2:
                    maxDate = HzLocalDate.isLeapYear(this.year) ? 29 : 28;
                    break;
                case 4:
                    maxDate = 30;
                    break;
                case 6:
                    maxDate = 30;
                    break;
                case 9:
                    maxDate = 30;
                    break;
                case 11:
                    maxDate = 30;
                    break;
            }

            if (date > maxDate) {
                if (date == 29) {
                    throw new RangeError(`Invalid date. February 29 as ${this.year} is not a leap year`);
                }
                throw new RangeError(`Invalid date. ${Months[this.month]} ${this.date}`);
            }
        }
    }

    /**
     * @internal
     * Static constructor that is used by constructor function
     */
    static _new(year: number, month: number, date: number) {
        return new HzLocalDate(year, month, date);
    }

    /**
     * @internal
     * Implementation is taken from java IsoChronology.isLeapYear()
     * @param year Year value
     */
    private static isLeapYear(year: number): boolean {
        return (year & 3) == 0 && (year % 100 != 0 || year % 400 == 0);
    }

    /**
     * Constructs a {@link HzLocalDate} object from string.
     * @throws RangeError if string is not passed, or string format is wrong
     * @param dateString String in the form of yyyy-mm-dd
     */
    static fromString(dateString: string): HzLocalDate {
        if (typeof dateString !== 'string') {
            throw new RangeError('String expected.');
        }
        const match = dateString.match(HzLocalDate.dateRegex);
        if (!match) {
            throw new RangeError('Invalid format. Expected a string in yyyy-mm-dd format');
        }

        const yearNumber = +match[1];
        const monthNumber = +match[2];
        const dateNumber = +match[3];

        if (isNaN(yearNumber) || isNaN(monthNumber) || isNaN(dateNumber)) {
            throw new RangeError('Invalid format. Expected a string in yyyy-mm-dd format');
        }
        return new HzLocalDate(yearNumber, monthNumber, dateNumber);
    }

    /**
     * Returns the string representation of this local date.
     * @returns A string in the form yyyy:mm:dd. Values are zero padded from left
     */
    toString(): string {
        const sign = this.year < 0 ? '-' : '';
        const paddedYear = Math.abs(this.year).toString().padStart(4, '0');
        const month = this.month.toString().padStart(2, '0');
        const date = this.date.toString().padStart(2, '0');
        return `${sign}${paddedYear}-${month}-${date}`;
    }
}

/**
 * ### Local datetime object
 * * Represents date and time without timezone.
 */
export class HzLocalDateTime {
    private static tRegex = /[Tt]/;

    private constructor(readonly hzLocalDate: HzLocalDate, readonly hzLocalTime: HzLocalTime) {
        if (!(hzLocalDate instanceof HzLocalDate)) {
            throw new RangeError('Invalid local date.');
        }
        if (!(hzLocalTime instanceof HzLocalTime)) {
            throw new RangeError('Invalid local time.');
        }
    }

    /**
     * @internal
     * Static constructor that is used by constructor function
     */
    static _new(hzLocalDate: HzLocalDate, hzLocalTime: HzLocalTime) {
        return new HzLocalDateTime(hzLocalDate, hzLocalTime);
    }

    /**
     * Constructs HzLocalDateTime from ISO 8601 string.
     * @param isoString Must not include timezone information. The string format is yyyy-mm-ss(T|t)HH:mm:ss.SSS. The last SSS
     * part represents nanoseconds and can be omitted.
     * @throws RangeError if ISO string is invalid or any of the values in ISO string is invalid
     */
    static fromString(isoString: string): HzLocalDateTime {
        if (typeof isoString !== 'string') {
            throw new RangeError('String expected.');
        }
        const split = isoString.split(HzLocalDateTime.tRegex);
        if (split.length !== 2) {
            throw new RangeError('Invalid format. Expected a string in the form yyyy-mm-ss(T|t)HH:mm:ss.SSS');
        }
        return new HzLocalDateTime(HzLocalDate.fromString(split[0]), HzLocalTime.fromString(split[1]));
    }

    /**
     * Returns this local datetime as Date.
     */
    asDate(): Date {
        return new Date(
            Date.UTC(
                this.hzLocalDate.year,
                this.hzLocalDate.month - 1, // month start with 0 in Date
                this.hzLocalDate.date,
                this.hzLocalTime.hour,
                this.hzLocalTime.minute,
                this.hzLocalTime.second,
                Math.floor(this.hzLocalTime.nano / 1_000_000)
            )
        );
    }

    /**
     * Constructs a new instance from Date.
     * @param date Must be a valid date. So `date.getTime()` should be not NaN
     */
    static fromDate(date: Date): HzLocalDateTime {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new RangeError('Invalid date.');
        }
        return HzLocalDateTime._new(
            HzLocalDate._new(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
            ),
            HzLocalTime._new(
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds(),
                date.getUTCMilliseconds() * 1_000_000
            )
        );
    }

    /**
     * Returns the string representation of this local datetime.
     * @returns A string in the form yyyy:mm:ddTHH:mm:ss.SSS. Values are zero padded from left. If nano second value
     * is zero, second decimal is not include in the returned string
     */
    toString(): string {
        return `${this.hzLocalDate.toString()}T${this.hzLocalTime.toString()}`;
    }
}

/**
 * ### Offset datetime object
 * * Represents date and time with timezone.
 * * Timezone is specified with offset from UTC in seconds. This offset can be negative or positive.
 * * This class internally stores a {@link HzLocalDateTime} and offset number.
 */
export class HzOffsetDateTime {

    private static readonly timezoneRegex = /([Zz]|[+-]\d\d:\d\d)/;

    private constructor(readonly hzLocalDateTime: HzLocalDateTime, readonly offsetSeconds: number) {
    }

    /**
     * @internal
     * Static constructor that is used by constructor function
     */
    static _new(hzLocalDateTime: HzLocalDateTime, offsetSeconds: number) {
        return new HzOffsetDateTime(hzLocalDateTime, offsetSeconds);
    }

    /**
     * Constructs a new instance from Date and offset seconds.
     * @param date Must be a valid date. So `date.getTime()` should be not NaN
     * @param offsetSeconds Must be between -64800-64800 (-+18:00)
     */
    static fromDate(date: Date, offsetSeconds: number): HzOffsetDateTime {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new RangeError('Invalid date.');
        }
        if (!Number.isInteger(offsetSeconds) || !(offsetSeconds >= -64800 && offsetSeconds <= 64800)) {
            throw new RangeError('Offset seconds can be between -64800(-18:00) and 64800(+18:00).');
        }
        return new HzOffsetDateTime(HzLocalDateTime.fromDate(date), offsetSeconds);
    }

    /**
     * Constructs a new instance from ISO 8601 string.
     * @param isoString ISO 8601 string with timezone. If timezone is omitted, UTC is assumed
     */
    static fromString(isoString: string): HzOffsetDateTime {
        if (typeof isoString !== 'string') {
            throw new RangeError('String expected');
        }
        const indexOfFirstMatch = isoString.search(HzOffsetDateTime.timezoneRegex);
        const split = isoString.split(isoString[indexOfFirstMatch]);
        let offsetSeconds;
        if (split.length !== 2) {
            throw new RangeError('Invalid format');
        }
        if (indexOfFirstMatch === -1) {
            offsetSeconds = 0;
        } else {
            offsetSeconds = getOffsetSecondsFromTimezoneString(isoString[indexOfFirstMatch] + split[1]);
        }
        return new HzOffsetDateTime(HzLocalDateTime.fromString(split[0]), offsetSeconds);
    }

    /**
     * Returns this offset datetime as Date. Note that the timezone information is not stored in Date objects and you
     * effectively get a timestamp.(an instance in time without timezone)
     */
    asDate(): Date {
        return new Date(this.hzLocalDateTime.asDate().getTime() - this.offsetSeconds * 1000);
    }

    /**
     * Returns ISO 8601 string with timezone of this instance.
     * @returns A string in the format yyyy-mm-ddTHH-mm-ss.SSS(Z | (+|-)HH:mm)
     * Timezone is denoted either with `Z` or timezone string like +-HH:mm
     */
    toString(): string {
        const timezoneOffsetString = getTimezoneOffsetFromSeconds(this.offsetSeconds);
        return this.hzLocalDateTime.toString() + timezoneOffsetString;
    }
}


interface HzLocalDateInterface {
    (year: number, month: number, date: number): HzLocalDate;

    new(year: number, month: number, date: number): HzLocalDate;
}

function _LocalDate(year: number, month: number, date: number): HzLocalDate {
    return HzLocalDate._new(year, month, date);
}

/**
 * Constructor function, can be invoked with or without new keyword.
 *
 * @param year Must be between -999999999-999999999
 * @param month Must be between 1-12
 * @param date Must be between 1-31 depending on year and month
 * @throws RangeError if any of the arguments are invalid
 */
export const LocalDate: HzLocalDateInterface = <HzLocalDateInterface>_LocalDate;

interface HzLocalTimeInterface {
    (hour: number, minute: number, second: number, nano: number): HzLocalTime;

    new(hour: number, minute: number, second: number, nano: number): HzLocalTime;
}

function _LocalTime(hour: number, minute: number, second: number, nano: number): HzLocalTime {
    return HzLocalTime._new(hour, minute, second, nano);
}

/**
 * Constructor function, can be invoked with or without new keyword.
 *
 * @param hour The hour-of-day to represent, from 0 to 23
 * @param minute The minute-of-hour to represent, from 0 to 59
 * @param second The second-of-minute to represent, from 0 to 59
 * @param nano The nano-of-second to represent, from 0 to 999,999,999
 * @throws RangeError if any of the arguments are invalid
 */
export const LocalTime: HzLocalTimeInterface = <HzLocalTimeInterface>_LocalTime;

interface HzLocalDateTimeInterface {
    (hzLocalDate: HzLocalDate, hzLocalTime: HzLocalTime): HzLocalDateTime;

    new(hzLocalDate: HzLocalDate, hzLocalTime: HzLocalTime): HzLocalDateTime;
}

function _LocalDateTime(hzLocalDate: HzLocalDate, hzLocalTime: HzLocalTime): HzLocalDateTime {
    return HzLocalDateTime._new(hzLocalDate, hzLocalTime);
}

/**
 * Constructor function, can be invoked with or without new keyword.
 *
 * @param hzLocalDate a {@link HzLocalDate} object
 * @param hzLocalTime a {@link HzLocalTime} object
 * @throws RangeError if any of the arguments are invalid
 */
export const LocalDateTime: HzLocalDateTimeInterface = <HzLocalDateTimeInterface>_LocalDateTime;

interface HzOffsetDateTimeInterface {
    (hzLocalDateTime: HzLocalDateTime, offsetSeconds: number): HzOffsetDateTime;

    new(hzLocalDateTime: HzLocalDateTime, offsetSeconds: number): HzOffsetDateTime;
}

function _OffsetDateTime(hzLocalDateTime: HzLocalDateTime, offsetSeconds: number): HzOffsetDateTime {
    return HzOffsetDateTime._new(hzLocalDateTime, offsetSeconds);
}

/**
 * Constructor function, can be invoked with or without new keyword.
 * @param hzLocalDateTime {@link HzLocalDateTimeClass} object
 * @param offsetSeconds timezone offset in seconds. Must be in [-64800, 64800] range.
 * @throws RangeError if any of the arguments are invalid
 */
export const OffsetDateTime: HzOffsetDateTimeInterface = <HzOffsetDateTimeInterface>_OffsetDateTime;
