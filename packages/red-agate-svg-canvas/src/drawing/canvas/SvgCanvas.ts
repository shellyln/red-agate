// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { TextEncoding }          from "red-agate-util/modules/convert/TextEncoding";
import { Base64 }                from "red-agate-util/modules/convert/Base64";
import { Escape }                from "red-agate-util/modules/convert/Escape";
import { WordWrap }              from "red-agate-util/modules/convert/WordWrap";
import { WebColor }              from "./WebColor";
import { VectorCanvas2DGradient,
         VectorCanvas2DPattern,
         VectorCanvas2D }        from "./VectorCanvas2D";
import { Point2D,
         Vector2D,
         Rect2D,
         TransferMatrix2D }      from "./TransferMatrix2D";


export interface SvgCanvas2DAsset {
    toDef(): string;
}


export interface SvgTextAttributes {
    /**
     * author's computation of the total sum of all of the advance values
     *  that correspond to character data within this element,
     *  including the advance value on the glyph
     */
    textLength?: number;
    /** 'spacing' | 'spacingAndGlyphs' */
    lengthAdjust?: "spacing" | "spacingAndGlyphs";
    /** line break on newline(0x0a) */
    multiline?: boolean;
    /**
     * length from baseline to next baseline.
     *  if writingMode is horizontal then add y coodinate.
     *  if writingMode is vertical then add x coodinate.
     */
    lineHeight?: number;
    /** rotation about the current text position (degree) */
    rotate?: number;
    /** 'lr-tb' | 'rl-tb' | 'tb-rl' | 'lr' | 'rl' | 'tb' */
    writingMode?: "lr-tb" | "rl-tb" | "tb-rl" | "lr" | "rl" | "tb";
    /** 'auto' | 0 | 90 | 180 | 270 */
    glyphOrientationVertical?: "auto" | number;
    /** 0 | 90 | 180 | 270 */
    glyphOrientationHorizontal?: number;
    /** 'ltr' | 'rtl'  */
    direction?: "ltr" | "rtl";
    /** 'normal' | 'embed' | 'bidi-override' */
    unicodeBidi?: "normal" | "embed" | "bidi-override";
    /** 'none' | [ 'underline' || 'overline' || 'line-through' ] */
    textDecoration?: string;
    /** use textPath */
    textPath?: boolean;
    /**  */
    textPathOffset?: number;
    /** 'auto' | length */
    kerning?: "auto" | number;
    /** 'normal' | length */
    letterSpacing?: "normal" | number;
    /** 'normal' | length */
    wordSpacing?: "normal" | number;
}


export class SvgCanvasImageData {
    constructor(
        public url: string,
        public x: number, public y: number,
        public width: number, public height: number) {
    }
}


export class SvgCanvas2DLinerGradient implements VectorCanvas2DGradient, SvgCanvas2DAsset {
    private content: string;
    constructor(
        private id: string,
        private x0: number, private y0: number, private x1: number, private y1: number) {
        this.content = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" >\n`;
    }
    public addColorStop(offset: number, color: string, opacity: number = 1): void {
        this.content += `<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}" />\n`;
    }
    public toDef(): string {
        return this.content + "</linearGradient>";
    }
    public toString(): string {
        return `url(#${this.id})`;
    }
}


export class SvgCanvas2DRadialGradient implements VectorCanvas2DGradient, SvgCanvas2DAsset {
    private content: string;
    /** fr is ignored. fr is always 0. */
    constructor(
        private id: string,
        private cx: number, private cy: number, private r: number,
        private fx: number, private fy: number) {
        this.content = `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}" >\n`;
    }
    public addColorStop(offset: number, color: string, opacity: number = 1): void {
        this.content += `<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}" />\n`;
    }
    public toDef() {
        return this.content + "</radialGradient>";
    }
    public toString() {
        return `url(#${this.id})`;
    }
}


export class SvgCanvas2DPattern implements VectorCanvas2DPattern, SvgCanvas2DAsset {
    constructor(
        private id: string,
        private imageData: SvgCanvasImageData) {
    }
    public toDef() {
        const content =
            `<image x="0" y="0" width="${this.imageData.width}" height="${this.imageData.height}" \n` +
            `xlink:href="${this.imageData.url}" />`;
        return `<pattern id="${this.id}"  patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse" ` +
            `x="${this.imageData.x}" y="${this.imageData.y}" ` +
            `width="${this.imageData.width}" height="${this.imageData.height}">${content}</pattern>`;
    }
    public toString() {
        return `url(#${this.id})`;
    }
}


/**
 * canvas: source-over|source-in|source-out|source-atop|
 *         destination-over|destination-in|destination-out|destination-atop|
 *         lighter|copy|xor
 *    svg: over|in|out|atop|xor|arithmetic
 */
export type GlobalCompositeOperationValue =
    "source-over" | "source-in" | "source-out" | "source-atop" |
    "destination-over" | "destination-in" | "destination-out" | "destination-atop" |
    "lighter" | "copy" | "xor" |
    "over" | "in" | "out" | "atop" | "arithmetic";

/**
 * text-anchor
 * canvas:start|end|left|right|center
 *    svg:start|middle|end
 */
export type TextAlignValue =
    "start" | "end" | "left" | "right" | "center" | "middle";

/**
 * dominant-baseline
 * canvas:top|hanging|middle|alphabetic|ideographic|bottom
 *    svg:auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge
 *        ('auto' is default. 'auto's effective value is depends on writing mode. if mode is horizontal then it is alphabetic. else then it is central)
 *
 * --------------------  text-before-edge (em square's edge)
 * --                --  hanging
 * --  X        X    --  mathematical
 *     X
 *     X        X
 * --  XXXX     X    --  central (em square's central), nearby of x-height(alphabetic lower case height)
 * --  X   X    X    --  middle (1/2 x-height)
 * --  X   X    X    --  alphabetic
 *            pp
 * -----------^^-------  ideographic, text-after-edge (em square's edge)
 */
export type TextBaselineValue =
    "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom" |
    "auto" | "use-script" | "no-change" | "reset-size" |
    "mathematical" | "central" | "text-after-edge" | "text-before-edge";

/**
 * stroke-linecap
 * butt|round|square
 */
export type LineCapValue = "butt" | "round" | "square";

/**
 * stroke-linejoin
 * miter|round|bevel
 */
export type LineJoinValue = "miter" | "round" | "bevel";


class SvgCanvasGraphicState {
    public globalAlpha: number = 1;

    /**
     * canvas: source-over|source-in|source-out|source-atop|
     *         destination-over|destination-in|destination-out|destination-atop|
     *         lighter|copy|xor
     *    svg: over|in|out|atop|xor|arithmetic
     */
    public globalCompositeOperation: GlobalCompositeOperationValue = "source-over";

    public shadowBlur: number = 0;
    /**
     * canvas   : <'web-color'>|#000|#000000|rgb(0,0,0)|rgba(0,0,0,0)
     * SvgCanvas: rgb(0,0,0)|rgba(0,0,0,0)
     */
    public shadowColor: string = "rgba(0,0,0,1)";
    public shadowOffsetX: number = 0;
    public shadowOffsetY: number = 0;

    public filterIdUrl: string | null = null;

