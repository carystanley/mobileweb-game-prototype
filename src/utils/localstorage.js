var localStorageFallback = {
    getItem: function() {},
    setItem: function() {},
    removeItem: function() {}
};

var isAvailable = false;

var LocalStorageWrapper = (function() {
    try {
        var storage;
        var result;
        if (typeof window !== 'undefined') {
            try {
                // Check for iOS Private issue - http://spin.atomicobject.com/2013/01/23/ios-private-browsing-localstorage/
                var uid = (new Date).toString();
                (storage = window.localStorage).setItem(uid, uid);
                result = storage.getItem(uid) === uid;
                storage.removeItem(uid);
                isAvailable = true;
                return result && storage;
            } catch (e) {}
        }
    } catch (e) {}
    return false;
})() || localStorageFallback;

var LocalStorage = {
    isAvailable: function () {
        return isAvailable;
    },

    getItem: function (key) {
        try {
            return JSON.parse(LocalStorageWrapper.getItem(key));
        } catch (e) {
            return LocalStorageWrapper.getItem(key);
        }
    },

    setItem: function(key, val) {
        if (typeof val !== 'string') {
            val = JSON.stringify(val);
        }

        try {
            LocalStorageWrapper.setItem(key, val);
        } catch (e) {}
    },

    removeItem: function(key) {
        try {
            LocalStorageWrapper.removeItem(key);
        } catch (e) {}
    }
};

module.exports = LocalStorage;
