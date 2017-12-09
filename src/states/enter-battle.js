
function EnterBattleState(game) {
    this.game = game;
}

EnterBattleState.prototype.enter = function () {
    this.radius = 150;
    this.game.sound.se('encounter');
}

EnterBattleState.prototype.update = function () {
    this.radius -= 4;
    if (this.radius < 50) {
        var enemies = this.game.state.explore.world.enemies;
        var player = this.game.state.explore.world.player;
        var attacking = [];
        enemies.forEach(function (enemy) {
            var dx = player.x - enemy.x;
            var dy = player.y - enemy.y;
            if ((dx*dx)+(dy*dy) < (2500)) {
                attacking.push(enemy);
                enemy.inactive = true;
            }
        });
        this.game.state.switch('battle', {
            enemies: attacking
        });
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
