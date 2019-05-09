
import { Escape }          from '../convert/Escape';
import { TextEncoding }    from '../convert/TextEncoding';
import { Base64 }    from '../convert/Base64';
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

describe("Base64", function() {
    it("Base64", function() {
        expect(TextEncoding.decodeUtf8(Base64.decode(Base64.encode(TextEncoding.encodeToUtf8("12345ABCabc!@#\u3042\u3044\u3046"))))).toEqual("12345ABCabc!@#\u3042\u3044\u3046");
    });
    it("Base64 0", function() {
        expect(TextEncoding.decodeUtf8(Base64.decode(Base64.encode(TextEncoding.encodeToUtf8(""))))).toEqual("");
    });
    it("Base64 1", function() {
        expect(TextEncoding.decodeUtf8(Base64.decode(Base64.encode(TextEncoding.encodeToUtf8("1"))))).toEqual("1");
    });
    it("Base64 2", function() {
        expect(TextEncoding.decodeUtf8(Base64.decode(Base64.encode(TextEncoding.encodeToUtf8("12"))))).toEqual("12");
    });
    it("Base64 3", function() {
        expect(TextEncoding.decodeUtf8(Base64.decode(Base64.encode(TextEncoding.encodeToUtf8("123"))))).toEqual("123");
    });
    it("Base64 4", function() {
        expect(TextEncoding.decodeUtf8(Base64.decode(Base64.encode(TextEncoding.encodeToUtf8("1234"))))).toEqual("1234");
    });
    it("Base64 5", function() {
        expect(TextEncoding.decodeUtf8(Base64.decode(Base64.encode(TextEncoding.encodeToUtf8("12345"))))).toEqual("12345");
    });
    it("Base64 6", function() {
        expect(TextEncoding.decodeUtf8(Base64.decode(Base64.encode(TextEncoding.encodeToUtf8("123456"))))).toEqual("123456");
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

