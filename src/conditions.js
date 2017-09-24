var Conditions = {
    hasItem: function(context, params) {
        return (context.game.data.inventory.contains(params.id));
    }
};

module.exports = Conditions;
