var Helpers = require('../utils/helpers');
var Random = require('../utils/random');
var BattleActions = require('./battle-actions');
var BattleActor = require('./battle-actor');
var transition = Helpers.transition;

var PC_OFFSET_DELTA = 1/2;
var PC_OFFSET_MAX = 20;
var PC_OFFSET_MIN = 0;
var ROLL_DELTA = 1/16;

function Battle(game) {
    this.game = game;
}

Battle.prototype.setup = function (enemies) {
    this.addPlayerCharacters();
    this.addEnemies(enemies);
    this.turnOrder = [].concat(this.pcs, this.enemies);
    this.pcCursor = 0;
    this.turnCursor = 0;
    this.mode = 'choose';
}

Battle.prototype.addPlayerCharacters = function () {
    var actors = [];
    var game = this.game;

    game.data.party.forEach(function (id) {
        var data = game.data.members[id] || {};
        actors.push(new BattleActor(data));
    })
    this.pcs = actors;
}

Battle.prototype.addEnemies = function (enemies) {
    var enemyActors = [];
    var game = this.game;
    enemies.forEach(function (enemy) {
        var enemyConfig = game.config.enemies[enemy.type] || {};
        enemyActors.push(new BattleActor({
            hp: enemyConfig.hp,
            maxhp: enemyConfig.hp,
            sprite: enemyConfig.battlesprite,
            name: enemyConfig.name,
            config: enemyConfig
        }));
    })
    this.enemies = enemyActors;
}

Battle.prototype.getPlayerCharacters = function () {
    return this.pcs;
}

Battle.prototype.getEnemies = function () {
    return this.enemies;
}

Battle.prototype.tick = function () {
    // Handle HP Roll
    this.pcs.forEach(function (pc) {
        pc.rollhp = transition(pc.rollhp, pc.hp, ROLL_DELTA);
    });
    // Handle Shake
    this.turnOrder.forEach(function (obj) {
        if (obj.shakeCounter > 0) {
            obj.shakeCounter--;
            obj.xOffset = Math.random() * 16 - 8;
        } else {
            obj.xOffset = 0;
        }
    })

    var set;
    var cursor;
    if (this.mode === 'turn') {
        set = this.turnOrder;
        cursor = this.turnCursor;
    } else {
        set = this.pcs;
        cursor = this.pcCursor;
    }

    set.forEach(function (obj, idx) {
        if (cursor === idx) {
            obj.offset = transition(obj.offset, PC_OFFSET_MAX, PC_OFFSET_DELTA);
        } else {
            obj.offset = transition(obj.offset, PC_OFFSET_MIN, PC_OFFSET_DELTA);
        }
    });
}

Battle.prototype.startChoose = function () {
    this.turnOrder.forEach(function (actor) {
        actor.action = undefined;
        actor.action_param = undefined;
        actor.target = undefined;
    })
    this.pcCursor = 0;
    this.mode = 'choose';
}

Battle.prototype.startTurn = function () {
    this.turnCursor = 0;
    this.mode = 'turn';
}

Battle.prototype.setAction = function (action, param, target) {
    var actor = this.pcs[this.pcCursor];
    actor.action = action;
    actor.action_param = param;
    actor.target = target;
    this.pcCursor++;
}

Battle.prototype.setEnemyActions = function () {
    var self = this;
    this.enemies.forEach(function (enemy, idx) {
        var action = enemy.getAction().split(':', 2);
        enemy.action = action[0];
        enemy.action_param = action[1];
        var target = self.getActionTarget(action[0]);

        if (target === 'friendly') {
            enemy.target = enemy;
        } else {
            enemy.target = Random.choose(self.pcs)
        }
    });
}

Battle.prototype.allChoosen = function () {
    return (this.pcCursor >= this.pcs.length);
}

Battle.prototype.getCurrentTurn = function () {
    return this.turnOrder[this.turnCursor];
}

Battle.prototype.getCurrentTurnText = function () {
    var turn = this.getCurrentTurn();
    var text = turn.name + ' ' + turn.action;
    if (turn.action_param) {
        text += ' ' + turn.action_param;
    }
    if (turn.target) {
        text += ' ' + turn.target.name;
    }
    return text;
}

Battle.prototype.getActionTarget = function (action, param) {
    if (BattleActions[action]) {
        if (typeof BattleActions[action].target === 'function') {
            return BattleActions[action].target(this.game, param);
        } else {
            return BattleActions[action].target;
        }
    }
    return null;
}

Battle.prototype.executeTurn = function (battleState) {
    var turn = this.getCurrentTurn();
    if (BattleActions[turn.action]) {
        BattleActions[turn.action].lambda(battleState, turn.target, turn, turn.action_param);
    }
    this.turnCursor++;
}

Battle.prototype.isRoundFinished = function () {
    return (this.turnCursor >= this.turnOrder.length);
}

Battle.prototype.isWon = function () {
    return this.enemies.every(function (enemy) {
        return enemy.isDead();
    });
}

Battle.prototype.isLost = function () {
    return this.pcs.every(function (player) {
        return player.isDead();
    });
}

Battle.prototype.updatePlayerCharacters = function () {
    var pcs = this.pcs;
    var gamedata = this.game.data;
    var i = 0;

    gamedata.party.forEach(function (id) {
        var data = gamedata.members[id] || {};
        data.hp = pcs[i].hp;
        i++;
    })
}

module.exports = Battle;
