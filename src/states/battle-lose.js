
var Event = require('../explore/event');

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
    this.battleState.dialog.lang('BATTLE.lost', {}, function () {
        if (self.battleState.onEnd) {
            var eventId = self.battleState.onEnd;
            self.game.sound.bgm('explore');
            Event.orphan(self.game, eventId).triggerEvent('action');
        } else {
            self.game.state.switch('gameover');
        }
    });
}

BattleLoseState.prototype.update = function () {

}


BattleLoseState.prototype.draw = function (ctx, res) {

}


BattleLoseState.prototype.event = function (type, x, y) {

}

module.exports = BattleLoseState;
