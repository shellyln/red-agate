# RedAgate's utilities library


[![npm](https://img.shields.io/npm/v/red-agate-util.svg)](https://www.npmjs.com/package/red-agate-util)
[![GitHub release](https://img.shields.io/github/release/shellyln/red-agate.svg)](https://github.com/shellyln/red-agate/releases)
[![Travis](https://img.shields.io/travis/shellyln/red-agate/master.svg)](https://travis-ci.org/shellyln/red-agate)
[![GitHub forks](https://img.shields.io/github/forks/shellyln/red-agate.svg?style=social&label=Fork)](https://github.com/shellyln/red-agate/fork)
[![GitHub stars](https://img.shields.io/github/stars/shellyln/red-agate.svg?style=social&label=Star)](https://github.com/shellyln/red-agate)


[RedAgate Project Home](https://github.com/shellyln/red-agate)


## Install

```bash
$ npm install red-agate-util --save
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



## Licenses
[ISC](https://github.com/shellyln/red-agate-util/blob/master/LICENSE.md)  
Copyright (c) 2017, Shellyl_N and Authors.


### Credits of the remainder of the software which is not under the ISC.
----

src/convert/TextEncoding.ts#__encodeToUtf8Impl

Original Author:  
http://qiita.com/ukyo/items/1626defd020b2157e6bf  
(c) 2012 ukyo (http://qiita.com/ukyo, https://ukyoweb.com)


----
src/convert/TextEncoding.ts#__decodeUtf8Impl

Original Author:  
http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt  
utf.js - UTF-8 <=> UTF-16 convertion  
Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>  
Version: 1.0  
LastModified: Dec 25 1999  
This library is free.  You can redistribute it and/or modify it.

----
