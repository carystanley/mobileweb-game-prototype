var TextMenu = require('../ui/textmenu');

var DEBUG_LEAVE = false;

function BattleMenuState(game, battleState, battle) {
    this.game = game;
    this.battleState = battleState;
    this.battle = battle;
}

BattleMenuState.prototype.init = function () {
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
            this.setChoice('bash');
            break;

        case 'base':
            menus['base'].show();
            break;
    }
}

BattleMenuState.prototype.enter = function () {
    this.battleState.dialog.reset();
    if (this.battle.allChoosen()) {
        this.battle.setEnemyActions();
        this.battle.startTurn();
        this.battleState.state.switch('turn');
    } else {
        this.setState('base');
    }
}

BattleMenuState.prototype.update = function () {

}

BattleMenuState.prototype.onBaseMenu = function (option) {
    this.setState(option.id);
}

BattleMenuState.prototype.setChoice = function (option, param) {
    this.battle.setAction(option, param);
    this.battleState.state.switch('menu');
}

BattleMenuState.prototype.onGoodsMenu = function (option) {
    this.setChoice('good', option);
}

BattleMenuState.prototype.onPSIMenu = function (option) {
    this.setChoice('psi', option);
}

BattleMenuState.prototype.onCancel = function () {
    switch (this.state) {
        case 'goods':
        case 'psi':
        case 'bash':
            this.setState('base');
            break;

        case 'base':
            if (DEBUG_LEAVE) {
                this.game.state.switch('explore');
            }
            break;
    }
}

BattleMenuState.prototype.draw = function (ctx, res) {
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
