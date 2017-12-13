
var Async = {
    forEach: function (array, iterator, done) {
        var i = -1;
        function next() {
            i++;
            if (i < array.length) {
                iterator(array[i], next);
            } else {
                done();
            }
        }
        next();
    }
};

module.exports = Async;
