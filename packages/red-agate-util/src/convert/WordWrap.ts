// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export class WordWrap {

    public static loose(str: string, charsPerLine: number = 120): string {
        let r = "";
        let i = 0;
        for (const c of str) {
            i++;
            if (i >= charsPerLine && " \f\t\v".indexOf(c) > -1) {
                r += "\n";
                i = 0;
            } else {
                r += c;
            }
        }
        return r;
    }

    public static normal(str: string, charsPerLine: number = 120): string {
        // TODO: not implemented.
        //       do normal word-wrap.
        return WordWrap.loose(str, charsPerLine);
    }

    public static force(str: string, charsPerLine: number = 120): string {
        // TODO: not implemented.
        //       do break-word word-wrap.
        return WordWrap.loose(str, charsPerLine);
    }

}
