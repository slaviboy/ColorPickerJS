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
 * Module that attaches mouse or touch events to document, by detecting the child
 * and using requestAnimationFrame as timer it can detect long press for different
 * DOM elements.
 */
"use strict"
{
    let frameId = null;

    // check if we're using a touch screen and set the corresponding events
    let isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

    // set events for mobile or pc browsers
    let touchEvents = ['touchstart', 'touchend', 'touchcancel', 'touchmove'];
    let mouseEvents = ['mousedown', 'mouseup', 'mouseout', 'mousemove'];
    let concatArray = isTouch ? touchEvents : mouseEvents;
    let events = concatArray.concat(['wheel', 'scroll', 'contextmenu']);
    let listeners = [start, stop, stop, stop, stop, stop,
        (events[0].indexOf('touch') === 0) ? cancelEvent : stop];

    // hook events with listener methods
    for (let i = 0; i < events.length; i++) {
        document.addEventListener(events[i], listeners[i], true);
    }
 
    // patch CustomEvent to allow constructor creation (IE/Chrome)
    if (typeof window.CustomEvent !== 'function') {

        window.CustomEvent = function (event, params) {

            params = params || { bubbles: false, cancelable: false, detail: undefined };
            let e = document.createEvent('CustomEvent');
            e.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return e;
        };
        window.CustomEvent.prototype = window.Event.prototype;
    }


    /**
     * Use requestAnimationFrame() to detect when delay time is reached and fire callback
     * @param {Function} callback The callback function
     * @param {Integer} delay The delay in ms 
     */
    function requestTimeout(callback, delay) {

        let then;

        let loop = function (now) {
            if (!then) {
                then = now;
            }
            let delta = now - then;

            if (delta >= delay) {
                callback.call();
            } else {
                frameId = requestAnimationFrame(loop);
            }
        };
        frameId = requestAnimationFrame(loop);
    }
  
    /**
     * Fires the 'longpress' event on element 
     */
    function fireLongPressEvent() {

        stop();

        // fire the longpress event
        let event = new CustomEvent('longpress', { bubbles: true, cancelable: true });
        this.dispatchEvent(event);
    }

    /**
     * Method responsible for starting the long press timer
     * @param {event} e - event object 
     */
    function start(e) {
        stop(e);

        // get delay from html attribute if it exists, otherwise default to 500
        let longPressDelayInMs = parseInt(e.target.getAttribute('data-long-press-delay'), 10) || 500;

        // start the timer
        requestTimeout(fireLongPressEvent.bind(e.target), longPressDelayInMs);
    }

    /**
     * Method responsible for clearing a pending long press timer
     * @param {event} e - event object 
     */
    function stop(e) {
        if (frameId) {
            window.cancelAnimationFrame(frameId);
        }
        frameId = null;
    }

    /**
    * Cancels the current event
    * @param {object} e - browser event object 
    */
    function cancelEvent(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
    }
}
