var StateManager = require('../utils/statemanager');

var Battle = require('../battle/battle');

var BattleMenuState = require('./battle-menu');
var BattleEnemyChooseState = require('./battle-enemychoose');
var BattleStartTurnState = require('./battle-startturn');
var BattleTurnState = require('./battle-turn');
var BattleEndTurnState = require('./battle-endturn');

var BattleBackground = require('../ui/battlebackground');

function BattleState(game) {
    this.game = game;
    this.battle = new Battle(game);
    this.state = new StateManager(game, {
        menu: new BattleMenuState(game, this, this.battle),
        enemy: new BattleEnemyChooseState(game, this, this.battle),
        startturn: new BattleStartTurnState(game, this, this.battle),
        turn: new BattleTurnState(game, this, this.battle),
        endturn: new BattleEndTurnState(game, this, this.battle)
    });
}

BattleState.prototype.init = function () {
    this.background = new BattleBackground(this.game);
}

BattleState.prototype.enter = function (enemies) {
    this.battle.setup(enemies);
    this.state.switch('menu');
}

BattleState.prototype.update = function () {
    this.background.update();
    this.state.update();
    this.battle.tick();
}

BattleState.prototype.draw = function (ctx, res) {
    var self = this;
    this.background.draw(ctx);
    var pcs = this.battle.getPlayerCharacters();
    var pcCount = pcs.length;
    pcs.forEach(function (pc, idx) {
        var x = self.game.layout.centeredEvenlySpaced(idx, pcCount, 64);
        var y = self.game.layout.fromBottom(22);
        self.drawPanel(ctx, res, 'Cary', pc.hp, x, y);
    });
    this.state.draw(ctx, res);
}

BattleState.prototype.drawPanel = function (ctx, res, name, num, x, y) {
    ctx.drawImage(
        res.statuspanel,
        0, 0, 60, 35,
        x - 30, y, 60, 35
    );

    var font = res.basicfont;
    var nameLen = font.measureText(name);
    font.drawText(ctx, name, x - (nameLen/2), y);

    var roll = Math.floor((num % 1) * 8);
    var rolling = true;

    for (var i = 0; i < 3; i++) {
        var digit = Math.floor(num % 10);
        var offset = digit * 8;
        if (rolling) {
            offset += roll;
        }
        num = num / 10;
        ctx.drawImage(
            res.odometer,
            offset * 9, 0, 8, 8,
            x + 15 - (i * 8), y + 12, 8, 8
        );
        rolling = digit === 9 && rolling;
    }
}

BattleState.prototype.event = function (type, x, y) {
    this.state.event(type, x, y);
}

module.exports = BattleState;
