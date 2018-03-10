// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import * as RedAgate         from '../red-agate';
import { WebColor }          from 'red-agate-svg-canvas/modules/drawing/canvas/WebColor';
import { SvgCanvas,
         SvgTextAttributes,
         TextAlignValue,
         TextBaselineValue } from 'red-agate-svg-canvas/modules/drawing/canvas/SvgCanvas';
import { Rect2D }            from 'red-agate-svg-canvas/modules/drawing/canvas/TransferMatrix2D';



export const CONTEXT_SVG_CANVAS = 'CONTEXT_SVG_CANVAS';
export const CONTEXT_SVG_PATH   = 'CONTEXT_SVG_PATH';
export const CONTEXT_ASSET_     = 'CONTEXT_ASSET_';



export interface ShapeBaseProps extends RedAgate.ComponentProps {
    x?: number;
    y?: number;
    margin?: number;
}

export interface ShapeProps extends ShapeBaseProps {
    fill?: boolean;
    stroke?: boolean;
    fillColor?: string | WebColor;
    strokeColor?: string | WebColor;
    lineCap?: "butt" | "round" | "square";
    lineJoin?: "miter" | "round" | "bevel";
    lineWidth?: number;
    miterLimit?: number;
    lineDash?: number[];
    lineDashOffset?: number;
}

export interface AmbientProps extends ShapeProps {
    scaleX?: number;
    scaleY?: number;
    rotationDeg?: number;
    tm?: number[];
}



export const shapePropsDefault: ShapeProps = {
    x: 0,
    y: 0,
    margin: 0,
};

export abstract class Shape<T extends ShapeProps> extends RedAgate.RedAgatePhantomComponent<T> {
    protected isAmbient = false;
    protected isPathFragment = false;
    protected isGroup = true;

    public constructor(props: T) {
        super(props);
    }

    protected initializeCanvas(canvas: SvgCanvas) {
        if (this.props.fill || this.isAmbient) {
            if (this.props.fillColor !== void 0 && this.props.fillColor !== null)
                canvas.fillStyle = this.props.fillColor.toString();
        }
        if (this.props.stroke || this.isAmbient) {
            if (this.props.strokeColor !== void 0 && this.props.strokeColor !== null)
                canvas.strokeStyle = this.props.strokeColor.toString();
            if (this.props.lineCap !== void 0 && this.props.lineCap !== null)
                canvas.lineCap = this.props.lineCap;
            if (this.props.lineJoin !== void 0 && this.props.lineJoin !== null)
                canvas.lineJoin = this.props.lineJoin;
            if (this.props.lineWidth !== void 0 && this.props.lineWidth !== null)
                canvas.lineWidth = this.props.lineWidth;
            if (this.props.miterLimit !== void 0 && this.props.miterLimit !== null)
                canvas.miterLimit = this.props.miterLimit;
            if (this.props.lineDash !== void 0 && this.props.lineDash !== null)
                canvas.setLineDash(this.props.lineDash);
            if (this.props.lineDashOffset !== void 0 && this.props.lineDashOffset !== null)
                canvas.lineDashOffset = this.props.lineDashOffset;
        }
        if (this.isAmbient) {
            const ambientProps = this.props as AmbientProps;
            if (ambientProps.margin || ambientProps.x || ambientProps.y) {
                canvas.translate(
                    (ambientProps.margin || 0) + (ambientProps.x || 0),
                    (ambientProps.margin || 0) + (ambientProps.y || 0)
                    );
            }
            if (ambientProps.scaleX !== void 0 && ambientProps.scaleX !== null) {
                canvas.scale(ambientProps.scaleX, 1);
            }
            if (ambientProps.scaleY !== void 0 && ambientProps.scaleY !== null) {
                canvas.scale(1, ambientProps.scaleY);
            }
            if (ambientProps.rotationDeg !== void 0 && ambientProps.rotationDeg !== null) {
                canvas.rotate(ambientProps.rotationDeg * Math.PI / 180);
            }
            if (ambientProps.tm !== void 0 && ambientProps.tm !== null && ambientProps.tm.length >= 6) {
                canvas.transform(
                    ambientProps.tm[0],
                    ambientProps.tm[1],
                    ambientProps.tm[2],
                    ambientProps.tm[3],
                    ambientProps.tm[4],
                    ambientProps.tm[5]
                    );
            }
        }
    }

