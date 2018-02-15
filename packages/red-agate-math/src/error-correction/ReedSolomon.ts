// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { WritableArrayLike }   from "red-agate-util/modules/types/WritableArrayLike";
import { FiniteField }         from "../math/Field";
import { ArrayPolynomialRing } from "../math/ArrayPolynomialRing";
import { Gf2Ext }              from "../math/Gf2Ext";
import { Equation }            from "../math/Equation";



/**
 * Reed-Solomon code encoder / decoder.
 *
 * Generate error correction redundant code, Correct errors from redundant code.
 */
export class ReedSolomon<U> {

    /**
     *
     */
    private poly: ArrayPolynomialRing<U>;


    /**
     *
     */
    constructor(public field: FiniteField<U>, public gx: U[], public aDegree: number = 0) {
        this.poly = new ArrayPolynomialRing(field);
    }


    /**
     * list generator polynomials.
     *
     * generator polynominal that correct (n-1)/2 places of error is:
     * G(X) = (x-a^0)(x-a^1) ... (x-a^n)
     */
    public static listGx<F>(field: FiniteField<F>, gxList: F[][] | undefined, nth: number, aDegree: number = 0): F[][] {
        const poly = new ArrayPolynomialRing(field);
        const gxs: F[][] = gxList || [];
        let   u: F[] = [field.exp(aDegree), field.ONE];
        const v: F[] = [field.exp(aDegree + 1), field.ONE];

        if (gxs.length === 0) {
            gxs.push(u);
        } else {
            u = gxs[gxs.length - 1];
            v[0] = field.exp(aDegree + gxs.length);
        }

        for (let i = gxs.length + 1; i <= nth; i++) {
            u = poly.mul(u, v);
            gxs.push(u);
            v[0] = field.exp(aDegree + i);
        }
        return gxs;
    }


    /**
     * list generator polynomials.
     *
     * generator polynominal that correct (n-1)/2 places of error is:
     * G(X) = (x-a^0)(x-a^1) ... (x-a^n)
     */
    public static getGx<F>(field: FiniteField<F>, nth: number, aDegree: number = 0): F[] {
        const poly = new ArrayPolynomialRing(field);
        let   u: F[] = [field.exp(aDegree), field.ONE];
        const v: F[] = [field.exp(aDegree + 1), field.ONE];

        for (let i = 2; i <= nth; i++) {
            u = poly.mul(u, v);
            v[0] = field.exp(aDegree + i);
        }
        return u;
    }


    /**
     *
     */
    public encode(message: ArrayLike<U>): U[] {
        return this.poly.divmod(message, this.gx, this.gx.length - 1).r;
    }


    /**
     *
     */
    public decode(received: WritableArrayLike<U>, maxErrors: number = 0): U[] {
        // calculate syndromes
        let hasError = false;
        const ss: U[] = [];
        ss.length = this.gx.length - 1;
        if (ss.length <= maxErrors * 2) ss.length = maxErrors * 2;

        for (let i = 0; i < ss.length; i++) {
            let v = received[0];
            for (let j = 1; j < received.length; j++) {
                const a = this.field.exp((this.aDegree + i) * j);
                v = this.field.add(this.field.mul(received[j], a), v);
            }
            ss[i] = v;
            hasError = hasError || this.field.noteq(v, this.field.ZERO);
        }
        if (! hasError)
            return Array.prototype.slice.call(received, this.gx.length - 1);

        const field = this.poly.field as FiniteField<U>;
        const equ = new Equation<U[], U>(this.poly);

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
        let mat: U[][] = [];
        for (; errors > 0; errors--) {
            mat.length = 0;
            for (let i = 0; i < errors; i++) {
                mat[i] = ss.slice(i, i + errors);
            }
            if (field.noteq(equ.det(mat, 0, 0, mat.length), field.ZERO)) break;
        }
        if (errors === 0) return Array.prototype.slice.call(received, this.gx.length - 1);

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
            mat[i] = [field.neg(ss[errors + i])].concat(mat[i]);
        }

        const lx: U[] = [field.ONE].concat(equ.solve(mat, 0, 0, errors).reverse());
        const locations: number[] = [];
        for (let i = 0; i < field.MODULO - 1; i++) {
            let v: U = lx[0];
            for (let j = 1; j < lx.length; j++) {
                const a = field.exp((this.aDegree + i) * j);
                v = field.add(field.mul(lx[j], a), v);
            }
            if (field.eq(field.ZERO, v)) {
                locations.push(field.MODULO - 1 - i - this.aDegree);
            }
        }

        // correct errors
        // solve equation to let syndromes zero.
        //
        //                [k]               [k-1]                [1]              negate([0])
        //
        // |a^(m_(k-1)*   0 )  a^(m_k-2) *    0 )  ... a^(m_0*   0 )| |e_(k-1)|   |ss_0    |
        // | ...                                                    | |       | = |        |
        // |a^(m_(k-1)*(k-1))  a^(m_k-2) * (k-1))  ... a^(m_0*(k-1))| |e_0    |   |ss_(k-1)|
        //
        // errors polynominal is:
        // e(x) = e_0*x^m_0 + e_1*x^m_1 + e_(k-1)*x^m(k-1)
        //
        // corrected(x) = received(x) + e(x)
        mat = [];
        for (let i = 0; i < errors; i++) {
            mat[i] = [field.neg(ss[i])];
            for (let j = 0; j < locations.length; j++) {
                mat[i].push(field.exp((this.aDegree + i) * locations[j]));
            }
        }
        const ex = equ.solve(mat, 0, 0, errors);
        for (let i = 0; i < errors; i++) {
            received[locations[i]] = field.add(received[locations[i]], ex[i]);
        }

        return Array.prototype.slice.call(received, this.gx.length - 1);
    }
}
