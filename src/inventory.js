
function Inventory (maxSize) {
    this.items = [];
    this.maxSize = maxSize;
};

Inventory.prototype.add = function(itemId) {
    if (this.items.length < this.maxSize) {
        this.items.push(itemId);
    }
}

Inventory.prototype.removeByPositon = function(itemPos) {
    this.items.splice(itemPos, 1);
}

Inventory.prototype.removeById = function(itemId) {
    var pos = this.items.indexOf(itemId);
    if (pos !== -1) {
        this.removeByPositon(pos);
        return true;
    }
    return false;
}

Inventory.prototype.getItems = function() {
    return this.items;
}

Inventory.prototype.contains = function(itemId) {
    return (this.items.indexOf(itemId) !== -1);
}

Inventory.prototype.isFull = function() {
    return (this.items.length >= this.maxSize);
}

module.exports = Inventory;
