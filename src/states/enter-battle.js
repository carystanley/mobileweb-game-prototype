
function EnterBattleState(game) {
    this.game = game;
}

EnterBattleState.prototype.enter = function () {
    this.radius = 150;
}

EnterBattleState.prototype.update = function () {
    this.radius -= 4;
    if (this.radius < 50) {
        this.game.state.switch('battle');
    }
}

EnterBattleState.prototype.draw = function (ctx, res) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.game.getWidth()/2, this.game.getHeight()/2,
        this.radius, 0, Math.PI * 2, false);
    ctx.clip();

    this.game.state.explore.draw(ctx, res);

    ctx.restore();
}

module.exports = EnterBattleState;
