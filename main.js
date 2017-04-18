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

var AABB = {
    collision: function(rect1, rect2, handler) {
        var rect1halfx = rect1.width/2;
        var rect1halfy = rect1.height/2;
        var rect2halfx = rect2.width/2;
        var rect2halfy = rect2.height/2;
        var rect1centerx = rect1.x + rect1halfx;
        var rect1centery = rect1.y + rect1halfy;
        var rect2centerx = rect2.x + rect2halfx;
        var rect2centery = rect2.y + rect2halfy;
        var distX = rect2centerx - rect1centerx;
        var distY = rect2centery - rect1centery;
        var correctX = Math.abs(distX) - rect1halfx - rect2halfx;
        var correctY = Math.abs(distY) - rect1halfy - rect2halfy;
        if (correctX < 0 && correctY < 0) {
            handler(rect1, rect2, distX, distY, correctX, correctY);
        }
    }
};

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
        walls.forEach(function(wall) {
            AABB.collision(self, wall, correctionWall);
        });
        events.forEach(function(event) {
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
        for (var i = 0; i < events.length; i++) {
            event = events[i];
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
        entities.sort(function(a, b) { return a.y - b.y; });
        entities.forEach(function(obj) {
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

function Dialog(ctx, x, y, width, lineCount) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.lineCount = lineCount;
    this.lineHeight = 16;
    this.font = '10pt Verdana,Geneva,sans-serif';
    this.visible = false;
    this.reset();
    this.ctx = ctx;
}

Dialog.prototype.show = function() {
    this.visible = true;
}

Dialog.prototype.hide = function() {
    this.visible = false;
}

Dialog.prototype.showText = function(text) {
    this.buffer += text;
    this.show();
}

Dialog.prototype.update = function() {
    if (this.visible) {
        this.tick++;
        if (this.tick % 3 === 0) {
            this.onTick();
        }
    }
}

Dialog.prototype.onTick = function() {
    if (this.lines.length && this.lines[this.cursorLine].length > this.cursorPos) {
        this.cursorPos++;
    } else if (this.buffer.length > 0) {
        if (this.lines.length === this.lineCount) {
            this.lines.shift();
        }
        this.lines.push(this.getNextLine());
        this.cursorLine = this.lines.length - 1;
        this.cursorPos = 0;
    }
}

Dialog.prototype.getNextLine = function() {
    var line = '';
    var chunks = this.buffer.split(' ');
    var done = false;
    var length;
    var i = 0;

    this.ctx.font = this.font;
    while (!done && chunks[i]) {
        length = this.ctx.measureText(line + chunks[i] + ' ').width;
        if (length > this.width) {
            done = true;
        } else {
            line += chunks[i] + ' ';
            i++;
        }
    }

    this.buffer = this.buffer.substr(line.length);
    return line;
}

Dialog.prototype.draw = function(ctx) {
    if (!this.visible) {
        return;
    }

    var margin = 8;
    var width = this.width;
    var lineCount = this.lineCount;
    var lineHeight = this.lineHeight;
    var x = this.x;
    var y = this.y + lineHeight;
    var lines = this.lines;
    var cursorLine = this.cursorLine;
    var cursorPos = this.cursorPos;
    var text;
    var i;

    ctx.fillStyle = 'black';
    ctx.fillRect(this.x - margin, this.y - margin, width + (2 * margin), (lineCount * lineHeight) + (2 * margin));

    ctx.font = this.font;
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'white';
    for (i = 0; i < lines.length; i++) {
        text = lines[i];
        if (cursorLine === i) {
            text = text.substr(0, cursorPos);
        }
        ctx.fillText (text, x, y);
        y += lineHeight;
    }

    if (this.buffer === '') {
        var arrowTop = this.y + (lineCount * lineHeight) + (Math.floor(this.tick / 10) % 3);
        var arrowCenter = this.x + width/2;
        ctx.beginPath();
        ctx.moveTo(arrowCenter - 5, arrowTop);
        ctx.lineTo(arrowCenter + 5, arrowTop);
        ctx.lineTo(arrowCenter, arrowTop + 5);
        ctx.fill();
    }
}

Dialog.prototype.reset = function() {
    this.buffer = '';
    this.lines = [];
    this.cursorLine = 0;
    this.cursorPos = 0;
    this.tick = 0;
}

Dialog.prototype.flush = function() {
    while (this.buffer.length > 0) {
        if (this.lines.length === this.lineCount) {
            this.lines.shift();
        }
        this.lines.push(this.getNextLine());
        this.cursorLine = this.lines.length - 1;
        this.cursorPos = this.lines[this.cursorLine].length;
    }
}

Dialog.prototype.action = function() {
    if (this.buffer === '') {
        this.hide();
        this.reset();
    } else {
        this.flush();
    }
}

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
    myBouncySquare.move();
    myBouncySquare.draw(ctx);

    window.requestAnimationFrame(run); // 60 fps
}



var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

canvas.addEventListener('click', function(e) {
    var x = Math.floor(e.offsetX * (canvas.width / canvas.offsetWidth));
    var y = Math.floor(e.offsetY * (canvas.height / canvas.offsetHeight));
    myBouncySquare.goal(x, y);
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
    myBouncySquare.goal(x, y);
}, true);

var sprites = loadImage('./sprites.gif');
var worldSprite = loadImage('./world.gif');

var myBouncySquare = new BouncySquare();
var dialog = new Dialog(ctx, 40, 100, 180, 3);

var events = [
    {x: 150, y: 205, z: 0, width: 16, height: 8, color: 'rgb(0, 200, 0)',
        text: 'Ouch!!'},
    {x: 355, y: 220, z: 0, width: 16, height: 8, color: 'rgb(0, 200, 0)',
        text: 'To Understand the Banana, You Must Become the Banana'},
    {x: 175, y: 235, z: 0, width: 16, height: 8, color: 'rgb(0, 0, 200)',
        text: 'When you can snatch the pebble from my hand, it will be time for you to leave.'}
];
var entities = events.slice(0);
entities.push(myBouncySquare);

var walls = [
    {x: 0, y: 0, width: 440, height: 100, color: 'rgba(80, 80, 80, 0.5)'},
    {x: 0, y: 0, width: 75, height: 372, color: 'rgba(80, 80, 80, 0.5)'},
    {x: 0, y: 280, width: 300, height: 150, color: 'rgba(80, 80, 80, 0.5)'},
    {x: 300, y: 340, width: 140, height: 60, color: 'rgba(80, 80, 80, 0.5)'},
    {x: 390, y: 0, width: 200, height: 290, color: 'rgba(80, 80, 80, 0.5)'},
    {x: 100, y: 100, width: 150, height: 65, color: 'rgba(80, 80, 80, 0.5)'},
    {x: 60, y: 230, width: 40, height: 100, color: 'rgba(80, 80, 80, 0.5)'},
    {x: 190, y: 240, width: 110, height: 40, color: 'rgba(80, 80, 80, 0.5)'},
    {x: 240, y: 210, width: 70, height: 30, color: 'rgba(80, 80, 80, 0.5)'}
];




// Start the animation
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
run();

/*
TODO
http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
var ctx=c.getContext("2d");
ctx.font="30px Arial";
var txt="Hello World"
ctx.fillText("width:" + ctx.measureText(txt).width,10,50)
ctx.fillText(txt,10,100);
*/
