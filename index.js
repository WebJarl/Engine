var gameEngine = (function() {
    var canvas;
    var width;
    var height;
    var paused = true;
    var keys = {};
    var camera = {
        x: 0,
        y: 0,
        rotation: 0,
        zoom: 1,
        bound_renderable: null
    };

    function onResize(event) {
        if(event.target.innerWidth < width) {
            canvas.width = window.innerWidth;
        } else {
            canvas.width = width;
        }
        if(event.target.innerHeight < height) {
            canvas.height = window.innerHeight;
        } else {
            canvas.height = height;
        }

        gameEngine.renderer.render();
    }

    function onKeyUp(event) {
        keys[event.key] = false;
    }

    function onKeyDown(event) {
        keys[event.key] = true;
    }

    return new function() {
        this.renderer = function() {
            var renderables = new Array();

            return new function() {
                this.createRenderable = function(type, data) {
                    var renderable = {};
                    renderable.x = 0;
                    renderable.y = 0;
                    renderable.type = type;
                    
                    if(type === 'RECTANGLE') {
                        renderable.w = 0;
                        renderable.h = 0;

                    } else if(type === 'TEXT') {
                        ;
                    } else if(type === 'TILE') {
                        if(data) {
                            renderable.tileset = data.tileset;
                            renderable.sprite = 0;
                            renderable.w = data.tile_width;
                            renderable.h = data.tile_height;

                        } else {
                            console.warn("createRenderable with type TILE called with no data.");
                        }

                    } else {
                        console.warn("createRenderable called with invalid type.");
                    }

                    renderables.push(renderable);

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

                    for(var i in renderables) {
                        var renderable = renderables[i];
                        if(renderable) {
                            if(renderable.color) {
                                ctx.strokeStyle = renderable.color;
                                ctx.fillStyle = renderable.color;
                            }

                            if(renderable.type === 'RECTANGLE') {
                                ctx.fillRect(renderable.x - camera.x, renderable.y - camera.y, renderable.w, renderable.h);

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

                            } else { // unexpected renderable.type
                                //ctx.moveTo(renderable.x, renderable.y);
                            }
                        }
                    }

                    ctx.stroke();
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

                this.bindCameraToRenderable = function(renderable) {
                    camera.bound_renderable = renderable;
                };
            };
        }();

        this.getWidth = function() {
            return canvas.width;
        };

        this.getHeight = function() {
            return canvas.height;
        };

        this.keyIsDown = function(keycode) {
            return keys[keycode];
        };
		
		this.pause = function() {
            paused = true;
        };

        this.unpause = function() {
            paused = false;
        }

        this.init = function(params) {
            /* Params:
             * canvas:
             * -- classList: string
             * -- width: number
             * -- height: number
             * -- fullscreen: boolean
             * onTick: function
             */

            var el = document.createElement("canvas");
            if(el) {
                width = el.width = 852;
                height = el.height = 480;
                if(params) {
                    if(params.canvas) {
                        if(params.canvas.classList && typeof(params.canvas.classList) === 'string') {
                            el.classList = params.canvas.classList;
                        }
                        if(params.canvas.fullscreen) {
                            window.moveTo(0, 0);
                            window.resizeTo(screen.width, screen.height);
                            
                            width     = screen.width;
                            el.width  = window.innerWidth;
                            height    = screen.height;
                            el.height = window.innerHeight;

                        } else {
                            if(params.width && typeof(params.width) === 'number') {
                                width = el.width = params.canvas.width;
                            }
                            if(params.height && typeof(params.height) === 'number') {
                                height = el.height = params.canvas.height;
                            }
                        }
                    }
                }
                canvas = document.body.appendChild(el);
                if(canvas) {
                    canvas.setAttribute("tabindex", "0");
                    canvas.focus();
					
					gameEngine.renderer.init(canvas);
                    
                    this.renderer.drawPauseScreen();

                    canvas.onclick = canvas.onfocus = function() {
                        paused = false;
                    };
                    canvas.onblur = function() {
                        paused = true;
                        renderer.drawPauseScreen();
                    };
                    
                    if(window && window.addEventListener) {
                        window.addEventListener('resize', onResize, false);
                        window.addEventListener('keyup', onKeyUp, false);
                        window.addEventListener('keydown', onKeyDown, false);
                    } else {
                        console.warn("Unable to add event listener to window");
                    }

                    if(setInterval) {
                        var renderer = this.renderer;
                        setInterval((function() {
                            var last_time = new Date();

                            return function() {
                                var current_time = new Date();
                                
                                if(!paused) {
                                    renderer.render();
    
                                    if(params && params.onTick) {
                                        params.onTick(current_time - last_time);
                                    }
                                }

                                last_time = current_time;
                            };
                        }()), 1000/60); // 60 fps
                        //}()), 1000/10); // 10 fps, for debugging
                    }
                } else {
                    console.error("Unable to append canvas element");
                }
            } else {
                console.error("Unable to create canvas element");
            }
        };
    }();
}());

if(!Math.clamp) {
    Math.clamp = function(val, min, max) { // ECMAScript 2017
        return Math.max(min, Math.min(val, max));
    };
}
