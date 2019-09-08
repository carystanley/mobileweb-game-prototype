
var baseCommands = {
    if: function(context, params, done) {
        if (this.eval(context, params.cond)) {
            if (params.then) {
                done();
            } else {
                done();
            }
        } else {
            if (params.else) {
                done();
            } else {
                done();
            }
        }
    },
    series: function(context, params, done) {
        var self = this;
        var lines = params.run;
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
            if (ip < lines.length) {
                self.exec(lines[ip], context, inc);
            } else {
                done();
            }
        }

        next();
    },
    parallel: function(context, params, done) {

    }
};

function Interpreter(commands) {
    this.commands = Object.assign({}, baseCommands, commands);
}

Interpreter.prototype.eval = function (context, statement) {
    return context.eventObj.eval(statement);
}

Interpreter.prototype.exec = function(command, context, done) {
    console.error(command);
    this.commands[command.cmd].call(this, context, command, done);
}

Interpreter.prototype.run = function(commands, context, done) {
    this.commands['series'].call(this, context, {
        run: commands
    }, done);
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
