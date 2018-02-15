// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export const charactersMap = new Map<string, {index: number, pattern: string}>([
    ["0", {index:  0, pattern: "144"}],
    ["1", {index:  1, pattern: "114"}],
    ["2", {index:  2, pattern: "132"}],
    ["3", {index:  3, pattern: "312"}],
    ["4", {index:  4, pattern: "123"}],
    ["5", {index:  5, pattern: "141"}],
    ["6", {index:  6, pattern: "321"}],
    ["7", {index:  7, pattern: "213"}],
    ["8", {index:  8, pattern: "231"}],
    ["9", {index:  9, pattern: "411"}],
    ["-", {index: 10, pattern: "414"}],
    ["A", {index: 11, pattern: "324"}], // CC1
    ["B", {index: 12, pattern: "342"}], // CC2
    ["C", {index: 13, pattern: "234"}], // CC3
    ["D", {index: 14, pattern: "432"}], // CC4
    ["E", {index: 15, pattern: "243"}], // CC5
    ["F", {index: 16, pattern: "423"}], // CC6
    ["G", {index: 17, pattern: "441"}], // CC7
    ["H", {index: 18, pattern: "111"}], // CC8
    ["[", {index: 19, pattern: "13" }], // start
    ["]", {index: 38, pattern: "31" }]  // stop
]);


export const reverseMap = new Map<number, string>();
for (const e of charactersMap.entries()) reverseMap.set(e[1].index, e[0]);


export const fullAsciiMap = new Map<number, string>([
    [ 45, "-" ], // -
    [ 48, "0" ], // 0
    [ 49, "1" ], // 1
    [ 50, "2" ], // 2
    [ 51, "3" ], // 3
    [ 52, "4" ], // 4
    [ 53, "5" ], // 5
    [ 54, "6" ], // 6
    [ 55, "7" ], // 7
    [ 56, "8" ], // 8
    [ 57, "9" ], // 9
    [ 65, "A0" ], // A
    [ 66, "A1" ], // B
    [ 67, "A2" ], // C
    [ 68, "A3" ], // D
    [ 69, "A4" ], // E
    [ 70, "A5" ], // F
    [ 71, "A6" ], // G
    [ 72, "A7" ], // H
    [ 73, "A8" ], // I
    [ 74, "A9" ], // J
    [ 75, "B0" ], // K
    [ 76, "B1" ], // L
    [ 77, "B2" ], // M
    [ 78, "B3" ], // N
    [ 79, "B4" ], // O
    [ 80, "B5" ], // P
    [ 81, "B6" ], // Q
    [ 82, "B7" ], // R
    [ 83, "B8" ], // S
    [ 84, "B9" ], // T
    [ 85, "C0" ], // U
    [ 86, "C1" ], // V
    [ 87, "C2" ], // W
    [ 88, "C3" ], // X
    [ 89, "C4" ], // Y
    [ 90, "C5" ], // Z
]);

