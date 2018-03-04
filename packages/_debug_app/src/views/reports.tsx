
import * as path                 from 'path';
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
                    if (req.params.pdf === 'pdf') {
                        const pdf = requireDynamic('html-pdf');
                        pdf.create(html, {
                            width: '210mm',
                            height: '297mm',
                            phantomPath: path.join(process.cwd(),
                                'node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs'),
                            script: path.join(process.cwd(),
                                'node_modules/html-pdf/lib/scripts/pdf_a4_portrait.js'),
                        })
                        .toBuffer((err: any, buffer: Buffer) => {
                            if (err) {
                                sendError();
                            } else {
                                res.set('Content-Disposition', `inline; filename="${"example.pdf"}"`);
                                res.set('Content-Type', 'application/pdf');
                                res.send(buffer);
                                sent = true;
                            }
                        });
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
