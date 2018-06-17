
import { Base64 }          from 'red-agate-util/modules/convert/Base64';
import { TextEncoding }    from 'red-agate-util/modules/convert/TextEncoding';
import { Lambda, Lambdas } from './app';


// tslint:disable-next-line:no-eval
const requireDynamic = eval("require");



export class HtmlRenderer {
    private static async _toPdf(html: string, navigateOptions: any, pdfOptions: any): Promise<Buffer> {
        const puppeteer = requireDynamic('puppeteer');
        let buffer: Buffer | null = null;
        let browser = null;
        try {
            browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(
                'data:text/html;base64,' + Base64.encode(TextEncoding.encodeToUtf8(html)),
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
        }
        return buffer as Buffer;
    }

    public static async toPdf(html: string | Promise<string>, navigateOptions: any, pdfOptions: any): Promise<Buffer> {
        if (typeof html === 'string') {
            return HtmlRenderer._toPdf(html, navigateOptions, pdfOptions);
        } else {
            return HtmlRenderer._toPdf(await html, navigateOptions, pdfOptions);
        }
    }

    public static toPdfHandler(handler: Lambda, navigateOptions: any, pdfOptions: any): Lambda {
        return Lambdas.pipe(handler, (html, ctx, cb) => {
            HtmlRenderer.toPdf(html, navigateOptions, pdfOptions)
            .then(buf => cb(null, buf))
            .catch(err => cb(err, null));
        });
    }

    private static async _toImage(html: string, navigateOptions: any, imageOptions: any): Promise<Buffer> {
        const puppeteer = requireDynamic('puppeteer');
        let buffer: Buffer | null = null;
        let browser = null;
        try {
            browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(
                'data:text/html;base64,' + Base64.encode(TextEncoding.encodeToUtf8(html)),
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
        }
        return buffer as Buffer;
    }

    public static async toImage(html: string | Promise<string>, navigateOptions: any, imageOptions: any): Promise<Buffer> {
        if (typeof html === 'string') {
            return HtmlRenderer._toImage(html, navigateOptions, imageOptions);
        } else {
            return HtmlRenderer._toImage(await html, navigateOptions, imageOptions);
        }
    }

    public static toImageHandler(handler: Lambda, navigateOptions: any, imageOptions: any): Lambda {
        return Lambdas.pipe(handler, (html, ctx, cb) => {
            HtmlRenderer.toImage(html, navigateOptions, imageOptions)
            .then(buf => cb(null, buf))
            .catch(err => cb(err, null));
        });
    }
}

