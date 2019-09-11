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
 * Class that creates color windows for the color picker, used to create three color windows,
 * one rainbow for setting base color, one alpha for setting transparency and the main one for 
 * picking the color.Each color window has two DOM canvas objects bottom one is for drawing the
 * design and the top one is for  drawing the selector.
 */
class ColorWindow {

    constructor(args = {}) {

        // default values
        this.args = Object.assign({
            pickerId: null,                    // picker DOM canvas id value
            selectorId: null,                  // selector DOM canvas id value

            // if selector should be centered in canvas
            centered: {
                vertically: false,
                horizontally: false
            },

            // canvas corner radius
            cornerRadius: {
                upperLeft: 7, upperRight: 7,
                lowerLeft: 7, lowerRight: 7
            },

            onRedraw: null,                   // method called when the UI must be redrawn
            onUpdate: null,                   // method called when mouse is down + move
            onInit: null                      // method called only once when object is initialized
        }, args);

        // get canvas and context
        this.pickerCanvas = document.getElementById(this.args.pickerId);
        this.selectorCanvas = document.getElementById(this.args.selectorId);
        this.pickerContext = this.pickerCanvas.getContext('2d');
        this.selectorContext = this.selectorCanvas.getContext('2d');
        if (!this.isElement(this.pickerCanvas) || !this.isElement(this.selectorCanvas)) {
            console.log("Canvas does not exist");
        }

        // set as global variable to class 
        if (this.args.onUpdate) {
            this.onUpdate = this.args.onUpdate;
        }
        if (this.args.onRedraw) {
            this.onRedraw = this.args.onRedraw;
        }
        if (this.args.onInit) {
            this.onInit = this.args.onInit;
        }
        this.centered = this.args.centered;
        this.cornerRadius = this.args.cornerRadius;

        this.position = { x: 0, y: 0 };         // selector position in canvas
        this.isRightMouseDown = false;          // if right mouse is pressed down

        // check if we're using a touch screen
        this.isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

        // switch to touch events if using a touch screen
        let mouseDown = this.isTouch ? 'touchstart' : 'mousedown';
        let mouseOut = this.isTouch ? 'touchcancel' : 'mouseout';
        let mouseUp = this.isTouch ? 'touchend' : 'mouseup';
        let mouseMove = this.isTouch ? 'touchmove' : 'mousemove';

        // add events to canvas
        let captureTarget = this.selectorCanvas.setCapture ? this.selectorCanvas : document;
        this.addEvent(mouseDown, this.selectorCanvas, this.mouseDown);
        this.addEvent(mouseUp, captureTarget, this.mouseUp);
        this.addEvent(mouseMove, captureTarget, this.mouseMove);

        this.onInit();
        this.onRedraw();
    }


    /**
     * Method called when the UI canvas, need to be redrawn, here you put
     * the logic for the redrawing.
     */
    onRedraw() {};

    /**
     * Method called when selector is move by the user, usually the method is
     * used to redraw the other windows if such exist. Or update text input 
     * values with current color value.
     */
    onUpdate() {};

    /**
     * Method called only the first time a new object is initialized, usually
     * used to cache canvas that is used on the redraw method instead of creating
     * it each time.
     */
    onInit() {};

    /**
     * Check if object is DOM element, since every DOM element implements
     * the Element interface
     * @param {Object} object 
     */
    isElement(object) {
        return object instanceof Element;
    };

    /**
     * Adds new event and attaches it to target element, with the
     * corresponding callback method
     * @param {String} eventName 
     * @param {DOM element} targetElement 
     * @param {Function} functionName 
     */
    addEvent(eventName, targetElement, callback) {
        if (targetElement.addEventListener) {
            // for modern browsers
            targetElement.addEventListener(eventName, (e = window.event) => {
                callback(e, this);
            }, false);
        } else if (targetElement.attachEvent) {
            // for Internet Explorer version below IE9
            targetElement.attachEvent("on" + eventName, (e = window.event) => {
                callback(e, this);
            });
        }
    };

