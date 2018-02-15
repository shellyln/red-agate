// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { Logger } from "./Logger";
declare var Java: any;


export interface FileFetcherConfig {
    method?: string;
    headers?: Array<{header: string, value: string}>;
    data?: ArrayBufferView | Blob | string;
    user?: string;
    password?: string;
}


/**
 * Fetching file via HTTP/HTTPS or local file.
 *
 * @static
 */
export class FileFetcher {
    private static isNashorn: boolean;
    private static isNode: boolean;

    /** static constructor */
    // tslint:disable-next-line:variable-name
    private static __ctor = (() => {
        FileFetcher.isNashorn = false;
        FileFetcher.isNode = false;
        if (typeof Java !== "undefined" && Java && typeof Java.type === "function") {
            FileFetcher.isNashorn = true;
        } else if (typeof process === "object") {
            if (typeof process.versions === "object") {
                if (typeof process.versions.node !== "undefined") {
                    if (typeof (process as any).type !== "undefined" && (process as any).type === "renderer") {
                        // electron renderer process
                    } else {
                        FileFetcher.isNode = true;
                    }
                }
            }
        }
    })();

    private static fetchLocation_node(uri: string, config?: FileFetcherConfig): Promise<{contentType: string | null, data: ArrayLike<number>}> {
        const promise: Promise<{contentType: string | null, data: ArrayLike<number>}> =
            new Promise<{contentType: string | null, data: ArrayLike<number>}>((resolve, reject) => {

            try {
                const uriLower = uri.toLowerCase();
                if (uriLower.startsWith("http:") || uriLower.startsWith("https:")) {
                    // HTTP or HTTPS
                    const http = require(uriLower.startsWith("http:") ? "http" : "https");
                    const url = require("url");

                    // TODO: set method and options
                    http.get(uri, (res: any) => {
                        res.setEncoding("binary");
                        if (res.statusCode === 200) {
                            const contentType = res.headers["content-type"];
                            const data: any[] = [];
                            res.on("data", (chunk: any) => {
                                // TODO: Buffer encoding "binary" is deprecated.
                                data.push(new Buffer(chunk, "binary"));
                            });
                            res.on("end", () => {
                                resolve({contentType, data: Buffer.concat(data)});
                            });
                            res.on("error", (e: any) => {
                                Logger.log("FileFetcher#fetchLocation_node:http.get:on-error:" + e);
                                reject(e);
                            });
                        } else {
                            Logger.log("FileFetcher#fetchLocation_node:http.get:bad-status-code:" + res.statusCode);
                            reject(res);
                        }
                    });
                } else if (uri.match(/^[A-Za-z][-+.A-Za-z0-9]*:/) &&
                    ! uriLower.toLowerCase().startsWith("file:") &&
                    ! (process.platform === "win32" && uri.match(/^[A-Za-z]:/))) {
                    // unknown URI scheme
                    reject(uri);
                } else {
                    // File
                    const fs = require("fs");
                    let path = uri;
                    if (process.platform === "win32") {
                        path = path.replace(/^file:\/+([A-Za-z])\//i, "$1:/");
                        path = path.replace(/^\/+([A-Za-z])\//, "$1:/");
                    }
                    path = path.replace(/^file\:\/+/i, "/");
                    const data: any[] = [];
                    fs.createReadStream(path)
                    .on("data", (chunk: any) => {
                        data.push(chunk);
                    })
                    .on("end", () => {
                        resolve({contentType: null, data: Buffer.concat(data)});
                    })
                    .on("error", (e: any) => {
                        Logger.log("FileFetcher#fetchLocation_node:fs.createReadStream:on-error:" + e);
                        reject(e);
                    });
                }
            } catch (e) {
                Logger.log("FileFetcher#fetchLocation_node:" + e);
                reject(e);
            }
        });
        return promise;
    }

    private static fetchLocation_xhr(uri: string, config?: FileFetcherConfig): Promise<{contentType: string | null, data: ArrayLike<number>}> {
        const promise: Promise<{contentType: string | null, data: ArrayLike<number>}> =
            new Promise<{contentType: string | null, data: ArrayLike<number>}>((resolve, reject) => {

            try {
                const xhr = new XMLHttpRequest();
                xhr.onload = (e) => {
                    if (xhr.status === 200 || xhr.status === 304) {
                        const contentType = xhr.getResponseHeader("content-type");
                        const arrayBuffer = xhr.response;
                        if (arrayBuffer) {
                            resolve({contentType, data: new Uint8Array(arrayBuffer)});
                        } else {
                            Logger.log("FileFetcher#fetchLocation_xhr:xhr.onload:empty-response:" + e);
                            reject(e);
                        }
                    } else {
                        Logger.log("FileFetcher#fetchLocation_xhr:xhr.onload:bad-status-code:" + xhr.status + ":" + e);
                        reject(e);
                    }
                };
                xhr.onerror = (e) => {
                    Logger.log("FileFetcher#fetchLocation_xhr:xhr.onerror:" + e);
                    reject(e);
                };
                xhr.open(
                    config !== void 0 && config !== null &&
                        config.method !== void 0 && config.method !== null
                        ? config.method : "GET",
                    uri, true,
                    config !== void 0 && config !== null ? config.user : void 0,
                    config !== void 0 && config !== null ? config.password : void 0
                    );
                if (config !== void 0 && config !== null &&
                    config.headers !== void 0 && config.headers !== null) {
                    for (const h of config.headers) {
                        xhr.setRequestHeader(h.header, h.value);
                    }
                }
                xhr.responseType = "arraybuffer";
                xhr.send(
                    config !== void 0 && config !== null &&
                        config.data !== void 0 && config.data !== null
                        ? config.data : null
                    );
            } catch (e) {
                Logger.log("FileFetcher#fetchLocation_xhr:" + e);
                reject(e);
            }
        });
        return promise;
    }

    /**
     * Fetch file from URI location.
     *
     * @param  uri   file location's relative/absolute uri.
     * @return       Promise of fetching file.
     */
    public static fetchLocation(uri: string, config?: FileFetcherConfig): Promise<{contentType: string | null, data: ArrayLike<number>}> {
        if (FileFetcher.isNashorn) {
            // TODO: not impl.
            throw new Error("FileFetcher#fetchLocation: Nashorn handler is not impl.");
        } else if (FileFetcher.isNode) {
            return this.fetchLocation_node(uri, config);
        } else {
            return this.fetchLocation_xhr(uri, config);
        }
    }
}
