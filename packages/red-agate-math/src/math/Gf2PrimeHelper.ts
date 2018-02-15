// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { PolynomialRing }    from "./Field";
import { Integer53 }         from "red-agate-util/modules/types/Integer53";
import { Gf2Ext }            from "./Gf2Ext";
import { GfPrime }           from "./GfPrime";
import { WritableArrayLike } from "red-agate-util/modules/types/WritableArrayLike";


/**
 *
 */
export class Gf2PrimeFieldHelper {

    public static listPx(nth: number, listAll: boolean = false): number[] {
        // GF(p^m)      's primitive polynomials P(X) are:
        // x^(p^m-1)-1  's factor that degree of m irreducible polynomial
        // (p:prime, m:degree of field extension)
        const numElements = 2 ** nth; // 1 << nth
        const mask = numElements - 1;

        const zx: number[] = [];
        const pxs: number[] = [];
        zx[mask] = 1;
        zx[0] = 1;

        const n = 2 ** (nth + 1);
        for (let i = 2; i < n; i++) {
            const result = Gf2PrimeFieldHelper.polyDiv(zx, Gf2PrimeFieldHelper.bitToPoly(i));
            if (result.divisible && (pxs.length === 0 ||
                    pxs.every((px) => ! Gf2PrimeFieldHelper.bitPolyDiv(i, px).divisible)))
                pxs.push(i);
        }

        if (listAll) return pxs;
        else return pxs.filter(v => Boolean(Integer53.bitRShift(v, nth) & 1)).filter((v) => {
            const gf = new Gf2Ext(nth, v);
            return gf.checkGenerationResult();
        });
    }

    /**
     *
     */
    public static bitToPoly(x: number): number[] {
        const r: number[] = [];
        x = Math.abs(x);
        const loX = (x & 0xffffffff) >>> 0;
        const hiX = (x - loX) / 4294967296;

        for (let i = 0; i < 32; i++) {
            r[i] = ((loX & (1 << i)) >>> 0) ? 1 : 0;
        }
        for (let i = 0; i < 21; i++) {
            r[32 + i] = ((hiX & (1 << i)) >>> 0) ? 1 : 0;
        }
        for (let i = 52; i > 0; i--) {
            if (r[i]) {
                r.length = i + 1;
                return r;
            }
        }
        r.length = 1;
        return r;
    }

    /**
     *
     */
    public static polyToBit(x: ArrayLike<number>): number {
        let r: number = 0;
        const n: number = Math.min(53, x.length);
        for (let i = 0; i < n; i++) {
            if (x[i]) r += 2 ** i;
        }
        return r;
    }

    /**
     *
     */
    public static polyAdd(x: ArrayLike<number>, y: ArrayLike<number>): number[] {
        // GF2 prime finite field's calculation.
        const r: number[] = [];
        r.length = Math.max(x.length, y.length);
        for (let i = 0; i < r.length; i++) {
            r[i] = (x[i] !== void(0) ? x[i] : 0) ^ (y[i] !== void(0) ? y[i] : 0);
        }
        return r;
    }

    /**
     *
     */
    public static polySub(x: ArrayLike<number>, y: ArrayLike<number>): number[] {
        // GF2 prime finite field's calculation.
        return this.polyAdd(x, y);
    }

    /**
     *
     */
    public static bitPolyAdd(x: number, y: number): number {
        // GF2 prime finite field's calculation.
        return Integer53.bitXor(x, y);
    }

    /**
     *
     */
    public static bitPolySub(x: number, y: number): number {
        // GF2 prime finite field's calculation.
        return Integer53.bitXor(x, y);
    }

    /**
     *
     */
    public static polyMul(x: ArrayLike<number>, y: ArrayLike<number>): number[] {
        // GF2 prime finite field's calculation.
        const r: number[] = [];
        r.length = x.length + y.length - 1;
        for (let i = 0; i < y.length; i++) {
            for (let j = 0; j < x.length; j++) {
                // r[j + i] is undefined but bitwise operators implicitly cast NaN as 0.
                r[j + i] ^= x[j] & y[i];
            }
        }
        return r;
    }

