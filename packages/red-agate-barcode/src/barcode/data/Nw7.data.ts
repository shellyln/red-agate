// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export const charactersMap = new Map<string, {index: number, pattern: string, width: number}>([
    ["0", {index:  0, pattern: "11111220", width:  9}],
    ["1", {index:  1, pattern: "11112210", width:  9}],
    ["2", {index:  2, pattern: "11121120", width:  9}],
    ["3", {index:  3, pattern: "22111110", width:  9}],
    ["4", {index:  4, pattern: "11211210", width:  9}],
    ["5", {index:  5, pattern: "21111210", width:  9}],
    ["6", {index:  6, pattern: "12111120", width:  9}],
    ["7", {index:  7, pattern: "12112110", width:  9}],
    ["8", {index:  8, pattern: "12211110", width:  9}],
    ["9", {index:  9, pattern: "21121110", width:  9}],
    ["-", {index: 10, pattern: "11122110", width:  9}],
    ["$", {index: 11, pattern: "11221110", width:  9}],
    [":", {index: 12, pattern: "21112120", width: 10}],
    ["/", {index: 13, pattern: "21211120", width: 10}],
    [".", {index: 14, pattern: "21212110", width: 10}],
    ["+", {index: 15, pattern: "11212120", width: 10}],
    ["A", {index: 16, pattern: "11221210", width: 10}],
    ["B", {index: 17, pattern: "12121120", width: 10}],
    ["C", {index: 18, pattern: "11121220", width: 10}],
    ["D", {index: 19, pattern: "11122210", width: 10}]
]);


export const reverseMap = new Map<number, string>();
for (const e of charactersMap.entries()) reverseMap.set(e[1].index, e[0]);
