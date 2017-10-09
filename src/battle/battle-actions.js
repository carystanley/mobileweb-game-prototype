
var BattleActions = {
    attack: {
        friendly: false,
        trigger: function (game, source, target) {
            return {
                animation: '',
                text: ''
            }
        }
    },
    defend: {
        friendly: true,
        trigger: function (game, source, target) {
            return {
                animation: '',
                text: ''
            }
        }
    },
    useitem: {
        friendly: function () {

        },
        trigger: function (game, source, target) {
            return {
                animation: '',
                text: ''
            }
        }
    }
};

module.exports = BattleActions;
