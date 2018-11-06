gameEngine.renderer = {
    init: function(canvas_param) {
        gameEngine.renderer = function() {
            var canvas = canvas_param;
            var layers = new Array();
            var layers_offset = 0; // to make negative layers possible
            layers.push(new Array());
            
            var camera = {
                x: 0,
                y: 0,
                rotation: 0,
                zoom: 1,
                bound_renderable: null
            };

            var isWithinTheScreen = function(renderable) {
                if(renderable) {
                    if(gameEngine.collision && gameEngine.collision.rectanglesCollide) {
                        var rnd = {
                            x: renderable.x,
                            y: renderable.y,
                            w: renderable.w,
                            h: renderable.h
                        };

                        if(renderable.type === 'CIRCLE') {
                            rnd.w = renderable.radius;
                            rnd.h = renderable.radius;
                        } else if(renderable.type === 'LINE') {
                            rnd.w = Math.abs(renderable.x - renderable.x0);
                            rnd.h = Math.abs(renderable.y - renderable.y0);
                        }
        
                        var scrn = {
                            x: gameEngine.renderer.getWorldPositionX(0),
                            y: gameEngine.renderer.getWorldPositionY(0),
                            w: gameEngine.renderer.getWorldPositionX(gameEngine.getWidth()),
                            h: gameEngine.renderer.getWorldPositionY(gameEngine.getHeight())
                        };

                        return true; // gameEngine.collision.rectanglesCollide(rnd, scrn); // TODO

                    } else {
                        return true;
                    }
                }
                return false;
            };
            
            return new function() {
                this.createRenderable = function(type, data) {
                    var renderable = new function() {
                        var _z = 0;
        
                        return {
                            set z(val) {
                                if(_z + layers_offset < layers.length) {
                                    var pos = layers[_z + layers_offset].indexOf(this);
                                    if(pos !== -1) {
                                        layers[_z + layers_offset].splice(pos, 1);
                                    }
                                }
        
                                if(val >= 0) {
                                    while(layers.length <= val + layers_offset) {
                                        layers.push(new Array());
                                    }
        
                                } else { // layers < 0
                                    if(val < -1 * layers_offset) {
                                        for(var i = 0; i < -1 * val - layers_offset; i++) {
                                            layers.unshift(new Array());
                                        }
                                        layers_offset = -1 * val - layers_offset;
                                    }
                                }
                                
                                layers[val + layers_offset].push(this);
        
                                _z = val;
                            },
                            get z() {
                                return _z;
                            },
                            x: 0,
                            y: 0,
                            type: type
                        };
                    };
                    
                    if(type === 'RECTANGLE') {
                        renderable.w = 0;
                        renderable.h = 0;
        
                    } else if(type === 'CIRCLE') {
                        renderable.radius = data;
        
                    } else if(type === 'TEXT') {
                        ;
                    } else if(type === 'IMAGE') {
                       if(data) {
                            if(data.constructor === String) {
                                renderable.image = new Image();
                                renderable.image.src = data;
                                renderable.image.addEventListener('load', function() {
                                    if(!renderable.w)
                                        renderable.w = renderable.image.width;
                                    if(!renderable.h)
                                        renderable.h = renderable.image.height;
                                    renderable.loaded = true;
                                });
                            }
        
                       } else {
                           console.warn("createRenderable with type IMAGE called with no data.");
                       }
                    } else if(type === 'TILE') {
                        if(data) {
                            renderable.tileset = data.tileset;
                            renderable.sprite = 0;
                            renderable.w = data.tile_width;
                            renderable.h = data.tile_height;
        
                        } else {
                            console.warn("createRenderable with type TILE called with no data.");
                        }
        
                    } else if(type === 'LINE') {
                        ;
                    } else {
                        console.warn("createRenderable called with invalid type.");
                    }
        
                    renderable.z = 0; // adds the renderable to the default layer
        
                    return renderable;
                };
        
                this.render = function() {
                    if(camera.bound_renderable) {
                        camera.x = camera.bound_renderable.x;
                        camera.y = camera.bound_renderable.y;
                    }
        
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.scale(camera.zoom, camera.zoom);
                    
                    for(var i in layers) {
                        var renderables = layers[i];
                        for(var j in renderables) {
                            var renderable = renderables[j];
                            if(renderable) {
                                if(isWithinTheScreen(renderable)) {
                                    if(renderable.color) {
                                        ctx.fillStyle = renderable.color;
                                        ctx.strokeStyle = renderable.color;
                                    } else {
                                        ctx.fillStyle = "white";
                                        ctx.strokeStyle = "white";
                                    }
            
                                    if(renderable.type === 'RECTANGLE') {
                                        ctx.fillRect(renderable.x - camera.x, renderable.y - camera.y, renderable.w, renderable.h);
            
                                    } else if(renderable.type === 'CIRCLE') {
                                        ctx.beginPath();
                                        ctx.arc(renderable.x - camera.x, renderable.y - camera.y, renderable.radius, 0, 2*Math.PI);
                                        ctx.closePath();
            
                                    } else if(renderable.type === 'TEXT') {
                                        var font = "";
                                        if(renderable.fontSize) {
                                            font += renderable.fontSize;
                                        } else {
                                            font += "24px";
                                        }
                                        if(renderable.fontFamily) {
                                            font += " " + renderable.fontFamily;
                                        } else {
                                            font += " sans-serif";
                                        }
                                        ctx.font = font;
                                        ctx.fillText(renderable.text, renderable.x - camera.x, renderable.y - camera.y);
            
                                    } else if(renderable.type === 'TILE') {
                                        if(renderable.tileset && renderable.tileset.loaded) {
                                            var tiles_in_row = Math.floor(renderable.tileset.width / renderable.tileset.tile_width);
                                            var rows = Math.floor(renderable.tileset.height / renderable.tileset.tile_height);
                                            var start_x = (renderable.sprite % tiles_in_row) * renderable.tileset.tile_width;
                                            var start_y = (Math.floor(renderable.sprite / tiles_in_row) % rows) * renderable.tileset.tile_height;
                                            ctx.drawImage(renderable.tileset.image, start_x, start_y, renderable.tileset.tile_width, renderable.tileset.tile_height, renderable.x - camera.x, renderable.y - camera.y, renderable.w, renderable.h);
                                        }
            
                                    } else if(renderable.type === 'IMAGE') {
                                        if(renderable.image && renderable.loaded) {
                                            var scale_x = renderable.w / renderable.image.width;
                                            var scale_y = renderable.h / renderable.image.height;
                                            ctx.scale(scale_x, scale_y);
            
                                            ctx.drawImage(renderable.image, 0, 0,
                                                renderable.image.width, renderable.image.height,
                                                (renderable.x - camera.x) / scale_x,
                                                (renderable.y - camera.y) / scale_y,
                                                renderable.image.width, renderable.image.height);
                                            
                                            ctx.scale(1 / scale_x, 1 / scale_y);
                                        }
                                    
                                    } else if(renderable.type === 'LINE') {
                                        if(renderable.x0 !== undefined && renderable.y0 !== undefined) {
                                            ctx.beginPath();
                                            ctx.moveTo((renderable.x - camera.x) / scale_x, (renderable.y - camera.y) / scale_y);
                                            ctx.lineTo((renderable.x0 - camera.x) / scale_x, (renderable.y0 - camera.y) / scale_y);
                                            ctx.closePath();
                                            //ctx.stroke(); // has to be here if we don't stroke for each renderable
                                        }
            
                                    } else { // unexpected renderable.type
                                        console.warn("Unexpected renderable type: ", renderable.type);
                                    }
                                    
                                    if(renderable.type !== 'IMAGE' && renderable.type !== 'RECTANGLE')
                                        ctx.stroke();
                                }
                            }
                        }
                    }
                    
                    ctx.scale(1/camera.zoom, 1/camera.zoom); // restore zoom
                };
        
                this.drawPauseScreen = function() {
                    var ctx = canvas.getContext("2d");
                    ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "white";
                    ctx.font = "20px sans-serif";
                    ctx.fillText("Game Paused, Click To Continue . . .", 5, 20);
                };
        
                this.translateCamera = function(x, y) {
                    camera.x += x;
                    camera.y += y;
                };
        
                this.rotateCamera = function(deg) {
                    camera.rotation += deg;
                };
        
                this.zoomCamera = function(scale) {
                    camera.zoom *= scale;
                };
        
                this.getCameraZoom = function() {
                    return camera.zoom;
                };
        
                this.bindCameraToRenderable = function(renderable) {
                    camera.bound_renderable = renderable;
                };
        
                this.getWorldPositionX = function(screen_x) {
                    return screen_x / camera.zoom + camera.x;
                };
        
                this.getWorldPositionY = function(screen_y) {
                    return screen_y / camera.zoom + camera.y;
                };
            };
        }();        
    }
};
