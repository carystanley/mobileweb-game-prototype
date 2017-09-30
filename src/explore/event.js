var scopedEval = require('../utils/scoped-eval');
var Actor = require('./actor');

function Event(world, id, config, pages) {
    Actor.call(this, world, config);
    this.game = world.game;
    this.pages = pages;
    this.x = config.cx;
    this.y = config.cy;
    this.eventId = id;
    this.refresh();
}

Event.prototype = Object.create(Actor.prototype);

Event.prototype.loadPage = function (page) {
    var config = this.currentPage = page;
    this.inactive = false;
    this.sprite = config.sprite;
    this.width = config.width || 14;
    this.height = config.height || 8;
    this.commands = config.commands;
}

Event.prototype.refresh = function () {
    var pages = this.pages;
    for (var i = this.pages.length-1; i >= 0; i--) {
        var page = pages[i];
        if (!page.cond || scopedEval(page.cond, this.game.data, {})) {
            this.loadPage(page);
            return;
        }
    }
    this.inactive = true;
}

Event.prototype.trigger = function (event) {
    if (this.commands) {
        this.game.state.switch('cutscene', this.commands);
    }
}

Event.prototype.update = function () {

}

module.exports = Event;