    protected setGraphicState(canvas: SvgCanvas) {
        if (this.isGroup) {
            canvas.beginGroup();
        }
        canvas.save();
        canvas.translate(
            (this.props.margin as number) + (this.props.x as number),
            (this.props.margin as number) + (this.props.y as number)
        );
        this.initializeCanvas(canvas);
    }

    protected restoreGraphicState(canvas: SvgCanvas) {
        canvas.restore();
        if (this.isGroup) {
            canvas.endGroup();
        }
    }

    protected fillStrokePaths(canvas: SvgCanvas) {
        if (this.props.fill && this.props.stroke) {
            canvas.fillStroke();
        }
        else if (this.props.fill)   canvas.fill();
        else if (this.props.stroke) canvas.stroke();
    }

    public beforeRender(contexts: Map<string, any>) {
        this.isPathFragment = this.getContext(contexts, CONTEXT_SVG_PATH) || false;
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        if (canvas) {
            if (!this.isPathFragment) {
                this.setGraphicState(canvas);
            }
        }
    }

    public afterRender(contexts: Map<string, any>) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        if (canvas) {
            if (!this.isPathFragment) {
                this.fillStrokePaths(canvas);
                this.restoreGraphicState(canvas);
            }
        }
    }
}



export interface ImagingShapeBasePropsMixin {
    asDataUrl?: boolean;
    asImgTag?: boolean;
    unit?: string;
}

export interface ImagingShapeBaseProps extends ShapeBaseProps, ImagingShapeBasePropsMixin {
}

export interface ImagingShapeProps extends ShapeProps, ImagingShapeBasePropsMixin {
}

export function renderSvgCanvas(props: ImagingShapeBasePropsMixin, canvas: SvgCanvas, imageWidth: number, imageHeight: number): string {
    if (props.asImgTag) {
        return (
            `<img style="width:${
                imageWidth}${props.unit};height:${
                    imageHeight}${props.unit};" src="${
                canvas.toDataUrl(new Rect2D(0, 0, imageWidth, imageHeight), props.unit, 120)}" ${
                RedAgate.htmlAttributesRenderer(props, void 0, new Set([])).attrs}"></img>`
        );
    } else if (props.asDataUrl) {
        return canvas.toDataUrl(new Rect2D(0, 0, imageWidth, imageHeight), props.unit, void 0);
    } else {
        return canvas.render(new Rect2D(0, 0, imageWidth, imageHeight), props.unit);
    }
}

export function toSvg(component: RedAgate.RedAgatePhantomComponent<ImagingShapeBaseProps>): string {
    const propsNew = Object.assign({}, component.props);
    propsNew.asDataUrl = false;
    propsNew.asImgTag = false;
    const propsSaved = component.props;

    component.props = propsNew;
    const r = RedAgate.renderAsHtml_noDefer(component);
    component.props = propsSaved;
    return r;
}

export function toDataUrl(component: RedAgate.RedAgatePhantomComponent<ImagingShapeBaseProps>): string {
    const propsNew = Object.assign({}, component.props);
    propsNew.asDataUrl = true;
    propsNew.asImgTag = false;
    const propsSaved = component.props;

    component.props = propsNew;
    const r = RedAgate.renderAsHtml_noDefer(component);
    component.props = propsSaved;
    return r;
}

export function toImgTag(component: RedAgate.RedAgatePhantomComponent<ImagingShapeBaseProps>): string {
    const propsNew = Object.assign({}, component.props);
    propsNew.asDataUrl = false;
    propsNew.asImgTag = true;
    const propsSaved = component.props;

    component.props = propsNew;
    const r = RedAgate.renderAsHtml_noDefer(component);
    component.props = propsSaved;
    return r;
}
