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

const chai = require('chai');
chai.should();
const {
    LocalTime,
    HzLocalTime,
    LocalDate,
    HzLocalDate,
    LocalDateTime,
    HzLocalDateTime,
    OffsetDateTime,
    HzOffsetDateTime
} = require('../../../lib/core/DatetimeClasses');

describe('DatetimeClassesTest', function () {
    describe('HzLocalTimeTest', function () {
        it('should work with or without new', function () {
            const withOutNew = LocalTime(2, 3, 4, 60000);
            const withNew = new LocalTime(2, 3, 4, 60000);
            withNew.should.be.deep.eq(withOutNew);
        });

        it('should return hour, minute and seconds correctly', function () {
            const newHzTime = new LocalTime(2, 3, 4, 60000);
            newHzTime.hour.should.be.equal(2);
            newHzTime.minute.should.be.equal(3);
            newHzTime.second.should.be.equal(4);
            newHzTime.nano.should.be.equal(60000);
        });

        it('should throw RangeError if hour is not an integer between 0-23(inclusive)', function () {
            (() => LocalTime(-1, 1, 1, 1)).should.throw(RangeError, 'Hour');
            (() => LocalTime(1.1, 1, 1, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(25, 1, 1, 1)).should.throw(RangeError, 'Hour');
            (() => LocalTime('500', 1, 1, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime({}, 1, 1, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime([], 1, 1, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(24, 1, 1, 1)).should.throw(RangeError, 'Hour');
            (() => LocalTime(299, 3, 4, 0)).should.throw(RangeError, 'Hour');
        });

        it('should throw RangeError if minute is not an integer between 0-59(inclusive)', function () {
            (() => LocalTime(1, -1, 1, 1)).should.throw(RangeError, 'Minute');
            (() => LocalTime(1, 1.1, 1, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, 233, 1, 1)).should.throw(RangeError, 'Minute');
            (() => LocalTime(1, '1', 1, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, {1: 1}, 1, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, [], 1, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, 60, 1, 1)).should.throw(RangeError, 'Minute');
        });

        it('should throw RangeError if seconds is not an integer between 0-59(inclusive)', function () {
            (() => LocalTime(1, 1, -1, 1)).should.throw(RangeError, 'Second');
            (() => LocalTime(1, 1, 1.1, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, 1, 233, 1)).should.throw(RangeError, 'Second');
            (() => LocalTime(1, 1, '1', 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, 1, {1: 1}, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, 1, [], 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, 1, 60, 1)).should.throw(RangeError, 'Second');
        });

        it('should throw RangeError if nano is not an integer between 0-999_999_999(inclusive)', function () {
            (() => LocalTime(1, 1, 1, -1)).should.throw(RangeError, 'Nano');
            (() => LocalTime(1, 1, 1, 1.1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, 1, 1, 1e23)).should.throw(RangeError, 'Nano');
            (() => LocalTime(1, 1, 1, '1')).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, 1, 1, {1: 1})).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, 1, 1, [])).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalTime(1, 1, 1, 1e9)).should.throw(RangeError, 'Nano');
        });

        it('should convert to string correctly', function () {
            LocalTime(1, 1, 1, 1).toString().should.be.eq('01:01:01.000000001');
            LocalTime(12, 10, 10, 1).toString().should.be.eq('12:10:10.000000001');
            LocalTime(23, 1, 11, 99999).toString().should.be.eq('23:01:11.000099999');
            LocalTime(23, 1, 11, 0).toString().should.be.eq('23:01:11');
        });

        it('should construct from string correctly', function () {
            const localtime1 = HzLocalTime.fromString('07:35:02.1');
            localtime1.nano.should.be.eq(100000000);
            localtime1.second.should.be.eq(2);
            localtime1.minute.should.be.eq(35);
            localtime1.hour.should.be.eq(7);

            const localtime2 = HzLocalTime.fromString('00:00:02');
            localtime2.nano.should.be.eq(0);
            localtime2.second.should.be.eq(2);
            localtime2.minute.should.be.eq(0);
            localtime2.hour.should.be.eq(0);

            // Nano has 10 digits, first 9 digits is considered.
            HzLocalTime.fromString('23:41:01.0000011111').nano.should.be.eq(1111);
            HzLocalTime.fromString('23:01:01.0000000001').nano.should.be.eq(0);
        });

        it('should throw RangeError on invalid string', function() {
            // invalid hour
            (() => HzLocalTime.fromString('24:01:01.000000001')).should.throw(RangeError);
            // invalid minute
            (() => HzLocalTime.fromString('23:71:01.000000001')).should.throw(RangeError);
            // invalid second
            (() => HzLocalTime.fromString('23:01:71.000000001')).should.throw(RangeError);
            // invalid format
            (() => HzLocalTime.fromString('23:0171')).should.throw(RangeError);
            (() => HzLocalTime.fromString('1:1:1')).should.throw(RangeError);
            (() => HzLocalTime.fromString('-')).should.throw(RangeError);
            // Non string
            (() => HzLocalTime.fromString(1)).should.throw(RangeError, 'String expected');
            (() => HzLocalTime.fromString([])).should.throw(RangeError, 'String expected');
            (() => HzLocalTime.fromString({})).should.throw(RangeError, 'String expected');
            (() => HzLocalTime.fromString(null)).should.throw(RangeError, 'String expected');
            (() => HzLocalTime.fromString()).should.throw(RangeError, 'String expected');
        });
    });
    describe('HzLocalDateTest', function () {
        it('should return hour, minute and seconds correctly', function () {
            const newHzDate = LocalDate(12, 3, 4);
            newHzDate.year.should.be.equal(12);
            newHzDate.month.should.be.equal(3);
            newHzDate.date.should.be.equal(4);
        });

        it('should work with or without new', function () {
            const withOutNew = LocalDate(12, 3, 4);
            const withNew = new LocalDate(12, 3, 4);
            withNew.should.be.deep.eq(withOutNew);
        });

        it('should throw RangeError if year is not an integer between -999_999_999-999_999_999(inclusive)',
            function () {
                (() => LocalDate(1e9, 1, 1)).should.throw(RangeError, 'Year');
                (() => LocalDate(-1e9, 1, 1)).should.throw(RangeError, 'Year');
                (() => LocalDate(1.1, 1, 1)).should.throw(RangeError, 'All arguments must be integers');
                (() => LocalDate('1', 1, 1)).should.throw(RangeError, 'All arguments must be integers');
                (() => LocalDate({1: 1}, 1, 1)).should.throw(RangeError, 'All arguments must be integers');
                (() => LocalDate([], 1, 1)).should.throw(RangeError, 'All arguments must be integers');
                (() => LocalDate(1e12, 1, 1)).should.throw(RangeError, 'Year');
            });

        it('should throw RangeError if month is not an integer between 0-59(inclusive)', function () {
            (() => LocalDate(1, -1, 1)).should.throw(RangeError, 'Month');
            (() => LocalDate(1, 1.1, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalDate(1, 233, 1)).should.throw(RangeError, 'Month');
            (() => LocalDate(1, '1', 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalDate(1, {1: 1}, 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalDate(1, [], 1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalDate(1, 13, 1)).should.throw(RangeError, 'Month');
        });

        it('should throw RangeError if date is not an integer between 1-28/31 and it is not valid', function () {
            (() => LocalDate(1, 1, -1)).should.throw(RangeError, 'Invalid date');
            (() => LocalDate(1, 1, 1.1)).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalDate(1, 1, 233)).should.throw(RangeError, 'Invalid date');
            (() => LocalDate(1, 1, '1')).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalDate(1, 1, {1: 1})).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalDate(1, 1, [])).should.throw(RangeError, 'All arguments must be integers');
            (() => LocalDate(2001, 2, 29)).should.throw(RangeError, /Invalid.*not a leap year/);
            (() => LocalDate(2000, 2, 29)).should.not.throw(RangeError, 'Invalid date');
            (() => LocalDate(2001, 4, 31)).should.throw(RangeError, /Invalid.*April/);
            (() => LocalDate(2001, 4, 30)).should.not.throw(RangeError, 'Invalid date');
        });

        it('should convert to string correctly', function () {
            LocalDate(2000, 2, 29).toString().should.be.eq('2000-02-29');
            LocalDate(2001, 2, 1).toString().should.be.eq('2001-02-01');
            LocalDate(35, 2, 28).toString().should.be.eq('0035-02-28');
            LocalDate(-100, 3, 31).toString().should.be.eq('-0100-03-31');
            LocalDate(-35, 3, 31).toString().should.be.eq('-0035-03-31');
            LocalDate(-30205, 3, 31).toString().should.be.eq('-30205-03-31');
            LocalDate(30205, 3, 31).toString().should.be.eq('30205-03-31');
        });

        it('should construct from string correctly', function () {
            const localtime1 = HzLocalDate.fromString('2000-02-29');
            localtime1.year.should.be.eq(2000);
            localtime1.month.should.be.eq(2);
            localtime1.date.should.be.eq(29);

            const localtime2 = HzLocalDate.fromString('0001-02-03');
            localtime2.year.should.be.eq(1);
            localtime2.month.should.be.eq(2);
            localtime2.date.should.be.eq(3);

            const localtime3 = HzLocalDate.fromString('-2000-03-29');
            localtime3.year.should.be.eq(-2000);
            localtime3.month.should.be.eq(3);
            localtime3.date.should.be.eq(29);

            const localtime4 = HzLocalDate.fromString('-29999-03-29');
            localtime4.year.should.be.eq(-29999);
            localtime4.month.should.be.eq(3);
            localtime4.date.should.be.eq(29);

            const localtime5 = HzLocalDate.fromString('29999-03-29');
            localtime5.year.should.be.eq(29999);
            localtime5.month.should.be.eq(3);
            localtime5.date.should.be.eq(29);
        });

        it('should throw RangeError on invalid string', function () {
            // invalid month
            (() => HzLocalDate.fromString('2000-24-29')).should.throw(RangeError, 'Month');
            // invalid date
            (() => HzLocalDate.fromString('2001-02-29')).should.throw(RangeError, 'Invalid date');
            (() => HzLocalDate.fromString('2000-03-32')).should.throw(RangeError, 'Invalid date');
            // invalid format
            (() => HzLocalDate.fromString('9999999999-02-29')).should.throw(RangeError, 'Year');
            (() => HzLocalDate.fromString('2301-71')).should.throw(RangeError, 'Invalid format');
            (() => HzLocalDate.fromString('-')).should.throw(RangeError, 'Invalid format');
            (() => HzLocalDate.fromString('2000-02-a')).should.throw(RangeError, 'Invalid format');
            (() => HzLocalDate.fromString('0001-002-21')).should.throw(RangeError, 'Invalid format');
            (() => HzLocalDate.fromString('0001-02-1')).should.throw(RangeError, 'Invalid format');
            (() => HzLocalDate.fromString('0001-2-10')).should.throw(RangeError, 'Invalid format');
            (() => HzLocalDate.fromString('1-2-10')).should.throw(RangeError, 'Invalid format');
            // Non string
            (() => HzLocalDate.fromString(1)).should.throw(RangeError, 'String expected');
            (() => HzLocalDate.fromString({})).should.throw(RangeError, 'String expected');
            (() => HzLocalDate.fromString([])).should.throw(RangeError, 'String expected');
            (() => HzLocalDate.fromString(null)).should.throw(RangeError, 'String expected');
            (() => HzLocalDate.fromString()).should.throw(RangeError, 'String expected');
        });
    });
    describe('HzLocalDateTimeTest', function () {

        it('should work with or without new', function () {
            const withOutNew = LocalDateTime(LocalDate(2000, 2, 29), LocalTime(2, 3, 4, 6000000));
            const withNew = new LocalDateTime(LocalDate(2000, 2, 29), LocalTime(2, 3, 4, 6000000));
            withNew.should.be.deep.eq(withOutNew);
        });

        it('should return parse values correctly', function () {
            const dateTime1 = LocalDateTime(LocalDate(2000, 2, 29), LocalTime(2, 3, 4, 6000000));

            dateTime1.hzLocalDate.year.should.be.equal(2000);
            dateTime1.hzLocalDate.month.should.be.equal(2);
            dateTime1.hzLocalDate.date.should.be.equal(29);
            dateTime1.hzLocalTime.hour.should.be.equal(2);
            dateTime1.hzLocalTime.minute.should.be.equal(3);
            dateTime1.hzLocalTime.second.should.be.equal(4);
            dateTime1.hzLocalTime.nano.should.be.equal(6000000);
        });

        it('should throw RangeError if local time is not valid', function () {
            (() => LocalDateTime(LocalDate(2000, 2, 29), '')).should.throw(RangeError, 'Invalid local time');
            (() => LocalDateTime(LocalDate(2000, 2, 29), 100)).should.throw(RangeError, 'Invalid local time');
            (() => LocalDateTime('', LocalTime(2, 3, 4, 6000000))).should.throw(RangeError, 'Invalid local date');
        });

        it('should throw RangeError if local date is not valid', function () {
            (() => LocalDateTime(1, LocalTime(2, 3, 4, 0))).should.throw(RangeError, 'Invalid local date');
            (() => LocalDateTime('', LocalTime(2, 3, 4, 0))).should.throw(RangeError, 'Invalid local date');
            (() => LocalDateTime(LocalDate(2000, 2, 29), '')).should.throw(RangeError, 'Invalid local time');
        });

        it('should construct from string correctly', function () {
            const localDatetime1 = HzLocalDateTime.fromString('2021-04-15T07:33:04.914456789');
            const localTime1 = localDatetime1.hzLocalTime;
            const localDate1 = localDatetime1.hzLocalDate;
            localTime1.nano.should.be.eq(914456789);
            localTime1.second.should.be.eq(4);
            localTime1.minute.should.be.eq(33);
            localTime1.hour.should.be.eq(7);

            localDate1.year.should.be.eq(2021);
            localDate1.month.should.be.eq(4);
            localDate1.date.should.be.eq(15);

            // use t instead of T
            const localDatetime2 = HzLocalDateTime.fromString('2020-04-15t07:35:02.1');
            const localTime2 = localDatetime2.hzLocalTime;
            const localDate2 = localDatetime2.hzLocalDate;
            localTime2.nano.should.be.eq(100000000);
            localTime2.second.should.be.eq(2);
            localTime2.minute.should.be.eq(35);
            localTime2.hour.should.be.eq(7);

            localDate2.year.should.be.eq(2020);
            localDate2.month.should.be.eq(4);
            localDate2.date.should.be.eq(15);
        });

        it('should throw RangeError on invalid string', function () {
            // invalid format
            (() => HzLocalDateTime.fromString('23:0171')).should.throw(RangeError, 'Invalid format');
            (() => HzLocalDateTime.fromString('-')).should.throw(RangeError, 'Invalid format');
            // Non string
            (() => HzLocalDateTime.fromString(1)).should.throw(RangeError, 'String expected');
            (() => HzLocalDateTime.fromString([])).should.throw(RangeError, 'String expected');
            (() => HzLocalDateTime.fromString({})).should.throw(RangeError, 'String expected');
            (() => HzLocalDateTime.fromString(null)).should.throw(RangeError, 'String expected');
            (() => HzLocalDateTime.fromString()).should.throw(RangeError, 'String expected');
        });

        const dateTime1 = LocalDateTime(LocalDate(2000, 2, 29), LocalTime(2, 3, 4, 6000000));
        it('should return local time correctly', function () {
            dateTime1.hzLocalTime.toString().should.be.eq(LocalTime(2, 3, 4, 6000000).toString());
        });

        it('should return local date correctly', function () {
            dateTime1.hzLocalDate.toString().should.be.eq(LocalDate(2000, 2, 29).toString());
        });

        it('should convert to string correctly', function () {
            dateTime1.toString().should.be.eq('2000-02-29T02:03:04.006000000');
        });

        it('fromDate should throw RangeError if date is invalid', function () {
            (() => HzLocalDateTime.fromDate(new Date(-1))).should.throw(RangeError, 'Invalid date');
            (() => HzLocalDateTime.fromDate(new Date('s'))).should.throw(RangeError, 'Invalid date');
            (() => HzLocalDateTime.fromDate(1, 1)).should.throw(RangeError, 'Invalid date');
            (() => HzLocalDateTime.fromDate('s', 1)).should.throw(RangeError, 'Invalid date');
            (() => HzLocalDateTime.fromDate([], 1)).should.throw(RangeError, 'Invalid date');
        });

        it('should construct from fromDate correctly', function () {
            const dateTime = HzLocalDateTime.fromDate(new Date(Date.UTC(2000, 2, 29, 2, 3, 4, 6)));
            dateTime.toString().should.be.eq('2000-02-29T02:03:04.006000000');
        });

        it('should convert to date correctly', function () {
            const dateTime = LocalDateTime(LocalDate(2000, 2, 29), LocalTime(2, 19, 4, 6000000));
            dateTime.asDate().toISOString().should.be.eq('2000-02-29T02:19:04.006Z');
        });
    });
    describe('HzOffsetDateTimeTest', function () {

        it('should return parse values correctly', function () {
            const dateTime1 = OffsetDateTime(LocalDateTime(LocalDate(2000, 2, 29), LocalTime(2, 3, 4, 6)), 1000);

            dateTime1.hzLocalDateTime.hzLocalDate.year.should.be.equal(2000);
            dateTime1.hzLocalDateTime.hzLocalDate.month.should.be.equal(2);
            dateTime1.hzLocalDateTime.hzLocalDate.date.should.be.equal(29);
            dateTime1.hzLocalDateTime.hzLocalTime.hour.should.be.equal(2);
            dateTime1.hzLocalDateTime.hzLocalTime.minute.should.be.equal(3);
            dateTime1.hzLocalDateTime.hzLocalTime.second.should.be.equal(4);
            dateTime1.hzLocalDateTime.hzLocalTime.nano.should.be.equal(6);
            dateTime1.offsetSeconds.should.be.equal(1000);
        });

        it('fromDate should throw RangeError if date is invalid', function () {
            (() => HzOffsetDateTime.fromDate(new Date(-1), 1)).should.throw(RangeError, 'Invalid date');
            (() => HzOffsetDateTime.fromDate(new Date('s'), 1)).should.throw(RangeError, 'Invalid date');
            (() => HzOffsetDateTime.fromDate(1, 1)).should.throw(RangeError, 'Invalid date');
            (() => HzOffsetDateTime.fromDate('s', 1)).should.throw(RangeError, 'Invalid date');
            (() => HzOffsetDateTime.fromDate([], 1)).should.throw(RangeError, 'Invalid date');
        });

        it('fromDate should throw RangeError if offset is not an integer between -64800-64800', function () {
            (() => HzOffsetDateTime.fromDate(new Date(), '1')).should.throw(RangeError, 'Offset');
            (() => HzOffsetDateTime.fromDate(new Date(), 90000)).should.throw(RangeError, 'Offset');
            (() => HzOffsetDateTime.fromDate(new Date(), [])).should.throw(RangeError, 'Offset');
            (() => HzOffsetDateTime.fromDate(new Date(), -90000)).should.throw(RangeError, 'Offset');
            (() => HzOffsetDateTime.fromDate(new Date(), {})).should.throw(RangeError, 'Offset');
        });

        it('should construct from fromDate correctly', function () {
            const dateTime3 = HzOffsetDateTime.fromDate(new Date(Date.UTC(2000, 2, 29, 2, 3, 4, 6)), 1800);
            dateTime3.toString().should.be.eq('2000-02-29T02:03:04.006000000+00:30');
        });

        const dateTime1 = OffsetDateTime(LocalDateTime(LocalDate(2000, 2, 29), LocalTime(2, 19, 4, 6000000)), 1000);

        it('should convert to date correctly', function () {
            dateTime1.asDate().toISOString().should.be.eq('2000-02-29T02:02:24.006Z');
        });

        it('should convert to string correctly', function () {
            dateTime1.toString().should.be.eq('2000-02-29T02:19:04.006000000+00:16');
        });

        it('should construct from string correctly', function () {
            const offsetDatetime1 = HzOffsetDateTime.fromString('2000-02-29T02:03:04+01:30');
            const offsetSeconds1 = offsetDatetime1.offsetSeconds;
            const localDatetime1 = offsetDatetime1.hzLocalDateTime;
            const localTime1 = localDatetime1.hzLocalTime;
            const localDate1 = localDatetime1.hzLocalDate;

            localDate1.year.should.be.eq(2000);
            localDate1.month.should.be.eq(2);
            localDate1.date.should.be.eq(29);

            localTime1.hour.should.be.eq(2);
            localTime1.minute.should.be.eq(3);
            localTime1.second.should.be.eq(4);
            localTime1.nano.should.be.eq(0);

            offsetSeconds1.should.be.eq(90*60);

            // use t instead of T
            const offsetDatetime2 = HzOffsetDateTime.fromString('2021-04-15t07:33:04.914+02:30');
            const offsetSeconds2 = offsetDatetime2.offsetSeconds;
            const localDatetime2 = offsetDatetime2.hzLocalDateTime;
            const localTime2 = localDatetime2.hzLocalTime;
            const localDate2 = localDatetime2.hzLocalDate;

            localDate2.year.should.be.eq(2021);
            localDate2.month.should.be.eq(4);
            localDate2.date.should.be.eq(15);

            localTime2.hour.should.be.eq(7);
            localTime2.minute.should.be.eq(33);
            localTime2.second.should.be.eq(4);
            localTime2.nano.should.be.eq(914*1000000);

            offsetSeconds2.should.be.eq(150*60);

            // Use of Z
            const offsetDatetime3 = HzOffsetDateTime.fromString('2021-04-15T07:33:04.914Z');
            const offsetSeconds3 = offsetDatetime3.offsetSeconds;
            const localDatetime3 = offsetDatetime3.hzLocalDateTime;
            const localTime3 = localDatetime3.hzLocalTime;
            const localDate3 = localDatetime3.hzLocalDate;

            localDate3.year.should.be.eq(2021);
            localDate3.month.should.be.eq(4);
            localDate3.date.should.be.eq(15);

            localTime3.hour.should.be.eq(7);
            localTime3.minute.should.be.eq(33);
            localTime3.second.should.be.eq(4);
            localTime3.nano.should.be.eq(914*1000000);

            offsetSeconds3.should.be.eq(0);

            // Timezone info omitted, UTC should be assumed
            const offsetDatetime4 = HzOffsetDateTime.fromString('2021-04-15T07:33:04.914Z');
            const offsetSeconds4 = offsetDatetime4.offsetSeconds;
            const localDatetime4 = offsetDatetime4.hzLocalDateTime;
            const localTime4 = localDatetime4.hzLocalTime;
            const localDate4 = localDatetime4.hzLocalDate;

            localDate4.year.should.be.eq(2021);
            localDate4.month.should.be.eq(4);
            localDate4.date.should.be.eq(15);

            localTime4.hour.should.be.eq(7);
            localTime4.minute.should.be.eq(33);
            localTime4.second.should.be.eq(4);
            localTime4.nano.should.be.eq(914*1000000);

            offsetSeconds4.should.be.eq(0);
        });

        it('should throw RangeError on invalid string', function () {
            // invalid format
            (() => HzOffsetDateTime.fromString('2021-04-15T07:33:04.914++02:30'))
                .should.throw(RangeError, 'Invalid format');
            // Non string
            (() => HzOffsetDateTime.fromString(1)).should.throw(RangeError, 'String expected');
            (() => HzOffsetDateTime.fromString([])).should.throw(RangeError, 'String expected');
            (() => HzOffsetDateTime.fromString({})).should.throw(RangeError, 'String expected');
            (() => HzOffsetDateTime.fromString(null)).should.throw(RangeError, 'String expected');
            (() => HzOffsetDateTime.fromString()).should.throw(RangeError, 'String expected');
        });
    });
});
