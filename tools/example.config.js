const path = require('path');
const webpack = require('webpack');
const getRules = require('./lib/get-rules');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const packageInfo = require('../package.json');
const version = packageInfo.version;
const cwd = process.cwd();

let config = {
    entry : {
        'main/main' : path.resolve(cwd, 'examples', 'main', 'main.js'),
    },
    output : {
        path: path.resolve(cwd, 'examples', 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: getRules()
    },
    plugins : [
        new webpack.DefinePlugin({
            'version' : JSON.stringify(version),
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin({
            'inject' : 'body',
            'filename': path.resolve(cwd, 'examples', 'dist' , 'main', 'index.html'),
            'template': path.resolve(cwd, 'examples', 'main', 'index.html')
        }),
        new HtmlWebpackPlugin({
            'inject' : false,
            'filename': path.resolve(cwd, 'examples', 'dist' , 'inline', 'index.html'),
            'template': path.resolve(cwd, 'examples', 'inline', 'index.html')
        }),
    ]
}

if (process.env.NODE_ENV === 'development') {
    config.devServer = {
        publicPath: "/examples/",
        contentBase: path.join(cwd, "examples"),
        compress: true,
        port: 9000
    }
    config.watch = true;
}
module.exports = config;
