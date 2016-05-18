;(function(window, undefined){
	"use strict"


	if (1 === 2) { // to run ColorPicker on its own....
		myColor = window.myColor = new window.ColorPicker({
			imagePath: 'images/' // IE8-
			// customCSS: true
		});
		return;
	}

	// Some common use variables
	var ColorPicker = window.ColorPicker,
		Tools = ColorPicker || window.Tools, // provides functions like addEvent, ... getOrigin, etc.
		colorSourceSelector = document.getElementById('description').getElementsByTagName('select')[0],
		startPoint,
		currentTarget,
		currentTargetWidth = 0,
		currentTargetHeight = 0;

	/* ---------------------------------- */
	/* ------- Render color patch ------- */
	/* ---------------------------------- */
	var testPatch = document.getElementById('testPatch'),
		renderTestPatch = function(color) { // used in renderCallback of 'new ColorPicker'
			var RGB = color.RND.rgb;
			testPatch.style.cssText =
				'background-color: ' + (myColor.color || myColor).toString() + ';' +
				'color: ' + (color.rgbaMixBlack.luminance > 0.22 ? '#222' : '#ddd');
			testPatch.firstChild.data = '#' + color.HEX;
		};

	/* ---------------------------------- */
	/* ------ Render contrast patch ----- */
	/* ---------------------------------- */
	var contrastPatch = document.getElementById('contrastPatch'),
		backGround = contrastPatch.firstChild,
		renderContrastPatch = function(color) { // used in renderCallback of 'new ColorPicker'
			var RGB = color.RND.rgb,
				bgColor = color.background.RGB,
				options = myColor.options ? myColor.options : myColor.color.options,
				cBGColor = myColor ? options.customBG : {},
				bgType,
				alphaBG;

			if (!cBGColor) {
				// contrastPatch.style.display = 'none';
				// return;
				cBGColor = {r: 1, g: 1, b: 1};
			}
			alphaBG = options.alphaBG;
			bgType = {w: 'White', b: 'Black', c: 'Custom'}[alphaBG];
			cBGColor = alphaBG === 'b' ? {r: 0, g: 0, b: 0} : alphaBG === 'w' ? {r: 1, g: 1, b: 1} : cBGColor;
			contrastPatch.style.cssText =
				'background-color: rgb(' +
					Math.round(cBGColor.r * 255) + ',' +
					Math.round(cBGColor.g * 255) + ',' +
					Math.round(cBGColor.b * 255) + ');' +
				'color: ' + (myColor.color || myColor).toString();
			backGround.style.cssText =
				'background-color: rgba(' +
					bgColor.r + ',' +
					bgColor.g + ',' +
					bgColor.b + ',' + color.background.alpha + ');';
			contrastPatch.children[1].firstChild.data = color['rgbaMixBGMix' + bgType] ?
				'*' + color['rgbaMixBGMix' + bgType].WCAG2Ratio + '*' :
				'-Test-';
		};

	/* ---------------------------------- */
	/* ------- Render color values ------ */
	/* ---------------------------------- */
	var colorValues = document.getElementById('colorValues'),
		renderColorValues = function(color) { // used in renderCallback of 'new ColorPicker'
			var RND = color.RND;

			colorValues.firstChild.data =
				(myColor.color || myColor).toString('rgb', true).replace(/, /g, ',') + "\n" +
				'hsva(' + RND.hsv.h  + ',' + RND.hsv.s  + ',' + RND.hsv.v  + ',' + color.alpha + ')' + "\n" +
				(myColor.color || myColor).toString('hsl', true).replace(/, /g, ',') + "\n" +
				'CMYK(' + RND.cmyk.c + ',' + RND.cmyk.m + ',' + RND.cmyk.y + ',' + RND.cmyk.k + ')' + "\n" +
				'CMY('  + RND.cmy.c  + ',' + RND.cmy.m  + ',' + RND.cmy.y  + ')' + "\n" +
				'Lab('  + RND.Lab.L  + ',' + RND.Lab.a  + ',' + RND.Lab.b  + ')'; // + "\n" +

				// 'mixBG: '   + (color.rgbaMixBG.luminance).toFixed(10) + "\n" +
				// 'mixBGCBG: '   + (color.rgbaMixCustom.luminance).toFixed(10);
				// 'XYZ('  + RND.XYZ.X  + ',' + RND.XYZ.Y  + ',' + RND.XYZ.Z  + ')';
		};

	/* ---------------------------------- */
	/* ---------- Color squares --------- */
	/* ---------------------------------- */
	var colorSquares = document.getElementById('color_squares'),
		squares = colorSquares.children,
		n = squares.length;

	for ( ; n--; ) { // draw random color values as background
		squares[n].style.backgroundColor = 'rgb(' +
			Math.round(Math.random() * 255) + ',' + 
			Math.round(Math.random() * 255) + ',' +
			Math.round(Math.random() * 255) +')';
	}

	Tools.addEvent(colorSquares, 'click', function(e){ // event delegation
		var target = e.target || e.srcElement;

		if (target.parentNode === this) {
			myColor.setColor(target.style.backgroundColor);
			startRender(true);
		}
	});

	/* ---------------------------------- */
	/* ---------- Color sliders --------- */
	/* ---------------------------------- */
	var sliders = document.getElementById('sliders'),
		sliderChildren = sliders.children,
		type,
		mode,
		isLabAB = false,
		max = {
			rgb:  {r: 255, g: 255, b: 255},
			hsl:  {h: 360, s: 100, l: 100},
			cmy:  {c: 100, m: 100, y: 100},
			Lab:  {L: 100, a: 256, b: 256}
			// hsv:  {h: 360, s: 100, v: 100},
			// cmyk: {c: 100, m: 100, y: 100, k: 100},
		},
		sliderDown = function (e) { // mouseDown callback
			var target = e.target || e.srcElement,
				id, len;

			if (target !== this) {
				if (e.preventDefault) e.preventDefault();

				currentTarget = target.id ? target : target.parentNode;
				id = currentTarget.id; // rgbR
				len = id.length - 1;
				type = id.substr(0, len); // rgb
				mode = id.charAt(len); // .toLowerCase(); // R -> r
				isLabAB = type === 'Lab' && (/(?:a|b)/.test(mode));
				startPoint = Tools.getOrigin(currentTarget);
				currentTargetWidth = currentTarget.offsetWidth;

				sliderMove(e);
				Tools.addEvent(window, 'mousemove', sliderMove);
				startRender();
			}
		},
		sliderMove = function (e) { // mouseMove callback
			var newColor = {};
			// The idea here is (so in the HSV-color-picker) that you don't
			// render anything here but just send data to the colorPicker, no matter
			// if it's out of range. colorPicker will take care of that and render it
			// then in the renderColorSliders correctly (called in renderCallback).
			newColor[mode] = (e.clientX - startPoint.left) / currentTargetWidth * max[type][mode] -
				(isLabAB ? 128 : 0);

			myColor.setColor(newColor, type);
		},
		renderColorSliders = function(color) { // used in renderCallback of 'new ColorPicker'
			for (var n = sliderChildren.length; n--; ) {
				var child = sliderChildren[n],
					len =  child.id.length - 1,
					type = child.id.substr(0, len),
					mode = child.id.charAt(len); // .toLowerCase();

				child.children[0].style.width = (color.RND[type][mode] / max[type][mode] * 100) +
					(type === 'Lab' && /(?:a|b)/.test(mode) ? 50 : 0) + '%';
			}
		};

	Tools.addEvent(sliders, 'mousedown', sliderDown); // event delegation
	Tools.addEvent(window, 'mouseup', function() {
		Tools.removeEvent (window, 'mousemove', sliderMove);
		stopRender();
	});

	/* ---------------------------------- */
	/* ---- HSV-circle color picker ----- */
	/* ---------------------------------- */
	var hsv_map = document.getElementById('hsv_map'),
		hsv_mapCover = hsv_map.children[1], // well...
		hsv_mapCursor = hsv_map.children[2],
		hsv_barBGLayer = hsv_map.children[3],
		hsv_barWhiteLayer = hsv_map.children[4],
		hsv_barCursors = hsv_map.children[6],
		hsv_barCursorsCln = hsv_barCursors.className,
		hsv_Leftcursor = hsv_barCursors.children[0],
		hsv_Rightcursor = hsv_barCursors.children[1],

		colorDisc = document.getElementById('surface'),
		colorDiscRadius = colorDisc.offsetHeight / 2,
		luminanceBar = document.getElementById('luminanceBar'),

		hsvDown = function(e) { // mouseDown callback
			var target = e.target || e.srcElement;

			if (e.preventDefault) e.preventDefault();

			currentTarget = target.id ? target : target.parentNode;
			startPoint = Tools.getOrigin(currentTarget);
			currentTargetHeight = currentTarget.offsetHeight; // as diameter of circle

			Tools.addEvent(window, 'mousemove', hsvMove);
			hsv_map.className = 'no-cursor';
			hsvMove(e);
			startRender();
		},
		hsvMove = function(e) { // mouseMove callback
			var r, x, y, h, s;

			if(currentTarget === hsv_map) { // the circle
				r = currentTargetHeight / 2,
				x = e.clientX - startPoint.left - r,
				y = e.clientY - startPoint.top - r,
				h = 360 - ((Math.atan2(y, x) * 180 / Math.PI) + (y < 0 ? 360 : 0)),
				s = (Math.sqrt((x * x) + (y * y)) / r) * 100;
				myColor.setColor({h: h, s: s}, 'hsv');
			} else if (currentTarget === hsv_barCursors) { // the luminanceBar
				myColor.setColor({
					v: (currentTargetHeight - (e.clientY - startPoint.top)) / currentTargetHeight * 100
				}, 'hsv');
			}
		},
/*		renderHSVPicker = function(color) { // used in renderCallback of 'new ColorPicker'
			var pi2 = Math.PI * 2,
				x = Math.cos(pi2 - color.hsv.h * pi2),
				y = Math.sin(pi2 - color.hsv.h * pi2),
				r = color.hsv.s * (colorDiscRadius - 5), // - border
				// this approach useing hsl is not the fastest (I just wanted to try out)... so,
				// better would be to have 2 extra layers underneath luminanceBar, the middle one
				// being white and opac with color.hsl.l, the 2nd one bgColor to color.heuRGB.
				// This approach would then be faster and also work with older IEs.
				hsv2hsl = function(hsv) { // there is no hsv(h, s, v) in CSS
					var l = (2 - hsv.s) * hsv.v,
						s = hsv.s * hsv.v;

					return {
						h: hsv.h,
						s: !hsv.s ? 0 : l < 1 ? (l ? s / l : 0) : s / (2 - l),
						l: l / 2
					}
				},
				hslFull = hsv2hsl({
					h: color.hsv.h,
					s: color.hsv.s,
					v: 1
				});

			hsv_mapCover.style.opacity = 1 - color.hsv.v;
			hsv_mapCursor.style.cssText =
				'left: ' + (x * r + colorDiscRadius) + 'px;' + 
				'top: ' + (y * r + colorDiscRadius) + 'px;' +
				(color.RGBLuminance > 0.22 ? 'background-position: 0 -36px;' : '');

			luminanceBar.style.backgroundColor = 'hsl(' +
				Math.round(hslFull.h * 360) + ',' +
				Math.round(hslFull.s * 100) + '%,' +
				Math.round(hslFull.l * 100) + '%)';
			hsv_barCursors.className = color.RGBLuminance > 0.22 ? hsv_barCursorsCln + ' dark' : hsv_barCursorsCln;
			hsv_Leftcursor.style.top = hsv_Rightcursor.style.top = ((1 - color.hsv.v) * colorDiscRadius * 2) + 'px';
		};
*/		renderHSVPicker = function(color) { // used in renderCallback of 'new ColorPicker'
			var pi2 = Math.PI * 2,
				x = Math.cos(pi2 - color.hsv.h * pi2),
				y = Math.sin(pi2 - color.hsv.h * pi2),
				r = color.hsv.s * (colorDiscRadius - 5);

			hsv_mapCover.style.opacity = 1 - color.hsv.v;
			// this is the faster version...
			hsv_barWhiteLayer.style.opacity = 1 - color.hsv.s;
			hsv_barBGLayer.style.backgroundColor = 'rgb(' +
				color.hueRGB.r + ',' +
				color.hueRGB.g + ',' +
				color.hueRGB.b + ')';

			hsv_mapCursor.style.cssText =
				'left: ' + (x * r + colorDiscRadius) + 'px;' + 
				'top: ' + (y * r + colorDiscRadius) + 'px;' +
				// maybe change className of hsv_map to change colors of all cursors...
				'border-color: ' + (color.RGBLuminance > 0.22 ? '#333;' : '#ddd');
			hsv_barCursors.className = color.RGBLuminance > 0.22 ? hsv_barCursorsCln + ' dark' : hsv_barCursorsCln;
			if (hsv_Leftcursor) hsv_Leftcursor.style.top = hsv_Rightcursor.style.top = ((1 - color.hsv.v) * colorDiscRadius * 2) + 'px';
		};

	Tools.addEvent(hsv_map, 'mousedown', hsvDown); // event delegation
	Tools.addEvent(window, 'mouseup', function() {
		Tools.removeEvent (window, 'mousemove', hsvMove);
		hsv_map.className = '';
		stopRender();
	});

	// generic function for drawing a canvas disc
	var drawDisk = function(ctx, coords, radius, steps, colorCallback) {
			var x = coords[0] || coords, // coordinate on x-axis
				y = coords[1] || coords, // coordinate on y-axis
				a = radius[0] || radius, // radius on x-axis
				b = radius[1] || radius, // radius on y-axis
				angle = 360,
				rotate = 0, coef = Math.PI / 180;

			ctx.save();
			ctx.translate(x - a, y - b);
			ctx.scale(a, b);

			steps = (angle / steps) || 360;

			for (; angle > 0 ; angle -= steps){
				ctx.beginPath();
				if (steps !== 360) ctx.moveTo(1, 1); // stroke
				ctx.arc(1, 1, 1,
					(angle - (steps / 2) - 1) * coef,
					(angle + (steps  / 2) + 1) * coef);

				if (colorCallback) {
					colorCallback(ctx, angle);
				} else {
					ctx.fillStyle = 'black';
					ctx.fill();
				}
			}
			ctx.restore();
		},
		drawCircle = function(ctx, coords, radius, color, width) { // uses drawDisk
			width = width || 1;
			radius = [
				(radius[0] || radius) - width / 2,
				(radius[1] || radius) - width / 2
			];
			drawDisk(ctx, coords, radius, 1, function(ctx, angle){
				ctx.restore();
				ctx.lineWidth = width;
				ctx.strokeStyle = color || '#000';
				ctx.stroke();
			});
		};

	if (colorDisc.getContext) {
		drawDisk( // HSV color wheel with white center
			colorDisc.getContext("2d"),
			[colorDisc.width / 2, colorDisc.height / 2],
			[colorDisc.width / 2 - 1, colorDisc.height / 2 - 1],
			360,
			function(ctx, angle) {
				var gradient = ctx.createRadialGradient(1, 1, 1, 1, 1, 0);
				gradient.addColorStop(0, 'hsl(' + (360 - angle + 0) + ', 100%, 50%)');
				gradient.addColorStop(1, "#FFFFFF");

				ctx.fillStyle = gradient;
				ctx.fill();
			}
		);
		drawCircle( // gray border
			colorDisc.getContext("2d"),
			[colorDisc.width / 2, colorDisc.height / 2],
			[colorDisc.width / 2, colorDisc.height / 2],
			'#555',
			3
		);
		// draw the luminanceBar bar
		var ctx = luminanceBar.getContext("2d"),
			gradient = ctx.createLinearGradient(0, 0, 0, 200);

		gradient.addColorStop(0,"transparent");
		gradient.addColorStop(1,"black");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 30, 200);
	}


	// experimental stuff

	// var colorModel = document.getElementById('model_display'),
	// 	displayModel = function(model) {
	// 		var html = ['<ul class="model">'];
	// 		for (var n in model) {
	// 			if (typeof model[n] === 'object') {
	// 				html.push(n + ': ' + displayModel(model[n]));
	// 				// return html.join('');
	// 			} else {
	// 				html.push('<li>' + n + ': ' + model[n] + '</li>');
	// 			}
	// 		}
	// 		html.push('</ul>');
	// 		return html.join('');
	// 	};


	/*
	 * This script is set up so it runs either with ColorPicker or with Color only.
	 * The difference here is that ColorPicker has a renderCallback that Color doesn't have
	 * therefor we have to set a render intervall in case it's missing...
	 * setInterval() can be exchanged to window.requestAnimationFrame(callBack)...
	 *
	 * If you want to render on mouseMove only then get rid of startRender(); in
	 * all the mouseDown callbacks and add doRender(myColor.colors); in all
	 * mouseMove callbacks. (Also remove all stopRender(); in mouseUp callbacks)
	*/
	var doRender = function(color) {
			renderTestPatch(color);
			renderContrastPatch(color);
			renderColorValues(color);
			renderColorSliders(color);
			renderHSVPicker(color);
			// colorModel.innerHTML = displayModel(color); // experimental
		},
		renderTimer,
		// those functions are in case there is no ColorPicker but only Colors involved
		startRender = function(oneTime){
			if (isColorPicker) { // ColorPicker present
				myColor.startRender(oneTime);
			} else if (oneTime) { // only Colors is instanciated
				doRender(myColor.colors);
			} else {
				renderTimer = window.setInterval(
					function() {
						doRender(myColor.colors);
					// http://stackoverflow.com/questions/2940054/
					}, 13); // 1000 / 60); // ~16.666 -> 60Hz or 60fps
			}
		},
		stopRender = function(){
			if (isColorPicker) {
				myColor.stopRender();
			} else {
				window.clearInterval(renderTimer);
			}
		},
		renderCallback = doRender,
		// finally the instance of either ColorPicker or Colors (export for debugging purposes)
		color_ColorPicker = new (ColorPicker || Colors)({
			customBG: '#808080',
			imagePath: 'images/'
			// renderCallback: renderCallback, // doesn't work in Colors, but also doesn't matter
			// convertCallback: function(color, type){console.log(color, type)}
			// resizeCallback: function(e, value, scale, original){console.log(e, value, scale, original)}
			// actionCallback: function(e, value){console.log(e, value)},
			// customCSS: true,
/*			memoryColors: [
				{r: 100, g: 200, b: 10, a: 0.6},
				{r: 80, g: 100, b: 50, a: 0.9},
				{r: 70, g: 80, b: 10, a: 0.9},
				{r: 20, g: 200, b: 60, a: 0.9},
				{r: 88, g: 0, b: 30, a: 0.4},
				{r: 100, g: 0, b: 100, a: 0.6},
				{r: 200, g: 0, b: 0},
				{r: 200, g: 30, b: 100}
			],
*/			// size: 2
		}),
		color_Colors = new Colors(),
		myColor,
		isColorPicker = colorSourceSelector.value === 'ColorPicker';

		myColor = window.myColor = color_Colors;
		// color_ColorPicker.nodes.colorPicker.style.cssText = '';
		// mySecondColor = window.mySecondColor = new ColorPicker({instanceName: 'mySecondColor'});

	// in case ColorPicker is not there...
	if (!isColorPicker) { // initial rendering
		doRender(myColor.colors);
	}

	colorSourceSelector.onchange = function(e) {
		if (this.value === 'Colors') {
			color_ColorPicker.color.options.renderCallback = function(color){};
			myColor = window.myColor = color_Colors;
			isColorPicker = false;
			doRender(myColor.colors);
		} else {
			color_ColorPicker.color.options.renderCallback = doRender;
			myColor = window.myColor = color_ColorPicker;
			isColorPicker = true;
			doRender(myColor.color.colors);
		}
	}


	function conversionTest (skipDisplay) {
		if (skipDisplay) console.time('convertAll');

		// conversion test
		var convert = myColor.color ? myColor.color.convertColor : myColor.convertColor,
			x = 0.85, y = 0.33, z = 0.23, k = 0.1,
			modes = ['hsl', 'hsv', 'rgb', 'cmy', 'cmyk', 'Lab', 'XYZ', 'HEX'],
			color = {},
			fromMode = '',
			toMode = '',
			counter = 0,
			value,
			colorOut = [],
			valueOut = [],
			isLab = false;

		for (var o = 2; o--; ) {
			for (var n = 0, m = modes.length; n < m; n++) {
				if (modes[n] === 'HEX') {
					color = '89ABCD';
				} else {
					color = {};
					isLab = modes[n] === 'Lab';
					color[modes[n][0]] = o && !isLab ? x : Math.round(x * 100) + (isLab ? x : 0);
					color[modes[n][1]] = o && !isLab ? y : Math.round(y * 100) + (isLab ? y : 0);
					color[modes[n][2]] = o && !isLab ? z : Math.round(z * 100) + (isLab ? z : 0);
					if (modes[n] === 'cmyk') {
						color[modes[n][3]] = o ? k : Math.round(k * 100);;
					}
				}
				fromMode = o ? modes[n] : modes[n].toUpperCase();
				for (var d = 2; d--; ) {
					for (var p = 0, q = modes.length; p < q; p++) {
						toMode = d ? modes[p] : modes[p].toUpperCase();
						if (fromMode !== toMode) {// && fromMode !== 'LAB' && toMode !== 'LAB') {
							if ((!d && /(?:XYZ|HEX)/.test(toMode)) || // good to avoid double 2XYZ or 2HEX
								(!o && /(?:XYZ|HEX)/.test(fromMode))) { // good to avoid double XYZ2 or HEX2
								// do nothing
							} else {
								value = convert(color, fromMode + '2' + toMode);
								if (!skipDisplay) {
									colorOut = [];
									for (var s in color) {
										colorOut.push(s + ': ' + color[s]);
									}
									colorOut = fromMode === 'HEX' ? '"' + color + '"' : '{' + colorOut.join(', ') + '}';

									valueOut = [];
									for (var s in value) {
										valueOut.push(s + ': ' + value[s]);
									}
									valueOut = toMode === 'HEX' ? '"' + value + '"' : '{' + valueOut.join(', ') + '}';

									console.log('convertColor(' + colorOut + ', "' + fromMode +
										'2' + toMode + '") = ' + valueOut);
								}
								counter++;
							}
						}
					}
				}
			}
		}
		console.log('Tested ' + counter + ' conversion combinations (excluding same to same)');
		if (!skipDisplay) console.log('Call conversionTest(true) for timer (incl. calculations in for loops though...)');
		if (skipDisplay) console.timeEnd('convertAll');
	}

	window.conversionTest = conversionTest;

	// conversionTest();

})(window);