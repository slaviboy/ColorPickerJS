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
 *  Number of classes that are used to convert from one color model to another, supported
 *  models are RGBA(HEX), CYMK, HSV and HSL.
 */

/**
* Class that convers RGBA value to different color models and vice versa:
* HSV  - Hue, Saturation, Value
* HSL  - Hue, Saturation, Lightness
* CMYK - Cyan, Magenta, Yellow, Black
* 
* +HEX - Hexadecimal (not a color model but RGB representation)
*/
class RGBAConverter {

    constructor(r = 0, g = 0, b = 0, a = 100) {
        this.rgba = new RGBA();
        this.cmyk = new CMYK();
        this.hsv = new HSV();
        this.hsl = new HSL();
        this.hex = new HEX();
        this.setRGBA(r, g, b, a);
    }

    setRGBA(r, g, b, a) {
        this.rgba.setRGBA(r, g, b, a);
        this.convertRGBA();
    }

    convertRGBA() {
        this._RGBAtoHSV();
        this._RGBAtoCMYK();
        this._RGBAtoHSL();
        this._RGBAtoHEX();
    }

    setCMYK(c, m, y, k) {
        this.cmyk.setCMYK(c, m, y, k);
        this._CMYKtoRGBA();

        this._RGBAtoHSV();
        this._RGBAtoHSL();
        this._RGBAtoHEX();
    }

    setHSV(h, s, v) {
        this.hsv.setHSV(h, s, v);
        this._HSVtoRGBA();

        this._RGBAtoCMYK();
        this._RGBAtoHSL();
        this._RGBAtoHEX();
    }

    setHSL(h, s, l) {
        this.hsl.setHSL(h, s, l);
        this._HSLtoRGBA();

        this._RGBAtoHSV();
        this._RGBAtoCMYK();
        this._RGBAtoHEX();
    }

    setHEX(hex) {
        this.hex.setHEX(hex);
        this._HEXtoRGBA();

        this._RGBAtoHSV();
        this._RGBAtoCMYK();
        this._RGBAtoHSL();
    }

    _HEXtoRGBA() {
        let bigint = parseInt(this.hex.hex, 16);
        this.rgba.r = (bigint >> 16) & 255;
        this.rgba.g = (bigint >> 8) & 255;
        this.rgba.b = bigint & 255;
    }

    _HSVtoRGBA() {

        let h = this.hsv.h / 360;
        let s = this.hsv.s / 100;
        let v = this.hsv.v / 100;
        let r, g, b;

        if (s == 0) {
            r = g = b = v;
        } else {
            let i = Math.floor(h * 6);
            let f = h * 6 - i;
            let p = v * (1 - s);
            let q = v * (1 - f * s);
            let t = v * (1 - (1 - f) * s);

            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
        }

        this.rgba.r = Math.floor(r * 255);
        this.rgba.g = Math.floor(g * 255);
        this.rgba.b = Math.floor(b * 255);
    };

    _HSLtoRGBA() {

        let h = this.hsl.h / 360;
        let s = this.hsl.s / 100;
        let l = this.hsl.l / 100;
        let r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            let HUEtoRGB = function HUEtoRGB(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = HUEtoRGB(p, q, h + 1 / 3);
            g = HUEtoRGB(p, q, h);
            b = HUEtoRGB(p, q, h - 1 / 3);
        }

        this.rgba.r = Math.round(r * 255);
        this.rgba.g = Math.round(g * 255);
        this.rgba.b = Math.round(b * 255);
    }

    _CMYKtoRGBA() {

        let c = this.cmyk.c / 100;
        let m = this.cmyk.m / 100;
        let y = this.cmyk.y / 100;
        let k = this.cmyk.k / 100;

        this.rgba.r = 1 - Math.min(1, c * (1 - k) + k);
        this.rgba.g = 1 - Math.min(1, m * (1 - k) + k);
        this.rgba.b = 1 - Math.min(1, y * (1 - k) + k);

        // normalize
        this.rgba.r = Math.round(this.rgba.r * 255);
        this.rgba.g = Math.round(this.rgba.g * 255);
        this.rgba.b = Math.round(this.rgba.b * 255);
    };

    _RGBAtoHEX() {
        let rgb = this.rgba.b | (this.rgba.g << 8) | (this.rgba.r << 16);
        this.hex.hex = (0x1000000 + rgb).toString(16).slice(1).toUpperCase();
    }

