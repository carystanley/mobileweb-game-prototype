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
            {id: 'items', text: 'Items'}
        ], this.onBaseMenu.bind(this)),
        items: new TextMenu(basicFont, 72, 16, 80, 20, 4, [
        ], this.onItemsMenu.bind(this)),
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

        case 'items':
            menus['items'].setOptions(this.game.data.getItemsMenu());
            menus['items'].show();
            menus['base'].show();
            break;

        case 'bash':
            this.setChoice('bash');
            break;

        case 'base':
            menus['base'].show();
            break;

        case 'friendly':
            break;

        case 'foe':
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
    this.currentAction = option;
    this.currentActionParam = param;
    var target = this.battle.getActionTarget(option, param);
    if (target) {
        if (target === 'friendly' && this.battle.getOnlyPlayerCharacter()) {
            this.setTarget(this.battle.getOnlyPlayerCharacter());
        } else if (target === 'foe' && this.battle.getOnlyEnemy()) {
            this.setTarget(this.battle.getOnlyEnemy());
        } else {
            this.setState(target);
        }
    } else {
        this.setTarget(null);
    }
}

BattleMenuState.prototype.setTarget = function (target) {
    this.battle.setAction(this.currentAction, this.currentActionParam, target);
    this.battleState.state.switch('menu');
}

BattleMenuState.prototype.onItemsMenu = function (option) {
    this.setChoice('item', option.id);
}

BattleMenuState.prototype.onPSIMenu = function (option) {
    this.setChoice('psi', option.id);
}

BattleMenuState.prototype.onCancel = function () {
    switch (this.state) {
        case 'items':
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

    if (this.state === 'foe' || this.state === 'friendly') {
        var game = this.game;
        var layout = game.layout;
        var lang = game.lang;
        var font = res.basicfont;
        var text = lang.string('BATTLE.CHOOSE');
        font.drawText(ctx, text, layout.center(), 20, 'center');
    }
}

BattleMenuState.prototype.foeEvent = function (type, x, y) {
    if (this.state === 'foe' && type === 'click') {
        var enemies = this.battle.getEnemies();
        var target = null;
        var targetDist = 10000000000;
        enemies.forEach(function(enemy) {
            var dx = Math.abs(enemy.x - x);
            var dy = Math.abs(enemy.y - y);
            if (dx < 32 && dy < 32 && (dx + dy) < targetDist) {
                target = enemy;
                targetDist = dx + dy;
            }
        });
        if (target) {
            this.setTarget(target);
            return true;
        }
    }
    return false;
}

BattleMenuState.prototype.friendlyEvent = function (type, x, y) {
    if (this.state === 'friendly' && type === 'click') {
        var pcs = this.battle.getPlayerCharacters();
        var target = null;
        var targetDist = 10000000000;
        pcs.forEach(function(pc) {
            var dx = Math.abs(pc.x - x);
            var dy = Math.abs(pc.y - y);
            if (dx < 32 && dy < 32 && (dx + dy) < targetDist) {
                target = pc;
                targetDist = dx + dy;
            }
        });
        if (target) {
            this.setTarget(target);
            return true;
        }
    }
    return false;
}


BattleMenuState.prototype.event = function (type, x, y) {
    for (var id in this.menus) {
        if (Object.prototype.hasOwnProperty.call(this.menus, id)) {
            if (this.menus[id].event(type, x, y)) {
                return;
            }
        }
    }

    if (this.foeEvent(type, x, y)) { return; }
    if (this.friendlyEvent(type, x, y)) { return; }

    if (type === 'click') {
        this.onCancel();
    }
}

module.exports = BattleMenuState;
