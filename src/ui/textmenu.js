
function TextMenu(font, x, y, width, margin, options, choiceHandler) {
    this.font = font;
    this.x = x;
    this.y = y;
    this.margin = margin;
    this.width = width;
    this.lineHeight = font.data.lineHeight;
    this.setOptions(options);
    this.choiceHandler = choiceHandler;
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
    var margin = this.margin;

    ctx.fillStyle = 'black';
    ctx.fillRect(this.x - margin, this.y - margin, this.width + margin*2, optionsSize * lineHeight + margin*2);

    var x = this.x;
    var y = this.y;
    var font = this.font;

    for (var i = 0; i < optionsSize; i++) {
        font.drawText(ctx, options[i].text, x, y)
        y += lineHeight;
    }
}

TextMenu.prototype.event = function(type, x, y) {
    if (!this.visible) {
        return;
    }

    if (type === 'click') {
        var mx = x - this.x;
        var my = y - this.y;
        var lineHeight = this.lineHeight;
        var height = this.options.length * lineHeight;
        if (mx > 0 && my > 0 && mx < this.width && my < height) {
            var option = this.options[Math.floor(my / lineHeight)];
            this.choiceHandler(option);
            return true;
        }
    }
    return false;
}

TextMenu.prototype.show = function() {
    this.visible = true;
};

TextMenu.prototype.hide = function() {
    this.visible = false;
};
