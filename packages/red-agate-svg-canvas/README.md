# RedAgate's svg canvas library.
#### HTML5 Canvas API implementation that rendering as SVG, w/o dependencies of browser DOM.



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


## License
[ISC](https://github.com/shellyln/red-agate-util/blob/master/LICENSE.md)  
Copyright (c) 2017, Shellyl_N and Authors.

