
var Ease = {
    // Linear
    linear: function(x) {return x;},

    // Smoothstep
    smoothstep: function(x) {return x * x * (3 - 2 * x);},
    smoothstepSquared: function(x) {return Math.pow((x * x * (3 - 2 * x)), 2);},
    smoothstepCubed: function(x) {return Math.pow((x * x * (3 - 2 * x)), 3);},

    // Acceleration
    acceleration: function(x) {return x * x;},
    accelerationCubed: function(x) {return Math.pow(x * x, 3);},

    // Deceleration
    deceleration: function(x) {return 1 - Math.pow(1 - x, 2);},
    decelerationCubed: function(x) {return 1 - Math.pow(1 - x, 3);},

    // Sine
    sine: function(x) {return Math.sin(x * Math.PI / 2);},
    sineSquared: function(x) {return Math.pow(Math.sin(x * Math.PI / 2), 2);},
    sineCubed: function(x) {return Math.pow(Math.sin(x * Math.PI / 2), 2);},
    inverseSine: function(x) {return 1 - Math.sin((1 - x) * Math.PI / 2);},
    inverseSineSquared: function(x) {return 1 - Math.pow(Math.sin((1 - x) * Math.PI / 2), 2);},
    inverseSineCubed: function(x) {return 1 - Math.pow(Math.sin((1 - x) * Math.PI / 2), 3);}
}

function Tween() {
    this.playing = false;
    this.s = 0;
    this.e = 0;
    this.x = 0;
    this.frames = 0;
    this.target = null;
    this.prop = null;
    this.done = null;
}

Tween.prototype.start = function (target, prop, ease, start, end, frames, done) {
    this.target = target;
    this.prop = prop;
    this.ease = Ease[ease];
    this.s = start;
    this.e = end;
    this.x = 0;
    this.frames = frames;
    this.done = done;
    this.playing = true;
}

Tween.prototype.update = function () {
    if (this.playing && this.target) {
        if (this.x <= this.frames) {
            var normalizedTime = this.x / this.frames;
            var curvedTime = this.ease(normalizedTime);
            this.target[this.prop] = (this.e * curvedTime) + (this.s * (1 - curvedTime));
            this.x++;
        } else {
            this.playing = false;
            if (this.done) {
                var done = this.done;
                this.done = null;
                done();
            }
        }
    }
}

module.exports = Tween;
