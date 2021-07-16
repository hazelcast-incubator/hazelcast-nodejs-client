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

/**
 * A wrapper for `BigDecimal` values. You can use this class to store and query `BigDecimal` values in distributed objects.
 *
 * A `BigDecimal` consists of an arbitrary precision number {@link unscaledValue} and a {@link scale}. If zero or positive,
 * the scale is the number of digits to the right of the decimal
 * point. If negative, the unscaled value of the number is multiplied
 * by ten to the power of the negation of the scale.  The value of the
 * number represented by the `BigDecimal` is therefore
 * <code>(unscaledValue &times; 10<sup>-scale</sup>)</code>.
 */
export class BigDecimal {

    /** @internal */
    private static readonly MAX_EXPONENT_DIGITS = Number.MAX_SAFE_INTEGER.toString().length;

    /**
     * Unscaled value of this `BigDecimal`. This value is a native JavaScript BigInt object, which is used to store
     * digits of this BigDecimal.
     */
    readonly unscaledValue: BigInt;

    /**
     * Scale of this `BigDecimal`. If zero or positive, the scale
     * is the number of digits to the right of the decimal point.
     * If negative, the unscaled value of the number is multiplied
     * by ten to the power of the negation of the scale. For example,
     * a scale of `-3` means the unscaled value is multiplied by 1000.
     */
    readonly scale: number;

    /**
     * Translates the string representation of a `BigDecimal`
     * into a `BigDecimal`.  The string representation consists
     * of an optional sign, '+' (<code> '&#92;u002B'</code>) or
     * '-' (<code>'&#92;u002D'</code>), followed by a sequence of
     * zero or more decimal digits ("the integer"), optionally
     * followed by a fraction, optionally followed by an exponent.
     *
     * The fraction consists of a decimal point followed by zero
     * or more decimal digits. The string must contain at least one
     * digit in either the integer or the fraction. The number formed
     * by the sign, the integer and the fraction is referred to as the
     * significand.
     *
     * The exponent consists of the character 'e'
     * (<code>'&#92;u0065'</code>) or 'E' (<code>'&#92;u0045'</code>)
     * followed by one or more decimal digits. The value of the
     * exponent must be a safe integer.
     *
     * The scale of the returned `BigDecimal` will be the
     * number of digits in the fraction, or zero if the string
     * contains no decimal point, subject to adjustment for any
     * exponent; if the string contains an exponent, the exponent is
     * subtracted from the scale. The value of the resulting scale
     * must be a safe integer.
     *
     * ## Examples:
     *
     * The value of the returned `BigDecimal` is equal to
     * <i>significand</i> &times; 10<sup>&nbsp;<i>exponent</i></sup>.
     * For each string on the left, the resulting representation
     * [`BigInt`, `scale`] is shown on the right.
     * <pre>
     * "0"            [0,0]
     * "0.00"         [0,2]
     * "123"          [123,0]
     * "-123"         [-123,0]
     * "1.23E3"       [123,-1]
     * "1.23E+3"      [123,-1]
     * "12.3E+7"      [123,-6]
     * "12.0"         [120,1]
     * "12.3"         [123,1]
     * "0.00123"      [123,5]
     * "-1.23E-12"    [-123,14]
     * "1234.5E-4"    [12345,5]
     * "0E+7"         [0,-7]
     * "-0"           [0,0]
     * </pre>
     *
     * @param value a non-null `BigDecimal` string
     * @throws RangeError if value is not a valid representation of a `BigDecimal`.
     */
    constructor(value: string) {
        // inspired from openjdk BigDecimal's `BigDecimal(char[] in, int offset, int len, MathContext mc)` constructor
        if (typeof value !== 'string') {
            throw new RangeError('String value expected');
        }
        let offset = 0; // offset that points to an index of string, used for moving on the string
        let len = value.length;
        let precision = 0; // record precision value
        let scale = 0; // record scale value
        let unscaledValue: BigInt; // the unscaled value in BigInteger

        // handle the sign
        let isneg = false; // assume positive
        if (value[offset] === '-') {
            isneg = true; // leading minus means negative
            offset++;
            len--;
        } else if (value[offset] === '+') { // leading + allowed
            offset++;
            len--;
        }

        // should now be at numeric part of the significand
        let dot = false; // true when there is a '.'
        let exp = 0; // exponent
        let c: string; // current character
        // integer significand array & idx is the index to it.
        let idx = 0;
        const coeff = [];
        for (; len > 0; offset++, len--) {
            c = value[offset];
            // have digit
            if (c >= '0' && c <= '9') {
                // First compact case, we need not to preserve the character
                // and we can just compute the value in place.
                if (c === '0') {
                    if (precision === 0) {
                        coeff[idx] = c;
                        precision = 1;
                    } else if (idx !== 0) {
                        coeff[idx++] = c;
                        precision++;
                    }  // else c must be a redundant leading zero
                } else {
                    if (precision !== 1 || idx !== 0) {
                        precision++; // prec unchanged if preceded by 0s
                    }
                    coeff[idx++] = c;
                }
                if (dot) {
                    scale++;
                }
                continue;
            }
            // have dot
            if (c === '.') {
                if (dot) { // two dots
                    throw new RangeError('String contains more than one decimal point.');
                }
                dot = true;
                continue;
            }
            // exponent expected
            if ((c !== 'e') && (c !== 'E')) {
                throw new RangeError('String is missing "e" notation exponential mark.');
            }
            exp = BigDecimal.parseExp(value, offset, len);
            if (!Number.isSafeInteger(exp)) {
                throw new RangeError('Exponent overflow');
            }
            break;
        }
        // here when no characters left
        if (precision === 0) {
            throw new RangeError('No digits found.');
        }
        // Adjust scale if exp is not zero.
        if (exp !== 0) {
            scale = BigDecimal.adjustScale(scale, exp);
        }
        const stringValue = coeff.join('');
        if (isneg) {
            unscaledValue = BigInt('-' + stringValue);
        } else {
            unscaledValue = BigInt(stringValue);
        }
        this.unscaledValue = unscaledValue;
        this.scale = scale;
    }

