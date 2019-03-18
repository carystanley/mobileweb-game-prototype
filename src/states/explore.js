var Viewport = require('../utils/viewport');
var World = require('../explore/world');
var TextMenu = require('../ui/textmenu');
var AABB = require('../utils/aabb');
var Interpreter = require('../utils/interpreter');
var Commands = require('../commands');

function WorldState(game) {
    this.game = game;
}

WorldState.prototype.init = function () {
    this.viewport = new Viewport(this.game.ctx.canvas.width, this.game.ctx.canvas.height);
    this.world = new World(this.game);
    this.world.loadMap('debug', 'start');
    this.menuButton = new TextMenu('basicfont', 250, 135, 29, 20, 4, [
        {id: 'menu', text: 'Menu'}
    ], this.openMenu.bind(this));
    this.menuButton.show();
    this.interpreter = new Interpreter(Commands);
    // this.game.sound.bgm('explore', 'school_happy');
}

WorldState.prototype.update = function () {
    var world = this.world;
    var player = world.player;
    world.update();
    this.viewport.update(player, world);
}

WorldState.prototype.draw = function (ctx, res) {
    this.world.draw(ctx, this.viewport, res);
    if (this.game.state.currentState === this) {
        this.menuButton.draw(ctx, res);
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
        if (AABB.pointInRect(wx, wy, event.x - 8, event.y - 20, 16, 24)) {
            found = event;
        }
    }
    if (found) {
        player.goTo(Math.floor(found.x), Math.floor(found.y), found);
    } else {
        player.goTo(wx, wy, null);
    }
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
    this.game.state.switch('exploreMenu');
}

WorldState.prototype.mapTransport = function (mapId, locationId) {
    this.world.loadMap(mapId, locationId);
    this.update();
}

WorldState.prototype.refreshParty = function () {
    this.world.refreshParty();
}

WorldState.prototype.execute = function (event, params, commands) {
    this.params = params;
    this.eventObj = event;
    this.interpreter.run(commands, this, function() {});
}

module.exports = WorldState;
