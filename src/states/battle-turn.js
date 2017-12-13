
function BattleTurnState(game, battleState, battle) {
    this.game = game;
    this.battleState = battleState;
    this.battle = battle;
}

BattleTurnState.prototype.init = function () {

}

BattleTurnState.prototype.enter = function () {
    var self = this;

    this.battleState.dialog.reset();
    if (this.battle.isRoundFinished()) {
        this.battleState.state.switch('startturn');
    } else if (this.battle.isTurnDeceased()) {
        this.battle.executeTurn(this.battleState);
        this.battleState.state.switch('turn');
    } else {
        this.battleState.dialog.showText(this.battle.getCurrentTurnText(), function () {
            self.battle.executeTurn(self.battleState);

            if (self.battle.isWon()) {
                self.battleState.state.switch('win');
            } else if (self.battle.isEscaped()) {
                self.battleState.state.switch('win');
            } else if (self.battle.isLost()) {
                self.battleState.state.switch('lose');
            } else {
                self.battleState.state.switch('turn');
            }
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
