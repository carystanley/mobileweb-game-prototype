
function loadImage(url, options) {
    options = options || {};
    var image = new Image();
    if (options.onload) {
        image.on('load', options.onload);
    }
    image.src = url;
    return image;
}



var BouncySquare = function (world) {
    this.x = 150;
    this.y = 180;
    this.z = 0;
    this.velocityX = 1;
    this.velocityY = 1;
    this.velocityZ = 0;
    this.width = 16;
    this.height = 8;
    this.world = world;

    this.move = function () {
        this.velocityX = 0;
        this.velocityY = 0;

        if (this.going) {
            if ((this.goalX === this.x && this.goalY === this.y) || this.blockedCount > 30) {
                this.going = false;
            } else {
                if (this.goalX < this.x) { // Left
                    this.velocityX = -1;
                }
                if (this.goalY < this.y) { // Up
                    this.velocityY = -1;
                }
                if (this.goalX > this.x) { // Right
                    this.velocityX = 1;
                }
                if (this.goalY > this.y) { // Down
                    this.velocityY = 1;
                }
            }
        }

        if (this.going && (this.prevX === this.x && this.prevY === this.y)) {
            this.blockedCount++;
        }

        if (this.goalRadius > 0) {
            this.goalRadius -= 1;
        }

        this.prevX = this.x;
        this.prevY = this.y;

        this.x = this.x + this.velocityX;
        this.y = this.y + this.velocityY;

        this.x = Math.min(this.x, this.world.width);
        this.x = Math.max(this.x, 0);
        this.y = Math.min(this.y, this.world.height);
        this.y = Math.max(this.y, 0);

        if (this.z <= 0) {
            this.z = 0;
            if (this.velocityX || this.velocityY) {
                this.velocityZ = 2;
            } else {
                this.velocityZ = 0;
            }
        } else {
            this.velocityZ -= 0.25
        }
        this.z += this.velocityZ;
    };

    this.showText = function(text) {
        this.world.state.dialog.showText(text);
    }
};


var sprites = loadImage('./sprites.gif');
var worldSprite = loadImage('./world.gif');


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

    function run() {
        // Clear anything drawn to the canvas off.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state.update();
        state.draw(ctx);

        window.requestAnimationFrame(run); // 60 fps
    }
    run();
}
