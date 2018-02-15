// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



/**
 *
 */
export class Integer53 {

    public static get MAX_INT() {
        return 0x1fffffffffffff; // Number.MAX_SAFE_INTEGER (== pow(2, 53) - 1)
    }

    public static highestBit(x: number): number {
        x = Math.abs(x);
        for (let i = 52; i >= 0; i--) {
            if (Math.trunc(x / (2 ** i)) > 0) return i;
        }
        return -1;
    }

    /**
     * 53bits x | y
     */
    public static bitOr(x: number, y: number): number {
        x = Math.abs(x);
        y = Math.abs(y);
        const loX = (x & 0xffffffff) >>> 0;
        const hiX = (x - loX) / 4294967296;
        const loY = (y & 0xffffffff) >>> 0;
        const hiY = (y - loY) / 4294967296;
        return ((hiX | hiY) >>> 0) * 4294967296 + ((loX | loY) >>> 0);
    }

    /**
     * 53bits x & y
     */
    public static bitAnd(x: number, y: number): number {
        x = Math.abs(x);
        y = Math.abs(y);
        const loX = (x & 0xffffffff) >>> 0;
        const hiX = (x - loX) / 4294967296;
        const loY = (y & 0xffffffff) >>> 0;
        const hiY = (y - loY) / 4294967296;
        return ((hiX & hiY) >>> 0) * 4294967296 + ((loX & loY) >>> 0);
    }

    /**
     * 53bits x ^ y
     */
    public static bitXor(x: number, y: number): number {
        x = Math.abs(x);
        y = Math.abs(y);
        const loX = (x & 0xffffffff) >>> 0;
        const hiX = (x - loX) / 4294967296;
        const loY = (y & 0xffffffff) >>> 0;
        const hiY = (y - loY) / 4294967296;
        return ((hiX ^ hiY) >>> 0) * 4294967296 + ((loX ^ loY) >>> 0);
    }

    /**
     * 53bits ~x
     */
    public static bitNot(x: number): number {
        x = Math.abs(x);
        const loX = (x & 0xffffffff) >>> 0;
        const hiX = (x - loX) / 4294967296;
        return (((~hiX) & 0x001fffff) >>> 0) * 4294967296 + ((~loX) >>> 0);
    }

    /**
     * 53bits x << s
     */
    public static bitLShift(x: number, s: number): number {
        x = Math.abs(x);
        if (s >= 0) {
            if (s <= 52)  return (x % (2 ** (53 - s))) * (2 ** s);
            else          return 0;
        } else {
            if (s >= -52) return Math.trunc(x / (2 ** -s));
            else          return 0;
        }
    }

    /**
     * 53bits x >>> s
     */
    public static bitRShift(x: number, s: number): number {
        x = Math.abs(x);
        if (s <= 0) {
            if (s >= -52) return (x % (2 ** (53 + s))) * (2 ** -s);
            else          return 0;
        } else {
            if (s <= 52)  return Math.trunc(x / (2 ** s));
            else          return 0;
        }
    }

    /**
     * Slice bits. indexes are LSB first.
     */
    public static slice(x: number, start: number, end: number): number {
        x = Math.abs(x);
        if (end < 0) end += 53;
        if (0 < start) {
            x = Math.trunc(x / (2 ** start));
            end -= start;
        }
        return x % (2 ** end);
    }
}
