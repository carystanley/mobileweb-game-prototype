
var Actions = {
    bash: {
        target: 'foe',
        lambda: function (state, target, actor, param) {
            target.shakeCounter = 20;
            target.hp -= 15;
            state.particles.add(15, target.x, target.y, 30, 0, -0.5, 0);
        }
    },
    heal: {
        target: 'friendly',
        lambda: function (state, target, actor, param) {
            target.shakeCounter = 20;
            target.hp -= param.amount;
            state.particles.add(param.amount, target.x, target.y, 30, 0, -0.5, 0);
        }
    },
    defend: {
        target: 'friendly',
        lambda: function (state, target, actor, param) {

        }
    },
    item: {
        target: function (state, param) {
            var itemId = param.id;
            var game = state.game;
            var item = game.config.items[itemId];
            if (item.battleAction) {
                return Actions[item.battleAction].target;
            }
        },
        lambda: function (state, target, actor, param) {
            var itemId = param.id;
            var game = state.game;
            var item = game.config.items[itemId];

            if (item.battleAction) {
                if (game.data.hasInventoryItem(itemId)) {
                    game.data.inventory.removeById(itemId);
                    Actions[item.battleAction].lambda(state, target, actor, item);
                }
            }
        }
    }
};

module.exports = Actions;