    /**
     *
     */
    public static bitPolyMul(x: number, y: number): number {
        // GF2 prime finite field's calculation.
        let r = 0;
        for (let i = 0; i < 53; i++) {
            r = Integer53.bitXor(r, x * (Integer53.bitRShift(y, i) & 1) * (2 ** i));
        }
        return r;
    }

    /**
     *
     */
    public static polyDiv(
            x: WritableArrayLike<number>, y: ArrayLike<number>, extendDividendLength: number = 0):
            {q: number[], r: number[], divisible: boolean} {
        // GF2 prime finite field's calculation.
        x = Array.from(x);
        if (extendDividendLength > 0) {
            const ext: number[] = [];
            ext.length = extendDividendLength;
            for (let i = 0; i < extendDividendLength; i++) {
                ext[i] = 0;
            }
            x = ext.concat(x as number[]);
        }

        let ylen = y.length;
        for (let i = 0; i < ylen; i++, ylen--) {
            if (y[ylen - 1]) break;
        }
        if (ylen === 0) return {q: [Number.NaN], r: [Number.NaN], divisible: false};

        const n: number = x.length - ylen + 1;
        const q: number[] = [];
        q.length = n;
        for (let i = 0; i < n; i++) {
            if (x[x.length - 1 - i]) {
                q[n - 1 - i] = 1;
                for (let j = 0; j < ylen; j++) {
                    x[n - 1 - i + j] ^= y[j];
                }
            } else {
                x[x.length - 1 - i] = 0;
            }
        }

        let divisible = true;
        const r: number[] = [];
        r.length = ylen - 1;
        for (let i = 0; i < r.length; i++) {
            if (x[i]) divisible = false;
            r[i] = x[i];
        }
        return {q, r, divisible};
    }

    /**
     *
     */
    public static bitPolyDiv(x: number, y: number, extendDividendLength: number = 0):
            {q: number, r: number, divisible: boolean} {
        // GF2 prime finite field's calculation.
        if (extendDividendLength)
            x = Integer53.bitLShift(x, extendDividendLength);
        let ylen = 53;
        for (let i = 0; i < 53; i++, ylen--) {
            if (Integer53.bitRShift(y, 52 - i)) break;
        }
        if (ylen === 0) return {q: Number.NaN, r: Number.NaN, divisible: false};

        const n: number = 53 - ylen + 1;
        let q: number = 0;

        for (let i = 0, m = 2 ** 52; i < n; i++, m /= 2) {
            if (Math.trunc(x / m) & 1) {
                const w = 2 ** (n - 1 - i);
                q += w;
                x = Integer53.bitXor(x, y * w);
            }
        }
        return {q, r: x, divisible: x === 0};
    }

    /**
     *
     */
    public static polyIsZero(x: ArrayLike<number>): boolean {
        const n: number = Math.min(52, x.length);
        for (let i = 0; i < n; i++) {
            if (x[i]) return true;
        }
        return false;
    }
}


export class Gf2PrimeBitPolynomialRing implements PolynomialRing<number, number> {

    // tslint:disable-next-line:variable-name
    private _field: GfPrime;


    public get field(): GfPrime {
        if (this._field) return this._field;
        this._field = new GfPrime(2);
        return this._field;
    }


    public listPx(nth: number, listAll: boolean = false): number[] {
        return Gf2PrimeFieldHelper.listPx(nth, listAll);
    }


    public getAt(x: number, index: number): number {
        return Integer53.bitRShift(x, index) & 1;
    }

    public setAt(x: number, index: number, v: number): number {
        return Integer53.bitNot(Integer53.bitLShift((v & 1) ? 0 : 1, index));
    }

    public slice(x: number, start: number, end: number): number {
        return Integer53.bitAnd(
            Integer53.bitRShift(Integer53.MAX_INT, end - start),
            Integer53.bitRShift(x, start));
    }