    /**
     * canvas: "italic bold 26px 'Times New Roman'"
     *    svg: font-family ="Times New Roman"
     *         font-style  =normal|italic|oblique
     *         font-variant=normal|small-caps
     *         font-weight =normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900
     *         font-stretch=normal|wider|narrower|ultra-condensed|extra-condensed|condensed|
     *                      semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded
     *         font-size   =<absolute-size>|<relative-size>|<length>|<percentage>
     *         font-size-adjust=<number>|none
     *         font        =[[<'font-style'>||<'font-variant'>||<'font-weight'>]?<'font-size'>[/<'line-height'>]?<'font-family'>]
     */
    public font: string = "normal 12px 'Times New Roman'";
    /**
     * text-anchor
     * canvas:start|end|left|right|center
     *    svg:start|middle|end
     */
    public textAlign: TextAlignValue = "start";
    /**
     * dominant-baseline
     * default is 'auto'.
     * canvas:top|hanging|middle|alphabetic|ideographic|bottom
     *        ('alphabetic' is default)
     *    svg:auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge
     *        ('auto' is default. 'auto's effective value is depends on writing mode. if mode is horizontal then it is alphabetic. else then it is central)
     */
    public textBaseline: TextBaselineValue = "auto";

    /**
     * stroke-linecap
     * butt|round|square
     */
    public lineCap: LineCapValue = "butt";
    public lineDashOffset: number = 0;
    /**
     * stroke-linejoin
     * miter|round|bevel
     */
    public lineJoin: LineJoinValue = "miter";
    public lineWidth: number = 1;
    public miterLimit: number = 4;

    public strokeStyle: string = "black";
    public fillStyle: string = "black";

    public ctm: TransferMatrix2D = new TransferMatrix2D();
    public currentPoint: Point2D | null = null;
    public currentPointOnCtm: Point2D | null = null;
    public subpath: Array<string | number | Point2D> = [];

    public lineDash: number[] = [];
    public clipPath: string = "";

    constructor(src?: SvgCanvasGraphicState) {
        if (! src) return;
        for (const key in this) {
            if (this.hasOwnProperty(key) && src.hasOwnProperty(key)) {
                (this as any)[key] = (src as any)[key];
            }
        }
        this.subpath = Array.from(this.subpath);
    }
}


/**
 * subset of CanvasRenderingContext2D
 */
export class SvgCanvas implements VectorCanvas2D {
    public get globalAlpha(): number {
        return this.graphicsStack[this.graphicsStack.length - 1].globalAlpha;
    }
    public set globalAlpha(value: number) {
        this.graphicsStack[this.graphicsStack.length - 1].globalAlpha = value;
    }

    public get globalCompositeOperation(): GlobalCompositeOperationValue {
        return this.graphicsStack[this.graphicsStack.length - 1].globalCompositeOperation;
    }
    public set globalCompositeOperation(value: GlobalCompositeOperationValue) {
        this.filterIdUrl = null;
        this.graphicsStack[this.graphicsStack.length - 1].globalCompositeOperation = value;
    }

    public get shadowBlur(): number {
        return this.graphicsStack[this.graphicsStack.length - 1].shadowBlur;
    }
    public set shadowBlur(value: number) {
        this.filterIdUrl = null;
        this.graphicsStack[this.graphicsStack.length - 1].shadowBlur = value;
    }
    public get shadowColor(): string {
        return this.graphicsStack[this.graphicsStack.length - 1].shadowColor;
    }
    public set shadowColor(value: string) {
        this.filterIdUrl = null;
        this.graphicsStack[this.graphicsStack.length - 1].shadowColor = value;
    }
    public get shadowOffsetX(): number {
        return this.graphicsStack[this.graphicsStack.length - 1].shadowOffsetX;
    }
    public set shadowOffsetX(value: number) {
        this.filterIdUrl = null;
        this.graphicsStack[this.graphicsStack.length - 1].shadowOffsetX = value;
    }
    public get shadowOffsetY(): number {
        return this.graphicsStack[this.graphicsStack.length - 1].shadowOffsetY;
    }
    public set shadowOffsetY(value: number) {
        this.filterIdUrl = null;
        this.graphicsStack[this.graphicsStack.length - 1].shadowOffsetY = value;
    }
    private get filterIdUrl(): string | null {
        return this.graphicsStack[this.graphicsStack.length - 1].filterIdUrl;
    }
    private set filterIdUrl(value: string | null) {
        this.graphicsStack[this.graphicsStack.length - 1].filterIdUrl = value;
    }

    /**
     * canvas: "italic bold 26px 'Times New Roman'"
     *    svg: font-family ="Times New Roman"
     *         font-style  =normal|italic|oblique
     *         font-variant=normal|small-caps
     *         font-weight =normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900
     *         font-stretch=normal|wider|narrower|ultra-condensed|extra-condensed|condensed|
     *                      semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded
     *         font-size   =<absolute-size>|<relative-size>|<length>|<percentage>
     *         font-size-adjust=<number>|none
     *         font        =[[<'font-style'>||<'font-variant'>||<'font-weight'>]?<'font-size'>[/<'line-height'>]?<'font-family'>]
     */
    public get font(): string {
        return this.graphicsStack[this.graphicsStack.length - 1].font;
    }
    /**
     * canvas: "italic bold 26px 'Times New Roman'"
     *         [<‘font-style’>||<font-variant>||<‘font-weight’>||<‘font-stretch’>]?<‘font-size’>[/<‘line-height’>]?<‘font-family’>
     *
     *    svg: font-family ="Times New Roman"
     *         font-style  =normal|italic|oblique
     *         font-variant=normal|small-caps
     *         font-weight =normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900
     *         font-stretch=normal|wider|narrower|ultra-condensed|extra-condensed|condensed|
     *                      semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded
     *         font-size   =<absolute-size>|<relative-size>|<length>|<percentage>
     *         font-size-adjust=<number>|none
     *         font        =[<'font-style'>||<'font-variant'>||<'font-weight'>]?<'font-size'>[/<'line-height'>]?<'font-family'>
     */
    public set font(value: string) {
        this.graphicsStack[this.graphicsStack.length - 1].font = value;
    }
    /**
     * text-anchor
     * canvas:start|end|left|right|center
     *    svg:start|middle|end
     */
    public get textAlign(): TextAlignValue {
        return this.graphicsStack[this.graphicsStack.length - 1].textAlign;
    }
    /**
     * text-anchor
     * canvas:start|end|left|right|center
     *    svg:start|middle|end
     */
    public set textAlign(value: TextAlignValue) {
        this.graphicsStack[this.graphicsStack.length - 1].textAlign = value;
    }
    /**
     * dominant-baseline
     * canvas:top|hanging|middle|alphabetic|ideographic|bottom
     *    svg:auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge
     */
    public get textBaseline(): TextBaselineValue {
        return this.graphicsStack[this.graphicsStack.length - 1].textBaseline;
    }
    /**
     * dominant-baseline
     * canvas:top|hanging|middle|alphabetic|ideographic|bottom
     *    svg:auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge
     */
    public set textBaseline(value: TextBaselineValue) {
        this.graphicsStack[this.graphicsStack.length - 1].textBaseline = value;
    }

