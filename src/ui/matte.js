var Tween = require('../tween');

function Matte(game) {
    this.game = game;
    this.color = {r: 0, b: 0, g: 0};
    this.width = game.getWidth();
    this.height = game.getHeight();
    this.visible = false;
    this.alpha = 0;
    this.tween = new Tween();
}

Matte.prototype.fadeIn = function(frames, done) {
    var self = this;
    this.tween.start(this, 'alpha', 'linear', 1, 0, frames, function() {
        self.visible = false;
        done();
    });
}

Matte.prototype.fadeOut = function(frames, done) {
    this.visible = true;
    this.tween.start(this, 'alpha', 'linear', 0, 1, frames, done);
}


Matte.prototype.update = function() {
    if (!this.visible) {
        return;
    }
    this.tween.update();
}

Matte.prototype.draw = function(ctx) {
    if (!this.visible) {
        return;
    }

    var c = this.color;
    var alpha = this.alpha;
    ctx.fillStyle = 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + alpha + ')';
    ctx.fillRect(0, 0, this.width, this.height);
}

module.exports = Matte;