    public map(x: number, fn: (x: number) => number): number {
        return this.mapToSelf(x, fn);
    }

    public mapToSelf(x: number, fn: (x: number) => number): number {
        for (let i = 0; i < 53; i++) x = this.setAt(x, i, fn(this.getAt(x, i)));
        return x;
    }

    public newNthPolynomial(n: number): number {
        return 0;
    }


    /**
     * additive identity element
     */
    public get ZERO(): number {
        return 0;
    }

    /**
     * multiplicative identity element
     */
    public get ONE(): number {
        return 1;
    }

    /**
     * NaN value
     */
    public get NaN(): number {
        return Number.NaN;
    }


    /**
     * normalize a value
     */
    public normalize(x: number): number {
        return x;
    }

    /**
     * check value is NaN
     */
    public isNaN(x: number): boolean {
        return Number.isNaN(x);
    }


    /**
     * compare element and return true if x equals to y
     * eq(v,v)     -> true
     * eq(NaN,NaN) -> false
     */
    public eq(x: number, y: number): boolean {
        return x === y;
    }

    /**
     * compare element and return false if x equals to y
     */
    public noteq(x: number, y: number): boolean {
        return x !== y;
    }


    /**
     * negate; additive inverse (-x)
     */
    public neg(x: number): number {
        return x;
    }


    /**
     * addition (x+y)
     */
    public add(x: number, y: number): number {
        return Integer53.bitXor(x, y);
    }

    /**
     * subtraction (x-y)
     */
    public sub(x: number, y: number): number {
        return Integer53.bitXor(x, y);
    }

    /**
     * multiplication (x*y)
     */
    public mul(x: number, y: number): number {
        return Gf2PrimeFieldHelper.bitPolyMul(x, y);
    }

    /**
     * modulation (x%y)
     */
    public mod(x: number, y: number, extendDividendLength: number = 0): number {
        return Gf2PrimeFieldHelper.bitPolyDiv(x, y, extendDividendLength).r;
    }

    /**
     * division (x/y)
     *             ? = div(x,ZERO) ; depends on field definition
     * mul(x,inv(y)) = div(x,y)    ;  when  y != ZERO
     */
    public divmod(x: number, y: number, extendDividendLength: number = 0):
            {q: number, r: number, divisible: boolean} {
        return Gf2PrimeFieldHelper.bitPolyDiv(x, y, extendDividendLength);
    }


    /**
     * exponentiation (a^x)
     *   y = pow(a,x)
     *   x = log(a,y)
     * ONE = pow(a,0)
     *   a = pow(a,1)
     */
    public pow(a: number, x: number): number {
        throw new Error("not supported operation");
    }

    /**
     * pow(ALPHA,x) = exp(x)
     *          ONE = exp(0)
     *        ALPHA = exp(1)
     */
    public exp(x: number): number {
        throw new Error("not supported operation");
    }
}


export class Gf2PrimeArrayPolynomialRing implements PolynomialRing<number[], number> {

    // tslint:disable-next-line:variable-name
    private _field: GfPrime;
    // tslint:disable-next-line:variable-name
    private _nan: number[];

    /**
     *
     */
    constructor() {
        this._nan = [Number.NaN];
    }


    public get field(): GfPrime {
        if (this._field) return this._field;
        this._field = new GfPrime(2);
        return this._field;
    }


    public listPx(nth: number, listAll: boolean = false): number[][] {
        return Gf2PrimeFieldHelper.listPx(nth, listAll).map(x => Gf2PrimeFieldHelper.bitToPoly(x));
    }


    public getAt(x: ArrayLike<number>, index: number): number {
        return x[index];
    }

    public setAt(x: number[], index: number, v: number): number[] {
        x[index] = v;
        return x;
    }

    public slice(x: number[], start: number, end: number): number[] {
        return x.slice(start, end);
    }

    public map(x: ArrayLike<number>, fn: (x: number) => number): number[] {
        return this.mapToSelf(Array.from(x), fn);
    }

