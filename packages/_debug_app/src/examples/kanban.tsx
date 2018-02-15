
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
import { Asset,
         Font,
         Image,
         Script,
         Style }           from 'red-agate/modules/red-agate/bundler';
import { query }           from 'red-agate/modules/red-agate/data';
import { AwsLambda }       from 'red-agate/modules/red-agate/app';



const designerMode = true;



interface KanbanDetail {
}

interface KanbanPrintJob {
    details: KanbanDetail[];
}



const font = "'Noto Sans', sans-serif";

const Kanban = (props: {leaf: KanbanDetail}) =>
    <Template>
        <Group x={0} y={0}>
            <Image use="logo" x={4} y={4} width={5} height={5}/>
            <Text x={10} y={4 + 4}
                font={`4px ${font}`} fill
                text={`Acme Inc. Santa Clara Plant`} />

            <Text x={65} y={1 + 3}
                font={`3px ${font}`} fill
                text={`Delivery Slip`} />
            <Text x={65} y={5 + 3}
                font={`3px ${font}`} fill
                text={`#20191230-999999-AAA`} />
        </Group>

        <Group x={5} y={10}>
            <Group x={0} y={0}>
                <Rect x={0} y={0} width={15} height={15} lineWidth={0.8} stroke/>
                <Text x={1} y={3.2 + 4}
                    font={`4px ${font}`} multiline fill
                    text={`Part\nNo#`} />
            </Group>
            <Group x={15} y={0}>
                <Rect x={0} y={0} width={80} height={15} lineWidth={0.8} stroke/>
                <Text x={1} y={2 + 9}
                    font={`9px ${font}`} fill
                    text={`X-12345-67890--A`} />
            </Group>
        </Group>

        <Group x={5} y={25}>
            <Group x={0} y={0}>
                <Rect x={0} y={0} width={15} height={10} lineWidth={0.2} stroke/>
                <Text x={1} y={0 + 4}
                    font={`4px ${font}`} multiline fill
                    text={`Part \nName`} />
            </Group>
            <Group x={15} y={0}>
                <Rect x={0} y={0} width={80} height={10} lineWidth={0.2} stroke/>
                <Text x={1} y={2.3 + 5.5}
                    font={`5.5px ${font}`} fill
                    text={`Bolt & Nut Assembly 332154`} />
            </Group>
        </Group>

        <Group x={5} y={35}>
            <Rect x={0} y={0} width={65} height={5} lineWidth={0.2} stroke/>
            <Text x={1} y={0 + 4}
                font={`2.6px ${font}`} fill
                text={`Total QTY:`} />
            <Text x={18 + 23} y={0 + 4}
                textAlign='right'
                font={`4px ${font}`} fill
                text={(1000000000).toLocaleString()} />
        </Group>

        <Group x={70} y={35}>
            <Rect x={0} y={0} width={30} height={5} lineWidth={0.8} stroke/>
            <Text x={1} y={0 + 4}
                font={`2.6px ${font}`} fill
                text={`Unit:`} />
            <Text x={10} y={0 + 4}
                font={`4px ${font}`} fill
                text={`PCS`} />
        </Group>

        <Group x={5} y={40}>
            <Rect x={0} y={0} width={35} height={15} lineWidth={0.8} stroke/>
            <Text x={1} y={0 + 3}
                font={`3px ${font}`} multiline fill
                text={`Number of Boxes \nw/ Fractional box:`} />
            <Text x={34} y={0 + 3 + 11}
                textAlign='right'
                font={`9px ${font}`} fill
                text={(100000).toLocaleString()} />
        </Group>

        <Group x={40} y={40}>
            <Rect x={0} y={0} width={30} height={15} lineWidth={0.2} stroke/>
            <Text x={1} y={0 + 3}
                font={`3px ${font}`} fill
                text={`QTY / BOX:`} />
            <Text x={29} y={5 + 9}
                textAlign='right'
                font={`9px ${font}`} fill
                text={(1000).toLocaleString()} />
        </Group>

        <Group x={70} y={40}>
            <Rect x={0} y={0} width={30} height={15} lineWidth={0.8} stroke/>
            <Text x={1} y={0 + 3}
                font={`3px ${font}`} multiline fill
                text={`Number of \nFractions:`} />
            <Text x={29} y={5 + 9}
                textAlign='right'
                font={`9px ${font}`} fill
                text={(1000).toLocaleString()} />
        </Group>

        <Group x={5} y={55}>
            <Rect x={0} y={0} width={95} height={15} lineWidth={0.8} stroke/>
            <Text x={1} y={0 + 3}
                font={`3px ${font}`} fill
                text={`Arrival Datetime:`} />
            <Text x={1} y={4.5 + 9}
                font={`9px ${font}`} fill
                text={`2020-01-01`} />
            <Rect x={50} y={0} width={25} height={15} lineWidth={0.2} stroke/>
            <Text x={51} y={4.5 + 9}
                font={`9px ${font}`} fill
                text={`15:30`} />
            <Rect x={75} y={0} width={20} height={15} lineWidth={0.2} fill/>
            <Text x={76} y={0.4 + 7}
                font={`7px/6.3px ${font}`} fillColor="#FFF" multiline fill
                text={`UR-\nGENT`} />
        </Group>

        <Group x={5} y={70}>
            <Rect x={0} y={0} width={45} height={15} lineWidth={0.2} stroke/>
            <Text x={1} y={0 + 3}
                font={`3px ${font}`} fill
                text={`Destination:`} />
            <Text x={1} y={3.4 + 5.2}
                font={`5.2px ${font}`} multiline fill
                text={`Foobar Inc. \nTijuana 3rd Plant`} />
        </Group>

        <Group x={5} y={85}>
            <Rect x={0} y={0} width={45} height={10} lineWidth={0.2} stroke/>
            <Text x={1} y={0 + 3}
                font={`3px ${font}`} fill
                text={`Order#:`} />
            <Text x={1} y={3.5 + 5.5}
                font={`5.5px ${font}`} fill
                text={`X99988877766`} />
        </Group>

        <Group x={50} y={70}>
            <Rect x={0} y={0} width={25} height={25} lineWidth={0.8} stroke/>
            <Text x={1} y={0 + 3}
                font={`3px ${font}`} fill
                text={`Arrival Yard:`} />
            <Text x={1} y={5 + 14}
                font={`14px ${font}`} fill
                text={`D4`} />
        </Group>

        <Group x={77} y={72}>
            <Image use="qr" x={0} y={0} width={25} height={25}/>
        </Group>
    </Template>;



