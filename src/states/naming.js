var GridMenu = require('../ui/gridmenu');

function NamingState(game) {
    this.game = game;
}

NamingState.prototype.init = function () {
    this.keyboard = new GridMenu('basicfont', 40, 40, 14, 16, 2, 2, 4, [
    ], this.onKeyboard.bind(this));
}

NamingState.prototype.enter = function () {
    this.keyboard.setOptions(this.getKeyboard());
    this.keyboard.show();
}

NamingState.prototype.getKeyboard = function () {
    return ['A', 'B', 'C', 'D']
};

NamingState.prototype.onKeyboard = function (option) {
    console.error(option);
}

NamingState.prototype.update = function () {

}

NamingState.prototype.draw = function (ctx, res) {
    this.keyboard.draw(ctx, res);
}

NamingState.prototype.event = function (type, x, y) {
    if (this.keyboard.event(type, x, y)) {
        return;
    }
}

module.exports = NamingState;
