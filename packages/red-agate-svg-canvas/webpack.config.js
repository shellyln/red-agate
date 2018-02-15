var path    = require('path');
var webpack = require('webpack');



module.exports = function (env) {
    return [{
        target: "node",
        entry: {
            spec: [
                path.resolve(__dirname, 'src/_spec/index.ts')
            ]
        },
        output: {
            library: 'JasmineSpecsRunnerApp',

            libraryTarget: 'commonjs2',
            filename: 'index.spec.js',
            path: path.resolve(__dirname, 'bin.test'),

            // resolve linked modules sourcemap.
            devtoolModuleFilenameTemplate: function(info) {
                var resourcePath = info.resourcePath.replace(/^\.\.\/red-agate/, './../red-agate');
                return 'webpack:///' + resourcePath;
            },
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: [
                    'babel-loader',
                    'ts-loader?' + JSON.stringify({
                        configFile: 'tsconfig.spec.json'
                    }),
                ],
                exclude: /node_modules[\/\\](?!red-agate).*$/
            }, {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules[\/\\](?!red-agate).*$/
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
        plugins: [],
        resolve: {
            alias: {
                "red-agate-util": path.resolve(__dirname, "../red-agate-util/"),
            },
            extensions: ['.tsx', '.ts', '.jsx', '.js']
        },
        devtool: 'source-map'
    },

]}