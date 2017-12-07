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
    this.config = config;
    this.eventId = id;
    this.id = world.mapId + ':' + config.name;
    this.refresh();
}

Event.prototype = Object.create(Actor.prototype);

Event.prototype.loadPage = function (page) {
    var config = this.currentPage = page;
    this.inactive = false;
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

Event.prototype.update = function () {
    // this.step(0, 0);
}

module.exports = Event;
