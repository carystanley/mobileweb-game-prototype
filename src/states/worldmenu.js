function WorldMenuState(game) {
    this.game = game;
    var basicFont = game.resources.basicfont;
    this.menus = {
        base: new TextMenu(basicFont, 16, 16, 40, [
            {id: 'goods', text: 'Goods'},
            {id: 'equip', text: 'Equip'},
            {id: 'status', text: 'Status'}
        ])
    };
    this.menus.base.show();
}

WorldMenuState.prototype.enter = function () {

}

WorldMenuState.prototype.update = function () {

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
        this.menus[id].event(type, x, y);
    }
}
