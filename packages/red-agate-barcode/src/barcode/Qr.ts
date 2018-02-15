// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import * as RedAgate          from 'red-agate/modules/red-agate';
import { SvgCanvas,
         SvgTextAttributes,
         TextAlignValue,
         TextBaselineValue }  from 'red-agate-svg-canvas/modules/drawing/canvas/SvgCanvas';
import { Rect2D }             from 'red-agate-svg-canvas/modules/drawing/canvas/TransferMatrix2D';
import { WebColor }           from 'red-agate-svg-canvas/modules/drawing/canvas/WebColor';
import { ShapeProps,
         shapePropsDefault,
         Shape,
         CONTEXT_SVG_CANVAS } from 'red-agate/modules/red-agate/tags/Shape';
import { Gf2e8Field }         from 'red-agate-math/modules/math/Gf2Ext';
import { BCH }                from 'red-agate-math/modules/error-correction/BCH';
import { ReedSolomon }        from 'red-agate-math/modules/error-correction/ReedSolomon';
import { BitStreamWriter }    from 'red-agate-util/modules/io/BitStream';
import { TextEncoding }       from 'red-agate-util/modules/convert/TextEncoding';
import { Bitmap }             from 'red-agate-util/modules/imaging/Bitmap';
import { QrSourceDataTypes,
         QrDataChunkType,
         ecLevelMap,
         numberModeCharMap,
         alnumModeCharMap }   from "./Qr.defs";
import * as qr                from './data/Qr.m2.data';



export interface QrProps extends ShapeProps {
    data?: Array<Uint8Array | string | number> | Uint8Array | string;
    version?: number | "auto";
    ecLevel?: "L" | "M" | "Q" | "H";
    encoding?: "number" | "alnum" | "8bit" | "auto";
    cellSize?: number;
}

export interface QrPropsNoUndefined extends ShapeProps {
    data?: Array<Uint8Array | string | number> | Uint8Array | string;
    version: number | "auto";
    ecLevel: "L" | "M" | "Q" | "H";
    encoding: "number" | "alnum" | "8bit" | "auto";
    cellSize: number;
}

export const qrPropsDefault: QrPropsNoUndefined = Object.assign({}, shapePropsDefault, {
    version: "auto",
    ecLevel: "M",
    encoding: "auto",
    cellSize: 0.33
} as any);



const field = new Gf2e8Field();
let gxList: number[][] = [];

const masks = [
    { index: 0x00, fn: (x: number, y: number) =>   ((x + y) % 2) === 0 },
    { index: 0x01, fn: (x: number, y: number) =>   (     y  % 2) === 0 },
    { index: 0x02, fn: (x: number, y: number) =>   ( x      % 3) === 0 },
    { index: 0x03, fn: (x: number, y: number) =>   ((x + y) % 3) === 0 },
    { index: 0x04, fn: (x: number, y: number) => ((Math.floor(x / 3) + Math.floor(y / 2)) % 2) === 0},
    { index: 0x05, fn: (x: number, y: number) => ( ((x * y) % 2) + (x * y) % 3)      === 0},
    { index: 0x06, fn: (x: number, y: number) => ((((x * y) % 2) + (x * y) % 3) % 2) === 0},
    { index: 0x07, fn: (x: number, y: number) => ((((x * y) % 3) + (x + y) % 2) % 2) === 0}
];



