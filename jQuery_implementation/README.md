
# jQuery implementation

Some description follows soon...

## Demo
See **demo** at [dematte.at/cpn/jQuery_implementation](http://dematte.at/cpn/jQuery_implementation)

## Usage

```javascript
    $('input.color').colorPicker();
    // description of option will follow
    $('input.color').colorPicker({
        klass: window.ColorPicker,
        input: elm,
        patch: elm,
        init: function(elm, colors){}, // initialization callback (before colorPicker gets initialized though)
        animationSpeed: 200,
        draggable: true,
        multipleInstances: false
        margin: {left: -1, top: 2},
        initStyle: 'display: none',
        mode: 'hsv-h',
        size: 1,
        renderCallback: renderCallback
        // and all other options from color and colorPicker
    });
```
