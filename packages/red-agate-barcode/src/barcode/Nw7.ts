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
         reverseMap }         from './data/Nw7.data';



export interface Nw7Props extends BarcodeBaseProps {
    addCheckDigit?: boolean;
    narrowWidth?: number;
    wideWidth?: number;
    charGapWidth?: number;
    startChar?: string;
    stopChar?: string;
}

export interface Nw7PropsNoUndefined extends BarcodeBasePropsNoUndefined {
    addCheckDigit: boolean;
    narrowWidth: number;
    wideWidth: number;
    charGapWidth?: number;
    startChar: string;
    stopChar: string;
}

export const nw7PropsDefault: Nw7PropsNoUndefined = Object.assign({}, barcodeBasePropsDefault, {
    useRawDataAsText: true,
    addCheckDigit: true,
    narrowWidth: 0.33,
    wideWidth: 0.66,
    charGapWidth: void 0,
    startChar: "",
    stopChar: ""
});

export class Nw7 extends BarcodeBase<Nw7Props> {
    public constructor(props: Nw7Props) {
        super(Object.assign({}, nw7PropsDefault, props), charactersMap);
    }

    protected calcSymbolSize(
        data: string, startChar: string, stopChar: string, cdChar: string
        ): {tw: number, th: number} {
        const props = this.props as Nw7PropsNoUndefined;

        const gw = props.charGapWidth || props.narrowWidth;
        // module width (bar + space + gap)
        const mw = props.narrowWidth * 4 + props.wideWidth * 3 + gw;

        let tw = props.quietWidth * 2 - gw;

        const data2 = `${startChar}${data}${cdChar}${stopChar}`;
        for (const c of data2) {
            const z = charactersMap.get(c);
            if (z === void 0) {
                throw new Error("NW7: character is out of range.");
            }
            const wide = z.width - 7;
            const narrow = 7 - wide;
            tw += props.narrowWidth * narrow + props.wideWidth * wide + gw;
        }

        return {
            // total width (quiet + data + start + stop + cd)
            tw,
            // total height (quiet + bar + text)
            th: props.quietHeight * 2 + props.height + (props.drawText ? props.textHeight : 0)
        };
    }

    protected calcCheckDigit(data: string): string {
        let cdChar = "";
        if (this.props.addCheckDigit) {
            let cd = 0;
            for (let i = 0; i < data.length; i++) {
                const z = charactersMap.get(data[i]);
                if (z === void 0) {
                    throw new Error("NW7: character is out of range.");
                }
                cd = (cd + z.index) % 16;
            }
            const cdch = reverseMap.get((16 - cd) % 16);
            if (cdch === void 0) {
                throw new Error("NW7: check digit is out of range.");
            }
            cdChar = cdch;
        }
        return cdChar;
    }

    protected encodeData(data: string):
        {data: string, heightData?: string, labelText?: string, startChar: string, stopChar: string} {

        return {data, startChar: this.props.startChar || "", stopChar: this.props.stopChar || ""};
    }

    protected getBarSpaceWidth(): number[] {
        const props = this.props as Nw7PropsNoUndefined;

        const gw = props.charGapWidth || props.narrowWidth;
        return [gw, props.narrowWidth, props.wideWidth];
    }
}

