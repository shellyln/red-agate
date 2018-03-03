
import * as RedAgate   from 'red-agate/modules/red-agate';
import { ForEach }     from 'red-agate/modules/red-agate/taglib';
import { Html5 }       from 'red-agate/modules/red-agate/html';
import { Svg, Canvas }         from 'red-agate/modules/red-agate/svg';
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
    // tslint:disable-next-line:no-implicit-dependencies
    // import * as express from 'express'; // Can't resolve dependency with webpack:
    //                                     // "81:13-25 Critical dependency:
    //                                     // the request of a dependency is an expression"
    // tslint:disable-next-line:no-var-requires no-implicit-dependencies
    const express = require('express');

    express().get('/', (req: any, res: any) => RedAgate.renderOnExpress(
        <Html5 style="width: 100%; height: 100%; margin: 0;">
            <head>
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
                `}}></script>
            </head>
            <body style="width: 100%; height: 100%; margin: 0;">
                <div style="width: 100%; margin: 0;">
                    <form name="theForm">
                        <div style="display: flex;">
                            <div>
                                <select name="bartypes" onchange="selectBartypes()">
                                    <ForEach items={barTypes}> { (o, i) =>
                                        <option value={o.v} selected={i === 0}>{o.n}</option> }
                                    </ForEach>
                                </select>
                            </div>
                            <div class="qrconf">
                                version:
                                <input name="qrversion" type="number" value="0"
                                    onchange="selectBartypes()"></input>
                            </div>
                            <div class="qrconf">
                                EC level:
                                <select name="qreclevel" onchange="selectBartypes()">
                                    <option value="L">L</option>
                                    <option value="M" selected>M</option>
                                    <option value="Q">Q</option>
                                    <option value="H">H</option>
                                </select>
                            </div>
                            <div class="qrconf">
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
                            <textarea name="data" style="width: calc(100% - 50px); height: 100px;"
                                onchange="selectBartypes()">1234567890123</textarea>
                        </div>
                    </form>
                </div>
                <div style="width: 100%; height: calc(100% - 150px); margin: 0;">
                    <iframe id="theIframe" scrolling="no" frameborder="no"
                        style="width: 100%; height: 100%; margin: 0; border: 0; overflow: hidden;"></iframe>
                </div>
                <script>{`selectBartypes();`}</script>
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
        </Svg>, req, res)
    )


    .get('/c39/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Code39 x={1} y={1}
                narrowWidth={0.33 * 1.5} wideWidth={0.66 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res)
    )


    .get('/ean13/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Ean13 x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res)
    )


    .get('/ean8/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Ean8 x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res)
    )


    .get('/ean5/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Ean5 x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res)
    )


    .get('/ean2/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Ean2 x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res)
    )


    .get('/upca/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <UpcA x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res)
    )


    .get('/upce/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <UpcE x={10} y={1}
                elementWidth={0.33 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res)
    )


    .get('/itf/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Itf x={1} y={1}
                narrowWidth={0.33 * 1.5} wideWidth={0.66 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res)
    )


    .get('/nw7/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <Nw7 x={1} y={1}
                narrowWidth={0.33 * 1.5} wideWidth={0.66 * 1.5}
                height={7} quietHeight={0}
                font="3.5px 'OCRB'" textHeight={3.5}
                data={req.params.data} />
        </Svg>, req, res)
    )


    .get('/jp/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Svg width={210 - 1} height={297 - 2} unit='mm'>
            <JapanPostal x={1} y={1}
                elementWidth={0.33 * 1.5}
                height={0.33 * 1.5 * 6} quietHeight={0}
                data={req.params.data} />
        </Svg>, req, res)
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
            req, res);
        }
    )


    .listen(process.env.PORT || 3000, () => {
        console.log('start');
    });

    return express;
}
