const merge = require('webpack-merge');
const lib = require('./lib.config');
const example = require('./example.config');

module.exports = [
    lib,
    example
];
