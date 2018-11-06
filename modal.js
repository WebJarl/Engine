(function() {
    var open_modal;
    var backdrop;
    var modal_content;

    gameEngine.openModal = function(template) {
        if(!open_modal) {
            open_modal = document.createElement("DIV");
            open_modal.style.position = "fixed";
            open_modal.style.top = "50%";
            open_modal.style.left = "50%";
            open_modal.style.transform = "translate(-50%, -50%)";
            open_modal.style.mozTransform = "translate(-50%, -50%)";
            open_modal.style.msTransform = "translate(-50%, -50%)";
            open_modal.style.webkitTransform = "translate(-50%, -50%)";
            open_modal.style.backgroundColor = "white";
            open_modal.style.zIndex = 2;
            open_modal.style.fontFamily = "sans-serif";
            open_modal.style.boxShadow = "4px 4px 8px rgba(32, 32, 32, 0.5)";
            open_modal.style.borderRadius = "3px";
            open_modal.style.boxSizing = "border-box";
            document.body.appendChild(open_modal);

            var title_bar = document.createElement("DIV");
            title_bar.style.width = "100%";
            title_bar.style.backgroundColor = "rgb(64, 24, 212)";
            title_bar.style.textAlign = "right";
            title_bar.style.boxSizing = "border-box";
            open_modal.appendChild(title_bar);

            var close_button = document.createElement("DIV");
            close_button.innerHTML = "X";
            close_button.style.display = "inline-block";
            close_button.style.backgroundColor = "rgb(212, 64, 24)";
            close_button.style.color = "white";
            close_button.style.textAlign = "center";
            close_button.style.fontSize = "12px";
            close_button.style.fontWeight = "bold";
            close_button.style.padding = "4px";
            close_button.style.width = "12px";
            close_button.style.height = "12px";
            close_button.style.userSelect = "none";
            close_button.style.msUserSelect = "none";
            close_button.style.mozUserSelect = "none";
            close_button.style.webkitUserSelect = "none";
            close_button.style.webkitTouchCallout = "none";
            close_button.style.khtmlUserSelect = "none";
            close_button.onclick = gameEngine.closeModal;
            title_bar.appendChild(close_button);

            modal_content = document.createElement("DIV");
            modal_content.style.height = "100%";
            modal_content.style.width = "100%";
            modal_content.style.padding = "16px";
            modal_content.style.fontSize = "24px";
            modal_content.style.boxSizing = "border-box";
            open_modal.appendChild(modal_content);
        }

        if(!backdrop) {
            backdrop = document.createElement("DIV");
            backdrop.style.position = "fixed";
            backdrop.style.x = 0;
            backdrop.style.y = 0;
            backdrop.style.width = "100vw";
            backdrop.style.height = "100vh";
            backdrop.style.backgroundColor = "rgb(64, 64, 64)";
            backdrop.style.zIndex = 1;
            document.body.appendChild(backdrop);
        }

        modal_content.innerHTML = template;
        open_modal.style.display = "block";
        backdrop.style.display = "block";
        gameEngine.pause();
    };

    gameEngine.openModalFromTemplate = function(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'html';
        request.send();
        request.onload = function() {
            gameEngine.openModal(request.response);
        };
        request.onerror = function() {
            console.error("Error opening modal from template: ", url);
        };
    };

    gameEngine.closeModal = function() {
        if(open_modal) {
            open_modal.style.display = "none";
        }
        if(backdrop) {
            backdrop.style.display = "none";
        }
        gameEngine.unpause();
    };
}());
