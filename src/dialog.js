function Dialog(font, x, y, width, lineCount) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.lineCount = lineCount;
    this.lineHeight = 16;
    this.font = font;
    this.visible = false;
    this.reset();
    this.callback = null;
}

Dialog.prototype.show = function() {
    this.visible = true;
}

Dialog.prototype.hide = function() {
    this.visible = false;
}

Dialog.prototype.showText = function(text, callback) {
    this.buffer += text;
    this.finished = false;
    this.callback = callback;
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
    } else if (!this.finished) {
        this.finished = true;
    }
}

Dialog.prototype.getNextLine = function() {
    var line = '';
    var chunks = this.buffer.split(' ');
    var done = false;
    var length;
    var i = 0;
    var font = this.font;

    while (!done && chunks[i]) {
        length = font.measureText(line + chunks[i] + ' ');
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

    var font = this.font;
    var margin = 8;
    var width = this.width;
    var lineCount = this.lineCount;
    var lineHeight = this.lineHeight;
    var x = this.x;
    var y = this.y;
    var lines = this.lines;
    var cursorLine = this.cursorLine;
    var cursorPos = this.cursorPos;
    var text;
    var i;

    ctx.fillStyle = 'black';
    ctx.fillRect(this.x - margin, this.y - margin, width + (2 * margin), (lineCount * lineHeight) + (2 * margin));

    for (i = 0; i < lines.length; i++) {
        text = lines[i];
        if (cursorLine === i) {
            text = text.substr(0, cursorPos);
        }
        font.drawText(ctx, text, x, y)
        y += lineHeight;
    }

    if (this.finished) {
        var arrowTop = this.y + (lineCount * lineHeight) + (Math.floor(this.tick / 10) % 3);
        var arrowCenter = this.x + width/2;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(arrowCenter - 5, arrowTop);
        ctx.lineTo(arrowCenter + 5, arrowTop);
        ctx.lineTo(arrowCenter, arrowTop + 5);
        ctx.fill();
    }
}

Dialog.prototype.reset = function() {
    this.hide();
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
        this.done();
    } else {
        this.flush();
    }
}

Dialog.prototype.event = function(type) {
    if (!this.visible) {
        return;
    }
    if (type === 'click') {
        this.action();
    }
}

Dialog.prototype.done = function() {
    if (this.callback()) {
        this.callback();
        this.callback = null;
    }
}
