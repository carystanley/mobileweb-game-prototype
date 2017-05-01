function BattleBackgroundState(game) {
    this.game = game;
    this.background = new BattleBackground(game);
}

BattleBackgroundState.prototype.update = function () {
    this.background.update();
}

BattleBackgroundState.prototype.draw = function (ctx, res) {
    this.background.draw(ctx);
}
