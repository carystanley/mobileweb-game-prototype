
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

var BouncySquare = function () {
    this.color = 'rgb(200, 0, 0)';
    this.x = 150;
    this.y = 180;
    this.z = 0;
    this.velocityX = 1;
    this.velocityY = 1;
    this.velocityZ = 0;
    this.width = 16;
    this.height = 8;

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

        this.x = Math.min(this.x, world.width);
        this.x = Math.max(this.x, 0);
        this.y = Math.min(this.y, world.height);
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
        world.walls.forEach(function(wall) {
            AABB.collision(self, wall, correctionWall);
        });
        world.events.forEach(function(event) {
            AABB.collision(self, event, collideEvent);
        });
        if (this.going && (this.prevX === this.x && this.prevY === this.y)) {
            this.blockedCount++;
        }

        if (this.goalRadius > 0) {
            this.goalRadius -= 1;
        }
    };

    this.goal = function (x, y) {
        var event;

        var found = null;
        for (var i = 0; i < world.events.length; i++) {
            event = world.events[i];
            if (hitTest(x, y, event.x, event.y-24, 16, 24)) {
                found = event;
            }
        }
        if (found) {
            this.goalX = found.x + found.width/2 - 8;
            this.goalY = found.y + found.height/2 - 4;
            this.goalEvent = found;
        } else {
            this.goalX = x - 8;
            this.goalY = y - 4;
            this.goalEvent = null;
        }
        this.goalRadius = 20;
        this.going = true;
        this.blockedCount = 0;
    };

    this.draw = function (ctx, v) {
        var self = this;

        ctx.drawImage(
            worldSprite,
            v.x, v.y, v.width, v.height,
            0, 0, v.width, v.height
        );
/*
        walls.forEach(function(obj) {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x - v.x, obj.y - v.y, obj.width, obj.height);
        });
*/
        world.entities.sort(function(a, b) { return a.y - b.y; });
        world.entities.forEach(function(obj) {
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
        dialog.showText(rect2.text);
    }
};


var sprites = loadImage('./sprites.gif');
var worldSprite = loadImage('./world.gif');

var world = new World();


function Viewport(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x || 0;
    this.y = y || 0;
}

Viewport.prototype.update = function(player, world) {
    this.x = player.x - this.width/2;
    this.y = player.y - this.height/2;
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.y = 0;
    }
    if (this.x + this.width > world.width) {
        this.x = world.width - this.width;
    }
    if (this.y + this.height > world.height) {
        this.y = world.height - this.height;
    }
}


function WorldState(ctx) {
    this.dialog = new Dialog(ctx, 40, 100, 180, 3);
    this.viewport = new Viewport(ctx.canvas.width, ctx.canvas.height);
}

WorldState.prototype.update = function () {
    this.dialog.update();
    if (!this.dialog.visible) {
        world.player.move();
    }
    this.viewport.update(world.player, world);
}

WorldState.prototype.draw = function (ctx) {
    world.player.draw(ctx, this.viewport);
    this.dialog.draw(ctx);
}

WorldState.prototype.onMouse = function (x, y) {
    if (this.dialog.visible) {
        this.dialog.action();
        return;
    }
    var v = this.viewport;
    world.player.goal(x + v.x, y + v.y);
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
