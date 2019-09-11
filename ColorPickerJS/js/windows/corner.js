/**
 * Corner color window, is the canvas from where the actual color picking is 
 * done. 
 */
class CornerWindow extends ColorWindow {
    
    constructor(args) {
        super(args);
    }
 
    onInit() {

        this.position = { x: this.pickerCanvas.width - 1, y: this.pickerCanvas.height - 1 };

        // create new canvas with same size
        let canvas = document.createElement('canvas');
        canvas.width = this.pickerCanvas.width;
        canvas.height = this.pickerCanvas.height;
        let context = canvas.getContext('2d');

        // create the first gradient layer [White->Black](vertically)
        let gradient = context.createLinearGradient(canvas.width / 2, 0, canvas.width / 2, canvas.height);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, "black");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // draw another gradinet using -xor [Transparent->Black](horizontally)
        context.globalCompositeOperation = 'xor';
        gradient = context.createLinearGradient(0, canvas.height / 2, canvas.width, canvas.height / 2);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, "black");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // save first layer beforehand for faster performance 
        this.firstLayerCanvas = canvas;
    }

    onRedraw() {

        if (!this.baseColor) {
            return;
        }

        let width = this.pickerCanvas.width;
        let height = this.pickerCanvas.height;

        // create the second gradient layer [baseColor->Black](vertically)
        let gradient = this.pickerContext.createLinearGradient(width / 2, 0, width / 2, height);
        gradient.addColorStop(0, this.baseColor.string);
        gradient.addColorStop(1, "black");

        // draw gradient
        this.pickerContext.globalCompositeOperation = 'source-over';
        this.pickerContext.fillStyle = gradient;
        this.pickerContext.fillRect(0, 0, width, height);

        // draw first layer
        this.pickerContext.drawImage(this.firstLayerCanvas, 0, 0);

        // clip
        this.clipRoundRect();
    }
}
