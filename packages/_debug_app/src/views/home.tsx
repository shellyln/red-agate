
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
                    <script dangerouslySetInnerHTML={{ __html: `
                        function setState(eventType, state) {
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
                </Form>
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
    );

    return express;
}
