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
        };

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
