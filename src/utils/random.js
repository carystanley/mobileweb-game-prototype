
var Random = {
    choose: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

module.exports = Random;
