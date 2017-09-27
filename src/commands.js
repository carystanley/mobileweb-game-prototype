var Commands = {
    transport: function(context, params, done) {
        context.game.state.world.mapTransport(params.map, params.location);
        done();
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
        done();
    },
    joinParty: function(context, params, done) {
        context.game.data.joinParty(params.id);
        context.game.state.world.refreshParty();
        done();
    }
};

module.exports = Commands;
