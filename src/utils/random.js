
var Random = {
    choose: function (array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    pyramid: function () {
        return Math.random() - Math.random();
    },
    int: function (min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },
    chance: function (probability) {
        return Math.random() <= probability;
    },
    vary: function (value, perc) {
        var adjustment = Random.pyramid() * value * perc;
        return Math.floor(value + adjustment);
    }
}

module.exports = Random;
