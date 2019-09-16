/**
 * Centered color window, is the canvas from where the actual color picking is done.
 * The canvas is drawn from two layers the first one is made on initialization, and
 * the second one is made using the base color.
 */
class CenteredWindow extends ColorWindow {

    constructor(args) {
        super(args);
    }

    onInit() {

        // create new canvas with same size
        let canvas = document.createElement('canvas');
        canvas.width = this.pickerCanvas.width;
        canvas.height = this.pickerCanvas.height;
        let context = canvas.getContext('2d');

        // save temp canvas 
        this.tempCanvas = canvas;
        this.tempContext = context;
    }

    onRedraw() {

        if (!this.baseColor) {
            return;
        }

        // get canvas width and height
        let width = this.pickerCanvas.width;
        let height = this.pickerCanvas.height;
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        let baseColor = this.baseColor.color;
        let baseColorHalfString = "rgba(" + baseColor.r + "," + baseColor.g + "," + baseColor.b + ",";

        // clear temp canvas
        this.tempContext.globalCompositeOperation = 'source-over';
        this.tempContext.clearRect(0, 0, width, height);

        // draw gradient on temp canvas white->baseColor->black| (vertically)
        let gradient = this.tempContext.createLinearGradient(halfWidth, 0, halfWidth, height);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.5, baseColorHalfString + "1)");
        gradient.addColorStop(1, "black");
        this.tempContext.fillStyle = gradient;
        this.tempContext.fillRect(0, 0, width, height);

        // draw gradient on temp canvas baseColor->baseColor(transparent)| (horizontally)
        this.tempContext.globalCompositeOperation = 'destination-in';
        gradient = this.tempContext.createLinearGradient(0, halfHeight, width, halfHeight);
        gradient.addColorStop(0, baseColorHalfString + "1)");
        gradient.addColorStop(1, baseColorHalfString + "0)");
        this.tempContext.fillStyle = gradient;
        this.tempContext.fillRect(0, 0, width, height);

        // draw gradient white->black|(vertically)
        gradient = this.pickerContext.createLinearGradient(halfWidth, 0, halfWidth, height);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, "black");
        this.pickerContext.fillStyle = gradient;
        this.pickerContext.fillRect(0, 0, width, height);

        // draw temp canvas
        this.pickerContext.drawImage(this.tempCanvas, 0, 0);

        // clip round rectangle
        this.clipRoundRect();
    }
};





