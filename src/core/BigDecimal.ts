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
 * A wrapper for BigDecimal values. You can use this class to store and query BigDecimal values in distributed objects.
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
     * Scale of this `BigDecimal`.  If zero or positive, the scale
     * is the number of digits to the right of the decimal point.
     * If negative, the unscaled value of the number is multiplied
     * by ten to the power of the negation of the scale. For example,
     * a scale of `-3` means the unscaled value is multiplied by 1000.
     */
    readonly scale: number;

    /** @internal */
    private constructor(unscaledValue: BigInt, scale: number) {
        this.unscaledValue = unscaledValue;
        this.scale = scale;
    }

    /** @internal */
    private static parseExp(input: string, offset: number, len: number): number {
        let exp = 0;
        offset++;
        let c = input[offset];
        len--;
        const negexp = (c === '-');
        if (negexp || c === '+') {
            offset++;
            c = input[offset];
            len--;
        }
        if (len <= 0) {
            throw new RangeError('No exponent digits');
        }
        while (len > BigDecimal.MAX_EXPONENT_DIGITS && c === '0') {
            offset++;
            c = input[offset];
            len--;
        }
        if (len > BigDecimal.MAX_EXPONENT_DIGITS) {
            throw new RangeError('Too many nonzero exponent digits');
        }
        for (; ; len--) {
            let v: number;
            if (c >= '0' && c <= '9') {
                v = +c;
            } else {
                throw new RangeError('Not a digit.');
            }
            exp = exp * 10 + v;
            if (len === 1) {
                break;
            }
            offset++;
            c = input[offset];
        }
        if (negexp) {
            exp = -exp;
        }
        return exp;
    }

    /** @internal */
    private static adjustScale(scl: number, exp: number): number {
        const adjustedScale = scl - exp;
        if (!Number.isSafeInteger(adjustedScale)) {
            throw new RangeError('Scale out of range.');
        }
        scl = adjustedScale;
        return scl;
    }

    /** @internal */
    static _new(bigDecimalString: string): BigDecimal {
        if (typeof bigDecimalString !== 'string') {
            throw new RangeError('String value expected');
        }
        let offset = 0;
        let len = bigDecimalString.length;
        let precision = 0;
        let scale = 0;
        let bigIntValue: BigInt | null = null;

        let isneg = false;
        if (bigDecimalString[offset] === '-') {
            isneg = true;
            offset++;
            len--;
        } else if (bigDecimalString[offset] === '+') {
            offset++;
            len--;
        }

        let dot = false;
        let exp = 0;
        let c: string;
        let idx = 0;
        const coeff = [];
        for (; len > 0; offset++, len--) {
            c = bigDecimalString[offset];
            if (c >= '0' && c <= '9') {
                if (c === '0') {
                    if (precision === 0) {
                        coeff[idx] = c;
                        precision = 1;
                    } else if (idx !== 0) {
                        coeff[idx++] = c;
                        precision++;
                    }
                } else {
                    if (precision !== 1 || idx !== 0) {
                        precision++;
                    }
                    coeff[idx++] = c;
                }
                if (dot) {
                    scale++;
                }
                continue;
            }
            if (c === '.') {
                if (dot) {
                    throw new RangeError('String contains more than one decimal point.');
                }
                dot = true;
                continue;
            }
            if ((c !== 'e') && (c !== 'E')) {
                throw new RangeError('String is missing "e" notation exponential mark.');
            }
            exp = BigDecimal.parseExp(bigDecimalString, offset, len);
            if (!Number.isSafeInteger(exp)) {
                throw new RangeError('Exponent overflow');
            }
            break;
        }
        if (precision === 0) {
            throw new RangeError('No digits found.');
        }
        if (exp !== 0) {
            scale = BigDecimal.adjustScale(scale, exp);
        }
        const stringValue = coeff.join('');
        if (isneg) {
            bigIntValue = BigInt('-' + stringValue);
        } else {
            bigIntValue = BigInt(stringValue);
        }
        return new BigDecimal(bigIntValue, scale);
    }


    /** @internal */
    private static bigIntAbs(val: BigInt) {
        if (val < BigInt(0)) {
            return val.valueOf() * BigInt(-1);
        } else {
            return val;
        }
    }

    /** @internal */
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
        if (this.scale === 0) {
            return this.unscaledValue.toString();
        }
        if (this.scale < 0) {
            if (this.signum() === 0) {
                return '0';
            }
            const trailingZeros = -this.scale;
            let buf = '';
            buf += this.unscaledValue.toString();
            for (let i = 0; i < trailingZeros; i++) {
                buf += '0';
            }
            return buf;
        }
        const str = BigDecimal.bigIntAbs(this.unscaledValue).toString();
        return BigDecimal.getValueString(this.signum(), str, this.scale);
    }

    /** @internal */
    private static getValueString(signum: number, intString: string, scale: number): string {
        /* Insert decimal point */
        let buf = '';
        const insertionPoint = intString.length - scale;
        if (insertionPoint === 0) { /* Point goes right before intVal */
            return (signum < 0 ? '-0.' : '0.') + intString;
        } else if (insertionPoint > 0) { /* Point goes inside intVal */
            buf = intString.slice(0, insertionPoint) + '.' + intString.slice(insertionPoint);
            if (signum < 0) {
                buf = '-' + buf;
            }
        } else { /* We must insert zeros between point and intVal */
            buf += signum < 0 ? '-0.' : '0.';
            for (let i = 0; i < -insertionPoint; i++) {
                buf += '0';
            }
            buf += intString;
        }
        return buf.toString();
    }

}

interface BigInterface {
    (decimalString: string): BigDecimal;

    new(decimalString: string): BigDecimal;
}

function _Big(decimalString: string): BigDecimal {
    return BigDecimal._new(decimalString);
}

/**
 * Constructor function for {@link BigDecimal}. Can be invoked with new or without new.
 *
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
 * @param decimalString a non-null BigDecimal string
 * @throws RangeError if decimalString is not a valid representation of a `BigDecimal`.
 */
export const Big: BigInterface = <BigInterface>_Big;
