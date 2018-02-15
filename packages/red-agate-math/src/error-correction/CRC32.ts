// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



/**
 *
 */
export class CRC32 {
    private table: number[] = [];

    /**
     *
     */
    constructor(public reversedGx: number = 0x0edb88320) {
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) {
                c = (c & 1) ? (reversedGx ^ (c >>> 1)) : (c >>> 1);
            }
            this.table[i] = c;
        }
    }


    /**
     *
     */
    public calc(message: ArrayLike<number>): number {
        let c = 0x0ffffffff;
        for (let i = 0; i < message.length; i++) {
            c = this.table[(c ^ message[i]) & 0x00ff] ^ (c >>> 8);
        }
        return c ^ 0x0ffffffff;
    }
}
