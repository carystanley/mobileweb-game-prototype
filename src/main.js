
function loadImage(url, options) {
    options = options || {};
    var image = new Image();
    if (options.onload) {
        image.on('load', options.onload);
    }
    image.src = url;
    return image;
}

function hitTest(px, py, x, y, width, height) {
    return (
        (px >= x) &&
        (px <= x + width) &&
        (py >= y) &&
        (py <= y + height)
    );
}

function correctionWall(rect1, rect2, distX, distY, correctX, correctY) {
    if (correctX > correctY) {
        rect1.x += ((distX > 0) ? 1 : -1) * correctX;
    } else {
        rect1.y += ((distY > 0) ? 1 : -1) * correctY;
    }
}

function collideEvent(rect1, rect2, distX, distY, correctX, correctY) {
    if (correctX > correctY) {
        rect1.x += ((distX > 0) ? 1 : -1) * correctX;
    } else {
        rect1.y += ((distY > 0) ? 1 : -1) * correctY;
    }
    if (rect2.text && (rect1.goalEvent === rect2)) {
        rect1.going = false;
        rect1.goalEvent = null;
        rect1.showText(rect2.text);
    }
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

        var self = this;
        this.world.walls.forEach(function(wall) {
            AABB.collision(self, wall, correctionWall);
        });
        this.world.events.forEach(function(event) {
            AABB.collision(self, event, collideEvent);
        });
        if (this.going && (this.prevX === this.x && this.prevY === this.y)) {
            this.blockedCount++;
        }

        if (this.goalRadius > 0) {
            this.goalRadius -= 1;
        }
    };

    this.draw = function (ctx, v) {
        ctx.drawImage(
            worldSprite,
            v.x, v.y, v.width, v.height,
            0, 0, v.width, v.height
        );
/*
        walls.forEach(function(obj) {
            ctx.fillStyle = 'rgba(80, 80, 80, 0.5)';
            ctx.fillRect(obj.x - v.x, obj.y - v.y, obj.width, obj.height);
        });
*/
        this.world.entities.sort(function(a, b) { return a.y - b.y; });
        this.world.entities.forEach(function(obj) {
            ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
            ctx.beginPath();
            ctx.ellipse(obj.x + obj.width/2  - v.x, obj.y + obj.height/2  - v.y,
                obj.width/2, obj.height/2, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            ctx.drawImage(
                sprites,
                0, 0, 16, 24,
                (obj.x - v.x) | 0, (obj.y - 20 - obj.z - v.y) | 0, obj.width, 24
            );
        });

        if (this.goalRadius > 0) {
            ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
            ctx.beginPath();
            ctx.ellipse(this.goalX + 8 - v.x, this.goalY + 4 - v.y,
                this.goalRadius, this.goalRadius, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    };

    this.showText = function(text) {
        this.world.state.dialog.showText(text);
    }
};


var sprites = loadImage('./sprites.gif');
var worldSprite = loadImage('./world.gif');



function WorldState(ctx) {
    this.dialog = new Dialog(ctx, 40, 100, 180, 3);
    this.viewport = new Viewport(ctx.canvas.width, ctx.canvas.height);
    this.world = new World(this);
}

WorldState.prototype.update = function () {
    var world = this.world;
    var player = world.player;
    var dialog = this.dialog;
    dialog.update();
    if (!dialog.visible) {
        player.move();
        this.viewport.update(player, world);
    }
}

WorldState.prototype.draw = function (ctx) {
    this.world.player.draw(ctx, this.viewport);
    this.dialog.draw(ctx);
}

WorldState.prototype.onMouse = function (x, y) {
    if (this.dialog.visible) {
        this.dialog.action();
        return;
    }
    var v = this.viewport;
    var wx = x + v.x;
    var wy = y + v.y;

    var event;
    var found = null;
    var player = this.world.player;
    var events = this.world.events;

    for (var i = 0; i < events.length; i++) {
        event = events[i];
        if (hitTest(wx, wy, event.x, event.y-24, 16, 24)) {
            found = event;
        }
    }
    if (found) {
        player.goalX = found.x + found.width/2 - 8;
        player.goalY = found.y + found.height/2 - 4;
        player.goalEvent = found;
    } else {
        player.goalX = wx - 8;
        player.goalY = wy - 4;
        player.goalEvent = null;
    }
    player.goalRadius = 20;
    player.going = true;
    player.blockedCount = 0;
}

WorldState.prototype.onTap = function (x, y) {
    this.onMouse(x, y);
}

WorldState.prototype.onMove = function (x, y) {
    this.onMouse(x, y);
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

    function run() {
        // Clear anything drawn to the canvas off.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state.update();
        state.draw(ctx);

        window.requestAnimationFrame(run); // 60 fps
    }
    run();
}
