
import * as RedAgate   from 'red-agate/modules/red-agate';
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
                        var url = "./" + document.forms.theForm.bartypes.value + "/" +
                                    encodeURIComponent(document.forms.theForm.data.value);
                        document.getElementById("theIframe").src = url;
                    }
                `}}></script>
            </head>
            <body style="width: 100%; height: 100%; margin: 0;">
                <div style="width: 100%; margin: 0;">
                    <form name="theForm">
                        <div>
                            <select name="bartypes" onchange="selectBartypes()">
                                <option value="c128" selected>Code 128</option>
                                <option value="c39">Code 39</option>
                                <option value="ean13">EAN 13</option>
                                <option value="ean8">EAN 8</option>
                                <option value="ean5">EAN 5</option>
                                <option value="ean2">EAN 2</option>
                                <option value="upca">UPC A</option>
                                <option value="upce">UPC E</option>
                                <option value="itf">ITF</option>
                                <option value="nw7">Codabar</option>
                                <option value="jp">Japan Postal</option>
                                <option value="qr/-/L/n">QR (L/n)</option>
                                <option value="qr/-/L/a">QR (L/a)</option>
                                <option value="qr/-/L/b">QR (L/b)</option>
                                <option value="qr/-/L/-">QR (L/-)</option>
                                <option value="qr/-/M/n">QR (M/n)</option>
                                <option value="qr/-/M/a">QR (M/a)</option>
                                <option value="qr/-/M/b">QR (M/b)</option>
                                <option value="qr/-/M/-">QR (M/-)</option>
                                <option value="qr/-/Q/n">QR (Q/n)</option>
                                <option value="qr/-/Q/a">QR (Q/a)</option>
                                <option value="qr/-/Q/b">QR (Q/b)</option>
                                <option value="qr/-/Q/-">QR (Q/-)</option>
                                <option value="qr/-/H/n">QR (H/n)</option>
                                <option value="qr/-/H/a">QR (H/a)</option>
                                <option value="qr/-/H/b">QR (H/b)</option>
                                <option value="qr/-/H/-">QR (H/-)</option>
                            </select>
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
