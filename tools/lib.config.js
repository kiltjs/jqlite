const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const getRules = require('./lib/get-rules');
const packageInfo = require('../package.json');
const version = packageInfo.version;
const cwd = process.cwd();

let config = {
    target: 'web',
    devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-eval-source-map',
    entry: {
        'jqlite.umd': path.resolve(cwd, 'src', 'index.js'),
        'jqlite.dist': path.resolve(cwd, 'src', 'assigned.js'),
    },
    output: {
        path: path.resolve(cwd, 'dist'),
        filename: '[name].js',
        library : {
            root: '$',
            amd: 'jqlite',
            commonjs: 'jqlite'
         },
        // libraryExport: 'default',
        libraryTarget: 'umd'
    },
    module: {
        rules: getRules()
    },
    plugins: [
        new CleanWebpackPlugin(['dist/*'],{
            root: cwd,
            exclude:  ['.gitkeep'],
        }),
        new webpack.BannerPlugin(
        `dellar.js @ver${version} | https://github.com/shijinyu/dollar

        a jQuery-like library
        (c)2017-${new Date().getFullYear()} shijinyu
        Released under the MIT License.\n`),
        new webpack.DefinePlugin({
            '__version__' : JSON.stringify(version),
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),

        process.env.NODE_ENV === 'production' ?
        new UglifyJsPlugin({
            uglifyOptions: {
                ecma: 8,
                compress: {
                    dead_code : true,
                    drop_debugger : true,
                    keep_fnames : true,
                }
            },
        }) : () => { },
    ]
}

module.exports = config;
