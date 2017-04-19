
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
    var state = new WorldState(ctx);

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

    canvas.addEventListener('click', function(e) {
        var x = Math.floor(e.offsetX * (canvas.width / canvas.offsetWidth));
        var y = Math.floor(e.offsetY * (canvas.height / canvas.offsetHeight));
        state.onTap(x, y);
    }, false);

    canvas.addEventListener('touchmove', function(e) {
        var touch = e.changedTouches[0];

        var canvasRect = this.getBoundingClientRect();
        var docEl = document.documentElement;
        var canvasTop = canvasRect.top + window.pageYOffset - docEl.clientTop;
        var canvasLeft = canvasRect.left + window.pageXOffset - docEl.clientLeft;

        var touchX = touch.pageX - canvasLeft;
        var touchY = touch.pageY - canvasTop;
        var x = Math.floor(touchX * (canvas.width / canvas.offsetWidth));
        var y = Math.floor(touchY * (canvas.height / canvas.offsetHeight));
        state.onMove(x, y);
    }, true);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    var resources = {
        world: loadImage('./world.gif'),
        sprites: loadImage('./sprites.gif')
    };

    function run() {
        // Clear anything drawn to the canvas off.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state.update();
        state.draw(ctx, resources);

        window.requestAnimationFrame(run); // 60 fps
    }
    run();
}
