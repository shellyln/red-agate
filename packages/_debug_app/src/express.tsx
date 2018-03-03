
import * as RedAgate   from 'red-agate/modules/red-agate';
import { ForEach }     from 'red-agate/modules/red-agate/taglib';
import { Html5 }       from 'red-agate/modules/red-agate/html';
import { Svg }         from 'red-agate/modules/red-agate/svg';
import { Code39 }      from 'red-agate-barcode/modules/barcode/Code39';
import { Code128 }     from 'red-agate-barcode/modules/barcode/Code128';
import { Ean13,
         Ean8,
         Ean5,
         Ean2,
         UpcA,
         UpcE }        from 'red-agate-barcode/modules/barcode/Ean';
import { Itf }         from 'red-agate-barcode/modules/barcode/Itf';
import { JapanPostal } from 'red-agate-barcode/modules/barcode/JapanPostal';
import { Nw7 }         from 'red-agate-barcode/modules/barcode/Nw7';
import { Qr }          from 'red-agate-barcode/modules/barcode/Qr';

import { billngReportHandler,
         BillingStatement }      from './examples/billing';
import { default as billngData } from './examples/billing.data';
import { kanbanReportHandler }   from './examples/kanban';
import { default as kanbanData } from './examples/kanban.data';
import { fbaA4ReportHandler }    from './examples/fba-a4';
import { barcodeTestHandler }    from './examples/barcode-test';

import * as path from 'path';


// tslint:disable-next-line:no-eval
const requireDynamic = eval("require");



const barTypes = [
    {v: 'c128',  n: 'Code 128'},
    {v: 'c39',   n: 'Code 39'},
    {v: 'ean13', n: 'EAN 13'},
    {v: 'ean8',  n: 'EAN 8'},
    {v: 'ean5',  n: 'EAN 5'},
    {v: 'ean2',  n: 'EAN 2'},
    {v: 'upca',  n: 'UPC A'},
    {v: 'upce',  n: 'UPC E'},
    {v: 'itf',   n: 'ITF'},
    {v: 'nw7',   n: 'Codabar'},
    {v: 'jp',    n: 'Japan Postal'},
    {v: 'qr',    n: 'QR'},
];

export default function() {
    const express = requireDynamic('express');

    express().get('/', (req: any, res: any) => RedAgate.renderOnExpress(
        <Html5 style="width: 100%; height: 100%; margin: 0;">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css" />
            </head>
            <body style="width: 100%; height: 100%; margin: 0;">
                <div style="width: calc(100% - 2em); margin: 0 1em;">
                    <form style="width: 100%;" name="theForm">
                        <div style="display: flex;">
                            <div style="margin-right:1em;">
                                <select name="bartypes" onchange="selectBartypes()">
                                    <ForEach items={barTypes}> { (o, i) =>
                                        <option value={o.v} selected={i === 0}>{o.n}</option> }
                                    </ForEach>
                                </select>
                            </div>
                            <div class="qrconf" style="margin-right:1em;">
                                version:
                                <input name="qrversion" type="number" value="0"
                                    onchange="selectBartypes()" />
                            </div>
                            <div class="qrconf" style="margin-right:1em;">
                                EC level:
                                <select name="qreclevel" onchange="selectBartypes()">
                                    <option value="L">L</option>
                                    <option value="M" selected>M</option>
                                    <option value="Q">Q</option>
                                    <option value="H">H</option>
                                </select>
                            </div>
                            <div class="qrconf" style="margin-right:1em;">
                                encoding:
                                <select name="qrencoding" onchange="selectBartypes()">
                                    <option value="n" selected>Number</option>
                                    <option value="a">Alnum</option>
                                    <option value="b">8bit binary</option>
                                    <option value="-">Auto</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <textarea name="data" style="width: 100%; height: 100px;"
                                onchange="selectBartypes()"
                                >1234567890123</textarea>
                        </div>
                        <input type="text" name="dummy" style="display: none;" />
                    </form>
                </div>
                <div style="width: 100%; height: calc(100% - 150px); margin: 0;">
                    <iframe id="theIframe" scrolling="no" frameborder="no"
                        style="width: 100%; height: 100%; margin: 0; border: 0; overflow: hidden;"></iframe>
                </div>
                <script dangerouslySetInnerHTML={{ __html: `
                    function selectBartypes() {
                        var isQr = document.forms.theForm.bartypes.value === "qr";
                        Array.from(document.getElementsByClassName("qrconf"))
                        .forEach(function(x) { x.style.display = isQr ? "block" : "none" });
                        var url = "./" + document.forms.theForm.bartypes.value + "/" +
                                    (isQr ?
                                        encodeURIComponent(document.forms.theForm.qrversion.value) + "/" +
                                        document.forms.theForm.qreclevel.value + "/" +
                                        document.forms.theForm.qrencoding.value + "/" : "") +
                                    encodeURIComponent(document.forms.theForm.data.value);
                        document.getElementById("theIframe").src = url;
                    }
                    selectBartypes();
                `}}></script>
            </body>
        </Html5>, req, res)
    )


    .get('/c128/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Code128 x={1} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


    .get('/c39/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Code39 x={1} y={1}
                narrowWidth={0.33 * 1.5} wideWidth={0.66 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


    .get('/ean13/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Ean13 x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


    .get('/ean8/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Ean8 x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


    .get('/ean5/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Ean5 x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


    .get('/ean2/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Ean2 x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


    .get('/upca/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <UpcA x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


    .get('/upce/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <UpcE x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


    .get('/itf/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Itf x={1} y={1}
                narrowWidth={0.33 * 1.5} wideWidth={0.66 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


    .get('/nw7/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Nw7 x={1} y={1}
                narrowWidth={0.33 * 1.5} wideWidth={0.66 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


    .get('/jp/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <JapanPostal x={1} y={1}
                elementWidth={0.33 * 1.5}
                height={0.33 * 1.5 * 6} quietHeight={0}
                data={req.params.data} />
        </Svg>, req, res, [['Content-Type', 'image/svg+xml']])
    )


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
            break;
        case 'M': case 'm':
            ec = 'M';
            break;
        case 'Q': case 'q':
            ec = 'Q';
            break;
        case 'H': case 'h':
            ec = 'H';
            break;
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
            req, res, [['Content-Type', 'image/svg+xml']]);
        }
    )


    .get('/phantom/:pdf/:name', (req: any, res: any) => {
        let handler = billngReportHandler;
        let data: any = billngData;
        switch (req.params.name) {
        case 'billing':
            handler = billngReportHandler;
            data = billngData;
            break;
        case 'kanban':
            handler = kanbanReportHandler;
            data = kanbanData;
            break;
        case 'fba-a4':
            handler = fbaA4ReportHandler;
            data = kanbanData;
            break;
        case 'barcode-test':
            handler = barcodeTestHandler;
            data = kanbanData;
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
    })


    .listen(process.env.PORT || 3000, () => {
        console.log('start');
    });

    return express;
}
