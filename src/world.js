function correctionWall(player, obstacle, distX, distY, correctX, correctY) {
    if (correctX > correctY) {
        player.x += ((distX > 0) ? 1 : -1) * correctX;
    } else {
        player.y += ((distY > 0) ? 1 : -1) * correctY;
    }
}

function collideEvent(player, event, distX, distY, correctX, correctY) {
    if (correctX > correctY) {
        player.x += ((distX > 0) ? 1 : -1) * correctX;
    } else {
        player.y += ((distY > 0) ? 1 : -1) * correctY;
    }
    if (event.text && (player.goalEvent === event)) {
        player.going = false;
        player.goalEvent = null;
        player.showText(event.text);
    }
}

function World(state) {
    this.state = state;
    this.player = new Player(this);
    this.events = [
        {x: 150, y: 205, z: 0, width: 16, height: 8, frame: 1,
            text: 'Ouch!!'},
        {x: 355, y: 220, z: 0, width: 16, height: 8, frame: 1,
            text: 'To Understand the Banana, You Must Become the Banana'},
        {x: 175, y: 235, z: 0, width: 16, height: 8, frame: 1,
            text: 'When you can snatch the pebble from my hand, it will be time for you to leave.'}
    ];
    this.entities = this.events.slice(0);
    this.entities.push(this.player);

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
        ctx.fillStyle = 'rgba(170, 170, 170, 0.5)';
        ctx.beginPath();
        ctx.ellipse(obj.x + obj.width/2  - v.x, obj.y + obj.height/2  - v.y,
            obj.width/2, obj.height/2, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.drawImage(
            res.sprites,
            obj.frame * 16, 0, 16, 24,
            (obj.x - v.x) | 0, (obj.y - 20 - obj.z - v.y) | 0, obj.width, 24
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
    var player = this.player;
    this.walls.forEach(function(wall) {
        AABB.collision(player, wall, correctionWall);
    });
    this.events.forEach(function(event) {
        AABB.collision(player, event, collideEvent);
    });
}
