// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export interface VectorCanvas2DGradient {
    addColorStop(offset: number, color: string): void;
}


export interface VectorCanvas2DPattern {
}


/**
 * subset of CanvasRenderingContext2D
 */
export interface VectorCanvas2D {
    globalAlpha: number;
    globalCompositeOperation: string;
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;

    font: string;
    textAlign: string;
    textBaseline: string;

    lineCap: string;
    lineDashOffset: number;
    lineJoin: string;
    lineWidth: number;
    miterLimit: number;

    strokeStyle: string | VectorCanvas2DGradient | VectorCanvas2DPattern;
    fillStyle: string | VectorCanvas2DGradient | VectorCanvas2DPattern;

    save(): void;
    restore(): void;

    scale(x: number, y: number): void;
    translate(x: number, y: number): void;
    rotate(angle: number): void;
    transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void;
    setTransform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void;

    beginPath(): void;
    closePath(): void;

    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    rect(x: number, y: number, w: number, h: number): void;

    stroke(): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    strokeText(text: string, x: number, y: number, maxWidth?: number): void;

    fill(fillRule?: string): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    fillText(text: string, x: number, y: number, maxWidth?: number): void;

    getLineDash(): number[];
    setLineDash(segments: number[]): void;

    clip(fillRule?: string): void;

    createLinearGradient(x0: number, y0: number, x1: number, y1: number): VectorCanvas2DGradient;
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): VectorCanvas2DGradient;
    createPattern(imageData: HTMLImageElement | HTMLCanvasElement, repetition?: string): VectorCanvas2DPattern;

    drawImage(imageData: HTMLImageElement | HTMLCanvasElement,
              offsetX: number, offsetY: number, width?: number, height?: number,
              canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number): void;
}
