var trackingQueue = window._gaq;

var Tracking = {
    init: function (account) {
        this.send(['_trackPageview']);
        if (account) {
            this.setAccount(account);
        }
    },

    setAccount: function(account) {
        this.send(['_setAccount', account]);
    },

    trackPage: function(url){
        this.send(['_trackPageview', url]);
    },

    trackEvent: function(category, action, label, value ){
        this.send(['_trackEvent', category, action, label, value]);
    },

    send: function(args) {
        if (trackingQueue) {
            trackingQueue.push(args);
        } else {
            console.log('Tracking object missing.');
        }
    }
};

module.exports = Tracking;
