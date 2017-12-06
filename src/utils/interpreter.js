var scopedEval = require('./scoped-eval');

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

Interpreter.prototype.jump = function (cmds) {
    do {
        this.ip++;
    } while (
        (this.ip < this.lines.length) &&
        (cmds.indexOf(this.lines[this.ip].cmd) === -1)
    );
}

Interpreter.prototype.eval = function (statement) {
    var context = this.context;
    var gameData = context.game.data;
    return scopedEval(statement, gameData, {
        flag: function (id) {
            return gameData.getEventFlag(context.eventObj.id, id);
        }
    });
}

Interpreter.prototype.keywords = {
    if: function(params) {
        if (this.eval(params.cond)) {
            this.inc();
        } else {
            this.jump(['else', 'endif']);
            this.inc();
        }
    },
    else: function(params) {
        this.jump(['endif']);
        this.inc();
    },
    endif: function(params) {
        this.inc();
    }
}

Interpreter.prototype.exec = function(command) {
    var keyword = this.keywords[command.cmd];
    if (keyword) {
        keyword.call(this, command);
    } else {
        this.commands[command.cmd](this.context, command, this.inc);
    }
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
