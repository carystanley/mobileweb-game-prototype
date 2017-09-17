/* global BasicFontMeta, window */

var Inventory = require('./inventory');
var StateManager = require('./utils/statemanager');
var WorldState = require('./states/world');
var WorldMenuState = require('./states/worldmenu');
var CutSceneState = require('./states/cutscene');
var BattleMenuState = require('./states/battlemenu');
var BattleBackgroundState = require('./states/battlebackground');
var BitmapFont = require('./bitmapfont');
var Base64 = require('./utils/base64');
var Canvas = require('./utils/canvas');

var mapHouse = require('../maps/house.json');

function loadImage(url, options) {
    options = options || {};
    var image = new Image();
    if (options.onload) {
        image.onload = options.onload;
    }
    image.src = url;
    return image;
}

function loadMap(map) {
    var layers = {};
    Object.keys(map.layers).forEach(function (layerNum) {
        var layer = map.layers[layerNum];
        var name = layer.name;
        if (layer.encoding === 'base64') {
            layer.data = Base64.decodeAsArray(layer.data, 4);
        }
        layers[name] = layer;
    });
    map.layers = layers;
    map.get = function (layerId, x, y) {
        return this.layers[layerId].data[x + y * this.width];
    }
    return map;
}



function renderMap(map, layers, tilemap) {
    var height = map.height;
    var width = map.width;
    var tileheight = map.tileheight;
    var tilewidth = map.tilewidth;
    var mapHeight = height * tileheight;
    var mapWidth = width * tilewidth;
    var mapCanvas = Canvas.create(mapWidth, mapHeight);
    var tilemapWidth = tilemap.width/tilewidth;
    var ctx = mapCanvas.getContext('2d');
    layers.forEach(function(layerId) {
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var tileId = map.get(layerId, x, y) - 1;
                var sx = (tileId % tilemapWidth) * tilewidth;
                var sy = (Math.floor(tileId / tilemapWidth)) * tileheight;
                ctx.drawImage(
                    tilemap,
                    sx, sy,
                    tilewidth, tileheight,
                    x * tilewidth, y * tileheight,
                    tilewidth, tileheight
                );
            }
        }
    });

    return mapCanvas;
}

var Game = {};
Game.setup = function(canvasId, window, config) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');
    var game = {};
    game.config = config;
    game.getWidth = function () {
        return canvas.width;
    };
    game.getHeight = function () {
        return canvas.height;
    };
    game.player = {
        inventory: new Inventory(8)
    };
    game.player.inventory.add('sneaker');
    game.player.getGoodsMenu = function () {
        var menuItems = [];
        var items = this.inventory.getItems();
        var len = items.length;
        for (var i = 0; i < len; i++) {
            var id = items[i];
            var item = game.config.items[id];
            menuItems.push({
                id: id,
                text: item.label
            });
        }
        return menuItems;
    }

    var disableSwipeFn = function (e) {
        e.preventDefault();
        window.scroll(0, 0);
        return false;
    };

    window.document.addEventListener('touchmove', disableSwipeFn, false);

    function resizeCanvas() {
        var viewPortWidth = document.documentElement.clientWidth;
        var viewPortHeight = document.documentElement.clientHeight;
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var xScale = Math.round(viewPortWidth / canvasWidth);
        var yScale = Math.round(viewPortHeight / canvasHeight);
        var scaleFactor = Math.min(xScale, yScale);
        canvas.style.width = canvasWidth * scaleFactor + 'px';
        canvas.style.height = canvasHeight * scaleFactor + 'px';
    }

    function normalizeEvent(type, viewX, viewY) {
        var x = Math.floor(viewX * (canvas.width / canvas.offsetWidth));
        var y = Math.floor(viewY * (canvas.height / canvas.offsetHeight));
        game.state.event(type, x, y);
    }

    function normalizeTouch(type, e) {
        var touch = e.changedTouches[0];
        var canvasRect = canvas.getBoundingClientRect();
        var docEl = document.documentElement;
        var canvasTop = canvasRect.top + window.pageYOffset - docEl.clientTop;
        var canvasLeft = canvasRect.left + window.pageXOffset - docEl.clientLeft;
        normalizeEvent(type, touch.pageX - canvasLeft, touch.pageY - canvasTop);
    }

    var mouseMap = {
        click: 'click',
        mouseup: 'up',
        mousedown: 'down'
    };
    var e;
    for (e in mouseMap) {
        if (Object.prototype.hasOwnProperty.call(mouseMap, e)) {
            (function (event) {
                canvas.addEventListener(event, function(e) {
                    normalizeEvent(mouseMap[event], e.offsetX, e.offsetY);
                }, false);
            })(e);
        }
    }

    var touchMap = {
        touchmove: 'move',
        touchend: 'up',
        touchstart: 'down'
    };
    for (e in touchMap) {
        if (Object.prototype.hasOwnProperty.call(touchMap, e)) {
            (function (event) {
                canvas.addEventListener(event, function(e) {
                    normalizeTouch(touchMap[event], e);
                }, true);
            })(e);
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    var resources = {
        sprites: loadImage('./images/sprites.png'),
        basicfontsheet: loadImage('./fonts/basic.png'),
        pattern: loadImage('./images/pattern.png'),
        tiles_house: loadImage('./images/tileset.png', {onload: function () {
            resources.world = renderMap(resources.mapHouse, ['background', 'foreground'], resources.tiles_house)
        }}),
        mapHouse: loadMap(mapHouse)
    };

    resources.basicfont = new BitmapFont(BasicFontMeta, resources.basicfontsheet);

    game.ctx = ctx;
    game.resources = resources;
    game.state = new StateManager(game, {
        world: new WorldState(game),
        worldmenu: new WorldMenuState(game),
        cutscene: new CutSceneState(game),
        battlemenu: new BattleMenuState(game),
        battlebackground: new BattleBackgroundState(game)
    }, 'world');

    function run() {
        // Clear anything drawn to the canvas off.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.state.update();
        game.state.draw(ctx, resources);

        window.requestAnimationFrame(run); // 60 fps
    }
    run();
}

window.Game = Game;

module.exports = Game;
