

import * as ff from "../index";



// tslint:disable:ban-comma-operator



describe("GfPrime", function() {
    it("add, sub, mul, div, neg, inv", function() {
        const gf = new ff.GfPrime(17, 11);
        const v = gf.ALPHA;
        expect(gf.checkGenerationResult()).toEqual(true);
        for (let i = -gf.MODULO * 2; i <= gf.MODULO * 2; i++) {
            expect(gf.eq(i, gf.normalize(i))).toEqual(true);
            expect(gf.noteq(i, gf.normalize(i))).toEqual(false);
            expect(gf.neg(gf.neg(i))).toEqual(gf.normalize(i));
            expect(gf.add(i, gf.neg(i))).toEqual(gf.ZERO);
            expect(gf.add(gf.neg(i), i)).toEqual(gf.ZERO);
            expect(gf.sub(i, i)).toEqual(gf.ZERO);
            if ((i % gf.MODULO) === 0) {
                expect(gf.inv(i)).toBeNaN();
            } else {
                expect(gf.inv(gf.inv(i))).toEqual(gf.normalize(i));
                expect(gf.mul(i, gf.inv(i))).toEqual(gf.ONE);
                expect(gf.mul(gf.inv(i), i)).toEqual(gf.ONE);
                expect(gf.div(i, i)).toEqual(gf.ONE);
            }
            expect(gf.mul(i, i)).toEqual(gf.pow(i, 2));
            expect(gf.mul(gf.mul(i, i), i)).toEqual(gf.pow(i, 3));
            for (let k = 0, v2 = gf.ONE; k < gf.MODULO - 1; k++, v2 = gf.mul(v2, i)) {
                expect(gf.pow(i, k)).toEqual(v2);
            }
        }
    });
    it("exp(x) == pow(a,x), ln(exp(i)) == i", function() {
        const gf = new ff.GfPrime(17, 11);
        const v = gf.ALPHA;
        for (let i = -gf.MODULO; i < gf.MODULO; i++) {
            const i2 = (i + (gf.MODULO - 1) * 2) % (gf.MODULO - 1);
            expect(gf.exp(i)).toEqual(gf.pow(v, i));
            expect(gf.ln(gf.exp(i))).toEqual(i2);
            expect(gf.log(v, gf.exp(i))).toEqual(i2);

            expect(gf.exp_withoutTable(i)).toEqual(gf.exp(i));
            expect(gf.pow_withoutTable(v, i)).toEqual(gf.pow(v, i));
            expect(gf.ln_withoutTable(gf.exp(i))).toEqual(gf.ln(gf.exp(i)));
        }
    });
    it("ln(x = 0 (mod P)) is NaN, log(a, x = 0 (mod P)) is NaN", function() {
        const gf = new ff.GfPrime(17, 11);
        let v = gf.ALPHA;
        for (let j = 0; j < 3; j++) {
            for (let i = -gf.MODULO; i < gf.MODULO; i++) {
                if ((i % gf.MODULO) === 0) {
                    expect(gf.ln(i)).toBeNaN();
                    expect(gf.log(v, i)).toBeNaN();

                    expect(gf.ln_withoutTable(i)).toBeNaN();
                    expect(gf.log_withoutTable(v, i)).toBeNaN();
                } else {
                    expect(gf.ln(i)).not.toBeNaN();
                    expect(gf.ln_withoutTable(i)).not.toBeNaN();
                }
            }
            v = gf.mul(v, gf.ALPHA);
            // v *= gf.ALPHA;
        }
    });
    it("log(a,pow(a,i)) == i", function() {
        const gf = new ff.GfPrime(17, 11);
        let v = gf.ALPHA;
        for (let j = 0; j < 6; j++) {
            for (let i = -gf.MODULO; i < gf.MODULO; i++) {
                const i2 = (i + (gf.MODULO - 1) * 2) % (gf.MODULO - 1);
                const i3 = gf.log(v, gf.pow(v, i));
                expect(i3).not.toBeNaN();
                expect(gf.pow(v, i2)).not.toBeNaN();
                expect(gf.pow(v, i)).toEqual(gf.pow(v, i2));
                if (i3 === i2) {
                    expect(i3).toEqual(i2); // always match (for counting number of assertions)
                } else if (gf.isNaN(i3)) {
                    expect(true).toEqual(false); // always unmatch
                } else {
                    expect(gf.log(v, gf.pow(v, i3))).toEqual(i3);
                }
                expect(gf.pow(v, i)).toEqual(gf.pow_withoutTable(v, i));
                expect(gf.log(v, gf.pow(v, i))).toEqual(gf.log_withoutTable(v, gf.pow(v, i)));
            }
            v = gf.mul(v, gf.ALPHA);
            // v *= gf.ALPHA;
        }
    });
});

