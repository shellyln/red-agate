
import { HtmlRenderer }          from 'red-agate/modules/red-agate/renderer';
import { billngReportHandler,
         BillingStatement }      from '../reports/billing';
import { default as billngData } from '../reports/billing.data';
import { kanbanReportHandler }   from '../reports/kanban';
import { default as kanbanData } from '../reports/kanban.data';
import { fbaA4ReportHandler }    from '../reports/fba-a4';
import { default as fbaA4Data }  from '../reports/fba-a4.data';
import { barcodeTestHandler }    from '../reports/barcode-test';
import { Lambda }                from 'red-agate/modules/red-agate/app';

// tslint:disable-next-line:no-eval
const requireDynamic = eval("require");



export default function(express: any, isDocker: boolean): any {
    const os = requireDynamic('os');
    const path = requireDynamic('path');
    const tmpFile = `${os.tmpdir()}${path.sep}ra-tmp-*.html`;

    // for Docker container environment
    if (isDocker) {
        HtmlRenderer.launchOptions = {
            executablePath: '/usr/bin/google-chrome-unstable',
            args: [
                '--no-sandbox', '--disable-web-security', '--user-data-dir=/app/user-data'
            ]
        };
    }

    express
    .get('/:format/:name', (req: any, res: any) => {
        let handler: Lambda = billngReportHandler;
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
            data    = fbaA4Data;
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

        try {
            switch (req.params.format) {
            case 'pdf':
                handler = HtmlRenderer.toPdfHandler(handler, {}, {
                    width: '210mm',
                    height: '297mm',
                    printBackground: true,
                }, tmpFile);
                res.set('Content-Disposition', `inline; filename="${"example.pdf"}"`);
                res.set('Content-Type', 'application/pdf');
                break;
            case 'png':
                handler = HtmlRenderer.toImageHandler(handler, {}, {}, tmpFile);
                res.set('Content-Disposition', `inline; filename="${"example.png"}"`);
                res.set('Content-Type', 'image/png');
                break;
            }
        } catch (err) {
            sendError();
        }

        handler(data, {} as any, (error, result) => {
            if (error) {
                sendError();
            } else {
                try {
                    res.send(result);
                    sent = true;
                } catch (err) {
                    sendError();
                }
            }
        });
    });

    return express;
}
