/* global BasicFontMeta, BattleNumberFontMeta */

var BitmapFont = require('../bitmapfont');
var Map = require('../explore/map');
var floor1 = require('../../maps/floor1.json');
var floor2 = require('../../maps/floor2.json');
var floor3 = require('../../maps/floor3.json');
var roof = require('../../maps/roof.json');
var roof2 = require('../../maps/roof2.json');
var class1 = require('../../maps/class1.json');
var class2 = require('../../maps/class2.json');
var class3 = require('../../maps/class3.json');
var class4 = require('../../maps/class4.json');
var class5 = require('../../maps/class5.json');
var class6 = require('../../maps/class6.json');
var class7 = require('../../maps/class7.json');
var class8 = require('../../maps/class8.json');
var class9 = require('../../maps/class9.json');
var debug = require('../../maps/debug.json');

var Howl = require('howler').Howl;

function loadSound(urls, loop, onload) {
    var sound = new Howl({
        src: urls,
        loop: loop
    });
    sound.once('load', onload);
    return sound;
}

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
    var total = 11;

    function doneCheck() {
        count++;
        if (count >= total) {
            self.game.state.switch('explore');
        }
    }

    var resources = {
        sprites: loadImage('./images/sprites.png', doneCheck),
        basicfontsheet: loadImage('./fonts/basic.png', doneCheck),
        battlenumbersfontsheet: loadImage('./fonts/battle-numbers.gif', doneCheck),
        pattern: loadImage('./images/pattern.png', doneCheck),
        floor1: new Map(floor1),
        floor2: new Map(floor2),
        floor3: new Map(floor3),
        roof: new Map(roof),
        roof2: new Map(roof2),
        class1: new Map(class1),
        class2: new Map(class2),
        class3: new Map(class3),
        class4: new Map(class4),
        class5: new Map(class5),
        class6: new Map(class6),
        class7: new Map(class7),
        class8: new Map(class8),
        class9: new Map(class9),
        debug: new Map(debug),
        layer0: loadImage('./images/layer0.png', doneCheck),
        odometer: loadImage('./images/odometer.png', doneCheck),
        statuspanel: loadImage('./images/status-panel.png', doneCheck),
        battlesprites: loadImage('./images/battle-sprites.png', doneCheck),
        se: {
            cursor_ok: loadSound(['./sounds/se/cursor_ok.wav'], false, doneCheck),
            item1: loadSound(['./sounds/se/item1.wav'], false, doneCheck)
        },
        me: {
            joins_party: loadSound(['./sounds/me/joins_party.wav'], false, doneCheck)
        },
        bgm: {
            school_happy: loadSound(['./sounds/bgm/school_happy.mp3'], true, doneCheck)
        }
    };

    resources.basicfont = new BitmapFont(BasicFontMeta, resources.basicfontsheet);
    resources.battlenumbersfont = new BitmapFont(BattleNumberFontMeta, resources.battlenumbersfontsheet);
    this.game.resources = resources;
}

LoadingState.prototype.update = function () {

}

LoadingState.prototype.draw = function (ctx, res) {

}

module.exports = LoadingState;
