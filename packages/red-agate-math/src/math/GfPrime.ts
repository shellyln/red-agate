// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { FiniteField } from "./Field";


/**
 * GF(p) ; Prime Finite Field
 */
export class GfPrime implements FiniteField<number> {
    private expDict: number[] = [];
    private  lnDict: number[] = [this.NaN];

    /**
     *
     */
    constructor(private prime: number, private alpha: number = 3) {
        let v: number = 1;
        for (let i = 0; i < prime - 1; i++) {
            this.expDict[i] = v;
            this.lnDict [v] = i;
            v = (v * alpha) % prime;
        }
    }

    /**
     *
     */
    public checkGenerationResult(): boolean {
        for (let i = 1; i < this.prime; i++) {
            if (this.lnDict[i] === void(0)) return false;
        }
        return true;
    }


    /**
     * order of this field
     */
    public get MODULO(): number {
        return this.prime;
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
        return this.alpha;
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
        return (x < 0 ? this.prime - (-x % this.prime) : x) % this.prime;
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
        return this.normalize(x) === this.normalize(y);
    }

    /**
     *
     */
    public noteq(x: number, y: number): boolean {
        return this.normalize(x) !== this.normalize(y);
    }

    /**
     *
     */
    public neg(x: number): number {
        return (this.prime - (x % this.prime)) % this.prime;
    }

    /**
     *
     */
    public inv(x: number): number {
        x = this.normalize(x);
        return (x === 0) ? this.NaN
          : this.expDict[(this.prime - 1 - this.ln(x)) % (this.prime - 1)];
    }

    /**
     *
     */
    public inv_withoutTable(x: number): number {
        x = this.normalize(x);
        if (x === 0) return this.NaN;
        let v: number = 1; // make  1/x (mod P)
        for (let i = 0; i < this.prime; i++) {
            if ((v % x) === 0) return (v / x) % this.prime;
            v = v + this.prime;
        }
        return this.NaN;
    }

    /**
     *
     */
    public add(x: number, y: number): number {
        return (this.normalize(x) + this.normalize(y)) % this.prime;
    }

    /**
     *
     */
    public sub(x: number, y: number): number {
        return this.normalize(this.normalize(x) - this.normalize(y));
    }

    /**
     *
     */
    public mul(x: number, y: number): number {
        return (this.normalize(x) * this.normalize(y)) % this.prime;
    }

    /**
     *
     */
    public div(x: number, y: number): number {
        return (this.normalize(x) * this.inv(y)) % this.prime;
    }

    /**
     *
     */
    public mod(x: number, y: number): number {
        return ((y % this.prime) === 0) ? this.NaN : 0;
    }

    /**
     *
     */
    public divmod(x: number, y: number): {q: number, r: number, divisible: boolean} {
        return ((y % this.prime) === 0) ? {
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
        x = x % (this.prime - 1);
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
    public pow_withoutTable(a: number, x: number): number {
        a = this.normalize(a);
        x = x % (this.prime - 1);
        if (a === 0) {
            return (x === 0) ? 1 : 0;
        }
        return (x >= 0)
            ? this.exp_withoutTable(this.ln_withoutTable(a) * x)
            : this.inv_withoutTable(this.exp_withoutTable(this.ln(a) * -x));
    }

    /**
     *
     */
    public log(a: number, x: number): number {
        // y = log(a,pow(a,y))
        const logDict: number[] = [this.NaN];
        for (let y = 0; y < this.prime - 1; y++) {
            const v = this.pow(a, y);
            if (logDict[v] === void(0)) logDict[v] = y;
        }

        const r = logDict[this.normalize(x)];
        return r !== void(0) ? r : this.NaN;
    }

    /**
     *
     */
    public log_withoutTable(a: number, x: number): number {
        // log(a,x) = ln(x) / ln(a)
        let p = this.ln_withoutTable(x);
        const q = this.ln_withoutTable(a);
        if (this.isNaN(p) || this.isNaN(q)) return this.NaN;
        for (let i = 0; i < this.prime; i++) {
            if ((p % q) === 0) return (p / q) % this.prime;
            p = p + this.prime - 1; // on GF(P):  alpha^x = alpha^(x + P - 1)
        }
        return this.NaN;
    }

    /**
     *
     */
    public exp(x: number): number {
        return (x >= 0)
            ? this.expDict[x % (this.prime - 1)]
            : this.inv(this.expDict[-x % (this.prime - 1)]);
    }

    /**
     *
     */
    public exp_withoutTable(x: number): number {
        return (x >= 0)
            ? Math.pow(this.alpha, x % (this.prime - 1)) % this.prime
            : this.inv_withoutTable(Math.pow(this.alpha, -x % (this.prime - 1)));
    }

    /**
     *
     */
    public ln(x: number): number {
        return this.lnDict[this.normalize(x)];
    }

    /**
     *
     */
    public ln_withoutTable(x: number): number {
        x = this.normalize(x);
        if (x === 0) return this.NaN;
        let v: number = 1;
        for (let i = 0; i < this.prime - 1; i++) {
            if (x === v) return i;
            v = (v * this.alpha) % this.prime;
        }
        return this.NaN;
    }
}
