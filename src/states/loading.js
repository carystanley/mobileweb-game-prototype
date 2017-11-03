/* global BasicFontMeta */

var BitmapFont = require('../bitmapfont');
var Map = require('../explore/map');
var floor1 = require('../../maps/floor1.json');
var floor2 = require('../../maps/floor2.json');
var floor3 = require('../../maps/floor3.json');
var roof = require('../../maps/roof.json');
var class1 = require('../../maps/class1.json');
var class2 = require('../../maps/class2.json');
var class3 = require('../../maps/class3.json');
var class4 = require('../../maps/class4.json');
var class5 = require('../../maps/class5.json');
var class6 = require('../../maps/class6.json');
var class7 = require('../../maps/class7.json');
var class8 = require('../../maps/class8.json');
var class9 = require('../../maps/class9.json');

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
    var total = 7;

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
        floor2: new Map(floor2),
        floor3: new Map(floor3),
        roof: new Map(roof),
        class1: new Map(class1),
        class2: new Map(class2),
        class3: new Map(class3),
        class4: new Map(class4),
        class5: new Map(class5),
        class6: new Map(class6),
        class7: new Map(class7),
        class8: new Map(class8),
        class9: new Map(class9),
        layer0: loadImage('./images/layer0.png', doneCheck),
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
