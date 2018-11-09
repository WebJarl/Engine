(function() {
    gameEngine.gamePadType = {
        XBOX360: {
            BUTTON_A: 0,
            BUTTON_B: 1,
            BUTTON_X: 2,
            BUTTON_Y: 3,
            BUTTON_LB: 4,
            BUTTON_RB: 5,
            BUTTON_LT: 6,
            BUTTON_RT: 7,
            BUTTON_BACK: 8,
            BUTTON_START: 9,
            BUTTON_LSTICK: 10,
            BUTTON_RSTICK: 11,
            BUTTON_UP: 12,
            BUTTON_DOWN: 13,
            BUTTON_LEFT: 14,
            BUTTON_RIGHT: 15,
            AXIS_LEFT_HORIZONTAL: 0,
            AXIS_LEFT_VERTICAL: 1,
            AXIS_RIGHT_HORIZONTAL: 2,
            AXIS_RIGHT_VERTICAL: 3
        }
    };

    gameEngine.getGamePad = function(index) {
        return new function() {
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
            var gamepad = gamepads[index];

            this.buttonIsPressed = function(button_index) {
                if(gamepad) {
                    var button = gamepad.buttons[button_index];
                    if(typeof(button) == 'object') {
                        return button.pressed;
                    }
                    return button == 1.0;
                }
            };

            this.axisValue = function(axis_index) {
                if(gamepad) {
                    var axis = gamepad.axes[axis_index];
                    return axis;
                }
            };

            this.isConnected = function() {
                return !!gamepad;
            };
        };
    };

    var connection_callbacks = [];
    var disconnection_callbacks = [];

    gameEngine.onGamePadConnected = function(cb) {
        connection_callbacks.push(cb);
    };

    gameEngine.onGamePadDisconnected = function(cb) {
        disconnection_callbacks.push(cb);
    };

    function onGamePadConnected(event) {
        for(var i in connection_callbacks) {
            var callback = connection_callbacks[i];
            callback(event.gamepad.index);
        }
    }

    function onGamePadDisconnected(event) {
        for(var i in disconnection_callbacks) {
            var callback = disconnection_callbacks[i];
            callback(event.gamepad.index);
        }
    }

    window.addEventListener("gamepadconnected", onGamePadConnected, false);
    window.addEventListener("gamepaddisconnected", onGamePadDisconnected, false);
}());
