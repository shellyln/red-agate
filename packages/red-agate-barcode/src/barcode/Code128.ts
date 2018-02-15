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
import { CONTEXT_SVG_CANVAS } from 'red-agate/modules/red-agate/tags/Shape';
import { BarcodeBaseProps,
         BarcodeBasePropsNoUndefined,
         barcodeBasePropsDefault,
         BarcodeBase }        from './BarcodeBase';
import { charactersMap,
         fullAsciiMap }       from './data/Code128.data';



export interface Code128Props extends BarcodeBaseProps {
    elementWidth?: number;
    useLatin1?: boolean;
    raw?: boolean;
}

export interface Code128PropsNoUndefined extends BarcodeBasePropsNoUndefined {
    elementWidth: number;
    useLatin1: boolean;
    raw: boolean;
}

export const code128PropsDefault: Code128PropsNoUndefined = Object.assign({}, barcodeBasePropsDefault, {
    elementWidth: 0.33,
    useLatin1: false,
    raw: false
});

export class Code128 extends BarcodeBase<Code128Props> {
    public constructor(props: Code128Props) {
        super(Object.assign({}, code128PropsDefault, props), charactersMap);
    }

    protected calcSymbolSize(
        data: string, startChar: string, stopChar: string, cdChar: string
        ): {tw: number, th: number} {
        const props = this.props as Code128PropsNoUndefined;

        // module width (bar + space + gap)
        const mw = props.elementWidth * 11;
        return {
            // total width (quiet + data + start + stop + cd)
            tw: props.quietWidth  * 2 + mw * data.length + props.elementWidth * 13,
            // total height (quiet + bar + text)
            th: props.quietHeight * 2 + props.height + (props.drawText ? props.textHeight : 0)
        };
    }

    protected calcMod103Checksum(data: string): number {
        let v = charactersMap.get(data[0]);
        if (v === void 0) {
            throw new Error("code128: character is out of range.");
        }
        let s = v.index % 103;
        for (let i = 1; i < data.length; i++) {
            v = charactersMap.get(data[i]);
            if (v === void 0) {
                throw new Error("code128: character is out of range.");
            }
            s = (s + v.index * i) % 103;
        }
        return s;
    }

