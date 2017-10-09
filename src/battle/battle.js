
function Battle(game) {
    this.game = game;
}

Battle.prototype.setup = function (enemies) {
    var game = this.game;
    console.error(enemies);
    return;

    this.addPlayerCharacters(game);
    this.addEnemies(game, enemies);
    this.turnOrder = [this.pcs, this.enemies]
}

Battle.prototype.getPlayerCharacters = function () {
    return this.pcs;
}

Battle.prototype.getEnemies = function () {
    return this.enemies;
}

Battle.prototype.tick = function () {
    // for each PC roll HP toward goal
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
