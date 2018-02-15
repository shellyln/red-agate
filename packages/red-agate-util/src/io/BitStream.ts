// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { Integer53 } from "../types/Integer53";


export enum StreamSeekOrigin {
    Start, Current, End
}


/** MSB first */
export class BitStreamWriter {
    public static fromBytes(initialSizeBytes: number, bytes: ArrayLike<number>): BitStreamWriter {
        const s = new BitStreamWriter(initialSizeBytes);
        const n = s.byteLength;
        const d = s.data;
        if (n < bytes.length) {
            if (bytes instanceof Uint8Array) {
                s.data.set(bytes.subarray(0, n));
            } else {
                for (let i = 0; i < n; i++) {
                    d[i] = bytes[i];
                }
            }
        } else {
            s.data.set(bytes);
        }
        s.pos = bytes.length * 8;
        return s;
    }

    private data: Uint8Array;
    private pos = 0;

    public constructor(initialSizeBytes: number, data?: Uint8Array) {
        if (data) {
            this.data = data;
            this.pos  = data.length * 8;
        } else {
            this.data = new Uint8Array(initialSizeBytes);
        }
    }

    public writeBits8(v: number, bitLength: number): BitStreamWriter {
        if (0 < bitLength) {
            const p = Math.floor(this.pos / 8);
            const m = this.pos % 8;

            const w = v & (0x00ff >>> (8 - bitLength));
            const s = 8 - m - bitLength;

            this.data[p] &= 0x00ff << (8 - m);
            if (s >= 0) {
                this.data[p] |= w << s;
            } else {
                this.data[p    ] |= w >>> -s;
                this.data[p + 1] &= 0x00ff >>> -s;
                this.data[p + 1] |= w  << (8 + s);
            }

            this.pos += bitLength;
        }
        return this;
    }

    public writeBits(v: number, bitLength: number): BitStreamWriter {
        if (0 < bitLength) {
            let p = Math.floor(this.pos / 8);
            let m = this.pos % 8;
            let l = bitLength;

            const q = (l % 8) || 8;
            const w = Integer53.slice(v, l - q, l);
            const s = 8 - m - q;

            this.data[p] &= 0x00ff << (8 - m);
            if (s >= 0) {
                this.data[p] |= w << s;
                if (s === 0) p += 1;
            } else {
                this.data[p    ] |= w >>> -s;
                this.data[p + 1] &= 0x00ff >>> -s;
                this.data[p + 1] |= w  << (8 + s);
                p += 1;
            }

            l -= q;
            m = (m + q) % 8;

            if (m === 0) {
                // tslint:disable-next-line:ban-comma-operator
                for (; 0 < l; l -= 8, p++) {
                    this.data[p] = Integer53.slice(v, l - 8, l);
                }
            } else {
                // tslint:disable-next-line:ban-comma-operator
                for (; 0 < l; l -= 8, p++) {
                    const w2 = Integer53.slice(v, l - 8, l);
                    this.data[p    ] &= 0x00ff << (8 - m);
                    this.data[p    ] |= w2 >>> m;
                    this.data[p + 1] &= 0x00ff >>> m;
                    this.data[p + 1] |= w2  << (8 - m);
                }
            }

            this.pos += bitLength;
        }
        return this;
    }

