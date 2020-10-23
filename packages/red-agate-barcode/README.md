# RedAgate's barcode tag library
#### QR Code, Code39, Code128, EAN (13/8/5/2) / UPC (A/E), ITF, NW7 (Codabar), etc...


[![npm](https://img.shields.io/npm/v/red-agate-barcode.svg)](https://www.npmjs.com/package/red-agate-barcode)
[![GitHub release](https://img.shields.io/github/release/shellyln/red-agate.svg)](https://github.com/shellyln/red-agate/releases)
[![Travis](https://img.shields.io/travis/shellyln/red-agate/master.svg)](https://travis-ci.org/shellyln/red-agate)
[![GitHub forks](https://img.shields.io/github/forks/shellyln/red-agate.svg?style=social&label=Fork)](https://github.com/shellyln/red-agate/fork)
[![GitHub stars](https://img.shields.io/github/stars/shellyln/red-agate.svg?style=social&label=Star)](https://github.com/shellyln/red-agate)


[RedAgate Project Home](https://github.com/shellyln/red-agate)


## Install

```bash
$ npm install red-agate --save
$ npm install red-agate-barcode --save
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

In `webpack >= 5`, the extension in the request is mandatory for it to be fully specified
if the origin is a '*.mjs' file or a '*.js' file where the package.json contains '"type": "module"'.



## License
[ISC](https://github.com/shellyln/red-agate-barcode/blob/master/LICENSE.md)  
Copyright (c) 2017, Shellyl_N and Authors.

