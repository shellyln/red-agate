// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { PolynomialRing, Field } from "./Field";
import { WritableArrayLike }     from "red-agate-util/modules/types/WritableArrayLike";


/**
 *
 */
export class ArrayPolynomialRing<U> implements PolynomialRing<U[], U> {

    // tslint:disable-next-line:variable-name
    private _zero: any[];
    // tslint:disable-next-line:variable-name
    private _one: any[];
    // tslint:disable-next-line:variable-name
    private _nan: any[];

    /**
     *
     */
    constructor(public field: Field<U>) {
        this._zero = [field.ZERO];
        this._one = [field.ONE];
        this._nan = [field.NaN];
    }

    /**
     *
     */
    public listPx(nth: number): U[][] {
        throw new Error("not supported operation");
    }


    public getAt(x: ArrayLike<U>, index: number): U {
        return x[index];
    }

    public setAt(x: U[], index: number, v: U): U[] {
        x[index] = v;
        return x;
    }

    public slice(x: U[], start: number, end: number): U[] {
        return x.slice(start, end);
    }

    public map(x: ArrayLike<U>, fn: (x: U) => U): U[] {
        return this.mapToSelf(Array.from(x), fn);
    }

    public mapToSelf(x: U[], fn: (x: U) => U): U[] {
        for (let i = 0; i < x.length; i++) x[i] = fn(x[i]);
        return x;
    }

    public newNthPolynomial(n: number): U[] {
        const r: U[] = [];
        r.length = n + 1;
        r.fill(this.field.ZERO);
        return r;
    }


    /**
     *
     */
    public get ZERO(): U[] {
        return Array.from(this._zero);
    }

    /**
     *
     */
    public get ONE(): U[] {
        return Array.from(this._one);
    }

    /**
     *
     */
    public get NaN(): U[] {
        return this._nan;
    }

    /**
     *
     */
    public normalize(x: ArrayLike<U>): U[] {
        return (Array.isArray(x) ? x : Array.from(x)).map(v => this.field.normalize(v));
    }

    /**
     *
     */
    public isNaN(x: ArrayLike<U>): boolean {
        if (x !== this.NaN) {
            if (x.length === 1 && x[0] === this.field.NaN) return true;
            return false;
        }
        return true;
    }

    /**
     *
     */
    public eq(x: ArrayLike<U>, y: ArrayLike<U>): boolean {
        if (this.isNaN(x) || this.isNaN(y)) return false;
        const zero = this.field.ZERO;
        const len = Math.max(x.length, y.length);
        for (let i = 0; i < len; i++) {
            if (! this.field.eq(
                x[i] !== void(0) ? x[i] : zero,
                y[i] !== void(0) ? y[i] : zero)) return false;
        }
        return true;
    }

    /**
     *
     */
    public noteq(x: ArrayLike<U>, y: ArrayLike<U>): boolean {
        return !this.eq(x, y);
    }

    /**
     *
     */
    public neg(x: ArrayLike<U>): U[] {
        const r: U[] = [];
        for (let i = 0; i < x.length; i++) {
            r[i] = this.field.neg(x[i]);
        }
        return r;
    }

    /**
     *
     */
    public add(x: ArrayLike<U>, y: ArrayLike<U>): U[] {
        const r: U[] = [];
        const zero = this.field.ZERO;
        r.length = Math.max(x.length, y.length);
        for (let i = 0; i < r.length; i++) {
            r[i] = this.field.add(
                x[i] !== void(0) ? x[i] : zero,
                y[i] !== void(0) ? y[i] : zero);
        }
        return r;
    }

    /**
     *
     */
    public sub(x: ArrayLike<U>, y: ArrayLike<U>): U[] {
        const r: U[] = [];
        const zero = this.field.ZERO;
        r.length = Math.max(x.length, y.length);
        for (let i = 0; i < r.length; i++) {
            r[i] = this.field.sub(
                x[i] !== void(0) ? x[i] : zero,
                y[i] !== void(0) ? y[i] : zero);
        }
        return r;
    }

    /**
     *
     */
    public mul(x: ArrayLike<U>, y: ArrayLike<U>): U[] {
        const r: U[] = [];
        const zero = this.field.ZERO;
        r.length = x.length + y.length - 1;
        for (let i = 0; i < r.length; i++) {
            r[i] = zero;
        }
        for (let i = 0; i < y.length; i++) {
            for (let j = 0; j < x.length; j++) {
                r[j + i] = this.field.add(r[j + i], this.field.mul(x[j], y[i]));
            }
        }
        return r;
    }

    /**
     *
     */
    public mod(x: WritableArrayLike<U>, y: ArrayLike<U>, extendDividendLength: number = 0): U[] {
        return this.divmod(x, y, extendDividendLength).r;
    }

    /**
     *
     */
    public divmod(x: WritableArrayLike<U>, y: ArrayLike<U>, extendDividendLength: number = 0):
                 {q: U[], r: U[], divisible: boolean} {
        x = Array.from(x);
        const zero = this.field.ZERO;

        if (extendDividendLength > 0) {
            const ext: U[] = [];
            ext.length = extendDividendLength;
            for (let i = 0; i < extendDividendLength; i++) {
                ext[i] = zero;
            }
            x = ext.concat(x as U[]);
        }

        let ylen = y.length;
        for (let i = 0; i < ylen; i++, ylen--) {
            if (y[ylen - 1] !== void(0) &&
                this.field.noteq(y[ylen - 1], zero)) break;
        }
        if (ylen === 0) return {q: this.NaN, r: this.NaN, divisible: false};

        const n: number = x.length - ylen + 1;
        const q: U[] = [];
        q.length = n;
        for (let i = 0; i < n; i++) {
            if (this.field.noteq(x[x.length - 1 - i], zero)) {
                const c = this.field.divmod(x[x.length - 1 - i], y[ylen - 1]);
                q[n - 1 - i] = c.q;
                for (let j = 0; j < ylen - 1; j++) {
                    x[n - 1 - i + j] = this.field.sub(x[n - 1 - i + j], this.field.mul(y[j], c.q));
                }
                x[x.length - 1 - i] = c.r;
            } else {
                x[x.length - 1 - i] = zero;
            }
        }

        let divisible = true;
        const r: U[] = [];
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
    public pow(a: ArrayLike<U>, x: number): U[] {
        throw new Error("not supported operation");
    }

    /**
     *
     */
    public exp(x: number): U[] {
        throw new Error("not supported operation");
    }
}


/**
 *
 */
export class NumberArrayPolynomialRing extends ArrayPolynomialRing<number> {
}
