
import { Code39 } from '../barcode/Code39';
import { Code128 } from '../barcode/Code128';
import { Itf } from '../barcode/Itf';
import { Nw7 } from '../barcode/Nw7';
import { Qr } from '../barcode/Qr';


describe("foo", function() {
    it("foo", function() {
        const code39 = new Code39({});
        const code128 = new Code128({});
        const itf = new Itf({});
        const nw7 = new Nw7({});
        const qr = new Qr({});
        expect(1).toEqual(1);
    });
});

