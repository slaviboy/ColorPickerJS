/**
 * Circular color window, is the canvas from where the base color and lightness
 * are selected. Base color correspond to selector angle, and the lightness is
 * determined by selector distance from the center.
 */
class CircularWindow extends ColorWindow {

    constructor(args) {
        super(args);
    }

    onInit() {
        this.position = { x: this.pickerCanvas.width - 1, y: this.pickerCanvas.height - 1 };

        // create new canvas temp canvas
        let canvas = document.createElement('canvas');
        canvas.width = this.pickerCanvas.width;
        canvas.height = this.pickerCanvas.height;
        let context = canvas.getContext('2d');

        let center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        let sx = center.x;
        let sy = center.y;

        // create stroke line, that are rotated creating circular rainbow effect
        for (let i = 0; i < 360; i += 0.1) {
            let rad = i * (2 * Math.PI) / 360;

            // create white->color gradient
            let grad = context.createLinearGradient(
                center.x,
                center.y,
                center.x + sx * Math.cos(rad),
                center.y + sy * Math.sin(rad));
            grad.addColorStop(0, "white");
            grad.addColorStop(1, "hsla(" + i + ", 100%, 50%, 1.0)");

            context.strokeStyle = grad;
            context.beginPath();
            context.moveTo(center.x, center.y);
            context.lineTo(center.x + sx * Math.cos(rad), center.y + sy * Math.sin(rad));
            context.stroke();
        }

        this.clipCircle(canvas, context);
        
        // save first layer beforehand for faster performance 
        this.firstLayerCanvas = canvas;
    }

     /**
     * Method tha create round rectangle path, and uses composit operation 'destination-in'
     *  to clip the path from the existing source.
     * @param {*} context 
     */
    clipCircle(canvas, context) { 

        context.lineWidth = 1;
        context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 1, 0, 2 * Math.PI, false);
        context.globalCompositeOperation = 'destination-in';
        context.fillStyle = 'black';
        context.fill();
        context.globalCompositeOperation = 'source-over';
    }

    onRedraw() {

        // draw first layer
        this.pickerContext.clearRect(0, 0, this.pickerCanvas.width, this.pickerCanvas.height);
        this.pickerContext.drawImage(this.firstLayerCanvas, 0, 0);

        let center = {
            x: this.pickerCanvas.width / 2,
            y: this.pickerCanvas.height / 2
        };
        let radius = this.pickerCanvas.width / 2 - 1;

        // draw dimming circle
        this.pickerContext.fillStyle = "rgba(0,0,0," + this.dimmingFactor + ")";
        this.pickerContext.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        this.pickerContext.fill();
    }

    move(event, insideCall = false) {

        let coordinates = this.getCoordinates(event);
        let x = coordinates.x;
        let y = coordinates.y;

        if (insideCall) {
            let rect = this.selectorCanvas.getBoundingClientRect();
            x -= rect.left;
            y -= rect.top;
        }

        let center = {
            x: this.pickerCanvas.width / 2,
            y: this.pickerCanvas.height / 2
        };

        // get degree [0, 360]
        let degree = CircularWindow.angle(center.x, center.y, x, y);
        degree = Math.round(degree);

        // get distance from the center to the selector
        let dist = Math.sqrt(
            Math.pow((x - center.x), 2) +
            Math.pow((y - center.y), 2));

        // limit selector position to circle bound
        let radius = this.pickerCanvas.width / 2;
        if (dist > radius) {
            let ratio = (radius) / dist;
            x = (1 - ratio) * center.x + ratio * x;
            y = (1 - ratio) * center.y + ratio * y;

            dist = radius;
        }

        this.degree = degree;
        this.distance = dist;
        this.position = { x: x, y: y };

        this.redrawSelector(x, y);

        if (insideCall) {
            this.onUpdate(this);
        }
    }

    /**
     * Get angle between the horizontal line parallel to the center (cx,cy),
     * and line from the center to the point (x,y)
     * @param {*} cx 
     * @param {*} cy 
     * @param {*} ex 
     * @param {*} y 
     */
    static angle(cx, cy, x, y) {
        let dy = y - cy;
        let dx = x - cx;
        let theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
    }

    /**
     * Rotate point with coordinates (x,y) around center with coordinates
     * (cx,cy), with given angle.
     * @param {*} cx center x
     * @param {*} cy center y
     * @param {*} x rotational point x
     * @param {*} y rotation point y
     * @param {*} angle angle in degrees
     */
    static rotate(cx, cy, x, y, angle) {
        let radians = (Math.PI / 180) * angle;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        return {
            x: (cos * (x - cx)) + (sin * (y - cy)) + cx,
            y: (cos * (y - cy)) - (sin * (x - cx)) + cy
        };
    }

} 