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



export interface BarcodeBaseProps extends ShapeProps {
    fillColor?: string | WebColor;
    font?: string;

    rotation?: number;
    height?: number;
    quietWidth?: number;
    quietHeight?: number;
    drawText?: boolean;
    useRawDataAsText?: boolean;
    textHeight?: number;

    data?: string;
    text?: string;
}

export interface BarcodeBasePropsNoUndefined extends ShapeProps {
    fillColor: string | WebColor;
    font: string;

    rotation: number;
    height: number;
    quietWidth: number;
    quietHeight: number;
    drawText: boolean;
    useRawDataAsText: boolean;
    textHeight: number;

    data?: string;
    text?: string;
}

export const barcodeBasePropsDefault: BarcodeBasePropsNoUndefined = Object.assign({}, shapePropsDefault, {
    fillColor: "black",
    font: "normal 3.5px 'OCRB'", // "initial user coordinate" 1px == "viewport coordinate" 1mm
    rotation: 0,
    height: 6.35,
    quietWidth: 2.54,
    quietHeight: 0.66,
    drawText: true,
    useRawDataAsText: false,
    textHeight: 3.55
});

export class BarcodeBase<T extends BarcodeBaseProps> extends Shape<T> {
    public constructor(props: T, protected charactersMap: Map<string, {index: number, pattern: string}>) {
        super(Object.assign({}, barcodeBasePropsDefault, props as any));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);

        let data = this.props.data || "";
        let text = this.props.text;

        const originalData = data;
        let heightData: string | undefined,
             labelText: string | undefined,
             startChar: string,
              stopChar: string;
        ({data, heightData, labelText, startChar, stopChar} = this.encodeData(data));

        const cdChar = this.calcCheckDigit(data);

        // tw: total width (quiet + data + start + stop + cd)
        // th: total height (quiet + bar + text)
        const {tw, th} = this.calcSymbolSize(data, startChar, stopChar, cdChar);

        data = `${startChar}${data}${cdChar}${stopChar}`;

        if (labelText !== void 0) {
            text = labelText;
        } else {
            if (text === void 0 || text === null) text = this.props.text;
            if (text === void 0 || text === null) text = originalData;
        }

        let rotation = (this.props.rotation === void 0 || this.props.rotation === null) ?
            0 : Math.floor(this.props.rotation / 90) % 4;

        if (rotation < 0) rotation += 4;
        switch (rotation) {
            case 1:
                canvas.rotate(Math.PI * 1.5);
                canvas.translate(-tw, 0);
                break;
            case 2:
                canvas.rotate(Math.PI);
                canvas.translate(-tw, -th);
                break;
            case 3:
                canvas.rotate(Math.PI * 0.5);
                canvas.translate(0, -th);
                break;
        }

        if (this.props.drawText) {
            canvas.beginGroup();
        }

        if (this.isHeightModulated) {
            this.renderHeightModulatedBarData(canvas, tw, th, data, heightData, text);
        } else {
            this.renderBarData(canvas, tw, th, data, heightData, text);
        }
        this.renderAdditional(canvas, tw, th, data, text);

        if (this.props.drawText) {
            canvas.endGroup();
            canvas.beginGroup();
        }

        if (this.props.drawText) {
            if (this.props.font) canvas.font = this.props.font;
            this.renderText(canvas, tw, th, data, text);
        }

        if (this.props.drawText) {
            canvas.endGroup();
        }

        return ``;
    }



    // total width (quiet + data + start + stop + cd)
    // total height (quiet + bar + text)
    protected calcSymbolSize(
        data: string, startChar: string, stopChar: string, cdChar: string
        ): {tw: number, th: number} {
        return {
            // total width (quiet + data + start + stop + cd)
            tw: 0,
            // total height (quiet + bar + text)
            th: 0
        };
    }

    protected calcCheckDigit(data: string): string {
        return "";
    }

    protected encodeData(data: string):
        {data: string, heightData?: string, labelText?: string, startChar: string, stopChar: string} {

        return {data, startChar: "", stopChar: ""};
    }

    protected getBarSpaceWidth(): number[] {
        return [];
    }

    protected getBarSpaceHeight(): Array<Array<{offset: number, height: number}>> {
        const props = this.props as BarcodeBasePropsNoUndefined;

        return [[{offset: 0, height: props.height}]];
    }

    protected getRenderStartCoodinate(data: string, text: string): {rx: number, ry: number} {
        const props = this.props as BarcodeBasePropsNoUndefined;

        return {rx: props.quietWidth, ry: props.quietHeight};
    }

    protected get isHeightModulated(): boolean {
        return false;
    }

    protected renderBarData(
        canvas: SvgCanvas, tw: number, th: number,
        data: string, heightData: string | undefined, text: string) {

        const bw = this.getBarSpaceWidth();
        const vseg = this.getBarSpaceHeight();

        // tslint:disable-next-line:prefer-const
        let {rx, ry} = this.getRenderStartCoodinate(data, text);

        for (let i = 0; i < data.length; i++) {
            const cmap = this.charactersMap.get(data[i]);
            if (! cmap) {
                throw new Error("BarcodeBase#renderBarData: character is out of range.");
            }
            const pattern = cmap.pattern;
            let bar = true;
            let dx = 0;
            for (let j = 0; j < pattern.length; j++) {
                const c = pattern[j];
                switch (c) {
                    case "0": case "1": case "2": case "3": case "4":
                    case "5": case "6": case "7": case "8": case "9":
                        // "0" is character gap
                        {
                            const w = bw[Number.parseInt(c)];
                            if (bar) {
                                const ss = (heightData === void 0) ? vseg[0] : vseg[Number.parseInt(heightData[i])];
                                for (const seg of ss) {
                                    canvas.rect(rx + dx, ry + seg.offset, w, seg.height);
                                }
                            }
                            dx += w;
                            bar = !bar;
                        }
                        break;
                    case "+":
                        bar = true;
                        break;
                    case "-":
                        bar = false;
                        break;
                }
            }
            rx += dx;
        }
        canvas.fill();
    }

    protected renderHeightModulatedBarData(
        canvas: SvgCanvas, tw: number, th: number,
        data: string, heightData: string | undefined, text: string) {

        const bw = this.getBarSpaceWidth();
        const w = bw[1];
        const vseg = this.getBarSpaceHeight();

        // tslint:disable-next-line:prefer-const
        let {rx, ry} = this.getRenderStartCoodinate(data, text);

        for (let i = 0; i < data.length; i++) {
            const pattern = (this as any).charactersMap.get(data[i]).pattern;
            const bar = true;
            let dx = 0;
            for (let j = 0; j < pattern.length; j++) {
                const c = pattern[j];
                switch (c) {
                    case "1": case "2": case "3": case "4":
                    case "5": case "6": case "7": case "8": case "9":
                        {
                            const ss = vseg[Number.parseInt(c)];
                            for (const seg of ss) {
                                canvas.rect(rx + dx, ry + seg.offset, w, seg.height);
                            }
                        }
                        // FALL THRU
                    case "0":
                        // "0" is space
                        dx += w * 2;
                        break;
                }
            }
            rx += dx;
        }
        canvas.fill();
    }

    protected renderAdditional(canvas: SvgCanvas, tw: number, th: number, data: string, text: string) {
    }

    protected renderText(canvas: SvgCanvas, tw: number, th: number, data: string, text: string) {
        const props = this.props as BarcodeBasePropsNoUndefined;

        canvas.textAlign = "center";
        canvas.textBaseline = "alphabetic";
        canvas.fillText(props.useRawDataAsText ? data : text, tw / 2, th - props.quietHeight);
    }
}

