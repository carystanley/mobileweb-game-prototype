var Actor = require('./actor');

function Enemy (world, config) {
    Actor.call(this, world, config);
}

Enemy.prototype = Object.create(Actor.prototype);

Enemy.prototype.move = function () {
    var player = this.world.player;
    var distX = player.x - this.x;
    var distY = player.y - this.y;
    var distSqr = distX * distX + distY * distY;

    this.velocityX = 0;
    this.velocityY = 0;

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
};

module.exports = Enemy;
