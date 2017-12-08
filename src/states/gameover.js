var TextMenu = require('../ui/textmenu');
var Dialog = require('../ui/dialog');

function GameOverState(game) {
    this.game = game;
}

GameOverState.prototype.init = function () {
    var basicFont = this.game.resources.basicfont;
    this.menu = new TextMenu(basicFont, 72, 50, 80, 20, 4, [
    ], this.onMenu.bind(this));
    this.dialog = new Dialog(this.game, 'basicfont', 40, 5, 204, 2);
}

GameOverState.prototype.enter = function (shopId) {
    var self = this;
    this.game.sound.bgm('gameover', 'game_over');
    this.menu.setOptions(this.getMenu(shopId));
    self.menu.hide();

    this.dialog.reset();
    this.dialog.show();
    this.dialog.showText('{NAME.hero}, it looks like you got your head handed to you.', function () {
        self.dialog.showText('So, how about giving it another shot?', function () {
            self.menu.show();
        });
    });
}

GameOverState.prototype.getMenu = function (shopId) {
    return [{
        id: 'continue',
        text: 'Yes'
    }, {
        id: 'end',
        text: 'No'
    }];
};

GameOverState.prototype.update = function () {
    this.dialog.update();
}

GameOverState.prototype.onMenu = function (option) {
    var self = this;
    var choice = option.id;
    this.menu.hide();
    if (choice === 'continue') {
        this.dialog.showText('With his strength regained...', function () {
            self.dialog.showText('{NAME.hero} continues on', function () {
                self.dialog.showText('Do your best {NAME.hero}!', function () {
                    self.game.sound.bgm('explore');
                    self.game.state.switch('explore');
                });
            });
        });
    } else if (choice === 'end') {
        this.dialog.showText('It must have all been a bad dream {NAME.hero}', function () {
            self.dialog.showText('See you, {NAME.hero}!');
        });
    }
}

GameOverState.prototype.draw = function (ctx, res) {
    this.menu.draw(ctx, res);
    this.dialog.draw(ctx, res);
}


GameOverState.prototype.event = function (type, x, y) {
    if (this.menu.event(type, x, y)) {
        return;
    }
    this.dialog.event(type, x, y);
}

module.exports = GameOverState;
