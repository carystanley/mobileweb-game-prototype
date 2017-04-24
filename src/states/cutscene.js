function CutSceneState(game) {
    this.game = game;
    this.dialog = new Dialog(game.resources.basicfont, 40, 100, 180, 3);
}

CutSceneState.prototype.enter = function (text) {
    this.dialog.showText(text);
}

CutSceneState.prototype.update = function () {
    this.dialog.update();
}

CutSceneState.prototype.draw = function (ctx, res) {
    var worldState = this.game.state.world;
    worldState.draw(ctx, res);
    this.dialog.draw(ctx);
}


CutSceneState.prototype.event = function (type, x, y) {
    if (type === 'click') {
        if (this.dialog.visible) {
            if (!this.dialog.action()) {
                this.game.state.switch('world');
            }
        }
    }
}
