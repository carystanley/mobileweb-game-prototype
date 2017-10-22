var DOT = '.';

module.exports = function getobjvalue (obj, path, defaultValue) {
    if (!obj) {
        return defaultValue;
    }

    if (!path) {
        return obj;
    }

    if (typeof path === 'string') {
        path = path.split(DOT);
    }

    for (var i = 0, l = path.length; obj && i < l; i++) {
        obj = obj[path[i]];
    }

    if (obj === undefined) {
        return defaultValue;
    } else {
        return obj;
    }
};