    _RGBAtoHSV() {

        let r = this.rgba.r / 255;
        let g = this.rgba.g / 255;
        let b = this.rgba.b / 255;

        let min = Math.min(r, g, b);
        let max = Math.max(r, g, b);
        let delta = max - min;

        this.hsv.v = max;
        this.hsv.s = max == 0 ? 0 : delta / max;

        if (max == min) {
            this.hsv.h = 0; // achromatic
        } else {
            switch (max) {
                case r: this.hsv.h = (g - b) / delta + (g < b ? 6 : 0); break;
                case g: this.hsv.h = (b - r) / delta + 2; break;
                case b: this.hsv.h = (r - g) / delta + 4; break;
            }
            this.hsv.h /= 6;
        }

        this.hsv.h = Math.round(this.hsv.h * 360);
        this.hsv.s = Math.round(this.hsv.s * 100);
        this.hsv.v = Math.round(this.hsv.v * 100);
    }

    _RGBAtoHSL() {

        let r = this.rgba.r / 255;
        let g = this.rgba.g / 255;
        let b = this.rgba.b / 255;

        let min = Math.min(r, g, b);
        let max = Math.max(r, g, b);
        let delta = max - min;

        this.hsl.l = (max + min) / 2;

        if (max == min) {
            // achromatic
            this.hsl.h = 0;
            this.hsl.s = 0;
        } else {
            this.hsl.s = this.hsl.l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

            switch (max) {
                case r: this.hsl.h = (g - b) / delta + (g < b ? 6 : 0); break;
                case g: this.hsl.h = (b - r) / delta + 2; break;
                case b: this.hsl.h = (r - g) / delta + 4; break;
            }
            this.hsl.h /= 6;
        }

        this.hsl.h = Math.round(this.hsl.h * 360);
        this.hsl.s = Math.round(this.hsl.s * 100);
        this.hsl.l = Math.round(this.hsl.l * 100);
    }

    _RGBAtoCMYK() {

        let r = this.rgba.r / 255;
        let g = this.rgba.g / 255;
        let b = this.rgba.b / 255;

        this.cmyk.k = Math.min(1 - r, 1 - g, 1 - b);

        if (this.cmyk.k != 1) {
            this.cmyk.c = (1 - r - this.cmyk.k) / (1 - this.cmyk.k);
            this.cmyk.m = (1 - g - this.cmyk.k) / (1 - this.cmyk.k);
            this.cmyk.y = (1 - b - this.cmyk.k) / (1 - this.cmyk.k);
        } else {
            this.cmyk.c = 0;
            this.cmyk.m = 0;
            this.cmyk.y = 0;
        }

        this.cmyk.c = Math.round(this.cmyk.c * 100);
        this.cmyk.m = Math.round(this.cmyk.m * 100);
        this.cmyk.y = Math.round(this.cmyk.y * 100);
        this.cmyk.k = Math.round(this.cmyk.k * 100);
    }
}

class RGBA { 
    constructor(r, g, b, a) {
        this.setRGBA(r, g, b, a);
    }

    setRGBA(r = 0, g = 0, b = 0, a = 100) {
        this.r = r;   // [0,255]
        this.g = g;   // [0,255]
        this.b = b;   // [0,255]
        this.a = a;   // [0,100]
    }

    toString() {
        return this.r + ", " + this.g + ", " + this.b + ", " + this.a + "%";
    }
}

class HEX {
    constructor(hex) {
        this.setHEX(hex);
    }

    setHEX(hex) {
        this.hex = hex;
    }

    toString() {
        return "#" + this.hex;
    }
}

class HSV { 
    constructor(h, s, v) {
        this.setHSV(h, s, v);
    }

    setHSV(h = 0, s = 0, v = 0) {
        this.h = h;   // [0,360]
        this.s = s;   // [0,100]
        this.v = v;   // [0,100]
    }

    toString() {
        return this.h + "°, " + this.s + "%, " + this.v + "%";
    }
}

class HSL { 
    constructor(h, s, l) {
        this.setHSL(h, s, l);
    }

    setHSL(h = 0, s = 0, l = 0) {
        this.h = h;   // [0,360]
        this.s = s;   // [0,100]
        this.l = l;   // [0,100]
    }

    toString() {
        return this.h + "°, " + this.s + "%, " + this.l + "%";
    }
}

class CMYK { 
    constructor(c, m, y, k) {
        this.setCMYK(c, m, y, k);
    }

    setCMYK(c = 0, m = 0, y = 0, k = 0) {
        this.c = c;   // [0,100]
        this.m = m;   // [0,100]
        this.y = y;   // [0,100]
        this.k = k;   // [0,100]
    }

    toString() {
        return this.c + "%, " + this.m + "%, " + this.y + "%, " + this.k + "%";
    }
}