export let kanbanReportHandler: AwsLambda = (event: KanbanPrintJob, context, callback) => RedAgate.renderOnAwsLambda(
<Html5>
    <Asset contextName="logo-asset" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Emoticon_Smile_Face.svg"/>
    <Asset contextName="qr-asset" src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"/>
    <head>
        <title>Kanban</title>
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet"/>
        <Style src="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css"/>
        <Style src="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css"/>
        <style dangerouslySetInnerHTML={{ __html: require('./kanban.style.css') }}/>
    </head>

    <body class="A4">
        <ForEach items={query(event.details).groupEvery(6).select()}> { (items: KanbanDetail[]) =>
            <section class="sheet" style="position: relative; top: 0mm; left: 0mm;">
                <Svg width={210 - 1} height={297 - 2} unit='mm'>
                    <Image asAsset id="logo" srcContext="logo-asset"/>
                    <Image asAsset id="qr" srcContext="qr-asset"/>

                    <SvgImposition items={items} paperWidth={210} paperHeight={297 - 1} cols={2} rows={3}> { (item: KanbanDetail) =>
                        <Template>
                            <If condition={designerMode}>
                                <Rect x={0} y={0} width={210 / 2} height={(297 - 1) / 3} lineWidth={0.5} stroke/>
                                <GridLine startX={0} startY={0} endX={210 / 2} endY={(297 - 1) / 3} gridSize={5} bleed={0} lineWidth={0.1}/>
                            </If>

                            <Kanban leaf={item} />
                        </Template> }
                    </SvgImposition>
                </Svg>
            </section> }
        </ForEach>
    </body>
</Html5>, callback);
