
function SoundManager(game) {
    this.game = game;
    this.channels = {};
    this.music = null;
}

SoundManager.prototype.se = function (id) {
    this.game.resources.se[id].play();
}

SoundManager.prototype.me = function (id) {
    this.bgm('effect', id);
}

SoundManager.prototype.bgm = function (channel, id) {
    var bgm = this.game.resources.bgm;
    if (id) {
        this.channels[channel] = id;
    }
    if (this.channels[channel] !== this.music) {
        if (this.music) {
            bgm[this.music].stop();
        }
        this.music = this.channels[channel];
        bgm[this.music].play();
    }
}

module.exports = SoundManager;
