
function BattleEndTurnState(game, battleState, battle) {
    this.game = game;
    this.battleState = battleState;
    this.battle = battle;
}

BattleEndTurnState.prototype.init = function () {

}

BattleEndTurnState.prototype.enter = function () {
   // Is the Battle Over? Won / Loss or New Round
}

BattleEndTurnState.prototype.update = function () {

}

BattleEndTurnState.prototype.draw = function (ctx, res) {

}

module.exports = BattleEndTurnState;
