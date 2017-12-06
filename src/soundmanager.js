
function SoundManager(game) {
    this.game = game;
    this.channels = {};
    this.activeMusic = null;
}

SoundManager.prototype.se = function (id) {
    this.game.resources.se[id].play();
}

SoundManager.prototype.me = function (id) {
    // this.bgm('effect', id);
    this.game.resources.me[id].play();
}

SoundManager.prototype.bgm = function (channel, id) {
    var bgm = this.game.resources.bgm;
    if (id) {
        this.channels[channel] = id;
    }
    if (this.channels[channel] !== this.activeMusic) {
        if (this.activeMusic) {
            bgm[this.activeMusic].stop();
        }
        this.activeMusic = this.channels[channel];
        if (bgm[this.activeMusic]) {
            bgm[this.activeMusic].play();
        }
    }
}

module.exports = SoundManager;
