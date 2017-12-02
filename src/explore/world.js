var Player = require('./player');
var Follower = require('./follower');
var Enemy = require('./enemy');
var AABB = require('../utils/aabb');
var Event = require('./event');

var MAX_PARTY_SIZE = 4;

var DEBUG = false;

function World(game) {
    this.game = game;
    this.correctionWall = this.correctionWall.bind(this);
    this.collideEvent = this.collideEvent.bind(this);
    this.collideEnemy = this.collideEnemy.bind(this);
}

World.prototype.buildParty = function(x, y, facing) {
    var self = this;
    var party = [];
    var isFirst = true;
    var lastMemeber = null;

    for (var i = 0; i < MAX_PARTY_SIZE; i++) {
        if (isFirst) {
            lastMemeber = new Player(self, {x: x, y: y, facing: facing, sprite: -1});
            self.player = lastMemeber;
            party.push(lastMemeber);
            isFirst = false;
        } else {
            lastMemeber = new Follower(self, {x: x, y: y, facing: facing, sprite: -1}, lastMemeber);
            party.push(lastMemeber);
        }
    }

    return party;
}

World.prototype.refreshParty = function() {
    var party = this.party;
    var data = this.game.data;

    for (var i = 0; i < MAX_PARTY_SIZE; i++) {
        var memberId = data.party[i];
        if (memberId) {
            var member = data.members[memberId];
            party[i].sprite = member.sprite;
        } else {
            party[i].sprite = -1;
        }
    }
}

World.prototype.loadMap = function(mapId, locationId) {
    var self = this;
    var game = this.game;
    this.map = game.resources[mapId];
    this.mapParallax = this.map.render(['layer-'], game.resources);
    this.mapImage = this.map.render(['layer0', 'layer1'], game.resources);
    this.mapFrontImage = this.map.render(['layer2'], game.resources);
    var start = this.map.layers.locations[locationId];
    this.party = this.buildParty(start.cx, start.cy, start.facing);
    this.refreshParty();

    var events = [];
    this.map.layers.events.forEach(function (event) {
        var eventId = event.type || event.name;
        var eventConfig = game.config.events[eventId];
        if (eventConfig) {
            events.push(new Event(self, eventId, event, eventConfig));
        }
    });
    this.events = events;

    this.enemies = [];

    this.entities = [].concat(
        this.party,
        this.events,
        this.enemies
    );

    this.width = this.map.mapWidth;
    this.height = this.map.mapHeight;

    this.resetLoadEvents();
}

World.prototype.resetLoadEvents = function () {
    this.shouldRunLoadEvents = true;
}

World.prototype.runLoadEvents = function () {
    if (this.shouldRunLoadEvents) {
        this.events.forEach(function(event) {
            if (event.trigger === 'load') {
                event.triggerEvent('load');
            }
        });
        this.shouldRunLoadEvents = false;
    }
}

World.prototype.drawLayer = function (ctx, layer, v, scale) {
    scale = scale || 1;
    var x = (v.x / scale) | 0;
    var y = (v.y / scale) | 0;
    var width = v.width;
    var height = v.height;
    var mapWidth = this.width;
    var mapHeight = this.height;
    var ox = 0;
    var oy = 0;

    if (x < 0) {
        ox = -x;
        width += x;
        x = 0;
    }

    if (y < 0) {
        oy = -y;
        height += y;
        y = 0;
    }

    var overx = mapWidth - (v.x + width)
    if (overx < 0) {
        width += overx;
    }

    var overy = mapHeight - (v.y + height)
    if (overy < 0) {
        height += overy;
    }

    ctx.drawImage(
        layer,
        x, y, width, height,
        ox, oy, width, height
    );
}

World.prototype.draw = function (ctx, v, res) {
    var player = this.player;
    var entities = this.entities;

    this.drawLayer(ctx, this.mapParallax, v, 16);

    this.drawLayer(ctx, this.mapImage, v);

    entities.sort(function(a, b) { return a.y - b.y; });
    entities.forEach(function(obj) {
        if (obj.inactive) {
            return;
        }

        if (obj.sprite >= 0) {
            ctx.drawImage(
                res.sprites,
                obj.frame * 24, obj.sprite * 32, 24, 32,
                (obj.x - 12 - v.x) | 0, (obj.y - 27 - v.y) | 0, 24, 32
            );
            if (DEBUG) {
                ctx.beginPath();
                ctx.strokeStyle = 'red';
                ctx.rect(
                    obj.x - v.x - obj.width/2, obj.y - v.y - obj.height/2,
                    obj.width, obj.height
                );
                ctx.stroke();
                ctx.closePath();
            }
        }
    });

    if (DEBUG) {
        this.events.forEach(function(obj) {
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            ctx.rect(
                obj.x - v.x - obj.width/2, obj.y - v.y - obj.height/2,
                obj.width, obj.height
            );
            ctx.stroke();
            ctx.closePath();
        });
    }

    this.drawLayer(ctx, this.mapFrontImage, v);

    if (player.goalRadius > 0) {
        ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
        ctx.beginPath();
        ctx.ellipse(player.goalX + 8 - v.x, player.goalY + 4 - v.y,
            player.goalRadius, player.goalRadius, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
};

World.prototype.update = function () {
    this.runLoadEvents();

    var self = this;
    var player = this.player;

    this.entities.forEach(function(entity) {
        if (entity.inactive) {
            return;
        }
        entity.update();
    });

    this.events.forEach(function(event) {
        if (event.inactive) {
            return;
        }
        AABB.collision(player, event, self.collideEvent);
    });
    this.enemies.forEach(function(enemy) {
        if (enemy.inactive) {
            return;
        }
        AABB.collision(player, enemy, self.collideEnemy);
    });
}

World.prototype.correctionWall = function(player, obstacle, distX, distY, correctX, correctY) {
    if (correctX > correctY) {
        player.x += ((distX > 0) ? 1 : -1) * correctX;
    } else {
        player.y += ((distY > 0) ? 1 : -1) * correctY;
    }
}

World.prototype.collideEvent = function(player, event, distX, distY, correctX, correctY) {
    if (correctX > correctY) {
        player.x += ((distX > 0) ? 1 : -1) * correctX;
    } else {
        player.y += ((distY > 0) ? 1 : -1) * correctY;
    }

    if (player.goalEvent === event) {
        player.going = false;
        player.goalEvent = null;
        event.triggerEvent('action');
    } else {
        event.triggerEvent('contact');
    }
}

World.prototype.collideEnemy = function(player, enemy, distX, distY, correctX, correctY) {
    if (correctX > correctY) {
        player.x += ((distX > 0) ? 1 : -1) * correctX;
    } else {
        player.y += ((distY > 0) ? 1 : -1) * correctY;
    }

    player.going = false;
    player.goalEvent = null;

    this.game.state.switch('enterBattle');
}

World.prototype.refresh = function () {
    this.events.forEach(function(event) {
        event.refresh();
    });
}

World.prototype.spawnEnemy = function(spawn) {
    var spawnType = spawn.type
    var probability = spawn.probability || 100;
    var enemyConfig = this.game.config.enemies[spawnType];
    if (enemyConfig) {
        if (Math.random() > (probability/100)) {
            return;
        }
        var enemy = new Enemy(this, spawn, enemyConfig);
        this.enemies.push(enemy);
        this.entities.push(enemy);
    }
}


module.exports = World;
