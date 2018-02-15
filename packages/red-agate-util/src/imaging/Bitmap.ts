// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import {BitStreamWriter, StreamSeekOrigin} from '../io/BitStream';



export class Bitmap {
    private w: number;
    private h: number;
    private widthAligned: number;
    private buf: BitStreamWriter;

    public constructor(width: number, height: number, src?: Uint8Array) {
        this.w = width;
        this.h = height;
        this.widthAligned = Math.ceil(width / 8) * 8;
        this.buf = new BitStreamWriter(this.widthAligned * height, src);
        this.buf.seek(0, StreamSeekOrigin.End);
    }

    public get width(): number {
        return this.w;
    }

    public get height(): number {
        return this.h;
    }

    public toBytes(): Uint8Array {
        return this.buf.toBytes();
    }

    public set(x: number, y: number, v: number) {
        this.buf.setBit(y * this.widthAligned + x, v);
    }

    public get(x: number, y: number): number {
        return this.buf.getBit(y * this.widthAligned + x);
    }

    public clear(x: number, y: number, width: number, height: number): Bitmap {
        x = Math.max(0, x);
        y = Math.max(0, y);
        width  = Math.max(0, Math.min(width , Math.max(0, this.w - x)));
        height = Math.max(0, Math.min(height, Math.max(0, this.h - y)));
        for (let j = 0; j < height; j++) {
            const offset = (y + j) * this.widthAligned + x;
            for (let i = 0; i < width; i++) {
                this.buf.setBit(offset + i, 0);
            }
        }
        return this;
    }

    public fill(x: number, y: number, width: number, height: number, v: number): Bitmap {
        x = Math.max(0, x);
        y = Math.max(0, y);
        width  = Math.max(0, Math.min(width , Math.max(0, this.w - x)));
        height = Math.max(0, Math.min(height, Math.max(0, this.h - y)));
        for (let j = 0; j < height; j++) {
            const offset = (y + j) * this.widthAligned + x;
            for (let i = 0; i < width; i++) {
                this.buf.setBit(offset + i, v);
            }
        }
        return this;
    }

    public clearAll(): Bitmap {
        const length = this.buf.byteLength;
        for (let i = 0; i < length; i++) {
            this.buf.setByte(i, 0);
        }
        return this;
    }

/*
    public trim(x: number, y: number, width: number, height: number): Bitmap {
        x = Math.max(0, x);
        y = Math.max(0, y);
        width  = Math.min(this.w, Math.max(0, width  - x));
        height = Math.min(this.h, Math.max(0, height - y));
        for (let j = 0; j < height; j++) {
        }
        //this.buf;
        return this;
    }

    public copy(destX: number, destY: number, src: Bitmap, srcX: number, srcY: number, srcWidth: number, srcHeight: number): Bitmap {
        return this;
    }
*/
}

