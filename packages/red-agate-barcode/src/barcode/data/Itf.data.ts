// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



const characterPatterns = new Map<number, string>([
    [0, "11221"],
    [1, "21112"],
    [2, "12112"],
    [3, "22111"],
    [4, "11212"],
    [5, "21211"],
    [6, "12211"],
    [7, "11122"],
    [8, "21121"],
    [9, "12121"]
]);


export const charactersMap = new Map<string, {index: number, pattern: string}>();
for (const a of characterPatterns) {
    for (const b of characterPatterns) {
        const x = a[0] * 10 + b[0];
        const c = String.fromCharCode(x);
        let p = "";
        for (let i = 0; i < 5; i++) {
            p += a[1][i] + b[1][i];
        }
        charactersMap.set(c, {index: x, pattern: p});
    }
}
charactersMap.set("\x64", {index: 100, pattern: "1111"}); // start
charactersMap.set("\x65", {index: 101, pattern: "211"}); // stop
