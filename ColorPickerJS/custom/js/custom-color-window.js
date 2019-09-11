/* 
 * Free ColorPicker (JavaScript)
 * 
 * Copyright (c) 2019 Stanislav Georgiev. (MIT License)
 * https://github.com/slaviboy
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 * 
 * Demonstration how to create custom color window using the ColorWindow class and
 * how to set custom events.
 */

"use strict"
{
    // set your base color
    let baseColor = {
        r: 255,
        g: 20,
        b: 120
    };

    // first attach DOM canvases by id
    let customWindow = new ColorWindow({
        pickerId: "custom-window",
        selectorId: "custom-window-selector",
        onUpdate: function () {
            // here you specify what you want to do after selector is moved
            // usually updating the other color windows
        }, 
        onInit: customWindowInit,
        onRedraw: customWindowRedraw
    });

    // init method
    function customWindowInit() {

        // create new canvas with same size
        let canvas = document.createElement('canvas');
        canvas.width = this.pickerCanvas.width;
        canvas.height = this.pickerCanvas.height;
        let context = canvas.getContext('2d');

        // save temp canvas 
        this.tempCanvas = canvas;
        this.tempContext = context;
    };

    // redraw method
    function customWindowRedraw() {

        // here you specify what you want to draw on the UI part
        // of the color window

        // get canvas width and height
        let width = this.pickerCanvas.width;
        let height = this.pickerCanvas.height;
        let halfWidth = width / 2;
        let halfHeight = height / 2;
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
        gradient = this.tempContext.createLinearGradient(0, halfHeight, width, height);
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
    };

    customWindow.move({
        clientX: customWindow.pickerCanvas.width / 2,
        clientY: customWindow.pickerCanvas.height / 2
    });

}