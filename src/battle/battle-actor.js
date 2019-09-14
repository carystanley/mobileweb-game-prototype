var Random = require('../utils/random');

// http://walkthrough.starmen.net/earthbound/enemylist_full.php
// https://datacrystal.romhacking.net/wiki/EarthBound:Enemy_Configuration_Table
// https://forum.starmen.net/forum/Games/Mother2/34866/page/2#post734858

function BattleActor(id, name, settings) {
    this.id = id;
    this.name = name;
    Object.assign(this, settings);
    this.type = settings.type;
    this.hp = settings.hp;
    this.maxhp = settings.maxhp || settings.hp;
    this.rollhp = settings.hp;
    this.offense = settings.offense;
    this.defense = settings.defense;
    this.guts = settings.guts;
    this.luck = settings.luck;
    this.speed = settings.speed;
    this.missRate = settings.missRate;
    this.sprite = settings.battlesprite !== undefined ? settings.battlesprite : settings.sprite;
    this.actions = settings.actions;
    this.stategy = settings.strategy;
    this.offset = 0;
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
    var actions = this.actions;
    var strategy = this.strategy;

    switch (strategy) {
        case 'inorder':
            var actionCursor = this.actionCursor || 0;
            this.actionCursor = (actionCursor + 1) % actions.length;
            return actions[actionCursor];

        case 'staggered':
            var actionCursor = this.actionCursor || 0;
            this.actionCursor++;
            var actionCount = actions.length;
            var halfCount = Math.floor(actionCount / 2);

            if (actionCount % 2 === 0) {
                return actions[Random.int(0, halfCount - 1)];
            } else {
                return actions[Random.int(halfCount, actionCount - 1)];
            }

        case 'random':
        default:
            return Random.choose(actions);
    }
}

module.exports = BattleActor;
