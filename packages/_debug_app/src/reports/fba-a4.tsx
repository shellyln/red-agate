
import * as RedAgate       from 'red-agate/modules/red-agate';
import { ForEach,
         If,
         Template }        from 'red-agate/modules/red-agate/taglib';
import { Html5 }           from 'red-agate/modules/red-agate/html';
import { Svg,
         Group,
         Rect,
         Text,
         GridLine,
         SvgImposition }   from 'red-agate/modules/red-agate/svg';
import { Font,
         Image,
         Style }           from 'red-agate/modules/red-agate/bundler';
import { query }           from 'red-agate/modules/red-agate/data';
import { AwsLambda }       from 'red-agate/modules/red-agate/app';



const designerMode = true;



interface FbaDetail {
    id: string;
    name: string;
    condition: string;
}
interface FbaPrintJob {
    details: FbaDetail[];
}



const font = "'Noto Sans', sans-serif";

const Fba = (props: {leaf: FbaDetail}) =>
    <Template>
        <Group x={0} y={0}>
            <Text x={27} y={11.5}
                textAlign="center"
                font={`11.5px 'Libre Barcode 128 Text', cursive`} fill
                text={`X00009377F`} />
            <Text x={4} y={18 + 3.5}
                font={`3.5px ${font}`} fill
                text={`How Deep Lies the Shadow`} />
            <Text x={4} y={22 + 3.5}
                font={`3.5px ${font}`} fill
                text={`New`} />
        </Group>
    </Template>;



export let fbaA4ReportHandler: AwsLambda = (event: FbaPrintJob, context, callback) => RedAgate.renderOnAwsLambda(
<Html5>
    <head>
        <title>FBA</title>
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css?family=Libre+Barcode+128+Text" rel="stylesheet"/>
        <Style src="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css"/>
        <Style src="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css"/>
        <style dangerouslySetInnerHTML={{ __html: require('./fba-a4.style.css') }}/>
    </head>

    <body class="A4">
        <ForEach items={query(event.details).groupEvery(40).select()}> { (items: FbaDetail[]) =>
            <section class="sheet" style="position: relative; top: 0mm; left: 0mm;">
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <SvgImposition items={items} paperWidth={210} paperHeight={297} cols={4} rows={10}> { (item: FbaDetail) =>
                        <Template>
                            <If condition={designerMode}>
                                <Rect x={0} y={0} width={210 / 4} height={297 / 10} lineWidth={0.5} stroke/>
                                <GridLine startX={0} startY={0} endX={210 / 4} endY={297 / 10} gridSize={5} bleed={0} lineWidth={0.1}/>
                            </If>

                            <Fba leaf={item} />
                        </Template> }
                    </SvgImposition>
                </Svg>
            </section> }
        </ForEach>
    </body>
</Html5>, callback);



export let fbaBrDKReportHandler: AwsLambda = (event: FbaPrintJob, context, callback) => RedAgate.renderOnAwsLambda(
<Html5>
    <head>
        <title>FBA</title>
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css?family=Libre+Barcode+128+Text" rel="stylesheet"/>
        <Style src="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css"/>
        <Style src="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css"/>
        <style dangerouslySetInnerHTML={{ __html: require('./brother-ql-paper.css') }}/>
        <style dangerouslySetInnerHTML={{ __html: require('./fba-a4.style.css') }}/>
    </head>

    <body class="BrotherDk-AddressLabel-M ">
        <ForEach items={query(event.details).groupEvery(1).select()}> { (items: FbaDetail[]) =>
            <section class="sheet" style="position: relative; top: 0mm; left: 0mm;">
                <Svg width={28.7} height={89.6} unit='mm'>
                    <Image asAsset id="logo" srcContext="logo-asset"/>
                    <Image asAsset id="qr" srcContext="qr-asset"/>

                    <SvgImposition items={items} paperWidth={28.7} paperHeight={61.8} cols={1} rows={1} itemRotationDeg={270} itemTranslation={[0, 61.8 + 13]}> { (item: FbaDetail) =>
                        <Template>
                            <If condition={designerMode}>
                                <Rect x={0} y={0} width={61.8} height={28.7} lineWidth={0.5} stroke/>
                                <GridLine startX={0} startY={0} endX={61.8} endY={28.7} gridSize={5} bleed={0} lineWidth={0.1} stroke/>
                            </If>

                            <Fba leaf={item} />
                        </Template> }
                    </SvgImposition>
                </Svg>
            </section> }
        </ForEach>
    </body>
</Html5>, callback);
