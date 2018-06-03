
import { Escape }          from '../convert/Escape';
import { TextEncoding }    from '../convert/TextEncoding';
import { NumberPrecision } from '../convert/NumberPrecision';


describe("Escape", function() {
    it("Escape", function() {
        expect(Escape.html("&")).toEqual("&amp;");
    });
});

describe("TextEncoding", function() {
    it("TextEncoding", function() {
        expect(TextEncoding.decodeUtf8(TextEncoding.encodeToUtf8("12345ABCabc!@#\u3042\u3044\u3046"))).toEqual("12345ABCabc!@#\u3042\u3044\u3046");
    });
});

describe("NumberPrecision", function() {
    it("NumberPrecision(6)", function() {
        const dp6 = NumberPrecision.decimalPlaces(6);
        expect(dp6(11399.999999999998)).toEqual(11400);
        expect(dp6(11399.1111111)).toEqual(11399.111111);
        expect(dp6(11399.1111116)).toEqual(11399.111112);
    });
});

