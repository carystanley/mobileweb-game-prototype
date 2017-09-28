var AnimationManager = require('../utils/animationmanager.js');

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
    this.velocityX = 0;
    this.velocityY = 0;
    this.width = 14;
    this.height = 8;
    this.world = world;
    this.sprite = config.sprite;
    this.frame = 4;
    this.animation = new AnimationManager(baseAnimationConfig);
}

Actor.prototype.step = function (dx, dy) {
    var facing = null;

    this.prevX = this.x;
    this.prevY = this.y;

    this.submove(dx, 0);
    this.submove(0, dy);

    this.x = Math.min(this.x, this.world.width);
    this.x = Math.max(this.x, 0);
    this.y = Math.min(this.y, this.world.height);
    this.y = Math.max(this.y, 0);

    if (dx > 0) {
        facing = 'right';
    } else if (dx < 0) {
        facing = 'left';
    }

    if (dy > 0) {
        facing = 'down';
    } else if (dy < 0) {
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
    this.frame = this.animation.getCurrentFrame();
};

Actor.prototype.submove = function (dx, dy) {
    var collide = false;
    var x = this.x;
    var y = this.y;
    var hw = this.width/2;
    var hh = this.height/2;
    var map = this.world.map;

    var l = x + dx - hw;
    var t = y + dy - hh;
    var r = x + dx + hw;
    var b = y + dy + hh;

    if (dy > 0) {
        if (map.collide(l, b)) { collide = true; }
        else if (map.collide(r, b)) { collide = true; }
    }

    if (dy < 0) {
        if (map.collide(l, t)) { collide = true; }
        else if (map.collide(r, t)) { collide = true; }
    }

    if (dx > 0) {
        if (map.collide(r, t)) { collide = true; }
        else if (map.collide(r, b)) { collide = true; }
    }

    if (dx < 0) {
        if (map.collide(l, t)) { collide = true; }
        else if (map.collide(l, b)) { collide = true; }
    }

    if (collide) {
        if (dx < 0) {
            this.x = (((x - hw) / 16) | 0) * 16 + hw;
            // this.Xa = 0;
        }
        if (dx > 0) {
            this.x = (((x + hw) / 16 + 1) | 0) * 16 - hw - 1;
            // this.Xa = 0;
        }
        if (dy < 0) {
            this.y = (((y - hh) / 16) | 0) * 16 + hh;
            // this.Ya = 0;
        }
        if (dy > 0) {
            this.y = (((y + hh) / 16 + 1) | 0) * 16 - hh - 1;
            // this.Ya = 0;
        }

        return false;
    } else {
        this.x += dx;
        this.y += dy;
        return true;
    }
}

module.exports = Actor;
