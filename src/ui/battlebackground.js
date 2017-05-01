
function BattleBackground(game) {
    this.game = game;
    this.x = 0;
    this.y = Math.floor(game.getHeight() / 4);
    this.width = Math.floor(game.getWidth());
    this.height = Math.floor(game.getHeight() / 2);
    this.pattern = game.resources.pattern;
    this.visible = true;
    this.t = 0;
}

BattleBackground.prototype.update = function() {
    if (!this.visible) {
        return;
    }
    this.t++;
}

BattleBackground.prototype.draw = function(ctx) {
    if (!this.visible) {
        return;
    }

    var pattern = this.pattern;

    this.drawLayer(ctx, {
        pattern: pattern,
        A: 30,
        F: 0.03,
        S: 0.04
    });

    ctx.globalAlpha=0.5;
    this.drawLayer(ctx, {
        pattern: pattern,
        A: 20,
        F: 0.02,
        S: 0.07
    });
    ctx.globalAlpha=1.0;
}

BattleBackground.prototype.drawLayer = function(ctx, layer) {
    var t = this.t;

    var width = this.width;
    var height = this.height;
    var bx = this.x;
    var by = this.y;

    var A = layer.A;
    var F = layer.F;
    var S = layer.S;
    var pattern = layer.pattern;
    var patternHeight = pattern.height;

    for (var y = 0; y < height; y++) {
        var offset = A * Math.sin(F * y + S * t);
        // offset = (y % 2) ? offset : -offset;
        ctx.drawImage(
            pattern,
            Math.floor((offset + width) % width), y % patternHeight,
            width, 1,
            bx, by + y,
            width, 1
        );
    }
}
