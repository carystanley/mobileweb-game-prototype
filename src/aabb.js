AABB = {
    collision: function(rect1, rect2, handler) {
        var rect1halfx = rect1.width/2;
        var rect1halfy = rect1.height/2;
        var rect2halfx = rect2.width/2;
        var rect2halfy = rect2.height/2;
        var rect1centerx = rect1.x + rect1halfx;
        var rect1centery = rect1.y + rect1halfy;
        var rect2centerx = rect2.x + rect2halfx;
        var rect2centery = rect2.y + rect2halfy;
        var distX = rect2centerx - rect1centerx;
        var distY = rect2centery - rect1centery;
        var correctX = Math.abs(distX) - rect1halfx - rect2halfx;
        var correctY = Math.abs(distY) - rect1halfy - rect2halfy;
        if (correctX < 0 && correctY < 0) {
            handler(rect1, rect2, distX, distY, correctX, correctY);
        }
    },
    pointInRect: function(px, py, x, y, width, height) {
        return (
            (px >= x) &&
            (px <= x + width) &&
            (py >= y) &&
            (py <= y + height)
        );
    }
};

module.exports = AABB;
