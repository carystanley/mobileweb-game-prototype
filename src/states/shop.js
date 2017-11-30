var TextMenu = require('../ui/textmenu');

function ShopState(game) {
    this.game = game;
}

ShopState.prototype.init = function () {
    var basicFont = this.game.resources.basicfont;
    this.menu = new TextMenu(basicFont, 72, 16, 80, 20, 4, [
    ], this.onMenu.bind(this));
}

ShopState.prototype.enter = function (shopId) {
    this.menu.setOptions(this.getShopMenu(shopId));
    this.menu.show();
}

ShopState.prototype.getShopMenu = function (shopId) {
    var gameConfig = this.game.config;
    var items = gameConfig.shops[shopId].items;
    var menuItems = [];
    var len = items.length;
    for (var i = 0; i < len; i++) {
        var id = items[i];
        var item = gameConfig.items[id];
        menuItems.push({
            id: id,
            text: item.label,
            subtext: '$' + item.cost
        });
    }
    return menuItems;
};

ShopState.prototype.update = function () {

}

ShopState.prototype.onMenu = function (option) {

}

ShopState.prototype.onCancel = function () {
    this.game.state.switch('explore');
}

ShopState.prototype.draw = function (ctx, res) {
    this.game.state.explore.draw(ctx, res);
    this.menu.draw(ctx, res);
}


ShopState.prototype.event = function (type, x, y) {
    if (this.menu.event(type, x, y)) {
        return;
    }

    if (type === 'click') {
        this.onCancel();
    }
}

module.exports = ShopState;
