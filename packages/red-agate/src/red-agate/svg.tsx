// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import * as RedAgate          from './red-agate';
import { SvgCanvas,
         SvgTextAttributes,
         TextAlignValue,
         TextBaselineValue }  from 'red-agate-svg-canvas/modules/drawing/canvas/SvgCanvas';
import { Rect2D }             from 'red-agate-svg-canvas/modules/drawing/canvas/TransferMatrix2D';
import { TextEncoding }       from 'red-agate-util/modules/convert/TextEncoding';
import { FileFetcher }        from 'red-agate-util/modules/io/FileFetcher';
import { Logger }             from 'red-agate-util/modules/io/Logger';
import { ShapeBaseProps,
         ShapeProps,
         shapePropsDefault,
         Shape,
         AmbientProps,
         ImagingShapeBasePropsMixin,
         renderSvgCanvas,
         toImgTag,
         toElementStyle,
         toDataUrl,
         toSvg,
         CONTEXT_SVG_CANVAS,
         CONTEXT_SVG_PATH }   from './tags/Shape';



export interface SvgProps extends ShapeBaseProps, ImagingShapeBasePropsMixin {
    width: number;
    height: number;
    unit?: string;
    alt?: string;
    template?: string;
    templateUrl?: string;
}

export class Svg extends RedAgate.RedAgatePhantomComponent<SvgProps> {
    public constructor(props: SvgProps) {
        super(props);
        if (props.template) {
            this.template = props.template;
        }
    }

    private template: string | null = null;

    public defer() {
        if (this.template !== null) {
            return Promise.resolve();
        } else if (this.props.templateUrl === void 0 || this.props.templateUrl === null || this.props.templateUrl === '') {
            return Promise.resolve();
        } else {
            const url = this.props.templateUrl;
            const promise = new Promise<void>((resolve, reject) => {
                try {
                    FileFetcher.fetchLocation(url)
                    .then((result) => {
                        this.template = TextEncoding.decodeUtf8(result.data);
                        resolve();
                    })
                    .catch((e) => {
                        Logger.log("Svg#defer:catch:" + e);
                        reject(e);
                    });
                } catch (e) {
                    Logger.log("Svg#defer:catch:" + e);
                    reject(e);
                }
            });
            return promise;
        }
    }

    public toImgTag(): string {
        return toImgTag(this);
    }

    public toElementStyle(): string {
        return toElementStyle(this);
    }

    public toDataUrl(): string {
        return toDataUrl(this);
    }

    public toSvg(): string {
        return toSvg(this);
    }

    public toRendered(): string {
        return RedAgate.renderAsHtml_noDefer(this);
    }

    public beforeRender(contexts: Map<string, any>) {
        this.setContext(contexts, CONTEXT_SVG_CANVAS,
            this.template === null ? new SvgCanvas() : SvgCanvas.fromTemplate(this.template)
        );
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        return renderSvgCanvas(this.props, canvas, this.props.width, this.props.height);
    }

    public afterRender(contexts: Map<string, any>) {
        this.unsetContext(contexts, CONTEXT_SVG_CANVAS);
    }
}



export const ambientPropsDefault: AmbientProps = Object.assign({}, shapePropsDefault, {
});

export class Ambient extends Shape<AmbientProps> {
    public constructor(props: AmbientProps) {
        super(Object.assign({}, ambientPropsDefault, props));
        this.isAmbient = true;
        this.isGroup = false;
    }

    public render(contexts: Map<string, any>, children: string) {
        return ``;
    }
}



export interface ArcProps extends ShapeProps {
    r: number;
    startDeg: number;
    endDeg: number;
    anticlockwise?: boolean;
}

export const arcPropsDefault: ArcProps = Object.assign({}, shapePropsDefault, {
    r: 1,
    startDeg: 0,
    endDeg: 180,
    anticlockwise: true
});

