// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export const charactersMap = new Map<string, {index: number, pattern: string}>([
    ["\x00", {index:   0, pattern: "212222"}],
    ["\x01", {index:   1, pattern: "222122"}],
    ["\x02", {index:   2, pattern: "222221"}],
    ["\x03", {index:   3, pattern: "121223"}],
    ["\x04", {index:   4, pattern: "121322"}],
    ["\x05", {index:   5, pattern: "131222"}],
    ["\x06", {index:   6, pattern: "122213"}],
    ["\x07", {index:   7, pattern: "122312"}],
    ["\x08", {index:   8, pattern: "132212"}],
    ["\x09", {index:   9, pattern: "221213"}],
    ["\x0A", {index:  10, pattern: "221312"}],
    ["\x0B", {index:  11, pattern: "231212"}],
    ["\x0C", {index:  12, pattern: "112232"}],
    ["\x0D", {index:  13, pattern: "122132"}],
    ["\x0E", {index:  14, pattern: "122231"}],
    ["\x0F", {index:  15, pattern: "113222"}],

    ["\x10", {index:  16, pattern: "123122"}],
    ["\x11", {index:  17, pattern: "123221"}],
    ["\x12", {index:  18, pattern: "223211"}],
    ["\x13", {index:  19, pattern: "221132"}],
    ["\x14", {index:  20, pattern: "221231"}],
    ["\x15", {index:  21, pattern: "213212"}],
    ["\x16", {index:  22, pattern: "223112"}],
    ["\x17", {index:  23, pattern: "312131"}],
    ["\x18", {index:  24, pattern: "311222"}],
    ["\x19", {index:  25, pattern: "321122"}],
    ["\x1A", {index:  26, pattern: "321221"}],
    ["\x1B", {index:  27, pattern: "312212"}],
    ["\x1C", {index:  28, pattern: "322112"}],
    ["\x1D", {index:  29, pattern: "322211"}],
    ["\x1E", {index:  30, pattern: "212123"}],
    ["\x1F", {index:  31, pattern: "212321"}],

    ["\x20", {index:  32, pattern: "232121"}],
    ["\x21", {index:  33, pattern: "111323"}],
    ["\x22", {index:  34, pattern: "131123"}],
    ["\x23", {index:  35, pattern: "131321"}],
    ["\x24", {index:  36, pattern: "112313"}],
    ["\x25", {index:  37, pattern: "132113"}],
    ["\x26", {index:  38, pattern: "132311"}],
    ["\x27", {index:  39, pattern: "211313"}],
    ["\x28", {index:  40, pattern: "231113"}],
    ["\x29", {index:  41, pattern: "231311"}],
    ["\x2A", {index:  42, pattern: "112133"}],
    ["\x2B", {index:  43, pattern: "112331"}],
    ["\x2C", {index:  44, pattern: "132131"}],
    ["\x2D", {index:  45, pattern: "113123"}],
    ["\x2E", {index:  46, pattern: "113321"}],
    ["\x2F", {index:  47, pattern: "133121"}],

    ["\x30", {index:  48, pattern: "313121"}],
    ["\x31", {index:  49, pattern: "211331"}],
    ["\x32", {index:  50, pattern: "231131"}],
    ["\x33", {index:  51, pattern: "213113"}],
    ["\x34", {index:  52, pattern: "213311"}],
    ["\x35", {index:  53, pattern: "213131"}],
    ["\x36", {index:  54, pattern: "311123"}],
    ["\x37", {index:  55, pattern: "311321"}],
    ["\x38", {index:  56, pattern: "331121"}],
    ["\x39", {index:  57, pattern: "312113"}],
    ["\x3A", {index:  58, pattern: "312311"}],
    ["\x3B", {index:  59, pattern: "332111"}],
    ["\x3C", {index:  60, pattern: "314111"}],
    ["\x3D", {index:  61, pattern: "221411"}],
    ["\x3E", {index:  62, pattern: "431111"}],
    ["\x3F", {index:  63, pattern: "111224"}],

    ["\x40", {index:  64, pattern: "111422"}],
    ["\x41", {index:  65, pattern: "121124"}],
    ["\x42", {index:  66, pattern: "121421"}],
    ["\x43", {index:  67, pattern: "141122"}],
    ["\x44", {index:  68, pattern: "141221"}],
    ["\x45", {index:  69, pattern: "112214"}],
    ["\x46", {index:  70, pattern: "112412"}],
    ["\x47", {index:  71, pattern: "122114"}],
    ["\x48", {index:  72, pattern: "122411"}],
    ["\x49", {index:  73, pattern: "142112"}],
    ["\x4A", {index:  74, pattern: "142211"}],
    ["\x4B", {index:  75, pattern: "241211"}],
    ["\x4C", {index:  76, pattern: "221114"}],
    ["\x4D", {index:  77, pattern: "413111"}],
    ["\x4E", {index:  78, pattern: "241112"}],
    ["\x4F", {index:  79, pattern: "134111"}],

    ["\x50", {index:  80, pattern: "111242"}],
    ["\x51", {index:  81, pattern: "121142"}],
    ["\x52", {index:  82, pattern: "121241"}],
    ["\x53", {index:  83, pattern: "114212"}],
    ["\x54", {index:  84, pattern: "124112"}],
    ["\x55", {index:  85, pattern: "124211"}],
    ["\x56", {index:  86, pattern: "411212"}],
    ["\x57", {index:  87, pattern: "421112"}],
    ["\x58", {index:  88, pattern: "421211"}],
    ["\x59", {index:  89, pattern: "212141"}],
    ["\x5A", {index:  90, pattern: "214121"}],
    ["\x5B", {index:  91, pattern: "412121"}],
    ["\x5C", {index:  92, pattern: "111143"}],
    ["\x5D", {index:  93, pattern: "111341"}],
    ["\x5E", {index:  94, pattern: "131141"}],
    ["\x5F", {index:  95, pattern: "114113"}],

    ["\x60", {index:  96, pattern: "114311"}],
    ["\x61", {index:  97, pattern: "411113"}],
    ["\x62", {index:  98, pattern: "411311"}],
    ["\x63", {index:  99, pattern: "113141"}],
    ["\x64", {index: 100, pattern: "114131"}],
    ["\x65", {index: 101, pattern: "311141"}],
    ["\x66", {index: 102, pattern: "411131"}], // FNC1
    ["\x67", {index: 103, pattern: "211412"}], // start A
    ["\x68", {index: 104, pattern: "211214"}], // start B
    ["\x69", {index: 105, pattern: "211232"}], // start C
    ["\x6A", {index: 106, pattern: "2331112"}] // stop
]);


