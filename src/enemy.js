function Enemy (world, config) {
    this.frame = config.frame;
    this.x = config.x;
    this.y = config.y;
    this.z = 0;
    this.velocityX = 1;
    this.velocityY = 1;
    this.velocityZ = 0;
    this.width = 16;
    this.height = 8;
    this.world = world;
}

Enemy.prototype.update = function () {
    this.velocityX = 0;
    this.velocityY = 0;

    var player = this.world.player;
    var distX = player.x - this.x;
    var distY = player.y - this.y;
    var distSqr = distX * distX + distY * distY;

    if (distSqr < 10000) {
        if (player.x < this.x) { // Left
            this.velocityX = -1;
        }
        if (player.y < this.y) { // Up
            this.velocityY = -1;
        }
        if (player.x > this.x) { // Right
            this.velocityX = 1;
        }
        if (player.y > this.y) { // Down
            this.velocityY = 1;
        }
    }

    this.prevX = this.x;
    this.prevY = this.y;

    this.x = this.x + this.velocityX;
    this.y = this.y + this.velocityY;

    this.x = Math.min(this.x, this.world.width);
    this.x = Math.max(this.x, 0);
    this.y = Math.min(this.y, this.world.height);
    this.y = Math.max(this.y, 0);

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
};

module.exports = Enemy;
