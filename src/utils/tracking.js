var ga = window.ga || function () {
    console.error('Analytics Missing');
};

var Tracking = {
    init: function (account) {
        if (account) {
            ga('create', account, 'auto');
        }
        // ga('set', 'transport', 'beacon');
        ga('send', 'pageview');
    },

    trackPage: function(url) {
        ga('send', 'pageview', url);
    },

    trackEvent: function(category, action, label, value) {
        ga('send', 'event', category, action, label, value);
    }
};

module.exports = Tracking;
