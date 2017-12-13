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
    this.eventflags = config.eventflags || {};
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

Data.prototype.value = function(id) {
    return (this.vars[id]);
};

Data.prototype.setFlag = function(id, value) {
    this.flags[id] = value;
};

Data.prototype.setValue = function(id, value) {
    this.vars[id] = value;
};

Data.prototype.getEventFlag = function(eventId, id) {
    return (this.eventflags[eventId] && this.eventflags[eventId][id]);
};

Data.prototype.setEventFlag = function(eventId, id, value) {
    this.eventflags[eventId] = this.eventflags[eventId] || {};
    this.eventflags[eventId][id] = value;
};

Data.prototype.joinParty = function(id) {
    this.party.push(id);
};

Data.prototype.forEachMember = function(iterator) {
    var self = this;
    this.party.forEach(function (id) {
        iterator(id, self.members[id]);
    })
};

Data.prototype.restoreParty = function() {
    this.forEachMember(function (id, member) {
        member.hp = member.maxhp;
    });
};

module.exports = Data;
