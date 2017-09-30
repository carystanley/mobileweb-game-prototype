
function Battle(game, enemies) {
    this.game = game;
    this.addPlayerCharacters(game);
    this.addEnemies(game, enemies);
    this.turnOrder = [this.pcs, this.enemies];
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

module.exports = Battle;
