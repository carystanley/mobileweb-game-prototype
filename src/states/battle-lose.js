
function BattleLoseState(game, battleState, battle) {
    this.game = game;
    this.battleState = battleState;
    this.battle = battle;
}

BattleLoseState.prototype.init = function () {

}

BattleLoseState.prototype.enter = function () {
    var self = this;
    this.battleState.dialog.reset();
    this.battleState.dialog.showText('You Lost!', function () {
        self.game.state.switch('gameover');
    });
}

BattleLoseState.prototype.update = function () {

}


BattleLoseState.prototype.draw = function (ctx, res) {

}


BattleLoseState.prototype.event = function (type, x, y) {

}

module.exports = BattleLoseState;
