function Viewport(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x || 0;
    this.y = y || 0;
}

Viewport.prototype.update = function(player, world) {
    this.x = player.x - this.width/2;
    this.y = player.y - this.height/2;
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.y = 0;
    }
    if (this.x + this.width > world.width) {
        this.x = world.width - this.width;
    }
    if (this.y + this.height > world.height) {
        this.y = world.height - this.height;
    }
}
