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
 * Module that initializes all three color windowses - dimming, circular and alpha and
 * set the events for the text inputs.
 */

"use strict"
{
    let converter = new RGBAConverter();
    let toolTipText = document.getElementById("tool-tip-text");
    let toolTipArrow = document.getElementById("tool-tip-arrow");

    /**
     * Events for text inputs containing hex values and for inputs with
     * integer values.
     */
    let inputEvents = {
        hex: {
            onfocus: function (e) {

                // remove hex tag
                this.value = this.value.replace(/[#]/g, '');
                this.previousValue = this.value;
            },
            onblur: function (e) {

                // change value to the one containing symbols
                let id = e.target.id;
                this.value = converter[id].toString();
            },
            oninput: function (e) {

                if (this.value == null || this.value.length < 1) {
                    return;
                }

                // cupoy caret position
                let start = this.selectionStart;
                let end = this.selectionEnd;

                // set value to upper case
                this.value = this.value.toUpperCase();

                // set new expected string leaving only hex characters
                let expected = this.value.match(/[a-f0-9]/gi);
                expected = (expected == null) ? "" : expected.join("");

                // if actual and expected string values match
                if (this.value.length == expected.length) {

                    if (expected.length == 6) {
                        converter.setHEX(expected);
                        updateValues();                   // update other inputs  
                        this.value = expected;            // keep the value withoud symbols
                        this.previousValue = this.value;  // set previous to current
                        updateCanvases();                 // update the canvases color and selector position 
                    }
                }
                this.setSelectionRange(start, end);       // restore caret position
            }
        },
        integer: {
            onfocus: function (e) {

                // remove symbols and keep only white spaces
                this.value = this.value.replace(/[°,%]/g, '');
                this.previousValue = this.value;
            },
            onblur: function (e) {

                // change value to the one containing symbols
                let id = e.target.id;
                this.value = converter[id].toString();
            },
            oninput: function (e) {

                if (this.value == null || this.value.length < 1) {
                    return;
                }
                let id = e.target.id;

                // set new expected string leaving only spaces, commas and numbers
                let expected = this.value.match(/[, 0-9]/gi);
                expected = (expected == null) ? "" : expected.join("");

                // if actual and expected string values match
                if (this.value.length == expected.length) {

                    // remove all white spaces(' ') and commas(',') and convert to integer array
                    let array = expected.split(/(?:,| )+/).map(function (item) {
                        let result = parseInt(item, 10);
                        return isNaN(result) ? Number.MAX_SAFE_INTEGER : result;
                    });

                    // check if values are in range
                    let maxArray = inputsProperties[id].maxValues;
                    if (array.length == maxArray.length) {
                        let isInRange = true;
                        for (let i = 0; i < array.length; i++) {
                            if (array[i] > maxArray[i]) {
                                isInRange = false;
                            }
                        }

                        if (isInRange) {
                            // get caret position
                            let start = this.selectionStart;
                            let end = this.selectionEnd;

                            if (array.length == 4) {
                                converter['set' + id.toUpperCase()](array[0], array[1], array[2], array[3]);
                            } else if (array.length == 3) {
                                converter['set' + id.toUpperCase()](array[0], array[1], array[2]);
                            }

                            updateValues();                     // update other inputs 
                            this.value = array.join(' ');       // keep the value withoud symbols
                            this.previousValue = this.value;    // set previous to current
                            updateCanvases();                   // update the canvases color and selector position
                            this.setSelectionRange(start, end); // restore caret position
                        }
                    }

                }
            }
        }
    };

    /**
     * Object with input properties used in input events, to check range
     * and the event type.
     */
    let inputsProperties = {
        hex: {
            eventType: 'hex'
        },
        cmyk: {
            maxValues: [100, 100, 100, 100],
            eventType: 'integer'
        },
        hsv: {
            maxValues: [360, 100, 100],
            eventType: 'integer'
        },
        hsl: {
            maxValues: [360, 100, 100],
            eventType: 'integer'
        },
        rgba: {
            maxValues: [255, 255, 255, 100],
            eventType: 'integer'
        }
    };

    // get DOM input elements
    let inputsEventsName = ['onfocus', 'onblur', 'oninput'];
    let inputs = {};

    for (let key in inputsProperties) {

        // add the custom long press event
        let element = document.getElementById(key);
        element.addEventListener("longpress", function (e) {

            // copy text with symbols to clipboard
            let id = e.target.id;
            let start = e.target.selectionStart;
            let end = e.target.selectionEnd;
            let withoutSymbols = this.value;
            let withSymbols = converter[id].toString();
            e.target.value = withSymbols;
            e.target.select();
            document.execCommand('cut');
            e.target.value = withoutSymbols;
            e.target.setSelectionRange(start, end);

            // change tool tip text
            toolTipText.innerText = id.toUpperCase() + ' value is copied';
        });

        // set events
        for (let j = 0; j < inputsEventsName.length; j++) {
            let prop = inputsProperties[key].eventType;
            element[inputsEventsName[j]] = inputEvents[prop][inputsEventsName[j]];
        }

        inputs[key] = element;
    }

    // rest tool tip text, when the mouse leavs the text section
    let textSection = document.getElementById('text-section');
    textSection.addEventListener("mouseleave", function (e) {
        toolTipText.innerText = 'Use long press to copy value';
    });

    /**
     * Update canvases to match the new color and set the selectors
     * new positions.
     */
    function updateCanvases() {

        // get hsv values
        let h = converter.hsv.h;
        let s = converter.hsv.s;
        let v = converter.hsv.v;

        // set base color, s and v values are always 100% for base color
        converter.setHSV(h, 100, 100);
        setBaseColor({
            r: converter.rgba.r,
            g: converter.rgba.g,
            b: converter.rgba.b
        });

        let rY = dimmingWindow.pickerCanvas.height - 1 -
            (v / 100) * dimmingWindow.pickerCanvas.height;
        dimmingWindow.move({ clientX: 0, clientY: rY });

        let radius = (s / 100) * (circularWindow.pickerCanvas.width / 2);
        let center = {
            x: circularWindow.pickerCanvas.width / 2,
            y: circularWindow.pickerCanvas.height / 2
        };
        let rotatedPoint = CircularWindow.rotate(
            center.x,
            center.y,
            center.x + radius,
            center.y,
            -h);
        circularWindow.move({ clientX: rotatedPoint.x, clientY: rotatedPoint.y });
        circularWindow.dimmingFactor = dimmingWindow.position.y / dimmingWindow.pickerCanvas.height;

        converter.setHSV(h, s, v);

        // set selector position for the alpha window
        let aHeight = alphaWindow.selectorCanvas.height;
        let aY = ((converter.rgba.a / 100) * aHeight);
        alphaWindow.move({ clientX: 0, clientY: aY });

        // redraw all windows exept the dimming one
        circularWindow.onRedraw();
        alphaWindow.onRedraw();
        dimmingWindow.onRedraw();
    }

    /**
     * Update inputs text values, to match the rgba converter object
     * string values 
     */
    function updateValues() {

        // uptate inputs values
        for (let key in inputsProperties) {
            inputs[key].value = converter[key].toString();
        }

        // change tool tip color to match the base color 
        toolTipText.style.backgroundColor = dimmingWindow.baseColorString;
        toolTipArrow.style.borderRightColor = dimmingWindow.baseColorString;
    }

    /**
     * Update the HSV value using the circularWindow and dimmingWindow selector position
     * in tha canvases.
     */
    function updateHSV() {

        converter.setHSV(circularWindow.degree, 100, 100);
        setBaseColor({
            r: converter.rgba.r,
            g: converter.rgba.g,
            b: converter.rgba.b,
            a: 100
        });

        circularWindow.dimmingFactor = dimmingWindow.position.y / dimmingWindow.pickerCanvas.height;

        let s = 100 * (circularWindow.distance / (circularWindow.pickerCanvas.width / 2));
        let v = 100 - 100 * (dimmingWindow.position.y / (dimmingWindow.pickerCanvas.height));
        s = Math.round(s);
        v = Math.round(v);

        converter.setHSV(circularWindow.degree, s, v);
        updateValues();
    }


    // set global base color
    let baseColor = {};
    function setBaseColor(rgba) {
        baseColor = ColorWindow.getBaseColor(rgba);
        circularWindow.baseColor = baseColor;
        dimmingWindow.baseColor = baseColor;
        alphaWindow.baseColor = baseColor;
    }




    // color window from which the actual color picking is done
    let circularWindow = new CircularWindow({
        pickerId: "circular-window",
        selectorId: "circular-window-selector"
    });
    circularWindow.onUpdate = function () {
        updateHSV();
        dimmingWindow.onRedraw();
        alphaWindow.onRedraw();
    }


    // color window where the dimming effect is made
    let dimmingWindow = new DimmingWindow({
        pickerId: "dimming-window",
        selectorId: "dimming-window-selector"
    });
    dimmingWindow.onUpdate = function () {
        updateHSV();
        alphaWindow.onRedraw();
        circularWindow.onRedraw();
    }


    // color window from which the opacity is selected
    let alphaWindow = new AlphaWindow({
        pickerId: "alpha-window",
        selectorId: "alpha-window-selector"
    });
    alphaWindow.onUpdate = function () {
        let alpha = Math.round((this.position.y) / (this.pickerCanvas.height / 100));
        converter.rgba.a = alpha;
        updateValues();
    }


    // set default value
    converter.setRGBA(74, 126, 186, 70);
    updateValues();
    updateCanvases();
}