
function Battle(game) {
    this.game = game;
}

Battle.prototype.setup = function (enemies) {
    this.addPlayerCharacters();
    this.addEnemies(enemies);
    this.turnOrder = [].concat(this.pcs, this.enemies);
}

Battle.prototype.addPlayerCharacters = function () {
    var pcActors = [];
    var game = this.game;

    game.data.party.forEach(function (id) {
        var pcData = game.data.members[id] || {};
        pcActors.push({
            sprite: pcData.sprite,
            hp: 123
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
    this.pcs.forEach(function (pc) {
        if (pc.hp > 0) {
            pc.hp -= 1/16;
        } else {
            pc.hp = 0;
        }
    })
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