    /**
     * stroke-linecap
     * butt|round|square
     */
    public get lineCap(): LineCapValue {
        return this.graphicsStack[this.graphicsStack.length - 1].lineCap;
    }
    /**
     * stroke-linecap
     * butt|round|square
     */
    public set lineCap(value: LineCapValue) {
        this.graphicsStack[this.graphicsStack.length - 1].lineCap = value;
    }
    public get lineDashOffset(): number {
        return this.graphicsStack[this.graphicsStack.length - 1].lineDashOffset;
    }
    public set lineDashOffset(value: number) {
        this.graphicsStack[this.graphicsStack.length - 1].lineDashOffset = value;
    }
    /**
     * stroke-linejoin
     * miter|round|bevel
     */
    public get lineJoin(): LineJoinValue {
        return this.graphicsStack[this.graphicsStack.length - 1].lineJoin;
    }
    /**
     * stroke-linejoin
     * miter|round|bevel
     */
    public set lineJoin(value: LineJoinValue) {
        this.graphicsStack[this.graphicsStack.length - 1].lineJoin = value;
    }
    public get lineWidth(): number {
        return this.graphicsStack[this.graphicsStack.length - 1].lineWidth;
    }
    public set lineWidth(value: number) {
        this.graphicsStack[this.graphicsStack.length - 1].lineWidth = value;
    }
    public get miterLimit(): number {
        return this.graphicsStack[this.graphicsStack.length - 1].miterLimit;
    }
    public set miterLimit(value: number) {
        this.graphicsStack[this.graphicsStack.length - 1].miterLimit = value;
    }

    public get strokeStyle(): string | SvgCanvas2DLinerGradient | SvgCanvas2DRadialGradient | SvgCanvas2DPattern {
        return this.graphicsStack[this.graphicsStack.length - 1].strokeStyle;
    }
    public set strokeStyle(value: string | SvgCanvas2DLinerGradient | SvgCanvas2DRadialGradient | SvgCanvas2DPattern) {
        this.graphicsStack[this.graphicsStack.length - 1].strokeStyle = value.toString();
    }
    public get fillStyle(): string | SvgCanvas2DLinerGradient | SvgCanvas2DRadialGradient | SvgCanvas2DPattern {
        return this.graphicsStack[this.graphicsStack.length - 1].fillStyle;
    }
    public set fillStyle(value: string | SvgCanvas2DLinerGradient | SvgCanvas2DRadialGradient | SvgCanvas2DPattern) {
        this.graphicsStack[this.graphicsStack.length - 1].fillStyle = value.toString();
    }

    private get ctm(): TransferMatrix2D {
        return this.graphicsStack[this.graphicsStack.length - 1].ctm;
    }
    private set ctm(value: TransferMatrix2D) {
        this.graphicsStack[this.graphicsStack.length - 1].ctm = value;
    }
    private get currentPoint(): Point2D | null {
        return this.graphicsStack[this.graphicsStack.length - 1].currentPoint;
    }
    private set currentPoint(value: Point2D | null) {
        this.graphicsStack[this.graphicsStack.length - 1].currentPoint = value;
    }
    private get currentPointOnCtm(): Point2D | null {
        return this.graphicsStack[this.graphicsStack.length - 1].currentPointOnCtm;
    }
    private set currentPointOnCtm(value: Point2D | null) {
        this.graphicsStack[this.graphicsStack.length - 1].currentPointOnCtm = value;
    }
    private get subpath(): Array<string | number | Point2D> {
        return this.graphicsStack[this.graphicsStack.length - 1].subpath;
    }
    private set subpath(value: Array<string | number | Point2D>) {
        this.graphicsStack[this.graphicsStack.length - 1].subpath = value;
    }

    private get lineDash(): number[] {
        return this.graphicsStack[this.graphicsStack.length - 1].lineDash;
    }
    private set lineDash(value: number[]) {
        this.graphicsStack[this.graphicsStack.length - 1].lineDash = value;
    }
    private get clipPath(): string {
        return this.graphicsStack[this.graphicsStack.length - 1].clipPath;
    }
    private set clipPath(value: string) {
        this.graphicsStack[this.graphicsStack.length - 1].clipPath = value;
    }

    private get subpathIsEmptyOrClosed(): boolean {
        return this.subpath.length === 0 || this.subpath[this.subpath.length - 1] === "Z";
    }

    private graphicsStack: SvgCanvasGraphicState[] = [];
    private assets: Array<SvgCanvas2DAsset | string> = [];
    private content = "";
    private contentSaved = "";
    private idCount = 0;
    private template: string | null = null;

    constructor() {
        this.graphicsStack.push(new SvgCanvasGraphicState());
    }

    public static fromTemplate(template: string): SvgCanvas {
        const c = new SvgCanvas();
        c.template = template;
        c.idCount = new Date().getTime();
        return c;
    }

    public render(viewbox: Rect2D, unit: string = "mm"): string {
        const svgns = `xmlns="http://www.w3.org/2000/svg"`;
        const xlinkns = `xmlns:xlink="http://www.w3.org/1999/xlink"`;
        const vbox = `viewBox="${viewbox.x} ${viewbox.y} ${viewbox.w} ${viewbox.h}"`;
        const defs = `<defs>\n${
                this.assets.map(x => typeof x === "string" ? x : x.toDef()).join("\n")
            }</defs>`;

        if (! this.template) {
            return `<svg ${svgns} ${xlinkns} version="1.1" width="${viewbox.w}${unit}" height="${viewbox.h}${unit}" ${vbox}>\n${
                defs}\n${this.contentSaved}${this.content}</svg>`;
        } else {
            let tmpl = this.template.replace(/<\/svg>\s*$/, '');

            {
                const re = /(<svg[^>]*?)\s+?width\s*?=\s*?["'](?:[^"'>]+?)["']([^>]*?>)/;
                if (re.test(tmpl)) {
                    tmpl = tmpl.replace(re, `$1 width="${viewbox.w}${unit}"$2`);
                } else {
                    tmpl = tmpl.replace(/<svg\s/, `<svg width="${viewbox.w}${unit}" `);
                }
            }
            {
                const re = /(<svg[^>]*?)\s+?height\s*?=\s*?["'](?:[^"'>]+?)["']([^>]*?>)/;
                if (re.test(tmpl)) {
                    tmpl = tmpl.replace(re, `$1 height="${viewbox.h}${unit}"$2`);
                } else {
                    tmpl = tmpl.replace(/<svg\s/, `<svg height="${viewbox.h}${unit}" `);
                }
            }
            {
                const re = /(<svg[^>]*?)\s+?viewBox\s*?=\s*?["'](?:[^"'>]+?)["']([^>]*?>)/;
                if (re.test(tmpl)) {
                    tmpl = tmpl.replace(re, `$1 ${vbox}$2`);
                } else {
                    tmpl = tmpl.replace(/<svg\s/, `<svg ${vbox} `);
                }
            }

            if (! tmpl.match(/<svg[^>]*?\s+?xmlns:xlink\s*?=/)) {
                tmpl = tmpl.replace(/<svg\s/, `<svg ${xlinkns} `);
            }
            if (! tmpl.match(/<svg[^>]*?\s+?xmlns\s*?=/)) {
                tmpl = tmpl.replace(/<svg\s/, `<svg ${svgns} `);
            }

            return `${tmpl}\n${defs}\n${this.contentSaved}${this.content}</svg>`;
        }
    }

    public toDataUrl(viewbox: Rect2D, unit: string = "mm", lineLength: number = 120): string {
        return "data:image/svg+xml;base64," +
            Base64.encode(TextEncoding.encodeToUtf8(this.render(viewbox, unit)), lineLength);
    }

    /** postscript gsave */
    public save(): void {
        const s = new SvgCanvasGraphicState(this.graphicsStack[this.graphicsStack.length - 1]);
        this.graphicsStack.push(s);
    }
    /** postscript grestore */
    public restore(restorePath: boolean = false): void {
        if (restorePath) {
            if (0 < this.graphicsStack.length) this.graphicsStack.pop();
        } else {
            if (0 < this.graphicsStack.length) {
                const subpath = this.subpath;
                const cpt = this.currentPoint;
                const cptoctm = this.currentPointOnCtm;

                this.graphicsStack.pop();

                this.subpath = subpath;
                this.currentPoint = cpt;
                this.currentPointOnCtm = cptoctm;
            }
        }
    }

