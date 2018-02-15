// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { Logger } from "./Logger";


export class Html5FileFetcher {

    /**
     * read data from File interface(HTML5 File API).
     */
    public static fetch(file: Blob): Promise<{contentType: string , data: ArrayLike<number>}> {
        const promise: Promise<{contentType: string , data: ArrayLike<number>}> =
            new Promise<{contentType: string , data: ArrayLike<number>}>((resolve, reject) => {

            try {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    resolve({contentType: file.type, data: new Uint8Array((ev.target as any).result as ArrayBuffer)});
                };
                reader.onerror = (ev) => {
                    Logger.log("Html5FileFetcher#fetch:onerror:" + ev);
                    reject(ev);
                };
                reader.onabort = (ev) => {
                    Logger.log("Html5FileFetcher#fetch:onabort:" + ev);
                    reject(ev);
                };

                reader.readAsArrayBuffer(file);
            } catch (e) {
                Logger.log("Html5FileFetcher#fetch:" + e);
                reject(e);
            }
        });
        return promise;
    }

}
