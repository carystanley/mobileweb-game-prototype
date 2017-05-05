var Actor = require('./actor');

function Player (world, config) {
    Actor.call(this, world, config);
}

Player.prototype = Object.create(Actor.prototype);

Player.prototype.move = function () {
    this.velocityX = 0;
    this.velocityY = 0;

    if (this.going) {
        if ((this.goalX === this.x && this.goalY === this.y) || this.blockedCount > 30) {
            this.going = false;
        } else {
            if (this.goalX < this.x) { // Left
                this.velocityX = -1;
            }
            if (this.goalY < this.y) { // Up
                this.velocityY = -1;
            }
            if (this.goalX > this.x) { // Right
                this.velocityX = 1;
            }
            if (this.goalY > this.y) { // Down
                this.velocityY = 1;
            }
        }
    }

    if (this.going && (this.prevX === this.x && this.prevY === this.y)) {
        this.blockedCount++;
    }

    if (this.goalRadius > 0) {
        this.goalRadius -= 1;
    }
};

module.exports = Player;
