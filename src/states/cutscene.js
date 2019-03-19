var Dialog = require('../ui/dialog');
var Matte = require('../ui/matte');
var Interpreter = require('../utils/interpreter');
var Commands = require('../commands');

function CutSceneState(game) {
    this.game = game;
}

CutSceneState.prototype.init = function () {
    this.dialog = new Dialog(this.game, 'basicfont', 40, 100, 204, 3);
    this.matte = new Matte(this.game);
    this.interpreter = new Interpreter(Commands);
    this.done = this.done.bind(this);
}

CutSceneState.prototype.enter = function (data) {
    this.dialog.reset();
    this.matte.reset();
    this.params = data.params;
    this.eventObj = data.event;
    this.interpreter.run(data.commands, this, this.done);
}

CutSceneState.prototype.update = function () {
    this.dialog.update();
    this.matte.update();
    this.game.state.explore.cutsceneUpdate();
}

CutSceneState.prototype.draw = function (ctx, res) {
    this.game.state.explore.draw(ctx, res);
    this.matte.draw(ctx, res);
    this.dialog.draw(ctx, res);
}

CutSceneState.prototype.done = function () {
    this.game.state.switch('explore');
}


CutSceneState.prototype.event = function (type, x, y) {
    this.dialog.event(type, x, y);
}

module.exports = CutSceneState;
