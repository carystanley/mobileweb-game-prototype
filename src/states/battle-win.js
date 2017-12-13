var Equations = require('../battle/equations');

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
    var gamedata = this.game.data;
    var pcId = null;
    var level = 0;

    gamedata.party.forEach(function (id) {
        var data = gamedata.members[id] || {};
        var nextLevelXp = Equations.nextLevel(data.level);
        if (data.levelXp >= nextLevelXp) {
            data.levelXp -= nextLevelXp;
            data.level++;
            pcId = id;
            level = data.level;
        }
    });

    if (pcId) {
        this.levelUp(pcId, level);
    } else {
        this.leaveBattle();
    }
}

BattleWinState.prototype.levelUp = function (id, level) {
    var self = this;
    this.battleState.dialog.lang('LEVELUP.update', {name: id, level: level}, function () {
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
