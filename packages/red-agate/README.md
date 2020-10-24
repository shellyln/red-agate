# RedAgate
#### Static HTML | XML | SVG renderer using JSX, suitable for report output.

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
  You can use standard Tag-Libs (e.g. Image, Style, Font, SingleFont, Script, Asset) to bundle them.

* Many standard Tag-Libs (e.g. If, Repeat, ForEach, Template, Html5, Svg, SVG shapes,
  Barcodes (QR Code, Code39, Code128, EAN/UPC, ITF, NW7/Codabar, postal barcode) and complex objects) are bundled.

* Html5 Canvas API is available in the sub tree of the Svg component.

* Running on both server side (Node.js) and modern browsers (Chrome, Firefox, Safari, Edge).


![RedAgate](https://shellyln.github.io/assets/image/redagate-logo.svg)
----


## Install

```bash
$ npm install red-agate --save
```


> Note
>
> To import this from your code, you need to use `babel` + `webpack` and import `red-agate-*/modules/*` paths.  
> (We have used the `import` statements for doing the [tree-shaking](https://webpack.js.org/guides/tree-shaking/).
> The `import` statements in the `.js` not the `.mjs` files cannot import from the vanilla node.js.)
>
> You can also import from the `.mjs` file on a node with the `--experimental-modules` option enabled.


### Use with `webpack >= 5`

If you get the error:

```
Module not found: Error: Can't resolve '(importing/path/to/filename)'
in '(path/to/node_modules/path/to/dirname)'
Did you mean '(filename).js'?`
```

Add following setting to your `webpack.config.js`.

```js
{
    test: /\.m?js/,
    resolve: {
        fullySpecified: false,
    },
},
```

On `webpack >= 5`, the extension in the request is mandatory for it to be fully specified
if the origin is a '*.mjs' file or a '*.js' file where the package.json contains '"type": "module"'.



## Usage

See [live demo on browser](https://shellyln.github.io/red-agate/demo.html) ([code](https://github.com/shellyln/red-agate-live-demo)) and
[Node.js example](https://github.com/shellyln/red-agate/tree/master/packages/_debug_app).

### Hello, world:
```tsx
/** @jsx RedAgate.createElement */
import * as RedAgate from 'red-agate/modules/red-agate';

interface HelloProps extends RedAgate.ComponentProps {
    name: string;
}

const Hello = (props: HelloProps) => {
    return (<div>Hello, {props.name}!</div>);
};

RedAgate.renderAsHtml(<Hello name={'😈RedAgate😈'}/>)
.then(html => console.log(html))
.catch(error => console.log(error))
```

### Defining element by using lambda:
```tsx
export interface IfProps extends RedAgate.ComponentProps {
    condition: boolean;
}

export const If = (props: IfProps) => {
    if (this.props.condition) return this.props.children;
    else return [];
};
```

### Defining element by using component:
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

### Defining SVG element by using component:
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

### Complete example:
```tsx
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
import { Lambda }        from 'red-agate/modules/red-agate/app';
import { HtmlRenderer }  from 'red-agate/modules/red-agate/renderer';

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

export const fbaA4ReportHandler: Lambda = (event: PrintJob, context, callback) => RedAgate.renderOnAwsLambda(
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
```

```tsx
const event = {
    details: [{
        // ...
    }]
};

fbaA4ReportHandler(event /* PrintJob */, {} as any /* Context */, (error, result) => {
    if (error) {
        console.log(error);
    } else {
        console.log(result);
    }
});
```

### Render html into PDF:
```tsx
/** @jsx RedAgate.createElement */
import * as RedAgate    from 'red-agate/modules/red-agate';
import { Html5 }        from 'red-agate/modules/red-agate/html';
import { Lambda }       from 'red-agate/modules/red-agate/app';
import { HtmlRenderer } from 'red-agate/modules/red-agate/renderer';

interface PrintJob { /*  */ }

export const reportHandler: Lambda = (event: PrintJob, context, callback) => RedAgate.renderOnAwsLambda(
<Html5>
    hello, { event.name }!
</Html5>, callback);

export const pdfHandler = HtmlRenderer.toPdfHandler(reportHandler, {}, {
    width: '210mm',
    height: '297mm',
    printBackground: true,
});

pdfHandler(event /* PrintJob */, {} as any /* Context */, (error, result) => {
    if (error) {
        console.log(error);
    } else {
        console.log(result);
    }
});
```

### Call from another process:
```tsx
/** @jsx RedAgate.createElement */
import * as RedAgate     from 'red-agate/modules/red-agate';
import { Html5 }         from 'red-agate/modules/red-agate/html';
import { App }           from 'red-agate/modules/red-agate/app';

export const billngReportHandler = (event: BillingPrintJob, context, callback) => RedAgate.renderOnAwsLambda(
<Html5>billng</Html5>, callback);

export const kanbanReportHandler = (event: KanbanPrintJob, context, callback) => RedAgate.renderOnAwsLambda(
<Html5>kanban</Html5>, callback);

App.route('/', (evt, ctx, cb) => cb(null, 'Hello, Node!'))
   .route('/billing', billngReportHandler)
   .route('/kanban', kanbanReportHandler)
   .run({});
```

```python
#!/usr/bin/env python3

import json
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/node_modules/red-agate/')
from redagate_lambda import call, LambdaInternalErrorException


if __name__ == '__main__':
    from flask import Flask, abort
    app = Flask(__name__)

    @app.errorhandler(LambdaInternalErrorException)
    def internal_error_handler(e):
        return 'Internal Server Error', 500

    @app.route('/billing')
    def run_billing_report():
        with open('./src/reports/billing.data.json') as f:
            event = json.loads(f.read())
            event['eventName'] = '/billing'
            return call(command=["node", "dist/app.js"], event=event)

    @app.route('/kanban')
    def run_barcode_test_report():
        with open('./src/reports/kanban.data.json') as f:
            event = json.loads(f.read())
            event['eventName'] = '/kanban'
            return call(command=["node", "dist/app.js"], event=event)

    port = int(os.environ['PORT']) if os.environ.get('PORT') is not None else None
    app.run(debug=True, port=port)
```

### Mix react elements:
```tsx
/** @jsx react.createElement */
import * as react from 'react';

interface ReactHelloProps {
    name: string;
}

export const ReactHello: React.SFC<ReactHelloProps> = (props) => {
    return (<span>Hello, {props.name}!</span>);
};
```

```tsx
/** @jsx RedAgate.createElement */
import * as RedAgate          from 'red-agate/modules/red-agate';
import { Html5 }              from 'red-agate/modules/red-agate/html';

import { ReactHost }          from 'red-agate-react-host/modules/react-host';
import { ReactHello }         from './hello';
import { createElement as $ } from 'react';

RedAgate.renderAsHtml(
<Html5>
    <ReactHost element={$(ReactHello, {name: '😎React😎'})} />
</Html5>)
.then(html => console.log(html))
.catch(error => console.log(error))
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

### `/** @jsx RedAgate.createElement */`<br/>`import * as RedAgate from 'red-agate/modules/red-agate'`

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

### `import { App } from 'red-agate/modules/red-agate/app'`

| method | description |
|--------|-------------|
| `App.cli(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`options: string[]`<br>&nbsp;&nbsp;&nbsp;&nbsp;`handler: (`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`opts: Map<string, string>`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`) => void`<br>`): App` | Add CLI routing.<br>If `options[i]` starts with `?` it is a optional parameter.<br>If `options[i]` ends with `*` it is a wildcard. |
| `App.route(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`name: string`<br>&nbsp;&nbsp;&nbsp;&nbsp;`lambda: Lambda`<br>`): App` | Add routing to lambda.<br>`name` parameter is used as routing path.<br>When request event is received call the lambda that `name` equals to `event.eventName`. |
| `App.run(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`context: any`<br>&nbsp;&nbsp;&nbsp;&nbsp;`lambda?: Lambda`<br>`): App` | Run routing.<br>event is received from stdin as JSON and send response to stdout.<br>Exit process by calling `exit()` when response is ended.<br>If `lambda` is specified, ignore `route()` and call `lambda`. |

### `import { Lambdas } from 'red-agate/modules/red-agate/app'`

| method | description |
|--------|-------------|
| `Lambdas.pipe(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`handler1: Lambda,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`handler2: Lambda`<br>`): Lambda` | Pipe 2 lambdas.<br>Return a composite function that piping 2 lambdas.<br>2nd lambda's `event` is 1st lambda's callback `result`. |

### `import { HtmlRenderer } from 'red-agate/modules/red-agate/renderer'`

```bash
$ npm install puppeteer --save
```

| method | description |
|--------|-------------|
| `HtmlRenderer.toPdf(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`html: string or Promise<string>,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`navigateOptions: any,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`pdfOptions: any`<br>`): Promise<Buffer>` | Render HTML into PDF using puppeteer.<br>See [puppeteer#page.goto](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options) about `navigateOptions`.<br>See [puppeteer#page.pdf](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions) about `pdfOptions`. |
| `HtmlRenderer.toImage(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`html: string or Promise<string>,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`navigateOptions: any,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`imageOptions: any`<br>`): Promise<Buffer>` | Render HTML into image using puppeteer.<br>See [puppeteer#page.goto](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options) about `navigateOptions`.<br>See [puppeteer#page.screenshot](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions) about `imageOptions`. |
| `HtmlRenderer.toPdfHandler(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`handler: Lambda,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`navigateOptions: any,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`pdfOptions: any`<br>`): Lambda` | Create composite function returning pdf as callback result. |
| `HtmlRenderer.toImageHandler(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`handler: Lambda,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`navigateOptions: any,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`imageOptions: any`<br>`): Lambda` | Create composite function returning image as callback result. |

## Standard Tag-Libs

### `red-agate/modules/red-agate/taglib`

| tag | description |
|-----|-------------|
| [Repeat](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/taglib.ts) | Loop N times. |
| [ForEach](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/taglib.ts) | Iterate an array. |
| [If](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/taglib.ts) | Conditional branch. |
| [Do](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/taglib.ts) | Call a lambda function when `createElement` . |
| [Facet](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/taglib.ts) | Grouping child elements.<br>Give a name to group. |
| [Template](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/taglib.ts) | Synonym for `Facet` . |

### `red-agate/modules/red-agate/bundler`

| tag | description |
|-----|-------------|
| [Asset](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/bundler.ts) | Fetch a external resource.<br>Fetched resource is referred from other tags. |
| [Image](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/bundler.ts) | Fetch a external image resource. |
| [Script](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/bundler.ts) | Fetch a external script resource. |
| [Style](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/bundler.ts) | Fetch a external stylesheet resource. |
| [Font](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/bundler.ts) | Synonym for `Style` . |
| [SingleFont](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/bundler.ts) | Fetch a external single font-family font resource. |

### `red-agate/modules/red-agate/html`

| tag | description |
|-----|-------------|
| [Html4_01_Strict](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/html.tsx) | Output `doctype` declaration and `html` tag. |
| [Html4_01_Transitional](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/html.tsx) | Output `doctype` declaration and `html` tag. |
| [Html4_01_Frameset](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/html.tsx) | Output `doctype` declaration and `html` tag. |
| [Xhtml1_0_Strict](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/html.tsx) | Output `doctype` declaration and `html` tag. |
| [Xhtml1_0_Transitional](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/html.tsx) | Output `doctype` declaration and `html` tag. |
| [Xhtml1_0_Frameset](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/html.tsx) | Output `doctype` declaration and `html` tag. |
| [Html5](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/html.tsx) | Output `doctype` declaration and `html` tag. |
| [Xml](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/html.tsx) | Output xml declaration. |
| [HtmlImposition](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/html.tsx) | Impose pages in a physical page. |

### `red-agate/modules/red-agate/svg`

| tag | description |
|-----|-------------|
| [Svg](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Output `svg` tag.<br>Children can use a `Canvas` context. |
| [Ambient](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Change current graphic state properties. |
| [Arc](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Draw an arc. |
| [Canvas](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Call a lambda function and draw by using `Canvas` context object. |
| [Circle](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Draw a circle. |
| [Curve](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Draw bezier curve(s). |
| [GridLine](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Draw grid lines for design time. |
| [Group](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Group children.<br>Output `g` tag. |
| [Line](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Draw line(s). |
| [Path](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Group path fragments (e.g. Arc, Circle, Curve, Line, Rect, ...) . |
| [Pie](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Draw a pie. |
| [Polygon](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Draw a polygon. |
| [Rect](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Draw a rectangle. |
| [RoundRect](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Draw a rounded rectangle. |
| [SvgAssetFragment](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Append raw SVG tags into `defs`. |
| [SvgFragment](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Append raw SVG tags. |
| [Text](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Draw text line(s). |
| [SvgImposition](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/svg.tsx) | Impose pages in a physical page. |

### `red-agate/modules/red-agate/printing`

| tag | description |
|-----|-------------|
| [PrinterMarksProps](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/printing.ts) | Draw printer marks (crop mark, bleed mark, center mark, fold mark). |

### `red-agate-barcode/modules/barcode/(Code39|Code128|Ean|Itf|JapanPostal|Nw7|Qr)`

```bash
$ npm install red-agate-barcode --save
```

| tag | description |
|-----|-------------|
| [Code39](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Code39.ts) | Draw a CODE39 barcode. |
| [Code128](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Code128.ts) | Draw a CODE128 barcode. (GS1-128 is available) |
| [Ean13](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Ean.ts) | Draw a EAN-13 (GTIN-13 / JAN-13) barcode. |
| [Ean8](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Ean.ts) | Draw a EAN-8 (GTIN-8 / JAN-8) barcode. |
| [Ean5](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Ean.ts) | Draw a EAN-5 (JAN-5) barcode. |
| [Ean2](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Ean.ts) | Draw a EAN-2 (JAN-2) barcode. |
| [UpcA](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Ean.ts) | Draw a UPC-A (GTIN-12) barcode. |
| [UpcE](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Ean.ts) | Draw a UPC-E barcode. |
| [Itf](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Itf.ts) | Draw a ITF barcode. (GTIN-14 is available) |
| [JapanPostal](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/JapanPostal.ts) | Draw a Japan Post Customer barcode. |
| [Nw7](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Nw7.ts) | Draw a NW7 (Codabar) barcode. |
| [Qr](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-barcode/src/barcode/Qr.ts) | Draw a QR Code (model 2) barcode. |

### `red-agate-react-host/modules/react-host`

```bash
$ npm install react --save
$ npm install react-dom --save
$ npm install red-agate-react-host --save
```

| tag | description |
|-----|-------------|
| [ReactHost](https://github.com/shellyln/red-agate/blob/master/packages/red-agate-react-host/src/react-host.ts) | Host a react element and render as static markup. |

## Configurations for building application
If you want to use red-agate w/o jsx pragma comment (`/** @jsx RedAgate.createElement */`),  
You should configure `tsconfig` or `.babelrc` for building JSX.  
Prease see [typescript docs](https://www.typescriptlang.org/docs/handbook/jsx.html)
, [babel docs](https://babeljs.io/docs/plugins/transform-react-jsx/)
or [example](https://github.com/shellyln/red-agate-example).


## FAQ

* Can I receive element events (e.g. onclick) ?  
    * No. RedAgate is static renderer. Please use React, Vue, Riot, Angular, knockout, ...




+ Can I change DOM via API after rendered to real DOM?  
    + No. Please use React, Vue, Riot, Angular, knockout, ...




* Can I build print preview window by using RedAgate?  
    * [paper-css](https://github.com/cognitom/paper-css) may help you to build print previews.




+ Can I output rendered result as PDF, PNG, or other formats?  
    + Please use [puppeteer](https://github.com/GoogleChrome/puppeteer) via
      [HtmlRenderer.toPdf()](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/renderer.ts) and
      [HtmlRenderer.toImage()](https://github.com/shellyln/red-agate/blob/master/packages/red-agate/src/red-agate/renderer.ts).
    + Or you can convert from html to any formats using other libraries
      (e.g. ~~[html-pdf (wrapper of PhantomJS)](https://github.com/marcbachmann/node-html-pdf)~~, [wkhtmltopdf](https://wkhtmltopdf.org/)) .


## License
[ISC](https://github.com/shellyln/red-agate/blob/master/LICENSE.md)  
Copyright (c) 2017, Shellyl_N and Authors.