colorPicker
===========

An advanced javaScript color picker (desktop use) using color.js for color conversion / calculation...

See demo at http://dematte.at/cpn

All the W3C 2.0 calculations are also based on alpha levels on all layers<br>
Supported color spaces: (*: also displayed as colors)<br>
rgb *, hsv(b) *, hsl *, cmyk, cmy, Lab, XYZ, HEX

Uses, with IE9+ and internet browsers, only one .js file (no extra HTML, CSS, images, etc...), works though in all browsers and also on IE6+ (an extra CSS has to be made to make it work in IE6 though)

Convertions of 182 color space combinations (rgb2HSV, RGB2hsl, rgb2RGB, HEX2Lab, ...)

<pre>
var myColors = new Colors({ // all options have a default value...
    color: 'rgba(204, 82, 37, 0.8)', // initial color (#RGB, RGB, #RRGGBB, RRGGBB, rgb(r, g, b), ...)
    XYZMatrix: ..., // Observer = 2° (CIE 1931), Illuminant = D65  --- see source for dedtails
    XYZReference: ..., // back reference to XYZMatrix --- see source for dedtails
    grey: {r: 0.298954, g: 0.586434, b: 0.114612}, // CIE-XYZ 1931
    luminance: {r: 0.2126, g: 0.7152, b: 0.0722}, // W3C 2.0
    valueRanges: {rgb: {r: [0, 255], g: [0, 255], b: [0, 255]}, hsv:...}, // skip ranges if no conversion required
    customBG: '#808080' // the solid bgColor behind the chosen bgColor (saved color)
    convertCallback: function(colors, type){}, // callback function after color convertion for further calculations...
    allMixDetails: false // if set to true, Colors deliveres some more mixed layer informations for all color layers
});

colorPicker uses an instance of Colors and passes the options to it, so some values are the same...

var myColorPicker = new ColorPicker({
    color: ..., // see Colors...
    mode: 'rgb-b', // initial mode the color picker is starting with
    fps: 60, // the framerate colorPicker refreshes the display if no 'requestAnimationFrame'
    delayOffset: 8, // pixels offset when shifting mouse up/down inside input fields before it starts acting as slider
    CSSPrefix: 'cp-', // the standard prefix for (almost) all class declarations (HTML, CSS)
    size: 0, // one of the 4 sizes: 0 = L (large), 1 = S, 2 = XS, 3 = XXS; resize to see what happens...
    allMixDetails: true, // see Colors...
    alphaBG: 'w' // initial 3rd layer bgColor (w = white, c = custom (customBG), b = black);
    customBG: '#808080' // see Colors...
    noAlpha: true, // disable alpha input (all sliders are gone and current alpha therefore locked)
    cmyOnly: false, // display CMY instead of CMYK
    memoryColors: [{r: 100, g: 200, b: 10, a: 0.8}, ...] // array of colors in memory section
    opacityPositionRelative: undefined, // render opacity slider arrows in px or %
    customCSS: undefined, // if external stylesheet, internal will be ignored...
    appenTo: document.body, // the HTMLElement the colorPicker will be appended to on initialization
    noRangeBackground: false, // performance option: doesn't render backgrounds in input fields if set to false
    textRight: false, // not supported yet. Make numbers appear aligned right
    noHexButton: false, // button next to HEX input could be used for some trigger...
    noResize: false, // enable / disable resizing of colorPicker
    noRGBr: false, // active / passive button right to RGB-R display. Disables rendering of 'real' color possibilities...
    noRGBg: false, // same as above
    noRGBb: false, // same as above
    CSSStrength: 'div.', // not in use
    XYZMatrix: ..., // see Colors...
    XYZReference: ..., // see Colors...
    grey: ..., // see Colors...
    luminance: ..., // see Colors...
    renderCallback: // function(colors, mode){}, // callback on after rendering (for further rendering outside colorPicker)
    actionCallback: function(e, action){}, // callback on any action within colorPicker (buttons, sliders, ...)
    convertCallback: function(colors, type){}, // see Colors...
});

After initializing Color or ColorPicker you'll get a clean but rhich model of the instance:

Color: {
    colors: {all kinds of color values...},
    options: {all the options you set or that are set as default...},
    __proto__: { // all methods Color uses
        setColor: function(newCol, type, alpha) {},
        getColor: function(type) {},
        setCustomBackground: function(col) {},
        saveAsBackground: function() {},
        convertColor: function(color, type) {} // converts 182 different combinations
    }
}

ColorPicker: {
    color: { // instance of Color inside colorPicker
        colors: {all kinds of color values...},
        options: {all the options you set or that are set as default...}
    },
    nodes: {all kinds of cashed nodes, textNodes and styles, etc...},
    __proto__: { // all methods ColorPicker uses
        setColor: function(newCol, type, alpha, forceRender) {},
        startRender: function(oneTime) {},
        stopRender: function() {},
        setCustomBackground: function(col) {},
        saveAsBackground: function() {},
        setMode: function(mode) {},
        destroyAll: function() {}
    }
}

The klass ColorPicker has some functions attached, used inside, exported for convenience...

ColorPicker.addEvent = function(obj, type, func){}; // with built in cashe
ColorPicker.removeEvent = function(obj, type, func){};
ColorPicker.getOrigin = function(elm){};
ColorPicker.limitValue = function(value, min, max){};
ColorPicker.changeClass = function(elm, cln, newCln){}; // a bit tricky to use...
</pre>
