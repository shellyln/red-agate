
import { Escape } from '../convert/Escape';


describe("foo", function() {
    it("foo", function() {
        expect(Escape.html("&")).toEqual("&amp;");
        expect(1).toEqual(1);
    });
});

