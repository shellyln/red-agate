
import { Base64 }          from 'red-agate-util/modules/convert/Base64';
import { TextEncoding }    from 'red-agate-util/modules/convert/TextEncoding';
import { Lambda, Lambdas } from './app';


let isNode = false;
if (typeof process === "object") {
    if (typeof process.versions === "object") {
        if (typeof process.versions.node !== "undefined") {
            if (typeof (process as any).type !== "undefined" && (process as any).type === "renderer") {
                // electron renderer process
            } else {
                isNode = true;
            }
        }
    }
}
// tslint:disable-next-line:no-eval
const requireDynamic = isNode ? eval("require") : void 0;



export class HtmlRenderer {
    // tslint:disable-next-line:variable-name
    private static _launchOptions: any = void 0;

    public static get launchOptions(): any {
        return HtmlRenderer._launchOptions;
    }

    public static set launchOptions(opts: any) {
        HtmlRenderer._launchOptions = opts;
    }

    private static async writeToTempFile(html: string, tmpPath: string) {
        const path = requireDynamic('path');
        const fs   = requireDynamic('fs');
        const util = requireDynamic('util');

        for (let i = 0; i < 3; i++) {
            let tmp = tmpPath;
            if (tmp.includes('*')) {
                const crypto = requireDynamic('crypto');
                tmp = tmp.replace(/\*/g, Base64.encode(crypto.randomBytes(6)).replace(/\+/g, 'A').replace(/\//g, 'B'));
            }
            let url = '';
            const tmpFullPath = path.resolve(tmp);

            const fd = await util.promisify(fs.open)(tmpFullPath, 'ax');

            try {
                await util.promisify(fs.writeFile)(fd, html, 'utf8');
                let p = encodeURI(tmpFullPath.replace(/\\/g, '/'));
                if (! p.startsWith('/')) {
                    // Windows absolute paths except UNC paths.
                    p = '/' + p;
                }
                url = 'file://' + p;
            } finally {
                await util.promisify(fs.close)(fd);
            }

            return { tmpFullPath, url };
        }
        throw new Error("HtmlRenderer#writeToTempFile: Can't create a temp file.");
    }

    private static async _toPdf(html: string, navigateOptions: any, pdfOptions: any, tmpPath?: string): Promise<Buffer> {
        const puppeteer = requireDynamic('puppeteer');

        let buffer: Buffer | null = null;
        let browser = null;
        let tmpFullPath = '';
        let url = '';

        try {
            if (tmpPath) {
                ({ tmpFullPath, url } = await HtmlRenderer.writeToTempFile(html, tmpPath));
            } else {
                url = 'data:text/html;base64,' + Base64.encode(TextEncoding.encodeToUtf8(html));
            }

            browser = await puppeteer.launch(HtmlRenderer._launchOptions);
            const page = await browser.newPage();
            await page.goto(
                url,
                Object.assign({ waitUntil: 'load' }, navigateOptions || {}),
            );
            buffer = await page.pdf(
                Object.assign({
                    width: '210mm',
                    height: '297mm',
                    printBackground: true,
                }, pdfOptions || {})
            );
        } finally {
            try {
                if (browser) {
                    await browser.close();
                }
            } catch (e) {}
            try {
                if (tmpPath && tmpFullPath) {
                    const fs   = requireDynamic('fs');
                    const util = requireDynamic('util');
                    await util.promisify(fs.unlink)(tmpFullPath);
                }
            } catch (e) {}
        }
        return buffer as Buffer;
    }

    public static async toPdf(html: string | Promise<string>, navigateOptions: any, pdfOptions: any, tmpPath?: string): Promise<Buffer> {
        if (typeof html === 'string') {
            return HtmlRenderer._toPdf(html, navigateOptions, pdfOptions, tmpPath);
        } else {
            return HtmlRenderer._toPdf(await html, navigateOptions, pdfOptions, tmpPath);
        }
    }

    public static toPdfHandler(handler: Lambda, navigateOptions: any, pdfOptions: any, tmpPath?: string): Lambda {
        return Lambdas.pipe(handler, (html, ctx, cb) => {
            HtmlRenderer.toPdf(html, navigateOptions, pdfOptions, tmpPath)
            .then(buf => cb(null, buf))
            .catch(err => cb(err, null));
        });
    }

    private static async _toImage(html: string, navigateOptions: any, imageOptions: any, tmpPath?: string): Promise<Buffer> {
        const puppeteer = requireDynamic('puppeteer');

        let buffer: Buffer | null = null;
        let browser = null;
        let tmpFullPath = '';
        let url = '';

        try {
            if (tmpPath) {
                ({ tmpFullPath, url } = await HtmlRenderer.writeToTempFile(html, tmpPath));
            } else {
                url = 'data:text/html;base64,' + Base64.encode(TextEncoding.encodeToUtf8(html));
            }

            browser = await puppeteer.launch(HtmlRenderer._launchOptions);
            const page = await browser.newPage();
            await page.goto(
                url,
                Object.assign({ waitUntil: 'load' }, navigateOptions || {}),
            );
            await page.emulateMedia('print');
            buffer = await page.screenshot(
                Object.assign({
                    type: 'png',
                    fullPage: true,
                    omitBackground: false,
                }, imageOptions || {})
            );
        } finally {
            try {
                if (browser) {
                    await browser.close();
                }
            } catch (e) {}
            try {
                if (tmpPath && tmpFullPath) {
                    const fs   = requireDynamic('fs');
                    const util = requireDynamic('util');
                    await util.promisify(fs.unlink)(tmpFullPath);
                }
            } catch (e) {}
        }
        return buffer as Buffer;
    }

    public static async toImage(html: string | Promise<string>, navigateOptions: any, imageOptions: any, tmpPath?: string): Promise<Buffer> {
        if (typeof html === 'string') {
            return HtmlRenderer._toImage(html, navigateOptions, imageOptions, tmpPath);
        } else {
            return HtmlRenderer._toImage(await html, navigateOptions, imageOptions, tmpPath);
        }
    }

    public static toImageHandler(handler: Lambda, navigateOptions: any, imageOptions: any, tmpPath?: string): Lambda {
        return Lambdas.pipe(handler, (html, ctx, cb) => {
            HtmlRenderer.toImage(html, navigateOptions, imageOptions, tmpPath)
            .then(buf => cb(null, buf))
            .catch(err => cb(err, null));
        });
    }
}

