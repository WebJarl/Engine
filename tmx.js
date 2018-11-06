var tmx = (function() {
    return new function() {
        this.loadMap = function(path, callback) {
            var requestjson = new XMLHttpRequest();
            requestjson.open('GET', path);
            requestjson.responseType = 'json';
            requestjson.send();
            requestjson.onload = function() {
                var map = requestjson.response;
                var tilesets = new Array();
                var loaded_tilesets = 0;
                
                for(var i in map.tilesets) {
                    var tileset = map.tilesets[i];

                    var requestxml = new XMLHttpRequest();
                    requestxml.open('GET', tileset.source);
                    requestxml.responseType = 'document';
                    requestxml.send();
                    requestxml.onload = new function() {
                        return function() {
                            var xmldoc = requestxml.responseXML;
                            var element = xmldoc.documentElement;
                            var image = element.getElementsByTagName('image')[0];
                            tilesets.push(spritesheet.createSpritesheet(image.getAttribute('source'), element.getAttribute('tilewidth'), element.getAttribute('tileheight'), map.tilesets[i].firstgid));
                            
                            loaded_tilesets++;
                            if(loaded_tilesets >= map.tilesets.length) {
                                if(callback) {
                                    callback({
                                        map: map,
                                        tilesets: tilesets
                                    });
                                }
                            }
                        };
                    }();
                    requestxml.onerror = function() {
                        console.error("Error loading map tileset: ", path, tileset);
                    };
                }
            };
            requestjson.onerror = function() {
                console.error("Error loading TMX map: ", path);
            };
        };
    };
}());
