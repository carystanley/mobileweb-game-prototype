
var baseCommands = {
    if: function(context, params, done) {
        if (this.eval(context, params.cond)) {
            if (params.then) {
                this.run(params.then, context, done);
            } else {
                done();
            }
        } else {
            if (params.else) {
                this.run(params.else, context, done);
            } else {
                done();
            }
        }
    },
    series: function(context, params, done) {
        this.run(params.run, context, done);
    },
    parallel: function(context, params, done) {
        /* TODO */
    },
    with: function(context, params, done) {
        /* TODO */
    }
};

function Interpreter(commands) {
    this.commands = Object.assign({}, baseCommands, commands);
}

Interpreter.prototype.eval = function (context, statement) {
    return context.eventObj.eval(statement);
}

Interpreter.prototype.exec = function(command, context, done) {
    this.commands[command.cmd].call(this, context, command, done);
}

Interpreter.prototype.run = function(commands, context, done) {
    var self = this;
    var ip = 0;

    function inc(err) {
        if (err) {
            done(err);
        } else {
            ip++;
            next();
        }
    }

    function next() {
        if (ip < commands.length) {
            self.exec(commands[ip], context, inc);
        } else {
            done();
        }
    }

    next();
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
