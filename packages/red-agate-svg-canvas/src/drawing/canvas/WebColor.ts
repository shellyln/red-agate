// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export class WebColor {
    private static colorNames = new Map<string, {r: number, g: number, b: number}>([
        ["red"                 , {r: 255, g:   0, b:   0}],
        ["darkred"             , {r: 139, g:   0, b:   0}],
        ["maroon"              , {r: 128, g:   0, b:   0}],
        ["brown"               , {r: 165, g:  42, b:  42}],
        ["firebrick"           , {r: 178, g:  34, b:  34}],
        ["sienna"              , {r: 160, g:  82, b:  45}],
        ["saddlebrown"         , {r: 139, g:  69, b:  19}],
        ["peru"                , {r: 205, g: 133, b:  63}],
        ["indianred"           , {r: 205, g:  92, b:  92}],
        ["rosybrown"           , {r: 188, g: 143, b: 143}],
        ["lightcoral"          , {r: 240, g: 128, b: 128}],
        ["salmon"              , {r: 250, g: 128, b: 114}],
        ["darksalmon"          , {r: 233, g: 150, b: 122}],
        ["coral"               , {r: 255, g: 127, b:  80}],
        ["tomato"              , {r: 255, g:  99, b:  71}],
        ["sandybrown"          , {r: 244, g: 164, b:  96}],
        ["lightsalmon"         , {r: 255, g: 160, b: 122}],
        ["chocolate"           , {r: 210, g: 105, b:  30}],
        ["orangered"           , {r: 255, g:  69, b:   0}],
        ["orange"              , {r: 255, g: 165, b:   0}],
        ["darkorange"          , {r: 255, g: 140, b:   0}],
        ["tan"                 , {r: 210, g: 180, b: 140}],
        ["peachpuff"           , {r: 255, g: 218, b: 185}],
        ["bisque"              , {r: 255, g: 228, b: 196}],
        ["moccasin"            , {r: 255, g: 228, b: 181}],
        ["navajowhite"         , {r: 255, g: 222, b: 173}],
        ["wheat"               , {r: 245, g: 222, b: 179}],
        ["burlywood"           , {r: 222, g: 184, b: 135}],
        ["darkgoldenrod"       , {r: 184, g: 134, b:  11}],
        ["goldenrod"           , {r: 218, g: 165, b:  32}],
        ["gold"                , {r: 255, g: 215, b:   0}],
        ["yellow"              , {r: 255, g: 255, b:   0}],
        ["lightgoldenrodyellow", {r: 250, g: 250, b: 210}],
        ["palegoldenrod"       , {r: 238, g: 232, b: 170}],
        ["khaki"               , {r: 240, g: 230, b: 140}],
        ["darkkhaki"           , {r: 189, g: 183, b: 107}],
        ["blanchedalmond"      , {r: 255, g: 235, b: 205}],
        ["lightyellow"         , {r: 255, g: 255, b: 224}],
        ["cornsilk"            , {r: 255, g: 248, b: 220}],
        ["antiquewhite"        , {r: 250, g: 235, b: 215}],
        ["papayawhip"          , {r: 255, g: 239, b: 213}],
        ["papayawhite"         , {r: 255, g: 239, b: 213}],
        ["lemonchiffon"        , {r: 255, g: 250, b: 205}],
        ["beige"               , {r: 245, g: 245, b: 220}],
        ["oldlace"             , {r: 253, g: 245, b: 230}],
        ["lightcyan"           , {r: 224, g: 255, b: 255}],
        ["aliceblue"           , {r: 240, g: 248, b: 255}],
        ["whitesmoke"          , {r: 245, g: 245, b: 245}],
        ["lavenderblush"       , {r: 255, g: 240, b: 245}],
        ["floralwhite"         , {r: 255, g: 250, b: 240}],
        ["mintcream"           , {r: 245, g: 255, b: 250}],
        ["ghostwhite"          , {r: 248, g: 248, b: 255}],
        ["honeydew"            , {r: 240, g: 255, b: 240}],
        ["seashell"            , {r: 255, g: 245, b: 238}],
        ["ivory"               , {r: 255, g: 255, b: 240}],
        ["azure"               , {r: 240, g: 255, b: 255}],
        ["snow"                , {r: 255, g: 250, b: 250}],
        ["white"               , {r: 255, g: 255, b: 255}],
        ["gainsboro"           , {r: 220, g: 220, b: 220}],
        ["lightgrey"           , {r: 211, g: 211, b: 211}],
        ["silver"              , {r: 192, g: 192, b: 192}],
        ["darkgray"            , {r: 169, g: 169, b: 169}],
        ["lightslategray"      , {r: 119, g: 136, b: 153}],
        ["slategray"           , {r: 112, g: 128, b: 144}],
        ["gray"                , {r: 128, g: 128, b: 128}],
        ["dimgray"             , {r: 105, g: 105, b: 105}],
        ["darkslategray"       , {r:  47, g:  79, b:  79}],
        ["black"               , {r:   0, g:   0, b:   0}],
        ["lawngreen"           , {r: 124, g: 252, b:   0}],
        ["greenyellow"         , {r: 173, g: 255, b:  47}],
        ["chartreuse"          , {r: 127, g: 255, b:   0}],
        ["lime"                , {r:   0, g: 255, b:   0}],
        ["limegreen"           , {r:  50, g: 205, b:  50}],
        ["yellowgreen"         , {r: 154, g: 205, b:  50}],
        ["olive"               , {r: 128, g: 128, b:   0}],
        ["olivedrab"           , {r: 107, g: 142, b:  35}],
        ["darkolivegreen"      , {r:  85, g: 107, b:  47}],
        ["forestgreen"         , {r:  34, g: 139, b:  34}],
        ["darkgreen"           , {r:   0, g: 100, b:   0}],
        ["green"               , {r:   0, g: 128, b:   0}],
        ["seagreen"            , {r:  46, g: 139, b:  87}],
        ["mediumseagreen"      , {r:  60, g: 179, b: 113}],
        ["darkseagreen"        , {r: 143, g: 188, b: 143}],
        ["lightgreen"          , {r: 144, g: 238, b: 144}],
        ["palegreen"           , {r: 152, g: 251, b: 152}],
        ["springgreen"         , {r:   0, g: 255, b: 127}],
        ["mediumspringgreen"   , {r:   0, g: 250, b: 154}],
        ["teal"                , {r:   0, g: 128, b: 128}],
        ["darkcyan"            , {r:   0, g: 139, b: 139}],
        ["lightseagreen"       , {r:  51, g: 153, b: 153}],
        ["mediumaquamarine"    , {r: 102, g: 205, b: 170}],
        ["cadetblue"           , {r:  95, g: 158, b: 160}],
        ["steelblue"           , {r:  70, g: 130, b: 180}],
        ["aquamarine"          , {r: 127, g: 255, b: 212}],
        ["powderblue"          , {r: 176, g: 224, b: 230}],
        ["paleturquoise"       , {r: 175, g: 238, b: 238}],
        ["lightblue"           , {r: 173, g: 216, b: 230}],
        ["lightsteelblue"      , {r: 176, g: 196, b: 222}],
        ["skyblue"             , {r: 135, g: 206, b: 235}],
        ["lightskyblue"        , {r: 135, g: 206, b: 250}],
        ["mediumturquoise"     , {r:  72, g: 209, b: 204}],
        ["turquoise"           , {r:  64, g: 224, b: 208}],
        ["darkturquoise"       , {r:   0, g: 206, b: 209}],
        ["aqua"                , {r:   0, g: 255, b: 255}],
        ["cyan"                , {r:   0, g: 255, b: 255}],
        ["deepskyblue"         , {r:   0, g: 191, b: 255}],
        ["dodgerblue"          , {r:  30, g: 144, b: 255}],
        ["cornflowerblue"      , {r: 100, g: 149, b: 237}],
        ["royalblue"           , {r:  65, g: 105, b: 225}],
        ["blue"                , {r:   0, g:   0, b: 255}],
        ["mediumblue"          , {r:   0, g:   0, b: 205}],
        ["navy"                , {r:   0, g:   0, b: 128}],
        ["darkblue"            , {r:   0, g:   0, b: 139}],
        ["midnightblue"        , {r:  25, g:  25, b: 112}],
        ["darkslateblue"       , {r:  72, g:  61, b: 139}],
        ["mediumslateblue"     , {r: 123, g: 104, b: 238}],
        ["slateblue"           , {r: 106, g:  90, b: 205}],
        ["darkorchid"          , {r: 153, g:  50, b: 204}],
        ["darkviolet"          , {r: 148, g:   0, b: 211}],
        ["blueviolet"          , {r: 138, g:  43, b: 226}],
        ["mediumorchid"        , {r: 186, g:  85, b: 211}],
        ["plum"                , {r: 221, g: 160, b: 221}],
        ["lavender"            , {r: 230, g: 230, b: 250}],
        ["thistle"             , {r: 216, g: 191, b: 216}],
        ["orchid"              , {r: 218, g: 112, b: 214}],
        ["magenta"             , {r: 255, g:   0, b: 255}],
        ["fuchsia"             , {r: 255, g:   0, b: 255}],
        ["violet"              , {r: 238, g: 130, b: 238}],
        ["indigo"              , {r:  75, g:   0, b: 130}],
        ["darkmagenta"         , {r: 139, g:   0, b: 139}],
        ["purple"              , {r: 128, g:   0, b: 128}],
        ["mediumpurple"        , {r: 147, g: 112, b: 219}],
        ["mediumvioletred"     , {r: 199, g:  21, b: 133}],
        ["deeppink"            , {r: 255, g:  20, b: 147}],
        ["hotpink"             , {r: 255, g: 105, b: 180}],
        ["crimson"             , {r: 220, g:  20, b:  60}],
        ["palevioletred"       , {r: 219, g: 112, b: 147}],
        ["lightpink"           , {r: 255, g: 182, b: 193}],
        ["pink"                , {r: 255, g: 192, b: 203}],
        ["mistyrose"           , {r: 255, g: 228, b: 225}]
    ]);

    /**
     * red
     */
    // tslint:disable-next-line:variable-name
    private _r: number = 0;

    /**
     * green
     */
    // tslint:disable-next-line:variable-name
    private _g: number = 0;

    /**
     * blue
     */
    // tslint:disable-next-line:variable-name
    private _b: number = 0;

    /**
     * alpha channel
     */
    // tslint:disable-next-line:variable-name
    private _a: number = 1;

    private static cutoff255(x: number) {
        if (x < 0) return 0;
        if (x > 255) return 255;
        return x;
    }

    private static cutoff1(x: number) {
        if (x < 0) return 0;
        if (x > 1) return 1;
        return x;
    }

    // tslint:disable-next-line:variable-name
    constructor(name_or_code?: string | {r: number, g: number, b: number, a?: number} | {h: number, s: number, l: number, a?: number}) {
        if (! name_or_code) return;

        let rgba: {r: number, g: number, b: number, a: number} = {r: 0, g: 0, b: 0, a: 1};

        if (typeof name_or_code === "object") {
            if (name_or_code.hasOwnProperty("r")) {
                const c2 = name_or_code as {r: number, g: number, b: number, a?: number};
                rgba = {
                    r: WebColor.cutoff255(c2.r),
                    g: WebColor.cutoff255(c2.g),
                    b: WebColor.cutoff255(c2.b),
                    a: WebColor.cutoff1(c2.a || 1)
                };
            } else if (name_or_code.hasOwnProperty("h")) {
                const hsla = name_or_code as {h: number, s: number, l: number, a?: number};
                rgba = WebColor.hslToRgb(hsla.h, hsla.s, hsla.l, hsla.a || 1);
            }
        } else if (typeof name_or_code === "string") {
            let c: {r: number, g: number, b: number, a?: number} | {h: number, s: number, l: number, a?: number} | boolean;

            // tslint:disable-next-line:no-conditional-assignment
            if (c = (WebColor.isCode(name_or_code) || WebColor.isName(name_or_code) || WebColor.isRgb(name_or_code))) {
                const c2 = c as {r: number, g: number, b: number, a: number};
                rgba = c2;
            }
            // tslint:disable-next-line:no-conditional-assignment
            else if (c = WebColor.isHsl(name_or_code)) {
                const hsla = c as {h: number, s: number, l: number, a?: number};
                rgba = WebColor.hslToRgb(hsla.h, hsla.s, hsla.l, hsla.a);
            }
        }

        this._r = rgba.r;
        this._g = rgba.g;
        this._b = rgba.b;
        this._a = rgba.a;
    }
    public static isRgb(str: string): {r: number, g: number, b: number, a: number} | boolean {
        let r: number, g: number, b: number, a = 1;
        let match: RegExpMatchArray | null;

        // tslint:disable-next-line:no-conditional-assignment
        if (match = str.match(/^\s*rgb(a?)\(\s*(-?(?:\d+\.)?\d+%?)\s*,\s*(-?(?:\d+\.)?\d+%?)\s*,\s*(-?(?:\d+\.)?\d+%?)\s*(?:,\s*((?:[01]?\.)?\d+)\s*)?\)\s*$/)) {
            r = WebColor.cutoff255(match[2].endsWith("%") ? Math.round(Number.parseFloat(match[2]) / 100 * 255) : Number.parseInt(match[2], 10));
            g = WebColor.cutoff255(match[3].endsWith("%") ? Math.round(Number.parseFloat(match[3]) / 100 * 255) : Number.parseInt(match[3], 10));
            b = WebColor.cutoff255(match[4].endsWith("%") ? Math.round(Number.parseFloat(match[4]) / 100 * 255) : Number.parseInt(match[4], 10));
            if (match[1] === "a") {
                a = WebColor.cutoff1(Number.parseFloat(match[5]));
            }
            return {r, g, b, a};
        }
        return false;
    }
    public static isHsl(str: string): {h: number, s: number, l: number, a: number} | boolean {
        let h: number, s: number, l: number, a = 1;
        let match: RegExpMatchArray | null;

        // tslint:disable-next-line:no-conditional-assignment
        if (match = str.match(/^\s*hsl(a?)\(\s*(-?(?:\d+\.)?\d+)\s*,\s*(-?(?:\d+\.)?\d+%?)\s*,\s*(-?(?:\d+\.)?\d+%?)\s*,\s*((?:[01]?\.)?\d+)\s*\)\s*$/)) {
            h = Number.parseFloat(match[2]) % 360;
            if (h < 0) h = 360 - h;
            s = WebColor.cutoff1(match[3].endsWith("%") ? Math.round(Number.parseFloat(match[3]) / 100) : Number.parseFloat(match[3]));
            l = WebColor.cutoff1(match[4].endsWith("%") ? Math.round(Number.parseFloat(match[4]) / 100) : Number.parseFloat(match[4]));
            if (match[1] === "a") {
                a = WebColor.cutoff1(Number.parseFloat(match[5]));
            }
            return {h, s, l, a};
        }
        return false;
    }
    public static isCode(str: string): {r: number, g: number, b: number, a: number} | boolean {
        let   r: number, g: number, b: number;
        const a = 1;
        let match: RegExpMatchArray | null;

        // tslint:disable-next-line:no-conditional-assignment
        if (match = str.match(/^\s*#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])\s*$/)) {
            r = Number.parseInt(`${match[1]}${match[1]}`, 16);
            g = Number.parseInt(`${match[2]}${match[2]}`, 16);
            b = Number.parseInt(`${match[3]}${match[3]}`, 16);
            return {r, g, b, a};
        }
        // tslint:disable-next-line:no-conditional-assignment
        else if (match = str.match(/^\s*#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})\s*$/)) {
            r = Number.parseInt(match[1], 16);
            g = Number.parseInt(match[2], 16);
            b = Number.parseInt(match[3], 16);
            return {r, g, b, a};
        }
        return false;
    }
    public static isName(str: string): {r: number, g: number, b: number, a: number} | boolean {
        if (WebColor.colorNames.has(str)) {
            const c = WebColor.colorNames.get(str) as {r: number, g: number, b: number, a: number};
            return {r: c.r, g: c.g, b: c.b, a: 1};
        }
        return false;
    }
    public static fromRgba(r: number, g: number, b: number, a: number = 1): WebColor {
        const c = new WebColor();
        c._r = WebColor.cutoff255(r);
        c._g = WebColor.cutoff255(g);
        c._b = WebColor.cutoff255(b);
        c._a = WebColor.cutoff1(a);
        return c;
    }
    private static hueToRgb(m1: number, m2: number, h: number): number {
        if (h < 0) h += 1;
        if (h > 1) h -= 1;
        if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
        if (h * 2 < 1) return m2;
        if (h * 3 < 2) return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        return m1;
    }
    public static hslToRgb(h: number, s: number, l: number, a: number = 1): {r: number, g: number, b: number, a: number} {
        // tslint:disable-next-line:ban-comma-operator
        h = h % 360, s = WebColor.cutoff1(s), l = WebColor.cutoff1(l);
        if (h < 0) h = 360 - h;
        const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s,
              m1 = l * 2 - m2;
        return {
            r: WebColor.hueToRgb(m1, m2, h + 1 / 3),
            g: WebColor.hueToRgb(m1, m2, h),
            b: WebColor.hueToRgb(m1, m2, h - 1 / 3),
            a: WebColor.cutoff1(a)
        };
    }
    public static fromHsla(h: number, s: number, l: number, a: number = 1): WebColor {
        // tslint:disable-next-line:ban-comma-operator
        h = h % 360, s = WebColor.cutoff1(s), l = WebColor.cutoff1(l);
        if (h < 0) h = 360 - h;
        const  c = new WebColor();
        const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s,
              m1 = l * 2 - m2;
        c._r = WebColor.hueToRgb(m1, m2, h + 1 / 3);
        c._g = WebColor.hueToRgb(m1, m2, h);
        c._b = WebColor.hueToRgb(m1, m2, h - 1 / 3);
        c._a = WebColor.cutoff1(a);
        return c;
    }
    public static fromGray(gray: number, a: number = 1): WebColor {
        const c = new WebColor();
        c._r = WebColor.cutoff255(gray);
        c._g = WebColor.cutoff255(gray);
        c._b = WebColor.cutoff255(gray);
        c._a = WebColor.cutoff1(a);
        return c;
    }
    public get r(): number {
        return this._r;
    }
    public get g(): number {
        return this._g;
    }
    public get b(): number {
        return this._b;
    }
    public get a(): number {
        return this._a;
    }
    public toString(): string {
        if (this._a !== 1) return this.toRgbaString();
        else               return this.toCode();
    }
    public toCode(): string {
        return "#" +
            `0${this._r.toString(16)}`.slice(-2) +
            `0${this._g.toString(16)}`.slice(-2) +
            `0${this._b.toString(16)}`.slice(-2);
    }
    public toRgbString(): string {
        return `rgb(${this._r},${this._g},${this._b})`;
    }
    public toRgbaString(): string {
        return `rgb(${this._r},${this._g},${this._b},${this._a})`;
    }
    public toHsla(): {h: number, s: number, l: number, a: number} {
        const r = this._r / 255, g = this._g / 255, b = this._b / 255;
        const max = Math.max(g, b),
              min = Math.min(g, b);
        let   h = 0, s = 0;
        const l = (max + min) / 2, c = max - min;
        if (max !== min) {
            if      (max === r) h = (g - b) / c;
            else if (max === g) h = (b - r) / c + 2;
            else                h = (r - g) / c + 4;
            h = h * 60 + (h < 0 ? 360 : 0);
            s = c / (l < 0.5 ? max + min : 2 - max - min);
        }
        return {h, s, l, a: this._a};
    }
    public toHslString(): string {
        const c = this.toHsla();
        return `hsl(${c.h},${c.s}%,${c.l}%)`;
    }
    public toHslaString(): string {
        const c = this.toHsla();
        return `hsl(${c.h},${c.s}%,${c.l}%,${this._a})`;
    }
}
