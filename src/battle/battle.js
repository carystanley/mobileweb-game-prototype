var Helpers = require('../utils/helpers');
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
    var pcActors = [];
    var game = this.game;

    game.data.party.forEach(function (id) {
        var pcData = game.data.members[id] || {};
        pcActors.push({
            sprite: pcData.sprite,
            name: pcData.name,
            hp: 10,
            rollhp: 10,
            offset: 0
        })
    })
    this.pcs = pcActors;
}

Battle.prototype.addEnemies = function (enemies) {
    var enemyActors = [];
    var game = this.game;
    enemies.forEach(function (enemy) {
        var enemyConfig = game.config.enemies[enemy.type] || {};
        enemyActors.push({
            hp: enemyConfig.hp,
            sprite: enemyConfig.battlesprite
        })
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
    this.pcs.forEach(function (pc) {
        pc.rollhp = transition(pc.rollhp, pc.hp, ROLL_DELTA);
    });

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
    })
    this.pcCursor = 0;
    this.mode = 'choose';
}

Battle.prototype.startTurn = function () {
    this.turnCursor = 0;
    this.mode = 'turn';
}

Battle.prototype.setAction = function (action, param) {
    this.pcs[this.pcCursor].action = action;
    this.pcs[this.pcCursor].action_param = param;
    this.pcCursor++;
}

Battle.prototype.setEnemyActions = function () {
    this.enemies.forEach(function (enemy, idx) {
        enemy.action = 'bash';
        enemy.action_param = undefined;
    });
}

Battle.prototype.allChoosen = function () {
    return (this.pcCursor >= this.pcs.length);
}

Battle.prototype.getCurrentTurn = function () {
    return this.turnOrder[this.turnCursor];
}

Battle.prototype.executeTurn = function () {
    this.turnCursor++;
}

Battle.prototype.isRoundFinished = function () {
    return (this.turnCursor >= this.turnOrder.length);
}

Battle.prototype.isWon = function () {
    this.enemies.every(function (enemy) {
        return enemy.isDead();
    });
}

Battle.prototype.isLost = function () {
    this.pcs.every(function (player) {
        return player.isDead();
    });
}


module.exports = Battle;
