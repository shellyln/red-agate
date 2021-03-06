# RedAgate's react component host tag library


[![npm](https://img.shields.io/npm/v/red-agate-react-host.svg)](https://www.npmjs.com/package/red-agate-react-host)
[![GitHub release](https://img.shields.io/github/release/shellyln/red-agate.svg)](https://github.com/shellyln/red-agate/releases)
[![.github/workflows/test.yml](https://github.com/shellyln/red-agate/workflows/.github/workflows/test.yml/badge.svg)](https://github.com/shellyln/red-agate/actions)
[![GitHub forks](https://img.shields.io/github/forks/shellyln/red-agate.svg?style=social&label=Fork)](https://github.com/shellyln/red-agate/fork)
[![GitHub stars](https://img.shields.io/github/stars/shellyln/red-agate.svg?style=social&label=Star)](https://github.com/shellyln/red-agate)


[RedAgate Project Home](https://github.com/shellyln/red-agate)


## Install

```bash
$ npm install react --save
$ npm install react-dom --save
$ npm install red-agate --save
$ npm install red-agate-react-host --save
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



## License
[ISC](https://github.com/shellyln/red-agate-react-host/blob/master/LICENSE.md)  
Copyright (c) 2017, Shellyl_N and Authors.

