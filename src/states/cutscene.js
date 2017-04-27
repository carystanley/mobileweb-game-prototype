function CutSceneState(game) {
    this.game = game;
    this.dialog = new Dialog(game.resources.basicfont, 40, 100, 204, 3);
    this.interpreter = new Interpreter(Commands);
    this.done = this.done.bind(this);
}

CutSceneState.prototype.enter = function (eventId) {
    this.dialog.reset();
    var commands = this.game.config.events[eventId];
    this.interpreter.run(commands, this, this.done);
}

CutSceneState.prototype.update = function () {
    this.dialog.update();
}

CutSceneState.prototype.draw = function (ctx, res) {
    var worldState = this.game.state.world;
    worldState.draw(ctx, res);
    this.dialog.draw(ctx);
}

CutSceneState.prototype.done = function () {
    this.game.state.switch('world');
}


CutSceneState.prototype.event = function (type, x, y) {
    this.dialog.event(type, x, y);
}
