var Conditions = {
    hasItem: function(context, params) {
        return (context.game.player.inventory.contains(params.id));
    }
};

module.exports = Conditions;
