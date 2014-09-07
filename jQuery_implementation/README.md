
# jQuery implementation

Some description follows soon...

##Demo
See **demo** at [dematte.at/cpn/jQuery_implementation](http://dematte.at/cpn/jQuery_implementation)

##Usage

```javascript
    $('input.color').colorPicker();
    // description of option will follow
    $('input.color').colorPicker({
        klass: window.ColorPicker,
        input: elm,
        patch: elm,
        animationSpeed: 200,
        draggable: true,
        margin: {left: -1, top: 2},
        initStyle: 'display: none',
        mode: 'hsv-h',
        size: 1,
        renderCallback: renderCallback
    });
});
```