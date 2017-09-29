var StateManager = require('../utils/statemanager');
var BattleMenuState = require('./battle-menu');

var BattleBackground = require('../ui/battlebackground');

function BattleState(game) {
    this.game = game;
    this.state = new StateManager(game, {
        menu: new BattleMenuState(game)
    });
}

BattleState.prototype.init = function () {
    this.background = new BattleBackground(this.game);
}

BattleState.prototype.enter = function () {
    this.state.switch('menu');
}

BattleState.prototype.update = function () {
    this.background.update();
    this.state.update();
}

BattleState.prototype.draw = function (ctx, res) {
    this.background.draw(ctx);
    this.state.draw(ctx, res);
}

BattleState.prototype.event = function (type, x, y) {
    this.state.event(type, x, y);
}

module.exports = BattleState;
