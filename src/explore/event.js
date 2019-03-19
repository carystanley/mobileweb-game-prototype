var scopedEval = require('../utils/scoped-eval');
var Actor = require('./actor');

function Event(world, id, config, pages) {
    Actor.call(this, world, config);
    this.game = world.game;
    this.pages = pages;
    this.x = config.cx;
    this.y = config.cy;
    if (!config.ellipse) {
        this.width = config.width;
        this.height = config.height;
    }
    this.inactive = false;
    this.config = config;
    this.eventId = id;
    this.id = world.mapId + ':' + config.name;
    this.refresh();
}

Event.orphan = function (game, eventId) {
    var eventConfig = game.config.events[eventId];
    return new Event({ game: game }, '', {}, eventConfig);
}

Event.prototype = Object.create(Actor.prototype);

Event.prototype.loadPage = function (page) {
    var config = this.currentPage = page;
    this.sprite = config.sprite;
    this.setFacing(config.facing || 'down');
    // this.width = config.width || 14;
    // this.height = config.height || 8;
    this.commands = config.commands;
    this.trigger = config.trigger || 'action';
}

Event.prototype.refresh = function () {
    var pages = this.pages;
    for (var i = this.pages.length-1; i >= 0; i--) {
        var page = pages[i];
        if (!page.cond || this.eval(page.cond)) {
            this.loadPage(page);
            return;
        }
    }
    this.inactive = true;
}

Event.prototype.eval = function (statement) {
    var self = this;
    var gameData = this.game.data;
    return scopedEval(statement, gameData, {
        flag: function (id) {
            return gameData.getEventFlag(self.id, id);
        }
    })
}

Event.prototype.triggerEvent = function (type) {
    if (type === this.trigger || this.trigger === 'contact') {
        if (this.commands) {
            var config = this.config;
            var params = Object.assign({
                x: config.cx,
                y: config.cy,
                type: config.type
            }, this.config.properties);
            var commands = this.commands;

            if (type === 'load') {
                this.game.state.explore.execute(this, params, commands);
                this.inactive = true;
            } else {
                this.game.state.switch('cutscene', {
                    event: this,
                    params: params,
                    commands: commands
                });
            }
        }
    }
}

Event.prototype.goTo = function (x, y, done) {
    this.goalX = x;
    this.goalY = y;
    this.goalDone = done;
    this.moving = true;
    this.blockedCount = 0;
}

Event.prototype.update = function () {
}

Event.prototype.cutsceneUpdate = function () {
    this.velocityX = 0;
    this.velocityY = 0;

    if (this.moving && (this.prevX === this.x && this.prevY === this.y)) {
        this.blockedCount++;
    }

    if (this.moving) {
        if ((this.goalX === this.x && this.goalY === this.y) || this.blockedCount > 30) {
            this.moving = false;
            if (this.goalDone) {
                var done = this.goalDone;
                this.goalDone = null;
                done();
            }
        } else {
            if (this.goalX < this.x) { // Left
                this.velocityX = -1;
            }
            if (this.goalY < this.y) { // Up
                this.velocityY = -1;
            }
            if (this.goalX > this.x) { // Right
                this.velocityX = 1;
            }
            if (this.goalY > this.y) { // Down
                this.velocityY = 1;
            }
            this.step(this.velocityX, this.velocityY);
        }
    }
}

module.exports = Event;
