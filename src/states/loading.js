/* global BasicFontMeta */

var BitmapFont = require('../bitmapfont');
var Map = require('../map');
var mapHouse = require('../../maps/house.json');

function loadImage(url, onload) {
    var image = new Image();
    if (onload) {
        image.onload = function() {
            onload(null, image);
        };
    }
    image.src = url;
    return image;
}

function LoadingState(game) {
    this.game = game;
}

LoadingState.prototype.enter = function () {
    var resources = {
        sprites: loadImage('./images/sprites.png'),
        basicfontsheet: loadImage('./fonts/basic.png'),
        pattern: loadImage('./images/pattern.png'),
        mapHouse: new Map(mapHouse),
        tiles_house: loadImage('./images/tileset.png', function () {
            resources.world = resources.mapHouse.render(['background', 'foreground'], resources)
        })
    };

    resources.basicfont = new BitmapFont(BasicFontMeta, resources.basicfontsheet);
    this.game.resources = resources;

    this.game.state.switch('world');
}

LoadingState.prototype.update = function () {

}

LoadingState.prototype.draw = function (ctx, res) {

}

module.exports = LoadingState;
