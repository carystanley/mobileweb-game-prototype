
function TextMenu(font, x, y, width, rowHeight, winMargin, options, choiceHandler) {
    this.font = font;
    this.x = x;
    this.y = y;
    this.winMargin = winMargin;
    this.width = width;
    this.lineHeight = font.data.lineHeight;
    this.rowHeight = rowHeight;
    this.itemOffset = Math.max(Math.floor((this.rowHeight - this.lineHeight) / 2), 0);
    this.setOptions(options);
    this.choiceHandler = choiceHandler;
    this.selected = null;
    this.visible = true;
}

TextMenu.prototype.setOptions = function(options) {
    this.options = options || [];
};

TextMenu.prototype.draw = function (ctx) {
    if (!this.visible) {
        return;
    }
    var options = this.options;
    var optionsSize = options.length;
    var lineHeight = this.lineHeight;
    var rowHeight = this.rowHeight;
    var winMargin = this.winMargin;
    var offset = this.itemOffset;

    ctx.fillStyle = 'black';
    ctx.fillRect(this.x - winMargin, this.y - winMargin, this.width + winMargin*2, optionsSize * rowHeight + winMargin*2);

    var x = this.x;
    var y = this.y;
    var font = this.font;

    for (var i = 0; i < optionsSize; i++) {
        font.drawText(ctx, options[i].text, x + offset, y + offset)
        y += rowHeight;
    }

    if (this.selected !== null) {
        ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
        ctx.fillRect(this.x, this.y + (this.selected * rowHeight), this.width, rowHeight);
    }
}

TextMenu.prototype.event = function(type, x, y) {
    if (!this.visible) {
        return;
    }

    var mx = x - this.x;
    var my = y - this.y;
    var rowHeight = this.rowHeight;
    var height = this.options.length * rowHeight;
    if (mx > 0 && my > 0 && mx < this.width && my < height) {
        var optionIdx = Math.floor(my / rowHeight);
        switch (type) {
            case 'click':
                this.choiceHandler(this.options[optionIdx]);
                this.selected = null;
                break;
            case 'down':
                this.selected = optionIdx;
                break;
        }
        return true;
    }

    return false;
}

TextMenu.prototype.show = function() {
    this.visible = true;
};

TextMenu.prototype.hide = function() {
    this.visible = false;
};
