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
    this.escaped = false;
    this.mode = 'choose';
}

Battle.prototype.addPlayerCharacters = function () {
    var actors = [];
    var game = this.game;

    game.data.party.forEach(function (id) {
        var data = game.data.members[id] || {};
        actors.push(new BattleActor(id, game.lang.string([['NAME', id]]), data));
    })
    this.pcs = actors;
}

Battle.prototype.addEnemies = function (enemies) {
    var enemyActors = [];
    var game = this.game;
    enemies.forEach(function (enemy) {
        var enemyConfig = game.config.enemies[enemy.type] || {};
        enemyActors.push(new BattleActor(enemy.type, game.lang.string([['NAME', enemy.type]]), enemyConfig));
    })
    this.enemies = enemyActors;
}

Battle.prototype.getPlayerCharacters = function () {
    return this.pcs;
}

Battle.prototype.getEnemies = function () {
    return this.enemies;
}

Battle.prototype.getOnlyPlayerCharacter = function () {
    var loner = null;
    var count = 0;
    this.pcs.forEach(function (pc) {
        if (!pc.isDead()) {
            loner = pc;
            count++;
        }
    });
    return (count === 1 ? loner : null);
}

Battle.prototype.getOnlyEnemy = function () {
    var loner = null;
    var count = 0;
    this.enemies.forEach(function (enemy) {
        if (!enemy.isDead()) {
            loner = enemy;
            count++;
        }
    });
    return (count === 1 ? loner : null);
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
            obj.xOffset = Random.int(-8, 8);
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
    this.nextChoose();
    this.mode = 'choose';
}

Battle.prototype.nextChoose = function () {
    while (this.pcCursor < this.pcs.length && this.pcs[this.pcCursor].isDead()) {
        this.pcCursor++;
    }
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
    this.nextChoose();
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
            enemy.target = Random.choose(self.pcs.filter(function (pc) {
                return pc.rollhp > 0;
            }))
        }
    });
}

Battle.prototype.allChoosen = function () {
    return (this.pcCursor >= this.pcs.length);
}

Battle.prototype.getCurrentTurn = function () {
    return this.turnOrder[this.turnCursor];
}

Battle.prototype.getItemName = function (id) {
    return this.game.config.items[id].label;
}

Battle.prototype.getCurrentTurnText = function () {
    var turn = this.getCurrentTurn();
    var lang = this.game.lang;
    return lang.string([
        ['BATTLE', turn.id, turn.action],
        ['BATTLE', turn.action]
    ], {
        attacker: turn.name,
        itemName: (turn.action === 'item') ? this.getItemName(turn.action_param) : null
    });
    /*
    var text = turn.name + ' ' + turn.action;
    if (turn.action_param) {
        text += ' ' + turn.action_param;
    }
    if (turn.target) {
        text += ' ' + turn.target.name;
    }
    return text;
    */
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

Battle.prototype.isTurnDeceased = function () {
    return this.getCurrentTurn().isDead();
}

Battle.prototype.executeTurn = function (battleState) {
    var turn = this.getCurrentTurn();
    if (!turn.isDead() && BattleActions[turn.action]) {
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

Battle.prototype.isEscaped = function () {
    return this.escaped;
}

Battle.prototype.updatePlayerCharacters = function () {
    var pcs = this.pcs;
    var gamedata = this.game.data;
    var xp = 0;
    var cash = 0;
    var i = 0;

    this.enemies.forEach(function (enemy) {
        xp += enemy.xp;
        cash += enemy.cash;
    });

    gamedata.party.forEach(function (id) {
        var data = gamedata.members[id] || {};
        data.hp = pcs[i].hp;
        if (data.hp > 0) {
            data.xp += xp;
            data.levelXp += xp;
        }
        i++;
    });

    gamedata.setValue('reserve', gamedata.value('reserve') + cash);
    return xp;
}

module.exports = Battle;
