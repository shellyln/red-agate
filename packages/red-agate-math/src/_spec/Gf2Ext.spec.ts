

import { Integer53 } from "red-agate-util/modules/types/Integer53";
import * as ff from "../index";



// tslint:disable:ban-comma-operator



const MAXINT = Number.MAX_SAFE_INTEGER; // 0x1fffffffffffff; // Number.MAX_SAFE_INTEGER (== pow(2, 53) - 1)


describe("Gf2Ext", function() {
    it("construct(6)", function() {
        const ring = new ff.Gf2PrimeBitPolynomialRing();
        const pxs = ring.listPx(6);
        for (let i = 0; i < pxs.length; i++) {
            const gf = new ff.Gf2e6Field(pxs[i]);
            const v = gf.ALPHA;
            expect(gf.checkGenerationResult()).toEqual(true);
        }
    });
    it("construct(8)", function() {
        const ring = new ff.Gf2PrimeBitPolynomialRing();
        const pxs = ring.listPx(8);
        for (let i = 0; i < pxs.length; i++) {
            const gf = new ff.Gf2e8Field(pxs[i]);
            const v = gf.ALPHA;
            expect(gf.checkGenerationResult()).toEqual(true);
        }
    });
    it("add, sub, mul, div, neg, inv", function() {
        const gf = new ff.Gf2e8Field();
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
        const gf = new ff.Gf2e8Field();
        const v = gf.ALPHA;
        for (let i = -gf.MODULO; i < gf.MODULO; i++) {
            const i2 = (i + (gf.MODULO - 1) * 2) % (gf.MODULO - 1);
            expect(gf.exp(i)).toEqual(gf.pow(v, i));
            expect(gf.ln(gf.exp(i))).toEqual(i2);
            expect(gf.log(v, gf.exp(i))).toEqual(i2);
        }
    });
    it("ln(x = 0 (mod P)) is NaN, log(a, x = 0 (mod P)) is NaN", function() {
        const gf = new ff.Gf2e8Field();
        let v = gf.ALPHA;
        for (let j = 0; j < 3; j++) {
            for (let i = -gf.MODULO; i < gf.MODULO; i++) {
                if ((i % gf.MODULO) === 0) {
                    expect(gf.ln(i)).toBeNaN();
                    expect(gf.log(v, i)).toBeNaN();
                } else {
                    expect(gf.ln(i)).not.toBeNaN();
                }
            }
            v = gf.mul(v, gf.ALPHA);
        }
    });
    it("log(a,pow(a,i)) == i", function() {
        const gf = new ff.Gf2e8Field();
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
            }
            v = gf.mul(v, gf.ALPHA);
        }
    });
    it("bit operations", function() {
        expect(Integer53.bitAnd(0, 0)).toEqual(0);
        expect(Integer53.bitAnd(MAXINT, MAXINT)).toEqual(MAXINT);
        expect(Integer53.bitAnd(MAXINT, 0)).toEqual(0);
        expect(Integer53.bitAnd(0, MAXINT)).toEqual(0);
        expect(Integer53.bitOr(0, 0)).toEqual(0);
        expect(Integer53.bitOr(MAXINT, MAXINT)).toEqual(MAXINT);
        expect(Integer53.bitOr(MAXINT, 0)).toEqual(MAXINT);
        expect(Integer53.bitOr(0, MAXINT)).toEqual(MAXINT);
        expect(Integer53.bitXor(0, 0)).toEqual(0);
        expect(Integer53.bitXor(MAXINT, MAXINT)).toEqual(0);
        expect(Integer53.bitXor(MAXINT, 0)).toEqual(MAXINT);
        expect(Integer53.bitXor(0, MAXINT)).toEqual(MAXINT);
        expect(Integer53.bitNot(MAXINT)).toEqual(0);
        expect(Integer53.bitNot(0)).toEqual(MAXINT);

        expect(Integer53.bitLShift(MAXINT, 53)).toEqual(0);
        expect(Integer53.bitRShift(MAXINT, -53)).toEqual(0);

        for (let i = 0; i < 53; i++) {
            expect(Integer53.bitLShift(1, i)).toEqual(Math.pow(2, i));
            expect(Integer53.bitRShift(1, -i)).toEqual(Math.pow(2, i));
            const v1 = MAXINT - (Math.pow(2, i) - 1);
            const v2 = Math.pow(2, 53 - i) - 1;
            const v3 = Math.pow(2, i) - 1;
            expect(Integer53.bitLShift(MAXINT, i)).toEqual(v1);
            expect(Integer53.bitRShift(MAXINT, -i)).toEqual(v1);
            expect(Integer53.bitLShift(MAXINT, -i)).toEqual(v2);
            expect(Integer53.bitRShift(MAXINT, i)).toEqual(v2);

            expect(Integer53.bitAnd(v1, v1)).toEqual(v1);
            expect(Integer53.bitAnd(v1, 0)).toEqual(0);
            expect(Integer53.bitAnd(0, v1)).toEqual(0);
            expect(Integer53.bitOr(v1, v1)).toEqual(v1);
            expect(Integer53.bitOr(v1, 0)).toEqual(v1);
            expect(Integer53.bitOr(0, v1)).toEqual(v1);
            expect(Integer53.bitXor(v1, v1)).toEqual(0);
            expect(Integer53.bitXor(v1, 0)).toEqual(v1);
            expect(Integer53.bitXor(0, v1)).toEqual(v1);
            expect(Integer53.bitAnd(v2, v2)).toEqual(v2);
            expect(Integer53.bitAnd(v2, 0)).toEqual(0);
            expect(Integer53.bitAnd(0, v2)).toEqual(0);
            expect(Integer53.bitOr(v2, v2)).toEqual(v2);
            expect(Integer53.bitOr(v2, 0)).toEqual(v2);
            expect(Integer53.bitOr(0, v2)).toEqual(v2);
            expect(Integer53.bitXor(v2, v2)).toEqual(0);
            expect(Integer53.bitXor(v2, 0)).toEqual(v2);
            expect(Integer53.bitXor(0, v2)).toEqual(v2);
            expect(Integer53.bitXor(v1, v3)).toEqual(MAXINT);
            expect(Integer53.bitNot(v1)).toEqual(v3);
            expect(Integer53.bitNot(v3)).toEqual(v1);
        }
    });
    it("bit <-> array conversions", function() {
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.bitToPoly(0)))
            .toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.bitToPoly(1)))
            .toEqual(1);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.bitToPoly(2)))
            .toEqual(2);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, 52) - 1)))
            .toEqual(Math.pow(2, 52) - 1);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, 52))))
            .toEqual(Math.pow(2, 52));
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, 52) + 1)))
            .toEqual(Math.pow(2, 52) + 1);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT)))
            .toEqual(MAXINT);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT + 1)))
            .toEqual(0);

        expect(ff.Gf2PrimeFieldHelper.bitToPoly(0).length)
            .toEqual(1);
        expect(ff.Gf2PrimeFieldHelper.bitToPoly(1).length)
            .toEqual(1);
        expect(ff.Gf2PrimeFieldHelper.bitToPoly(2).length)
            .toEqual(2);
        expect(ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, 52) - 1).length)
            .toEqual(52);
        expect(ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, 52)).length)
            .toEqual(53);
        expect(ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, 52) + 1).length)
            .toEqual(53);
        expect(ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT).length)
            .toEqual(53);
        expect(ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT + 1).length)
            .toEqual(1);

        expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(MAXINT, MAXINT))
            .toEqual(ff.Gf2PrimeFieldHelper.polyToBit(
                ff.Gf2PrimeFieldHelper.polyAdd(
                    ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
                    ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT))));
        expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(MAXINT, 0))
            .toEqual(ff.Gf2PrimeFieldHelper.polyToBit(
                ff.Gf2PrimeFieldHelper.polyAdd(
                    ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
                    ff.Gf2PrimeFieldHelper.bitToPoly(0))));
        expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(0, MAXINT))
            .toEqual(ff.Gf2PrimeFieldHelper.polyToBit(
                ff.Gf2PrimeFieldHelper.polyAdd(
                    ff.Gf2PrimeFieldHelper.bitToPoly(0),
                    ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT))));

        expect(ff.Gf2PrimeFieldHelper.bitPolySub(MAXINT, MAXINT))
            .toEqual(ff.Gf2PrimeFieldHelper.polyToBit(
                ff.Gf2PrimeFieldHelper.polySub(
                    ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
                    ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT))));
        expect(ff.Gf2PrimeFieldHelper.bitPolySub(MAXINT, 0))
            .toEqual(ff.Gf2PrimeFieldHelper.polyToBit(
                ff.Gf2PrimeFieldHelper.polySub(
                    ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
                    ff.Gf2PrimeFieldHelper.bitToPoly(0))));
        expect(ff.Gf2PrimeFieldHelper.bitPolySub(0, MAXINT))
            .toEqual(ff.Gf2PrimeFieldHelper.polyToBit(
                ff.Gf2PrimeFieldHelper.polySub(
                    ff.Gf2PrimeFieldHelper.bitToPoly(0),
                    ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT))));

        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
            ff.Gf2PrimeFieldHelper.bitToPoly(0),
            ff.Gf2PrimeFieldHelper.bitToPoly(0))))
            .toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
            ff.Gf2PrimeFieldHelper.bitToPoly(1),
            ff.Gf2PrimeFieldHelper.bitToPoly(0))))
            .toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
            ff.Gf2PrimeFieldHelper.bitToPoly(0),
            ff.Gf2PrimeFieldHelper.bitToPoly(1))))
            .toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
            ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
            ff.Gf2PrimeFieldHelper.bitToPoly(0))))
            .toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
            ff.Gf2PrimeFieldHelper.bitToPoly(0),
            ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT))))
            .toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
            ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
            ff.Gf2PrimeFieldHelper.bitToPoly(1))))
            .toEqual(MAXINT);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
            ff.Gf2PrimeFieldHelper.bitToPoly(1),
            ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT))))
            .toEqual(MAXINT);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
            ff.Gf2PrimeFieldHelper.bitToPoly(0x2000200020),
            ff.Gf2PrimeFieldHelper.bitToPoly(0x0000FFFF))))
            .toEqual(0x1FFFFFFFFFFFE0);
        expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
            ff.Gf2PrimeFieldHelper.bitToPoly(0x0000FFFF),
            ff.Gf2PrimeFieldHelper.bitToPoly(0x2000200020))))
            .toEqual(0x1FFFFFFFFFFFE0);
    });
    it("GF2Prime bit poliniminal operations", function() {
        expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(MAXINT, MAXINT)).toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(MAXINT, 0)).toEqual(MAXINT);
        expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(0, MAXINT)).toEqual(MAXINT);
        expect(ff.Gf2PrimeFieldHelper.bitPolySub(MAXINT, MAXINT)).toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.bitPolySub(MAXINT, 0)).toEqual(MAXINT);
        expect(ff.Gf2PrimeFieldHelper.bitPolySub(0, MAXINT)).toEqual(MAXINT);

        expect(ff.Gf2PrimeFieldHelper.bitPolyMul(0, 0)).toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.bitPolyMul(1, 0)).toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.bitPolyMul(0, 1)).toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.bitPolyMul(MAXINT, 0)).toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.bitPolyMul(0, MAXINT)).toEqual(0);
        expect(ff.Gf2PrimeFieldHelper.bitPolyMul(MAXINT, 1)).toEqual(MAXINT);
        expect(ff.Gf2PrimeFieldHelper.bitPolyMul(1, MAXINT)).toEqual(MAXINT);
        expect(ff.Gf2PrimeFieldHelper.bitPolyMul(0x2000200020, 0x0000FFFF)).toEqual(0x1FFFFFFFFFFFE0);
        expect(ff.Gf2PrimeFieldHelper.bitPolyMul(0x0000FFFF, 0x2000200020)).toEqual(0x1FFFFFFFFFFFE0);

        {
            const result = ff.Gf2PrimeFieldHelper.bitPolyDiv(0, 0);
            expect(result.q).toBeNaN();
            expect(result.r).toBeNaN();
            expect(result.divisible).toEqual(false);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.bitPolyDiv(1, 0);
            expect(result.q).toBeNaN();
            expect(result.r).toBeNaN();
            expect(result.divisible).toEqual(false);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.bitPolyDiv(MAXINT, 0);
            expect(result.q).toBeNaN();
            expect(result.r).toBeNaN();
            expect(result.divisible).toEqual(false);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.bitPolyDiv(1, 1);
            expect(result.q).toEqual(1);
            expect(result.r).toEqual(0);
            expect(result.divisible).toEqual(true);
            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(1, result.q),
                result.r))
                .toEqual(1);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.bitPolyDiv(MAXINT, 1);
            expect(result.q).toEqual(MAXINT);
            expect(result.r).toEqual(0);
            expect(result.divisible).toEqual(true);
            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(1, result.q),
                result.r))
                .toEqual(MAXINT);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.bitPolyDiv(MAXINT, 2);
            expect(result.q).toEqual(Integer53.bitRShift(MAXINT, 1));
            expect(result.r).toEqual(1);
            expect(result.divisible).toEqual(false);
            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(2, result.q),
                result.r))
                .toEqual(MAXINT);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.bitPolyDiv(MAXINT, 4);
            expect(result.q).toEqual(Integer53.bitRShift(MAXINT, 2));
            expect(result.r).toEqual(3);
            expect(result.divisible).toEqual(false);
            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(4, result.q),
                result.r))
                .toEqual(MAXINT);
        }
        for (let i = 1; i < 53; i++) {
            const result = ff.Gf2PrimeFieldHelper.bitPolyDiv(MAXINT, Math.pow(2, i));
            expect(result.q).toEqual(Integer53.bitRShift(MAXINT, i));
            expect(result.r).toEqual(Math.pow(2, i) - 1);
            expect(result.divisible).toEqual(false);
            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(Math.pow(2, i), result.q),
                result.r))
                .toEqual(MAXINT);
        }
    });
    it("GF2Prime array poliniminal operations", function() {
        {
            const result = ff.Gf2PrimeFieldHelper.polyDiv(
                ff.Gf2PrimeFieldHelper.bitToPoly(0),
                ff.Gf2PrimeFieldHelper.bitToPoly(0));
            expect(result.q).not.toBeNull();
            expect(result.q[0]).toBeNaN();
            expect(result.r).not.toBeNull();
            expect(result.r[0]).toBeNaN();
            expect(result.divisible).toEqual(false);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.polyDiv(
                ff.Gf2PrimeFieldHelper.bitToPoly(1),
                ff.Gf2PrimeFieldHelper.bitToPoly(0));
            expect(result.q).not.toBeNull();
            expect(result.q[0]).toBeNaN();
            expect(result.r).not.toBeNull();
            expect(result.r[0]).toBeNaN();
            expect(result.divisible).toEqual(false);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.polyDiv(
                ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
                ff.Gf2PrimeFieldHelper.bitToPoly(0));
            expect(result.q).not.toBeNull();
            expect(result.q[0]).toBeNaN();
            expect(result.r).not.toBeNull();
            expect(result.r[0]).toBeNaN();
            expect(result.divisible).toEqual(false);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.polyDiv(
                ff.Gf2PrimeFieldHelper.bitToPoly(1),
                ff.Gf2PrimeFieldHelper.bitToPoly(1));
            expect(ff.Gf2PrimeFieldHelper.polyToBit(result.q)).toEqual(1);
            expect(ff.Gf2PrimeFieldHelper.polyToBit(result.r)).toEqual(0);
            expect(result.divisible).toEqual(true);
            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(1, ff.Gf2PrimeFieldHelper.polyToBit(result.q)),
                ff.Gf2PrimeFieldHelper.polyToBit(result.r)))
                .toEqual(1);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.polyDiv(
                ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
                ff.Gf2PrimeFieldHelper.bitToPoly(1));
            expect(ff.Gf2PrimeFieldHelper.polyToBit(result.q)).toEqual(MAXINT);
            expect(ff.Gf2PrimeFieldHelper.polyToBit(result.r)).toEqual(0);
            expect(result.divisible).toEqual(true);
            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(1, ff.Gf2PrimeFieldHelper.polyToBit(result.q)),
                ff.Gf2PrimeFieldHelper.polyToBit(result.r)))
                .toEqual(MAXINT);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.polyDiv(
                ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
                ff.Gf2PrimeFieldHelper.bitToPoly(2));
            expect(ff.Gf2PrimeFieldHelper.polyToBit(result.q)).toEqual(Integer53.bitRShift(MAXINT, 1));
            expect(ff.Gf2PrimeFieldHelper.polyToBit(result.r)).toEqual(1);
            expect(result.divisible).toEqual(false);
            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(2, ff.Gf2PrimeFieldHelper.polyToBit(result.q)),
                ff.Gf2PrimeFieldHelper.polyToBit(result.r)))
                .toEqual(MAXINT);
        }
        {
            const result = ff.Gf2PrimeFieldHelper.polyDiv(
                ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
                ff.Gf2PrimeFieldHelper.bitToPoly(4));
            expect(ff.Gf2PrimeFieldHelper.polyToBit(result.q)).toEqual(Integer53.bitRShift(MAXINT, 2));
            expect(ff.Gf2PrimeFieldHelper.polyToBit(result.r)).toEqual(3);
            expect(result.divisible).toEqual(false);
            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(4, ff.Gf2PrimeFieldHelper.polyToBit(result.q)),
                ff.Gf2PrimeFieldHelper.polyToBit(result.r)))
                .toEqual(MAXINT);
        }
        for (let i = 1; i < 53; i++) {
            const result = ff.Gf2PrimeFieldHelper.polyDiv(
                ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
                ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, i)));
            expect(ff.Gf2PrimeFieldHelper.polyToBit(result.q)).toEqual(Integer53.bitRShift(MAXINT, i));
            expect(ff.Gf2PrimeFieldHelper.polyToBit(result.r)).toEqual(Math.pow(2, i) - 1);
            expect(result.divisible).toEqual(false);
            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(Math.pow(2, i), ff.Gf2PrimeFieldHelper.polyToBit(result.q)),
                ff.Gf2PrimeFieldHelper.polyToBit(result.r)))
                .toEqual(MAXINT);
        }
        for (let i = 1; i < 53; i++) {
            const result = ff.Gf2PrimeFieldHelper.polyDiv(
                ff.Gf2PrimeFieldHelper.bitToPoly(MAXINT),
                ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, i) - 1));

            expect(ff.Gf2PrimeFieldHelper.bitPolyAdd(
                ff.Gf2PrimeFieldHelper.bitPolyMul(Math.pow(2, i) - 1, ff.Gf2PrimeFieldHelper.polyToBit(result.q)),
                ff.Gf2PrimeFieldHelper.polyToBit(result.r)))
                .toEqual(MAXINT);
        }
        for (let i = 0; i < 53; i++) {
            expect(ff.Gf2PrimeFieldHelper.bitPolyMul(Math.pow(2, i), 1)).toEqual(Math.pow(2, i));
            expect(ff.Gf2PrimeFieldHelper.bitPolyMul(1, Math.pow(2, i))).toEqual(Math.pow(2, i));

            expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
                ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, i)),
                ff.Gf2PrimeFieldHelper.bitToPoly(1))))
                .toEqual(Math.pow(2, i));
            expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
                ff.Gf2PrimeFieldHelper.bitToPoly(1),
                ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, i)))))
                .toEqual(Math.pow(2, i));

            if (i > 0) {
                expect(ff.Gf2PrimeFieldHelper.bitPolyMul(Math.pow(2, i - 1), 2)).toEqual(Math.pow(2, i));
                expect(ff.Gf2PrimeFieldHelper.bitPolyMul(2, Math.pow(2, i - 1))).toEqual(Math.pow(2, i));

                expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
                    ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, i - 1)),
                    ff.Gf2PrimeFieldHelper.bitToPoly(2))))
                    .toEqual(Math.pow(2, i));
                expect(ff.Gf2PrimeFieldHelper.polyToBit(ff.Gf2PrimeFieldHelper.polyMul(
                    ff.Gf2PrimeFieldHelper.bitToPoly(2),
                    ff.Gf2PrimeFieldHelper.bitToPoly(Math.pow(2, i - 1)))))
                    .toEqual(Math.pow(2, i));
            }
        }
    });
});