    protected encodeData(data: string):
        {data: string, heightData?: string, labelText?: string, startChar: string, stopChar: string} {

        if (this.props.raw) {
            return {data, startChar: "", stopChar: "\x6A"};
        }

        let d = "";
        let cLimit = 4;
        let mode: number | null = null; // 0: A, 1: B, 2: C
        let scanned = 0;

        const detC = (i: number) => {
            let j = i + 1;
            let continuing = 1;
            for (; j < data.length; j++) {
                const c2 = data.charCodeAt(j);
                if (0x30 <= c2 && c2 <= 0x39) {
                    continuing++;
                } else if (c2 === 0x80) {
                    if (continuing % 2) break;
                } else {
                    break;
                }
            }
            if (j >= data.length && j - i >= 4) {
                return true;
            } else {
                return (j - i >= cLimit) ? true : false;
            }
        };

        const encodeC = (i: number) => {
            // code C
            d += mode === null ? "\x69" : "\x63"; // start / change mode
            let j = i, v = 0, continuing = 0;

            for (; j < data.length; j++) {
                let c2 = data.charCodeAt(j);
                if (0x30 <= c2 && c2 <= 0x39) {
                    v = v * 10 + (c2 - 0x30);
                    continuing++;
                    if (continuing % 2 === 0) {
                        d += String.fromCharCode(v);
                        v = 0;
                    }
                } else {
                    if (this.props.useLatin1 && c2 > 127) {
                        c2 -= 128;
                    }
                    if (c2 === 0x80) {
                        if (continuing % 2) {
                            break;
                        } else {
                            d += "\x66"; // FNC1
                        }
                    } else {
                        break;
                    }
                }
            }
            if (j < data.length || continuing % 2) {
                mode = detAB(j);
                d += mode === 0 ? "\x65" : "\x64";
            }
            if (continuing % 2) {
                const z = fullAsciiMap.get(0x30 + v);
                if (z === void 0) {
                    throw new Error("code128: character is out of range.");
                }
                if (mode === null) {
                    throw new Error("code128: mode === null. Assertion failed.");
                }
                d += z[mode];
            }
            return j;
        };

        const detAB = (i: number) => {
            let cA = 0, cB = 0;
            let j = Math.max(i, scanned);

            for (; j < data.length; j++) {
                let c2 = data.charCodeAt(j);
                if (this.props.useLatin1 && c2 > 127) {
                    c2 -= 128;
                }
                const z = fullAsciiMap.get(c2);
                if (z === void 0) {
                    throw new Error("code128: character is out of range.");
                }
                const bA = z[0];
                const bB = z[1];
                if (bA === void 0 || bB === void 0) {
                    break;
                }
            }
            const N = Math.min(data.length, j + 6);
            for (; j < N; j++) {
                let c2 = data.charCodeAt(j);
                if (this.props.useLatin1 && c2 > 127) {
                    c2 -= 128;
                }
                const z = fullAsciiMap.get(c2);
                if (z === void 0) {
                    throw new Error("code128: character is out of range.");
                }
                const bA = z[0];
                if (bA === void 0) cA++;
                const bB = z[1];
                if (bB === void 0) cB++;
            }
            scanned = j;

            const mode2 = mode === null ? 1 : mode;
            if      (cA < cB) return (cB - cA) < 2 ? mode2 : 0;
            else if (cA > cB) return (cA - cB) < 2 ? mode2 : 1;
            else              return mode2;
        };

        for (let i = 0; i < data.length; ) {
            const ci = data.charCodeAt(i);
            let done = false, latin1 = false;

            if ((0x30 <= ci && ci <= 0x39) ||
                (!this.props.useLatin1 && ci === 0x80) ||
                (this.props.useLatin1 && ci === 0x100)) {

                if (detC(i)) {
                    i = encodeC(i);
                    done = true;
                }
                cLimit = 6;
            }

            if (! done) {
                let c2 = data.charCodeAt(i);
                if (this.props.useLatin1 && c2 > 127) {
                    c2 -= 128;
                    if (128 <= c2 && c2 <= 135) {
                        // FNC1-4, CODE A-C, SHIFT A-B
                        if (c2 === 131) {
                            latin1 = true; // escape FNC4
                        }
                    } else {
                        latin1 = true;
                    }
                }
                const z = fullAsciiMap.get(c2);
                if (z === void 0) {
                    throw new Error("code128: character is out of range.");
                }
                let b = mode !== null ? z[mode] : void 0;
                if (b === void 0) {
                    const newMode = detAB(i);
                    if (mode === newMode) {
                        d += "\x62"; // shift
                        b = z[(mode + 1) % 2];
                    } else {
                        if (mode === null) d += mode === 0 ? "\x67" : "\x68"; // start
                        else               d += mode === 0 ? "\x64" : "\x65"; // change mode
                        mode = newMode;
                        b = z[mode];
                    }
                }
                if (b === null) {
                    throw new Error("code128: character is out of range.");
                }
                if (latin1) {
                    const fnc4 = fullAsciiMap.get(131);
                    if (fnc4 === void 0) {
                        throw new Error("code128: character is out of range.");
                    }
                    if (mode === null) {
                        throw new Error("code128: mode === null. Assertion failed.");
                    }
                    d += fnc4[mode]; // FNC4
                }
                d += b;
                i++;
            }
        }

        d += String.fromCharCode(this.calcMod103Checksum(d));
        return {data: d, startChar: "", stopChar: "\x6A"};
    }

    protected getBarSpaceWidth(): number[] {
        const props = this.props as Code128PropsNoUndefined;

        const w = props.elementWidth;
        return [0, w, w * 2, w * 3, w * 4];
    }
}

