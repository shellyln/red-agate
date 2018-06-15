
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



export default function(express: any): any {
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
                });
                res.set('Content-Disposition', `inline; filename="${"example.pdf"}"`);
                res.set('Content-Type', 'application/pdf');
                break;
            case 'png':
                handler = HtmlRenderer.toImageHandler(handler, {}, {});
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
