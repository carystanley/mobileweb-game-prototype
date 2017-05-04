
function Interpreter(commands) {
    this.commands = commands;
}

Interpreter.prototype.run = function(commands, context, done) {
    this.ip = 0;
    this.lines = commands;
    this.done = done;
    this.context = context;
    this.inc = this.inc.bind(this);
    this.next();
};

Interpreter.prototype.next = function () {
    if (this.ip < this.lines.length) {
        this.exec(this.lines[this.ip]);
    } else {
        this.done();
    }
}

Interpreter.prototype.inc = function (err) {
    if (err) {
        this.done(err);
    } else {
        this.ip++;
        this.next();
    }
}

Interpreter.prototype.exec = function(command) {
    this.commands[command.cmd](this.context, command, this.inc);
}

/*

var commands = {
    print: function(context, params, done) {
        context.console.error(params.text);
        done();
    },
    wait: function(context, params, done) {
        context.window.setTimeout(function() {
            done();
        }, params.time);
    }
};

var interpreter = Interpreter(commands);

*/

module.exports = Interpreter;
