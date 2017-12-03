
import { Html5 } from '../red-agate/html';


describe("foo", function() {
    it("foo", function() {
        expect(() => new Html5({})).not.toThrow();
        expect(1).toEqual(1);
    });
});

