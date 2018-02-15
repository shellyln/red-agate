// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { Integer53 }           from 'red-agate-util/modules/types/Integer53';
import { ArrayPolynomialRing } from "../math/ArrayPolynomialRing";
import { Gf2Ext }              from "../math/Gf2Ext";
import { Gf2PrimeFieldHelper } from "../math/Gf2PrimeHelper";
import { Equation }            from "../math/Equation";


/**
 * BCH code encoder / decoder.
 *
 * Generate error correction redundant code, Correct errors from redundant code.
 */
export class BCH {

    /**
     *
     */
    constructor(public field: Gf2Ext, gx: number, public aDegree: number = 1) {
        this.gx = gx;
    }

    /**
     *
     */
    // tslint:disable-next-line:variable-name
    private _gx: number;

    /**
     *
     */
    // tslint:disable-next-line:variable-name
    private _gxLength: number;

    /**
     *
     */
    public set gx(fx: number) {
        this._gx = fx;
        this._gxLength = Integer53.highestBit(fx) + 1;
    }

    /**
     *
     */
    public get gx(): number {
        return this._gx;
    }

    /**
     *
     */
    public get gxLength(): number {
        return this._gxLength;
    }


    /**
     * list generator polynomials.
     *
     * generator polynominal that correct t places of error is:
     * G(X) = (x-a^1)(x-a^2) ... (x-a^2t)F(x)
     *      = P_i1(x)P_i2(x) ... P_iq(x)
     *
     * a      : generator element of GF(2^m)
     * P_i(x) : one of GF(2) m_th or lower order minimal prime polynomials
     *
     * -> substitute a^j for each P_i(x) and get roots of P_i(x).
     * -> P_i(x) = (x-a^j_1)(x-a^j_2)...(x-a^j_n) = 0
     */
    public static getGx(field: Gf2Ext, numCorrect: number, aDegree: number = 1): number {
        const nth = Math.log2(field.MODULO);
        const pxs = Gf2PrimeFieldHelper.listPx(nth, true);
        const roots: number[] = [];

        const c = Math.min(2 * numCorrect, field.MODULO - 1);
        for (let i = 0; i < field.MODULO - 1; i++) {
            for (let j = 0; j < pxs.length; j++) {
                const px = pxs[j];
                let v = px & 1;
                for (let k = 1; k <= nth; k++) {
                    v = field.add(v, (Integer53.bitRShift(px, k) & 1) ? field.exp(k * i) : 0);
                }
                if (v === 0) {
                    roots[i] = px;
                }
            }
        }

        let gx = roots[aDegree];
        for (let i = 1; i < c; i++) {
            let d = false;
            const r = roots[i + aDegree];
            for (let j = i - 1; j >= 0; j--) {
                if (r === roots[j + aDegree]) {
                    d = true;
                    break;
                }
            }
            if (d) continue;
            gx = Gf2PrimeFieldHelper.bitPolyMul(gx, r);
        }
        return gx;
    }


    /**
     *
     */
    public encode(message: number): number {
        return Gf2PrimeFieldHelper.bitPolyDiv(message, this._gx, this._gxLength - 1).r;
    }


    /**
     *
     */
    public decode(received: number, maxErrors: number): number {
        // calculate syndromes
        const receivedLength = this.field.MODULO - 1;
        let hasError = false;
        const ss: number[] = [];
        ss.length = maxErrors * 2;

        for (let i = 0; i < ss.length; i++) {
            let v = (received & 1) * this.field.ONE;
            for (let j = 1; j < receivedLength; j++) {
                const a = this.field.exp((this.aDegree + i) * j);
                v = this.field.add((Integer53.bitRShift(received, j) & 1) * a, v);
            }
            ss[i] = v;
            hasError = hasError || this.field.noteq(v, this.field.ZERO);
        }
        if (! hasError)
            return Integer53.bitRShift(received, this._gxLength - 1);

        const equ = new Equation<number[], number>(new ArrayPolynomialRing(this.field));

        // calculate number of errors
        // det|S_(k-1)| = 0;
        //
        //                 [k-1]     [k-2]            [0]
        //
        //             |ss_(k-1)  ss_(k-2)   ... ss_0    |
        // |S_(k-1)| = | ...                             |
        //             |ss_(2k-2) ss_(2k-3)  ... ss_(k-1)|
        //
        // number of errors = k-1
        let errors = Math.floor(ss.length / 2);
        const mat: number[][] = [];
        for (; errors > 0; errors--) {
            mat.length = 0;
            for (let i = 0; i < errors; i++) {
                mat[i] = ss.slice(i, i + errors);
            }
            if (this.field.noteq(equ.det(mat, 0, 0, mat.length), this.field.ZERO)) break;
        }
        if (errors === 0) return Integer53.bitRShift(received, this._gxLength - 1);

        // calculate error locations
        //
        //       [k]     [k-1]            [1]              negate([0])
        //
        // |ss_(k-1)  ss_(k-2)   ... ss_0    | |l_0    |   |ss_k     |
        // | ...                             | |       | = |         |
        // |ss_(2k-2) ss_(2k-3)  ... ss_(k-1)| |l_(k-1)|   |ss_(2k-1)|
        //
        // error locations polynominal is:
        // l(x) = 1 + l_0*x^1 + l_1*x^2 + ... + l_(k-1)*x^k
        //
        // error locations are where   l(a^(-(m_i))) = 0 ; (0 <= i <= k-1).
        for (let i = 0; i < errors; i++) {
            mat[i] = [this.field.neg(ss[errors + i])].concat(mat[i]);
        }

        const lx: number[] = [this.field.ONE].concat(equ.solve(mat, 0, 0, errors).reverse());
        const locations: number[] = [];
        for (let i = 0; i < this.field.MODULO - 1; i++) {
            let v: number = lx[0];
            for (let j = 1; j < lx.length; j++) {
                const a = this.field.exp((this.aDegree + i) * j);
                v = this.field.add(this.field.mul(lx[j], a), v);
            }
            if (this.field.eq(this.field.ZERO, v)) {
                locations.push(this.field.MODULO - 1 - i - this.aDegree);
            }
        }

        // correct errors
        // solve equation to let syndromes zero.
        // reverse bit of error locations.
        //
        // corrected(x) = received(x) + e(x)
        let ex = 0;
        for (let i = 0; i < errors; i++) {
            ex += 2 ** locations[i];
        }
        received = Integer53.bitXor(received, ex);

        return Integer53.bitRShift(received, this._gxLength - 1);
    }
}
