
function Lang (game) {
    this.strings = Object.assign({}, game.config.lang);
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
                return strings[i];
            }
        }
        return '';
    }
    if (strings[id]) {
        return strings[id];
    }
    return id;
}

Lang.prototype.string = function (id, params) {
    return this.fill(this.find(id), params);
}

Lang.prototype.fill = function (text, params) {
    var strings = this.strings;
    params = params || {};
    return text.replace(/{([\w.]+)}/g, function(match, id) {
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
