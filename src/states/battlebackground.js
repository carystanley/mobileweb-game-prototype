var BattleBackground = require('../ui/battlebackground');

function BattleBackgroundState(game) {
    this.game = game;
}

BattleBackgroundState.prototype.init = function () {
    this.background = new BattleBackground(this.game);
}

BattleBackgroundState.prototype.update = function () {
    this.background.update();
}

BattleBackgroundState.prototype.draw = function (ctx, res) {
    this.background.draw(ctx);
}

module.exports = BattleBackgroundState;
