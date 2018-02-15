// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export class QueryString {

    private static *entries(obj: any) {
        for (const key of Object.keys(obj)) {
            yield [key, obj[key]];
        }
    }

    public static build(params: any): string {
        let qs = "";
        let i = 0;
        for (const [key, value] of this.entries(params)) {
            qs += `${i++ ? "&" : ""}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        return qs;
    }

    public static decode(search: string): any {
        const query = search.substr(1);
        const result: any = {};
        query.split("&").forEach((part) => {
            const item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }

}
