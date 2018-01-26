function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Sprite.prototype.draw = function (context, x, y) {
    context.drawImage(
        this.img,
        this.x, this.y,
        this.width, this.height,
        x | 0, y | 0,
        this.width, this.height
    );
}

Sprite.prototype.drawRelative = function (context, x, y, anchorX, anchorY) {
    this.draw(context,
        (x - this.width * anchorX),
        (y - this.height * anchorY)
    );
}

Sprite.load = function (img, config) {
    var frames = config.frames;
    var sheet = {};
    Object.keys(frames).forEach(function (spriteId) {
        var s = frames[spriteId].frame;
        sheet[spriteId] = new Sprite(img, s.x, s.y, s.w, s.h);
    });
    return sheet;
}

module.exports = Sprite;
