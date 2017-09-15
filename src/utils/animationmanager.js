
function AnimationManager(config) {
    this.animations = config;
    this.currentAnimation = Object.keys(config)[0];
    this.position = 0;
    this.timer = 0;
    this.playing = false;
}

AnimationManager.prototype.update = function () {
    var anim = this.animations[this.currentAnimation];
    var delay = anim.delay;
    var frames = anim.frames;
    var loop = anim.loop;
    var after = anim.after;
    this.timer++;
    if (this.timer > delay) {
        this.timer -= delay;
        this.position++;
        if (this.position >= frames.length) {
            if (after) {
                after();
            }
            this.position = 0;
            if (!loop) {
                this.playing = false;
            }
        }
    }
}

AnimationManager.prototype.play = function (id) {
    if (this.animations[id]) {
        this.currentAnimation = id;
        this.reset();
    }
}

AnimationManager.prototype.stop = function () {
    this.playing = false;
}

AnimationManager.prototype.reset = function () {
    this.playing = true;
    this.position = 0;
    this.timer = 0;
}

AnimationManager.prototype.getCurrentAnimation = function () {
    return this.currentAnimation;
}

AnimationManager.prototype.getCurrentFrame = function () {
    return this.animations[this.currentAnimation].frames[this.position];
}

module.exports = AnimationManager;
