
// http://walkthrough.starmen.net/earthbound/enemylist_full.php

function BattleActor(settings) {
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
}

BattleActor.prototype.isDead = function () {

}

module.exports = BattleActor;
