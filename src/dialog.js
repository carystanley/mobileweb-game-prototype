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
