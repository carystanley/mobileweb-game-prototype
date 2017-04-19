function WorldState(ctx) {
    this.dialog = new Dialog(ctx, 40, 100, 180, 3);
    this.viewport = new Viewport(ctx.canvas.width, ctx.canvas.height);
    this.world = new World(this);
}

WorldState.prototype.update = function () {
    var world = this.world;
    var player = world.player;
    var dialog = this.dialog;
    dialog.update();
    if (!dialog.visible) {
        player.move();
        this.viewport.update(player, world);
    }
}

WorldState.prototype.draw = function (ctx) {
    this.world.draw(ctx, this.viewport);
    this.dialog.draw(ctx);
}

WorldState.prototype.onMouse = function (x, y) {
    if (this.dialog.visible) {
        this.dialog.action();
        return;
    }
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

WorldState.prototype.onTap = function (x, y) {
    this.onMouse(x, y);
}

WorldState.prototype.onMove = function (x, y) {
    this.onMouse(x, y);
}
