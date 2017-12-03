# RedAgate
#### HTML | XML | SVG template engine using JSX, suitable for report output.

RedAgate is static HTML | XML | SVG renderer.  
You can start easily because we are using JSX and semantics similar to React.

#### Advantages:
* Easily to bundle resources (images, stylesheets, fonts, scripts, ...) .  
  `RedAgate.renderAsHtml()` API and component lifecycle `defer()` method return promise objects.  
  You can use standard tags (Image, Style, Font, SingleFont, Script, Asset) to bundle them.
* Many standard tags (e.g. If, Repeat, ForEach, Template, Html5, Svg, SVG shapes and complex objects, ...) are bundled.
----

## Install

```bash
$ npm install red-agate --save
```

## Usage

See [examples](https://github.com/shellyln/red-agate-example).

Hello, world:
```tsx
import * as RedAgate from 'red-agate/modules/red-agate';

interface HelloProps extends RedAgate.ComponentProps {
    name: string;
}

const Hello = (props: HelloProps) => {
    return (<div>Hello, {props.name}!</div>);
};

RedAgate.renderAsHtml(<Hello name={'world'}/>)
.then(html => console.log(html))
.catch(error => console.log(error))
```

defining element by using lambda:
```tsx
export interface IfProps extends RedAgate.ComponentProps {
    condition: boolean;
}

export const If = (props: IfProps) => {
    if (this.props.condition) return this.props.children;
    else return [];
};
```

defining element by using component:
```tsx
export interface IfProps extends RedAgate.ComponentProps {
    condition: boolean;
}

export class If extends RedAgate.RedAgateComponent<IfProps> {
    public constructor(props: IfProps) {
        super(props);
    }

    // Equivalent to React's render() .
    public transform() {
        if (this.props.condition) return this.props.children;
        else return [];
    }
}
```

defining SVG element by using component:
```tsx
import { SvgCanvas }          from 'red-agate-svg-canvas/modules/drawing/canvas/SvgCanvas';
import { Shape,
         CONTEXT_SVG_CANVAS } from 'red-agate/modules/red-agate/tags/Shape';

export interface RectProps extends ShapeProps {
    width: number;
    height: number;
}

export const rectPropsDefault: RectProps = Object.assign({}, shapePropsDefault, {
    width: 10,
    height: 10
});

export class Rect extends Shape<RectProps> {
    public constructor(props: RectProps) {
        super(Object.assign({}, rectPropsDefault, props));
    }

    public render(contexts: Map<string, any>, children: string) {
        const canvas: SvgCanvas = this.getContext(contexts, CONTEXT_SVG_CANVAS);
        canvas.rect(0, 0, this.props.width, this.props.height);
        return ``;
    }
}
```

example:
```tsx
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

interface FbaDetail {
    id: string;
    name: string;
    condition: string;
}
interface PrintJob {
    details: FbaDetail[];
}

const designerMode = true;
const font = "'Noto Sans', sans-serif";
const Fba = (props: {leaf: FbaDetail}) =>
    <Template>
        <Group x={0} y={0}>
            <Text x={27} y={11.5}
                textAlign="center" font={`11.5px 'Libre Barcode 128 Text', cursive`} fill
                text={leaf.id} />
            <Text x={4} y={18 + 3.5}
                font={`3.5px ${font}`} fill
                text={leaf.name} />
            <Text x={4} y={22 + 3.5}
                font={`3.5px ${font}`} fill
                text={leaf.condition} />
        </Group>
    </Template>;

export let fbaA4ReportHandler = (event: PrintJob, context, callback) => RedAgate.renderOnAwsLambda(
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
                    <Image asAsset id="logo" srcContext="logo-asset"/>
                    <Image asAsset id="qr" srcContext="qr-asset"/>

                    <SvgImposition items={items} paperWidth={210} paperHeight={297} cols={4} rows={10}> { (item: FbaDetail) =>
                        <Template>
                            <If condition={designerMode}>
                                <Rect x={0} y={0} width={210 / 4} height={297 / 10} lineWidth={0.5} stroke/>
                                <GridLine startX={0} startY={0} endX={210 / 4} endY={297 / 10} gridSize={5} bleed={0} lineWidth={0.1} stroke/>
                            </If>

                            <Fba leaf={item} />
                        </Template> }
                    </SvgImposition>
                </Svg>
            </section> }
        </ForEach>
    </body>
</Html5>, callback);

fbaA4ReportHandler(data /* PrintJob */, {} as any, (error, result) => {
    if (error) {
        console.log(error);
    } else {
        console.log(result);
    }
});
```

## Component Lifecycle

| order | method                                                             | description |
|------:|--------------------------------------------------------------------|-------------|
|     0 | `earlyConstruct(): void`                                           | This method is **marker** and it will be **NEVER** called. If it defined, constructor will called in `createElement()`. Otherwise constructor will called in `render???()` APIs. |
|     1 | `constructor(props) / lambda(props)`                               | Construct a component. If it is lambda, transform myself and children DOM tree. |
|     2 | `transform(): RedAgateNode`                                        | Transform myself and children DOM tree. This method is equivalent to `render()` of React method. |
|     3 | `defer(): Promise<any>`                                            | Wait for asynchronous resources. |
|     4 | `beforeRender(contexts: Map<string, any>): void`                   | Get contexts provided by parent elements. Preparing something for child elements. |
|     5 | `render(contexts: Map<string, any>, children: string): string`     | Return rendering result as string. |
|     6 | `afterRender(contexts: Map<string, any>): void`                    | Clean up contexts, graphic states, ... |


## APIs

| method                                                    | description | import |
|-----------------------------------------------------------|-------------|--------|
| `RedAgate.createElement(type: ComponentFactory<P>, props: P | null | undefined,...children: RedAgateNode[]):RedAgateElement<P>` | Create a element. This function is called from JSX compiled code. | `import * as RedAgate from 'red-agate/modules/red-agate'` |
| `RedAgate.renderAsHtml(element: RedAgateNode):Promise<string>` | Render elements to string. | `import * as RedAgate from 'red-agate/modules/red-agate'` |
| `RedAgate.render(element: RedAgateNode, container: HTMLElement,callback?: (html: string | null, error: any | null) => void):void` | Render elements and apply to DOM. | `import * as RedAgate from 'red-agate/modules/red-agate'` |
| `RedAgate.renderOnAwsLambda(element: RedAgateNode,callback: (error: any | null, result: any | null) => void):void` | Render elements to string. Return result via AWS lambda callback. | `import * as RedAgate from 'red-agate/modules/red-agate'` |
| `RedAgate.renderOnExpress(element: RedAgateNode, req: any, res: any):void` | Render elements to string. Return result via Express web server callback. | `import * as RedAgate from 'red-agate/modules/red-agate'` |


## Configurations for building application
You should configure `tsconfig` or `.babelrc` for building JSX.  
Prease see [here](https://www.typescriptlang.org/docs/handbook/jsx.html)
or [here](https://babeljs.io/docs/plugins/transform-react-jsx/)
or [examples](https://github.com/shellyln/red-agate-example).


## FAQ
* Q: Can I receive element events (e.g. onclick) ?  
  A: No. RedAgate is template engine. Please use React, Vue, Riot, Angular, knockout, ...
* Q: Can I change DOM via API after render to real DOM.  
  A: No. Please use React, Vue, Riot, Angular, knockout, ...

## License
ISC
