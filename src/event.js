function Event(game, id, config, pages) {
    this.game = game;
    this.pages = pages;
    this.x = config.cx;
    this.y = config.cy;
    this.eventId = id;
    this.loadPage(pages[0]);
    console.error(this);
}

Event.prototype.loadPage = function (page) {
    var config = this.currentPage = page;
    this.sprite = config.sprite;
    this.width = config.width || 16;
    this.height = config.height || 8;
    this.frame = config.frame || 4;
    this.commands = config.commands;
}

Event.prototype.fire = function (event) {
    if (this.commands) {
        this.game.state.switch('cutscene', this.commands);
    }
}

module.exports = Event;
