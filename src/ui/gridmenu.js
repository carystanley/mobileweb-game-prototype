
function GridMenu(fontId, x, y, cellWidth, cellHeight, xCount, yCount, winMargin, options, choiceHandler) {
    this.fontId = fontId;
    this.x = x;
    this.y = y;
    this.winMargin = winMargin;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.xCount = xCount;
    this.yCount = yCount;
    this.setOptions(options);
    this.choiceHandler = choiceHandler;
    this.selected = null;
    this.visible = true;
}

GridMenu.prototype.setOptions = function(options) {
    this.options = options || [];
};

GridMenu.prototype.draw = function (ctx, res) {
    if (!this.visible) {
        return;
    }
    var font = res[this.fontId];
    var options = this.options;
    var xCount = this.xCount;
    var yCount = this.yCount;
    var cellWidth = this.cellWidth;
    var cellHeight = this.cellHeight;
    var width = xCount * cellWidth;
    var height = yCount * cellHeight;
    var winMargin = this.winMargin;
    var lineHeight = font.data.lineHeight;
    var yOffset = Math.max(Math.floor((cellHeight - lineHeight) / 2), 0);
    var xOffset = Math.floor(cellWidth/2);

    ctx.fillStyle = 'black';
    ctx.fillRect(this.x - winMargin, this.y - winMargin,
        width + winMargin * 2, height + winMargin * 2);

    for (var ix = 0; ix < xCount; ix++) {
        for (var iy = 0; iy < xCount; iy++) {
            var optionIdx = ix + (iy * xCount);
            var x = ix * cellWidth + this.x;
            var y = iy * cellHeight + this.y;
            if (this.selected === optionIdx) {
                ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
                ctx.fillRect(x, y, cellWidth, cellHeight);
            }
            font.drawText(ctx, options[optionIdx], x + xOffset, y + yOffset, 'center');
        }
    }
}

GridMenu.prototype.event = function(type, x, y) {
    if (!this.visible) {
        return false;
    }

    var xCount = this.xCount;
    var yCount = this.yCount;
    var cellWidth = this.cellWidth;
    var cellHeight = this.cellHeight;

    var mx = Math.floor((x - this.x) / cellWidth);
    var my = Math.floor((y - this.y) / cellHeight);
    if (mx >= 0 && my >= 0 && mx < xCount && my < yCount) {
        var optionIdx = mx + my * yCount;
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

GridMenu.prototype.show = function() {
    this.visible = true;
};

GridMenu.prototype.hide = function() {
    this.visible = false;
};

module.exports = GridMenu;
