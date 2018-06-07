
/** @jsx RedAgate.createElement */
import * as RedAgate    from 'red-agate/modules/red-agate';
import { Html5 }        from 'red-agate/modules/red-agate/html';
import { Svg }          from 'red-agate/modules/red-agate/svg';
import { Code39 }       from 'red-agate-barcode/modules/barcode/Code39';
import { Code128 }      from 'red-agate-barcode/modules/barcode/Code128';
import { Ean13,
         Ean8,
         Ean5,
         Ean2,
         UpcA,
         UpcE }         from 'red-agate-barcode/modules/barcode/Ean';
import { Itf }          from 'red-agate-barcode/modules/barcode/Itf';
import { JapanPostal }  from 'red-agate-barcode/modules/barcode/JapanPostal';
import { Nw7 }          from 'red-agate-barcode/modules/barcode/Nw7';
import { Qr }           from 'red-agate-barcode/modules/barcode/Qr';
import { Base64 }       from 'red-agate-util/modules/convert/Base64';
import { TextEncoding } from 'red-agate-util/modules/convert/TextEncoding'
import { Form,
         Select,
         Input,
         TextArea }     from '../components/forms';

// tslint:disable-next-line:no-eval
const requireDynamic = eval("require");



export default function(express: any): any {
    express
    .get('/', (req: any, res: any) => RedAgate.renderOnExpress(
        <Html5 style="width: 100%; height: 100%; margin: 0;">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css" />
            </head>
            <body style="width: 100%; height: 100%; margin: 0;">
                <Form style="width: 100%; height: 100%;" name="theForm" setState="setState">
                    <div style="width: calc(100% - 2em); margin: 0 1em;">
                        <div style="display: flex;">
                            <div style="margin-right:1em;">
                                <Select name="bartypes" selected="c128" options={[
                                    ['c128',  'Code 128'],
                                    ['c39',   'Code 39'],
                                    ['ean13', 'EAN 13'],
                                    ['ean8',  'EAN 8'],
                                    ['ean5',  'EAN 5'],
                                    ['ean2',  'EAN 2'],
                                    ['upca',  'UPC A'],
                                    ['upce',  'UPC E'],
                                    ['itf',   'ITF'],
                                    ['nw7',   'Codabar'],
                                    ['jp',    'Japan Postal'],
                                    ['qr',    'QR'],
                                ]} />
                            </div>
                            <div style="margin-right:1em;">
                                Output format:
                                <Select name="out" selected="page-svg" options={[
                                    ['page-svg', 'SVG (A4)'],
                                    ['svg', 'SVG'],
                                    ['img-tag', 'img tag'],
                                    ['el-style', 'element style'],
                                    ['svg-url', 'SVG (data url)'],
                                    ['svg-nodefer', 'SVG (no defer)'],
                                ]} />
                            </div>
                            <div class="qrconf" style="margin-right:1em;">
                                version:
                                <input name="qrversion" type="number" value="0" />
                            </div>
                            <div class="qrconf" style="margin-right:1em;">
                                EC level:
                                <Select name="qreclevel" selected="M" options={[
                                    ['L', 'L'],
                                    ['M', 'M'],
                                    ['Q', 'Q'],
                                    ['H', 'H'],
                                ]} />
                            </div>
                            <div class="qrconf" style="margin-right:1em;">
                                encoding:
                                <Select name="qrencoding" selected="n" options={[
                                    ['n', 'Number'],
                                    ['a', 'Alnum'],
                                    ['b', '8bit binary'],
                                    ['-', 'Auto'],
                                ]} />
                            </div>
                        </div>
                        <div>
                            <TextArea name="data" style="width: 100%; height: 100px;"
                                >1234567890123</TextArea>
                        </div>
                        {/*<Input type="button" name="zzz" />*/}
                        <Input type="text" name="dummy" style="display: none;" />
                    </div>
                    <div style="width: 100%; height: calc(100% - 150px); margin: 0;">
                        <iframe id="theIframe" scrolling="no" frameborder="no"
                            style="width: 100%; height: 100%; margin: 0; border: 0; overflow: hidden;"></iframe>
                    </div>
                </Form>
                <script dangerouslySetInnerHTML={{ __html: `
                    setState.subscribe(null, function(state, newState) {
                        var isQr = state.bartypes === "qr";
                        Array.from(document.getElementsByClassName("qrconf"))
                        .forEach(function(x) { x.style.display = isQr ? "block" : "none" });
                        var url = "./" + state.bartypes + "/" + state.out + "/" +
                                    (isQr ?
                                        encodeURIComponent(state.qrversion) + "/" +
                                        state.qreclevel + "/" +
                                        state.qrencoding + "/" : "") +
                                    encodeURIComponent(state.data);
                        document.getElementById("theIframe").src = url;
                    });
                `}}></script>
            </body>
        </Html5>, req, res)
    )



    .get('/zzz/c128/:data', (req: any, res: any) => RedAgate.renderOnExpress(
        <Code128 x={1} y={1}
            elementWidth={0.33 * 1.5}
            height={7} quietHeight={0}
            font="3.5px 'OCRB'" textHeight={3.5}
            data={req.params.data} />,
        req, res, [['Content-Type', 'image/svg+xml']])
    )



    .get('/c128/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 1,
            y: 1,
            elementWidth: 0.33 * 1.5,
            height: 7,
            quietHeight: 0,
            font: "3.5px 'OCRB'",
            textHeight: 3.5,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new Code128(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <Code128 {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <Code128 {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/c39/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 1,
            y: 1,
            narrowWidth: 0.33 * 1.5,
            wideWidth: 0.66 * 1.5,
            height: 7,
            quietHeight: 0,
            font: "3.5px 'OCRB'",
            textHeight: 3.5,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new Code39(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <Code39 {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <Code39 {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/ean13/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 10,
            y: 1,
            elementWidth: 0.33 * 1.5,
            height: 7,
            quietHeight: 0,
            font: "3.5px 'OCRB'",
            textHeight: 3.5,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new Ean13(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <Ean13 {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <Ean13 {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/ean8/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 10,
            y: 1,
            elementWidth: 0.33 * 1.5,
            height: 7,
            quietHeight: 0,
            font: "3.5px 'OCRB'",
            textHeight: 3.5,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new Ean8(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <Ean8 {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <Ean8 {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/ean5/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 10,
            y: 1,
            elementWidth: 0.33 * 1.5,
            height: 7,
            quietHeight: 0,
            font: "3.5px 'OCRB'",
            textHeight: 3.5,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new Ean5(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <Ean5 {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <Ean5 {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/ean2/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 10,
            y: 1,
            elementWidth: 0.33 * 1.5,
            height: 7,
            quietHeight: 0,
            font: "3.5px 'OCRB'",
            textHeight: 3.5,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new Ean2(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <Ean2 {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <Ean2 {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/upca/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 10,
            y: 1,
            elementWidth: 0.33 * 1.5,
            height: 7,
            quietHeight: 0,
            font: "3.5px 'OCRB'",
            textHeight: 3.5,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new UpcA(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <UpcA {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <UpcA {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/upce/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 10,
            y: 1,
            elementWidth: 0.33 * 1.5,
            height: 7,
            quietHeight: 0,
            font: "3.5px 'OCRB'",
            textHeight: 3.5,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new UpcE(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <UpcE {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <UpcE {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/itf/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 1,
            y: 1,
            narrowWidth: 0.33 * 1.5,
            wideWidth: 0.66 * 1.5,
            height: 7,
            quietHeight: 0,
            font: "3.5px 'OCRB'",
            textHeight: 3.5,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new Itf(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <Itf {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <Itf {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/nw7/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 1,
            y: 1,
            narrowWidth: 0.33 * 1.5,
            wideWidth: 0.66 * 1.5,
            height: 7,
            quietHeight: 0,
            font: "3.5px 'OCRB'",
            textHeight: 3.5,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new Nw7(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <Nw7 {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <Nw7 {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/jp/:out/:data', (req: any, res: any) => {
        const cf = {
            id: 'foo1234',
            x: 1,
            y: 1,
            elementWidth: 0.33 * 1.5,
            height: 0.33 * 1.5 * 6,
            quietHeight: 0,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new JapanPostal(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <JapanPostal {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <JapanPostal {...cf} />
                </Svg>, req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })

    .get('/qr/:out/:ver/:ec/:enc/:data', (req: any, res: any) => {
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

        const cf = {
            id: 'foo1234',
            x: 1,
            y: 1,
            cellSize: 1.0,
            version: ver,
            ecLevel: ec,
            encoding: enc,
            data: req.params.data,
        };
        switch (req.params.out) {
        case 'img-tag': case 'el-style': case 'svg-url': case 'svg-nodefer':
            {
                const el = new Qr(cf);
                switch (req.params.out) {
                case 'img-tag':
                    res.send(el.toImgTag());
                    break;
                case 'el-style':
                    res.send(el.toElementStyle());
                    break;
                case 'svg-url':
                    res.send(el.toDataUrl());
                    break;
                case 'svg-nodefer':
                    res.set('Content-Type', 'image/svg+xml');
                    res.send(el.toSvg());
                    break;
                }
            }
            break;
        case 'svg':
            RedAgate.renderOnExpress(
                <Qr {...cf} />,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        case 'page-svg': default:
            RedAgate.renderOnExpress(
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <Qr {...cf} />
                </Svg>,
                req, res, [['Content-Type', 'image/svg+xml']]);
            break;
        }
    })



    return express;
}