    public writeBitsFromArray(bytes: Uint8Array, bitOffset: number, bitLength: number): BitStreamWriter {
        if (0 < bitLength) {
            if ((bitOffset % 8) === 0) {
                const o = bitOffset / 8;
                const n = Math.floor(bitLength / 8);
                const m = bitLength % 8;
                let i = 0;
                if ((this.pos % 8) === 0) {
                    const p = this.pos / 8;
                    if (0 < n) {
                        for (; i < n; i++) {
                            this.data[p + i] = bytes[o + i];
                        }
                    }
                    if (m) {
                        this.data[p + i] &= 0x00ff >>> m;
                        this.data[p + i] |= (bytes[o + i] >>> (8 - m)) << (8 - m);
                    }
                    this.pos += bitLength;
                } else {
                    if (0 < n) {
                        for (; i < n; i++) {
                            this.writeBits8(bytes[o + i], 8);
                        }
                    }
                    this.writeBits8(bytes[o + i] >>> (8 - m), m);
                }
            } else {
                const s1 = Math.floor(bitOffset / 8);
                const e1 = Math.floor((bitOffset + bitLength) / 8);
                const s2 = bitOffset % 8;
                const e2 = (bitOffset + bitLength) % 8;
                if (s1 === e1) {
                    this.writeBits8(bytes[e1] >>> (8 - e2), bitLength);
                } else {
                    this.writeBits8(bytes[s1], 8 - s2);
                    for (let i = s1 + 1; i < e1; i++) {
                        this.writeBits8(bytes[i], 8);
                    }
                    this.writeBits8(bytes[e1] >>> (8 - e2), e2);
                }
            }
        }
        return this;
    }

    public seek(bitOffset: number, offset: StreamSeekOrigin): BitStreamWriter {
        switch (offset) {
        case StreamSeekOrigin.Start:
            this.pos = bitOffset;
            break;
        case StreamSeekOrigin.Current:
            this.pos += bitOffset;
            break;
        case StreamSeekOrigin.End:
            this.pos = this.data.length * 8 + bitOffset;
            break;
        }
        return this;
    }

    public resize(sizeBytes: number): BitStreamWriter {
        if (this.data.length > sizeBytes) {
            this.data = this.data.subarray(0, sizeBytes);
            this.pos  = Math.min(this.pos, sizeBytes * 8);
        } else if (this.data.length < sizeBytes) {
            const d = new Uint8Array(sizeBytes);
            d.set(this.data, 0);
            this.data = d;
        }
        return this;
    }

    public writeAlignedSingleByte(v: number): BitStreamWriter {
        const p = Math.ceil(this.pos / 8);
        this.data[p] = v & 0x00ff;
        this.pos = (p + 1) * 8;
        return this;
    }

    public writeAlignedBytes(bytes: Uint8Array, byteOffset: number, byteLength: number): BitStreamWriter {
        const p = Math.ceil(this.pos / 8);
        for (let i = 0; i < byteLength; i++) {
            this.data[p + i] = bytes[byteOffset + i];
        }
        this.pos = (p + byteLength) * 8;
        return this;
    }

    public toBytes(): Uint8Array {
        return this.data.subarray(0, this.byteLength);
    }

    public get byteLength(): number {
        return Math.ceil(this.pos / 8);
    }

    public get bitLength(): number {
        return this.pos;
    }

    public slice(startBit: number, endBit: number): BitStreamWriter {
        if (endBit < 0) endBit = this.pos + endBit;
        const r = new BitStreamWriter(Math.ceil((endBit - startBit) / 8));
        r.writeBitsFromArray(this.data, startBit, endBit - startBit);
        return r;
    }

    public setBit(i: number, v: number) {
        const p = Math.floor(i / 8);
        const m = i % 8;
        this.data[p] = (this.data[p] & (~(0x0080 >>> m))) | ((v ? 0x0080 : 0) >>> m);
    }

    public getBit(i: number): number {
        const p = Math.floor(i / 8);
        const m = i % 8;
        return (this.data[p] & (0x0080 >>> m)) ? 1 : 0;
    }

    public setByte(i: number, v: number) {
        this.data[i] = v;
    }

    public getByte(i: number): number {
        return this.data[i];
    }

    public concat(...a: BitStreamWriter[]): BitStreamWriter {
        return BitStreamWriter.concat(this, ...a);
    }

    public static concat(...a: BitStreamWriter[]): BitStreamWriter {
        let n = 0;
        for (const b of a) {
            n += b.bitLength;
        }
        const r = new BitStreamWriter(Math.ceil(n / 8));

        for (let i = 0; i < a.length; i++) {
            r.writeBitsFromArray(a[i].data, 0, a[i].bitLength);
        }
        return r;
    }
 }
