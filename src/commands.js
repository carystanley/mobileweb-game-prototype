var getobjvalue = require('./utils/getobjvalue');

function x(context, value) {
    if (typeof value === 'string') {
        if (value.substr(0, 2) === '$$') {
            return getobjvalue(context, value.substr(2));
        }
    }
    return value;
}

function getWorld(context) {
    return context.game.state.explore.world;
}

function getTargetEvent(context, params) {
    var event = params.id ? getWorld(context).getEventById(params.id) : context.eventObj;
    return event;
}

var Commands = {
    transport: function(context, params, done) {
        context.game.state.explore.mapTransport(
            x(context, params.map),
            x(context, params.location)
        );
        done();
    },
    shop: function(context, params, done) {
        done();
        context.game.state.switch('shop', params.id);
    },
    sell: function(context, params, done) {
        var data = context.game.data;
        var cash = data.value('reserve');
        if (cash > 0) {
            data.setValue('reserve', 0);
            data.adjustCash(cash);
            context.dialog.lang('SHOP.SELL', {amount: cash}, done);
        } else {
            done();
        }
    },
    restore: function(context, params, done) {
        var game = context.game;
        game.data.restoreParty();
        game.state.explore.refreshParty();
        done();
    },
    battle: function(context, params, done) {
        done();
        context.game.state.switch('battle', {
            enemies: [{type: params.type}],
            onEnd: params.onEnd
        });
    },
    dialog: function(context, params, done) {
        context.dialog.showText(params.text, done);
    },
    fadeOut: function(context, params, done) {
        context.matte.fadeOut(params.ticks, done);
    },
    fadeIn: function(context, params, done) {
        context.matte.fadeIn(params.ticks, done);
    },
    bgm: function(context, params, done) {
        context.game.sound.bgm(params.type || 'explore', params.id);
    },
    addItemToInventory: function(context, params, done) {
        var id = x(context, params.id);
        context.game.data.inventory.add(id);
        var item = context.game.config.items[id]
        context.game.sound.se('item1');
        context.dialog.showText('You got ' + item.label + '!', done);
    },
    removeItemFromInventory: function(context, params, done) {
        context.game.player.data.removeById(params.id);
        done();
    },
    setFlag: function(context, params, done) {
        context.game.data.setFlag(params.id, params.value);
        getWorld(context).refresh();
        done();
    },
    setValue: function(context, params, done) {
        context.game.data.setValue(params.id, params.value);
        getWorld(context).refresh();
        done();
    },
    setSelfFlag: function(context, params, done) {
        context.game.data.setEventFlag(context.eventObj.id, params.id, params.value);
        getWorld(context).refresh();
        done();
    },
    joinParty: function(context, params, done) {
        var game = context.game;
        game.data.joinParty(params.id);
        game.sound.me('joins_party');
        context.dialog.showText(params.id + ' joined the party!', function () {
            game.state.explore.refreshParty();
            done();
        });
    },
    walk: function(context, params, done) {
        var event = getTargetEvent(context, params);
        if (event) {
            event.goTo(event.x + params.dx, event.y + params.dy, done);
        } else {
            done();
        }
    },
    sprite: function(context, params, done) {
        var event = getTargetEvent(context, params);
        if (event) {
            event.sprite = params.sprite;
        }
        done();
    },
    face: function(context, params, done) {
        var event = getTargetEvent(context, params);
        var direction = params.direction;
        if (event && direction) {
            event.setFacing(direction);
        }
        done();
    },
    wait: function(context, params, done) {
        var game = context.game;
        var delay = params.delay;
        game.state.cutscene.time.add(delay, done);
    },
    enemy: function(context, params, done) {
        getWorld(context).spawnEnemy({
            type: x(context, params.type),
            x: x(context, params.x),
            y: x(context, params.y),
            probability: x(context, params.probability)
        });
        done();
    },
    with: function(context, params, done) {
        /* TODO test */
        var event = getTargetEvent(context, params);
        this.run(params.run, Object.assign({}, context, {
            eventObj: event
        }), done);
    }
};

module.exports = Commands;
