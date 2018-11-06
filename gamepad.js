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
            }
        };
    };

    function onGamePadConnected(event) {
    }

    function onGamePadDisconnected(event) {
    }

    window.addEventListener("gamepadconnected", onGamePadConnected, false);
    window.addEventListener("gamepaddisconnected", onGamePadDisconnected, false);
}());
