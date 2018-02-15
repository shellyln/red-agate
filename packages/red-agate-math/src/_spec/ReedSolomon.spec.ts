

import * as ff from "../index";


describe("ReedSolomon", function() {
    it("ReedSolomon", function() {
        const gf2 = new ff.Gf2e8Field();
        let rsol = new ff.ReedSolomon(gf2, []);
        const specRegxs = [193, 157, 113, 95, 94, 199, 111, 159, 194, 216, 1];

        const rsgxs = ff.ReedSolomon.listGx(gf2, void 0, 10, 0);
        expect(rsgxs[rsgxs.length - 1].length).toEqual(specRegxs.length);
        for (let i = 0; i < specRegxs.length; i++) {
            expect(rsgxs[rsgxs.length - 1][i]).toEqual(specRegxs[i]);
        }

        let rsgxs2 = ff.ReedSolomon.listGx(gf2, void 0, 5, 0);
        expect(rsgxs2.length).toEqual(5);
        rsgxs2 = ff.ReedSolomon.listGx(gf2, rsgxs2, 10, 0);
        expect(rsgxs2.length).toEqual(10);
        expect(rsgxs2[rsgxs2.length - 1].length).toEqual(specRegxs.length);
        for (let i = 0; i < specRegxs.length; i++) {
            expect(rsgxs2[rsgxs2.length - 1][i]).toEqual(specRegxs[i]);
        }

        const rsgx3 = ff.ReedSolomon.getGx(gf2, 10, 0);
        expect(rsgx3.length).toEqual(specRegxs.length);
        for (let i = 0; i < specRegxs.length; i++) {
            expect(rsgx3[i]).toEqual(specRegxs[i]);
        }

        rsol = new ff.ReedSolomon(gf2, rsgxs[rsgxs.length - 1]);
        rsol.gx = ff.ReedSolomon.getGx(gf2, 10, 0);
        const ax = [
            16, 32, 12, 86, 97, 128, 236, 17,
            236, 17, 236, 17, 236, 17, 236, 17].reverse();

        const poly = new ff.ArrayPolynomialRing(rsol.field);
        const rsec = rsol.encode(ax);
        // console.log(poly.add(poly.mul(poly.divmod(ax, rsol.gx, rsol.gx.length - 1).q, rsol.gx), rsec));
        const rsrecv = rsec.concat(ax);

        const wwww1 = poly.field.div(0, 242);
        const q1111 = poly.divmod(rsrecv, rsol.gx);
        // console.log(q1111.q);
        // console.log(q1111.r);
        // console.log(q1111.divisible);
        // console.log("rs send=" + rsrecv);

        rsrecv[3] ^= 51;
        rsrecv[11] ^= 211;
        rsrecv[12] ^= 73;
        rsrecv[20] ^= 99;
        // console.log("rs corr=" + rsol.decode(rsrecv));
    });
});

