var Viewport = require('../viewport');
var World = require('../world');
var TextMenu = require('../textmenu');
var AABB = require('../aabb');

function WorldState(game) {
    this.game = game;
    this.viewport = new Viewport(game.ctx.canvas.width, game.ctx.canvas.height);
    this.world = new World(this.game);
    var basicFont = game.resources.basicfont;
    this.menuButton = new TextMenu(basicFont, 250, 135, 29, 20, 4, [
        {id: 'menu', text: 'Menu'}
    ], this.openMenu.bind(this));
    this.menuButton.show();
}

WorldState.prototype.update = function () {
    var world = this.world;
    var player = world.player;
    player.update();
    world.update();
    this.viewport.update(player, world);
}

WorldState.prototype.draw = function (ctx, res) {
    this.world.draw(ctx, this.viewport, res);
    if (this.game.state.currentState === this) {
        this.menuButton.draw(ctx);
    }
}

WorldState.prototype.onMouse = function (x, y) {
    var v = this.viewport;
    var wx = x + v.x;
    var wy = y + v.y;

    var event;
    var found = null;
    var player = this.world.player;
    var events = this.world.events;

    for (var i = 0; i < events.length; i++) {
        event = events[i];
        if (AABB.pointInRect(wx, wy, event.x, event.y-24, 16, 24)) {
            found = event;
        }
    }
    if (found) {
        player.goalX = found.x + found.width/2 - 8;
        player.goalY = found.y + found.height/2 - 4;
        player.goalEvent = found;
    } else {
        player.goalX = wx - 8;
        player.goalY = wy - 4;
        player.goalEvent = null;
    }
    player.goalRadius = 20;
    player.going = true;
    player.blockedCount = 0;
}

WorldState.prototype.event = function (type, x, y) {
    if (!this.menuButton.event(type, x, y)) {
        switch (type) {
            case 'click':
            case 'move':
                this.onMouse(x, y);
        }
    }
}

WorldState.prototype.openMenu = function () {
    this.game.state.switch('worldmenu');
}

module.exports = WorldState;
