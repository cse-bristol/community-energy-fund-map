"use strict";

/*global module, require*/

var d3 = require("d3");

/*
 Gets the pixel data of an image as a canvas context.

 Only works if the image is server from the same domain as this file.
 */
module.exports = function(img) {
    var canvas = document.createElement("canvas");
   canvas.width = img.naturalWidth;
   canvas.height = img.naturalHeight;
    
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);

    return {
	getImageData: function(img, x, y, xSize, ySize) {

	    return context.getImageData(

		x * canvas.width / img.width, 
		y * canvas.height / img.height, 
		xSize, 
		ySize);
	}
    };
};
