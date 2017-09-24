var Actor = require('./actor');

function Follower(world, config, followCharacter) {
    Actor.call(this, world, config);
    this.initQueue(followCharacter, 20);
}

Follower.prototype = Object.create(Actor.prototype);

Follower.prototype.initQueue = function(followCharacter, followMax) {
    this.followCharacter = followCharacter;
    this.followQueue = [];
    this.leaderCursor = 0;
    this.followerCursor = 1;
    this.followMax = followMax;
    for (var f = 0; f < followMax; f++) {
        this.followQueue[f] = {frame: 4, x: followCharacter.x, y: followCharacter.y};
    }
};

Follower.prototype.update = function() {
    var character = this.followCharacter;
    this.going = false;
    if (character.going) {
        this.leaderCursor = (this.leaderCursor + 1) % this.followMax;
        this.followerCursor = (this.followerCursor + 1) % this.followMax;

        var store = this.followQueue[this.leaderCursor];
        store.frame = character.frame;
        store.x = character.x;
        store.y = character.y;

        var meta = this.followQueue[this.followerCursor];
        this.x = meta.x;
        this.y = meta.y;
        this.frame = meta.frame;

        this.going = true;
    }
};

module.exports = Follower;
