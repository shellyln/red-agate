// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { FiniteField } from "./Field";


/**
 * GF(2^n) ; Extension Finite Field
 */
export class Gf2Ext implements FiniteField<number> {
    private expDict: number[] = [];
    private  lnDict: number[] = [this.NaN];
    private numElements: number;
    private        mask: number;
    private      maskLo: number;
    private      maskHi: number;

    /**
     *
     */
    constructor(private nth: number = 8, private px: number = 0x011d) {
        let v: number = 1;
        this.numElements = 2 ** nth; // 1 << nth
        this.mask = this.numElements - 1;

        this.expDict.length = this.mask;
        this.lnDict.length  = this.numElements;

        for (let i = 0; i < this.mask; i++) {
            this.expDict[i] = v;
            this.lnDict [v] = i;
            v *= 2;                                 // left shift 1. polynomial multipy by alpha(=2).
            if (v > this.mask) {                    // (v & ~this.mask)
                v = ((v ^ px) & this.mask) >>> 0;
            }
        }
    }

    /**
     * 53bits x & this.mask
     */
    private bitMask(x: number): number {
        x = Math.abs(x);
        const loX = (x & 0xffffffff) >>> 0;
        const hiX = (x - loX) / 4294967296;
        return ((hiX & this.maskHi) >>> 0) * 4294967296 + ((loX & this.maskLo) >>> 0);
    }

    /**
     *
     */
    public checkGenerationResult(): boolean {
        for (let i = 1; i < this.numElements; i++) {
            if (this.lnDict[i] === void(0)) {
                return false;
            }
        }
        return true;
    }


    /**
     * order of this field
     */
    public get MODULO(): number {
        return this.numElements;
    }

    /**
     *
     */
    public get ZERO(): number {
        return 0;
    }

    /**
     *
     */
    public get ONE(): number {
        return 1;
    }

    /**
     *
     */
    public get ALPHA(): number {
        return 2;
    }

    /**
     *
     */
    public get NaN(): number {
        return Number.NaN;
    }


    /**
     *
     */
    public normalize(x: number): number {
        return (x & this.mask) >>> 0;
    }

    /**
     *
     */
    public isNaN(x: number): boolean {
        return Number.isNaN(x);
    }

    /**
     *
     */
    public eq(x: number, y: number): boolean {
        return ((x & this.mask) >>> 0) === ((y & this.mask) >>> 0);
    }

    /**
     *
     */
    public noteq(x: number, y: number): boolean {
        return ((x & this.mask) >>> 0) !== ((y & this.mask) >>> 0);
    }

    /**
     *
     */
    public neg(x: number): number {
        return (x & this.mask) >>> 0;
    }

    /**
     *
     */
    public inv(x: number): number {
        x = (x & this.mask) >>> 0;
        return  (x === 0) ? this.NaN :
            this.expDict[(this.mask - this.lnDict[x]) % this.mask];
    }

    /**
     *
     */
    public add(x: number, y: number): number {
        return ((x ^ y) & this.mask) >>> 0;
    }

    /**
     *
     */
    public sub(x: number, y: number): number {
        return ((x ^ y) & this.mask) >>> 0;
    }

    /**
     *
     */
    public mul(x: number, y: number): number {
        x = (x & this.mask) >>> 0;
        y = (y & this.mask) >>> 0;
        if (x === 0 || y === 0) return 0;
        return this.expDict[(this.lnDict[x] + this.lnDict[y]) % this.mask];
    }

    /**
     *
     */
    public div(x: number, y: number): number {
        x = (x & this.mask) >>> 0;
        y = (y & this.mask) >>> 0;
        if (y === 0) return this.NaN;
        if (x === 0) return 0;
        return this.expDict[
            (this.lnDict[x] + ((this.mask - this.lnDict[y]) % this.mask))
            % this.mask];
    }

    /**
     *
     */
    public mod(x: number, y: number): number {
        return (((y & this.mask) >>> 0) === 0) ? this.NaN : 0;
    }

    /**
     *
     */
    public divmod(x: number, y: number): {q: number, r: number, divisible: boolean} {
        return (((y & this.mask) >>> 0) === 0) ? {
            q: this.NaN,
            r: this.NaN,
            divisible: false
        } : {
            q: this.div(x, y),
            r: 0,
            divisible: true
        };
    }

    /**
     *
     */
    public pow(a: number, x: number): number {
        a = this.normalize(a);
        x = x % this.mask;
        if (a === 0) {
            return (x === 0) ? 1 : 0;
        }
        return (x >= 0)
            ? this.exp(this.ln(a) * x)
            : this.inv(this.exp(this.ln(a) * -x));
    }

    /**
     *
     */
    public log(a: number, x: number): number {
        // y = log(a,pow(a,y))

//        // log(a,x) = ln(x) / ln(a)
//        let p = this.ln(x);
//        let q = this.ln(a);
//        return this.div(p, q); // don't work

        const logDict: number[] = [this.NaN];
        for (let y = 0; y < this.mask; y++) {
            const v = this.pow(a, y);
            if (logDict[v] === void(0)) logDict[v] = y;
        }
        const r = logDict[(x & this.mask) >>> 0];
        return r !== void(0) ? r : this.NaN;
    }

    /**
     *
     */
    public exp(x: number): number {
        return (x >= 0)
            ? this.expDict[x % this.mask]
            : this.inv(this.expDict[-x % this.mask]);
    }

    /**
     *
     */
    public ln(x: number): number {
        return this.lnDict[(x & this.mask) >>> 0];
    }
}



/**
 *
 */
export class Gf2e8Field extends Gf2Ext {
    /**
     *
     */
    constructor(px: number = 0x011d) {
        super(8, px);
    }
}


/**
 *
 */
export class Gf2e6Field extends Gf2Ext {
    /**
     *
     */
    constructor(px: number = 0x0043) {
        super(6, px);
    }
}
