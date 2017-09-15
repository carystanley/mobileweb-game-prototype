var AnimationManager = require('./utils/animationmanager.js');

var baseAnimationConfig = {
    up: {frames: [0, 1], delay: 12, loop: true},
    right: {frames: [2, 3], delay: 6, loop: true},
    down: {frames: [4, 5], delay: 12, loop: true},
    left: {frames: [6, 7], delay: 6, loop: true}
};

function Actor (world, config) {
    this.frame = config.frame;
    this.x = config.x;
    this.y = config.y;
    this.velocityX = 1;
    this.velocityY = 1;
    this.width = 16;
    this.height = 8;
    this.world = world;
    this.animation = new AnimationManager(baseAnimationConfig);
}

Actor.prototype.update = function () {
    var facing = null;
    this.move();

    this.prevX = this.x;
    this.prevY = this.y;

    this.x = this.x + this.velocityX;
    this.y = this.y + this.velocityY;

    this.x = Math.min(this.x, this.world.width);
    this.x = Math.max(this.x, 0);
    this.y = Math.min(this.y, this.world.height);
    this.y = Math.max(this.y, 0);

    if (this.velocityX > 0) {
        facing = 'right';
    } else if (this.velocityX < 0) {
        facing = 'left';
    }

    if (this.velocityY > 0) {
        facing = 'down';
    } else if (this.velocityY < 0) {
        facing = 'up';
    }

    if (facing) {
        if (this.animation.getCurrentAnimation() !== facing) {
            this.animation.play(facing);
        }
        this.animation.update();
    } else {
        this.animation.stop();
    }
};

Actor.prototype.move = function () {

}

module.exports = Actor;
