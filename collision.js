gameEngine.collision = function() {
    return new function() {
        this.rectanglesCollide = function(rect1, rect2) {
            return (
                this.pointWithinRectangle({x: rect1.x,           y: rect1.y},           rect2) ||
                this.pointWithinRectangle({x: rect1.x + rect1.w, y: rect1.y},           rect2) ||
                this.pointWithinRectangle({x: rect1.x + rect1.w, y: rect1.y + rect1.h}, rect2) ||
                this.pointWithinRectangle({x: rect1.x,           y: rect1.y + rect1.h}, rect2) ||
                this.pointWithinRectangle({x: rect2.x,           y: rect2.y},           rect1) ||
                this.pointWithinRectangle({x: rect2.x + rect2.w, y: rect2.y},           rect1) ||
                this.pointWithinRectangle({x: rect2.x + rect2.w, y: rect2.y + rect2.h}, rect1) ||
                this.pointWithinRectangle({x: rect2.x,           y: rect2.y + rect2.h}, rect1)
            );
        };

        this.pointWithinRectangle = function(p, rect) {
            return (
                p.x >= rect.x && p.x <= rect.x + rect.w &&
                p.y >= rect.y && p.y <= rect.y + rect.h
            );
        };

        this.pointWithinCircle = function(point, circle) {
            return (
                Math.sqrt(Math.abs(Math.pow(point.y - circle.y, 2) + Math.pow(point.x - circle.x, 2))) < Math.abs(circle.radius)
            );
        };
    };
}();
