"use strict"
{
    /** @expose */
    if (window["CanvasRenderingContext2D"]) {

        // add round rectangle path to context
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {

            let min = Math.min(width, height);
            for (let key in radius) {
                if (min < 2 * radius[key]) radius[key] = min / 2;
            }

            this.beginPath();
            this.moveTo(x + radius.upperLeft, y);
            this.lineTo(x + width - radius.upperRight, y);
            this.quadraticCurveTo(x + width, y, x + width, y + radius.upperRight);
            this.lineTo(x + width, y + height - radius.lowerRight);
            this.quadraticCurveTo(x + width, y + height, x + width - radius.lowerRight, y + height);
            this.lineTo(x + radius.lowerLeft, y + height);
            this.quadraticCurveTo(x, y + height, x, y + height - radius.lowerLeft);
            this.lineTo(x, y + radius.upperLeft);
            this.quadraticCurveTo(x, y, x + radius.upperLeft, y);
            this.closePath();
        }

        /** @expose */
        CanvasRenderingContext2D.prototype.fillRoundRect = function (x, y, w, h, r) {
            this.roundRect(x, y, w, h, r);
            this.fill();
        };
        
        /** @expose */
        CanvasRenderingContext2D.prototype.strokeRoundRect = function (x, y, w, h, r) {
            this.roundRect(x, y, w, h, r);
            this.stroke();
        }; 
    }
}