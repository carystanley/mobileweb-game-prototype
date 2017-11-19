
function BattleTurnState(game, battleState, battle) {
    this.game = game;
    this.battleState = battleState;
    this.battle = battle;
}

BattleTurnState.prototype.init = function () {

}

BattleTurnState.prototype.enter = function () {
    /*
    this.battle.turnOrder.forEach(function (actor) {
        actor.hp -= 2;
        console.error(actor.action);
        console.error(actor.action_param);
    });
    */
    this.battleState.dialog.reset();
    if (this.battle.isRoundFinished()) {
        this.battleState.state.switch('startturn');
    } else {
        var self = this;
        this.battleState.dialog.showText(this.battle.getCurrentTurnText(), function () {
            self.battle.executeTurn(self.battleState);
            self.battleState.state.switch('turn');
        });
    }
}

BattleTurnState.prototype.update = function () {
    // Animate Each Turn
    // Animations include:
    // Hit Enemy - HP loss "Particle"
    // Hit Player - Shake
    // PK animations?
    // Green Heal HP "Particle"
    // Add Status Effects
    //
}

BattleTurnState.prototype.draw = function (ctx, res) {
}

module.exports = BattleTurnState;
