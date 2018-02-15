// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { Field } from "./Field";


/**
 * GF(p) ; Real Number Field
 */
export class RealField implements Field<number> {

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
        return Math.E;
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
        return x;
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
        return x === y;
    }

    /**
     *
     */
    public noteq(x: number, y: number): boolean {
        return x !== y;
    }

    /**
     *
     */
    public neg(x: number): number {
        return -x;
    }

    /**
     *
     */
    public inv(x: number): number {
        return 1 / x;
    }

    /**
     *
     */
    public add(x: number, y: number): number {
        return x + y;
    }

    /**
     *
     */
    public sub(x: number, y: number): number {
        return x - y;
    }

    /**
     *
     */
    public mul(x: number, y: number): number {
        return x * y;
    }

    /**
     *
     */
    public div(x: number, y: number): number {
        return x / y;
    }

    /**
     *
     */
    public mod(x: number, y: number): number {
        return x % y;
    }

    /**
     *
     */
    public divmod(x: number, y: number): {q: number, r: number, divisible: boolean} {
        return (y === 0) ? {
            q: this.NaN,
            r: this.NaN,
            divisible: false
        } : {
            q: Math.sign(x) * (Math.abs(x) - Math.abs(x % y)) / y,
            r: x % y,
            divisible: (x % y) === 0
        };
    }

    /**
     *
     */
    public pow(a: number, x: number): number {
        return a ** x;
    }

    /**
     *
     */
    public log(a: number, x: number): number {
        return Math.log(x) / Math.log(a);
    }

    /**
     *
     */
    public exp(x: number): number {
        return Math.exp(x);
    }

    /**
     *
     */
    public ln(x: number): number {
        return Math.log(x);
    }
}
