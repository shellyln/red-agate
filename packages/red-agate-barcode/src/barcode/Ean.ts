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
import { charactersMap }      from './data/Ean.data';



export type EanTypesEnum = "ean-2" | "ean-5" | "ean-8" | "ean-13" | "upc-a" | "upc-e";

export interface EanProps extends BarcodeBaseProps {
    smallFont?: string;
    elementWidth?: number;
    guardExtHeight?: number;
}

export interface EanPropsNoUndefined extends BarcodeBasePropsNoUndefined {
    smallFont: string;
    elementWidth: number;
    guardExtHeight: number;
}

export const eanPropsDefault: EanPropsNoUndefined = Object.assign({}, barcodeBasePropsDefault, {
    smallFont: "normal 3.0px 'OCRB'", // "initial user coordinate" 1px == "viewport coordinate" 1mm
    elementWidth: 0.33,
    guardExtHeight: 2
});

export class EanBase extends BarcodeBase<EanProps> {
    public constructor(props: EanProps) {
        super(Object.assign({}, eanPropsDefault, props), charactersMap);
    }

    protected get eanTypes(): EanTypesEnum {
        throw new Error("EAN#eanTypes: abstract property");
    }

    protected calcSymbolSize(
        data: string, startChar: string, stopChar: string, cdChar: string
        ): {tw: number, th: number} {

        const props = this.props as EanPropsNoUndefined;

        let len: number;
        let guard = 0;
        switch (this.eanTypes) {
        case "ean-13": case "upc-a":
            len = 12;
            guard = 11;
            break;
        case "ean-8":
            len = 8;
            guard = 11;
            break;
        case "ean-5":
            len = 5;
            guard = 13; // start + character separator
            break;
        case "upc-e":
            len = 6;
            guard = 10;
            break;
        case "ean-2":
            len = 2;
            guard = 7; // start + character separator
            break;
        default:
            throw new Error("bad data length");
        }

        return {
            // total width (quiet + data + cd + guard bar + center bar)
            tw: props.quietWidth  * 2 + props.elementWidth * (7 * len + guard),
            // total height (quiet + bar + text)
            th: props.quietHeight * 2 + props.height + (props.drawText ? props.textHeight : 0)
        };
    }

    protected calcEanMod10W3Checksum(data: string): number {
        let odd = 0, even = 0;
        for (let i = 0; i < data.length; i++) {
            // most right -> odd
            const z = this.charactersMap.get(data[data.length - 1 - i]);
            if (z === void 0) {
                throw new Error("EAN: character is out of range.");
            }
            if ((i + 1) % 2) {
                odd  = (odd  + z.index) % 10;
            } else {
                even = (even + z.index) % 10;
            }
        }
        return (10 - ((odd * 3 + even) % 10)) % 10;
    }

    protected calcEan5Checksum(data: string): number {
        let s = 0;
        for (let i = 0; i < data.length; i++) {
            s = (s + Number.parseInt(data[i]) * (i % 2 ? 3 : 9)) % 10;
        }
        return s;
    }

    protected calcEan2Checksum(data: string): number {
        return Number.parseInt(data) % 4;
    }

