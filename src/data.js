var Inventory = require('./inventory');

function Data(game) {
    this.game = game;
    this.init();
};

Data.prototype.init = function() {
    var config = this.game.config.party;

    this.vars = config.vars || {};
    this.party = config.party || [];
    this.members = config.members || {};
    this.flags = config.flags || {};
    this.inventory = new Inventory(8);

    (config.inventory || []).forEach(function (id) {
        this.inventory.add(id);
    }, this);
}

Data.prototype.getItemsMenu = function () {
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

Data.prototype.getCash = function() {
    return (this.vars.cash);
};

Data.prototype.adjustCash = function(delta) {
    this.vars.cash += delta;
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
