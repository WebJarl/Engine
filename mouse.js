(function() {
    var mouse_is_down = false;
    var cur_pos = {x: 0, y: 0};
    var last_pos = {x: 0, y: 0};
    var was_dragged = false;

    gameEngine.mouse = new function() {
        this.position = function() {
            return {
                x: cur_pos.x,
                y: cur_pos.y
            };
        };
        this.isDown = function() {
            return mouse_is_down;
        };
        this.isDragged = function() {
            return was_dragged;
        };
    };

    window.addEventListener('mousedown', function(event) {
        mouse_is_down = true;
        last_pos.x = event.offsetX;
        last_pos.y = event.offsetY;
        was_dragged = false;
    });

    window.addEventListener('mouseup', function(event) {
        mouse_is_down = false;
    });

    window.addEventListener('mousemove', function(event) {
        cur_pos.x = event.offsetX;
        cur_pos.y = event.offsetY;
        if(mouse_is_down) {
            var translation_x = (last_pos.x - event.offsetX) / gameEngine.renderer.getCameraZoom();
            var translation_y = (last_pos.y - event.offsetY) / gameEngine.renderer.getCameraZoom();
            if(Math.sqrt(Math.pow(translation_x, 2) + Math.pow(translation_y, 2)) > 10 || was_dragged) {
                last_pos.x = event.offsetX;
                last_pos.y = event.offsetY;
                was_dragged = true;
            }
        }
    });
}());
