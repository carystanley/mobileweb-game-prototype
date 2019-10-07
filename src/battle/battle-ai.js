var Random = require('../utils/random');

var BattleAI = {
    inorder: function(actions) {
        // In Sequencial Order
        var actionCursor = this.actionCursor || 0;
        this.actionCursor = (actionCursor + 1) % actions.length;
        return actions[actionCursor];
    },

    staggered: function(actions) {
        // Choose one from First Half, then one from 2nd Half, Repeat
        var actionCursor = this.actionCursor || 0;
        this.actionCursor++;
        var actionCount = actions.length;
        var halfCount = Math.floor(actionCount / 2);

        if (actionCount % 2 === 0) {
            return actions[Random.int(0, halfCount - 1)];
        } else {
            return actions[Random.int(halfCount, actionCount - 1)];
        }
    },

    weighted: function(actions) {
        // 1st is 4x likely, 2nd is 2x likely, eveything else is evenly likely
        var actionCount = actions.length;

        if (actionCount <= 1) { // Handle corner-case
            return actions[0];
        }
        var randomNum = Random.int(0, actionCount - 1 + 4);
        if (randomNum < 4) {
            return actions[0];
        } else if (randomNum < 6) {
            return actions[1];
        } else {
            return actions[randomNum - 4];
        }
    },

    random: function(actions) {
        // Random Even Distribution
        return Random.choose(actions);
    }
};

module.exports = BattleAI;
