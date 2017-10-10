
function clamp(val, min, max) {
    return Math.max(Math.min(val, max), min);
};

function transition (current, goal, maxDelta) {
    var delta = goal - current;
    return current + clamp(delta, -maxDelta, maxDelta);
}

module.exports = {
    clamp: clamp,
    transition: transition
};
