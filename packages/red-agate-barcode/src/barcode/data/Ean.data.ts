// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export const charactersMap = new Map<string, {index: number, pattern: string}>([
    // left even(G)
    ["\x00", {index:   0, pattern: "-1123"}],
    ["\x01", {index:   1, pattern: "-1222"}],
    ["\x02", {index:   2, pattern: "-2212"}],
    ["\x03", {index:   3, pattern: "-1141"}],
    ["\x04", {index:   4, pattern: "-2311"}],
    ["\x05", {index:   5, pattern: "-1321"}],
    ["\x06", {index:   6, pattern: "-4111"}],
    ["\x07", {index:   7, pattern: "-2131"}],
    ["\x08", {index:   8, pattern: "-3121"}],
    ["\x09", {index:   9, pattern: "-2113"}],

    // left odd(L)
    ["\x10", {index:  10, pattern: "-3211"}],
    ["\x11", {index:  11, pattern: "-2221"}],
    ["\x12", {index:  12, pattern: "-2122"}],
    ["\x13", {index:  13, pattern: "-1411"}],
    ["\x14", {index:  14, pattern: "-1132"}],
    ["\x15", {index:  15, pattern: "-1231"}],
    ["\x16", {index:  16, pattern: "-1114"}],
    ["\x17", {index:  17, pattern: "-1312"}],
    ["\x18", {index:  18, pattern: "-1213"}],
    ["\x19", {index:  19, pattern: "-3112"}],

    // right even(R)
    ["\x20", {index:  20, pattern: "3211"}],
    ["\x21", {index:  21, pattern: "2221"}],
    ["\x22", {index:  22, pattern: "2122"}],
    ["\x23", {index:  23, pattern: "1411"}],
    ["\x24", {index:  24, pattern: "1132"}],
    ["\x25", {index:  25, pattern: "1231"}],
    ["\x26", {index:  26, pattern: "1114"}],
    ["\x27", {index:  27, pattern: "1312"}],
    ["\x28", {index:  28, pattern: "1213"}],
    ["\x29", {index:  29, pattern: "3112"}],

    // left even-odd (even(G):0, odd(L):1)
    ["\x30", {index:  30, pattern: "111111"}],
    ["\x31", {index:  31, pattern: "110100"}],
    ["\x32", {index:  32, pattern: "110010"}],
    ["\x33", {index:  33, pattern: "110001"}],
    ["\x34", {index:  34, pattern: "101100"}],
    ["\x35", {index:  35, pattern: "100110"}],
    ["\x36", {index:  36, pattern: "100011"}],
    ["\x37", {index:  37, pattern: "101010"}],
    ["\x38", {index:  38, pattern: "101001"}],
    ["\x39", {index:  39, pattern: "100101"}],

    // left guard bar
    ["\x40", {index:  40, pattern: "111"}],
    // center bar
    ["\x50", {index:  50, pattern: "-11111"}],
    // right guard bar
    ["\x60", {index:  60, pattern: "111"}],

    // EAN-5 checksum (even(G):0, odd(L):1)
    ["\x70", {index:  70, pattern: "00111"}],
    ["\x71", {index:  71, pattern: "01011"}],
    ["\x72", {index:  72, pattern: "01101"}],
    ["\x73", {index:  73, pattern: "01110"}],
    ["\x74", {index:  74, pattern: "10011"}],
    ["\x75", {index:  75, pattern: "11001"}],
    ["\x76", {index:  76, pattern: "11100"}],
    ["\x77", {index:  77, pattern: "10101"}],
    ["\x78", {index:  78, pattern: "10110"}],
    ["\x79", {index:  79, pattern: "11010"}],

    // EAN-2 checksum (even(G):0, odd(L):1)
    ["\x80", {index:  80, pattern: "11"}],
    ["\x81", {index:  81, pattern: "10"}],
    ["\x82", {index:  82, pattern: "01"}],
    ["\x83", {index:  83, pattern: "00"}],

    // EAN-5/2 start
    ["\x90", {index:  90, pattern: "-1112"}],
    // EAN-5/2 character separator
    ["\x91", {index:  91, pattern: "-11"}],

    // UPC-E start
    ["\x92", {index:  92, pattern: "112"}],
    // UPC-E stop
    ["\x93", {index:  93, pattern: "-111111"}],

    // UPC-E Number system 0 even-odd (even(G):0, odd(L):1)
    ["\xA0", {index: 100, pattern: "000111"}],
    ["\xA1", {index: 101, pattern: "001011"}],
    ["\xA2", {index: 102, pattern: "001101"}],
    ["\xA3", {index: 103, pattern: "001110"}],
    ["\xA4", {index: 104, pattern: "010011"}],
    ["\xA5", {index: 105, pattern: "011001"}],
    ["\xA6", {index: 106, pattern: "011100"}],
    ["\xA7", {index: 107, pattern: "010101"}],
    ["\xA8", {index: 108, pattern: "010110"}],
    ["\xA9", {index: 109, pattern: "011010"}],

    // UPC-E Number system 1 even-odd (even(G):0, odd(L):1)
    ["\xB0", {index: 110, pattern: "111000"}],
    ["\xB1", {index: 111, pattern: "110100"}],
    ["\xB2", {index: 112, pattern: "110010"}],
    ["\xB3", {index: 113, pattern: "110001"}],
    ["\xB4", {index: 114, pattern: "101100"}],
    ["\xB5", {index: 115, pattern: "100110"}],
    ["\xB6", {index: 116, pattern: "100011"}],
    ["\xB7", {index: 117, pattern: "101010"}],
    ["\xB8", {index: 118, pattern: "101001"}],
    ["\xB9", {index: 119, pattern: "100101"}],
]);

