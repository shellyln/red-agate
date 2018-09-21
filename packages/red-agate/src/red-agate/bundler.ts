// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



import * as RedAgate         from './red-agate';
import { ShapeProps,
         Shape,
         CONTEXT_SVG_CANVAS,
         CONTEXT_ASSET_ }    from './tags/Shape';
import { Base64 }            from 'red-agate-util/modules/convert/Base64';
import { TextEncoding }      from 'red-agate-util/modules/convert/TextEncoding';
import { FileFetcher }       from 'red-agate-util/modules/io/FileFetcher';
import { Logger }            from 'red-agate-util/modules/io/Logger';
import { Uri }               from 'red-agate-util/modules/io/Uri';
import { SvgCanvas }         from 'red-agate-svg-canvas/modules/drawing/canvas/SvgCanvas';



export interface AssetProps extends RedAgate.ComponentProps {
    src: string;
    contextName: string;
}

export class Asset extends RedAgate.RedAgatePhantomComponent<AssetProps> {
    public constructor(props: AssetProps) {
        super(props);
    }

    private content: string = '';

    public defer() {
        if (this.props.src === void 0 || this.props.src === null || this.props.src === '') {
            return Promise.resolve();
        } else {
            const src = this.props.src;
            const promise = new Promise<void>((resolve, reject) => {
                try {
                    FileFetcher.fetchLocation(this.props.src)
                    .then((result) => {
                        let contentType = result.contentType;
                        if (contentType === null) {
                            const pathExt = Uri.getPathExt(src);
                            contentType = Uri.pathExtToContentType(pathExt);
                            if (contentType === null) {
                                Logger.log("Asset#defer:unknown content-type:" + pathExt);
                                reject("unknown content-type");
                                return;
                            }
                        }
                        this.content = `data:${contentType};base64,` + Base64.encode(result.data, 120);
                        resolve();
                    })
                    .catch((e) => {
                        Logger.log("Asset#defer:catch:" + e);
                        reject(e);
                    });
                } catch (e) {
                    Logger.log("Asset#defer:catch:" + e);
                    reject(e);
                }
            });
            return promise;
        }
    }

    public beforeRender(contexts: Map<string, any>) {
        this.setContext(contexts, CONTEXT_ASSET_ + this.props.contextName, this.content);
    }

    public render(contexts: Map<string, any>, children: string) {
        return '';
    }
}



export interface ImageInstantProps extends ShapeProps {
    use?: undefined;
    srcContext?: undefined;

    noDownload?: true;

    src: string;
    unit?: string;
    width: number;
    height: number;
    asAsset?: false;

    alt?: string;
    ismap?: true;
    longdesc?: string;
    sizes?: string;
    usemap?: string;
}

export interface ImageInstantFromCtxProps extends ShapeProps {
    use?: undefined;
    srcContext: string;

    noDownload?: true;

    src?: undefined;
    unit?: string;
    width: number;
    height: number;
    asAsset?: false;

    alt?: string;
    ismap?: true;
    longdesc?: string;
    sizes?: string;
    usemap?: string;
}

export interface ImageAssetProps extends ShapeProps {
    id: string;
    use?: undefined;
    srcContext?: undefined;

    noDownload?: undefined;

    src: string;
    unit?: string;
    width?: undefined;
    height?: undefined;
    asAsset: true;

    alt?: string;
    ismap?: true;
    longdesc?: string;
    sizes?: string;
    usemap?: string;
}

export interface ImageAssetFromCtxProps extends ShapeProps {
    id: string;
    use?: undefined;
    srcContext: string;

    noDownload?: undefined;

    src?: undefined;
    unit?: string;
    width?: undefined;
    height?: undefined;
    asAsset: true;

    alt?: string;
    ismap?: true;
    longdesc?: string;
    sizes?: string;
    usemap?: string;
}

export interface ImageRefProps extends ShapeProps {
    use: string;
    srcContext?: undefined;

    noDownload?: undefined;

    src?: undefined;
    unit?: string;
    width: number;
    height: number;
    asAsset?: false;

    alt?: string;
    ismap?: true;
    longdesc?: string;
    sizes?: string;
    usemap?: string;
}

export type ImageProps = ImageInstantProps | ImageInstantFromCtxProps | ImageAssetProps | ImageAssetFromCtxProps | ImageRefProps;

export class Image extends Shape<ImageProps> {
    public constructor(props: ImageProps) {
        super(props);
    }

    public transform() {
        return (
            (this.props.children !== null && this.props.children !== void 0) ?
            this.props.children : []
        );
    }

    private content: string = '';

