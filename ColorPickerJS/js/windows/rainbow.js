/**
 * Rainbow color window, is responsible for the base color selection.
 */
class RainbowWindow extends ColorWindow {

    constructor(args) {
        super(args);

        // default centered selector
        if (!this.centered.vertically && !this.centered.horizontally) {
            this.centered = {
                vertically: true
            };
            this.onRedraw();
        }
    }

    // set the method that redraws the canvas beneath the selector
    onRedraw() {

        let context = this.pickerContext;
        let width = this.pickerCanvas.width;
        let height = this.pickerCanvas.height;

        // set fill rainbow gradient color
        let fillColors = [
            "#f00", "#f0f", "#00f", "#0ff", "#0f0", "#ff0", "#f00"
        ];
        let fillColorStops = [
            0.00, 0.2, 0.35, 0.5, 0.65, 0.8, 1
        ];

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

        let fillGradient = context.createLinearGradient(x1, y1, x2, y2);
        for (let i = 0; i < fillColors.length; i++) {
            fillGradient.addColorStop(fillColorStops[i], fillColors[i]);
        }
        context.fillStyle = fillGradient;
        context.fillRect(0, 0, this.pickerCanvas.width, this.pickerCanvas.height);

        this.clipRoundRect();
    }
};