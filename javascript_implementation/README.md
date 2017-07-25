
# javaScript implementation (IE8+ or with querySelectorAll polyfill)

Some description follows soon...

## Demo
See **demo** at [dematte.at/cpn/javaScript_implementation](http://dematte.at/cpn/javaScript_implementation)

## Usage

```javascript
    jsColorPicker('input.color');
    // description of option will follow
    jsColorPicker('input.color', {
        klass: window.ColorPicker,
        input: elm,
        patch: elm,
        init: function(elm, colors){}, // initialization callback (before colorPicker gets initialized though)
        // animationSpeed: 200, will be supported soon
        // draggable: true,
        multipleInstances: false
        margin: {left: -1, top: 2},
        initStyle: 'display: none',
        mode: 'hsv-h',
        size: 1,
        renderCallback: renderCallback
        // and all other options from color and colorPicker
    });
```
