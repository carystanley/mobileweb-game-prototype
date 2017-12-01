var TextMenu = require('../ui/textmenu');

function WorldMenuState(game) {
    this.game = game;
}

WorldMenuState.prototype.init = function () {
    var basicFont = this.game.resources.basicfont;
    this.menus = {
        base: new TextMenu(basicFont, 16, 16, 40, 20, 4, [
            {id: 'items', text: 'Items'},
            {id: 'status', text: 'Status'}
        ], this.onBaseMenu.bind(this)),
        items: new TextMenu(basicFont, 72, 16, 80, 20, 4, [
        ], this.onItemsMenu.bind(this)),
        members: new TextMenu(basicFont, 72, 16, 40, 20, 4, [
        ], this.onMembersMenu.bind(this)),
        status: new TextMenu(basicFont, 128, 16, 80, 20, 4, [
        ])
    };
}

WorldMenuState.prototype.setState = function (state) {
    this.state = state;
    var menus = this.menus;
    for (var id in menus) {
        if (Object.prototype.hasOwnProperty.call(menus, id)) {
            menus[id].hide();
        }
    }
    switch (state) {
        case 'items':
            menus['items'].setOptions(this.game.data.getItemsMenu());
            menus['items'].show();
            menus['base'].show();
            break;

        case 'status':
            menus['status'].setOptions(this.getStatusMenu());
            menus['members'].setOptions(this.getMembersMenu());
            menus['members'].show();
            menus['status'].show();
            menus['base'].show();
            break;

        case 'base':
            menus['base'].show();
            break;
    }
}

WorldMenuState.prototype.enter = function () {
    this.setState('base');
}

WorldMenuState.prototype.update = function () {

}

WorldMenuState.prototype.onBaseMenu = function (option) {
    this.setState(option.id);
}

WorldMenuState.prototype.onItemsMenu = function (option) {
    console.error(option);
}

WorldMenuState.prototype.onMembersMenu = function (option) {
    this.menus['status'].setOptions(this.getStatusMenu(option.id));
}

WorldMenuState.prototype.getMembersMenu = function () {
    var game = this.game;
    var data = game.data;
    var membersList = [];
    var party = data.party;
    var members = data.members;

    party.forEach(function (id) {
        var member = members[id];
        membersList.push({ id: id, text: member.name });
    });

    return membersList;
};

WorldMenuState.prototype.getStatusMenu = function (memberId) {
    var game = this.game;
    var data = game.data;
    var menuList = [];
    var memberId = memberId || data.party[0];
    var pc = data.members[memberId];

    menuList.push({ id: 'hp', text: 'Health', subtext: '' + pc.hp + '/' + pc.maxhp });
    menuList.push({ id: 'offense', text: 'Offense', subtext: pc.offense });
    menuList.push({ id: 'defense', text: 'Defense', subtext: pc.defense });
    menuList.push({ id: 'guts', text: 'Guts', subtext: pc.guts });
    menuList.push({ id: 'luck', text: 'Luck', subtext: pc.luck });
    menuList.push({ id: 'speed', text: 'Speed', subtext: pc.speed });

    return menuList;
};

WorldMenuState.prototype.onCancel = function () {
    switch (this.state) {
        case 'items':
        case 'status':
            this.setState('base');
            break;

        case 'base':
            this.game.state.switch('explore');
    }
}

WorldMenuState.prototype.draw = function (ctx, res) {
    this.game.state.explore.draw(ctx, res);
    for (var id in this.menus) {
        if (Object.prototype.hasOwnProperty.call(this.menus, id)) {
            this.menus[id].draw(ctx, res);
        }
    }
}


WorldMenuState.prototype.event = function (type, x, y) {
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

module.exports = WorldMenuState;
