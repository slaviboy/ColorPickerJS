/**
 * Dimming color window, is the canvas from where the dimming is set.
 */
class DimmingWindow extends ColorWindow {

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

        if (!this.baseColor) {
            return;
        }

        let width = this.pickerCanvas.width;
        let height = this.pickerCanvas.height;

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

        // create linear gradient baseColor->black (vertically)
        let fillGradien = this.pickerContext.createLinearGradient(x1, y1, x2, y2);
        fillGradien.addColorStop(0, this.baseColor.string);
        fillGradien.addColorStop(1, 'black');
        this.pickerContext.fillStyle = fillGradien;
        this.pickerContext.fillRect(0, 0, width, height);

        this.clipRoundRect();
    }

}