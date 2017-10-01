/* global BasicFontMeta */

var BitmapFont = require('../bitmapfont');
var Map = require('../explore/map');
var floor1 = require('../../maps/floor1.json');

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
    var self = this;
    var count = 0;
    var total = 8;

    function doneCheck() {
        count++;
        if (count >= total) {
            self.game.state.switch('explore');
        }
    }

    var resources = {
        sprites: loadImage('./images/sprites.png', doneCheck),
        basicfontsheet: loadImage('./fonts/basic.png', doneCheck),
        pattern: loadImage('./images/pattern.png', doneCheck),
        floor1: new Map(floor1),
        layer0: loadImage('./images/layer0.png', doneCheck),
        layer1: loadImage('./images/layer1.png', doneCheck),
        odometer: loadImage('./images/odometer.png', doneCheck),
        statuspanel: loadImage('./images/status-panel.png', doneCheck),
        battlesprites: loadImage('./images/battle-sprites.png', doneCheck)
    };

    resources.basicfont = new BitmapFont(BasicFontMeta, resources.basicfontsheet);
    this.game.resources = resources;
}

LoadingState.prototype.update = function () {

}

LoadingState.prototype.draw = function (ctx, res) {

}

module.exports = LoadingState;
