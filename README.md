# RedAgate
#### HTML | XML | SVG template engine using JSX, suitable for report output.

RedAgate is static HTML | XML | SVG renderer.  
You can start easily because we are using JSX and semantics similar to React.

[![npm](https://img.shields.io/npm/v/red-agate.svg)](https://www.npmjs.com/package/red-agate)
[![GitHub release](https://img.shields.io/github/release/shellyln/red-agate.svg)](https://github.com/shellyln/red-agate/releases)
[![Travis](https://img.shields.io/travis/shellyln/red-agate/master.svg)](https://travis-ci.org/shellyln/red-agate)
[![GitHub forks](https://img.shields.io/github/forks/shellyln/red-agate.svg?style=social&label=Fork)](https://github.com/shellyln/red-agate/fork)
[![GitHub stars](https://img.shields.io/github/stars/shellyln/red-agate.svg?style=social&label=Star)](https://github.com/shellyln/red-agate)


#### Advantages:
* Easily to bundle resources (images, stylesheets, fonts, scripts, ...) .  
  `RedAgate.renderAsHtml()` API and component lifecycle `defer()` method return promise objects.  
  You can use standard tags (e.g. Image, Style, Font, SingleFont, Script, Asset) to bundle them.

* Many standard Tag-Libs (e.g. If, Repeat, ForEach, Template, Html5, Svg, SVG shapes,
  Barcodes (QR Code, Code39, Code128, EAN/UPC, ITF, NW7/Codabar, postal barcode) and complex objects) are bundled.

* Html5 Canvas API is available in the sub tree of the Svg component.

* Running on both server side (Node.js) and modern browsers (Chrome, Firefox, Safari, Edge).
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

We provide ES6 module files under `red-agate*/modules/*` path.  
You can get the benefits of tree shaking when using webpack.  
Instead, you can also import the whole by simply specifying `red-agate*` as the import path.

## Component Lifecycle

| call order | method | description |
|------:|--------|-------------|
|     0 | `earlyConstruct(): void` | This method is **marker** and it will be **NEVER** called.<br>If it defined, constructor will be called in `createElement()`.<br>Otherwise constructor will be called in `render???()` APIs. |
|     1 | `constructor(props) /`<br>`lambda(props)` | Construct a component.<br>If it is lambda, transform myself and children DOM tree. |
|     2 | `transform(): RedAgateNode` | Transform myself and children DOM tree.<br>This method is equivalent to `render()` of React method. |
|     3 | `defer(): Promise<any>` | Wait for asynchronous resources. |
|     4 | `beforeRender(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`contexts: Map<string, any>`<br>`): void`| Get contexts provided by parent elements.<br>Preparing something for child elements. |
|     5 | `render(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`contexts: Map<string, any>,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`children: string`<br>`): string`| Return rendering result as string. |
|     6 | `afterRender(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`contexts: Map<string, any>`<br>`): void`| Clean up contexts, graphic states, ... |


## APIs

### `import * as RedAgate from 'red-agate/modules/red-agate'`

| method | description |
|--------|-------------|
| `RedAgate.createElement(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`type: ComponentFactory<P>,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`props: P or null or undefined,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`...children: RedAgateNode[]`<br>`): RedAgateElement<P>` | Create a element.<br>This function is called from JSX compiled code. |
| `RedAgate.renderAsHtml(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`element: RedAgateNode`<br>`): Promise<string>` | Render elements to string. |
| `RedAgate.render(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`element: RedAgateNode,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`container: HTMLElement,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`callback?: (`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`html: string or null,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`error: any or null`<br>&nbsp;&nbsp;&nbsp;&nbsp;`) => void`<br>`): void` | Render elements and apply to DOM. |
| `RedAgate.renderOnAwsLambda(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`element: RedAgateNode,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`callback: (`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`error: any or null,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`result: any or null`<br>&nbsp;&nbsp;&nbsp;&nbsp;`) => void`<br>`): void` | Render elements to string.<br>Return result via AWS lambda callback. |
| `RedAgate.renderOnExpress(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`element: RedAgateNode,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`req: any,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`res: any`<br>`): void` | Render elements to string.<br>Return result via Express web server callback. |

### `import { query } from 'red-agate/modules/red-agate/data'`

| method | description |
|--------|-------------|
| `query(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`data: T[]`<br>`): Query<T>` | Transform an array. |
| `Query<T>#orderBy(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`condition: Array<string or`<br>&nbsp;&nbsp;&nbsp;&nbsp;`string[`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`/* colName: string,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`('asc' or 'desc') */`<br>&nbsp;&nbsp;&nbsp;&nbsp;`]> or`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`((a: T, b: T) =>`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`number)`<br>`): Query<T>` | Sort an array. |
| `Query<T>#groupBy(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`condition: string[`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`/* colName: string */`<br>&nbsp;&nbsp;&nbsp;&nbsp;`] or`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`((a: T, b: T,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`index: number, array: T[]) =>`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`boolean)`<br>`): Query<T[]>` | Grouping and transform an array. |
| `Query<T>#groupEvery(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`n: number or`<br>&nbsp;&nbsp;&nbsp;&nbsp;`{`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`single: number,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`first?: number,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`intermediate: number,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`last?: number`<br>&nbsp;&nbsp;&nbsp;&nbsp;`}`<br>`): Query<T[]>` | Grouping and transform an array. |
| `Query<T>#where(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`fn: (`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`value: T,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`index: number,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`array: T[]`<br>&nbsp;&nbsp;&nbsp;&nbsp;`) => boolean`<br>`): Query<T>` | Filter an array. |
| `Query<T>#select<R>(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`fn?: (`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`value: T,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`index: number,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`array: T[]`<br>&nbsp;&nbsp;&nbsp;&nbsp;`) => R`<br>`): Array<R or T>` | Map an array. |


## Standard Tag-Libs

### `red-agate/modules/red-agate/taglib`

| tag | description |
|-----|-------------|
| Repeat | Loop N times. |
| ForEach | Iterate an array. |
| If | Conditional branch. |
| Do | Call a lambda function when `createElement` . |
| Facet | Grouping child elements.<br>Give a name to group. |
| Template | Synonym for `Facet` . |

### `red-agate/modules/red-agate/bundler`

| tag | description |
|-----|-------------|
| Asset | Fetch a external resource.<br>Fetched resource is referred from other tags. |
| Image | Fetch a external image resource. |
| Script | Fetch a external script resource. |
| Style | Fetch a external stylesheet resource. |
| Font | Synonym for `Style` . |
| SingleFont | Fetch a external single font-family font resource. |

### `red-agate/modules/red-agate/html`

| tag | description |
|-----|-------------|
| Html4_01_Strict | Output `doctype` declaration and `html` tag. |
| Html4_01_Transitional | Output `doctype` declaration and `html` tag. |
| Html4_01_Frameset | Output `doctype` declaration and `html` tag. |
| Xhtml1_0_Strict | Output `doctype` declaration and `html` tag. |
| Xhtml1_0_Transitional | Output `doctype` declaration and `html` tag. |
| Xhtml1_0_Frameset | Output `doctype` declaration and `html` tag. |
| Html5 | Output `doctype` declaration and `html` tag. |
| Xml | Output xml declaration. |
| HtmlImposition | Impose pages in a physical page. |

### `red-agate/modules/red-agate/svg`

| tag | description |
|-----|-------------|
| Svg | Output `svg` tag.<br>Children can use a `Canvas` context. |
| Ambient | Change current graphic state properties. |
| Arc | Draw an arc. |
| Canvas | Call a lambda function and draw by using `Canvas` context object. |
| Circle | Draw a circle. |
| Curve | Draw bezier curve(s). |
| GridLine | Draw grid lines for design time. |
| Group | Group children.<br>Output `g` tag. |
| Line | Draw line(s). |
| Path | Group path fragments (e.g. Arc, Circle, Curve, Line, Rect, ...) . |
| Pie | Draw a pie. |
| Polygon | Draw a polygon. |
| Rect | Draw a rectangle. |
| RoundRect | Draw a rounded rectangle. |
| SvgAssetFragment | Append raw SVG tags into `defs`. |
| SvgFragment | Append raw SVG tags. |
| Text | Draw text line(s). |
| SvgImposition | Impose pages in a physical page. |

### `red-agate-barcode/modules/barcode/(Code39|Code128|Ean|Itf|JapanPostal|Nw7|Qr)`

```bash
$ npm install red-agate-barcode --save
```

| tag | description |
|-----|-------------|
| Code39 | Draw a CODE39 barcode. |
| Code128 | Draw a CODE128 barcode. (GS1-128 is available) |
| Ean13 | Draw a EAN-13 (GTIN-13 / JAN-13) barcode. |
| Ean8 | Draw a EAN-8 (GTIN-8 / JAN-8) barcode. |
| Ean5 | Draw a EAN-5 (JAN-5) barcode. |
| Ean2 | Draw a EAN-2 (JAN-2) barcode. |
| UpcA | Draw a UPC-A (GTIN-12) barcode. |
| UpcE | Draw a UPC-E barcode. |
| Itf | Draw a ITF barcode. (GTIN-14 is available) |
| JapanPostal | Draw a Japan Post Customer barcode. |
| Nw7 | Draw a NW7 (Codabar) barcode. |
| Qr | Draw a QR Code (model 2) barcode. |


## Configurations for building application
You should configure `tsconfig` or `.babelrc` for building JSX.  
Prease see [here](https://www.typescriptlang.org/docs/handbook/jsx.html)
or [here](https://babeljs.io/docs/plugins/transform-react-jsx/)
or [examples](https://github.com/shellyln/red-agate-example).  
Instead, you will import `red-agate` as `React`, you can let RedAgate and React coexist.

## FAQ

* Q: Can I receive element events (e.g. onclick) ?  
* A: No. RedAgate is template engine. Please use React, Vue, Riot, Angular, knockout, ...




+ Q: Can I change DOM via API after rendered to real DOM?  
+ A: No. Please use React, Vue, Riot, Angular, knockout, ...




* Q: Can I build print preview window by using RedAgate?  
* A: [paper-css](https://github.com/cognitom/paper-css) may help you to build print previews.




+ Q: Can I output rendered result as PDF, PNG, or other formats?  
+ A: You can convert from html to any formats by using other libraries (e.g. [electron-pdf](https://github.com/fraserxu/electron-pdf), [wkhtmltopdf](https://wkhtmltopdf.org/)) .


## License
[ISC](https://github.com/shellyln/red-agate/blob/master/LICENSE.md)  
Copyright (c) 2017, Shellyl_N and Authors.