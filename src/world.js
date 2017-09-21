var Player = require('./player');
var Enemy = require('./enemy');
var AABB = require('./utils/aabb');

function World(game, mapId) {
    this.game = game;
    this.map = game.resources[mapId];
    this.mapImage = this.map.render(['background', 'foreground'], game.resources);
    this.player = new Player(this, {x: 150, y: 180, sprite: 0});
    this.events = [
        {x: 150, y: 205, z: 0, width: 16, height: 8, sprite: 1, frame: 4, eventId: 1},
        {x: 355, y: 220, z: 0, width: 16, height: 8, sprite: 1, frame: 4, eventId: 2},
        {x: 175, y: 235, z: 0, width: 16, height: 8, sprite: 1, frame: 4, eventId: 3}
    ];
    this.enemies = [
        new Enemy(this, {x: 320, y: 120, sprite: 2})
    ];
    this.entities = [].concat(
        [this.player],
        this.events,
        this.enemies
    );

    this.width = this.map.mapWidth;
    this.height = this.map.mapHeight;

    this.correctionWall = this.correctionWall.bind(this);
    this.collideEvent = this.collideEvent.bind(this);
    this.collideEnemy = this.collideEnemy.bind(this);
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
        /*
        ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
        ctx.beginPath();
        ctx.ellipse(obj.x + obj.width/2  - v.x, obj.y + obj.height/2  - v.y,
            obj.width/2, obj.height/2, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        */
        ctx.drawImage(
            res.sprites,
            obj.frame * 24, obj.sprite * 32, 24, 32,
            (obj.x - 4 - v.x) | 0, (obj.y - 27 - v.y) | 0, 24, 32
        );
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

    this.events.forEach(function(event) {
        AABB.collision(player, event, self.collideEvent);
    });
    this.enemies.forEach(function(enemy) {
        if (enemy.dead) {
            return;
        }
        enemy.update();
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
    if (event.eventId && (player.goalEvent === event)) {
        player.going = false;
        player.goalEvent = null;
        var commands = this.game.config.events[event.eventId][0].commands;
        this.game.state.switch('cutscene', commands);
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
