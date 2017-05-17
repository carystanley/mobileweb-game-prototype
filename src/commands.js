var Commands = {
    dialog: function(context, params, done) {
        context.dialog.showText(params.text, done);
    },
    fadeOut: function(context, params, done) {
        context.matte.fadeOut(params.ticks, done);
    },
    fadeIn: function(context, params, done) {
        context.matte.fadeIn(params.ticks, done);
    },
    getItem: function(context, params, done) {
        context.game.player.inventory.add(params.id);
        var item = context.game.config.items[params.id]
        context.dialog.showText('You got ' + item.label + '!', done);
    }
};

module.exports = Commands;
