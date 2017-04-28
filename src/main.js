
function loadImage(url, options) {
    options = options || {};
    var image = new Image();
    if (options.onload) {
        image.on('load', options.onload);
    }
    image.src = url;
    return image;
}


Game = {};
Game.setup = function(canvasId, window) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');
    var game = {};
    game.config = {};
    game.config.events = EVENTS;
    game.getWidth = function () {
        return canvas.width;
    };
    game.getHeight = function () {
        return canvas.height;
    };

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
    for (var event in mouseMap) {
        (function (event) {
            canvas.addEventListener(event, function(e) {
                normalizeEvent(mouseMap[event], e.offsetX, e.offsetY);
            }, false);
        })(event);
    }

    var touchMap = {
        touchmove: 'move',
        touchend: 'up',
        touchstart: 'down'
    };
    for (var event in touchMap) {
        (function (event) {
            canvas.addEventListener(event, function(e) {
                normalizeTouch(touchMap[event], e);
            }, true);
        })(event);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    var resources = {
        world: loadImage('./world.gif'),
        sprites: loadImage('./sprites.gif'),
        basicfontsheet: loadImage('./fonts/basic.png'),
    };
    resources.basicfont = new BitmapFont(BasicFontMeta, resources.basicfontsheet);

    game.ctx = ctx;
    game.resources = resources;
    game.state = new StateManager(game, {
        world: new WorldState(game),
        worldmenu: new WorldMenuState(game),
        cutscene: new CutSceneState(game),
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
