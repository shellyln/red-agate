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
import { charactersMap }      from './data/Itf.data';



export interface ItfProps extends BarcodeBaseProps {
    addCheckDigit?: boolean;
    narrowWidth?: number;
    wideWidth?: number;
}

export interface ItfPropsNoUndefined extends BarcodeBasePropsNoUndefined {
    addCheckDigit: boolean;
    narrowWidth: number;
    wideWidth: number;
}

export const itfPropsDefault: ItfPropsNoUndefined = Object.assign({}, barcodeBasePropsDefault, {
    addCheckDigit: true,
    narrowWidth: 0.33,
    wideWidth: 0.66
});

export class Itf extends BarcodeBase<ItfProps> {
    public constructor(props: ItfProps) {
        super(Object.assign({}, itfPropsDefault, props), charactersMap);
    }

    protected calcSymbolSize(
        data: string, startChar: string, stopChar: string, cdChar: string
        ): {tw: number, th: number} {
        const props = this.props as ItfPropsNoUndefined;

        // module width (bar + space + gap)
        const mw = props.narrowWidth * 3 + props.wideWidth * 2;
        return {
            // total width (quiet + data + start + stop + cd)
            tw: props.quietWidth  * 2 + (props.narrowWidth * 8) + mw * data.length * 2,
            // total height (quiet + bar + text)
            th: props.quietHeight * 2 + props.height + (props.drawText ? props.textHeight : 0)
        };
    }

    protected calcItfMod10W3Checksum(data: string): string {
        let odd = 0, even = 0;
        for (let i = 0; i < data.length; i++) {
            // most right -> odd
            if ((i + 1) % 2) {
                odd  = (odd  + Number.parseInt(data[data.length - 1 - i])) % 10;
            } else {
                even = (even + Number.parseInt(data[data.length - 1 - i])) % 10;
            }
        }
        return String((10 - ((odd * 3 + even) % 10)) % 10);
    }

    protected encodeData(data: string):
        {data: string, heightData?: string, labelText?: string, startChar: string, stopChar: string} {

        let labelText = data;
        if (this.props.addCheckDigit) {
            const cd = this.calcItfMod10W3Checksum(data);
            labelText += cd;
        }
        let d = "";
        if (labelText.length % 2) {
            throw new Error("bad data length");
        }
        for (let i = 0; i < labelText.length; i += 2) {
            const c = Number.parseInt(labelText.slice(i, i + 2));
            d += String.fromCharCode(c);
        }
        return {data: d, labelText, startChar: "\x64", stopChar: "\x65"};
    }

    protected getBarSpaceWidth(): number[] {
        const props = this.props as ItfPropsNoUndefined;

        return [0, props.narrowWidth, props.wideWidth];
    }
}

