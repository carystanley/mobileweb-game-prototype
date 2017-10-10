var Inventory = require('./inventory');

function Data(game) {
    this.init();
    this.game = game;
};

Data.prototype.init = function() {
    this.inventory = new Inventory(8);
    this.party = ['hero', 'girl'];
    this.members = {
        hero: {
            sprite: 0,
            name: 'Izumi'
        },
        girl: {
            sprite: 1,
            name: 'Asami'
        },
        bully: {
            sprite: 2,
            name: 'Ryoko'
        }
    }
    this.flags = {};

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

Data.prototype.hasInventoryItem = function(id) {
    return (this.inventory.contains(id));
};

Data.prototype.flag = function(id) {
    return (this.flags[id]);
};

Data.prototype.setFlag = function(id, value) {
    this.flags[id] = value;
};

Data.prototype.joinParty = function(id) {
    this.party.push(id);
};

module.exports = Data;
