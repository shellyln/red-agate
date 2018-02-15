// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export class Point2D {
    constructor(public x: number, public y: number) {
    }
    public toString(): string {
        return `${this.x},${this.y}`;
    }
}


export class Vector2D {
    constructor(public x: number, public y: number) {
    }
    public static fromPoints(p1: Point2D, p2: Point2D): Vector2D {
        return new Vector2D(p2.x - p1.x, p2.y - p1.y);
    }
    public isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }
    public getLength(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    /** returns 0..2*PI */
    public getAngle(): number {
        let angle = Math.acos(this.x / Math.sqrt(this.x ** 2 + this.y ** 2)); // returns 0..PI
        if (0 > this.y) {
            // 180deg < angle < 360deg
            angle = Math.PI * 2 - angle;
        }
        return angle;
    }
    /** returns 0..PI */
    public static getAngle(v1: Vector2D, v2: Vector2D): number {
        const vlen1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
        const vlen2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
        return Math.acos((v1.x * v2.x + v1.y * v2.y) / (vlen1 * vlen2));
    }
    public toString(): string {
        return `${this.x},${this.y}`;
    }
}


export class Rect2D {
    constructor(public x: number, public y: number, public w: number, public h: number) {
    }
}


export class TransferMatrix2D {
    // [m11 m21 dx]
    // [m12 m22 dy]
    // [  0   0  1]
    public m11: number = 1;
    public m21: number = 0;
    public dx: number = 0;
    public m12: number = 0;
    public m22: number = 1;
    public dy: number = 0;

    constructor(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number);
    constructor(src?: TransferMatrix2D);
    // tslint:disable-next-line:variable-name
    constructor(m11_or_src: any, m12?: number, m21?: number, m22?: number, dx?: number, dy?: number) {
        if (! m11_or_src) return;
        if (typeof m11_or_src === "object") {
            this.m11 = m11_or_src.m11 || this.m11;
            this.m12 = m11_or_src.m12 || this.m12;
            this.m21 = m11_or_src.m21 || this.m21;
            this.m22 = m11_or_src.m22 || this.m22;
            this.dx  = m11_or_src.dx  || this.dx;
            this.dy  = m11_or_src.dy  || this.dy;
        } else {
            this.m11 = m11_or_src || this.m11;
            this.m12 = m12 || this.m12;
            this.m21 = m21 || this.m21;
            this.m22 = m22 || this.m22;
            this.dx  = dx  || this.dx;
            this.dy  = dy  || this.dy;
        }
    }
    public toString(): string {
        return `${this.m11} ${this.m12} ${this.m21} ${this.m22} ${this.dx} ${this.dy}`;
    }
    public isIdentity(): boolean {
        return this.m11 === 1 && this.m21 === 0 && this.dx === 0 &&
            this.m12 === 0 && this.m22 === 1 && this.dy === 0;
    }

    public scale(x: number, y: number): TransferMatrix2D {
        return this.concat(new TransferMatrix2D(x, 0, 0, y, 0, 0));
    }
    public translate(x: number, y: number): TransferMatrix2D {
        return this.concat(new TransferMatrix2D(1, 0, 0, 1, x, y));
    }
    public rotate(angle: number): TransferMatrix2D {
        return this.concat(new TransferMatrix2D(
            Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0, 0));
    }
    public skewX(angle: number): TransferMatrix2D {
        return this.concat(new TransferMatrix2D(1, 0, Math.tan(angle), 1, 0, 0));
    }
    public skewY(angle: number): TransferMatrix2D {
        return this.concat(new TransferMatrix2D(1, Math.tan(angle), 0, 1, 0, 0));
    }
    public concat(mat: TransferMatrix2D): TransferMatrix2D {
        // [m11' m21' dx']   [m11*n11 + m21*n12, m11*n21 + m21*n22, m11*tx + m21*ty + dx]   [m11 m21 dx]   [n11 n21 tx]
        // [m12' m22' dy'] = [m12*n11 + m22*n12, m12*n21 + m22*n22, m12*tx + m22*ty + dy] = [m12 m22 dy] * [n12 n22 ty]
        // [  0    0   1 ]   [                0,                 0,                    1]   [  0   0  1]   [  0   0  1]
        return new TransferMatrix2D(
            this.m11 * mat.m11 + this.m21 * mat.m12,             // m11
            this.m12 * mat.m11 + this.m22 * mat.m12,             // m12
            this.m11 * mat.m21 + this.m21 * mat.m22,             // m21
            this.m12 * mat.m21 + this.m22 * mat.m22,             // m22
            this.m11 * mat.dx  + this.m21 * mat.dy + this.dx,    // dx
            this.m12 * mat.dx  + this.m22 * mat.dy + this.dy     // dy
        );
    }

    public transfer(p: Point2D): Point2D;
    public transfer(x: number, y: number): number[];
    // tslint:disable-next-line:variable-name
    public transfer(x_or_p: any, y?: number): any {
        // [x']   [m11 m21 dx]   [x]
        // [y'] = [m12 m22 dy] * [y]
        // [1 ]   [  0   0  1]   [1]
        if (typeof x_or_p === "object")
            return new Point2D(
                this.m11 * x_or_p.x + this.m21 * x_or_p.y + this.dx,
                this.m12 * x_or_p.x + this.m22 * x_or_p.y + this.dy
                );
        else
            return [
                this.m11 * x_or_p + this.m21 * (y as number) + this.dx,
                this.m12 * x_or_p + this.m22 * (y as number) + this.dy
                ];
    }

    //        [m11, m21, dx]
    // A    = [m12, m22, dy]
    //        [  0,   0,  1]
    //
    //        [ m22,  -m21,  m21* dy- dx*m22]
    // A^-1 = [-m12,   m11,   dx*m12-m11* dy]
    //        [   0,     0,  m11*m22-m21*m12]
    public getInverse(): TransferMatrix2D {
        return new TransferMatrix2D(
             this.m22,
            -this.m12,
            -this.m21,
             this.m11,
            this.m21 * this.dy  - this.dx  * this.m22,
            this.dx  * this.m12 - this.m11 * this.dy
        );
    }
}
