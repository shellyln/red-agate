
import * as RedAgate             from 'red-agate/modules/red-agate';
import { App }                   from 'red-agate/modules/red-agate/app';
import { HtmlRenderer }          from 'red-agate/modules/red-agate/renderer';
import { default as express }    from './express';
import { billngReportHandler,
         BillingStatement }      from './reports/billing';
import { default as billngData } from './reports/billing.data';
import { kanbanReportHandler }   from './reports/kanban';
import { default as kanbanData } from './reports/kanban.data';
import { fbaA4ReportHandler }    from './reports/fba-a4';
import { default as fbaA4Data }  from './reports/fba-a4.data';
import { barcodeTestHandler }    from './reports/barcode-test';

// tslint:disable-next-line:no-eval
const requireDynamic = eval("require");



let handler   = barcodeTestHandler;
let data: any = kanbanData;


App.cli(['?--foo', '--debug', '--handler=*'], (opts) => {
    switch (opts.get('--handler=*')) {
    case '/pdf':
        handler = HtmlRenderer.toPdfHandler(billngReportHandler, {}, {});
        data    = billngData;
        break;
    case '/billing':
        handler = billngReportHandler;
        data    = billngData;
        break;
    case '/kanban':
        handler = kanbanReportHandler;
        data    = kanbanData;
        break;
    case '/fba-a4':
        handler = fbaA4ReportHandler;
        data    = fbaA4Data;
        break;
    case '/barcode-test':
        handler = barcodeTestHandler;
        data    = kanbanData;
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
.cli(['--express'], (opts) => {
    express(false);
})
.cli(['--express-docker'], (opts) => {
    express(true);
})
.route('/'            , (evt, ctx, cb) => cb(null, 'Hello, Node!'))
// .route('/billing'     , billngReportHandler)
// .route('/kanban'      , kanbanReportHandler)
// .route('/fba-a4'      , fbaA4ReportHandler)
.route('/pdf'         , (evt, ctx, cb) => HtmlRenderer.toPdfHandler(billngReportHandler, {}, {})(billngData, ctx, cb))
.route('/billing'     , (evt, ctx, cb) => billngReportHandler(billngData, ctx, cb))
.route('/kanban'      , (evt, ctx, cb) => kanbanReportHandler(kanbanData, ctx, cb))
.route('/fba-a4'      , (evt, ctx, cb) =>  fbaA4ReportHandler(fbaA4Data, ctx, cb))
.route('/barcode-test', barcodeTestHandler)
.run({});
