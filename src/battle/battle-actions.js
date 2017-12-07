
var Equations = require('./equations');

var Actions = {
    bash: {
        target: 'foe',
        lambda: function (state, target, actor, param) {
            var damage = Equations.calcBashDamage(2, actor, target);
            target.shakeCounter = 20;
            state.particles.add(target.damage(damage), target.x, target.y, 30, 0, -0.5, 0);
        }
    },
    heal: {
        target: 'friendly',
        lambda: function (state, target, actor, param) {
            var amount = parseInt(param, 10);
            target.shakeCounter = 20;
            state.particles.add(target.heal(amount), target.x, target.y, 30, 0, -0.5, 0);
        }
    },
    defend: {
        target: 'friendly',
        lambda: function (state, target, actor, param) {

        }
    },
    item: {
        target: function (game, itemId) {
            var item = game.config.items[itemId];
            if (item.battleAction) {
                var action = item.battleAction.split(':', 2);
                return Actions[action[0]].target;
            }
        },
        lambda: function (state, target, actor, itemId) {
            var game = state.game;
            var item = game.config.items[itemId];

            if (item.battleAction) {
                if (game.data.hasInventoryItem(itemId)) {
                    game.data.inventory.removeById(itemId);
                    var parts = item.battleAction.split(':', 2);
                    Actions[parts[0]].lambda(state, target, actor, parts[1]);
                }
            }
        }
    }
};

module.exports = Actions;
