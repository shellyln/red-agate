
import * as path                 from 'path';
import { Base64 }                from 'red-agate-util/modules/convert/Base64';
import { TextEncoding }          from 'red-agate-util/modules/convert/TextEncoding'
import { billngReportHandler,
         BillingStatement }      from '../reports/billing';
import { default as billngData } from '../reports/billing.data';
import { kanbanReportHandler }   from '../reports/kanban';
import { default as kanbanData } from '../reports/kanban.data';
import { fbaA4ReportHandler }    from '../reports/fba-a4';
import { barcodeTestHandler }    from '../reports/barcode-test';

// tslint:disable-next-line:no-eval
const requireDynamic = eval("require");
const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));



function phantomHtml2pdf(html: string, options: any): Promise<Buffer> {
    let opts = Object.assign({
        phantomPath: path.join(process.cwd(),
            'node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs'),
        script: path.join(process.cwd(),
            'node_modules/html-pdf/lib/scripts/pdf_a4_portrait.js'),
    }, options);

    const promise = new Promise<Buffer>((resolve, reject) => {
        const pdf = requireDynamic('html-pdf');
        pdf.create(html, opts)
        .toBuffer((err: any, buffer: Buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
    return promise;
}

async function puppeteerHtml2pdf(html: string, options: any): Promise<Buffer> {
    const puppeteer = requireDynamic('puppeteer');
    let buffer: Buffer | null = null;
    let browser = null;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(
            'data:text/html;base64,' + Base64.encode(TextEncoding.encodeToUtf8(html)),
            { waitUntil: 'load' },
        );
        buffer = await page.pdf(options);
    } finally {
        try {
            if (browser) {
                await browser.close();
            }
        } catch (e) {}
    }
    return buffer as Buffer;
}


export default function(express: any): any {
    express
    .get('/:pdf/:name', (req: any, res: any) => {
        let handler   = billngReportHandler;
        let data: any = billngData;

        switch (req.params.name) {
        case 'billing':
            handler = billngReportHandler;
            data    = billngData;
            break;
        case 'kanban':
            handler = kanbanReportHandler;
            data    = kanbanData;
            break;
        case 'fba-a4':
            handler = fbaA4ReportHandler;
            data    = kanbanData;
            break;
        case 'barcode-test':
            handler = barcodeTestHandler;
            data    = kanbanData;
            break;
        }

        let sent = false;
        const sendError = () => {
            if (!sent) {
                res.status(500).send('error');
                sent = true;
            }
        };

        handler(data, {} as any, (error, html) => {
            if (error) {
                sendError();
            } else {
                try {
                    if (req.params.pdf === 'phantom' || req.params.pdf === 'pdf') {
                        let f = null;
                        let options = null;
                        if (req.params.pdf === 'phantom') {
                            f = phantomHtml2pdf;
                            options = {
                                width: '210mm',
                                height: '297mm',
                            };
                        } else {
                            f = puppeteerHtml2pdf;
                            options = {
                                width: '210mm',
                                height: '297mm',
                                printBackground: true,
                            };
                        }
                        (async () => {
                            try {
                                const buffer = await f(html, options);
                                res.set('Content-Disposition', `inline; filename="${"example.pdf"}"`);
                                res.set('Content-Type', 'application/pdf');
                                res.send(buffer);
                                sent = true;
                            } catch (e) {
                                sendError();
                            }
                        })();
                    } else {
                        res.send(html);
                        sent = true;
                    }
                } catch (err) {
                    sendError();
                }
            }
        });
    });

    return express;
}
