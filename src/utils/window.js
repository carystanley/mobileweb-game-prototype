
function draw(ctx, x, y, width, height, margin, border) {
    border = border || 0;

    if (border) {
        ctx.fillStyle = 'white';
        ctx.fillRect(x - margin, y - margin,
            width + margin * 2, height + margin * 2);
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(x - margin + border, y - margin + border,
        width + (margin - border) * 2, height + (margin - border) * 2);
};

module.exports = {
    draw: draw
};
