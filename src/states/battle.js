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
    this.hp = 123;
}

BattleState.prototype.update = function () {
    this.background.update();
    this.state.update();
    if (this.hp > 0) {
        this.hp -= 1/8;
    } else {
        this.hp = 0;
    } 
}

BattleState.prototype.draw = function (ctx, res) {
    this.background.draw(ctx);
    this.drawPanel(ctx, res, 'Cary');
    this.state.draw(ctx, res);
}

BattleState.prototype.drawPanel = function (ctx, res, name, hp) {
    var x = this.game.getWidth()/2;
    var y = this.game.getHeight() - 26;
    ctx.drawImage(
        res.statuspanel,
        0, 0, 60, 35,
        x - 30, y, 60, 35
    );
    var num = this.hp;
    var digit;

    for (var i = 0; i < 3; i++) {
        digit = Math.floor(num % 10 * 8);
        num = num / 10;
        ctx.drawImage(
            res.odometer,
            digit * 9, 0, 8, 8,
            x + 15 - (i * 8), y + 12, 8, 8
        );
    }
}

BattleState.prototype.event = function (type, x, y) {
    this.state.event(type, x, y);
}

module.exports = BattleState;
