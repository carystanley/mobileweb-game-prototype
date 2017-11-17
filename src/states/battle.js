var StateManager = require('../utils/statemanager');

var Battle = require('../battle/battle');

var BattleMenuState = require('./battle-menu');
var BattleStartTurnState = require('./battle-startturn');
var BattleTurnState = require('./battle-turn');
var BattleEndTurnState = require('./battle-endturn');

var Dialog = require('../ui/dialog');
var BattleBackground = require('../ui/battlebackground');
var BattleParticles = require('../battle/battle-particles.js');

function BattleState(game) {
    this.game = game;
    this.battle = new Battle(game);
    this.state = new StateManager(game, {
        menu: new BattleMenuState(game, this, this.battle),
        startturn: new BattleStartTurnState(game, this, this.battle),
        turn: new BattleTurnState(game, this, this.battle),
        endturn: new BattleEndTurnState(game, this, this.battle)
    });
}

BattleState.prototype.init = function () {
    this.dialog = new Dialog(this.game.resources.basicfont, 40, 5, 204, 2);
    this.background = new BattleBackground(this.game);
    this.particles = new BattleParticles();
}

BattleState.prototype.enter = function (enemies) {
    this.battle.setup(enemies);
    this.dialog.reset();
    this.state.switch('startturn');
}

BattleState.prototype.update = function () {
    this.background.update();
    this.dialog.update();
    this.state.update();
    this.particles.update();
    this.battle.tick();
}

BattleState.prototype.draw = function (ctx, res) {
    this.background.draw(ctx);
    this.drawEnemies(ctx, res);
    this.drawPanels(ctx, res);
    this.state.draw(ctx, res);
    this.particles.draw(ctx, res);
    this.dialog.draw(ctx);
}

BattleState.prototype.layoutEnemies = function () {
    var enemies = this.battle.getEnemies();
    var canvas = this.game.ctx.canvas;
    enemies.forEach(function(enemy) {
        enemy.x = canvas.width / 2;
        enemy.y = canvas.height / 2;
    });
}

BattleState.prototype.drawEnemies = function (ctx, res) {
    this.layoutEnemies();
    var enemies = this.battle.getEnemies();
    enemies.forEach(function(enemy) {
        var spriteId = enemy.sprite;
        ctx.drawImage(
            res.battlesprites,
            0, spriteId * 64, 64, 64,
            (enemy.x - 32 + enemy.xOffset) | 0,
            (enemy.y - 32) | 0,
            64, 64
        );
    });
}

BattleState.prototype.layoutPanels = function () {
    var layout = this.game.layout;
    var pcs = this.battle.getPlayerCharacters();
    var pcCount = pcs.length;

    pcs.forEach(function (pc, idx) {
        pc.x = layout.centeredEvenlySpaced(idx, pcCount, 64);
        pc.y = layout.fromBottom(22);
    });
}

BattleState.prototype.drawPanels = function (ctx, res) {
    this.layoutPanels();
    var pcs = this.battle.getPlayerCharacters();

    pcs.forEach(function (pc, idx) {
        var x = (pc.x + pc.xOffset) | 0;
        var y = pc.y;

        var num = pc.rollhp;
        var name = pc.name;
        var sprite = pc.sprite;
        var frame = 4;
        var spriteOffset = pc.offset;

        ctx.drawImage(
            res.sprites,
            frame * 24, sprite * 32, 24, 32,
            (x - 12) | 0, (y - spriteOffset) | 0, 24, 32
        );

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
    });
}

BattleState.prototype.event = function (type, x, y) {
    this.dialog.event(type, x, y);
    this.state.event(type, x, y);
}

module.exports = BattleState;
