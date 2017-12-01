var Random = require('../utils/random');

// http://walkthrough.starmen.net/earthbound/enemylist_full.php

function BattleActor(settings) {
    Object.assign(this, settings);
    this.type = settings.type;
    this.hp = settings.hp;
    this.maxhp = settings.maxhp;
    this.rollhp = settings.rollhp;
    this.offense = settings.offense;
    this.defense = settings.defense;
    this.guts = settings.guts;
    this.luck = settings.luck;
    this.speed = settings.speed;
    this.missRate = settings.missRate;
    this.offset = 0;
    this.config = settings.config;
}

BattleActor.prototype.isDead = function () {
    return this.hp <= 0;
}

BattleActor.prototype.damage = function (amount) {
    var delta = Math.min(this.hp, amount);
    this.hp -= delta;
    return delta;
}

BattleActor.prototype.heal = function (amount) {
    var delta = Math.min(this.maxhp - this.hp, amount);
    this.hp += delta;
    return delta;
}

BattleActor.prototype.getAction = function () {
    var actions = this.config.actions;
    var strategy = this.config.strategy;

    switch (strategy) {
        case 'inorder':
            var actionCursor = this.actionCursor || 0;
            this.actionCursor = (actionCursor + 1) % actions.length;
            return actions[actionCursor];

        case 'random':
        default:
            return Random.choose(actions);
    }
}

module.exports = BattleActor;
