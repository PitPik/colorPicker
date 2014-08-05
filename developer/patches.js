;(function(window, undefined){
	"use strict"

	var shades = document.getElementById('shades'),
		ctx = shades.getContext('2d'),
		myImage,
		counter = 1,
		scale = 1,
		dim = 256 / scale,
		DIM = 255,
		imageData = ctx.createImageData(dim * counter, dim),
		data  = imageData.data,
		x = 0, y = 0, count = 0, z = 0;

	shades.width  = dim * counter;
	shades.height = dim;

	for (x = 0; x < dim; x += 1) {
		for (y = 0; y < dim; y += 1) {
			count = (x * dim * 4 * counter) + (y * 4);
			z = 0;


			// data[z + count++] = DIM - x * scale;
			// data[z + count++] = DIM - x * scale;
			// data[z + count++] = DIM - x * scale;
			// data[z + count++] = Math.abs(DIM - x * 2 * scale);

			data[z + count++] = 128; // 127 ???
			data[z + count++] = 128;
			data[z + count++] = 128;
			data[z + count++] = Math.abs(DIM - y * scale);

			z += DIM * 4;
		}
	}

	ctx.putImageData(imageData, 0, 0);

	myImage = shades.toDataURL("image/png");
	console.log(myImage.length)
	document.getElementById("MyPix").src = myImage;
})(window);