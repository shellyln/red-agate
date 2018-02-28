
import * as RedAgate             from 'red-agate/modules/red-agate';
import { App }                   from 'red-agate/modules/red-agate/app';
import { Svg }                   from 'red-agate/modules/red-agate/svg';
import { Code39 }                from 'red-agate-barcode/modules/barcode/Code39';
import { Code128 }               from 'red-agate-barcode/modules/barcode/Code128';
import { Ean13,
         Ean8,
         Ean5,
         Ean2,
         UpcA,
         UpcE }                  from 'red-agate-barcode/modules/barcode/Ean';
import { Itf }                   from 'red-agate-barcode/modules/barcode/Itf';
import { JapanPostal }           from 'red-agate-barcode/modules/barcode/JapanPostal';
import { Nw7 }                   from 'red-agate-barcode/modules/barcode/Nw7';
import { Qr }                    from 'red-agate-barcode/modules/barcode/Qr';
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
.cli(['--express'], (opts) => {
    // tslint:disable-next-line:no-implicit-dependencies
    // import * as express from 'express'; // Can't resolve dependency with webpack:
    //                                     // "81:13-25 Critical dependency:
    //                                     // the request of a dependency is an expression"
    // tslint:disable-next-line:no-var-requires no-implicit-dependencies
    const express = require('express');

    express()
    .get('/', (req: any, res: any) =>
        RedAgate.renderOnExpress(
        <h1>
            Home. your ip: {req.ip}
        </h1>,
        req, res))
    .get('/a', (req: any, res: any) =>
        RedAgate.renderOnExpress(
        <h1>
            A. your ip: {req.ip}
        </h1>,
        req, res))
    .get('/qr/:ver/:ec/:enc/:data', (req: any, res: any) => {
        let ver: number | "auto" = "auto";
        if (Number.isFinite(Number.parseInt(req.params.ver))) {
            const v = Number.parseInt(req.params.ver);
            if (0 < v && v < 41) {
                ver = v;
            }
        }
        let ec: "L" | "M" | "Q" | "H" = 'M';
        switch (req.params.ec) {
        case 'L': case 'l':
            ec = 'L';
        case 'M': case 'm':
            ec = 'M';
        case 'Q': case 'q':
            ec = 'Q';
        case 'H': case 'h':
            ec = 'H';
        }
        let enc: "number" | "alnum" | "8bit" | "auto" = 'auto';
        switch (req.params.enc) {
        case 'N': case 'n':
            enc = 'number';
            break;
        case 'A': case 'a':
            enc = 'alnum';
            break;
        case 'B': case 'b':
            enc = '8bit';
            break;
        case '-':
            enc = 'auto';
            break;
        }
        return RedAgate.renderOnExpress(
            <Svg width={210 - 1} height={297 - 2} unit='mm'>
                <Qr x={1} y={1} cellSize={1.0}
                    version={ver} ecLevel={ec} encoding={enc}
                    data={req.params.data} />
            </Svg>,
            req, res);
        })
    .listen(process.env.PORT || 3000, () => {
        console.log('start');
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
