var Base64 = require('../utils/base64');
var Canvas = require('../utils/canvas');

function Map (config) {
    var layers = {};
    Object.keys(config.layers).forEach(function (layerNum) {
        var layer = config.layers[layerNum];
        var name = layer.name;
        if (layer.encoding === 'base64') {
            layer.data = Base64.decodeAsArray(layer.data, 4);
        }
        if (layer.type === 'objectgroup') {
            switch (name) {
                case 'locations':
                    var locations = {};
                    layer.objects.forEach(function (location) {
                        locations[location.name] = location;
                    })
                    layers[name] = locations;
                    break;

                case 'spawns':
                case 'events':
                    layers[name] = layer.objects;
                    break;
            }
            layer.objects.forEach(function (obj) {
                obj.cx = (obj.x + obj.width/2) | 0;
                obj.cy = (obj.y + obj.height/2) | 0;
            })
        } else {
            layers[name] = layer;
        }
    });
    this.layers = layers;


    this.width = config.width;
    this.height = config.height;
    this.tilewidth = config.tilewidth;
    this.tileheight = config.tileheight;
    this.tilesets = config.tilesets;
    this.mapHeight = this.height * this.tileheight;
    this.mapWidth = this.width * this.tilewidth;
}

Map.prototype.get = function(layerId, x, y) {
    return this.layers[layerId].data[x + y * this.width];
}

Map.prototype.collide = function(x, y) {
    return this.get('collision',
        (x / this.tilewidth) | 0,
        (y / this.tileheight) | 0);
}

Map.prototype.render = function(layers, resources) {
    var self = this;
    var height = self.height;
    var width = self.width;
    var tileheight = self.tileheight;
    var tilewidth = self.tilewidth;
    var tileSets = self.tilesets.reverse();
    var mapHeight = self.mapHeight;
    var mapWidth = self.mapWidth;
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

                if (tileId !== null) {
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
