
/** @jsx RedAgate.createElement */
import * as RedAgate     from 'red-agate/modules/red-agate';
import { ForEach,
         If,
         Template }      from 'red-agate/modules/red-agate/taglib';
import { Html5 }         from 'red-agate/modules/red-agate/html';
import { Svg,
         Group,
         Rect,
         Text,
         GridLine,
         SvgImposition } from 'red-agate/modules/red-agate/svg';
import { Font,
         Image,
         Style }         from 'red-agate/modules/red-agate/bundler';
import { query }         from 'red-agate/modules/red-agate/data';
import { Code39 }        from 'red-agate-barcode/modules/barcode/Code39';
import { Code128 }       from 'red-agate-barcode/modules/barcode/Code128';
import { Ean13,
         Ean8,
         Ean5,
         Ean2,
         UpcA,
         UpcE }          from 'red-agate-barcode/modules/barcode/Ean';
import { Itf }           from 'red-agate-barcode/modules/barcode/Itf';
import { JapanPostal }   from 'red-agate-barcode/modules/barcode/JapanPostal';
import { Nw7 }           from 'red-agate-barcode/modules/barcode/Nw7';
import { Qr }            from 'red-agate-barcode/modules/barcode/Qr';
import { Lambda }        from 'red-agate/modules/red-agate/app';
import { PrinterMarks }  from 'red-agate/modules/red-agate/printing';



const designerMode = true;


export let barcodeTestHandler: Lambda = (event: any, context, callback) => RedAgate.renderOnAwsLambda(
<Html5>
    <head>
        <title>barcode</title>
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet"/>
        <Style src="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css"/>
        <Style src="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css"/>
        <style dangerouslySetInnerHTML={{ __html: require('./fba-a4.style.css') }}/>
    </head>

    <body class="A4">
        <ForEach items={query(event.details).groupEvery(40).select()}> { (items: any[]) =>
            <section class="sheet" style="position: relative; top: 0mm; left: 0mm;">
                <Svg width={210 - 1} height={297 - 2} unit='mm' templateUrl='https://shellyln.github.io/assets/app/Ghostscript_Tiger.svg'>
                    <If condition={designerMode}>
                        <Rect x={0} y={0} width={210} height={297} lineWidth={0.5} stroke/>
                        <GridLine endX={210} endY={297} bleed={0} lineWidth={0.1}/>
                    </If>

                    <PrinterMarks x={15} y={20} width={100} height={130} hFold={[10, 20, 30]} vFold={[25, 15, 5]} centerMarks={true} bleedMarks={true} />

                    <Qr x={15} y={5} cellSize={0.8}
                        data="Hello" />
                    <Code39 x={15} y={40}
                        data="HELLO"
                        narrowWidth={0.33 * 2} wideWidth={0.66 * 2} height={15} quietHeight={0}
                        font="7px 'OCRB'" textHeight={7} />
                    <Code128 x={15} y={70}
                        data="Hello"
                        elementWidth={0.33 * 2} height={15} quietHeight={0}
                        font="7px 'OCRB'" textHeight={7} />
                    <Ean13 x={15} y={100}
                        data="123456789012"
                        elementWidth={0.33 * 2} height={15} quietHeight={0}
                        font="7px 'OCRB'" textHeight={7} />
                    <Itf x={15} y={130}
                        data="12345" addCheckDigit
                        narrowWidth={0.33 * 2} wideWidth={0.66 * 2} height={15} quietHeight={0}
                        font="7px 'OCRB'" textHeight={7} />
                    <Nw7 x={15} y={160}
                        data="1234" startChar="A" stopChar="B"
                        narrowWidth={0.33 * 2} wideWidth={0.66 * 2} height={15} quietHeight={0}
                        font="7px 'OCRB'" textHeight={7} />
                    <JapanPostal x={15} y={190}
                        data="1234567"
                        elementWidth={0.33 * 2} height={0.66 * 6} quietHeight={0} />
                </Svg>
            </section> }
        </ForEach>
    </body>
</Html5>, callback);
