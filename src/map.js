var Base64 = require('./utils/base64');
var Canvas = require('./utils/canvas');

function Map (config) {
    var layers = {};
    Object.keys(config.layers).forEach(function (layerNum) {
        var layer = config.layers[layerNum];
        var name = layer.name;
        if (layer.encoding === 'base64') {
            layer.data = Base64.decodeAsArray(layer.data, 4);
        }
        layers[name] = layer;
    });

    this.layers = layers;
    this.width = config.width;
    this.height = config.height;
    this.tilewidth = config.tilewidth;
    this.tileheight = config.tileheight;
    this.tilesets = config.tilesets;
}

Map.prototype.get = function(layerId, x, y) {
    return this.layers[layerId].data[x + y * this.width];
}

Map.prototype.render = function(layers, resources) {
    var self = this;
    var height = self.height;
    var width = self.width;
    var tileheight = self.tileheight;
    var tilewidth = self.tilewidth;
    var tileSets = self.tilesets;
    var mapHeight = height * tileheight;
    var mapWidth = width * tilewidth;
    var mapCanvas = Canvas.create(mapWidth, mapHeight);
    var ctx = mapCanvas.getContext('2d');
    layers.forEach(function(layerId) {
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var gid = self.get(layerId, x, y);
                var tileSetName = null;
                var tileId = null;
                var tilemapWidth = null;
                tileSets.some(function(tileSet, idx) {
                    if (tileSet.firstgid <= gid) {
                        tileSetName = tileSet.name;
                        tileId = gid - tileSet.firstgid;
                        tilemapWidth = tileSet.imagewidth / tileSet.tilewidth;
                        return true;
                    }
                    return false;
                }, this);

                if (tileId) {
                    var sx = (tileId % tilemapWidth) * tilewidth;
                    var sy = (Math.floor(tileId / tilemapWidth)) * tileheight;

                    ctx.drawImage(
                        resources[tileSetName],
                        sx, sy,
                        tilewidth, tileheight,
                        x * tilewidth, y * tileheight,
                        tilewidth, tileheight
                    );
                }
            }
        }
    });

    return mapCanvas;
}


module.exports = Map;
