// const webpack = require('webpack')
const path = require('path');
var SpritesmithPlugin = require('webpack-spritesmith');

module.exports = {
    devtool: 'source-map',
    entry: {
        'app': [
            './src/main.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, './'),
        filename: '[name].js'
    },
    module: {
        rules: []
    },
    plugins: [
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'sprites'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, 'images/sheet.png'),
                css: [[path.resolve(__dirname, 'images/sheet.json'), {
                    format: 'json_texture'
                }]]
            }
        })
    ]
}
