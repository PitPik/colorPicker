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
						isAlpha = colors.alpha !== 1 && !options.isIE8,
						colorMode = $input.data('colorMode');

					if (!options._instance) return;

					$patch.css({
						'color': (colors.rgbaMixCustom.luminance > 0.22 ? '#222' : '#ddd'), // Black...???
						'background-color': options._instance.toString(),
						'filter' : (options.isIE8 ? 'progid:DXImageTransform.Microsoft.gradient(' + // IE<9
							'startColorstr=#' + AHEX + ',' + 'endColorstr=#' + AHEX + ')' : '')
					});

					$input.val(colorMode === 'HEX' && !isAlpha ? '#' + (options.isIE8 ? AHEX : colors.HEX) :
						options._instance.toString(colorMode, options.forceAlpha)
					);

					if (options.displayCallback) {
						options.displayCallback(colors, mode, options);
					}
				},
				extractValue = function(elm) {
					return elm.value || elm.getAttribute('value') || elm.style.backgroundColor || '#FFFFFF';
				},
				actionCallback = function(event, action) {
					var options = this,
						colorPicker = colorPickers.current;

					if (action === 'toMemory') {
						var memos = colorPicker.nodes.memos,
							$memo,
							backgroundColor = '',
							opacity = 0,
							cookieTXT = [];

						for (var n = 0, m = memos.length; n < m; n++) {
							$memo = $(memos[n]);
							backgroundColor = $memo.css('background-color');
							opacity = Math.round($memo.css('opacity') * 100) / 100;
							cookieTXT.push(backgroundColor.
								replace(/, /g, ',').
								replace('rgb(', 'rgba(').
								replace(')', ',' + opacity + ')')
							);
						}
						cookieTXT = '\'' + cookieTXT.join('\',\'') + '\'';
						$.docCookies('colorPickerMemos' + (options.noAlpha ? 'NoAlpha' : ''), cookieTXT);
					} else if (action === 'resizeApp') {
						$.docCookies('colorPickerSize', colorPicker.color.options.currentSize);
					} else if (action === 'modeChange') {
						var mode = colorPicker.color.options.mode;

						$.docCookies('colorPickerMode', mode.type + '-' + mode.z);
					}
				},
				createInstance = function(elm, config) {
					var initConfig = {
							klass: window.ColorPicker,
							input: elm,
							patch: elm,
							isIE8: !!document.all && !document.addEventListener, // Opera???
							animationSpeed: 200,
							draggable: true,
							margin: {left: -1, top: 2},
							customBG: '#FFFFFF',
							// displayCallback: displayCallback,
							/* --- regular colorPicker options from this point --- */
							color: extractValue(elm),
							initStyle: 'display: none',
							mode: $.docCookies('colorPickerMode') || 'hsv-h',
							// memoryColors: (function(colors, config) {
							// 	return config.noAlpha ?
							// 		colors.replace(/\,\d*\.*\d*\)/g, ',1)') : colors;
							// })($.docCookies('colorPickerMemos'), config || {}),
							// forceAlpha: true,
							memoryColors: $.docCookies('colorPickerMemos' + ((config || {}).noAlpha ? 'NoAlpha' : '')),
							size: $.docCookies('colorPickerSize') || 1,
							renderCallback: renderCallback,
							actionCallback: actionCallback
						},
						instance;

					for (var n in config) {
						initConfig[n] = config[n]; 
					}
					instance = new initConfig.klass(initConfig);
					instance.color.options._instance = instance.color;
					return instance;
				},
				doEventListeners = function(elm, multiple, off) {
					var onOff = off ? 'off' : 'on';

					$(elm)[onOff]('focus.colorPicker', function(e) {
						var $input = $(this),
							position = $input.offset(),
							index = multiple ? $(that).index(this) : 0,
							colorPicker = colorPickers[index] ||
								(colorPickers[index] = createInstance(this, config)),
							options = colorPicker.color.options,
							$colorPicker = $.ui && options.draggable ?
							$(colorPicker.nodes.colorPicker).draggable(
								{cancel: '.' + options.CSSPrefix + 'app div'}
							) : $(colorPicker.nodes.colorPicker),
							$appendTo = $(options.appendTo || document.body),
							isStatic = /static/.test($appendTo.css('position')),
							atrect = isStatic ? {left: 0, top: 0} : $appendTo[0].getBoundingClientRect(),
							waitTimer = 0;

						options.color = extractValue(elm); // brings color to default on reset
						$colorPicker.css({
							'position': 'absolute',
							'left': position.left + options.margin.left -  atrect.left,
							'top': position.top + $input.outerHeight(true) + options.margin.top - atrect.top
						});
						if (!multiple) {
							options.input = elm;
							options.patch = elm; // check again???
							colorPicker.setColor(extractValue(elm), undefined, undefined, true);
							colorPicker.saveAsBackground();
						}
						colorPickers.current = colorPickers[index];
						$appendTo.append($colorPicker);
						waitTimer = setInterval(function() { // compensating late style on onload in colorPicker
							if (colorPickers.current.cssIsReady) {
								waitTimer = clearInterval(waitTimer);
								$colorPicker.show(colorPicker.color.options.animationSpeed);
							}
						}, 10);
						
					});

					$(window)[onOff]('mousedown.colorPicker', function(e) {
						var colorPicker = colorPickers.current,
							$colorPicker = $(colorPicker ? colorPicker.nodes.colorPicker : undefined),
							animationSpeed = colorPicker ? colorPicker.color.options.animationSpeed : 0,
							isColorPicker = $(e.target).closest('.cp-app')[0],
							inputIndex = $(that).index(e.target);

						if (isColorPicker && colorPicker && $(colorPickers).index(isColorPicker)) {
							if (e.target === colorPicker.nodes.exit) {
								$colorPicker.hide(animationSpeed);
								$(':focus').trigger('blur');
							} else {
								// buttons on colorPicker don't work any more
								// $(document.body).append(isColorPicker);
							}
						} else if (inputIndex !== -1) {
							// input fireld
						} else {
							$colorPicker.hide(animationSpeed);
						}
					});
				},
				that = this,
				colorPickers = $.fn.colorPicker.colorPickers || [], // this is a way to prevent data binding on HTMLElements
				testColors = new window.Colors({
					customBG: (config && config.customBG) || '#FFFFFF',
					allMixDetails: true
				});

			$.fn.colorPicker.colorPickers = colorPickers;

			$(this).each(function(idx, elm) {
				// doEventListeners(elm, (config && config.multipleInstances), true);
				$(elm).off('.colorPicker');
				$(window).off('.colorPicker');
				if (config !== 'destroy') {
					var color = extractValue(elm),
						value = color.split('(');
					$(elm).data('colorMode', value[1] ? value[0].substr(0, 3) : 'HEX');
					doEventListeners(elm, (config && config.multipleInstances), false);
					if (config && config.readOnly) {
						elm.readOnly = true;
					}
					testColors.setColor(color);
					if (config && config.init) {
						config.init(elm, testColors.colors);
					}
				}
			});

			return this;
		}
	});

	$.docCookies = function(key, val, options) {
		var encode = encodeURIComponent, decode = decodeURIComponent,
			cookies, n, tmp, cache = {},
			days;

		if (val === undefined) { // all about reading cookies
			cookies = document.cookie.split('; ') || []; // easier for decoding then with RegExp search // .split(/;\s*/)
			for (n = cookies.length; n--; ) {
				tmp = cookies[n].split('=');
				if (tmp[0]) cache[decode(tmp.shift())] = decode(tmp.join('=')); // there might be '='s in the value...
			}

			if (!key) return cache; // return Json for easy access to all cookies
			else return cache[key]; // easy access to cookies from here
		} else { // write/delete cookie
			options = options || {};

			if (val === '' || options.expires < 0) { // prepare deleteing the cookie
				options.expires = -1;
				// options.path = options.domain = options.secure = undefined; // to make shure the cookie gets deleted...
			}

			if (options.expires !== undefined) { // prepare date if any
				days = new Date();
				days.setDate(days.getDate() + options.expires);
			}

			document.cookie = encode(key) + '=' + encode(val) +
				(days            ? '; expires=' + days.toUTCString() : '') +
				(options.path    ? '; path='    + options.path       : '') +
				(options.domain  ? '; domain='  + options.domain     : '') +
				(options.secure  ? '; secure'                        : '');
		}
	};
})(jQuery, this);
