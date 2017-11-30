var getobjvalue = require('./utils/getobjvalue');

function x(context, value) {
    if (typeof value === 'string') {
        if (value.substr(0, 2) === '$$') {
            return getobjvalue(context, value.substr(2));
        }
    }
    return value;
}

var Commands = {
    transport: function(context, params, done) {
        context.game.state.explore.mapTransport(
            x(context, params.map),
            x(context, params.location)
        );
        done();
    },
    shop: function(context, params, done) {
        context.game.state.switch('shop', params.id);
        // done();
    },
    dialog: function(context, params, done) {
        context.dialog.showText(params.text, done);
    },
    fadeOut: function(context, params, done) {
        context.matte.fadeOut(params.ticks, done);
    },
    fadeIn: function(context, params, done) {
        context.matte.fadeIn(params.ticks, done);
    },
    addItemToInventory: function(context, params, done) {
        context.game.data.inventory.add(params.id);
        var item = context.game.config.items[params.id]
        context.dialog.showText('You got ' + item.label + '!', done);
    },
    removeItemFromInventory: function(context, params, done) {
        context.game.player.data.removeById(params.id);
        done();
    },
    setFlag: function(context, params, done) {
        context.game.data.setFlag(params.id, params.value);
        context.game.state.explore.world.refresh();
        done();
    },
    joinParty: function(context, params, done) {
        context.game.data.joinParty(params.id);
        context.game.state.explore.refreshParty();
        done();
    }
};

module.exports = Commands;
