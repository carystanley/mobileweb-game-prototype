
function BattleStartTurnState(game, battleState, battle) {
    this.game = game;
    this.battleState = battleState;
    this.battle = battle;
}

BattleStartTurnState.prototype.enter = function () {
    this.battle.startChoose();
    this.battleState.state.switch('menu');
}

module.exports = BattleStartTurnState;
