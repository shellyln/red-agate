
import { SvgCanvas } from '../drawing/canvas/SvgCanvas';


describe("foo", function() {
    it("foo", function() {
        expect(() => new SvgCanvas()).not.toThrow();
        expect(1).toEqual(1);
    });
});