    /** postscript x y scale */
    public scale(x: number, y: number): void {
        if (this.currentPointOnCtm !== null) {
            const tm = new TransferMatrix2D().scale(x, y);
            this.currentPointOnCtm = tm.transfer(this.currentPointOnCtm);
        }
        this.ctm = this.ctm.scale(x, y);
    }
    /** postscript x y translate */
    public translate(x: number, y: number): void {
        if (this.currentPointOnCtm !== null) {
            const tm = new TransferMatrix2D().translate(x, y);
            this.currentPointOnCtm = tm.transfer(this.currentPointOnCtm);
        }
        this.ctm = this.ctm.translate(x, y);
    }
    /** postscript (angle*180/PI) rotate */
    public rotate(angle: number): void {
        if (this.currentPointOnCtm !== null) {
            const tm = new TransferMatrix2D().rotate(angle);
            this.currentPointOnCtm = tm.transfer(this.currentPointOnCtm);
        }
        this.ctm = this.ctm.rotate(angle);
    }
    /** postscript [m11 m12 m21 m22 dx dy] concat */
    public transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void {
        const tm = new TransferMatrix2D(m11, m12, m21, m22, dx, dy);
        if (this.currentPointOnCtm !== null)
            this.currentPointOnCtm = tm.transfer(this.currentPointOnCtm);
        this.ctm = this.ctm.concat(tm);
    }
    /** postscript [m11 m12 m21 m22 dx dy] setmatrix */
    public setTransform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void {
        this.currentPointOnCtm = null;
        this.ctm = new TransferMatrix2D(m11, m12, m21, m22, dx, dy);
    }

    /** postscript newpath */
    public beginPath(): void {
        this.subpath = [];
        this.currentPoint = null;
        this.currentPointOnCtm = null;
    }
    /** postscript closepath */
    public closePath(): void {
        this.subpath.push("Z");
        this.currentPoint = null;
        this.currentPointOnCtm = null;
    }

