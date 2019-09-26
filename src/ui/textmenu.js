var Window = require('../utils/window');

function TextMenu(fontId, x, y, width, rowHeight, winMargin, border, options, choiceHandler) {
    this.fontId = fontId;
    this.x = x;
    this.y = y;
    this.winMargin = winMargin;
    this.border = border;
    this.width = width;
    this.rowHeight = rowHeight;
    this.setOptions(options);
    this.choiceHandler = choiceHandler;
    this.selected = null;
    this.visible = true;
}

TextMenu.prototype.setOptions = function(options) {
    this.options = options || [];
};

TextMenu.prototype.draw = function (ctx, res) {
    if (!this.visible) {
        return;
    }
    var font = res[this.fontId];
    var options = this.options;
    var optionsSize = options.length;
    var rowHeight = this.rowHeight;
    var winMargin = this.winMargin;
    var lineHeight = font.data.lineHeight;
    var offset = Math.max(Math.floor((rowHeight - lineHeight) / 2), 0);
    var x = this.x;
    var y = this.y;

    Window.draw(ctx, x, y, this.width, optionsSize * rowHeight, winMargin, this.border);

    for (var i = 0; i < optionsSize; i++) {
        font.drawText(ctx, options[i].text, x + offset, y + offset);
        var subtext = options[i].subtext;
        if (subtext) {
            subtext = '' + subtext;
            font.drawText(ctx, subtext,
                x + this.width - offset,
                y + offset,
                'right'
            );
        }
        y += rowHeight;
    }

    if (this.selected !== null) {
        ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
        ctx.fillRect(this.x, this.y + (this.selected * rowHeight), this.width, rowHeight);
    }
}

TextMenu.prototype.event = function(type, x, y) {
    if (!this.visible) {
        return false;
    }

    var mx = x - this.x;
    var my = y - this.y;
    var rowHeight = this.rowHeight;
    var height = this.options.length * rowHeight;
    if (mx > 0 && my > 0 && mx < this.width && my < height) {
        var optionIdx = Math.floor(my / rowHeight);
        switch (type) {
            case 'click':
                if (this.choiceHandler) {
                    this.choiceHandler(this.options[optionIdx]);
                }
                this.selected = null;
                break;
            case 'down':
                if (this.choiceHandler) {
                    this.selected = optionIdx;
                }
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

module.exports = TextMenu;
