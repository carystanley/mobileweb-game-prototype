
function BattleTurnState(game, battleState, battle) {
    this.game = game;
    this.battleState = battleState;
    this.battle = battle;
}

BattleTurnState.prototype.init = function () {

}

BattleTurnState.prototype.enter = function () {
    this.battle.startTurn();
    /*
    this.battle.turnOrder.forEach(function (actor) {
        actor.hp -= 2;
        console.error(actor.action);
        console.error(actor.action_param);
    });
    */
    var self = this;
    this.battleState.dialog.showText('POW', function () {
        self.battleState.state.switch('startturn');
    });
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
