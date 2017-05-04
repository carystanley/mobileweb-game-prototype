
function StateManager(game, states, initStateId) {
    var self = this;
    this.game = game;
    Object.keys(states).forEach(function (stateId) {
        self[stateId] = states[stateId];
    });
    this.currentState = states[initStateId];
}

StateManager.prototype.switch = function (id, params) {
    var oldState = this.currentState;
    if (oldState && oldState.exit) {
        oldState.exit();
    }
    var newState = this[id];
    if (newState && newState.enter) {
        newState.enter(params);
    }
    this.currentState = newState;
};

StateManager.prototype.update = function () {
    var state = this.currentState;
    if (state && state.update) {
        state.update();
    }
}

StateManager.prototype.draw = function (ctx, res) {
    var state = this.currentState;
    if (state && state.update) {
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
