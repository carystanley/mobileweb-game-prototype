
var Actions = {
    bash: {
        friendly: false,
        lambda: function (state, target, actor, param) {
            target.shakeCounter = 20;
            target.hp -= 15;
            state.particles.add('15', target.x, target.y, 30, 0, -0.5, 0);
        }
    },
    heal: {
        friendly: true,
        lambda: function (state, target, actor, param) {

        }
    },
    defend: {
        friendly: true,
        lambda: function (state, target, actor, param) {

        }
    },
    item: {
        friendly: function () {

        },
        lambda: function (state, target, actor, param) {

        }
    }
};

module.exports = Actions;
