
function StateManager(game, states) {
    var self = this;
    this.game = game;
    Object.keys(states).forEach(function (stateId) {
        self[stateId] = states[stateId];
    });
}

StateManager.prototype.switch = function (id, params) {
    var oldState = this.currentState;
    if (oldState && oldState.exit) {
        oldState.exit();
    }
    var newState = this[id];
    if (newState && !newState.initied && newState.init) {
        newState.init();
        newState.initied = true;
    }
    this.currentState = newState;
    if (newState && newState.enter) {
        newState.enter(params);
    }
};

StateManager.prototype.update = function () {
    var state = this.currentState;
    if (state && state.update) {
        state.update();
    }
}

StateManager.prototype.draw = function (ctx, res) {
    var state = this.currentState;
    if (state && state.draw) {
        state.draw(ctx, res);
    }
}

StateManager.prototype.event = function (type, x, y) {
    var state = this.currentState;
    if (state && state.event) {
        state.event(type, x, y);
    }
}

module.exports = StateManager;
