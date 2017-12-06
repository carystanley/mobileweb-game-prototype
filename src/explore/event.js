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
    var gameData = this.game.data;
    var self = this;
    for (var i = this.pages.length-1; i >= 0; i--) {
        var page = pages[i];
        if (!page.cond || scopedEval(page.cond, gameData, {
            flag: function (id) {
                return gameData.getEventFlag(self.id, id);
            }
        })) {
            this.loadPage(page);
            return;
        }
    }
    this.inactive = true;
}

Event.prototype.triggerEvent = function (type) {
    if (type === this.trigger || this.trigger === 'contact') {
        if (this.commands) {
            var config = this.config;
            this.game.state.switch('cutscene', {
                event: this,
                params: Object.assign({
                    x: config.cx,
                    y: config.cy,
                    type: config.type
                }, this.config.properties),
                commands: this.commands
            });
        }
    }
}

Event.prototype.update = function () {
    // this.step(0, 0);
}

module.exports = Event;
