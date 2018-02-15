// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import { BitStreamWriter } from 'red-agate-util/modules/io/BitStream';



export interface QrCodewords {
    L: number[];
    M: number[];
    Q: number[];
    H: number[];
}

export interface QrDataLength {
    L: number[][];
    M: number[][];
    Q: number[][];
    H: number[][];
}

export type QrSourceDataTypes = (BitStreamWriter | Uint8Array | string | number);

export enum QrDataChunkType {
    Control,
    Number,
    Alnum,
    Binary
}


export const ecLevelMap = new Map<string, number>([
    ["L", 1], ["M", 0], ["Q", 3], ["H", 2]
]);

export const numberModeCharMap = new Map<string, number>([
    ["0", 0], ["1", 1], ["2", 2], ["3", 3], ["4", 4], ["5", 5], ["6", 6], ["7", 7], ["8", 8], ["9", 9]
]);

export const alnumModeCharMap = new Map<string, number>([
    ["0",  0], ["1",  1], ["2",  2], ["3",  3], ["4",  4], ["5",  5], ["6",  6], ["7",  7], ["8",  8], ["9",  9],
    ["A", 10], ["B", 11], ["C", 12], ["D", 13], ["E", 14], ["F", 15], ["G", 16], ["H", 17], ["I", 18], ["J", 19],
    ["K", 20], ["L", 21], ["M", 22], ["N", 23], ["O", 24], ["P", 25], ["Q", 26], ["R", 27], ["S", 28], ["T", 29],
    ["U", 30], ["V", 31], ["W", 32], ["X", 33], ["Y", 34], ["Z", 35], [" ", 36], ["$", 37], ["%", 38], ["*", 39],
    ["+", 40], ["-", 41], [".", 42], ["/", 43], [",", 44]
]);
