# RedAgate's SVG Canvas library.
#### HTML5 Canvas API implementation that rendering as SVG, w/o dependencies of browser DOM.

<img src="https://shellyln.github.io/assets/image/svg-canvas-logo.svg" alt="SVG Canvas" style="width: 220px;">

[![npm](https://img.shields.io/npm/v/red-agate-svg-canvas.svg)](https://www.npmjs.com/package/red-agate-svg-canvas)
[![GitHub release](https://img.shields.io/github/release/shellyln/red-agate.svg)](https://github.com/shellyln/red-agate/releases)
[![Travis](https://img.shields.io/travis/shellyln/red-agate/master.svg)](https://travis-ci.org/shellyln/red-agate)
[![GitHub forks](https://img.shields.io/github/forks/shellyln/red-agate.svg?style=social&label=Fork)](https://github.com/shellyln/red-agate/fork)
[![GitHub stars](https://img.shields.io/github/stars/shellyln/red-agate.svg?style=social&label=Star)](https://github.com/shellyln/red-agate)


[RedAgate Project Home](https://github.com/shellyln/red-agate)


## Install

```bash
$ npm install red-agate-util --save
$ npm install red-agate-svg-canvas --save
```


> Note
>
> To import this from your code, you need to use `babel` + `webpack` and import `red-agate-*/modules/*` paths.  
> (We have used the `import` statements for doing the [tree-shaking](https://webpack.js.org/guides/tree-shaking/).
> The `import` statements in the `.js` not the `.mjs` files cannot import from the vanilla node.js.)
>
> You can also import from the `.mjs` file on a node with the `--experimental-modules` option enabled.


> NOTICE:  
> Use with `webpack >= 5`
>
> If you get the error:
>
> ```
> Module not found: Error: Can't resolve '(importing/path/to/filename)'
> in '(path/to/node_modules/path/to/dirname)'
> Did you mean '(filename).js'?`
> ```
>
> Add following setting to your `webpack.config.js`.
>
> ```js
> {
>     test: /\.m?js/,
>     resolve: {
>         fullySpecified: false,
>     },
> },
> ```
>
> On `webpack >= 5`, the extension in the request is mandatory for it to be fully specified
> if the origin is a '*.mjs' file or a '*.js' file where the package.json contains '"type": "module"'.



## Usage

```typescript
import { Rect2D }    from 'red-agate-svg-canvas/modules/drawing/canvas/TransferMatrix2D';
import { SvgCanvas } from 'red-agate-svg-canvas/modules/drawing/canvas';

const canvasCtx = new SvgCanvas();

// You can call HTML5 Canvas APIs.
// See also: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
canvasCtx.fillRect(10, 10, 80, 180);

// Render as SVG.
const svgString = canvasCtx.render(new Rect2D(0, 0 , 100, 200), 'mm');

// //Render as data URL encoded SVG.
// const svgDataUrl = canvasCtx.toDataUrl(new Rect2D(0, 0 , 100, 200), 'mm');

console.log(svgString);
```


## Use with the [Chart.js](https://www.chartjs.org/)

See [this](https://github.com/shellyln/chart.js-node-ssr-example) example.



## Patch font rendering output for your target apps/libs' incompatibilities

```typescript
import { SvgCanvas } from 'red-agate-svg-canvas/modules/drawing/canvas';

class MySvgCanvas extends SvgCanvas {
    protected getMultilineTextHeight(c: SvgTextAttributes) {
        // NOTE: * Inherited classes can adjust the value of
        //         `lineHeight` (adjust argument and call super).
        return super.getMultilineTextHeight(c);
    }
    protected getTextFontStyles() {
        // NOTE: * issue #1: CairoSVG, Inkscape, and some libraries can't
        //         understand `font` shorthand style property.
        //                 (Inkscape (v0.92.4) may understand partly)
        //       * Inherited classes can split `font` property to
        //         `font-family`, `font-weight`, `font-size`, ...
        //       * `bramstein/css-font-parser` may useful.
        return super.getTextFontStyles();
    }
    protected getTextAttributes(
            maxWidthOrExtraAttrs: number | SvgTextAttributes | null | undefined): string {
        // NOTE: * Firefox and Inkscape will render text justified
        //         if `textLength` is set.
        //       * Chromium and Safari don't justify in this case.
        //       * This is due to the  difference of
        //         `SVG: <text textLength>` and `Canvas: fillText(,,,maxWidth)`.
        //       * Inherited classes can adjust the value of
        //         `textLength` (adjust argument and call super).
        // See: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/textLength
        //      https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText
        return super.getTextAttributes(maxWidthOrExtraAttrs);
    }
}
```


See also:
* Issue [#1](https://github.com/shellyln/red-agate/issues/1)

## License
[ISC](https://github.com/shellyln/red-agate-util/blob/master/LICENSE.md)  
Copyright (c) 2017, Shellyl_N and Authors.

