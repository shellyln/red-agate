// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



/**
 * Base64 encoder / decoder.
 */
export class Base64 {

    /**
     * Base64 encoder.
     * @param message Plaintext message.
     * @param lineLength The maximum line length of the encoded message. If set, the encoded message is split with a newline character.
     * @return Base64 encoded message.
     */
    public static encode(message: ArrayLike<number>, lineLength?: number): string {
        // A-Z: 0x00 -> 0x41
        // a-z: 0x1a -> 0x61
        // 0-9: 0x34 -> 0x30
        //   +: 0x3e -> 0x2b
        //   /: 0x3f -> 0x2f

        // 0-5/6-3/4-8
        let buf: number[] = [];
        const n = message.length;
        let   v = 0, q = 0, r = 0;

        for (let i = 0, m = 0; i < n; i++) {
            m = i % 3;
            if (m === 0) {
                v = message[i];
                r = (v <<  4) & 0x30;  // 2bit
                v = (v >>> 2) & 0x3f; // 6bit
            }
            else if (m === 1) {
                v = message[i];
                q =  (v <<  2) & 0x3c;        // 4bit
                v = ((v >>> 4) & 0x0f) | r; // 4bit
                r = q;
            }
            else {
                q = message[i];
                v = ((q >>> 6) & 0x03) | r; // 2bit
                if      (v < 0x1a) v += 0x41;
                else if (v < 0x34) v += 0x47;
                else if (v < 0x3e) v -= 0x04;
                else if (v < 0x3f) v  = 0x2b;
                else               v  = 0x2f;
                buf.push(v);
                v = q & 0x3f; // 6bit
            }
            if      (v < 0x1a) v += 0x41;
            else if (v < 0x34) v += 0x47;
            else if (v < 0x3e) v -= 0x04;
            else if (v < 0x3f) v  = 0x2b;
            else               v  = 0x2f;
            buf.push(v);
        }

        if (n % 3) {
            if      (r < 0x1a) r += 0x41;
            else if (r < 0x34) r += 0x47;
            else if (r < 0x3e) r -= 0x04;
            else if (r < 0x3f) r  = 0x2b;
            else               r  = 0x2f;
            buf.push(r);
        }

        while (buf.length % 4) {
            buf.push(0x3d);
        }

        if (lineLength && 0 < lineLength) {
            const s: number[] = [];
            for (let i = 0; i < buf.length; i += lineLength) {
                s.push(...buf.slice(i, i + lineLength), 0x0a);
            }
            buf = s;
        }

        let z = "";

        for (let i = 0; i < buf.length; i++) {
            // NOTE: spread operator (...buf) causes stack overflow.
            z += String.fromCharCode(buf[i]);
        }
        return z;
    }

    /**
     * Base64 decoder.
     * @param message Base64 encoded message.
     * @return Plaintext message.
     */
    public static decode(message: string): number[] {
        const buf: number[] = [];
        let   i = 0, m = 0, s = 0;
        const n = message.length;
        let   v = 0, r = 0;

        for (; i < n; i++) {
            m = (i + s) % 4;
            v = message.charCodeAt(i);
            if      (0x41 <= v && v <= 0x5a) v -= 0x41;
            else if (0x61 <= v && v <= 0x7a) v -= 0x47;
            else if (0x30 <= v && v <= 0x39) v += 0x04;
            else if (v === 0x2b)             v  = 0x3e;
            else if (v === 0x2f)             v  = 0x3f;
            else if (v === 0x3d) {
                v = 0;
                i = n;
            } else {
                s++;
                continue;
            }
            if (m === 0) {
                r = (v << 2) & 0xfc; // 6bit
            }
            else if (m === 1) {
                buf.push(r | ((v >>> 4) & 0x03)); // 2bit
                r = (v << 4) & 0xf0; // 4bit
            }
            else if (m === 2) {
                buf.push(r | ((v >>> 2) & 0x0f)); // 4bit
                r = (v << 6) & 0xc0; // 2bit
            }
            else {
                buf.push(r | (v & 0x3f)); // 6bit
            }
        }
        return buf;
    }

}