    public mapToSelf(x: number[], fn: (x: number) => number): number[] {
        for (let i = 0; i < x.length; i++) x[i] = fn(x[i]);
        return x;
    }

    public newNthPolynomial(n: number): number[] {
        const r: number[] = [];
        r.length = n + 1;
        r.fill(0);
        return r;
    }


    /**
     * additive identity element
     */
    public get ZERO(): number[] {
        return [0];
    }

    /**
     * multiplicative identity element
     */
    public get ONE(): number[] {
        throw [1];
    }

    /**
     * NaN value
     */
    public get NaN(): number[] {
        return this._nan;
    }


    /**
     * normalize a value
     */
    public normalize(x: ArrayLike<number>): number[] {
        return (Array.isArray(x) ? x : Array.from(x)).map(v => Boolean(v & 1) ? 1 : 0);
    }

    /**
     * check value is NaN
     */
    public isNaN(x: ArrayLike<number>): boolean {
        if (x !== this.NaN) {
            if (x.length === 1 && x[0] === Number.NaN) return true;
            return false;
        }
        return true;
    }


    /**
     * compare element and return true if x equals to y
     * eq(v,v)     -> true
     * eq(NaN,NaN) -> false
     */
    public eq(x: ArrayLike<number>, y: ArrayLike<number>): boolean {
        if (this.isNaN(x) || this.isNaN(y)) return false;
        const len = Math.max(x.length, y.length);
        for (let i = 0; i < len; i++) {
            if ((x[i] !== void(0) ? (Boolean(x[i] & 1) ? 1 : 0) : 0) !==
                (y[i] !== void(0) ? (Boolean(y[i] & 1) ? 1 : 0) : 0)) return false;
        }
        return true;
    }

    /**
     * compare element and return false if x equals to y
     */
    public noteq(x: ArrayLike<number>, y: ArrayLike<number>): boolean {
        return !this.eq(x, y);
    }


    /**
     * negate; additive inverse (-x)
     */
    public neg(x: ArrayLike<number>): number[] {
        return Array.from(x);
    }


    /**
     * addition (x+y)
     */
    public add(x: ArrayLike<number>, y: ArrayLike<number>): number[] {
        return Gf2PrimeFieldHelper.polyAdd(x, y);
    }

    /**
     * subtraction (x-y)
     */
    public sub(x: ArrayLike<number>, y: ArrayLike<number>): number[] {
        return Gf2PrimeFieldHelper.polySub(x, y);
    }

    /**
     * multiplication (x*y)
     */
    public mul(x: ArrayLike<number>, y: ArrayLike<number>): number[] {
        return Gf2PrimeFieldHelper.polyMul(x, y);
    }

    /**
     * modulation (x%y)
     */
    public mod(x: WritableArrayLike<number>, y: ArrayLike<number>, extendDividendLength: number = 0): number[] {
        return Gf2PrimeFieldHelper.polyDiv(x, y, extendDividendLength).r;
    }

    /**
     * division (x/y)
     *             ? = div(x,ZERO) ; depends on field definition
     * mul(x,inv(y)) = div(x,y)    ;  when  y != ZERO
     */
    public divmod(x: WritableArrayLike<number>, y: ArrayLike<number>, extendDividendLength: number = 0):
            {q: number[], r: number[], divisible: boolean} {
        return Gf2PrimeFieldHelper.polyDiv(x, y, extendDividendLength);
    }


    /**
     * exponentiation (a^x)
     *   y = pow(a,x)
     *   x = log(a,y)
     * ONE = pow(a,0)
     *   a = pow(a,1)
     */
    public pow(a: ArrayLike<number>, x: number): number[] {
        throw new Error("not supported operation");
    }

    /**
     * pow(ALPHA,x) = exp(x)
     *          ONE = exp(0)
     *        ALPHA = exp(1)
     */
    public exp(x: number): number[] {
        throw new Error("not supported operation");
    }
}
