var Inventory = require('./inventory');

function Data(game) {
    this.game = game;
    this.load(game.config.party);
};

Data.prototype.getMapId = function() {
    return this.mapId;
}

Data.prototype.getLocationId = function() {
    return this.locationId;
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

Data.prototype.serialize = function() {
    return {
        vars: this.vars,
        party: this.party,
        members: this.members,
        flags: this.flags,
        eventflags: this.eventflags,
        mapId: payload.mapId,
        locationId: payload.locationId,
        inventory: this.inventory.serialize()
    };
};

Data.prototype.load = function(payload) {
    this.vars = payload.vars || {};
    this.party = payload.party || [];
    this.members = payload.members || {};
    this.flags = payload.flags || {};
    this.eventflags = payload.eventflags || {};
    this.mapId = payload.mapId;
    this.locationId = payload.locationId;
    this.inventory = new Inventory();
    this.inventory.load(payload.inventory || {});
};

module.exports = Data;
