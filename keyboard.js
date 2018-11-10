(function() {
    var keys = {};
    var down_listeners = [];
    
    function onKeyUp(event) {
        keys[event.key] = false;
    }

    function onKeyDown(event) {
        keys[event.key] = true;
        for(var i in down_listeners) {
            var listener = down_listeners[i];
            if(listener.key == event.key) {
                event.preventDefault();
                if(event.stopPropagation){
                    event.stopPropagation();
                } else if(window.event){
                    window.event.cancelBubble = true;
                }
                
                listener.callback();
            }
        }
    }

    if(window && window.addEventListener) {
        window.addEventListener('keyup', onKeyUp, false);
        window.addEventListener('keydown', onKeyDown, false);
    } else {
        console.warn("Unable to add event listener to window");
    }

    gameEngine.keyIsDown = function(keycode) {
        return keys[keycode];
    };

    gameEngine.onKeyDown = function(key, cb) {
        down_listeners.push({key: key, callback: cb});
    };
}());
