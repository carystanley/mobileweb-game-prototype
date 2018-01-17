var TextMenu = require('../ui/textmenu');
var Dialog = require('../ui/dialog');

function GameOverState(game) {
    this.game = game;
}

GameOverState.prototype.init = function () {
    this.menu = new TextMenu('basicfont', 72, 50, 80, 20, 4, [
    ], this.onMenu.bind(this));
    this.dialog = new Dialog(this.game, 'basicfont', 40, 5, 204, 2);
}

GameOverState.prototype.enter = function (shopId) {
    this.game.tracking.trackPage('/game/gameover');
    this.game.tracking.trackEvent('game', 'over');
    var self = this;
    this.game.sound.bgm('gameover', 'game_over');
    this.menu.setOptions(this.getMenu(shopId));
    self.menu.hide();

    this.dialog.reset();
    this.dialog.show();
    this.dialog.lang('GAMEOVER.OUCH', {}, function () {
        self.dialog.lang('GAMEOVER.PROMPT', {}, function () {
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
        this.dialog.lang('GAMEOVER.CONTINUE1', {}, function () {
            self.dialog.lang('GAMEOVER.CONTINUE2', {}, function () {
                self.dialog.lang('GAMEOVER.CONTINUE3', {}, function () {
                    self.game.sound.bgm('explore');
                    self.game.state.switch('explore');
                });
            });
        });
    } else if (choice === 'end') {
        this.dialog.lang('GAMEOVER.END1', {}, function () {
            self.dialog.lang('GAMEOVER.END2', {});
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