export class Qr extends Shape<QrProps> {
    public constructor(props: QrProps) {
        super(Object.assign({}, qrPropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);

        const data = this.props.data || "";

        const encoded = this.encodeData(data);
        const bitmap  = this.buildBitmap(encoded.data, encoded.version);
        this.drawBitmap(canvas, bitmap);

        return ``;
    }


    protected evaluteMask(bitmap: Bitmap): number {
        const nx = bitmap.width,
              ny = bitmap.height;
        let   z  = 0;
        for (let i = 0; i < ny; i++) {
            let p: number | null = null;
            let c = 1;
            for (let j = 0; j < nx; j++) {
                const q = bitmap.get(j, i);
                if      (p !== q) c  = 1;
                else              c += 1;
                if      (5 === c) z += 3;
                else if (5   < c) z += 1;
                p = q;
            }
        }
        for (let i = 0; i < nx; i++) {
            let p: number | null = null;
            let c = 1;
            for (let j = 0; j < ny; j++) {
                const q = bitmap.get(i, j);
                if      (p !== q) c  = 1;
                else              c += 1;
                if      (5 === c) z += 3;
                else if (5   < c) z += 1;
                p = q;
            }
        }
        for (let i = 0; i < (ny - 1); i++) {
            for (let j = 0; j < (nx - 1); j++) {
                const v = bitmap.get(j, i);
                if (v === bitmap.get(j + 1, i    ) &&
                    v === bitmap.get(j    , i + 1) &&
                    v === bitmap.get(j + 1, i + 1)) {
                    z += 3;
                }
            }
        }
        for (let i = 0; i < ny; i++) {
            for (let j = 0; j < (nx - 10); j++) {
                if (bitmap.get(j     , i) !== 0 &&
                    bitmap.get(j +  1, i) === 0 &&
                    bitmap.get(j +  2, i) !== 0 &&
                    bitmap.get(j +  3, i) !== 0 &&
                    bitmap.get(j +  4, i) !== 0 &&
                    bitmap.get(j +  5, i) === 0 &&
                    bitmap.get(j +  6, i) !== 0 &&
                    bitmap.get(j +  7, i) === 0 &&
                    bitmap.get(j +  8, i) === 0 &&
                    bitmap.get(j +  9, i) === 0 &&
                    bitmap.get(j + 10, i) === 0) {
                    z += 40;
                } else if (
                    bitmap.get(j     , i) === 0 &&
                    bitmap.get(j +  1, i) === 0 &&
                    bitmap.get(j +  2, i) === 0 &&
                    bitmap.get(j +  3, i) === 0 &&
                    bitmap.get(j +  4, i) !== 0 &&
                    bitmap.get(j +  5, i) === 0 &&
                    bitmap.get(j +  6, i) !== 0 &&
                    bitmap.get(j +  7, i) !== 0 &&
                    bitmap.get(j +  8, i) !== 0 &&
                    bitmap.get(j +  9, i) === 0 &&
                    bitmap.get(j + 10, i) !== 0) {
                    z += 40;
                }
            }
        }
        for (let i = 0; i < nx; i++) {
            for (let j = 0; j < (ny - 10); j++) {
                if (bitmap.get(i, j     ) !== 0 &&
                    bitmap.get(i, j +  1) === 0 &&
                    bitmap.get(i, j +  2) !== 0 &&
                    bitmap.get(i, j +  3) !== 0 &&
                    bitmap.get(i, j +  4) !== 0 &&
                    bitmap.get(i, j +  5) === 0 &&
                    bitmap.get(i, j +  6) !== 0 &&
                    bitmap.get(i, j +  7) === 0 &&
                    bitmap.get(i, j +  8) === 0 &&
                    bitmap.get(i, j +  9) === 0 &&
                    bitmap.get(i, j + 10) === 0) {
                    z += 40;
                } else if (
                    bitmap.get(i, j     ) === 0 &&
                    bitmap.get(i, j +  1) === 0 &&
                    bitmap.get(i, j +  2) === 0 &&
                    bitmap.get(i, j +  3) === 0 &&
                    bitmap.get(i, j +  4) !== 0 &&
                    bitmap.get(i, j +  5) === 0 &&
                    bitmap.get(i, j +  6) !== 0 &&
                    bitmap.get(i, j +  7) !== 0 &&
                    bitmap.get(i, j +  8) !== 0 &&
                    bitmap.get(i, j +  9) === 0 &&
                    bitmap.get(i, j + 10) !== 0) {
                    z += 40;
                }
            }
        }
        let white = 0, black = 0;
        for (let i = 0; i < ny; i++) {
            for (let j = 0; j < nx; j++) {
                if (bitmap.get(j, i) === 0) { white++; }
                else                        { black++; }
            }
        }
        z += Math.floor(Math.abs((black / (white + black)) * 100 - 50) / 5) * 10;
        return z;
    }


    protected encodeNumberData(data: string): {data: BitStreamWriter, charLength: number} | null {
        const length = Math.ceil(data.length * 10 / 24);
        const buf = new BitStreamWriter(length);

        let i = 0, v = 0;
        for (; i < data.length; i++) {
            const c = numberModeCharMap.get(data[i]);
            if (c === void 0) return null;
            v = v * 10 + c;
            if (2 === (i % 3)) {
                // 10 bits
                buf.writeBits(v, 10);
                v = 0;
            }
        }
        i = i % 3;
        if (i) {
            // i is  1: 4bits, 2: 7bits
            buf.writeBits8(v, 1 + 3 * i);
        }
        return {data: buf, charLength: data.length};
    }

    protected encodeAlnumData(data: string): {data: BitStreamWriter, charLength: number} | null {
        const length = Math.ceil(data.length * 11 / 16);
        const buf = new BitStreamWriter(length);

        let i = 0, v = 0;
        for (; i < data.length; i++) {
            const c = alnumModeCharMap.get(data[i]);
            if (c === void 0) return null;
            v = v * 45 + c;
            if (1 === (i % 2)) {
                // 11 bits
                buf.writeBits(v, 11);
                v = 0;
            }
        }
        if (i % 2) {
            buf.writeBits8(v, 6);
        }
        return {data: buf, charLength: data.length};
    }

    protected encode8bitData(data: string): {data: BitStreamWriter, charLength: number} {
        const buf = new BitStreamWriter(0, TextEncoding.encodeToUtf8(data));
        return {data: buf, charLength: buf.byteLength};
    }

    protected encodeChunks(data: QrSourceDataTypes[] | QrSourceDataTypes): Array<{
                                  type: QrDataChunkType, data: BitStreamWriter, charLength: number }> {

        if (!Array.isArray(data)) {
            data = [data];
        }

        const chunks: Array<{type: QrDataChunkType, data: BitStreamWriter, charLength: number}> = [];

        for (const d of data) {
            if (d instanceof BitStreamWriter) chunks.push({type: QrDataChunkType.Binary, data: d, charLength: d.byteLength});
            else if (d instanceof Uint8Array) chunks.push({type: QrDataChunkType.Binary, data: new BitStreamWriter(0, d), charLength: d.length});
            else if (typeof d === "string") {
                let chunk: {data: BitStreamWriter, charLength: number} | null = null;
                let type: QrDataChunkType;
                let isManual = true;
                switch (this.props.encoding) {
                case "auto":
                    isManual = false;
                case "number":
                    chunk = this.encodeNumberData(d);
                    type = QrDataChunkType.Number;
                    if (isManual || chunk) break;
                case "alnum":
                    chunk = this.encodeAlnumData(d);
                    type = QrDataChunkType.Alnum;
                    if (isManual || chunk) break;
                case "8bit": default:
                    chunk = this.encode8bitData(d);
                    type = QrDataChunkType.Binary;
                    break;
                }
                if (chunk === null) {
                    throw new Error("QrModel2: character is out of range.");
                }
                chunks.push({type, data: chunk.data, charLength: chunk.charLength});
            }
            else if (typeof d === "number") {
                // TODO: not imple
            }
        }

        return chunks;
    }

    protected determineSymbolVersion(chunks: Array<{type: QrDataChunkType, data: BitStreamWriter}>):
        { version: number, segments: number[][], dataLength: number, maxDataLength: number } {

        let version = this.props.version === "auto" ? 1 : (this.props.version || 1);
        let segments: number[][];
        let maxDataLength: number = 0;
        let dataLength: number = 0;

        while (true) {
            dataLength = 0;

            for (const c of chunks) {
                switch (c.type) {
                case QrDataChunkType.Number:
                    if      (version < 10) dataLength += 14;
                    else if (version < 27) dataLength += 16;
                    else                   dataLength += 18;
                    break;
                case QrDataChunkType.Alnum:
                    if      (version < 10) dataLength += 13;
                    else if (version < 27) dataLength += 15;
                    else                   dataLength += 17;
                    break;
                case QrDataChunkType.Binary:
                    if      (version < 10) dataLength += 12;
                    else                   dataLength += 20;
                    break;
                }
                dataLength += c.data.bitLength;
            }

            switch (this.props.ecLevel) {
            case "L":
                segments = qr.segments[version].L;
                maxDataLength = 8 * qr.dataCodewords.L[version];
                break;
            case "Q":
                segments = qr.segments[version].Q;
                maxDataLength = 8 * qr.dataCodewords.Q[version];
                break;
            case "H":
                segments = qr.segments[version].H;
                maxDataLength = 8 * qr.dataCodewords.H[version];
                break;
            case "M": default:
                segments = qr.segments[version].M;
                maxDataLength = 8 * qr.dataCodewords.M[version];
                break;
            }

            // check total length
            if (dataLength <= maxDataLength) {
                break;
            }
            if (this.props.version !== "auto" || !qr.segments[++version]) {
                throw new Error("QrModel2: data is too large.");
            }
        }

        return { version, segments, dataLength, maxDataLength };
    }


    protected encodeData(data: QrSourceDataTypes[] | QrSourceDataTypes): {
            version: number, data: Uint8Array, ecLevel: "L" | "M" | "Q" | "H" } {

        // determine chunks' encoding, and encoding data.
        const chunks = this.encodeChunks(data);

        // determine symbol's version.
        const { version, segments, dataLength, maxDataLength } = this.determineSymbolVersion(chunks);

        // convert chunks to QR data structure bit stream
        let bytes: Uint8Array;
        {
            const bits: BitStreamWriter[] = [];

            // make global headers.

            // build data from chunks.
            for (const c of chunks) {
                let n = 0;
                const header = new BitStreamWriter(3);

                switch (c.type) {
                case QrDataChunkType.Number:
                    header.writeBits8(1, 4);
                    if      (version < 10) n = 10;
                    else if (version < 27) n = 12;
                    else                   n = 14;
                    header.writeBits(c.charLength, n);
                    break;
                case QrDataChunkType.Alnum:
                    header.writeBits8(2, 4);
                    if      (version < 10) n =  9;
                    else if (version < 27) n = 11;
                    else                   n = 13;
                    header.writeBits(c.charLength, n);
                    break;
                case QrDataChunkType.Binary:
                    header.writeBits8(4, 4);
                    if      (version < 10) n =  8;
                    else                   n = 16;
                    header.writeBits(c.charLength, n);
                    break;
                }

                if (0 < header.bitLength) bits.push(header);
                bits.push(c.data);
            }

            // make global footers.

            // finalize data.
            // if data bits and codewords are remained, add terminator, padding bits, padding codewords.
            if (dataLength < maxDataLength) {
                let rem = maxDataLength - dataLength;
                const fin = new BitStreamWriter(Math.ceil(rem / 8));

                // terminator
                let len = Math.min(4, rem);
                fin.writeBits8(0, len);
                rem -= len;

                // padding bits
                if ((0 < rem) && (0 !== (rem % 8))) {
                    len = rem % 8;
                    fin.writeBits8(0, len);
                    rem -= len;
                }

                // padding codewords
                for (let i = 0; 0 < rem; i++) {
                    len = Math.min(8, rem);
                    fin.writeBits8(0 === (i % 2) ? 0x00ec : 0x0011, len);
                    rem -= len;
                }

                bits.push(fin);
            }

            bytes = BitStreamWriter.concat(...bits).toBytes();
        }

        // make data codewords, generate error correction codewords.
        let totalLength = 0;
        const dataCwStack: Uint8Array[] = [];
        const   ecCwStack: Uint8Array[] = [];
        for (let i = 0, p = 0; i < segments.length; i++) {
            const repeats    = segments[i][0];
            const dataCwSize = segments[i][2];
            const ecCwSize   = segments[i][1] - dataCwSize;

            let gx: number[];
            if (gxList.length <= (ecCwSize - 1)) {
                gxList = ReedSolomon.listGx(field, gxList, ecCwSize, 0);
            }
            gx = gxList[ecCwSize - 1];
            const rs = new ReedSolomon(field, gx, 0);

            for (let j = 0; j < repeats; j++) {
                const dataCodewords = bytes.slice(p, p + dataCwSize).reverse();
                const ecCodewords   = Uint8Array.from(rs.encode(dataCodewords));
                dataCwStack.push(dataCodewords.reverse());
                ecCwStack  .push(ecCodewords.reverse());
                totalLength += dataCwSize + ecCwSize;
                p += dataCwSize;
            }
        }

        // interleaving codewords.
        const codewords = new Uint8Array(totalLength);
        {
            const stacks = [dataCwStack, ecCwStack];
            let p = 0;
            for (const stack of stacks) {
                for (let i = 0, z = true; z; i++) {
                    z = false;
                    for (let j = 0; j < stack.length; j++) {
                        if (i < stack[j].length) {
                            codewords[p++] = stack[j][i];
                            z = true;
                        }
                    }
                }
            }
        }

        const props = this.props as QrPropsNoUndefined;
        return { data: codewords, version, ecLevel: props.ecLevel };
    }

    protected applyMask(bitmap: Bitmap, funcPatternsMap: Bitmap, fn: (x: number, y: number) => boolean) {
        const nx = bitmap.width,
              ny = bitmap.width;

        for (let x = 0; x < nx; x++) {
            for (let y = 0; y < ny; y++) {
                if (0 === funcPatternsMap.get(nx - 1 - x, ny - 1 - y)) {
                    bitmap.set(nx - 1 - x, ny - 1 - y, bitmap.get(nx - 1 - x, ny - 1 - y) ^ (fn(x, y) ? 1 : 0));
                }
            }
        }
    }

    protected buildBitmap(data: Uint8Array, version: number): Bitmap {
        const width = qr.matrixSize[version];
        const nx = width,
              ny = width;
        const bitmap = new Bitmap(width, width);
        const funcPatternsMap = new Bitmap(width, width);

        {
            {
                // finder patterns + format info
                funcPatternsMap.fill(     0, ny - 9, 8, 9, 1);
                funcPatternsMap.fill(nx - 9,      0, 9, 8, 1);
                funcPatternsMap.fill(nx - 9, ny - 9, 9, 9, 1);

                // timing pattern
                funcPatternsMap.fill(     8, ny - 7, nx - 17,       1, 1);
                funcPatternsMap.fill(nx - 7,      8,       1, ny - 17, 1);

                // version info
                if (7 <= version) {
                    funcPatternsMap.fill(     8, ny - 6, 3, 6, 1);
                    funcPatternsMap.fill(nx - 6,      8, 6, 3, 1);
                }
            }

            // finder patterns
            for (const {px, py} of [{px: nx - 7, py: ny - 7}, {px: 0, py: ny - 7}, {px: nx - 7, py: 0}]){
                bitmap.set(px + 0, py + 0, 1);
                bitmap.set(px + 0, py + 1, 1);
                bitmap.set(px + 0, py + 2, 1);
                bitmap.set(px + 0, py + 3, 1);
                bitmap.set(px + 0, py + 4, 1);
                bitmap.set(px + 0, py + 5, 1);
                bitmap.set(px + 0, py + 6, 1);
                bitmap.set(px + 1, py + 0, 1);
                bitmap.set(px + 2, py + 0, 1);
                bitmap.set(px + 3, py + 0, 1);
                bitmap.set(px + 4, py + 0, 1);
                bitmap.set(px + 5, py + 0, 1);
                bitmap.set(px + 6, py + 0, 1);
                bitmap.set(px + 6, py + 1, 1);
                bitmap.set(px + 6, py + 2, 1);
                bitmap.set(px + 6, py + 3, 1);
                bitmap.set(px + 6, py + 4, 1);
                bitmap.set(px + 6, py + 5, 1);
                bitmap.set(px + 1, py + 6, 1);
                bitmap.set(px + 2, py + 6, 1);
                bitmap.set(px + 3, py + 6, 1);
                bitmap.set(px + 4, py + 6, 1);
                bitmap.set(px + 5, py + 6, 1);
                bitmap.set(px + 6, py + 6, 1);

                bitmap.set(px + 2, py + 2, 1);
                bitmap.set(px + 2, py + 3, 1);
                bitmap.set(px + 2, py + 4, 1);
                bitmap.set(px + 3, py + 2, 1);
                bitmap.set(px + 4, py + 2, 1);
                bitmap.set(px + 4, py + 3, 1);
                bitmap.set(px + 4, py + 4, 1);
                bitmap.set(px + 3, py + 4, 1);
                bitmap.set(px + 3, py + 3, 1);
            }

            // timing pattern
            for (let i = 8; i <= ny - 9; i += 2) {
                bitmap.set(nx - 7, i, 1);
                bitmap.set(i, ny - 7, 1);
            }

            // alignment patterns
            const aps = qr.alignmentPatterns[version];
            for (let i = 0; i < aps.length; i++) {
                const a = nx - aps[i] - 1;
                for (let j = 0; j < aps.length; j++) {
                    const b = ny - aps[j] - 1;
                    let q = true;
                    for (let x = (a - 2); x <= (a + 2); x++) {
                        for (let y = (b - 2); y <= (b + 2); y++) {
                            if (funcPatternsMap.get(x, y)) {
                                q = false;
                                break;
                            }
                        }
                        if (!q) break;
                    }
                    if (q) {
                        funcPatternsMap.fill(a - 2, b - 2, 5, 5, 1);

                        bitmap.set(a - 2, b + 2, 1);
                        bitmap.set(a - 2, b + 1, 1);
                        bitmap.set(a - 2, b    , 1);
                        bitmap.set(a - 2, b - 1, 1);
                        bitmap.set(a - 2, b - 2, 1);
                        bitmap.set(a + 2, b + 2, 1);
                        bitmap.set(a + 2, b + 1, 1);
                        bitmap.set(a + 2, b    , 1);
                        bitmap.set(a + 2, b - 1, 1);
                        bitmap.set(a + 2, b - 2, 1);
                        bitmap.set(a + 1, b - 2, 1);
                        bitmap.set(a + 1, b + 2, 1);
                        bitmap.set(a    , b + 2, 1);
                        bitmap.set(a    , b    , 1);
                        bitmap.set(a    , b - 2, 1);
                        bitmap.set(a - 1, b - 2, 1);
                        bitmap.set(a - 1, b + 2, 1);
                    }
                }
            }
        }

        // place codewords
        {
            let cx =  1;
            let cy = -1;
            let b2t =  true; // bottom to top
            let odd = false;

            for (let i = 0; i < data.length; i++) {
                for (let j = 7; j >= 0; j--) {
                    for (; ; ) {
                        if (odd) {
                            cx += 1;
                        } else if ((((ny - 1) === cy) && b2t) || ((0 === cy) && (!b2t))) {
                            if (cx === (nx - 8)) cx += 2;
                            else                 cx += 1;
                            b2t = !b2t;
                        } else {
                            cx -= 1;
                            if (b2t) cy += 1;
                            else     cy -= 1;
                        }
                        odd = !odd;

                        // determine
                        if (0 === funcPatternsMap.get(cx, cy)) {
                            bitmap.set(cx, cy, (data[i] >>> j) & 0x01);
                            break;
                        } else {
                            continue;
                        }
                    }
                }
            }
        }

        // place version info
        if (7 <= version) {
            // gx=0x1f25 BCH Code is built on GF(2^4). but BCH#encode() is not use arithmetic on GF.
            const vi = ((version << 12) | new BCH(field, 0x1f25).encode(version));

            bitmap.set(nx - 1, 10, (vi >>>  0) & 1);
            bitmap.set(nx - 1,  9, (vi >>>  1) & 1);
            bitmap.set(nx - 1,  8, (vi >>>  2) & 1);
            bitmap.set(nx - 2, 10, (vi >>>  3) & 1);
            bitmap.set(nx - 2,  9, (vi >>>  4) & 1);
            bitmap.set(nx - 2,  8, (vi >>>  5) & 1);
            bitmap.set(nx - 3, 10, (vi >>>  6) & 1);
            bitmap.set(nx - 3,  9, (vi >>>  7) & 1);
            bitmap.set(nx - 3,  8, (vi >>>  8) & 1);
            bitmap.set(nx - 4, 10, (vi >>>  9) & 1);
            bitmap.set(nx - 4,  9, (vi >>> 10) & 1);
            bitmap.set(nx - 4,  8, (vi >>> 11) & 1);
            bitmap.set(nx - 5, 10, (vi >>> 12) & 1);
            bitmap.set(nx - 5,  9, (vi >>> 13) & 1);
            bitmap.set(nx - 5,  8, (vi >>> 14) & 1);
            bitmap.set(nx - 6, 10, (vi >>> 15) & 1);
            bitmap.set(nx - 6,  9, (vi >>> 16) & 1);
            bitmap.set(nx - 6,  8, (vi >>> 17) & 1);

            bitmap.set(10, ny - 1, (vi >>>  0) & 1);
            bitmap.set( 9, ny - 1, (vi >>>  1) & 1);
            bitmap.set( 8, ny - 1, (vi >>>  2) & 1);
            bitmap.set(10, ny - 2, (vi >>>  3) & 1);
            bitmap.set( 9, ny - 2, (vi >>>  4) & 1);
            bitmap.set( 8, ny - 2, (vi >>>  5) & 1);
            bitmap.set(10, ny - 3, (vi >>>  6) & 1);
            bitmap.set( 9, ny - 3, (vi >>>  7) & 1);
            bitmap.set( 8, ny - 3, (vi >>>  8) & 1);
            bitmap.set(10, ny - 4, (vi >>>  9) & 1);
            bitmap.set( 9, ny - 4, (vi >>> 10) & 1);
            bitmap.set( 8, ny - 4, (vi >>> 11) & 1);
            bitmap.set(10, ny - 5, (vi >>> 12) & 1);
            bitmap.set( 9, ny - 5, (vi >>> 13) & 1);
            bitmap.set( 8, ny - 5, (vi >>> 14) & 1);
            bitmap.set(10, ny - 6, (vi >>> 15) & 1);
            bitmap.set( 9, ny - 6, (vi >>> 16) & 1);
            bitmap.set( 8, ny - 6, (vi >>> 17) & 1);
        }

        // masking
        let maskNo = 0;
        {
            let maskScore = Number.MAX_SAFE_INTEGER;

            // for each mask procs
            for (const mask of masks) {
                // mask
                this.applyMask(bitmap, funcPatternsMap, mask.fn);

                // calculate score
                const score = this.evaluteMask(bitmap);
                if (score < maskScore) {
                    maskNo = mask.index;
                    maskScore = score;
                }

                // unmask
                this.applyMask(bitmap, funcPatternsMap, mask.fn);
            }

            // mask
            this.applyMask(bitmap, funcPatternsMap, masks[maskNo].fn);
        }

        // place format info
        {
            const props = this.props as QrPropsNoUndefined;
            const ecLevel = ecLevelMap.get(props.ecLevel);
            if (ecLevel === void 0) {
                throw new Error(`Qr#buildBitmap: bad ecLevel '${props.ecLevel}' is specified.`);
            }
            let fi = (ecLevel << 3) | masks[maskNo].index;

            // gx=0x0537 BCH Code is built on GF(2^4). but BCH#encode() is not use arithmetic on GF.
            fi = ((fi << 10) | new BCH(field, 0x0537).encode(fi)) ^ 0x5412;

            for (let i = 0; i <= 7; i++) {
                bitmap.set(i          , ny - 9, (fi >>> i) & 1);
            }
            {
                bitmap.set(    nx -  8, ny - 9, (fi >>> 8) & 1);
            }
            for (let i = 9; i <= 14; i++) {
                bitmap.set(i + nx - 15, ny - 9, (fi >>> i) & 1);
            }

            for (let i = 0; i <= 5; i++) {
                bitmap.set(nx - 9, ny - 1 - i, (fi >>> i) & 1);
            }
            for (let i = 6; i <= 7; i++) {
                bitmap.set(nx - 9, ny - 2 - i, (fi >>> i) & 1);
            }
            {
                bitmap.set(nx - 9,  7        ,              1);
            }
            for (let i = 8; i <= 14; i++) {
                bitmap.set(nx - 9, 14     - i, (fi >>> i) & 1);
            }
        }

        return bitmap;
    }

    protected drawBitmap(canvas: SvgCanvas, bitmap: Bitmap) {
        // bitmap's coodinate origin is right-bottom.
        const nx = bitmap.width,
              ny = bitmap.height;

        for (let i = 0; i < nx; i++) {
            for (let j = 0; j < ny; j++) {
                if (bitmap.get(i, j)) canvas.rect(nx - 1 - i, ny - 1 - j, 1, 1);
            }
        }

        canvas.fill();
    }
}
