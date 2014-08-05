;(function(window, undefined){
	"use strict"

	/* ------------ Compress HTML ------------ */
	var display = document.getElementById('displayHTML'),
		cp = document.body.children[0],
		html = cp.outerHTML,
		HTML = [];
	// console.log(html)
	html = html.replace(/\t*\n*/g, '').
		replace(/<div class="/g, '^').
		replace(/<div>/g, '|').
		replace(/disp/g, '~').
		replace(/butt/g, 'ß').
		replace(/labl/g, '@').
		replace(/<\/div>/g, '$').
		replace(/cp-/g, '§');

	for (var n = 0, len = html.length; n < len; n += !n ? 95 : 100) {
		HTML.push('\'' + html.substr(n, !n ? 95 : 100));
	}

	html = "_html = (" + HTML.join("' +\n\t") + "').\n\t" +
		"replace(/\\^/g, '<div class=\"').\n\t" +
		"replace(/\\$/g, '</div>').\n\t" +
		"replace(/~/g, 'disp').\n\t" +
		"replace(/ß/g, 'butt').\n\t" +
		"replace(/@/g, 'labl').\n\t" +
		"replace(/\\|/g, '<div>')";

	display.firstChild.data = html;


	/* ------------ Compress CSS ------------ */
	var display = document.getElementById('displayCSS'),
		css = document.getElementsByTagName('link')[1],
		rules = css.sheet.rules,
		path = css.href.split('/'),
		CSS = [],
		bgPosCSS = {},
		// CSSSplit = [],
		reUnion = '',
		txt = '', key = '', val = '', end = 0, start = 0;

	path.pop();
	path = path.join('/') + '/';

	for (var n = 0, len = rules.length; n < len; n++) {
		txt = rules[n].cssText;
		if (/background-position/.test(txt)) {
			// .hsl-l div.cp-sldl-1 {background-position: -256px 0}
			end = txt.indexOf(' { ');
			val = txt.substr(0, end); // good now

			start = txt.indexOf(' }');
			key = txt.substr(end + 24, start - end - 25);

			if (!bgPosCSS[key]) {
				bgPosCSS[key] = [val];
			} else {
				bgPosCSS[key].push(val);
			}
		} else {
			CSS.push(txt.replace(new RegExp(path, 'g'), ''));			
		}
	}

	for (var n in bgPosCSS) {
		// console.log(bgPosCSS[n].join(',') + '{background-position:' + n + '}');
		CSS.push(
			bgPosCSS[n].join(',') + '{background-position:' + n + '}'
		);
	}

	css = CSS.join(''). // recycle css
		replace(/cp-/g, '§').
		replace(/\: /g, ':').
		replace(/ \{ /g, '{').
		replace(/; \}/g, '}').
		replace(/, \./g, ',.').
		replace(/:0px /g, ':0 ').
		replace(/ 0px\}/g, ' 0}').
		replace(/rgb\((\d+), (\d+), (\d+)\)/g, function($1, $2, $3, $4){
			var hex = ('#' +
				($2 < 16 ? '0' : '') + (+$2).toString(16) +
				($3 < 16 ? '0' : '') + (+$3).toString(16) +
				($4 < 16 ? '0' : '') + (+$4).toString(16)
			)
			if ($2 === $3 && $3 === $4) {
				hex = hex.substring(0, 4);
			} else if (hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6]) {
				hex = '#' + hex[1] + hex[3] + hex[5];
			}
			return hex;
		}).

		replace(/ .\§sldl-/g, '^').
		replace(/ .\§sldr-/g, '?').
		replace(/ .no-rgb-/g, '~').

		replace(/\.rgb-/g, 'ä').
		replace(/\.hsv-/g, 'ö').
		replace(/\.hsl-/g, 'ü').

		replace(/background/g, '@').
		replace(/-position\:/g, '|').

		replace(/,\.S /g, 'Ä').
		replace(/px}/g, 'Ö').
		replace(/\{@\|0 /g, 'Ü');  // !!!


	reUnion = 
		"replace(/Ü/g, '{@|0 ').\n\t" +
		"replace(/Ö/g, 'px}').\n\t" +
		"replace(/Ä/g, ',.S ').\n\t" +

		"replace(/\\|/g, '-position:').\n\t" +
		"replace(/@/g, 'background').\n\t" +

		"replace(/ü/g, '.hsl-').\n\t" +
		"replace(/ö/g, '.hsv-').\n\t" +
		"replace(/ä/g, '.rgb-').\n\t" +

		"replace(/~/g, ' .no-rgb-}').\n\t" +
		"replace(/\\?/g, ' .§sldr-').\n\t" +
		"replace(/\\^/g, ' .§sldl-')\n\t";


	// CSSSplit = css.split('.thisIsTheBreakPoint{}');
	// --------------
	// css = CSSSplit[0]; // first half
	CSS = [];

	for (var n = 0, len = css.length; n < len; n += !n ? 92 : 100) {
		CSS.push('\'' + css.substr(n, !n ? 92 : 100));
	}
	var cssMain = "_cssFunc = (" + CSS.join("' +\n\t") + "').\n\t" + reUnion;

	// --------------
	// css = CSSSplit[1]; // second half
	// CSS = [];
	// for (var n = 0, len = css.length; n < len; n += !n ? 92 : 100) {
	// 	CSS.push('\'' + css.substr(n, !n ? 92 : 100));
	// }
	// cssMain += "\n\n\n_cssFunc = (" + CSS.join("' +\n\t") + "').\n\t" + reUnion;



	display.firstChild.data = cssMain;

	/* --------------------- MAIN CSS ---------------------------- */

	var display = document.getElementById('displayCSS'),
		css = document.getElementsByTagName('link')[0],
		rules = css.sheet.rules,
		path = css.href.split('/'),
		CSS = [],
		bgPosCSS = {},
		// CSSSplit = [],
		reUnion = '',
		txt = '', key = '', val = '', end = 0, start = 0;

	path.pop();
	path = path.join('/') + '/';

	for (var n = 0, len = rules.length; n < len; n++) {
		txt = rules[n].cssText;
		CSS.push(txt.replace(new RegExp(path, 'g'), ''));			
	}


	css = CSS.join(''). // recycle css
		replace(/cp-/g, '§').
		replace(/\: /g, ':').
		replace(/ \{ /g, '{').
		replace(/; /g, ';').
		replace(/;\}/g, '}').
		replace(/, \./g, ',.').
		replace(/:0px /g, ':0 ').
		replace(/ 0px\}/g, ' 0}').
		replace(/rgb\((\d+), (\d+), (\d+)\)/g, function($1, $2, $3, $4){
			var hex = ('#' +
				($2 < 16 ? '0' : '') + (+$2).toString(16) +
				($3 < 16 ? '0' : '') + (+$3).toString(16) +
				($4 < 16 ? '0' : '') + (+$4).toString(16)
			)
			if ($2 === $3 && $3 === $4) {
				hex = hex.substring(0, 4);
			} else if (hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6]) {
				hex = '#' + hex[1] + hex[3] + hex[5];
			}
			return hex;
		}).

		replace(/\.§sld/g, '^').
		replace(/border\-/g, '?').
		replace(/width\:/g, '~').
		replace(/transparent/g, '†').
		replace(/\.§memo/g, 'ø').

		replace(/height\:/g, 'ä').
		replace(/background\-/g, 'ö').
		// replace(/position\:/g, 'ü').

		replace(/color\:/g, '@').
		replace(/position\:/g, '|').
		replace(/px\;/g, '¥').
		replace(/\.§panel \./g, '«').
		replace(/\.§app/g, '∑').

		//replace(/color\:/g, 'Ä').
		replace(/left\}/g, 'Ö').
		replace(/right/g, 'Ü');  // !!!

	// /.§slds/ 24
	// /border-/ 33
	// /width:/ 36
	// /height:/ 29
	// /background-/ 33
	// /position:/ 28
	// /color-/ 31
	// /left/ 25
	// /right/ 14
	// /px;/ 108
	// /.§panel ./ 45
	// /.§app/ 27      .§memo

	reUnion = 
		"replace(/Ü/g, 'right').\n\t" +
		"replace(/Ö/g, 'left}').\n\t" +
		//"replace(/Ä/g, ',color:').\n\t" +

		"replace(/∑/g, '.§app').\n\t" +
		"replace(/«/g, '.§panel .').\n\t" +
		"replace(/¥/g, 'px;').\n\t" +
		"replace(/\\|/g, 'position:').\n\t" +
		"replace(/@/g, 'color:').\n\t" +

		// "replace(/ü/g, 'position:').\n\t" +
		"replace(/ö/g, 'background-').\n\t" +
		"replace(/ä/g, 'height:').\n\t" +

		"replace(/ø/g, '.§memo').\n\t" +
		"replace(/†/g, 'transparent').\n\t" +
		"replace(/\\~/g, 'width:').\n\t" +
		"replace(/\\?/g, 'border-').\n\t" +
		"replace(/\\^/g, '.§sld')\n\t";


	// CSSSplit = css.split('.thisIsTheBreakPoint{}');
	// --------------
	// css = CSSSplit[0]; // first half
	CSS = [];

	for (var n = 0, len = css.length; n < len; n += !n ? 92 : 100) {
		CSS.push('\'' + css.substr(n, !n ? 92 : 100));
	}
	cssMain = "\n\n_cssMain = (" + CSS.join("' +\n\t") + "').\n\t" + reUnion;


	display.firstChild.data += cssMain;


	/* ------------ Compress images to BASE64 ------------ */
	// var canvas = document.createElement('canvas'),
	// 	ctx = canvas.getContext('2d'),
	// 	myimage = new Image(),
	// 	IMG64 = '',
	// 	images = ['_horizontal.png', '_vertical.png', '_patches.png'],
	// 	counter = 0,
	// 	encode = function(callback) {
	// 		var IMG = [];

	// 		canvas.width = myimage.width;
	// 		canvas.height = myimage.height;

	// 		ctx.drawImage(myimage, 0, 0);
	// 		IMG64 = canvas.toDataURL("image/png"),
	// 		imgName = images[counter];

	// 		for (var n = 0, len = IMG64.length; n < len; n += !n ? 100 - imgName.length + 2 : 100) {
	// 			IMG.push('\'' + IMG64.substr(n, !n ? 100 - imgName.length + 2 : 100));
	// 		}
	// 		IMG = IMG.join("' +\n\t") + "'";
	// 		// display.firstChild.data += "\n\n\n" + imgName.replace('.p', 'P') + ' = ' + IMG;
	// 		if (images[++counter]) {
	// 			myimage.src = images[counter];
	// 		}
	// 	};

	// myimage.onload = function() {
	// 	encode();
	// };
	// myimage.src = images[counter];


	/*
	BASE64 conversion via canvas turns out to be bigger than expected..
	had to upload them via http://webcodertools.com/imagetobase64converter/
	*/
	var images = {
			'_horizontalPng' : 'iVBORw0KGgoAAAANSUhEUgAABIAAAAABCAYAAACmC9U0AAABT0lEQVR4Xu2S3Y6CMBCFhyqIsjGBO1/B9/F5DC/pK3DHhVkUgc7Zqus2DVlGU/cnQZKTjznttNPJBABA149HyRf1iN//4mIBCg0jV4In+j9xJiuihly1V/Z9X88v//kNeDXVvyO/lK+IPR76B019+1Riab3H1zkmeqerKnL+Bzwxx6PAgZxaSQU8vB62T28pxcQeRQ2sHw6GxCOWHvP78zwHAARBABOfdYtd30rwxXOEPDF+dj2+91r6vV/id3k+/brrXmaGUkqKhX3i+ffSt16HQ/dorTGZTHrs7ev7Tl7XdZhOpzc651nfsm1bRFF0YRiGaJoGs9nsQuN/xafTCXEco65rzOdzHI9HJEmCqqqwXC6x3++RZRnKssRqtUJRFFiv19jtdthutyAi5Hl+Jo9VZg7+7f3yXuvZf5c3KaXYzByb+WIzO5ymKW82G/0BNcFhO/tOuuMAAAAASUVORK5CYII=',
			'_verticalPng' : 'iVBORw0KGgoAAAANSUhEUgAAAAEAABfACAYAAABn2KvYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABHtJREFUeNrtnN9SqzAQxpOF1to6zuiVvoI+j6/gva/lA/kKeqUzjtX+QTi7SzSYBg49xdIzfL34+e1usoQQklCnmLwoCjImNwDQA2xRGMqNAYB+gPEH9IdCgIUA6Aem0P1fLoMQAPYNHYDoCKAv8OMHFgKgX2AjDPQDXn4t1l+gt/1fId//yWgE/hUJ+mAn8EyY5wCwXxhrbaHzn8E9iPlv79DdHxXTqciZ4KROnXRVZMF/6U2OPhcEavtAbZH1SM7wRDD7VoHZItCiyEQf4t6+MW9UOxaZybmdCGKqNrB9Eb5SfMg3wTyiagMtigTmWofiSDCOYNTSNz6sLDIoaCU9GWDd0tdhoMMsRm+r8U/EfB0GfjmLXiqzimDd0tdhoLMsI7la45+I+ToM/HIW0kfGVQTrlr7tA91kaUr//fxrKo8jUFB7VAn6AKpHJf+EKwAAAIYD/f7F7/8MVgMo7P+gBqDKr57Lf72V8x8AAMDgYIuvH4EAAAAMDQX6AACAQcI9GGMjDADA4MA/P2KlP8IEAAAYFCz6AACAgaLA8y8AAIN+CMYXoQAADA7u/UPYCAMAMDjI7z9S+SdwDFQX2C9Gh9GMEOWriz8/Pw1lWQZsi/L3R4czzP678Ve+P8f9nCv/C7hwLq99ah8NfKrU15zPB5pVcwtiJt9qGy0IfEE+jQa+Fn0VtI/fkxUPqBlEfRENeF+tqUpbGpi1iu8epwJzvV5XA4GpWC6XGz7F+/u766EgwJ+ckiTJKU3TnI6OjnI6OzvLZf6zMggt3dzckPhIoiTlSGpQ+eEsVegdz0fbCCi4fRs+Po+4yWdeDXiT+6pBSTeHple1pkz3FZ+avpyavoiPxgLN0B7yprY08PlyQTTm0+PWmkH7ynedNKraar4F/lRj1WpTtYh+ozL/cY2sAvZl0gcbZm0gSLBLvkxGoaogiy/HDXemQk2t5pUm8OAhH8/HH6e0mkJ9q9XKKQXfb07xfZnJbZrRxcVFVt6/t7e3Kc1ms5RGo1Eq5VIZuyl9fHw4k/M5xYeoKj64A7eqCt1ZeqWFVSl8NV9OTV3fmvP5qE9VmzSoEcsXpArK1UHen/hZbgL53BZSdyEXalGau/hU8TEW0u3VcoFPy3EDFrTgT+njydeZ0+l0UV7fu7u7iVzziQQmUm4iqRw4n/NxMxw4s/Mp1NSALxf4NEtQ10cjMDwSl+b+/j6hp6enVGb+jUvrn05iKobm6PboOt8vPISY5Pr6OqGXlxe3fOokoGtAbMUJZmqvYmaLQDP+sdrecOjtO/SXeH69P8Imutm5urqy9PDwYOny8tLS4+OjpfPzc0vPz8+WTk9PLb2+vlpZbCzN53NLx8fHVtYZS5PJxMoEZWWqsjKULY3HYytTi1Pex5OMldXKRVXxuLcy/20onmms3BBOxcr5qCrZtsrd45SPel8sGlOxGoGy0neynQ6VL9fsa1YtWlCrtj9G83G7PjdVush5n5q1iJWLZW6u21a1bUvbVnVzlru0pe3RdmlV1/23fZtbZv4Dx+7FBypx77kAAAAASUVORK5CYII=',
			'_patchesPng' : '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',
			'_iconsPng' : 'iVBORw0KGgoAAAANSUhEUgAAAGEAAABDCAMAAAC7vJusAAAAkFBMVEUAAAAvLy9ERERubm7///8AAAD///9EREREREREREREREQAAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8cHBwkJCQnJycoKCgpKSkqKiouLi4vLy8/Pz9AQEBCQkJDQ0NdXV1ubm58fHykpKRERERVVVUzMzPx7Ab+AAAAHXRSTlMAAAAAAAQEBQ4QGR4eIyMtLUVFVVVqapKSnJy7u9JKTggAAAFUSURBVHja7dXbUoMwEAbgSICqLYeW88F6KIogqe//dpoYZ0W4AXbv8g9TwkxmvtndZMrEwlw/F8YIRjCCEYxgBCOsFmzqGMEI28J5zzmt0Pc9rdDL0NYgMxIYC5KiKpKAzZphWtZlGm4SjlnkOV6UHeeEUx77rh/npw1dCrI9k9lnwUwF+UG9D3m4ftJJxH4SJdPtaawXcbr+tBaeFrxiur309cIv19+4ytGCU0031a5euPVigLYGqjlAqM4ShOQ+QAYQUO80AMMAAkUGGfMfR9Ul+kmvPq2QGxXKOQBAKdjUgk0t2NiCGEVP+rHT3/iCUMBT90YrPMsKsIWP3x/VolaonJEETchHCS8AYAmaUICQQwaAQnjoXgHAES7jLkEFaHO4bdq/k25HAIpgWY34FwAE5xjCffM+D2DV8B0gRsAZT7hr5gE8wdrJcU+CJqhcqQD7Cx5L7Ph4WnrKAAAAAElFTkSuQmCC',
			'_bgsPng' : 'iVBORw0KGgoAAAANSUhEUgAAASAAAABvCAYAAABM+h2NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABORJREFUeNrs3VtTW1UYBuCEcxAI4YydWqTWdqr1V7T/2QsvvPDCCy9qjxZbamsrhZIQUHsCEtfafpmJe8qFjpUxfZ4Zuvt2feydJvAOARZUut1u5bRerl692nV913f99/f6QxWAU6KAAAUEKCAABQQoIAAFBCggAAUEKCAABQQoIAAFBCggAAUEKCAABQQoIEABASggQAEBKCBAAQEoIEABASggQAEBKCBAAQEoIGBQC+jatWvd07zxrv9+Xx8fAQEoIEABASggQAEBKCBAAQEoIEABAQoIQAEBCghAAQEKCEABAQOk2u36kS6AAgLetwJKL29toFRM1be+QrVq3rx58//KvM8BAadGAQEKCFBAAAoIGHwnfhneZ+/Nmzf/LufzrI+AAE/BAAUEoIAABQTwztgLZt68eXvBAE/BABQQoIAAFBAweOwFM2/evL1ggKdgAAoIUEAACggYPPaCmTdv3l4wwFMwAAUEKCAABQQMHnvBzJs3by8Y4CkYgAICFBCAAgIGz4lfBQNQQMDgFlCtVisaaHV1tThubW1VInciD0U+ysdnz54N5+PKysphOnRTHsvHlN9EHo/1l5FrkV9Enoz8W87b29tTOS8vLx9EnoncjlyPvBe5EbkZeT4fU96NvBDr2znv7Ows57y0tLQVeSXy08gf5mNfPhPrjyOfrVarlcXFxZ9yfv78+bl8TPlh5LU8n/KDyOuxfj/y+VjfyHl3d/dCKv28fi/yp/m4sLDwQ+SLke9GvhT5Tinfjnw5f4/F/Pz8rZybzeZn+ZjyzVK+EfnzUr4S+Xopf9/L+fxzc3M5d1qt1hf531Mu5k/IxzGf85VYL+fefHH+RqNRrO/t7RW3L+UbkS9Hvhk5/386Kd/qW8/5duRLMV/OdyJfzNebnZ0t7t92u53v/07K9yJfiLwROT9+ef7HyOux/iDyWuSHkT+K+eLtZX9//2xer9frjyOfyY9/Wn8S86v59qT1p7Ge315zLt4RU16K19+O9YXIu5HnYn435hux3opcj9yOPB3z+5E/iPXf43y1yMX778HBQS3f3pTz+28l5bHIr2N+LN3+zszMzGHkoh/S+mHMF98XlNaP8zHd/0W/pMe943NAwKlSQIACAhQQgAICFBCAAgIUEIACAhQQgAIC/n9GqtXqYbfbHa38+RtSu32llPdqdNL6aOSj+LfxyMVekLTem39Ryr/mPDQ0NBznzXtROikPRW6W8k7k3m9rzXthOsPDw73bUuylGRkZ6cR63nvTSfko8oPIr+Pnz96P/DLW816ezujoaN6DdtyX9+P8eS9QZ2xs7Hxf7qa8Xlr/JO6Ljcjrcf6cj1P+OO+N6V1/fHz8XLz+/Tjfubh+sZcorZ+N9Ycxfybyo8ircf6fc56YmFiJ1/8l8mLk7cjzkfP92U15Ns63G+u9nPcKdWq12lQ8Xu3Ixd6f9Pd8P3UmJycnUszzL2N9LM7/anNzs9V7Q2q32395w/q7ubdH6L/KrVbrpPxlKX9Vyl+X8jel/G0pf5f/aDabvXy9tH6ztH63lDdKebOUH5Xyk1LeKuWd/ry2tlap9P125Onp6Zf9eWpq6lW3b8f6zMzM6/71er3+ppSP+u/XNN/pz41Go+sjIMBTMEABASggQAEBKCBAAQEoIEABASggQAEB/CN/CDAAw78uW9AVDw4AAAAASUVORK5CYII=',
		},
		IMG = [],
		IMG64 = '';
		//AAAAAA

	for (var m in images) {
		IMG64 = images[m];
		var IMG = [],
			isPatch = m === '_patchesPng';

		if (isPatch) {
			IMG64 = IMG64.replace(/AAAAAA/g, '§').replace(/AAAA/g, '^').replace(/AAA/g, '#');
		}
		for (var n = 0, len = IMG64.length; n < len; n += !n ? 100 - m.length + (isPatch ? 0 : 1) : 100) {
			IMG.push('\'' + IMG64.substr(n, !n ? 100 - m.length + (isPatch ? 0 : 1) : 100));
		}

		IMG = (isPatch ? '(' : '') + IMG.join("' +\n\t") + "'";
		display.firstChild.data += "\n\n\n" + m + ' = ' + IMG + (isPatch ? ')' : '') +
			(isPatch ? ".\n\treplace(/§/g, 'AAAAAA').replace(/\\^/g, 'AAAA').replace(/#/g, 'AAA')" : '');
	}


	/*
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
	function encode64(input) {
		input = escape(input)
		var output = ""
		var chr1, chr2, chr3 = ""
		var enc1, enc2, enc3, enc4 = ""
		var i = 0
		do {
			chr1 = input.charCodeAt(i++)
			chr2 = input.charCodeAt(i++)
			chr3 = input.charCodeAt(i++)
			enc1 = chr1 >> 2
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
			enc4 = chr3 & 63
			if (isNaN(chr2)) {
				enc3 = enc4 = 64
			} else if (isNaN(chr3)) {
				enc4 = 64
			}
			output = output +
			keyStr.charAt(enc1) +
			keyStr.charAt(enc2) +
			keyStr.charAt(enc3) +
			keyStr.charAt(enc4)
			chr1 = chr2 = chr3 = ""
			enc1 = enc2 = enc3 = enc4 = ""
		} while(i < input.length)
		return output
	}
	function decode64(input) {
		var output = ""
		var chr1, chr2, chr3 = ""
		var enc1, enc2, enc3, enc4 = ""
		var i = 0
		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		var base64test = /[^A-Za-z0-9\+\/\=]/g
		if (base64test.exec(input)) {
			alert("There were invalid base64 characters in the input text.\n" +
			"Valid base64 characters are A-Z, a-z, 0-9, '+', '/', and '='\n" +
			"Expect errors in decoding.")
		}
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "")
		do {
			enc1 = keyStr.indexOf(input.charAt(i++))
			enc2 = keyStr.indexOf(input.charAt(i++))
			enc3 = keyStr.indexOf(input.charAt(i++))
			enc4 = keyStr.indexOf(input.charAt(i++))
			chr1 = (enc1 << 2) | (enc2 >> 4)
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
			chr3 = ((enc3 & 3) << 6) | enc4
			output = output + String.fromCharCode(chr1)
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2)
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3)
			}
			chr1 = chr2 = chr3 = ""
			enc1 = enc2 = enc3 = enc4 = ""
		} while (i < input.length)
		return unescape(output)
	}
	*/

})(window);