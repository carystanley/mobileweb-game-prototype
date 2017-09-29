/* global window */

var Data = require('./data');
var StateManager = require('./utils/statemanager');

var ExploreState = require('./states/explore');
var ExploreMenuState = require('./states/exploremenu');
var CutSceneState = require('./states/cutscene');
var BattleState = require('./states/battle');
var LoadingState = require('./states/loading');

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
    game.data = new Data(game);

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

    game.ctx = ctx;
    game.resources = {};
    game.state = new StateManager(game, {
        explore: new ExploreState(game),
        exploremenu: new ExploreMenuState(game),
        cutscene: new CutSceneState(game),
        battle: new BattleState(game),
        loading: new LoadingState(game)
    });
    game.state.switch('loading');

    function run() {
        // Clear anything drawn to the canvas off.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.state.update();
        game.state.draw(ctx, game.resources);

        window.requestAnimationFrame(run); // 60 fps
    }
    run();
}

window.Game = Game;

module.exports = Game;
