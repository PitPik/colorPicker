(function ($, window) {
	$.fn.extend({
		colorPicker: function(config) {
			var renderCallback = function(colors, mode) {
					var options = this,
						$input = $(options.input),
						$patch = $(options.patch),
						RGB = colors.RND.rgb,
						HSL = colors.RND.hsl,
						AHEX = options.isIE8 ? (colors.alpha < 0.16 ? '0' : '') +
							(Math.round(colors.alpha * 100)).toString(16).toUpperCase() + colors.HEX : '',
						RGBInnerText = RGB.r + ', ' + RGB.g + ', ' + RGB.b,
						RGBAText = 'rgba(' + RGBInnerText + ', ' + colors.alpha + ')',
						isAlpha = colors.alpha !== 1 && !options.isIE8,
						colorMode = $input.data('colorMode');

					$patch.css({
						'color': (colors.rgbaMixBlack.luminance > 0.22 ? '#222' : '#ddd'), // Black...???
						'background-color': RGBAText,
						'filter' : (options.isIE8 ? 'progid:DXImageTransform.Microsoft.gradient(' + // IE<9
							'startColorstr=#' + AHEX + ',' + 'endColorstr=#' + AHEX + ')' : '')
					});

					$input.val(colorMode === 'HEX' && !isAlpha ? '#' + (options.isIE8 ? AHEX : colors.HEX) :
						colorMode === 'rgb' || (colorMode === 'HEX' && isAlpha) ?
						(!isAlpha ? 'rgb(' + RGBInnerText + ')' : RGBAText) :
						('hsl' + (isAlpha ? 'a(' : '(') + HSL.h + ', ' + HSL.s + '%, ' + HSL.l + '%' +
							(isAlpha ? ', ' + colors.alpha : '') + ')')
					);

					if (options.displayCallback) {
						options.displayCallback(colors, mode, options);
					}
				},
				createInstance = function(elm, config) {
					var initConfig = {
							klass: window.ColorPicker,
							input: elm,
							patch: elm,
							isIE8: document.all && !document.addEventListener, // Opera???
							animationSpeed: 200,
							draggable: true,
							margin: {left: -1, top: 2},
							// displayCallback: displayCallback,
							/* --- regular colorPicker options from this point --- */
							color: elm.value,
							initStyle: 'display: none',
							mode: 'hsv-h',
							size: 1,
							renderCallback: renderCallback
						};

					for (var n in config) {
						initConfig[n] = config[n]; 
					}
					return new initConfig.klass(initConfig);
				},
				doEventListeners = function(elm, multiple, off) {
					var onOff = off ? 'off' : 'on';

					$(elm)[onOff]('focus.colorPicker', function(e) {
						var $input = $(this),
							position = $input.position(),
							index = multiple ? $(that).index(this) : 0,
							colorPicker = colorPickers[index] ||
								(colorPickers[index] = createInstance(this, config)),
							options = colorPicker.color.options,
							$colorPicker = $.ui && options.draggable ?
							$(colorPicker.nodes.colorPicker).draggable(
								{cancel: '.' + options.CSSPrefix + 'app div'}
							) : $(colorPicker.nodes.colorPicker);

						$colorPicker.css({
							'position': 'absolute',
							'left': position.left + options.margin.left,
							'top': position.top + +$input.outerHeight(true) + options.margin.top
						});
						if (!multiple) {
							options.input = elm;
							options.patch = elm; // check again???
							colorPicker.setColor(elm.value, undefined, undefined, true);
							colorPicker.saveAsBackground();
						}
						colorPickers.current = colorPickers[index];
						$colorPicker.show(colorPicker.color.options.animationSpeed);
					});

					if (!colorPickers.evt || off) {
						colorPickers.evt = true; // prevent new eventListener for window

						$(window)[onOff]('mousedown.colorPicker', function(e) {
							var colorPicker = colorPickers.current,
								$colorPicker = $(colorPicker ? colorPicker.nodes.colorPicker : undefined),
								animationSpeed = colorPicker ? colorPicker.color.options.animationSpeed : 0,
								isColorPicker = $(e.target).closest('.cp-app')[0],
								inputIndex = $(that).index(e.target);

							if (isColorPicker && $(colorPickers).index(isColorPicker)) {
								if (e.target === colorPicker.nodes.exit) {
									$colorPicker.hide(animationSpeed);
									$(':focus').trigger('blur');
								} else {
									// buttons on colorPicker don't work any more
									// $(document.body).append(isColorPicker);
								}
							} else if (inputIndex !== -1) {
								// input field
							} else {
								$colorPicker.hide(animationSpeed);
							}
						});
					}
				},
				that = this,
				colorPickers = this.colorPickers || []; // this is a way to prevent data binding on HTMLElements

			this.colorPickers = colorPickers;

			$(this).each(function(idx, elm) {
				if (config === 'destroy') {
					// doEventListeners(elm, (config && config.multipleInstances), true);
					$(elm).off('.colorPicker');
					$(window).off('.colorPicker');
					if (colorPickers[idx]) {
						colorPickers[idx].destroyAll();
					}
				} else {
					var value = elm.value.split('(');
					$(elm).data('colorMode', value[1] ? value[0].substr(0, 3) : 'HEX');
					doEventListeners(elm, (config && config.multipleInstances), false);
				}
			});

			return this;
		}
	});
})(jQuery, this);