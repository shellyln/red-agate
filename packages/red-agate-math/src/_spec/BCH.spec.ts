

import { Integer53 } from "red-agate-util/modules/types/Integer53";
import * as ff from "../index";


describe("BCH", function() {
    it("BCH", function() {
        const gf24 = new ff.Gf2Ext(4, ff.Gf2PrimeFieldHelper.listPx(4)[0]);

        expect(ff.BCH.getGx(gf24, 1)).toEqual(19); // expect 19 ; x^4 + x + 1
        expect(ff.BCH.getGx(gf24, 2)).toEqual(465); // expect 465 ; x^8 + x^7 + x^6 + x^4 + 1
        expect(ff.BCH.getGx(gf24, 3)).toEqual(1335); // expect 1335 ; x^10 + x^8 + x^5 + x^4 + x^2 + x + 1
        expect(ff.BCH.getGx(gf24, 4)).toEqual(32767); // expect 32767 ; x^14 + x^13 + ... + x + 1
        expect(ff.BCH.getGx(gf24, 5)).toEqual(32767); // expect 32767 ; x^14 + x^13 + ... + x + 1
        expect(ff.BCH.getGx(gf24, 6)).toEqual(32767); // expect 32767 ; x^14 + x^13 + ... + x + 1
        expect(ff.BCH.getGx(gf24, 7)).toEqual(32767); // expect 32767 ; x^14 + x^13 + ... + x + 1
        expect(ff.BCH.getGx(gf24, 8)).toEqual(0);
        expect(ff.BCH.getGx(gf24, 9)).toEqual(0);
        expect(ff.BCH.getGx(gf24, 10)).toEqual(0);
        expect(ff.BCH.getGx(gf24, 11)).toEqual(0);
        expect(ff.BCH.getGx(gf24, 12)).toEqual(0);
        expect(ff.BCH.getGx(gf24, 13)).toEqual(0);
        expect(ff.BCH.getGx(gf24, 14)).toEqual(0);

        expect(new ff.BCH(gf24, 0x0537).encode(5)).toEqual(220);
        expect(new ff.BCH(gf24, 0x1f25).encode(7)).toEqual(3220);

        const bchgx = ff.BCH.getGx(gf24, 3); // 11bit
        const bch = new ff.BCH(gf24, bchgx);
        const bchmsg = 31; // 5bit
        const bchrem = bch.encode(bchmsg); // 10bit
        let bchrecv = Integer53.bitOr(Integer53.bitLShift(bchmsg, 10), bchrem);
        expect(ff.Gf2PrimeFieldHelper.bitPolyDiv(bchrecv, bchgx).r).toEqual(0);
        bchrecv ^= 0x01000;
        bchrecv ^= 0x02000;
        bchrecv ^= 0x04000;
        expect(bch.decode(bchrecv, 3)).toEqual(bchmsg);
    });
});

