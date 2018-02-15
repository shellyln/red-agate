// src/convert/TextEncoding.ts#__encodeToUtf8Impl
//
// Original Author:
// http://qiita.com/ukyo/items/1626defd020b2157e6bf
// (c) 2012 ukyo (http://qiita.com/ukyo, https://ukyoweb.com)

// src/convert/TextEncoding.ts#__decodeUtf8Impl
//
// Original Author:
// http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
// utf.js - UTF-8 <=> UTF-16 convertion
// Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
// Version: 1.0
// LastModified: Dec 25 1999
// This library is free.  You can redistribute it and/or modify it.

// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



interface TextEncoder {
    encoding: string; // readonly
    encode(input?: string): Uint8Array;
}

declare var TextEncoder: {
    prototype: TextEncoder;
    new (utfLabel?: string): TextEncoder;
};


interface TextDecoder {
    encoding: string;
    fatal: boolean;
    ignoreBOM: boolean;
    decode(input?: any, options?: object): string;
}

declare var TextDecoder: {
    prototype: TextDecoder;
    new (label?: string, options?: object): TextDecoder;
};



export class TextEncoding {
    private static isNode: boolean;
    private static isTextEncoder: boolean;
    private static utf8Encoder: TextEncoder;
    private static utfDecoder: TextDecoder;

    // tslint:disable-next-line:variable-name
    private static __encodeToUtf8: (str: string) => Uint8Array;

    // tslint:disable-next-line:variable-name
    private static __decodeUtf8: (buf: ArrayLike<number>) => string;

    /** static constructor */
    // tslint:disable-next-line:variable-name
    private static __ctor = (() => {
        TextEncoding.isNode = (typeof Buffer !== "undefined");
        TextEncoding.isTextEncoder = (typeof TextEncoder !== "undefined");

        if (TextEncoding.isNode) {
            TextEncoding.__encodeToUtf8 = (str: string) => new Buffer(str, "utf8");
            TextEncoding.__decodeUtf8 = (buf: ArrayLike<number>) => new Buffer(Array.isArray(buf) ? buf : Array.from(buf)).toString("utf8");
        } else if (TextEncoding.isTextEncoder) {
            TextEncoding.utf8Encoder = new TextEncoder("utf8");
            TextEncoding.__encodeToUtf8 = (str: string) => TextEncoding.utf8Encoder.encode(str);
            TextEncoding.utfDecoder = new TextDecoder("utf8");
            TextEncoding.__decodeUtf8 = (buf: ArrayLike<number>) => TextEncoding.utfDecoder.decode(buf);
        } else {
            TextEncoding.__encodeToUtf8 = TextEncoding.__encodeToUtf8Impl;
            TextEncoding.__decodeUtf8 = TextEncoding.__decodeUtf8Impl;
        }
    })();

    public static encodeToUtf8(str: string): Uint8Array {
        return TextEncoding.__encodeToUtf8(str);
    }

    public static decodeUtf8(buf: ArrayLike<number>): string {
        return TextEncoding.__decodeUtf8(buf);
    }

    private static __encodeToUtf8Impl(str: string): Uint8Array {

        // Original Author:
        // http://qiita.com/ukyo/items/1626defd020b2157e6bf
        // (c) 2012 ukyo (http://qiita.com/ukyo, https://ukyoweb.com)

        // NOTE: We have modified from original source.

        const n = str.length;
        let idx = -1,
            byteLength = 512,
            bytes = new Uint8Array(byteLength),
            i: number, c: number;

        for (i = 0; i < n; ++i) {
            // surrogate pairs (U+D800..U+DFFF) should be decoded to U+010000..U+10FFFF
            // before convert to UTF-8.
            const cp = str.codePointAt(i);
            if (cp === void 0) {
                throw new Error("Can't convert string to UTF-8. string include unexpected sequence.");
            }
            c = cp;
            if (c <= 0x7F) {
                bytes[++idx] = c;
            } else if (c <= 0x7FF) {
                bytes[++idx] = 0xC0 | (c >>>  6)         ;
                bytes[++idx] = 0x80 | (c & 0x3F)         ;
            } else if (c <= 0xFFFF) {
                bytes[++idx] = 0xE0 |  (c >>> 12)        ;
                bytes[++idx] = 0x80 | ((c >>>  6) & 0x3F);
                bytes[++idx] = 0x80 |  (c & 0x3F)        ;
            } else if (c <= 0x10FFFF) {
                // UTF-8 4bytes range is (0x010000..0x1FFFFF) but Unicode codepoint uses <= U+10FFFF.
                bytes[++idx] = 0xF0 |  (c >>> 18)        ;
                bytes[++idx] = 0x80 | ((c >>> 12) & 0x3F);
                bytes[++idx] = 0x80 | ((c >>>  6) & 0x3F);
                bytes[++idx] = 0x80 |  (c & 0x3F)        ;
                if (0x010000 <= c) ++i;
            } else {
                throw new Error("Can't convert string to UTF-8. string include unexpected sequence.");
            }
            if (byteLength - idx <= 4) {
                // tslint:disable-next-line:variable-name
                const _bytes = bytes;
                byteLength *= 2;
                bytes = new Uint8Array(byteLength);
                bytes.set(_bytes);
            }
        }
        return bytes.subarray(0, ++idx);
    }

    private static __decodeUtf8Impl(buf: ArrayLike<number>): string {

        // Original Author:
        // http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
        // utf.js - UTF-8 <=> UTF-16 convertion
        // Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
        // Version: 1.0
        // LastModified: Dec 25 1999
        // This library is free.  You can redistribute it and/or modify it.

        // NOTE: We have modified from original source.

        let   out = "", i = 0;
        const len = buf.length;
        let c: number, char2: number, char3: number, char4: number;

        while (i < len) {
            c = buf[i++];
            switch (c >>> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxx xxxx    ( 7bit)
                out += String.fromCodePoint(c);
                break;
            case 12: case 13:
                // 110x xxxx,  10xx xxxx    (11bit)
                char2 = buf[i++];
                out += String.fromCodePoint(
                        ((c     & 0x1F) << 6) |
                         (char2 & 0x3F)
                        );
                break;
            case 14:
                // 1110 xxxx,  10xx xxxx,  10xx xxxx    (16bit)
                char2 = buf[i++];
                char3 = buf[i++];
                out += String.fromCodePoint(
                        ((c     & 0x0F) << 12) |
                        ((char2 & 0x3F) <<  6) |
                        ((char3 & 0x3F) <<  0)
                        );
                break;
            case 16:
                // 1111 0xxx,  10xx xxxx,  10xx xxxx,  10xx xxxx                            (21bit)
                // 1111 10xx,  10xx xxxx,  10xx xxxx,  10xx xxxx,  10xx xxxx                (26bit; invalid Unicode codepoint)
                // 1111 110x,  10xx xxxx,  10xx xxxx,  10xx xxxx,  10xx xxxx,  10xx xxxx    (31bit; invalid Unicode codepoint)
                if ((c >>> 3) & 1) {
                    throw new Error("Can't convert UTF-8 to string. UTF-8 include unexpected sequence.");
                }
                char2 = buf[i++];
                char3 = buf[i++];
                char4 = buf[i++];
                out += String.fromCodePoint(
                        ((c     & 0x07) << 18) |
                        ((char2 & 0x3F) << 12) |
                        ((char3 & 0x3F) <<  6) |
                        ((char4 & 0x3F) <<  0)
                        );
                break;
            }
        }

        return out;
    }
}
