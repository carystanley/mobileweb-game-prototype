function Viewport(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x || 0;
    this.y = y || 0;
}

Viewport.prototype.update = function(player, world) {
    this.x = player.x - this.width/2;
    this.y = player.y - this.height/2;
}

module.exports = Viewport;
