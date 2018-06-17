// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { PolynomialRing } from "./Field";


/**
 *
 */
export class Equation<T, V> {

    constructor(public ring: PolynomialRing<T, V>) {
    }

    /**
     * solve a equation.
     *
     *                  [0]             [1]                   [n]
     *
     *   S0     =     S_0_0 +     S_0_1*x_1 + ... +     S_0_n*x_n = 0
     *   S1     =     S_1_0 +     S_1_1*x_1 + ... +     S_1_n*x_n = 0
     *     ...
     *   S(n-1) = S_(n-1)_0 + S_(n-1)_1*x_1 + ... + S_(n-1)_n*x_n = 0
     *
     *
     * matrix expression:
     *        [n]          [n-1]            [1]           negate([0])
     *
     * |S_0_n      S_0_(n-1)      ...  S_0_1    | |x_n|   |S_0_0    |
     * | ...                                    | |   | = |         |
     * |S_(n-1)_n  S_(n-1)_(n-1)  ...  S_(n-1)_1| |x_1|   |S_(n-1)_0|
     *
     *
     * equation[n][n+1: coefficient of x^0,...,x^n]
     * equation is stored into n+1 x n matrix
     * [offsetY <=  <= offsetY + n - 1][offsetX <=  <= offsetX + n]
     *
     * returns [x_1, x_2, ... , x_n]
     */
    public solve(equation: T[], offsetX: number, offsetY: number, n: number): T {
        const field = this.ring.field;

        for (let i = 0; i < n; i++) {
            let c = this.ring.getAt(equation[i], n - i);
            if (field.eq(c, field.ZERO)) {
                for (let j = i + 1; j < n; j++) {
                    if (field.noteq(this.ring.getAt(equation[j], n - i), field.ZERO)) {
                        const r = equation[i];
                        equation[i] = equation[j];
                        equation[j] = r;
                        break;
                    }
                }
                c = this.ring.getAt(equation[i], n - i);
            }
            if (field.eq(c, field.ZERO)) continue;

            equation[i] = this.ring.mapToSelf(equation[i], v => field.div(v, c));
            for (let j = i + 1; j < n; j++) {
                const m = this.ring.getAt(equation[j], n - i);
                const r = this.ring.map(equation[i], v => field.mul(v, m));
                equation[j] = this.ring.sub(equation[j], r);
            }
        }

        for (let i = n - 1; i >= 0; i--) {
            const c = this.ring.getAt(equation[i], n - i);
            if (field.eq(c, field.ZERO)) continue;

            for (let j = 0; j < i; j++) {
                const m = this.ring.getAt(equation[j], n - i);
                const r = this.ring.map(equation[i], v => field.mul(v, m));
                equation[j] = this.ring.sub(equation[j], r);
            }
        }

        const ss = this.ring.newNthPolynomial(n - 1);
        for (let i = 0; i < n; i++) {
            if (field.eq(this.ring.getAt(equation[i], n - i), field.ZERO))
                this.ring.setAt(ss, n - 1 - i, field.NaN);
            else
                this.ring.setAt(ss, n - 1 - i, field.neg(this.ring.getAt(equation[i], 0)));
        }
        return ss;
    }

    /**
     * get determinant of n x n matrix.
     * the determinant of matrix A is:
     *
     *               [n-1]           [n-2]                 [0]
     *
     *             | S_0_(n-1)       S_0_(n-2)       ...   S_0_0     |
     *   det(A)  = | S_1_(n-1)       S_1_(n-2)       ...   S_1_0     |
     *               ...
     *             | S_(n-1)_(n-1)   S_(n-1)_(n-2)   ...   S_(n-1)_0 |
     *
     * argument matrix layout is:
     *
     *   | a  b |  = [[b, a], [d, c]]
     *   | c  d |
     *
     * return value of 2x2 matrix's determinant is (ad - bc)
     */
    public det(matrix: T[], offsetX: number, offsetY: number, n: number): V {
        const field = this.ring.field;
        if (n <= 0) return field.NaN;

        const fn: (mat: T[], len: number) => V = (mat: T[], len: number) => {
            if (len < 2) {
                return this.ring.getAt(mat[0], 0);
            }
            if (len === 2) {
                // ad - bc
                return field.sub(
                    field.mul(this.ring.getAt(mat[0], 1), this.ring.getAt(mat[1], 0)),
                    field.mul(this.ring.getAt(mat[1], 1), this.ring.getAt(mat[0], 0)));
            }
            let v = field.ZERO;
            for (let i = 0; i < len; i++) {
                const m2: T[] = [];
                for (let j = 0; j < len; j++) {
                    if (i === j) continue;
                    m2.push(this.ring.slice(mat[j], 0, len - 1));
                }
                const sign = (len - 1 + len - i) % 2 ? 1 : -1;
                const d = fn(m2, len - 1);
                v = field.add(v, field.mul(
                    this.ring.getAt(mat[i], len - 1),
                    sign >= 0 ? d : field.neg(d)));
            }
            return v;
        };

        if (offsetX === 0) {
            if (offsetY === 0) return fn(matrix, n);
            else return fn(matrix.slice(offsetY), n);
        }

        const matr: T[] = [];
        for (let i = 0; i < n; i++) {
            matr.push(this.ring.slice(matrix[offsetY + i], offsetX, offsetX + n));
        }
        return fn(matr, n);
    }
}
