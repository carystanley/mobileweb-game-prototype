
var MAX_PARTICLES = 7;

function BattleParticles(game) {
    this.game = game;
    this.particles = [];
    for (var i = 0; i < MAX_PARTICLES; i++) {
        this.particles.push({
            x: 0,
            y: 0,
            lifetime: 0,
            value: 0,
            vx: 0,
            vy: 0,
            ay: 0
        });
    }
}

BattleParticles.prototype.add = function (value, x, y, lifetime, vx, vy, ay) {
    for (var i = 0; i < MAX_PARTICLES; i++) {
        var particle = this.particles[i];
        if (particle.lifetime <= 0) {
            particle.value = value+'';
            particle.x = x;
            particle.y = y;
            particle.lifetime = lifetime;
            particle.vx = vx;
            particle.vy = vy;
            particle.ay = ay;
            return;
        }
    }
}

BattleParticles.prototype.update = function (value, x, y, lifetime, vx, vy, ay) {
    for (var i = 0; i < MAX_PARTICLES; i++) {
        var particle = this.particles[i];
        if (particle.lifetime > 0) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.ay;
            particle.lifetime--;
        }
    }
}

BattleParticles.prototype.draw = function (ctx, res) {
    var font = res.battlenumbersfont;
    for (var i = 0; i < MAX_PARTICLES; i++) {
        var particle = this.particles[i];
        if (particle.lifetime > 0) {
            var txtLen = font.measureText(particle.value);
            font.drawText(ctx, particle.value,
                (particle.x - (txtLen/2)) | 0,
                particle.y | 0
            );
        }
    }
}

module.exports = BattleParticles;
