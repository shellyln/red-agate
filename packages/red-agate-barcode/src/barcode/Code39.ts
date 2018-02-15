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
         reverseMap,
         fullAsciiMap }       from './data/Code39.data';



export interface Code39Props extends BarcodeBaseProps {
    addCheckDigit?: boolean;
    fullAscii?: boolean;
    narrowWidth?: number;
    wideWidth?: number;
    charGapWidth?: number;
}

export interface Code39PropsNoUndefined extends BarcodeBasePropsNoUndefined {
    addCheckDigit: boolean;
    fullAscii: boolean;
    narrowWidth: number;
    wideWidth: number;
    charGapWidth?: number;
}

export const code39PropsDefault: Code39PropsNoUndefined = Object.assign({}, barcodeBasePropsDefault, {
    addCheckDigit: true,
    fullAscii: false,
    narrowWidth: 0.33,
    wideWidth: 0.66,
    charGapWidth: void 0
});

export class Code39 extends BarcodeBase<Code39Props> {
    public constructor(props: Code39Props) {
        super(Object.assign({}, code39PropsDefault, props), charactersMap);
    }

    protected calcSymbolSize(
        data: string, startChar: string, stopChar: string, cdChar: string
        ): {tw: number, th: number} {
        const props = this.props as Code39PropsNoUndefined;

        const gw = props.charGapWidth || props.narrowWidth;
        // module width (bar + space + gap)
        const mw = props.narrowWidth * 6 + props.wideWidth * 3 + gw;
        return {
            // total width (quiet + data + start + stop + cd)
            tw: props.quietWidth  * 2 + mw * (data.length + 2 + (props.addCheckDigit ? 1 : 0)) - gw,
            // total height (quiet + bar + text)
            th: props.quietHeight * 2 + props.height + (props.drawText ? props.textHeight : 0)
        };
    }

    protected calcCheckDigit(data: string): string {
        let cdChar = "";
        if (this.props.addCheckDigit) {
            let cd = 0;
            for (let i = 0; i < data.length; i++) {
                const v = charactersMap.get(data[i]);
                if (v === void 0) {
                    throw new Error("code39: character is out of range.");
                }
                cd = (cd + v.index) % 43;
            }
            const cdch = reverseMap.get(cd);
            if (cdch === void 0) {
                throw new Error("code39 (trace): checkdigit is out of range.");
            }
            cdChar = cdch;
        }
        return cdChar;
    }

    protected encodeData(data: string):
        {data: string, heightData?: string, labelText?: string, startChar: string, stopChar: string} {

        let d = data;
        if (this.props.fullAscii) {
            d = "";
            for (let i = 0; i < data.length; i++) {
                const c = fullAsciiMap.get(data.charCodeAt(i));
                if (c === void 0) {
                    throw new Error("code39 fullascii: character is out of range.");
                }
                d += c;
            }
        }
        return {data: d, startChar: "*", stopChar: "*"};
    }

    protected getBarSpaceWidth(): number[] {
        const props = this.props as Code39PropsNoUndefined;

        const gw = props.charGapWidth || props.narrowWidth;
        return [gw, props.narrowWidth, props.wideWidth];
    }
}

