
function Timer(delay, callback) {
    this.count = 0;
    this.delay = delay;
    this.callback = callback;
    this.done = false;
}

Timer.prototype.update = function () {
    if (!this.done) {
        this.count++;
        if (this.count >= this.delay) {
            this.done = true;
            if (this.callback) {
                this.callback();
            }
        }
    }
}

Timer.prototype.isDone = function () {
    return this.done;
}


function TimerManager() {
    this.timers = [];
}

TimerManager.prototype.update = function () {
    this.timers.forEach(function(timer) {
        timer.update();
    });
    this.timers = this.timers.filter(function(timer) {
        return !timer.isDone();
    });
}

TimerManager.prototype.add = function (delay, callback) {
    this.timers.push(new Timer(delay, callback));
}

module.exports = TimerManager;
