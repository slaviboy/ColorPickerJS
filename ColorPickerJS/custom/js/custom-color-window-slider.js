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
    let alphaWindowHorizontal = new AlphaWindow({
        pickerId: "alpha-horizontal-window",
        selectorId: "alpha-horizontal-window-selector",
        centered: {
            horizontally: true
        }
    });

    let alphaWindowVertical = new AlphaWindow({
        pickerId: "alpha-vertical-window",
        selectorId: "alpha-vertical-window-selector",
        centered: {
            vertically: true
        }
    });



    let dimmingWindowHorizontal = new DimmingWindow({
        pickerId: "dimming-horizontal-window",
        selectorId: "dimming-horizontal-window-selector",
        centered: {
            horizontally: true
        }
    });

    let dimmingWindowVertical = new DimmingWindow({
        pickerId: "dimming-vertical-window",
        selectorId: "dimming-vertical-window-selector",
        centered: {
            vertically: true
        }
    });




    let rainbowWindowHorizontal = new RainbowWindow({
        pickerId: "rainbow-horizontal-window",
        selectorId: "rainbow-horizontal-window-selector",
        centered: {
            horizontally: true
        }
    });

    let rainbowWindowVertical = new RainbowWindow({
        pickerId: "rainbow-vertical-window",
        selectorId: "rainbow-vertical-window-selector",
        centered: {
            vertically: true
        }
    });




    // set global base color
    let baseColor = {};
    function setBaseColor(rgba) {
        baseColor = ColorWindow.getBaseColor(rgba);

        // set base colors for the color windows 
        alphaWindowHorizontal.baseColor = baseColor;
        alphaWindowVertical.baseColor = baseColor;
        dimmingWindowHorizontal.baseColor = baseColor;
        dimmingWindowVertical.baseColor = baseColor;

        alphaWindowHorizontal.onRedraw();
        alphaWindowVertical.onRedraw();
        dimmingWindowHorizontal.onRedraw();
        dimmingWindowVertical.onRedraw(); 
    }






    setBaseColor({ r: 255, g: 50, b: 0 }); 
    alphaWindowHorizontal.move({ clientX: 55, clientY: 0 }); 
    alphaWindowVertical.move({ clientX: 0, clientY: 55 }); 
    dimmingWindowHorizontal.move({ clientX: 55, clientY: 0 }); 
    dimmingWindowVertical.move({ clientX: 0, clientY: 55 }); 
    rainbowWindowHorizontal.move({ clientX: 55, clientY: 0 }); 
    rainbowWindowVertical.move({ clientX: 0, clientY: 55 }); 
}