    public defer() {
        if (this.props.use !== void 0 && this.props.use !== null && this.props.use !== "") {
            return Promise.resolve();
        } else if (this.content !== null && this.content !== void 0 && this.content !== "") {
            return Promise.resolve();
        } else if (this.props.src === null || this.props.src === void 0 || this.props.src === "") {
            return Promise.resolve();
        } else if (this.props.noDownload) {
            this.content = this.props.src;
            return Promise.resolve();
        } else {
            const src = this.props.src;
            const promise = new Promise<void>((resolve, reject) => {
                FileFetcher.fetchLocation(src)
                .then((result) => {
                    let contentType = result.contentType;
                    if (contentType === null) {
                        const pathExt = Uri.getPathExt(src);
                        contentType = Uri.pathExtToContentType(pathExt);
                        if (contentType === null) {
                            Logger.log("Image#defer:unknown content-type:" + pathExt);
                            reject("unknown content-type");
                            return;
                        }
                    }
                    this.content = `data:${contentType};base64,` + Base64.encode(result.data, 120);
                    resolve();
                })
                .catch((e) => {
                    Logger.log("Image#defer:" + e);
                    reject(e);
                });
            });
            return promise;
        }
    }

    private renderAsHtml(contexts: Map<string, any>): string {
        let r = '';
        if (this.props.asAsset) {
            r = `<script>(Function("return this")())['#img_asset_mb3vhWjBUxDX__${
                this.props.id}']="${
                this.content.replace(/\r/g, '').replace(/\n/g, '')}";</script>`;
        } else {
            if (this.props.use !== void 0 && this.props.use !== null && this.props.use !== "") {
                const id = this.props.id || `__img_node_id_mb3vhWjBUxDX_${this.props.__nodeId}`;
                r = `<img id="${id}" style="width:${
                    this.props.width}${this.props.unit || 'px'};height:${
                    this.props.height}${this.props.unit || 'px'};"${
                    RedAgate.htmlAttributesRenderer(this.props, new Set(['id', 'src', 'unit', 'width', 'height'])).attrs
                    }></img><script>document.getElementById("${
                    id}").src=(Function("return this")())['#img_asset_mb3vhWjBUxDX__${this.props.use}'];</script>`;
            } else {
                r = `<img src="${this.content}" style="width:${
                    this.props.width}${this.props.unit || 'px'};height:${
                    this.props.height}${this.props.unit || 'px'};"${
                    RedAgate.htmlAttributesRenderer(this.props, new Set(['src', 'unit', 'width', 'height'])).attrs}></img>`;
            }
        }
        return r;
    }

    private renderAsSvg(canvas: SvgCanvas): void {
        const img = (this.props.use !== void 0 && this.props.use !== null && this.props.use !== "") ?
            "#" + this.props.use :
            canvas.registerImage({url: this.content, x: 0, y: 0, width: 1, height: 1}, this.props.id);

        if (! this.props.asAsset) {
            canvas.drawImage(img, this.props.x || 0, this.props.y || 0, this.props.width, this.props.height);
        }
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);

        if (this.props.srcContext !== void 0 && this.props.srcContext !== null && this.props.srcContext !== "") {
            this.content = this.getContext(contexts, CONTEXT_ASSET_ + this.props.srcContext);
        }

        if (canvas) {
            this.renderAsSvg(canvas);
            return '';
        } else {
            return this.renderAsHtml(contexts);
        }
    }
}



export interface ScriptProps extends RedAgate.ComponentProps {
    noDownload?: true;

    src: string;
    text?: string;
    type?: string;

    async?: true;
    defer?: true;
    crossorigin?: 'anonymous' | 'use-credentials';
}

export class Script extends RedAgate.RedAgatePhantomComponent<ScriptProps> {
    public constructor(props: ScriptProps) {
        super(props);
    }

    private content: string = '';

    public defer() {
        if (this.props.src === void 0 || this.props.src === null || this.props.src === '') {
            return Promise.resolve();
        } else if (this.props.noDownload) {
            return Promise.resolve();
        } else {
            const promise = new Promise<void>((resolve, reject) => {
                try {
                    FileFetcher.fetchLocation(this.props.src)
                    .then((result) => {
                        this.content = TextEncoding.decodeUtf8(result.data);
                        resolve();
                    })
                    .catch((e) => {
                        Logger.log("Script#defer:catch:" + e);
                        reject(e);
                    });
                } catch (e) {
                    Logger.log("Script#defer:catch:" + e);
                    reject(e);
                }
            });
            return promise;
        }
    }

    public render(contexts: Map<string, any>, children: string) {
        let r = '';
        if (this.props.noDownload) {
            r = `<script${RedAgate.htmlAttributesRenderer(this.props, new Set([])).attrs}></script>`;
        } else {
            r = `<script${RedAgate.htmlAttributesRenderer(this.props, new Set(['src'])).attrs}>${this.content}</script>`;
        }
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        if (canvas) {
            canvas.registerCustomAsset(r);
            return '';
        } else {
            return r;
        }
    }
}



