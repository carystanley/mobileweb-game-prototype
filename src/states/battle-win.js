var Equations = require('../battle/equations');
var Event = require('../explore/event');
var Async = require('../utils/async');

var PCSTATS = ['maxhp', 'offense', 'defense', 'guts', 'luck', 'speed'];

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
    var self = this;
    var gamedata = this.game.data;

    Async.forEach(gamedata.party, function (id, done) {
        var data = gamedata.members[id] || {};
        var nextLevelXp = Equations.nextLevel(data.level);
        if (data.levelXp >= nextLevelXp) {
            data.levelXp -= nextLevelXp;
            data.level++;
            self.levelUp(id, data, done);
        } else {
            done();
        }
    }, function () {
        self.leaveBattle();
    });
}

BattleWinState.prototype.levelUp = function (id, pc, done) {
    var self = this;
    var lang = this.game.lang;
    this.battleState.dialog.lang('LEVELUP.UPDATE', {
        name: lang.string([['NAME', id]]),
        level: pc.level
    }, function () {
        Async.forEach(PCSTATS, function (statId, done) {
            var inc = Equations.levelUpStatGain(pc.growth[statId], pc.level, pc[statId]);
            if (inc > 0) {
                pc[statId] += inc;
                self.battleState.dialog.lang('LEVELUP.STAT', {
                    stat: lang.string([['STAT', statId]]),
                    amount: inc
                }, done);
            } else {
                done();
            }
        }, done);
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
