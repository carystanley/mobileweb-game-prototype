
function BattleWinState(game, battleState, battle) {
    this.game = game;
    this.battleState = battleState;
    this.battle = battle;
}

BattleWinState.prototype.init = function () {

}

BattleWinState.prototype.enter = function () {
    var game = this.game;
    this.battleState.dialog.reset();
    this.battle.updatePlayerCharacters();
    this.battleState.dialog.showText('You Won!', function () {
        game.sound.bgm('explore');
        game.state.explore.refreshParty();
        game.state.switch('explore');
    });
}

BattleWinState.prototype.update = function () {

}


BattleWinState.prototype.draw = function (ctx, res) {

}


BattleWinState.prototype.event = function (type, x, y) {

}

module.exports = BattleWinState;
