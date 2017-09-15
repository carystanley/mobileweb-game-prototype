var Player = require('./player');
var Enemy = require('./enemy');
var AABB = require('./utils/aabb');

function World(game) {
    this.game = game;
    this.player = new Player(this, {x: 150, y: 180, frame: 0});
    this.events = [
        {x: 150, y: 205, z: 0, width: 16, height: 8, frame: 1, eventId: 1},
        {x: 355, y: 220, z: 0, width: 16, height: 8, frame: 1, eventId: 2},
        {x: 175, y: 235, z: 0, width: 16, height: 8, frame: 1, eventId: 3}
    ];
    this.enemies = [
        new Enemy(this, {x: 320, y: 120, frame: 2})
    ];
    this.entities = [].concat(
        [this.player],
        this.events,
        this.enemies
    );

    this.walls = [
        {x: 0, y: 0, width: 440, height: 100},
        {x: 0, y: 0, width: 75, height: 372},
        {x: 0, y: 280, width: 300, height: 150},
        {x: 300, y: 340, width: 140, height: 60},
        {x: 390, y: 0, width: 200, height: 290},
        {x: 100, y: 100, width: 150, height: 65},
        {x: 60, y: 230, width: 40, height: 100},
        {x: 190, y: 240, width: 110, height: 40},
        {x: 240, y: 210, width: 70, height: 30}
    ];

    this.width = 440;
    this.height = 372;

    this.correctionWall = this.correctionWall.bind(this);
    this.collideEvent = this.collideEvent.bind(this);
    this.collideEnemy = this.collideEnemy.bind(this);
}

World.prototype.draw = function (ctx, v, res) {
    var player = this.player;
    var entities = this.entities;

    ctx.drawImage(
        res.world,
        v.x, v.y, v.width, v.height,
        0, 0, v.width, v.height
    );
/*
    walls.forEach(function(obj) {
        ctx.fillStyle = 'rgba(80, 80, 80, 0.5)';
        ctx.fillRect(obj.x - v.x, obj.y - v.y, obj.width, obj.height);
    });
*/
    entities.sort(function(a, b) { return a.y - b.y; });
    entities.forEach(function(obj) {
        if (obj.dead) {
            return;
        }
        ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
        ctx.beginPath();
        ctx.ellipse(obj.x + obj.width/2  - v.x, obj.y + obj.height/2  - v.y,
            obj.width/2, obj.height/2, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        var frame = (obj.animation && obj.animation.getCurrentFrame()) || 0
        ctx.drawImage(
            res.sprites,
            frame * 24, obj.frame * 32, 24, 32,
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
    this.walls.forEach(function(wall) {
        AABB.collision(player, wall, self.correctionWall);
    });
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
