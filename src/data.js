var Inventory = require('./inventory');

function Data(game) {
    this.init();
    this.game = game;
};

Data.prototype.init = function() {
    this.inventory = new Inventory(8);

    this.inventory.add('sneaker');
}

Data.prototype.getGoodsMenu = function () {
    var game = this.game;
    var menuItems = [];
    var items = this.inventory.getItems();
    var len = items.length;
    for (var i = 0; i < len; i++) {
        var id = items[i];
        var item = game.config.items[id];
        menuItems.push({
            id: id,
            text: item.label
        });
    }
    return menuItems;
};

module.exports = Data;