    /**
     * Parses exponent and returns it
     *
     * @param expString Exponent string
     * @param offset Offset of where to start reading
     * @param len How many chars to read
     * @internal
     * @private
     */
    private static parseExp(expString: string, offset: number, len: number): number {
        let exp = 0;
        offset++;
        let c = expString[offset];
        len--;
        const isNegative = (c === '-');
        // optional sign
        if (isNegative || c === '+') {
            offset++;
            c = expString[offset];
            len--;
        }
        if (len <= 0) { /// no exponent digits
            throw new RangeError('No exponent digits');
        }
        // skip leading zeros in the exponent
        while (len > BigDecimal.MAX_EXPONENT_DIGITS && c === '0') {
            offset++;
            c = expString[offset];
            len--;
        }
        // too many nonzero exponent digits
        if (len > BigDecimal.MAX_EXPONENT_DIGITS) {
            throw new RangeError('Too many nonzero exponent digits');
        }
        // c now holds first digit of exponent
        for (; ; len--) {
            let v: number;
            if (c >= '0' && c <= '9') {
                v = +c;
            } else { // not a digit
                throw new RangeError('Not a digit.');
            }
            exp = exp * 10 + v;
            if (len === 1) {
                break; // that was final character
            }
            offset++;
            c = expString[offset];
        }
        if (isNegative) { // apply sign
            exp = -exp;
        }
        return exp;
    }

    /**
     * Adjust scales according to exp number.
     * @param scale scale
     * @param exp exponent number
     * @throws RangeError if scale is out of range
     * @private
     */
    private static adjustScale(scale: number, exp: number): number {
        const adjustedScale = scale - exp;
        if (!Number.isSafeInteger(adjustedScale)) {
            throw new RangeError('Scale is out of range.');
        }
        scale = adjustedScale;
        return scale;
    }

    /**
     * Returns absolute value of a BigInt
     * @param val
     * @private
     * @internal
     */
    private static bigIntAbs(val: BigInt) {
        if (val < BigInt(0)) {
            return val.valueOf() * BigInt(-1);
        } else {
            return val;
        }
    }

    /**
     * Returns signum of this BigDecimal. Signum is
     * -1 if the BigDecimal is negative,
     * 0 if the BigDecimal is zero,
     * 1 if the BigDecimal is positive.
     * @internal
     * @private
     */
    private signum(): number {
        return this.unscaledValue > BigInt(0) ? 1 : (this.unscaledValue < BigInt(0) ? -1 : 0);
    }

    /**
     * Returns a string representation of this `BigDecimal`
     * without an exponent field.  For values with a positive scale,
     * the number of digits to the right of the decimal point is used
     * to indicate scale. For values with a zero or negative scale,
     * the resulting string is generated as if the value were
     * converted to a numerically equal value with zero scale and as
     * if all the trailing zeros of the zero scale value were present
     * in the result.
     *
     * The entire string is prefixed by a minus sign character '-'
     * (<code>'&#92;u002D'</code>) if the unscaled value is less than
     * zero. No sign character is prefixed if the unscaled value is
     * zero or positive.
     *
     * @return a string representation of this `BigDecimal`
     * without an exponent field.
     */
    toString(): string {
        if (this.scale === 0) { // zero scale is trivial
            return this.unscaledValue.toString();
        }
        if (this.scale < 0) { // No decimal point
            if (this.signum() === 0) {
                return '0';
            }
            const trailingZeros = -this.scale;
            let str = '';
            str += this.unscaledValue.toString();
            for (let i = 0; i < trailingZeros; i++) {
                str += '0';
            }
            return str;
        }
        const digitsString = BigDecimal.bigIntAbs(this.unscaledValue).toString();
        return BigDecimal.getValueString(this.signum(), digitsString, this.scale);
    }

    /**
     * Returns a digit.digit string
     * @param signum 0, -1 or 1 depending on the sign of the number
     * @param digitsString digits as string
     * @param scale The scale of the resulting string
     * @internal
     */
    private static getValueString(signum: number, digitsString: string, scale: number): string {
        /* Insert decimal point */
        let buf = '';
        const insertionPoint = digitsString.length - scale;
        if (insertionPoint === 0) { /* Point goes right before intVal */
            return (signum < 0 ? '-0.' : '0.') + digitsString;
        } else if (insertionPoint > 0) { /* Point goes inside intVal */
            buf = digitsString.slice(0, insertionPoint) + '.' + digitsString.slice(insertionPoint);
            if (signum < 0) {
                buf = '-' + buf;
            }
        } else { /* We must insert zeros between point and intVal */
            buf += signum < 0 ? '-0.' : '0.';
            for (let i = 0; i < -insertionPoint; i++) {
                buf += '0';
            }
            buf += digitsString;
        }
        return buf.toString();
    }

}