    protected encodeData(data: string):
        {data: string, heightData?: string, labelText?: string, startChar: string, stopChar: string} {

        let originalData = data;
        let d = "";
        let hd: string | undefined = void 0;
        let text: string;

        if (this.eanTypes === "upc-a" || this.eanTypes === "upc-e") {
            switch (data.length) {
            case 12: case 11: // UPC-A
                data = "0" + data;
                break;
            }

            if (this.eanTypes === "upc-e") {
                let ma: RegExpMatchArray | null;
                switch (data.length) {
                case 13: case 12:
                    {
                        originalData = data.slice(0, 12);

                        // tslint:disable-next-line:no-conditional-assignment
                        if (ma = data.match(/^0([01])([0-9]{5})0{4}([5-9])/)) {
                            // [01]XXXXX-0000[5-9] -> [01]XXXXX[5-9]
                            data = `${ma[1]}${ma[2]}${ma[3]}`;
                        }
                        // tslint:disable-next-line:no-conditional-assignment
                        else if (ma = data.match(/^0([01])([0-9]{4})0{5}([0-9])/)) {
                            // [01]XXXX0-0000N     -> [01]XXXXN4
                            data = `${ma[1]}${ma[2]}${ma[3]}4`;
                        }
                        // tslint:disable-next-line:no-conditional-assignment
                        else if (ma = data.match(/^0([01])([0-9]{3})0{5}([0-9]{2})/)) {
                            // [01]XXX00-000NN     -> [01]XXXNN3
                            data = `${ma[1]}${ma[2]}${ma[3]}3`;
                        }
                        // tslint:disable-next-line:no-conditional-assignment
                        else if (ma = data.match(/^0([01])([0-9]{2})([0-2])0{4}([0-9]{3})/)) {
                            // [01]XX[0-2]00-00NNN -> [01]XXNNN[0-2]
                            data = `${ma[1]}${ma[2]}${ma[4]}${ma[3]}`;
                        }
                        else {
                            throw new Error("EAN: bad data format");
                        }

                        const cd = this.calcEanMod10W3Checksum(originalData);
                        originalData += cd;
                        data += cd;
                    }
                    break;
                case 8: case 7:
                    {
                        if (!data.match(/^[01]/)) {
                            throw new Error("EAN: bad data format");
                        }

                        switch (data[6]) {
                        case "0": case "1": case "2":
                            // [01]XX[0-2]00-00NNN <- [01]XXNNN[0-2]
                            originalData = `0${data[0]}${data.slice(1, 3)}${data.slice(6, 7)}0000${data.slice(3, 6)}`;
                            break;
                        case "3":
                            // [01]XXX00-000NN     <- [01]XXXNN3
                            originalData = `0${data[0]}${data.slice(1, 4)}00000${data.slice(4, 6)}`;
                            break;
                        case "4":
                            // [01]XXXX0-0000N     <- [01]XXXXN4
                            originalData = `0${data[0]}${data.slice(1, 5)}00000${data.slice(5, 6)}`;
                            break;
                        case "5": case "6": case "7": case "8": case "9":
                            // [01]XXXXX-0000[5-9] <- [01]XXXXX[5-9]
                            originalData = `0${data[0]}${data.slice(1, 6)}0000${data.slice(6, 7)}`;
                            break;
                        default:
                            throw new Error("EAN: bad data format");
                        }

                        const cd = this.calcEanMod10W3Checksum(originalData);
                        originalData += cd;
                        data = data.slice(0, 7) + cd;
                    }
                    break;
                }
            }
        }

        switch (this.eanTypes) {
        case "ean-13": case "upc-a":
            {
                hd = "";
                text = data.slice(0, 12);
                d += "\x40";
                hd += "1";
                const z = this.charactersMap.get(String.fromCharCode(0x30 + Number.parseInt(data[0])));
                if (z === void 0) {
                    throw new Error("EAN: character is out of range.");
                }
                const eo = z.pattern;
                for (let i = 1; i < 7; i++) {
                    const p = Number.parseInt(eo[i - 1]);
                    d += String.fromCharCode(p * 0x10 + Number.parseInt(data[i]));
                    if (this.eanTypes === "upc-a" && i === 1) hd += "1";
                    else                                      hd += "0";
                }
                d += "\x50";
                hd += "1";
                for (let i = 7; i < 12; i++) {
                    d += String.fromCharCode(0x20 + Number.parseInt(data[i]));
                    hd += "0";
                }
                const cd = this.calcEanMod10W3Checksum(text);
                text += String.fromCharCode(0x30 + cd);
                d += String.fromCharCode(0x20 + cd);
                if (this.eanTypes === "upc-a") hd += "1";
                else                           hd += "0";
                d += "\x60";
                hd += "1";
            }
            break;
        case "ean-8":
            {
                hd = "";
                text = data.slice(0, 7);
                d += "\x40";
                hd += "1";
                for (let i = 0; i < 4; i++) {
                    d += String.fromCharCode(0x10 + Number.parseInt(data[i]));
                    hd += "0";
                }
                d += "\x50";
                hd += "1";
                for (let i = 4; i < 7; i++) {
                    d += String.fromCharCode(0x20 + Number.parseInt(data[i]));
                    hd += "0";
                }
                const cd = this.calcEanMod10W3Checksum(text);
                text += String.fromCharCode(0x30 + cd);
                d += String.fromCharCode(0x20 + cd);
                hd += "0";
                d += "\x60";
                hd += "1";
            }
            break;
        case "upc-e":
            {
                hd = "";
                text = data;
                d += "\x92";
                hd += "1";
                const z = this.charactersMap.get(String.fromCharCode(
                    (data[0] === "0" ? 0xa0 : 0xb0) + Number.parseInt(data[7])));
                if (z === void 0) {
                    throw new Error("EAN: character is out of range.");
                }
                const eo = z.pattern;
                for (let i = 1; i < 7; i++) {
                    const p = Number.parseInt(eo[i - 1]);
                    d += String.fromCharCode(p * 0x10 + Number.parseInt(data[i]));
                    hd += "0";
                }
                d += "\x93";
                hd += "1";
            }
            break;
        case "ean-5":
            {
                text = data.slice(0, 5);
                d += "\x90";
                const z = this.charactersMap.get(String.fromCharCode(0x70 + this.calcEan5Checksum(data)));
                if (z === void 0) {
                    throw new Error("EAN: character is out of range.");
                }
                const eo = z.pattern;
                for (let i = 0; i < 5; i++) {
                    const p = Number.parseInt(eo[i]);
                    if (i > 0) d += "\x91";
                    d += String.fromCharCode(p * 0x10 + Number.parseInt(data[i]));
                }
            }
            break;
        case "ean-2":
            {
                text = data.slice(0, 2);
                d += "\x90";
                const z = this.charactersMap.get(String.fromCharCode(0x80 + this.calcEan2Checksum(data)));
                if (z === void 0) {
                    throw new Error("EAN: character is out of range.");
                }
                const eo = z.pattern;
                for (let i = 0; i < 2; i++) {
                    const p = Number.parseInt(eo[i]);
                    if (i > 0) d += "\x91";
                    d += String.fromCharCode(p * 0x10 + Number.parseInt(data[i]));
                }
            }
            break;
        default:
            throw new Error("EAN: bad data length");
        }
        return {data: d, heightData: hd, labelText: text, startChar: "", stopChar: ""};
    }