    /** postscript x y moveto */
    public moveTo(x: number, y: number): void {
        const p = new Point2D(x, y);
        this.subpath.push("M", this.ctm.transfer(p));
        this.currentPoint = this.subpath[this.subpath.length - 1] as Point2D;
        this.currentPointOnCtm = p;
    }
    /** postscript x y lineto */
    public lineTo(x: number, y: number, ...extra: number[]): void {
        let p = new Point2D(x, y);
        this.subpath.push("L", this.ctm.transfer(p));
        if (extra && extra.length % 4 === 0) {
            for (let i = 0; i < extra.length; i += 2) {
                if (extra.length <= (i + 1)) break;
                p = new Point2D(extra[i], extra[i + 1]);
                this.subpath.push(this.ctm.transfer(p));
            }
        }
        this.currentPoint = this.subpath[this.subpath.length - 1] as Point2D;
        this.currentPointOnCtm = p;
    }
    public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number, ...extra: number[]): void {
        let p = new Point2D(x, y);
        this.subpath.push("Q",
            this.ctm.transfer(new Point2D(cpx, cpy)),
            this.ctm.transfer(p));
        if (extra && extra.length % 4 === 0) {
            for (let i = 0; i < extra.length; i += 2) {
                if (extra.length <= (i + 1)) break;
                p = new Point2D(extra[i], extra[i + 1]);
                this.subpath.push(this.ctm.transfer(p));
            }
        }
        this.currentPoint = this.subpath[this.subpath.length - 1] as Point2D;
        this.currentPointOnCtm = p;
    }
    /** postscript cp1x cp1y cp2x cp2y x y curveto */
    public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number, ...extra: number[]): void {
        let p = new Point2D(x, y);
        this.subpath.push("C",
            this.ctm.transfer(new Point2D(cp1x, cp1y)),
            this.ctm.transfer(new Point2D(cp2x, cp2y)),
            this.ctm.transfer(p));
        if (extra && extra.length % 6 === 0) {
            for (let i = 0; i < extra.length; i += 2) {
                p = new Point2D(extra[i], extra[i + 1]);
                this.subpath.push(this.ctm.transfer(p));
            }
        }
        this.currentPoint = this.subpath[this.subpath.length - 1] as Point2D;
        this.currentPointOnCtm = p;
    }

    /**
     * postscript arc / arcn
     * anticlockwise= true: x y startAngle endAngle arc
     * anticlockwise=false: x y startAngle endAngle arcn
     * center: (x,y)
     */
    public arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean = true): void {
        const entired = Math.abs(endAngle - startAngle) >= (2 * Math.PI);

        if (Math.abs(startAngle) > (2 * Math.PI)) startAngle = startAngle % (2 * Math.PI);
        if (startAngle < 0)                       startAngle = (2 * Math.PI) - startAngle;
        if (Math.abs(endAngle)   > (2 * Math.PI)) endAngle   = endAngle   % (2 * Math.PI);
        if (endAngle   < 0)                       endAngle   = (2 * Math.PI) - endAngle  ;

        if (entired) {
            endAngle = startAngle + (2 * Math.PI);
        } else {
            if (anticlockwise) {
                [startAngle, endAngle] = [endAngle, startAngle];
            }
            if (endAngle < startAngle) {
                endAngle = endAngle + (2 * Math.PI);
            }
        }
        let angle = endAngle - startAngle;
        let r = 0;
        const PI_2 = Math.PI / 2;

        // approximate the arc by a Bezier curve.
        const k0 = (4 * (Math.sqrt(2) - 1)) / 3; // 0.55228474983...
        const tm0 = new TransferMatrix2D().translate(x, y).scale(radius, radius);

        let points: Point2D[] = [];

        // tslint:disable-next-line:ban-comma-operator
        for (; PI_2 < angle; r += PI_2, angle -= PI_2) {
            const tm = tm0.rotate(startAngle + r);

            if (points.length === 0)
                points.push(tm.transfer(new Point2D(1, 0)));

            points.push(tm.transfer(new Point2D( 1, k0)));
            points.push(tm.transfer(new Point2D(k0,  1)));
            points.push(tm.transfer(new Point2D( 0,  1)));
        }

        const k1 = (4 * Math.tan(angle / 4)) / 3;
        {
            const tm = tm0.rotate(startAngle + r);

            if (points.length === 0)
                points.push(tm.transfer(new Point2D(1, 0)));

            points.push(tm.transfer(new Point2D(1, k1)));
            points.push(tm.transfer(
                new Point2D(
                    Math.cos(angle) + k1 * Math.sin(angle),
                    Math.sin(angle) - k1 * Math.cos(angle))));
            points.push(tm.transfer(
                new Point2D(
                    Math.cos(angle),
                    Math.sin(angle))));
        }
        if (anticlockwise) points = points.reverse();

        const p = points[points.length - 1];
        points = points.map(pt => this.ctm.transfer(pt));
        this.subpath.push(this.subpathIsEmptyOrClosed ? "M" : "L", points.shift() as Point2D, "C");
        this.subpath.push(...points);
        this.currentPoint = this.subpath[this.subpath.length - 1] as Point2D;
        this.currentPointOnCtm = p;
    }

    /** postscript x1 y1 x2 y2 arcto */
    public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        const p0 = this.currentPointOnCtm;
        if (p0 === null) {
            return;
        }

        const p1 = new Point2D(x1, y1);
        const p2 = new Point2D(x2, y2);

        const v1 = Vector2D.fromPoints(p0, p1);
        const v2 = Vector2D.fromPoints(p1, p2);

        if ((v1.x === 0 && v2.x === 0) || (v1.y === 0 && v2.y === 0) ||
            v1.isZero() || v2.isZero()) {
            this.subpath.push("L", this.ctm.transfer(p1), this.ctm.transfer(p2));
            this.currentPointOnCtm = p2;
            return;
        }

        const arcAngle = Vector2D.getAngle(v1, v2);
        if (arcAngle === 0 || arcAngle === Math.PI) {
            this.subpath.push("L", this.ctm.transfer(p1), this.ctm.transfer(p2));
            this.currentPointOnCtm = p2;
            return;
        }
        const linesAngle = Math.PI - arcAngle;

        const a = radius / Math.sin(linesAngle / 2);
        const b = Math.abs(Math.cos(linesAngle / 2) * a);

        let vang1 = Vector2D.fromPoints(p1, p0).getAngle();
        let vang2 = v2.getAngle();

        const cp1 = new Point2D(
            b * Math.cos(vang1) + p1.x,
            b * Math.sin(vang1) + p1.y);
        const cp2 = new Point2D(
            b * Math.cos(vang2) + p1.x,
            b * Math.sin(vang2) + p1.y);
        if (Math.abs(vang2 - vang1) > Math.PI) {
            if (vang2 > vang1) vang1 += Math.PI * 2;
            else               vang2 += Math.PI * 2;
        }
        const center = new Point2D(
            a * Math.cos((vang1 + vang2) / 2) + p1.x,
            a * Math.sin((vang1 + vang2) / 2) + p1.y);

        const vcp1 = Vector2D.fromPoints(center, cp1);
        const vcp2 = Vector2D.fromPoints(center, cp2);
        let angcp1 = vcp1.getAngle();
        let angcp2 = vcp2.getAngle();
        if (Math.abs(angcp2 - angcp1) > Math.PI) {
            if (angcp2 > angcp1) angcp1 += Math.PI * 2;
            else                 angcp2 += Math.PI * 2;
        }

        // this.subpath.push("L", this.ctm.transfer(cp1), this.ctm.transfer(center), this.ctm.transfer(cp2)); // debug
        this.arc(center.x, center.y, radius, angcp1, angcp2, angcp1 >= angcp2);
        this.lineTo(x2, y2);
    }

    public circle(x: number, y: number, radius: number, anticlockwise: boolean = true): void {
        if (! this.subpathIsEmptyOrClosed) this.closePath();
        this.arc(x, y, radius, 0, 2 * Math.PI, anticlockwise);
        this.closePath();
    }

    public rect(x: number, y: number, w: number, h: number, anticlockwise: boolean = true): void {
        if (anticlockwise) {
            this.subpath.push(
                "M", this.ctm.transfer(new Point2D(x, y)), "L",
                this.ctm.transfer(new Point2D(x, y + h)), this.ctm.transfer(new Point2D(x + w, y + h)),
                this.ctm.transfer(new Point2D(x + w, y)), "Z"
                );
        } else {
            this.subpath.push(
                "M", this.ctm.transfer(new Point2D(x, y)), "L",
                this.ctm.transfer(new Point2D(x + w, y)), this.ctm.transfer(new Point2D(x + w, y + h)),
                this.ctm.transfer(new Point2D(x, y + h)), "Z"
                );
        }
        this.currentPoint = null;
        this.currentPointOnCtm = null;
    }

    public roundRect(x: number, y: number, w: number, h: number, radius: number, anticlockwise: boolean = true): void {
        if (anticlockwise) {
            this.moveTo(x        , y + h / 2);
            this. arcTo(x        , y + h    , x + w / 2, y + h    , radius);
            this. arcTo(x + w    , y + h    , x + w    , y + h / 2, radius);
            this. arcTo(x + w    , y        , x + w / 2, y        , radius);
            this. arcTo(x        , y        , x        , y + h / 2, radius);
        } else {
            this.moveTo(x + w / 2, y        );
            this. arcTo(x + w    , y        , x + w    , y + h / 2, radius);
            this. arcTo(x + w    , y + h    , x + w / 2, y + h    , radius);
            this. arcTo(x        , y + h    , x        , y + h / 2, radius);
            this. arcTo(x        , y        , x + w / 2, y        , radius);
        }
        this.closePath();
    }

    private getInheritedStyle(style: string | SvgCanvas2DLinerGradient | SvgCanvas2DRadialGradient | SvgCanvas2DPattern):
            {style: string | SvgCanvas2DLinerGradient | SvgCanvas2DRadialGradient | SvgCanvas2DPattern, alpha: number} {

        let found: RegExpMatchArray | null;
        const styleStr = style.toString();
        let alpha = this.globalAlpha;

        let color: {r: number, g: number, b: number, a: number} | {h: number, s: number, l: number, a: number} | boolean;

        // tslint:disable-next-line:no-conditional-assignment
        if (color = WebColor.isRgb(styleStr)) {
            const rgba = color as {r: number, g: number, b: number, a: number};
            alpha *= rgba.a;
            style = `rgb(${rgba.r},${rgba.g},${rgba.b})`;
        }
        // tslint:disable-next-line:no-conditional-assignment
        else if (color = WebColor.isHsl(styleStr)) {
            const hsla = color as {h: number, s: number, l: number, a: number};
            alpha *= hsla.a;
            style = `hsl(${hsla.h},${hsla.s * 100}%,${hsla.l * 100}%)`;
        }
        else if (! this.ctm.isIdentity()) {
            // tslint:disable-next-line:no-conditional-assignment
            if (found = styleStr.match(/^url\(\#lgrad-(.+)\)$/)) {
                this.assets.push(
                    `<linearGradient id="lgrad-${++this.idCount}" xlink:href="#lgrad-${found[1]}" ` +
                    `gradientTransform="matrix(${this.ctm.toString()})" />`);
                style = `url(#lgrad-${this.idCount})`;
            }
            // tslint:disable-next-line:no-conditional-assignment
            else if (found = styleStr.match(/^url\(\#rgrad-(.+)\)$/)) {
                this.assets.push(
                    `<radialGradient id="rgrad-${++this.idCount}" xlink:href="#rgrad-${found[1]}" ` +
                    `gradientTransform="matrix(${this.ctm.toString()})" />`);
                style = `url(#rgrad-${this.idCount})`;
            }
            // tslint:disable-next-line:no-conditional-assignment
            else if (found = styleStr.match(/^url\(\#pat-(.+)\)$/)) {
                this.assets.push(
                    `<pattern id="pat-${++this.idCount}" xlink:href="#pat-${found[1]}" ` +
                    `patternTransform="matrix(${this.ctm.toString()})" />`);
                style = `url(#pat-${this.idCount})`;
            }
        }
        return {style, alpha};
    }

    private getStrokeAttrs(): string {
        const styleAndAlpha = this.getInheritedStyle(this.strokeStyle);
        return `stroke="${styleAndAlpha.style}" stroke-width="${this.lineWidth}" ` +
            `stroke-linecap="${this.lineCap}" stroke-linejoin="${this.lineJoin}" stroke-miterlimit="${this.miterLimit}" ` +
            (this.getLineDash().length > 0 ?
                `stroke-dasharray="${this.getLineDash().join(",")}" stroke-dashoffset="${this.lineDashOffset}" ` : "") +
            `stroke-opacity="${styleAndAlpha.alpha}" `;
    }
    private getFillAttrs(fillRule: string): string {
        const styleAndAlpha = this.getInheritedStyle(this.fillStyle);
        return `fill="${styleAndAlpha.style}" fill-rule="${fillRule}" fill-opacity="${styleAndAlpha.alpha}" `;
    }

    private getFilterAttrs(): string {
        if (this.filterIdUrl === "") {
            // do nothing.
        } else if (this.filterIdUrl === null) {
            if (0 < this.shadowBlur || (
                this.globalCompositeOperation &&
                this.globalCompositeOperation !== "source-over")) {

                let content = "";
                let merge   = "";

                if (0 < this.shadowBlur) {
                    content +=
                        `<feGaussianBlur stdDeviation="${this.shadowBlur}" result="blur" />\n` +
                        `<feOffset in="blur" dx="${this.shadowOffsetX}" dy="${this.shadowOffsetY}" result="offsetBlur" />\n`;
                    if (this.shadowColor === null) {
                        merge +=
                            `<feMergeNode in="offsetBlur" />`;
                    } else {
                        const c = new WebColor(this.shadowColor);
                        content +=
                            `<feColorMatrix in="offsetBlur" type="matrix" values="` +
                            ` 1 1 1 0 0 ` +
                            ` 1 1 1 0 0 ` +
                            ` 1 1 1 0 0 ` +
                            ` 0 0 0 1 0 " result="color1" />\n` +
                            `<feColorMatrix in="color1" type="matrix" values="` +
                            ` ${c.r / 255} 0 0 0 0 ` +
                            ` 0 ${c.g / 255} 0 0 0 ` +
                            ` 0 0 ${c.b / 255} 0 0 ` +
                            ` 0 0 0 ${c.a} 0 " result="color2" />\n`;
                        merge +=
                            `<feMergeNode in="color2" />\n`;
                    }
                }
                if (this.globalCompositeOperation && this.globalCompositeOperation !== "source-over") {
                    let op = this.globalCompositeOperation;
                    let reverse = false;
                    switch (op) {
                        case "destination-in":
                            reverse = true;
                        case "source-in":
                            op = "in";
                            break;
                        case "destination-out":
                            reverse = true;
                        case "source-out":
                            op = "out";
                            break;
                        case "destination-atop":
                            reverse = true;
                        case "source-atop":
                            op = "atop";
                            break;
                        case "xor":
                            op = "xor";
                            break;
                        case "destination-over":
                            reverse = true;
                        default: // lighter|copy|arithmetic
                            op = "over";
                            break;
                    }
                    content +=
                        `<feComposite in${reverse ? "2" : ""}="SourceGraphic" ` +
                        `in${reverse ? "" : "2"}="BackgroundImage" operator="${op}" result="comp"/>\n`;
                    merge   += `<feMergeNode in="comp" />\n`;
                } else {
                    merge   += `<feMergeNode in="SourceGraphic" />\n`;
                }

                this.assets.push(
                    `<filter id="filter-${++this.idCount}" filterUnits="userSpaceOnUse">\n` +
                    `${content}<feMerge>\n${merge}</feMerge>\n</filter>`);

                this.filterIdUrl = `url(#filter-${this.idCount})`;
                return `filter="${this.filterIdUrl}" `;
            } else {
                this.filterIdUrl = "";
            }
        } else if (this.filterIdUrl !== "") {
            return `filter="${this.filterIdUrl}" `;
        }
        return "";
    }

    private getMultilineTextHeight(c: SvgTextAttributes) {
        if ((c.multiline) &&
            typeof this.font === 'string' &&
            (c.lineHeight === void 0 || c.lineHeight === null)) {

            const re = new RegExp(
                '^\\s*(?:normal|italic|oblique)?\s*' +
                '(?:normal|small-caps)?\\s*' +
                '(?:normal|bold|lighter|bolder|100|200|300|400|500|600|700|800|900)??\\s*' +
                '(?:([0-9.]+)(px|pt|mm|cm|in|pc)?)(?:\\/(?:([0-9.]+|normal)(px|pt|mm|cm|in|em|%)?))?');

            const x = re.exec(this.font);
            if (x) {
                // px
                let fontSizePx = Number(x[1]);
                switch (x[2]) {
                    case 'pt':
                        // 1pt === 1/72in === (1/72)*96px
                        fontSizePx = (fontSizePx / 72.0) * 96.0;
                        break;
                    case 'pc':
                        fontSizePx = (fontSizePx / 72.0) * 96.0 / 12.0;
                        break;
                    case 'mm':
                        // 1mm === 1/25.4in === (1/25.4)*96px
                        fontSizePx = (fontSizePx / 25.4) * 96.0;
                        break;
                    case 'cm':
                        fontSizePx = (fontSizePx / 25.4) * 96.0 * 100.0;
                        break;
                    case 'in':
                        // 1in === 96px
                        fontSizePx = fontSizePx * 96.0;
                        break;
                }

                let lineHeight = fontSizePx;
                if (x[3]) {
                    lineHeight = Number(x[3]) || 1.3;
                    switch (x[4]) {
                        case 'px':
                            break;
                        case 'pt':
                            // 1pt === 1/72in === (1/72)*96px
                            lineHeight = (lineHeight / 72.0) * 96.0;
                            break;
                        case 'pc':
                            lineHeight = (lineHeight / 72.0) * 96.0 / 12.0;
                            break;
                        case 'mm':
                            // 1mm === 1/25.4in === (1/25.4)*96px
                            lineHeight = (lineHeight / 25.4) * 96.0;
                            break;
                        case 'cm':
                            lineHeight = (lineHeight / 25.4) * 96.0 * 100.0;
                            break;
                        case 'in':
                            // 1in === 96px
                            lineHeight = lineHeight * 96.0;
                            break;
                        case '%':
                            lineHeight = lineHeight / 100 * fontSizePx;
                            break;
                        default:
                            lineHeight = lineHeight * fontSizePx;
                            break;
                    }
                }
                c.lineHeight = lineHeight;
            }
        }
        return c;
    }

    private getTextAttributes(maxWidthOrExtraAttrs: number | SvgTextAttributes | null | undefined): string {
        let textAlign: TextAlignValue;
        switch (this.textAlign) {
        case "left":
            textAlign = "start";
            break;
        case "right":
            textAlign = "end";
            break;
        case "center":
            textAlign = "middle";
            break;
        default:
            textAlign = this.textAlign;
            break;
        }

        let textBaseline: TextBaselineValue;
        switch (this.textBaseline) {
        case "top":
            textBaseline = "text-before-edge";
            break;
        case "bottom":
            textBaseline = "text-after-edge";
            break;
        default:
            textBaseline = this.textBaseline;
            break;
        }

        let a = ` style="font:${Escape.xml(this.font)};" text-anchor="${textAlign}" dominant-baseline="${textBaseline}"`;

        if (maxWidthOrExtraAttrs === void 0 || maxWidthOrExtraAttrs === null) {
            return a;
        } else if (typeof maxWidthOrExtraAttrs === "number") {
            a += ` textLength="${maxWidthOrExtraAttrs}"`;
            return a;
        }

        const c = this.getMultilineTextHeight(maxWidthOrExtraAttrs);

        if (c.textLength                 !== void 0 && c.textLength                 !== null) a += ` textLength="${c.textLength}"`;
        if (c.lengthAdjust               !== void 0 && c.lengthAdjust               !== null) a += ` lengthAdjust="${c.lengthAdjust}"`;
        if (c.rotate                     !== void 0 && c.rotate                     !== null) a += ` rotate="${c.rotate}"`;
        if (c.writingMode                !== void 0 && c.writingMode                !== null) a += ` writing-mode="${c.writingMode}"`;
        if (c.glyphOrientationVertical   !== void 0 && c.glyphOrientationVertical   !== null) a += ` glyph-orientation-vertical="${c.glyphOrientationVertical}"`;
        if (c.glyphOrientationHorizontal !== void 0 && c.glyphOrientationHorizontal !== null) a += ` glyph-orientation-horizontal="${c.glyphOrientationHorizontal}"`;
        if (c.direction                  !== void 0 && c.direction                  !== null) a += ` direction="${c.direction}"`;
        if (c.unicodeBidi                !== void 0 && c.unicodeBidi                !== null) a += ` unicode-bidi="${c.unicodeBidi}"`;
        if (c.textDecoration             !== void 0 && c.textDecoration             !== null) a += ` text-decoration="${c.textDecoration}"`;
        if (c.kerning                    !== void 0 && c.kerning                    !== null) a += ` kerning="${c.kerning}"`;
        if (c.letterSpacing              !== void 0 && c.letterSpacing              !== null) a += ` letter-spacing="${c.letterSpacing}"`;
        if (c.wordSpacing                !== void 0 && c.wordSpacing                !== null) a += ` word-spacing="${c.wordSpacing}"`;

        return a;
    }
    private getTextPath(maxWidthOrExtraAttrs: number | SvgTextAttributes | null | undefined): {id: string, offset?: number} | null {
        if (maxWidthOrExtraAttrs !== void 0 && maxWidthOrExtraAttrs !== null && typeof maxWidthOrExtraAttrs === "object") {
            if (maxWidthOrExtraAttrs.textPath) {
                const inv = this.ctm.getInverse();
                const subpath: Array<string | number | Point2D> = [];
                for (const v of this.subpath) {
                    if (v instanceof Point2D) {
                        subpath.push(inv.transfer(v));
                    } else {
                        subpath.push(v);
                    }
                }

                const id = `path-${++this.idCount}`;
                this.assets.push(`<path id="${id}" d="${WordWrap.loose(subpath.join(" "))}" />\n`);
                this.subpath = [];
                this.currentPoint = null;
                this.currentPointOnCtm = null;

                const r: {id: string, offset?: number} = {id: `#${id}`};

                if (maxWidthOrExtraAttrs.textPathOffset !== void 0 && maxWidthOrExtraAttrs.textPathOffset !== null) {
                    r.offset = maxWidthOrExtraAttrs.textPathOffset;
                }
                return r;
            }
        }
        return null;
    }
    private convertToMultiline(text: string, x: number, y: number, maxWidthOrExtraAttrs: number | SvgTextAttributes | null | undefined): string {
        if (maxWidthOrExtraAttrs !== void 0 && maxWidthOrExtraAttrs !== null && typeof maxWidthOrExtraAttrs === "object") {
            if (maxWidthOrExtraAttrs.multiline && !maxWidthOrExtraAttrs.textPath) {
                const h = maxWidthOrExtraAttrs.lineHeight || 12;
                const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
                const a = Escape.xml(s).split("\n");
                switch (maxWidthOrExtraAttrs.writingMode) {
                    case "tb": case "tb-rl":
                        return `<tspan>${a.join(`</tspan><tspan dx="${-h}" y="${y}">`)}</tspan>`;
                    default:
                        return `<tspan>${a.join(`</tspan><tspan x="${x}" dy="${h}">`)}</tspan>`;
                }
            }
        }
        return `<tspan x="${x}" y="${y}">${Escape.xml(text)}</tspan>`;
    }

    public stroke(): void {
        this.content +=
            `<g ${this.getStrokeAttrs()} fill="none" ${this.getFilterAttrs()} ` +
            (this.clipPath.length > 0 ? `clip-path="${this.clipPath}" ` : "") +
            `>\n<path d="${WordWrap.loose(this.subpath.join(" "))}" />\n</g>\n`;
        this.subpath = [];
        this.currentPoint = null;
        this.currentPointOnCtm = null;
    }
    public strokeRect(x: number, y: number, w: number, h: number): void {
        this.content +=
            `<g ${this.getStrokeAttrs()} fill="none" ${this.getFilterAttrs()} ` +
            (this.clipPath.length > 0 ? `clip-path="${this.clipPath}" ` : "") +
            `>\n<rect x="${x}" y="${y}" width="${w}" height="${h}" ` +
            `transform="matrix(${this.ctm.toString()})" ` +
            "/></g>\n";
    }
    public strokeText(text: string, x: number, y: number, maxWidthOrExtraAttrs?: number | SvgTextAttributes): void {
        const path = this.getTextPath(maxWidthOrExtraAttrs);
        this.content +=
            `<g ${this.getStrokeAttrs()} fill="none" ${this.getFilterAttrs()} ` +
            (this.clipPath.length > 0 ? `clip-path="${this.clipPath}" ` : "") +
            `>\n<text` +
            `${this.getTextAttributes(maxWidthOrExtraAttrs)} transform="matrix(${this.ctm.toString()})" ` +
            `\n>${path !== null ? `<textPath xlink:href="${path.id}"${path.offset !== void 0 ? ` startOffset="${path.offset}"` : ""}\n>` : ""}` +
            this.convertToMultiline(text, x, y, maxWidthOrExtraAttrs) +
            `${path !== null ? "</textPath>" : ""}</text></g>\n`;
    }

    /**
     * fillRule: nonzero|evenodd
     */
    public fill(fillRule: string = "nonzero"): void {
        this.content +=
            `<g stroke="none" ${this.getFillAttrs(fillRule)} ${this.getFilterAttrs()} ` +
            (this.clipPath.length > 0 ? `clip-path="${this.clipPath}" ` : "") +
            `>\n<path d="${WordWrap.loose(this.subpath.join(" "))}" />\n</g>\n`;
        this.subpath = [];
        this.currentPoint = null;
        this.currentPointOnCtm = null;
    }
    public fillRect(x: number, y: number, w: number, h: number): void {
        this.content +=
            `<g stroke="none" ${this.getFillAttrs("nonzero")} ${this.getFilterAttrs()} ` +
            (this.clipPath.length > 0 ? `clip-path="${this.clipPath}" ` : "") +
            `>\n<rect x="${x}" y="${y}" width="${w}" height="${h}" ` +
            `transform="matrix(${this.ctm.toString()})" ` +
            "/></g>\n";
    }
    public fillText(text: string, x: number, y: number, maxWidthOrExtraAttrs?: number | SvgTextAttributes): void {
        const path = this.getTextPath(maxWidthOrExtraAttrs);
        this.content +=
            `<g stroke="none" ${this.getFillAttrs("nonzero")} ${this.getFilterAttrs()} ` +
            (this.clipPath.length > 0 ? `clip-path="${this.clipPath}" ` : "") +
            `>\n<text` +
            `${this.getTextAttributes(maxWidthOrExtraAttrs)} transform="matrix(${this.ctm.toString()})" ` +
            `\n>${path !== null ? `<textPath xlink:href="${path.id}"${path.offset !== void 0 ? ` startOffset="${path.offset}"` : ""}\n>` : ""}` +
            this.convertToMultiline(text, x, y, maxWidthOrExtraAttrs) +
            `${path !== null ? "</textPath>" : ""}</text></g>\n`;
    }

    /**
     * fillRule: nonzero|evenodd
     */
    public fillStroke(fillRule: string = "nonzero"): void {
        this.content +=
            `<g ${this.getFillAttrs(fillRule)} ${this.getStrokeAttrs()} ${this.getFilterAttrs()} ` +
            (this.clipPath.length > 0 ? `clip-path="${this.clipPath}" ` : "") +
            `>\n<path d="${WordWrap.loose(this.subpath.join(" "))}" />\n</g>\n`;
        this.subpath = [];
        this.currentPoint = null;
        this.currentPointOnCtm = null;
    }
    public fillStrokeRect(x: number, y: number, w: number, h: number): void {
        this.content +=
            `<g ${this.getFillAttrs("nonzero")} ${this.getStrokeAttrs()} ${this.getFilterAttrs()} ` +
            (this.clipPath.length > 0 ? `clip-path="${this.clipPath}" ` : "") +
            `>\n<rect x="${x}" y="${y}" width="${w}" height="${h}" ` +
            `transform="matrix(${this.ctm.toString()})" ` +
            "/></g>\n";
    }
    public fillStrokeText(text: string, x: number, y: number, maxWidthOrExtraAttrs?: number | SvgTextAttributes): void {
        const path = this.getTextPath(maxWidthOrExtraAttrs);
        this.content +=
            `<g ${this.getFillAttrs("nonzero")} ${this.getStrokeAttrs()} ${this.getFilterAttrs()} ` +
            (this.clipPath.length > 0 ? `clip-path="${this.clipPath}" ` : "") +
            `>\n<text` +
            `${this.getTextAttributes(maxWidthOrExtraAttrs)} transform="matrix(${this.ctm.toString()})" ` +
            `\n>${path !== null ? `<textPath xlink:href="${path.id}"${path.offset !== void 0 ? ` startOffset="${path.offset}"` : ""}\n>` : ""}` +
            this.convertToMultiline(text, x, y, maxWidthOrExtraAttrs) +
            `${path !== null ? "</textPath>" : ""}</text></g>\n`;
    }

    public getLineDash(): number[] {
        return this.lineDash;
    }
    public setLineDash(segments: number[]): void {
        this.lineDash = segments;
    }

    /**
     * fillRule: nonzero|evenodd
     */
    public clip(fillRule: string = "nonzero"): void {
        const a =
            `<clipPath id="clip-${++this.idCount}" fill-rule="${fillRule}" >` +
            `<path d="${WordWrap.loose(this.subpath.join(" "))}" /></clipPath>`;
        this.assets.push(a);
        this.clipPath = `url(#clip-${this.idCount})`;
        this.subpath = [];
        this.currentPoint = null;
        this.currentPointOnCtm = null;
    }

    public registerImage(imageData: HTMLImageElement | HTMLCanvasElement | SvgCanvasImageData, id?: string): string {
        const img = imageData = this.convertImageToSvgImageData(imageData);
        const imgId = (id === null || id === void 0) ? `img-${++this.idCount}_w${img.width}_h${img.height}` : id;
        const a =
            `<image id="${imgId}" \n` +
            `x="${0}" y="${0}" width="${1}" height="${1}" ` +
            `preserveAspectRatio="none" ` +
            `xlink:href="${img.url}" />`;
        this.assets.push(a);
        return `#${imgId}`;
    }

    public registerCustomFilter(id: string, markup: string): void {
        this.assets.push(markup);
        this.filterIdUrl = `url(#${id})`;
    }

    public registerCustomAsset(markup: string | SvgCanvas2DAsset): void {
        this.assets.push(markup);
    }
    public appendCustomContent(markup: string): void {
        this.content += `<g transform="matrix(${this.ctm.toString()})">${markup}</g>\n`;
    }

    public createLinearGradient(x0: number, y0: number, x1: number, y1: number): SvgCanvas2DLinerGradient {
        const a = new SvgCanvas2DLinerGradient(`lgrad-${++this.idCount}`, x0, y0, x1, y1);
        this.assets.push(a);
        return a;
    }
    /** fr is ignored. fr is always 0. */
    public createRadialGradient(cx: number, cy: number, r: number, fx: number, fy: number, fr?: number): SvgCanvas2DRadialGradient {
        const a = new SvgCanvas2DRadialGradient(`rgrad-${++this.idCount}`, cx, cy, r, fx, fy);
        this.assets.push(a);
        return a;
    }

    public createPattern(imageData: HTMLImageElement | HTMLCanvasElement | SvgCanvasImageData, repetition?: string): SvgCanvas2DPattern {
        const a = new SvgCanvas2DPattern(`pat-${++this.idCount}`, this.convertImageToSvgImageData(imageData));
        this.assets.push(a);
        return a;
    }
    public beginPattern(): void {
        this.contentSaved = this.content;
        this.content = "";
        const s = new SvgCanvasGraphicState();
        this.graphicsStack.push(s);
    }
    public endPattern(x: number, y: number, width: number, height: number): string {
        const id = ++this.idCount;
        const a =
            `<pattern id="pat-${id}" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse" ` +
            `x="${x}" y="${y}" width="${width}" height="${height}">\n${this.content}</pattern>`;
        this.assets.push(a);
        this.content = this.contentSaved;
        this.contentSaved = "";
        this.restore();
        return `url(#pat-${id})`;
    }

    private convertImageToSvgImageData(imageData: HTMLImageElement | HTMLCanvasElement | SvgCanvasImageData): SvgCanvasImageData {
        let img: SvgCanvasImageData;
        if (typeof HTMLImageElement !== "undefined" && imageData instanceof HTMLImageElement) {
            const c = document.createElement("canvas");
            c.width = imageData.width;
            c.height = imageData.height;
            const ctx = c.getContext("2d");
            if (ctx === null) {
                throw new Error("SvgCanvas#convertImageToSvgImageData: Can't get context from Canvas.");
            }
            ctx.drawImage(imageData, 0, 0);
            img = new SvgCanvasImageData(c.toDataURL(), 0, 0, c.width, c.height);
        } else if (typeof HTMLCanvasElement !== "undefined" && imageData instanceof HTMLCanvasElement) {
            img = new SvgCanvasImageData(imageData.toDataURL(), 0, 0, imageData.width, imageData.height);
        } else {
            img = imageData as SvgCanvasImageData;
        }
        return img;
    }

    public drawImage(imageData: HTMLImageElement | HTMLCanvasElement | SvgCanvasImageData | string,
                     canvasOffsetX: number, canvasOffsetY: number,
                     canvasImageWidth: number, canvasImageHeight: number): void {
        let img: SvgCanvasImageData;
        if (typeof imageData === "string")
            img = new SvgCanvasImageData(imageData, 0, 0, canvasImageWidth, canvasImageHeight);
        else
            img = this.convertImageToSvgImageData(imageData);

        if (img.url.startsWith("#")) {
            const tm = this.ctm.translate(canvasOffsetX, canvasOffsetY).scale(canvasImageWidth, canvasImageHeight);
            this.content +=
                `<g><use x="0" y="0" ` +
                `transform="matrix(${tm.toString()})" ` +
                `\nxlink:href="${img.url}" /></g>\n`;
        } else {
            this.content +=
                `<g><image x="${canvasOffsetX}" y="${canvasOffsetY}" ` +
                `width="${canvasImageWidth}" height="${canvasImageHeight}" ` +
                `preserveAspectRatio="none" ` +
                `transform="matrix(${this.ctm.toString()})" ` +
                `\nxlink:href="${img.url}" /></g>\n`;
        }
    }

    public beginGroup(): void {
        this.content += "<g>";
    }
    public endGroup(): void {
        this.content += "</g>";
    }
}
