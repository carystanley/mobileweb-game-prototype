function WorldMenuState(game) {
    this.game = game;
    var basicFont = game.resources.basicfont;
    this.menus = {
        base: new TextMenu(basicFont, 16, 16, 40, 4, [
            {id: 'goods', text: 'Goods'},
            {id: 'equip', text: 'Equip'},
            {id: 'status', text: 'Status'}
        ], this.onBaseMenu.bind(this)),
        goods: new TextMenu(basicFont, 72, 16, 80, 4, [
            {id: 'sneaker', text: 'Old Sneaker'},
            {id: 'stungun', text: 'Stun Gun'},
            {id: 'sock', text: 'Sock'}
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
            menus['goods'].show();
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
    switch (option.id) {
        case 'goods':
            this.setState('goods');
            break;
    }
}

WorldMenuState.prototype.onGoodsMenu = function (option) {

}

WorldMenuState.prototype.onCancel = function () {
    switch (this.state) {
        case 'goods':
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
    var hit = false;
    for (var id in this.menus) {
        hit = hit || this.menus[id].event(type, x, y);
    }
    if (!hit) {
        this.onCancel();
    }
}
