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
         fullAsciiMap }       from './data/JapanPostal.data';



export interface JapanPostalProps extends BarcodeBaseProps {
    elementWidth?: number;
}

export interface JapanPostalPropsNoUndefined extends BarcodeBasePropsNoUndefined {
    elementWidth: number;
}

export const japanPostalPropsDefault: JapanPostalPropsNoUndefined = Object.assign({}, barcodeBasePropsDefault, {
    elementWidth: 0.6,
    height: 1.2 * 3
});

export class JapanPostal extends BarcodeBase<JapanPostalProps> {
    public constructor(props: JapanPostalProps) {
        super(Object.assign({}, japanPostalPropsDefault, props), charactersMap);
    }



    protected calcSymbolSize(
        data: string, startChar: string, stopChar: string, cdChar: string
        ): {tw: number, th: number} {

        const props = this.props as JapanPostalPropsNoUndefined;

        // module width (bar + space)
        const mw = props.elementWidth * 6;
        return {
            // total width (quiet + data + start + stop + cd)
            tw: props.quietWidth  * 2 + mw * 21 + props.elementWidth * (4 + 3),
            // total height (quiet + bar)
            th: props.quietHeight * 2 + props.height
        };
    }

    protected calcCheckDigit(data: string): string {
        let cdChar = "";
        let cd = 0;
        for (let i = 0; i < data.length; i++) {
            const z = this.charactersMap.get(data[i]);
            if (z === void 0) {
                throw new Error("Japan Post: character is out of range.");
            }
            cd = (cd + z.index) % 19;
        }
        const cdch = reverseMap.get(cd);
        if (cdch === void 0) {
            throw new Error("Japan Post: check digit is out of range.");
        }
        cdChar = cdch;
        return cdChar;
    }

    protected encodeData(data: string):
        {data: string, heightData?: string, labelText?: string, startChar: string, stopChar: string} {

        let d = "";
        for (let i = 0; i < data.length; i++) {
            const c = fullAsciiMap.get(data.charCodeAt(i));
            if (c === void 0) {
                throw new Error("Japan Post: character is out of range.");
            }
            d += c;
        }
        d += "DDDDDDDDDDDDDDDDD";
        return {data: d.slice(0, 20), startChar: "[", stopChar: "]"};
    }

    protected getBarSpaceWidth(): number[] {
        const props = this.props as JapanPostalPropsNoUndefined;

        return [0, props.elementWidth];
    }

    protected getBarSpaceHeight(): Array<Array<{offset: number, height: number}>> {
        const props = this.props as JapanPostalPropsNoUndefined;

        const h = props.height;
        return [
            [{offset:     0, height: h        }], // 0: space
            [{offset:     0, height: h        }], // 1: full
            [{offset:     0, height: h * 2 / 3}], // 2: upper
            [{offset: h / 3, height: h * 2 / 3}], // 3: lower
            [{offset: h / 3, height: h     / 3}]  // 4: timing
        ];
    }

    protected get isHeightModulated(): boolean {
        return true;
    }

    protected renderText(canvas: SvgCanvas, tw: number, th: number, data: string, text: string) {
    }
}

