var path    = require('path');
var webpack = require('webpack');


module.exports = function (env) {
    var plugins = [];

return [{
        entry: (env && env.env === 'test') ? void 0 : {
            'red-agate': [
                path.resolve(__dirname, 'src/index.ts')
            ]
        },
        node: {
            // fs: false,
            // console: false,
            // process: false,
            global: false,
            __filename: false,
            __dirname: false,
            // Buffer: false,
            // setImmediate: false,
        },
        output: (env && env.env === 'test') ? void 0 : {
            library: 'RedAgate',

            libraryTarget: 'umd',
            filename: process.env.NODE_ENV === 'production' ? '[name].min.js' : '[name].js',
            path: path.resolve(__dirname, 'dist'),
            devtoolModuleFilenameTemplate: void 0,
        },
        target: "web",

        // resolve linked modules bin paths.
        resolve: {
            alias: {
                "red-agate-util": path.resolve(__dirname, "../red-agate-util/"),
                "red-agate-svg-canvas": path.resolve(__dirname, "../red-agate-svg-canvas/"),
                "red-agate-math": path.resolve(__dirname, "../red-agate-math/"),
                "red-agate": path.resolve(__dirname, "../red-agate/"),
                "red-agate-react-host": path.resolve(__dirname, "../red-agate-react-host/"),
                "red-agate-barcode": path.resolve(__dirname, "../red-agate-barcode/"),
            },
            extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
            modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
        },
        externals: {
            react: {
              root: 'React',
              commonjs2: 'react',
              commonjs: 'react',
              amd: 'react',
              umd: 'react',
            },
            'react-dom': {
              root: 'ReactDOM',
              commonjs2: 'react-dom',
              commonjs: 'react-dom',
              amd: 'react-dom',
              umd: 'react-dom',
            },
            'react-dom/server': {
              root: 'ReactDOMServer',
              commonjs2: 'react-dom/server',
              commonjs: 'react-dom/server',
              amd: 'react-dom/server',
              umd: 'react-dom/server',
            },
        },

        // bug: babel-loader don't work well in symlinks that is not made by 'npm link';
        //      in symlinks, loader see .babelrc in the module directory,
        //      and try to use node_modules/babel-* presets/plugins.
        //      If no .babelrc in the module directory, babel-loader do nothing.
        //      If .babelrc is existed and no node_modules/babel-* in the module directory,
        //      babel-loader will failed by 'unknown plugin specified'.
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: [
                    'babel-loader',
                    'ts-loader?' + JSON.stringify({
                        configFile: 'tsconfig.json'
                    }),
                ],
                exclude: /node_modules[\/\\](?!red-agate).*$/
            }, {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules[\/\\](?!red-agate).*$/
            }, {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            }, {
                enforce: 'pre',
                test: /\.[tj]sx?$/,
                use: {
                    loader: 'source-map-loader',
                    options: {
                    }
                },
                exclude: /node_modules[\/\\](?!red-agate).*$/
            }]
        },
        plugins: plugins,
        devtool: 'source-map'
    },
]}