export class Arc extends Shape<ArcProps> {
    public constructor(props: ArcProps) {
        super(Object.assign({}, arcPropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        canvas.arc(
            this.props.r,
            this.props.r,
            this.props.r,
            this.props.startDeg / 180 * Math.PI, this.props.endDeg / 180 * Math.PI,
            this.props.anticlockwise
            );
        return ``;
    }
}



export type CanvasRenderFn = (canvas: SvgCanvas) => void;

export interface CanvasProps extends ShapeProps {
    children?: CanvasRenderFn | RedAgate.RedAgateNode | RedAgate.RedAgateNode[];
}

export const canvasPropsDefault: CanvasProps = Object.assign({}, shapePropsDefault, {
});

export class Canvas extends Shape<CanvasProps> {
    public constructor(props: CanvasProps) {
        super(Object.assign({}, canvasPropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        const fn: CanvasRenderFn =
            (Array.isArray(this.props.children) ?
                (this.props.children as any[]).find(x => typeof x === 'function') :
                this.props.children) as any;
        fn(canvas);
        return ``;
    }
}



export interface CircleProps extends ShapeProps {
    r: number;
    anticlockwise?: boolean;
}

export const circlePropsDefault: CircleProps = Object.assign({}, shapePropsDefault, {
    r: 1,
    anticlockwise: true
});

export class Circle extends Shape<CircleProps> {
    public constructor(props: CircleProps) {
        super(Object.assign({}, circlePropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        canvas.arc(
            this.props.r,
            this.props.r,
            this.props.r,
            0, 2 * Math.PI,
            this.props.anticlockwise
            );
        canvas.closePath();
        return ``;
    }
}



export interface CurveProps extends ShapeProps {
    move?: boolean;
    points: number[];
}

export const curvePropsDefault: CurveProps = Object.assign({}, shapePropsDefault, {
    move: true,
    points: []
});

export class Curve extends Shape<CurveProps> {
    public constructor(props: CurveProps) {
        super(Object.assign({}, curvePropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        if (this.props.move) canvas.moveTo(this.props.points[0], this.props.points[1]);
        for (let i = this.props.move ? 2 : 0; i < this.props.points.length; i += 6) {
            canvas.bezierCurveTo(
                this.props.points[i + 0],
                this.props.points[i + 1],
                this.props.points[i + 2],
                this.props.points[i + 3],
                this.props.points[i + 4],
                this.props.points[i + 5]
                );
        }
        return ``;
    }
}



export interface GridLineProps extends ShapeProps {
    startX?: number;
    endX?: number;
    startY?: number;
    endY?: number;
    gridSize?: number;
    bleed?: number;
}
export interface GridLinePropsNoUndefined extends ShapeProps {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
    gridSize: number;
    bleed: number;
}

export const gridLinePropsDefault: GridLinePropsNoUndefined = Object.assign({}, shapePropsDefault, {
    lineWidth: 0.1,
    fill: false,
    stroke: true,
    strokeColor: "#ccc",
    startX: 0,
    endX: 210,
    startY: 0,
    endY: 296,
    gridSize: 5,
    bleed: 13
});

export class GridLine extends Shape<GridLineProps> {
    public constructor(props: GridLineProps) {
        super(Object.assign({}, gridLinePropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const props = this.props as GridLinePropsNoUndefined;

        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        const m1 = Math.ceil(props.bleed / props.gridSize) * props.gridSize;
        const mX = Math.ceil((props.endX - props.startX + props.bleed) / props.gridSize) * props.gridSize;
        const mY = Math.ceil((props.endY - props.startY + props.bleed) / props.gridSize) * props.gridSize;

        for (let dx = props.startX - m1; dx <= mX; dx += props.gridSize) {
            canvas.moveTo(props.startX + dx, props.startY - m1);
            canvas.lineTo(props.startX + dx, props.startY + mY);
        }
        for (let dy = props.startY - m1; dy <= mY; dy += props.gridSize) {
            canvas.moveTo(props.startX - m1, props.startY + dy);
            canvas.lineTo(props.startX + mX, props.startY + dy);
        }

        canvas.rect(props.startX || 0, props.startY || 0, props.endX - props.startX, props.endY - props.startY);
        return ``;
    }
}



export interface GroupProps extends ShapeProps {
    scaleX?: number;
    scaleY?: number;
    rotationDeg?: number;
    tm?: number[];
}

export class Group extends Shape<GroupProps> {
    public constructor(props: GroupProps) {
        super(Object.assign({}, {}, props));
        this.isAmbient = true;
    }

    public render(contexts: Map<string, any>, children: string) {
        return ``;
    }
}



export interface LineProps extends ShapeProps {
    move?: boolean;
    points: number[];
}

export const linePropsDefault: LineProps = Object.assign({}, shapePropsDefault, {
    move: true,
    points: []
});

export class Line extends Shape<LineProps> {
    public constructor(props: LineProps) {
        super(Object.assign({}, linePropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        if (this.props.move) canvas.moveTo(this.props.points[0], this.props.points[1]);
        for (let i = this.props.move ? 2 : 0; i < this.props.points.length; i += 2) {
            canvas.lineTo(this.props.points[i], this.props.points[i + 1]);
        }
        return ``;
    }
}



export interface PathProps extends ShapeProps {
    close?: boolean;
    clip?: boolean;
    width?: number;
    height?: number;
}

export const pathPropsDefault: PathProps = Object.assign({}, shapePropsDefault, {
    close: false,
    clip: false,
    width: 10,
    height: 10,
    paths: []
});

export class Path extends Shape<PathProps> {
    public constructor(props: PathProps) {
        super(Object.assign({}, pathPropsDefault, props));
    }

    public beforeRender(contexts: Map<string, any>) {
        this.setContext(contexts, CONTEXT_SVG_PATH, true);
    }

    public render(contexts: Map<string, any>, children: string) {
        return ``;
    }

    public afterRender(contexts: Map<string, any>) {
        this.unsetContext(contexts, CONTEXT_SVG_PATH);
    }
}



export interface PieProps extends ShapeProps {
    r: number;
    startDeg: number;
    endDeg: number;
    anticlockwise?: boolean;
}

export const piePropsDefault: PieProps = Object.assign({}, shapePropsDefault, {
    r: 1,
    startDeg: 0,
    endDeg: 180,
    anticlockwise: true
});

export class Pie extends Shape<PieProps> {
    public constructor(props: PieProps) {
        super(Object.assign({}, piePropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        canvas.moveTo(this.props.r, this.props.r);
        canvas.arc(
            this.props.r,
            this.props.r,
            this.props.r,
            this.props.startDeg / 180 * Math.PI, this.props.endDeg / 180 * Math.PI,
            this.props.anticlockwise
            );
        canvas.closePath();
        return ``;
    }
}



export interface PolygonProps extends ShapeProps {
    points: number[];
}

export const polygonPropsDefault: PolygonProps = Object.assign({}, shapePropsDefault, {
    points: []
});

export class Polygon extends Shape<PolygonProps> {
    public constructor(props: PolygonProps) {
        super(Object.assign({}, polygonPropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        canvas.moveTo(this.props.points[0], this.props.points[1]);
        for (let i = 2; i < this.props.points.length; i += 2) {
            canvas.lineTo(this.props.points[i], this.props.points[i + 1]);
        }
        canvas.closePath();
        return ``;
    }
}



export interface RectProps extends ShapeProps {
    width: number;
    height: number;
}

export const rectPropsDefault: RectProps = Object.assign({}, shapePropsDefault, {
    width: 10,
    height: 10
});

export class Rect extends Shape<RectProps> {
    public constructor(props: RectProps) {
        super(Object.assign({}, rectPropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        canvas.rect(0, 0, this.props.width, this.props.height);
        return ``;
    }
}



export interface RoundRectProps extends ShapeProps {
    width: number;
    height: number;
    r: number;
}

export const roundRectPropsDefault: RoundRectProps = Object.assign({}, shapePropsDefault, {
    width: 10,
    height: 10,
    r: 1
});

export class RoundRect extends Shape<RoundRectProps> {
    public constructor(props: RoundRectProps) {
        super(Object.assign({}, roundRectPropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        canvas.roundRect(0, 0, this.props.width, this.props.height, this.props.r);
        return ``;
    }
}



export interface SvgAssetFragmentProps extends ShapeProps {
}

export const svgAssetFragmentPropsDefault: SvgFragmentProps = Object.assign({}, shapePropsDefault, {
});

export class SvgAssetFragment extends Shape<SvgAssetFragmentProps> {
    public constructor(props: CanvasProps) {
        super(Object.assign({}, canvasPropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        canvas.registerCustomAsset(children);
        return ``;
    }
}



export interface SvgFragmentProps extends ShapeProps {
}

export const svgFragmentPropsDefault: SvgFragmentProps = Object.assign({}, shapePropsDefault, {
});

export class SvgFragment extends Shape<SvgFragmentProps> {
    public constructor(props: CanvasProps) {
        super(Object.assign({}, canvasPropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        canvas.appendCustomContent(children);
        return ``;
    }
}



export interface TextProps extends ShapeProps, SvgTextAttributes {
    font?: string;
    textAlign?: TextAlignValue;
    textBaseline?: TextBaselineValue;
    text: string;
}

export const textPropsDefault: TextProps = Object.assign({}, shapePropsDefault, {
    text: ""
}) as any;

export class Text extends Shape<TextProps> {
    public constructor(props: TextProps) {
        super(Object.assign({}, textPropsDefault, props));
    }

    protected fillStrokeText(canvas: SvgCanvas) {
        if (this.props.font)         canvas.font         = this.props.font;
        if (this.props.textAlign)    canvas.textAlign    = this.props.textAlign;
        if (this.props.textBaseline) canvas.textBaseline = this.props.textBaseline;

        if      (this.props.fill && this.props.stroke) canvas.fillStrokeText(this.props.text, 0, 0, this.props);
        else if (this.props.fill                     ) canvas.      fillText(this.props.text, 0, 0, this.props);
        else if (                   this.props.stroke) canvas.    strokeText(this.props.text, 0, 0, this.props);
    }

    public render(contexts: Map<string, any>, children: string) {
        return ``;
    }

    public afterRender(contexts: Map<string, any>) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        if (!this.isPathFragment) {
            this.fillStrokeText(canvas);
            this.restoreGraphicState(canvas);
        }
    }
}



export interface SvgImpositionProps<T, S> extends RedAgate.ComponentProps {
    items: T[];
    scope?: S;
    paperWidth: number;
    paperHeight: number;
    cols: number;
    rows: number;
    itemRotationDeg?: number | number[/* i */];
    itemTranslation?: number[/* x, y */] | number[/* i */][/* x, y */];
    itemScale?: number[/* x, y */] | number[/* i */][/* x, y */];
}

export class SvgImposition<T, S> extends RedAgate.RedAgateComponent<SvgImpositionProps<T, S>> {
    public constructor(props: SvgImpositionProps<T, S>) {
        super(props);
    }

    public transform() {
        const repeater: (v: T, i: number, items: T[], scope: any) => RedAgate.RedAgateNode =
            (Array.isArray(this.props.children) ?
                (this.props.children as any[]).find(x => typeof x === 'function') :
                this.props.children) as any;
        const a: RedAgate.RedAgateNode[] = [];
        const scope = Object.assign({}, this.props.scope || {});
        for (let i = 0; i < this.props.items.length; i++) {
            a.push(
                <Group
                    x={((this.props.paperWidth  / this.props.cols) * (i % this.props.cols)) +
                        (Array.isArray(this.props.itemTranslation) ?
                            (Array.isArray(this.props.itemTranslation[i]) ?
                                this.props.itemTranslation[i][0] || 0 : this.props.itemTranslation[0] || 0) :
                            0)}
                    y={((this.props.paperHeight / this.props.rows) * (Math.floor(i / this.props.cols))) +
                        (Array.isArray(this.props.itemTranslation) ?
                            (Array.isArray(this.props.itemTranslation[i]) ?
                                this.props.itemTranslation[i][1] || 0 : this.props.itemTranslation[1] || 0) :
                            0)}
                    scaleX={
                        (Array.isArray(this.props.itemScale) ?
                            (Array.isArray(this.props.itemScale[i]) ?
                                this.props.itemScale[i][0] || 1 : this.props.itemScale[0] || 1) :
                            1)}
                    scaleY={
                        (Array.isArray(this.props.itemScale) ?
                            (Array.isArray(this.props.itemScale[i]) ?
                                this.props.itemScale[i][1] || 1 : this.props.itemScale[1] || 1) :
                            1)}
                    rotationDeg={
                        Array.isArray(this.props.itemRotationDeg) ?
                            this.props.itemRotationDeg[i] || 0 :
                            this.props.itemRotationDeg || 0
                    }
                >{repeater(this.props.items[i], i, this.props.items, scope)}</Group>
            );
        }
        return a;
    }
}
