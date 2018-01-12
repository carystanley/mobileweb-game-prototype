var TextMenu = require('../ui/textmenu');

function TitleState(game) {
    this.game = game;
}

TitleState.prototype.init = function () {
    this.menu = new TextMenu('basicfont', 120, 90, 80, 20, 4, [
    ], this.onMenu.bind(this));
}

TitleState.prototype.enter = function () {
    this.menu.setOptions(this.getMenu());
    this.menu.show();
}

TitleState.prototype.getMenu = function () {
    var canContinue = true;
    var menu = [{
        id: 'new',
        text: 'New Game'
    }];
    if (canContinue) {
        menu.push({
            id: 'continue',
            text: 'Continue'
        });
    }
    return menu;
};

TitleState.prototype.onMenu = function (option) {
    var state = this.game.state;
    var choice = option.id;

    if (choice === 'new') {
        state.switch('explore');
    } else if (choice === 'continue') {
        state.switch('explore');
    }
}

TitleState.prototype.update = function () {

}

TitleState.prototype.draw = function (ctx, res) {
    this.menu.draw(ctx, res);
}

TitleState.prototype.event = function (type, x, y) {
    if (this.menu.event(type, x, y)) {
        return;
    }
}

module.exports = TitleState;
