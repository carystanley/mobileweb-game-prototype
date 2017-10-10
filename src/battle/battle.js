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
    this.cursor = 0;
}

Battle.prototype.addPlayerCharacters = function () {
    var pcActors = [];
    var game = this.game;

    game.data.party.forEach(function (id) {
        var pcData = game.data.members[id] || {};
        pcActors.push({
            sprite: pcData.sprite,
            name: pcData.name,
            hp: 123,
            rollhp: 123,
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
            hp: enemyConfig.hp
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
    var cursor = this.cursor;
    this.pcs.forEach(function (pc, idx) {
        pc.rollhp = transition(pc.rollhp, pc.hp, ROLL_DELTA);

        if (cursor === idx) {
            pc.offset = transition(pc.offset, PC_OFFSET_MAX, PC_OFFSET_DELTA);
        } else {
            pc.offset = transition(pc.offset, PC_OFFSET_MIN, PC_OFFSET_DELTA);
        }
    });
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
