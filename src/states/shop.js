var TextMenu = require('../ui/textmenu');

function ShopState(game) {
    this.game = game;
}

ShopState.prototype.init = function () {
    this.menu = new TextMenu('basicfont', 72, 16, 80, 20, 4, 1, [
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
    var game = this.game;
    var data = game.data;
    var config = game.config;

    var itemId = option.id;
    var item = config.items[itemId];
    var cost = item.cost;
    if (cost <= data.getCash()) {
        data.adjustCash(-cost);
        data.inventory.add(itemId);
        this.game.sound.se('item1');
        console.error('You got ' + item.label + '!');
    }
}

ShopState.prototype.onCancel = function () {
    this.game.state.switch('explore');
}

ShopState.prototype.draw = function (ctx, res) {
    this.game.state.explore.draw(ctx, res);
    this.menu.draw(ctx, res);
    var x = 24;
    var y = 16;
    var margin = 4;
    var width = 40;
    var height = 20;
    var font = res.basicfont;
    var offset = Math.max(Math.floor((height - font.data.lineHeight) / 2), 0);

    ctx.fillStyle = 'black';
    ctx.fillRect(x - margin, y - margin, width + margin * 2, height + margin * 2);
    var cashTxt = '$' + this.game.data.getCash();
    font.drawText(ctx, cashTxt,
        x + width - offset - font.measureText(cashTxt),
        y + offset
    );
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
