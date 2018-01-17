var GridMenu = require('../ui/gridmenu');

function NamingState(game) {
    this.game = game;
}

NamingState.prototype.init = function () {
    this.keyboard = new GridMenu('basicfont', 40, 40, 14, 16, 8, 5, 4, [
    ], this.onKeyboard.bind(this));
}

NamingState.prototype.enter = function () {
    this.game.tracking.trackPage('/game/naming');
    this.keyboard.setOptions(this.getKeyboard());
    this.keyboard.show();
}

NamingState.prototype.getKeyboard = function () {
    var i;
    var keyboard = [];
    for (i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
        keyboard.push(String.fromCharCode(i));
    }
    for (i = '0'.charCodeAt(0); i <= '9'.charCodeAt(0); i++) {
        keyboard.push(String.fromCharCode(i));
    }
    return keyboard;
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