export const fullAsciiMap = new Map<number, Array<string | null>>([
    [  0, ["\x40", null  ]], // NUL
    [  1, ["\x41", null  ]], // SOH
    [  2, ["\x42", null  ]], // STX
    [  3, ["\x43", null  ]], // ETX
    [  4, ["\x44", null  ]], // EOT
    [  5, ["\x45", null  ]], // ENQ
    [  6, ["\x46", null  ]], // ACK
    [  7, ["\x47", null  ]], // BEL
    [  8, ["\x48", null  ]], // BS
    [  9, ["\x49", null  ]], // HT
    [  0, ["\x4A", null  ]], // LF
    [ 11, ["\x4B", null  ]], // VT
    [ 12, ["\x4C", null  ]], // FF
    [ 13, ["\x4D", null  ]], // CR
    [ 14, ["\x4E", null  ]], // SO
    [ 15, ["\x4F", null  ]], // SI
    [ 16, ["\x50", null  ]], // DLE
    [ 17, ["\x51", null  ]], // DC1
    [ 18, ["\x52", null  ]], // DC2
    [ 19, ["\x53", null  ]], // DC3
    [ 20, ["\x54", null  ]], // DC4
    [ 21, ["\x55", null  ]], // NAK
    [ 22, ["\x56", null  ]], // SYN
    [ 23, ["\x57", null  ]], // ETB
    [ 24, ["\x58", null  ]], // CAN
    [ 25, ["\x59", null  ]], // EM
    [ 26, ["\x5A", null  ]], // SUB
    [ 27, ["\x5B", null  ]], // ESC
    [ 28, ["\x5C", null  ]], // FS
    [ 29, ["\x5D", null  ]], // GS
    [ 30, ["\x5E", null  ]], // RS
    [ 31, ["\x5F", null  ]], // US
    [ 32, ["\x00", "\x00"]], // SP
    [ 33, ["\x01", "\x01"]], // !
    [ 34, ["\x02", "\x02"]], // "
    [ 35, ["\x03", "\x03"]], // #
    [ 36, ["\x04", "\x04"]], // $
    [ 37, ["\x05", "\x05"]], // %
    [ 38, ["\x06", "\x06"]], // &
    [ 39, ["\x07", "\x07"]], // '
    [ 40, ["\x08", "\x08"]], // (
    [ 41, ["\x09", "\x09"]], // )
    [ 42, ["\x0A", "\x0A"]], // *
    [ 43, ["\x0B", "\x0B"]], // +
    [ 44, ["\x0C", "\x0C"]], // ,
    [ 45, ["\x0D", "\x0D"]], // -
    [ 46, ["\x0E", "\x0E"]], // .
    [ 47, ["\x0F", "\x0F"]], // /
    [ 48, ["\x10", "\x10"]], // 0
    [ 49, ["\x11", "\x11"]], // 1
    [ 50, ["\x12", "\x12"]], // 2
    [ 51, ["\x13", "\x13"]], // 3
    [ 52, ["\x14", "\x14"]], // 4
    [ 53, ["\x15", "\x15"]], // 5
    [ 54, ["\x16", "\x16"]], // 6
    [ 55, ["\x17", "\x17"]], // 7
    [ 56, ["\x18", "\x18"]], // 8
    [ 57, ["\x19", "\x19"]], // 9
    [ 58, ["\x1A", "\x1A"]], // :
    [ 59, ["\x1B", "\x1B"]], // ;
    [ 60, ["\x1C", "\x1C"]], // <
    [ 61, ["\x1D", "\x1D"]], // =
    [ 62, ["\x1E", "\x1E"]], // >
    [ 63, ["\x1F", "\x1F"]], // ?
    [ 64, ["\x20", "\x20"]], // @
    [ 65, ["\x21", "\x21"]], // A
    [ 66, ["\x22", "\x22"]], // B
    [ 67, ["\x23", "\x23"]], // C
    [ 68, ["\x24", "\x24"]], // D
    [ 69, ["\x25", "\x25"]], // E
    [ 70, ["\x26", "\x26"]], // F
    [ 71, ["\x27", "\x27"]], // G
    [ 72, ["\x28", "\x28"]], // H
    [ 73, ["\x29", "\x29"]], // I
    [ 74, ["\x2A", "\x2A"]], // J
    [ 75, ["\x2B", "\x2B"]], // K
    [ 76, ["\x2C", "\x2C"]], // L
    [ 77, ["\x2D", "\x2D"]], // M
    [ 78, ["\x2E", "\x2E"]], // N
    [ 79, ["\x2F", "\x2F"]], // O
    [ 80, ["\x30", "\x30"]], // P
    [ 81, ["\x31", "\x31"]], // Q
    [ 82, ["\x32", "\x32"]], // R
    [ 83, ["\x33", "\x33"]], // S
    [ 84, ["\x34", "\x34"]], // T
    [ 85, ["\x35", "\x35"]], // U
    [ 86, ["\x36", "\x36"]], // V
    [ 87, ["\x37", "\x37"]], // W
    [ 88, ["\x38", "\x38"]], // X
    [ 89, ["\x39", "\x39"]], // Y
    [ 90, ["\x3A", "\x3A"]], // Z
    [ 91, ["\x3B", "\x3B"]], // [
    [ 92, ["\x3C", "\x3C"]], // backslash
    [ 93, ["\x3D", "\x3D"]], // ]
    [ 94, ["\x3E", "\x3E"]], // ^
    [ 95, ["\x3F", "\x3F"]], // _
    [ 96, [null  , "\x40"]], // `
    [ 97, [null  , "\x41"]], // a
    [ 98, [null  , "\x42"]], // b
    [ 99, [null  , "\x43"]], // c
    [100, [null  , "\x44"]], // d
    [101, [null  , "\x45"]], // e
    [102, [null  , "\x46"]], // f
    [103, [null  , "\x47"]], // g
    [104, [null  , "\x48"]], // h
    [105, [null  , "\x49"]], // i
    [106, [null  , "\x4A"]], // j
    [107, [null  , "\x4B"]], // k
    [108, [null  , "\x4C"]], // l
    [109, [null  , "\x4D"]], // m
    [110, [null  , "\x4E"]], // n
    [111, [null  , "\x4F"]], // o
    [112, [null  , "\x50"]], // p
    [113, [null  , "\x51"]], // q
    [114, [null  , "\x52"]], // r
    [115, [null  , "\x53"]], // s
    [116, [null  , "\x54"]], // t
    [117, [null  , "\x55"]], // u
    [118, [null  , "\x56"]], // v
    [119, [null  , "\x57"]], // w
    [120, [null  , "\x58"]], // x
    [121, [null  , "\x59"]], // y
    [122, [null  , "\x5A"]], // z
    [123, [null  , "\x5B"]], // {
    [124, [null  , "\x5C"]], // |
    [125, [null  , "\x5D"]], // }
    [126, [null  , "\x5E"]], // ~
    [127, [null  , "\x5F"]], // DEL

    [128, ["\x66", "\x66", "\x66"]], // FNC1
    [129, ["\x61", "\x61", null  ]], // FNC2
    [130, ["\x60", "\x60", null  ]], // FNC3
    [131, ["\x65", "\x64", null  ]], // FNC4
    [132, [null  , "\x65", "\x65"]], // CODE A
    [133, ["\x64", null  , "\x64"]], // CODE B
    [134, ["\x63", "\x63", null  ]], // CODE C
    [135, [null  , "\x62", null  ]], // SHIFT A
    [135, ["\x62", null  , null  ]], // SHIFT B
]);

