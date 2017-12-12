
function BitmapFont(json, sheet, xSpacing, ySpacing) {
    xSpacing = xSpacing || 0;
    ySpacing = ySpacing || 0;
    this.sheet = sheet;

    var data = {
        font: json.font.info._face,
        size: parseInt(json.font.info._size, 10),
        lineHeight: parseInt(json.font.common._lineHeight, 10) + ySpacing,
        chars: {}
    };

    json.font.chars['char'].forEach(
        function parseChar(letter) {
            var charCode = parseInt(letter._id, 10);

            data.chars[charCode] = {
                x: parseInt(letter._x, 10),
                y: parseInt(letter._y, 10),
                width: parseInt(letter._width, 10),
                height: parseInt(letter._height, 10),
                xOffset: parseInt(letter._xoffset, 10),
                yOffset: parseInt(letter._yoffset, 10),
                xAdvance: parseInt(letter._xadvance, 10) + xSpacing,
                kerning: {}
            };
        }

    );

    if (json.font.kernings && json.font.kernings.kerning) {
        json.font.kernings.kerning.forEach(
            function parseKerning(kerning) {
                data.chars[kerning._second].kerning[kerning._first] = parseInt(kerning._amount, 10);
            }
        );
    }

    this.data = data;
}

BitmapFont.prototype.drawText = function(ctx, text, x, y, align) {
    if (align === 'center') {
        x -= this.measureText(text)/2;
    }
    x = x | 0;
    y = y | 0;

    var i;
    var ch;
    var chars = this.data.chars;
    var sheet = this.sheet;
    for (i = 0; i < text.length; i++) {
        ch = chars[text.charCodeAt(i)];
        ctx.drawImage(
            sheet,
            ch.x, ch.y, ch.width, ch.height,
            x + ch.xOffset, y + ch.yOffset, ch.width, ch.height
        );
        x += ch.xAdvance;
    }
}

BitmapFont.prototype.measureText = function(text) {
    var i;
    var ch;
    var chars = this.data.chars;
    var len = 0;
    for (i = 0; i < text.length; i++) {
        ch = chars[text.charCodeAt(i)];
        len += ch.xAdvance;
    }
    return len;
}

module.exports = BitmapFont;
