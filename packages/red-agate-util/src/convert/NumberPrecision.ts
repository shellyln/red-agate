// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



/**
 * Number precision / significant figure
 */
export class NumberPrecision {
    public static decimalPlaces(n: number): (v: number) => number {
        return (v: number) => {
            return Number(v.toFixed(6));
        }
    }
}
