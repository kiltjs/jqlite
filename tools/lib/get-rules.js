const path = require("path");
const autoprefixer = require('autoprefixer');

module.exports = () => [
{
    test: /\.js$/,
    include: /src/,
    use: [
        {
            loader : 'babel-loader',
        },{
            loader : 'eslint-loader',
        }
    ]
}, {
    test: /\.html$/,
    include: /src/,
    use: ['art-template-loader']
}, {
    test: /\.json?$/,
    use: ['json-loader']
}
]
