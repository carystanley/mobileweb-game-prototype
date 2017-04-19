function Player (world) {
    this.x = 150;
    this.y = 180;
    this.z = 0;
    this.velocityX = 1;
    this.velocityY = 1;
    this.velocityZ = 0;
    this.width = 16;
    this.height = 8;
    this.world = world;
}

Player.prototype.update = function () {
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

Player.prototype.showText = function(text) {
    this.world.state.dialog.showText(text);
}
