
import { Escape }       from '../convert/Escape';
import { TextEncoding } from '../convert/TextEncoding';


describe("foo", function() {
    it("foo", function() {
        expect(Escape.html("&")).toEqual("&amp;");
        expect(1).toEqual(1);
    });
});
describe("bar", function() {
    it("bar", function() {
        expect(TextEncoding.decodeUtf8(TextEncoding.encodeToUtf8("12345ABCabc!@#\u3042\u3044\u3046"))).toEqual("12345ABCabc!@#\u3042\u3044\u3046");
        expect(1).toEqual(1);
    });
});

