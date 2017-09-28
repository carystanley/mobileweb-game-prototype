var Dialog = require('../ui/dialog');
var Matte = require('../ui/matte');
var Interpreter = require('../utils/interpreter');
var Commands = require('../commands');

function CutSceneState(game) {
    this.game = game;
}

CutSceneState.prototype.init = function () {
    this.dialog = new Dialog(this.game.resources.basicfont, 40, 100, 204, 3);
    this.matte = new Matte(this.game);
    this.interpreter = new Interpreter(Commands);
    this.done = this.done.bind(this);
}

CutSceneState.prototype.enter = function (commands) {
    this.dialog.reset();
    this.interpreter.run(commands, this, this.done);
}

CutSceneState.prototype.update = function () {
    this.dialog.update();
    this.matte.update();
}

CutSceneState.prototype.draw = function (ctx, res) {
    this.game.state.explore.draw(ctx, res);
    this.matte.draw(ctx);
    this.dialog.draw(ctx);
}

CutSceneState.prototype.done = function () {
    this.game.state.switch('explore');
}


CutSceneState.prototype.event = function (type, x, y) {
    this.dialog.event(type, x, y);
}

module.exports = CutSceneState;
