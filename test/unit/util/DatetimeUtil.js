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
const expect = chai.expect;
chai.should();
const {
    getTimezoneOffsetFromSeconds,
    leftZeroPadInteger,
    getOffsetSecondsFromTimezoneString,
} = require('../../../lib/util/DatetimeUtil');

describe('DatetimeUtilTest', function () {
    describe('getTimezoneOffsetFromSecondsTest', function () {
        it('should extract 0 seconds correctly', function () {
            expect(
                getTimezoneOffsetFromSeconds(0)
            ).to.be.equal('Z');
        });

        it('should extract positive seconds correctly', function () {
            expect(
                getTimezoneOffsetFromSeconds(1500)
            ).to.be.equal('+00:25');
        });

        it('should extract big positive seconds correctly', function () {
            expect(
                getTimezoneOffsetFromSeconds(7502)
            ).to.be.equal('+02:05');
        });

        it('should extract negative seconds correctly', function () {
            expect(
                getTimezoneOffsetFromSeconds(-1199)
            ).to.be.equal('-00:19');
        });

        it('should extract big negative seconds correctly', function () {
            expect(
                getTimezoneOffsetFromSeconds(-36061)
            ).to.be.equal('-10:01');
        });
        it('should throw RangeError if too low offset is given', function () {
            expect(
                () => getTimezoneOffsetFromSeconds(-80000)
            ).to.throw(RangeError);
        });
        it('should throw RangeError if too high offset is given', function () {
            expect(
                () => getTimezoneOffsetFromSeconds(99999)
            ).to.throw(RangeError);
        });
    });
    describe('getOffsetSecondsFromTimezoneString', function () {
        it('should parse Z correctly', function () {
            expect(
                getOffsetSecondsFromTimezoneString('Z')
            ).to.be.equal(0);
        });

        it('should parse positive offset correctly', function () {
            expect(
                getOffsetSecondsFromTimezoneString('+00:25')
            ).to.be.equal(1500);
        });

        it('should parse big positive offset correctly', function () {
            expect(
                getOffsetSecondsFromTimezoneString('+02:05')
            ).to.be.equal(7500);
        });

        it('should parse negative offset correctly', function () {
            expect(
                getOffsetSecondsFromTimezoneString('-00:19')
            ).to.be.equal(19*-1*60);
        });

        it('should parse big negative offset correctly', function () {
            expect(
                getOffsetSecondsFromTimezoneString('-10:01')
            ).to.be.equal(-(10*3600+60));
        });

        it('should throw if offset more than 18 hours is given', function () {
            expect(() => getOffsetSecondsFromTimezoneString('+19:00')).to.throw(RangeError);
        });

        it('should throw if offset less than -18 hours is given', function () {
            expect(() => getOffsetSecondsFromTimezoneString('-19:00')).to.throw(RangeError);
        });
    });
    describe('leftZeroPadIntegerTest', function () {
        it('should pad length of 5 digits correctly', function () {
            expect(
                leftZeroPadInteger(123, 5)
            ).to.be.equal('00123');
        });

        it('should not change number if its length is same with desired length', function () {
            expect(
                leftZeroPadInteger(12345, 5)
            ).to.be.equal('12345');
        });

        it('should not change number if its length is longer than desired length', function () {
            expect(
                leftZeroPadInteger(123456, 5)
            ).to.be.equal('123456');
        });

    });
});