    /**
     * Method that is called when the mouse is pressed down
     * (called from arrow function, that way -this word can be used)
     * @param {*} event 
     */
    mouseDown(event, self) {

        // for mobile and pc
        if (self.isTouch) {
            self.isRightMouseDown = true;
        } else {
            if ("which" in event) self.isRightMouseDown = (event.which == 1);
            else if ("button" in event) self.isRightMouseDown = (event.button == 0);
        }

        if (self.isRightMouseDown) {
            // if set capture is available use it
            if (self.selectorCanvas.setCapture) {
                self.selectorCanvas.setCapture();
            }
            self.move(event, true);
        }
    };

    /**
     * Method that is called when the mouse is released
     * (called from arrow function, that way -this word can be used)
     * @param {*} event 
     */
    mouseUp(event, self) {

        // for mobile and pc
        if (self.isTouch) {
            self.isRightMouseDown = false;
        } else {
            if ("which" in event) self.isRightMouseUp = (event.which == 1);
            else if ("button" in event) self.isRightMouseUp = (event.button == 0);
        }

        if (self.isRightMouseUp) {
            self.isRightMouseDown = false;
            if (self.selectorCanvas.releaseCapture) self.selectorCanvas.releaseCapture();
        }
    };

    /**
     * Method that is called when the mouse is moving
     * (called from arrow function, that way -this word can be used)
     * @param {*} event 
     */
    mouseMove(event, self) {

        if (self.isRightMouseDown) {
            self.move(event, true);
        }
    };

    /**
     * Get mouse or finger position depending on the device.
     * @param {*} event 
     */
    getCoordinates(event) {

        // for mobile and pc
        if (this.isTouch) {
            let touch = event.touches[0];
            return { x: touch.pageX, y: touch.pageY }
        } else {
            return { x: event.clientX, y: event.clientY };
        }
    };

    /**
     * Method that is called when selector need to be move to a new position.
     * @param {} event
     */
    move(event, insideCall = false) {

        let coordinates = this.getCoordinates(event);
        let x = coordinates.x;
        let y = coordinates.y;

        if (insideCall) {
            let rect = this.selectorCanvas.getBoundingClientRect();
            x -= rect.left;
            y -= rect.top;
        }

        if (this.centered.horizontally) {
            y = this.selectorCanvas.height / 2
        };

        if (this.centered.vertically) {
            x = this.selectorCanvas.width / 2
        };

        x = Math.round(x);
        y = Math.round(y);

        if (x < 0) x = 0;
        else if (x >= this.selectorCanvas.width) x = this.selectorCanvas.width - 1;

        if (y < 0) y = 0;
        else if (y >= this.selectorCanvas.height) y = this.selectorCanvas.height - 1;

        this.position = { x: x, y: y };
        this.redrawSelector(x, y);

        if (insideCall) {
            this.onUpdate(this);
        }
    };


    /**
     * Redraws the selector circle in the canvas
     * @param {Double} x 
     * @param {Double} y 
     */
    redrawSelector(x, y) {

        let context = this.selectorContext;
        context.clearRect(0, 0, this.selectorCanvas.width, this.selectorCanvas.height);
        context.beginPath();
        context.arc(x, y, 9, 0, 2 * Math.PI);
        context.lineWidth = 4;
        context.strokeStyle = "#FFFFFF";
        context.stroke();
    };

    /**
     * Method tha create round rectangle path, and uses composit operation 'destination-in' to clip
     * the path from the existing source and then draw black semi-transparent stroke.
     * @param {*} context 
     */
    clipRoundRect() {

        let context = this.pickerContext;

        context.roundRect(0, 0, this.pickerCanvas.width, this.pickerCanvas.height, this.cornerRadius);
        context.globalCompositeOperation = 'destination-in';
        context.fillStyle = 'black';
        context.fill();

        // add border
        context.globalCompositeOperation = 'source-over';
        context.lineWidth = 1;
        context.strokeStyle = 'rgba(0,0,0,0.3)';
        context.stroke();
    }

    /**
     * Static method that returns object with base given base color and string.
     * @param {*} baseColor 
     */
    static getBaseColor(baseColor) {
        return {
            color: baseColor,
            string: "rgb(" + baseColor.r + "," + baseColor.g + "," + baseColor.b + ")"
        }
    };
}
