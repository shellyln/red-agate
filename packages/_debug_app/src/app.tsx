
import * as RedAgate             from 'red-agate/modules/red-agate';
import { App }                   from 'red-agate/modules/red-agate/app';
import { billngReportHandler,
         BillingStatement }      from './examples/billing';
import { default as billngData } from './examples/billing.data';
import { kanbanReportHandler }   from './examples/kanban';
import { default as kanbanData } from './examples/kanban.data';
import { fbaA4ReportHandler }    from './examples/fba-a4';
import { barcodeTestHandler }    from './examples/barcode-test';


// tslint:disable-next-line:no-eval
const requireDynamic = eval("require");

let handler = barcodeTestHandler;
let data: any = kanbanData;


App.cli(['?--foo', '--debug', '--handler=*'], (opts) => {
    switch (opts.get('--handler=*')) {
    case '/billing':
        handler = billngReportHandler;
        data = billngData;
        break;
    case '/kanban':
        handler = kanbanReportHandler;
        data = kanbanData;
        break;
    case '/fba-a4':
        handler = fbaA4ReportHandler;
        data = kanbanData;
        break;
    case '/barcode-test':
        handler = barcodeTestHandler;
        data = kanbanData;
        break;
    default:
        console.error('Invalid handler.');
        break;
    }
    handler(data, {} as any, (error, result) => {
        if (error) {
            console.error(error);
        } else {
            const fs = require('fs');
            if (!fs.existsSync('./debug')) {
                fs.mkdirSync('./debug');
            }
            fs.writeFileSync('./debug/index.html', result);
        }
    });
})
.route('/'            , (evt, ctx, cb) => cb(null, 'Hello, Node!'))
// .route('/billing'     , billngReportHandler)
// .route('/kanban'      , kanbanReportHandler)
// .route('/fba-a4'      , fbaA4ReportHandler)
.route('/billing'     , (evt, ctx, cb) => billngReportHandler(billngData, ctx, cb))
.route('/kanban'      , (evt, ctx, cb) => kanbanReportHandler(kanbanData, ctx, cb))
.route('/fba-a4'      , (evt, ctx, cb) =>  fbaA4ReportHandler(kanbanData, ctx, cb))
.route('/barcode-test', barcodeTestHandler)
.run({});
