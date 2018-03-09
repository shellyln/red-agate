
import { Base64 }       from 'red-agate-util/modules/convert/Base64';
import { TextEncoding } from 'red-agate-util/modules/convert/TextEncoding';


// tslint:disable-next-line:no-eval
const requireDynamic = eval("require");



export class HtmlRenderer {
    public static async toPdf(html: string, navigateOptions: any, pdfOptions: any): Promise<Buffer> {
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

    public static async toImage(html: string, navigateOptions: any, imageOptions: any): Promise<Buffer> {
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
}