export interface StyleProps extends RedAgate.ComponentProps {
    noDownload?: true;

    src: string;
    type?: string;
    media?: string;
    nonce?: string;
    title?: string;
}

export class Style extends RedAgate.RedAgatePhantomComponent<StyleProps> {
    public constructor(props: StyleProps) {
        super(props);
    }

    private content: string = '';

    public defer() {
        if (this.props.src === void 0 || this.props.src === null || this.props.src === '') {
            return Promise.resolve();
        } else if (this.props.noDownload) {
            return Promise.resolve();
        } else {
            const promise = new Promise<void>((resolve, reject) => {
                try {
                    FileFetcher.fetchLocation(this.props.src)
                    .then((result) => {
                        this.content = TextEncoding.decodeUtf8(result.data);
                        const reSplit = /(url\(.+?\))/;
                        const reReplace = /^url\((.+?)\)$/;
                        const fragments = this.content.split(reSplit);
                        const promises: Array<Promise<void>> = [];
                        const indexes: number[] = [];
                        for (let i = 0; i < fragments.length; i++) {
                            const m = reReplace.exec(fragments[i]);
                            if (m && !(m[1]).startsWith('data:')) {
                                promises.push(
                                    FileFetcher.fetchLocation(Uri.join(this.props.src, m[1]))
                                    .then((fmntResult) => {
                                        // Warning: Don't insert newlines to base64 encoded font!
                                        // Fonts will not rendered if you insert it.
                                        fragments[i] = fragments[i].replace(reReplace,
                                            `url(${`data:${fmntResult.contentType};charset=utf-8;base64,` + Base64.encode(fmntResult.data)})`);
                                    })
                                );
                                indexes.push(i);
                            }
                        }
                        Promise.all(promises)
                        .then(() => {
                            this.content = fragments.join('');
                            resolve();
                        })
                        .catch((e) => {
                            Logger.log("Style#defer:catch(1):" + e);
                            reject(e);
                        });
                    })
                    .catch((e) => {
                        Logger.log("Style#defer:catch(2):" + e);
                        reject(e);
                    });
                } catch (e) {
                    Logger.log("Style#defer:catch(3):" + e);
                    reject(e);
                }
            });
            return promise;
        }
    }

    public render(contexts: Map<string, any>, children: string) {
        let r = '';
        if (this.props.noDownload) {
            r = `<style type="text/css">@import url("${this.props.src}");</style>`;
        } else {
            r = `<style${RedAgate.htmlAttributesRenderer(this.props, new Set(['src'])).attrs}>${this.content}</style>`;
        }
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        if (canvas) {
            canvas.registerCustomAsset(r);
            return '';
        } else {
            return r;
        }
    }
}

export type FontProps = StyleProps;
export const Font = Style;



export interface SingleFontProps extends RedAgate.ComponentProps {
    noDownload?: true;

    fontFamily: string;
    localNames?: string[];
    fontStyle: "normal" | "italic" | "oblique";
    fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "normal" | "bold" | "lighter" | "bolder" ;
    src: string;
    unicodeRange: string;
    format: "woff" | "woff2" | "truetype" | "opentype" | "embedded-opentype" | "svg";
}

export class SingleFont extends RedAgate.RedAgatePhantomComponent<SingleFontProps> {
    public constructor(props: SingleFontProps) {
        super(props);
    }

    private content: string = '';

    public defer() {
        if (this.props.src === void 0 || this.props.src === null || this.props.src === '') {
            return Promise.resolve();
        } else if (this.props.noDownload) {
            return Promise.resolve();
        } else {
            const promise = new Promise<void>((resolve, reject) => {
                try {
                    FileFetcher.fetchLocation(this.props.src)
                    .then((result) => {
                        this.content = `data:${result.contentType};charset=utf-8;base64,` + Base64.encode(result.data);
                        resolve();
                    })
                    .catch((e) => {
                        Logger.log("SingleFont#defer:catch:" + e);
                        reject(e);
                    });
                } catch (e) {
                    Logger.log("SingleFont#defer:catch:" + e);
                    reject(e);
                }
            });
            return promise;
        }
    }

    public render(contexts: Map<string, any>, children: string) {
        let r = '';
        if (this.props.noDownload) {
        } else {
        }
        r = `<style type="text/css">@font-face{font-family:${
            this.props.fontFamily};font-style:${
            this.props.fontStyle};font-weight:${
            this.props.fontWeight};src:${
            this.props.localNames ? this.props.localNames.map(x => ` local(${x})`) : ''} url(${
            this.props.noDownload ? this.props.src : this.content});unicode-range:${
            this.props.unicodeRange};}</style>`;
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        if (canvas) {
            canvas.registerCustomAsset(r);
            return '';
        } else {
            return r;
        }
    }
}