    protected getBarSpaceWidth(): number[] {
        const props = this.props as EanPropsNoUndefined;

        const w = props.elementWidth;
        return [0, w, w * 2, w * 3, w * 4];
    }

    protected getBarSpaceHeight(): Array<Array<{offset: number, height: number}>> {
        const props = this.props as EanPropsNoUndefined;

        const h  = props.height        ;
        const gh = props.guardExtHeight;
        return [
            [{offset: 0, height: h}],
            [{offset: 0, height: h + gh}]
        ];
    }

    protected getRenderStartCoodinate(data: string, text: string): {rx: number, ry: number} {
        const props = this.props as EanPropsNoUndefined;

        const qw = props.quietWidth ;
        const qh = props.quietHeight;

        switch (this.eanTypes) {
        case "ean-13": case "ean-8": case "upc-a": case "upc-e":
            {
                return {rx: qw, ry: qh};
            }
        case "ean-5": case "ean-2":
            {
                return {rx: qw, ry: qh + (props.drawText ? props.textHeight : 0)};
            }
        default:
            throw new Error("EAN: bad data length");
        }
    }

    protected renderText(canvas: SvgCanvas, tw: number, th: number, data: string, text: string) {
        const props = this.props as EanPropsNoUndefined;

        switch (this.eanTypes) {
        case "ean-13":
            if (props.guardExtHeight > 0) {
                canvas.textBaseline = "alphabetic"; // "bottom";
                canvas.textAlign = "start";
                canvas.fillText(text.slice( 0,  1), props.quietWidth - props.elementWidth * 14, th - props.quietHeight);
                canvas.textAlign = "center";
                canvas.fillText(text.slice( 1,  7), props.quietWidth + props.elementWidth * 24, th - props.quietHeight);
                canvas.fillText(text.slice( 7, 13), props.quietWidth + props.elementWidth * 71, th - props.quietHeight);
            } else {
                canvas.textAlign = "center";
                canvas.textBaseline = "alphabetic"; // "bottom";
                canvas.fillText(text, tw / 2, th - props.quietHeight);
            }
            break;
        case "upc-a":
            if (props.guardExtHeight > 0) {
                canvas.textBaseline = "alphabetic"; // "bottom";
                canvas.font = props.smallFont || canvas.font;
                canvas.textAlign = "start";
                canvas.fillText(text.slice( 1,  2), props.quietWidth - props.elementWidth * 12, th - props.quietHeight - props.textHeight * 0.2);
                canvas.font = props.font || canvas.font;
                canvas.textAlign = "center";
                canvas.fillText(text.slice( 2,  7), props.quietWidth + props.elementWidth * 27.5, th - props.quietHeight);
                canvas.fillText(text.slice( 7, 12), props.quietWidth + props.elementWidth * 67.5, th - props.quietHeight);
                canvas.font = props.smallFont || canvas.font;
                canvas.textAlign = "start";
                canvas.fillText(text.slice(12, 13), tw - props.quietWidth + props.elementWidth * 7, th - props.quietHeight - props.textHeight * 0.2);
            } else {
                canvas.textAlign = "center";
                canvas.textBaseline = "alphabetic"; // "bottom";
                canvas.fillText(text.slice(1), tw / 2, th - props.quietHeight);
            }
            break;
        case "ean-8":
            if (props.guardExtHeight > 0) {
                canvas.textAlign = "center";
                canvas.textBaseline = "alphabetic"; // "bottom";
                canvas.fillText(text.slice(0, 4), props.quietWidth + props.elementWidth * 17, th - props.quietHeight);
                canvas.fillText(text.slice(4, 8), props.quietWidth + props.elementWidth * 50, th - props.quietHeight);
            } else {
                canvas.textAlign = "center";
                canvas.textBaseline = "alphabetic"; // "bottom";
                canvas.fillText(text, tw / 2, th - props.quietHeight);
            }
            break;
        case "upc-e":
            if (props.guardExtHeight > 0) {
                canvas.font = props.smallFont || canvas.font;
                canvas.textAlign = "start";
                canvas.fillText(text.slice(0, 1), props.quietWidth - props.elementWidth * 12, th - props.quietHeight - props.textHeight * 0.2);
                canvas.font = props.font || canvas.font;
                canvas.textAlign = "center";
                canvas.fillText(text.slice(1, 7), tw / 2, th - props.quietHeight);
                canvas.font = props.smallFont || canvas.font;
                canvas.textAlign = "start";
                canvas.fillText(text.slice(7, 8), tw - props.quietWidth + props.elementWidth * 7, th - props.quietHeight - props.textHeight * 0.2);
            } else {
                canvas.textAlign = "center";
                canvas.textBaseline = "alphabetic"; // "bottom";
                canvas.fillText(text, tw / 2, th - props.quietHeight);
            }
            break;
        case "ean-5": case "ean-2":
            {
                canvas.textAlign = "center";
                canvas.textBaseline = "alphabetic"; // "bottom";
                canvas.fillText(text, tw / 2, props.quietHeight + props.textHeight);
            }
            break;
        default:
            throw new Error("EAN: bad data length");
        }
    }
}

export class Ean13 extends EanBase {
    protected get eanTypes(): EanTypesEnum {
        return "ean-13";
    }
}

export class Ean8 extends EanBase {
    protected get eanTypes(): EanTypesEnum {
        return "ean-8";
    }
}

export class Ean5 extends EanBase {
    protected get eanTypes(): EanTypesEnum {
        return "ean-5";
    }
}

export class Ean2 extends EanBase {
    protected get eanTypes(): EanTypesEnum {
        return "ean-2";
    }
}

export class UpcA extends EanBase {
    protected get eanTypes(): EanTypesEnum {
        return "upc-a";
    }
}

export class UpcE extends EanBase {
    protected get eanTypes(): EanTypesEnum {
        return "upc-e";
    }
}

