// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



/**
 * Escape sequences encoder.
 */
export class Escape {

    /**
     * Escape html special characters.
     * @param s Plaintext.
     * @return Html escaped text.
     */
    public static html(s: string): string {
        return s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    /**
     * Escape xml special characters.
     * @param s Plaintext.
     * @return Xml escaped text.
     */
    public static xml(s: string): string {
        return s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }

}


/**
 * Escape sequences decoder.
 */
export class Unescape {

    /**
     * Unescape html character references.
     * @param s Html escaped text.
     * @return Plaintext.
     */
    public static html(s: string): string {
        return s
            .replace(/&#39;/g, "'")
            .replace(/&#x(?:0{0,2})27;/ig, "'")
            .replace(/&apos;/g, "'")

            .replace(/&#34;/g, "\"")
            .replace(/&#x(?:0{0,2})22;/ig, "\"")
            .replace(/&quot;/g, "\"")

            .replace(/&#62;/g, ">")
            .replace(/&#x(?:0{0,2})3e;/ig, ">")
            .replace(/&gt;/g, ">")

            .replace(/&#60;/g, "<")
            .replace(/&#x(?:0{0,2})3c;/ig, "<")
            .replace(/&lt;/g, "<")

            .replace(/&#38;/g, "&")
            .replace(/&#x(?:0{0,2})26;/ig, "&")
            .replace(/&amp;/g, "&");
    }

    /**
     * Unescape xml character references.
     * @param s Xml escaped text.
     * @return Plaintext.
     */
    public static xml(s: string): string {
        return Escape.html(s);
    }

}
