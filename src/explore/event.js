var Actor = require('./actor');

function Event(world, id, config, pages) {
    Actor.call(this, world, config);
    this.game = world.game;
    this.pages = pages;
    this.x = config.cx;
    this.y = config.cy;
    this.eventId = id;
    this.loadPage(pages[0]);
}

Event.prototype = Object.create(Actor.prototype);

Event.prototype.loadPage = function (page) {
    var config = this.currentPage = page;
    this.sprite = config.sprite;
    this.width = config.width || 14;
    this.height = config.height || 8;
    this.commands = config.commands;
}

Event.prototype.trigger = function (event) {
    if (this.commands) {
        this.game.state.switch('cutscene', this.commands);
    }
}

Event.prototype.update = function () {

}

module.exports = Event;
