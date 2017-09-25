var Player = require('./player');
var Follower = require('./follower');
var Enemy = require('./enemy');
var AABB = require('./utils/aabb');
var Event = require('./event');

function World(game) {
    this.game = game;
    this.correctionWall = this.correctionWall.bind(this);
    this.collideEvent = this.collideEvent.bind(this);
    this.collideEnemy = this.collideEnemy.bind(this);
}

World.prototype.buildParty = function(x, y) {
    var party = [];
    var isFirst = true;
    var data = this.game.data;
    var lastMemeber = null;
    var self = this;

    data.party.forEach(function (memberId) {
        var member = data.members[memberId];
        if (isFirst) {
            lastMemeber = new Player(self, {x: x, y: y, sprite: member.sprite});
            self.player = lastMemeber;
            party.push(lastMemeber);
            isFirst = false;
        } else {
            lastMemeber = new Follower(self, {x: x, y: y, sprite: member.sprite}, lastMemeber);
            party.push(lastMemeber);
        }
    })

    return party;
}

World.prototype.loadMap = function(mapId, locationId) {
    var self = this;
    var game = this.game;
    this.map = game.resources[mapId];
    this.mapImage = this.map.render(['background', 'foreground'], game.resources);
    var start = this.map.layers.Locations[locationId];
    this.party = this.buildParty(start.cx, start.cy);

    var events = [];
    this.map.layers.Events.forEach(function (event) {
        var eventId = event.type || event.name;
        var eventConfig = game.config.events[eventId];
        if (eventConfig) {
            events.push(new Event(self, eventId, event, eventConfig));
        }
    });
    this.events = events;

    this.enemies = [
        new Enemy(this, {x: 320, y: 120, sprite: 7})
    ];
    this.entities = [].concat(
        this.party,
        this.events,
        this.enemies
    );

    this.width = this.map.mapWidth;
    this.height = this.map.mapHeight;
}

World.prototype.draw = function (ctx, v, res) {
    var player = this.player;
    var entities = this.entities;

    ctx.drawImage(
        this.mapImage,
        v.x, v.y, v.width, v.height,
        0, 0, v.width, v.height
    );

    entities.sort(function(a, b) { return a.y - b.y; });
    entities.forEach(function(obj) {
        if (obj.dead) {
            return;
        }

        if (obj.sprite >= 0) {
            ctx.drawImage(
                res.sprites,
                obj.frame * 24, obj.sprite * 32, 24, 32,
                (obj.x - 12 - v.x) | 0, (obj.y - 27 - v.y) | 0, 24, 32
            );
            /* Debug
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.rect(
                obj.x - v.x - obj.width/2, obj.y - v.y - obj.height/2,
                obj.width, obj.height
            );
            ctx.stroke();
            ctx.closePath();
            */
        }
    });

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
    var self = this;
    var player = this.player;

    this.entities.forEach(function(entity) {
        if (entity.dead) {
            return;
        }
        entity.update();
    });

    this.events.forEach(function(event) {
        AABB.collision(player, event, self.collideEvent);
    });
    this.enemies.forEach(function(enemy) {
        if (enemy.dead) {
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
        event.trigger();
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
    enemy.dead = true;

    this.game.state.switch('battlemenu', enemy);
}

module.exports = World;
