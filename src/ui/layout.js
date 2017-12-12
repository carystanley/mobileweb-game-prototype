
function Layout(game) {
    this.game = game;
}

Layout.prototype.fromBottom = function (delta) {
    return this.game.getHeight() - delta;
}

Layout.prototype.centeredEvenlySpaced = function (idx, total, spacing) {
    var length = ((total-1) * spacing);
    var offset = ((-length/2) + (idx * spacing))
    return this.center() + offset;
}

Layout.prototype.middle = function () {
    return this.game.getHeight()/2;
}

Layout.prototype.center = function () {
    return this.game.getWidth()/2;
}

module.exports = Layout;
