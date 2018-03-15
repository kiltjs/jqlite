const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const exampleConfig = require('./example.config');
const libConfig = require('./lib.config');
const compiler = webpack(exampleConfig);
const libCompiler = webpack(libConfig);
// console.log(process.env.NODE_ENV);
const server = new WebpackDevServer(compiler,{
    ...exampleConfig.devServer,
    stats : {
        mode: 'development',
        colors : true,
    }
});

libCompiler.plugin('run',function(){
    console.log(arguments)
})

server.listen(function() {
    console.log('Starting server on http://localhost:9000');
});
