function WorldMenuState(game) {
    this.game = game;
    var basicFont = game.resources.basicfont;
    this.menus = {
        base: new TextMenu(basicFont, 16, 16, 40, 20, 4, [
            {id: 'goods', text: 'Goods'},
            {id: 'equip', text: 'Equip'},
            {id: 'status', text: 'Status'}
        ], this.onBaseMenu.bind(this)),
        goods: new TextMenu(basicFont, 72, 16, 80, 20, 4, [
        ], this.onGoodsMenu.bind(this))
    };
}

WorldMenuState.prototype.setState = function (state) {
    this.state = state;
    var menus = this.menus;
    for (var id in menus) {
        menus[id].hide();
    }
    switch (state) {
        case 'goods':
            menus['goods'].setOptions(this.game.player.getGoodsMenu());
            menus['goods'].show();
            menus['base'].show();
            break;

        case 'equip':
        case 'status':
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

WorldMenuState.prototype.onGoodsMenu = function (option) {

}

WorldMenuState.prototype.onCancel = function () {
    switch (this.state) {
        case 'goods':
        case 'equip':
        case 'status':
            this.setState('base');
            break;

        case 'base':
            this.game.state.switch('world');
    }
}

WorldMenuState.prototype.draw = function (ctx, res) {
    var worldState = this.game.state.world;
    worldState.draw(ctx, res);
    for (var id in this.menus) {
        this.menus[id].draw(ctx, res);
    }
}


WorldMenuState.prototype.event = function (type, x, y) {
    for (var id in this.menus) {
        if (this.menus[id].event(type, x, y)) {
            return;
        }
    }
    if (type === 'click') {
        this.onCancel();
    }
}
