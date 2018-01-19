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
                cwd: path.resolve(__dirname, 'images'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, 'sprites/sprite.png'),
                css: [[path.resolve(__dirname, 'sprites/sprite.json'), {
                    format: 'json_texture'
                }]]
            }
        })
    ]
}
