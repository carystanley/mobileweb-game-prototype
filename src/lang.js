
function Lang (game) {
    this.strings = game.config.lang;
}

Lang.prototype.find = function (id) {
    var strings = this.strings;
    if (Array.isArray(id)) {
        for (var x = 0; x <= id.length; x++) {
            var i = id[x];
            if (Array.isArray(i)) {
                i = i.join('.');
            }
            if (strings[i]) {
                return i;
            }
        }
        return null;
    }
    return id;
}

Lang.prototype.string = function (id, params) {
    var strings = this.strings;
    var text = strings[this.find(id)];

    return text.replace(/{(\w+)}/g, function(match, id) {
        if (id in params) {
            return params[id];
        } else if (id in strings) {
            return strings[id];
        } else {
            return '';
        }
    });
}

module.exports = Lang;
