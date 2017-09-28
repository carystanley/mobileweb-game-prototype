var TextMenu = require('../ui/textmenu');

function BattleMenuState(game) {
    this.game = game;
}

BattleMenuState.prototype.init = function () {
    if (!this.game.state.battlebackground.inited) {
        this.game.state.battlebackground.init();
        this.game.state.battlebackground.inited = true;
    }
    var basicFont = this.game.resources.basicfont;
    this.menus = {
        base: new TextMenu(basicFont, 16, 16, 40, 20, 4, [
            {id: 'bash', text: 'Bash'},
            {id: 'psi', text: 'PSI'},
            {id: 'goods', text: 'Goods'}
        ], this.onBaseMenu.bind(this)),
        goods: new TextMenu(basicFont, 72, 16, 80, 20, 4, [
        ], this.onGoodsMenu.bind(this)),
        psi: new TextMenu(basicFont, 72, 16, 80, 20, 4, [
            {id: 'love', text: 'Love'},
            {id: 'freeze', text: 'Freeze'},
            {id: 'fire', text: 'Fire'}
        ], this.onPSIMenu.bind(this))
    };
}

BattleMenuState.prototype.setState = function (state) {
    this.state = state;
    var menus = this.menus;
    for (var id in menus) {
        if (Object.prototype.hasOwnProperty.call(this.menus, id)) {
            menus[id].hide();
        }
    }
    switch (state) {
        case 'psi':
            menus['psi'].show();
            menus['base'].show();
            break;

        case 'goods':
            menus['goods'].setOptions(this.game.data.getGoodsMenu());
            menus['goods'].show();
            menus['base'].show();
            break;

        case 'bash':
            menus['base'].show();
            break;

        case 'base':
            menus['base'].show();
            break;
    }
}

BattleMenuState.prototype.enter = function () {
    this.setState('base');
}

BattleMenuState.prototype.update = function () {
    this.game.state.battlebackground.update();
}

BattleMenuState.prototype.onBaseMenu = function (option) {
    this.setState(option.id);
}

BattleMenuState.prototype.onGoodsMenu = function (option) {

}

BattleMenuState.prototype.onPSIMenu = function (option) {

}

BattleMenuState.prototype.onCancel = function () {
    switch (this.state) {
        case 'goods':
        case 'psi':
        case 'bash':
            this.setState('base');
            break;

        case 'base':
            this.game.state.switch('explore');
    }
}

BattleMenuState.prototype.draw = function (ctx, res) {
    this.game.state.battlebackground.draw(ctx, res);
    ctx.drawImage(
        res.battlesprites,
        0, 0, 64, 64,
        ((this.game.ctx.canvas.width-64)/2) | 0,
        ((this.game.ctx.canvas.height-64)/2) | 0,
        64, 64
    );
    for (var id in this.menus) {
        if (Object.prototype.hasOwnProperty.call(this.menus, id)) {
            this.menus[id].draw(ctx, res);
        }
    }
}


BattleMenuState.prototype.event = function (type, x, y) {
    for (var id in this.menus) {
        if (Object.prototype.hasOwnProperty.call(this.menus, id)) {
            if (this.menus[id].event(type, x, y)) {
                return;
            }
        }
    }
    if (type === 'click') {
        this.onCancel();
    }
}

module.exports = BattleMenuState;
