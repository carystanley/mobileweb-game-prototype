var disableSwipeFn = function (e) {
    e.preventDefault();
    window.scroll(0, 0);
    return false;
};

window.document.addEventListener('touchmove', disableSwipeFn, false);

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
        this.goalEvent = null;
        dialog.showText(rect2.text);
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
    this.minX = 0;
    this.minY = 0;

    this.cameraX = -142;
    this.cameraY = -80;

    this.maxX = 440;
    this.maxY = 372;

    this.move = function () {
        dialog.update();
        if (dialog.visible) {
            return;
        }

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

        this.x = Math.min(this.x, this.maxX);
        this.x = Math.max(this.x, this.minX);
        this.y = Math.min(this.y, this.maxY);
        this.y = Math.max(this.y, this.minY);

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

        this.cameraX = this.x - 142;
        this.cameraY = this.y - 80;
        if (this.cameraX < 0) {
            this.cameraX = 0;
        }
        if (this.cameraY < 0) {
            this.cameraY = 0;
        }
        if (this.cameraX + canvas.width > this.maxX) {
            this.cameraX = this.maxX - canvas.width;
        }
        if (this.cameraY + canvas.height > this.maxY) {
            this.cameraY = this.maxY - canvas.height;
        }
    };

    this.goal = function (x, y) {
        if (dialog.visible) {
            dialog.action();
            return;
        }

        var wx = x + this.cameraX;
        var wy = y + this.cameraY;
        var event;

        var found = null;
        for (var i = 0; i < world.events.length; i++) {
            event = world.events[i];
            if (hitTest(wx, wy, event.x, event.y-24, 16, 24)) {
                found = event;
            }
        }
        if (found) {
            this.goalX = found.x + found.width/2 - 8;
            this.goalY = found.y + found.height/2 - 4;
            this.goalEvent = found;
        } else {
            this.goalX = wx - 8;
            this.goalY = wy - 4;
            this.goalEvent = null;
        }
        this.goalRadius = 20;
        this.going = true;
        this.blockedCount = 0;
    };

    this.draw = function (ctx) {
        var self = this;

        ctx.drawImage(
            worldSprite,
            this.cameraX, this.cameraY, canvas.width, canvas.height,
            0, 0, canvas.width, canvas.height
        );
/*
        walls.forEach(function(obj) {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x - self.cameraX, obj.y - self.cameraY, obj.width, obj.height);
        });
*/
        world.entities.sort(function(a, b) { return a.y - b.y; });
        world.entities.forEach(function(obj) {
            ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
            ctx.beginPath();
            ctx.ellipse(obj.x + obj.width/2  - self.cameraX, obj.y + obj.height/2  - self.cameraY,
                obj.width/2, obj.height/2, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            ctx.drawImage(
                sprites,
                0, 0, 16, 24,
                (obj.x - self.cameraX) | 0, (obj.y - 20 - obj.z - self.cameraY) | 0, obj.width, 24
            );
        });

        if (this.goalRadius > 0) {
            ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
            ctx.beginPath();
            ctx.ellipse(this.goalX + 8 - self.cameraX, this.goalY + 4 - self.cameraY,
                this.goalRadius, this.goalRadius, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }

        dialog.draw(ctx);
    };
};

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

function run() {
    // Clear anything drawn to the canvas off.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world.player.move();
    world.player.draw(ctx);

    window.requestAnimationFrame(run); // 60 fps
}



var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

canvas.addEventListener('click', function(e) {
    var x = Math.floor(e.offsetX * (canvas.width / canvas.offsetWidth));
    var y = Math.floor(e.offsetY * (canvas.height / canvas.offsetHeight));
    world.player.goal(x, y);
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
    world.player.goal(x, y);
}, true);

var sprites = loadImage('./sprites.gif');
var worldSprite = loadImage('./world.gif');


var dialog = new Dialog(ctx, 40, 100, 180, 3);
var world = new World();



// Start the animation
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
run();
