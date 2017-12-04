
function SoundManager(game) {
    this.game = game;
}

SoundManager.prototype.se = function (id) {
    this.game.resources.se[id].play();
}

SoundManager.prototype.me = function (id) {
    this.game.resources.me[id].play();
}

SoundManager.prototype.bgm = function (id) {
    this.game.resources.bgm[id].play();
}

module.exports = SoundManager;
