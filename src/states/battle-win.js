
function BattleWinState(game, battleState, battle) {
    this.game = game;
    this.battleState = battleState;
    this.battle = battle;
}

BattleWinState.prototype.init = function () {

}

BattleWinState.prototype.enter = function () {
    var self = this;
    this.battleState.dialog.reset();
    var xp = this.battle.updatePlayerCharacters();
    this.battleState.dialog.lang('BATTLE.won', {}, function () {
        self.battleState.dialog.lang('BATTLE.xp', {amount: xp}, function () {
            self.checkLevelUp();
        });
    });
}

BattleWinState.prototype.checkLevelUp = function () {
    var shouldLevelUp = false;
    if (shouldLevelUp) {
        this.levelUp();
    } else {
        this.leaveBattle();
    }
}

BattleWinState.prototype.levelUp = function () {
    var self = this;
    this.battleState.dialog.lang('LEVELUP.update', {name: 'name', level: 20}, function () {
        self.battleState.dialog.lang('LEVELUP.stat', {stat: 'stat', amount: 10}, function () {
            self.leaveBattle();
        });
    });
}

BattleWinState.prototype.leaveBattle = function () {
    var game = this.game;
    game.sound.bgm('explore');
    game.state.explore.refreshParty();
    if (this.battleState.onEnd) {
        var eventId = this.battleState.onEnd;
        Event.orphan(game, eventId).triggerEvent('action');
    } else {
        game.state.switch('explore');
    }
}

BattleWinState.prototype.update = function () {

}


BattleWinState.prototype.draw = function (ctx, res) {

}


BattleWinState.prototype.event = function (type, x, y) {

}

module.exports = BattleWinState;
