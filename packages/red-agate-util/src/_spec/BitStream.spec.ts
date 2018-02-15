

import * as ff from "../index";


const primes = [
    1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
    101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197,
    199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313,
    317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439,
    443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571,
    577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691,
    701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829,
    839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977,
    983, 991, 997, ff.Integer53.MAX_INT - 1, ff.Integer53.MAX_INT
];


const primes2 = [
    1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
    101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197,
    199, 211, 223, 227, 229, 233, 239, 241, 251
];


describe("BitStreamWriter", function() {
    it("BitStreamWriter#writeBits", function() {
        let bits = 0;
        const w = new ff.BitStreamWriter(1024);
        for (const p of primes) {
            const n = w.bitLength;
            expect(n).toEqual(bits);

            const len = ff.Integer53.highestBit(p) + 1;
            w.writeBits(p, len);

            let v = 0;
            for (let i = 0; i < len; i++) {
                v *= 2;
                v += w.getBit(n + i);
            }

            expect(p).toEqual(v);
            bits += len;
            expect(w.bitLength).toEqual(bits);
        }
        w.seek(0, ff.StreamSeekOrigin.Start);
        bits = 0;
        for (const p of primes) {
            const n = w.bitLength;
            expect(n).toEqual(bits);

            const len = ff.Integer53.highestBit(p) + 1;
            w.seek(len, ff.StreamSeekOrigin.Current);

            let v = 0;
            for (let i = 0; i < len; i++) {
                v *= 2;
                v += w.getBit(n + i);
            }

            expect(p).toEqual(v);
            bits += len;
            expect(w.bitLength).toEqual(bits);
        }
        w.seek(0, ff.StreamSeekOrigin.Start);
        bits = 0;
        for (const p of primes.slice().reverse()) {
            const n = w.bitLength;
            expect(n).toEqual(bits);

            const len = ff.Integer53.highestBit(p) + 1;
            w.writeBits(p, len);

            let v = 0;
            for (let i = 0; i < len; i++) {
                v *= 2;
                v += w.getBit(n + i);
            }

            expect(p).toEqual(v);
            bits += len;
            expect(w.bitLength).toEqual(bits);
        }
        w.seek(0, ff.StreamSeekOrigin.Start);
        bits = 0;
        for (const p of primes.slice().reverse()) {
            const n = w.bitLength;
            expect(n).toEqual(bits);

            const len = ff.Integer53.highestBit(p) + 1;
            w.seek(len, ff.StreamSeekOrigin.Current);

            let v = 0;
            for (let i = 0; i < len; i++) {
                v *= 2;
                v += w.getBit(n + i);
            }

            expect(p).toEqual(v);
            bits += len;
            expect(w.bitLength).toEqual(bits);
        }
    });
    it("BitStreamWriter#writeBits8", function() {
        const w = new ff.BitStreamWriter(1024);
        let bits = 0;
        for (const p of primes2) {
            const n = w.bitLength;
            expect(n).toEqual(bits);

            const len = ff.Integer53.highestBit(p) + 1;
            w.writeBits8(p, len);

            let v = 0;
            for (let i = 0; i < len; i++) {
                v *= 2;
                v += w.getBit(n + i);
            }

            expect(p).toEqual(v);
            bits += len;
            expect(w.bitLength).toEqual(bits);
        }
        w.seek(0, ff.StreamSeekOrigin.Start);
        bits = 0;
        for (const p of primes2) {
            const n = w.bitLength;
            expect(n).toEqual(bits);

            const len = ff.Integer53.highestBit(p) + 1;
            w.seek(len, ff.StreamSeekOrigin.Current);

            let v = 0;
            for (let i = 0; i < len; i++) {
                v *= 2;
                v += w.getBit(n + i);
            }

            expect(p).toEqual(v);
            bits += len;
            expect(w.bitLength).toEqual(bits);
        }
        w.seek(0, ff.StreamSeekOrigin.Start);
        bits = 0;
        for (const p of primes2.slice().reverse()) {
            const n = w.bitLength;
            expect(n).toEqual(bits);

            const len = ff.Integer53.highestBit(p) + 1;
            w.writeBits8(p, len);

            let v = 0;
            for (let i = 0; i < len; i++) {
                v *= 2;
                v += w.getBit(n + i);
            }

            expect(p).toEqual(v);
            bits += len;
            expect(w.bitLength).toEqual(bits);
        }
        w.seek(0, ff.StreamSeekOrigin.Start);
        bits = 0;
        for (const p of primes2.slice().reverse()) {
            const n = w.bitLength;
            expect(n).toEqual(bits);

            const len = ff.Integer53.highestBit(p) + 1;
            w.seek(len, ff.StreamSeekOrigin.Current);

            let v = 0;
            for (let i = 0; i < len; i++) {
                v *= 2;
                v += w.getBit(n + i);
            }

            expect(p).toEqual(v);
            bits += len;
            expect(w.bitLength).toEqual(bits);
        }
    });
    it("BitStreamWriter#writeBitsFromArray", function() {
        const bytes = new Uint8Array(primes);
        const bytesReverse = bytes.slice().reverse();
        for (let l = 0; l < 18; l++) {
            for (let k = 0; k < 18; k++) {
                const w = new ff.BitStreamWriter(1024);
                for (const ba of [bytes, bytesReverse]) {
                    w.seek(l, ff.StreamSeekOrigin.Start);
                    expect(w.bitLength).toEqual(l);
                    w.writeBitsFromArray(ba, k, ba.length * 8 - k);
                    expect(w.bitLength).toEqual(l + ba.length * 8 - k);
                    const totalBits = w.bitLength;
                    let bits = 0;
                    for (let j = 0; j < ba.length; j++) {
                        let v = 0;
                        for (let i = 0; i < 8; i++) {
                            v *= 2;
                            v += w.getBit(l + bits + i);
                        }

                        const j2 = j + Math.floor(k / 8);
                        const p1 = (j2 < 0) ? 0 : ba[j2];
                        const p2 = (ba.length <= (j2 + 1)) ? 0 : ba[j2 + 1];
                        const p = ((p1 << (k % 8)) | (p2 >>> (8 - (k % 8)))) & 0xff;
                        expect(p).toEqual(v);
                        bits += 8;
                    }
                }
            }
        }
        for (let l = 0; l < 10; l++) {
            for (let k = 0; k < 18; k++) {
                for (let z = 1; z < 56; z++) {
                    const w = new ff.BitStreamWriter(1024);
                    for (const ba of [bytes, bytesReverse]) {
                        w.seek(l, ff.StreamSeekOrigin.Start);
                        expect(w.bitLength).toEqual(l);
                        w.writeBitsFromArray(ba, k, z);
                        expect(w.bitLength).toEqual(l + z);
                        let v = 0;
                        for (let i = 0; i < z; i++) {
                            v *= 2;
                            v += w.getBit(l + i);
                        }

                        const w2 = new ff.BitStreamWriter(1024);
                        w2.writeAlignedBytes(ba, 0, ba.length);
                        let v2 = 0;
                        for (let i = 0; i < z; i++) {
                            v2 *= 2;
                            v2 += w2.getBit(k + i);
                        }
                        expect(v).toEqual(v2, `l=${l},k=${k},z=${z}`);
                    }
                }
            }
        }
    });
});

