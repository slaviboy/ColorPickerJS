/**
 * Alpha color window is the window from which the opacity is selected.
 * Alpha value is in range between [0,100].
 */
class AlphaWindow extends ColorWindow {

    constructor(args) {
        super(args);
 
        this.blockSize = (args.blockSize) ? args.blockSize : 5;
        this.blockFillStyle = (args.blockFillStyle) ? args.blockFillStyle : "#CCCCCC";
        this.onInit();

         // default centered selector
         if (!this.centered.vertically && !this.centered.horizontally) {
            this.centered = {
                vertically: true
            };
            this.onRedraw();
        }
    }

    onInit() {

        if (!this.blockSize) {
            return;
        }

        // create temp canvas and context
        let canvas = document.createElement('canvas');
        canvas.width = this.pickerCanvas.width;
        canvas.height = this.pickerCanvas.height;
        let context = canvas.getContext('2d');

        // draw white rectangle
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = this.blockFillStyle;

        // draw small gray blocks
        let rows = (canvas.height / this.blockSize);    // number of rows to fit
        let columns = (canvas.width / this.blockSize);  // number of columns to fit 
        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < columns / 2; ++j) {
                context.fillRect(
                    2 * j * this.blockSize + (i % 2 ? 0 : this.blockSize),
                    i * this.blockSize, this.blockSize, this.blockSize
                );
            }
        }

        this.firstLayerCanvas = canvas;
    }

    onRedraw() {

        if (!this.baseColor) {
            return;
        }

        let width = this.pickerCanvas.width;
        let height = this.pickerCanvas.height;

        // draw first layer
        this.pickerContext.drawImage(this.firstLayerCanvas, 0, 0);

        // draw second gradient layer (TRANSPARENT->baseColor)(vertically) 
        let x1, y1, x2, y2;
        if (this.centered.vertically) {
            x1 = 0;
            y1 = 0;
            x2 = 0;
            y2 = height;
        } else {
            x1 = 0;
            y1 = 0;
            x2 = width;
            y2 = 0;
        }

        let fillGradien = this.pickerContext.createLinearGradient(x1, y1, x2, y2);
        let rgba = this.baseColor.color;
        fillGradien.addColorStop(0, 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',0)');
        fillGradien.addColorStop(1, this.baseColor.string);
        this.pickerContext.fillStyle = fillGradien;
        this.pickerContext.fillRect(0, 0, width, height);

        this.clipRoundRect();
    }
};