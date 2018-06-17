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

## Get Started

See main package's [README](https://github.com/shellyln/red-agate/tree/master/packages/red-agate/README.md) and
[Live Demo](https://shellyln.github.io/red-agate/demo.html).

## Packages

| package | description |
|---------|-------------|
| [red-agate](https://github.com/shellyln/red-agate/tree/master/packages/red-agate) | RedAgate's main package.<br>Static HTML/XML/SVG renderer using JSX, suitable for report output. |
| [red-agate-util](https://github.com/shellyln/red-agate/tree/master/packages/red-agate-util) | Utilities library. |
| [red-agate-svg-canvas](https://github.com/shellyln/red-agate/tree/master/packages/red-agate-svg-canvas) | HTML5 canvas compatible SVG Canvas library. |
| [red-agate-math](https://github.com/shellyln/red-agate/tree/master/packages/red-agate-math) | Math (Finite field, Error correction (RS,BCH,CRC)) library. |
| [red-agate-barcode](https://github.com/shellyln/red-agate/tree/master/packages/red-agate-barcode) | 1d/2d barcodes tag library. |
| [red-agate-react-host](https://github.com/shellyln/red-agate/tree/master/packages/red-agate-react-host) | [React](https://reactjs.org/) component host tag library. |

## License
[ISC](https://github.com/shellyln/red-agate/blob/master/LICENSE.md)  
Copyright (c) 2017, Shellyl_N and Authors.