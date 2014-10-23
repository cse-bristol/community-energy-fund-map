"use strict";

/*global module, require*/

var leaflet = require("leaflet"),
    d3 = require("d3"),
    callbackFactory = require("./helpers.js").callbackHandler,

    osmLayer = leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),

    urbanRuralCEF = leaflet.tileLayer('tiles/Z{z}/{x}/{y}.png', {
	attribution: "TODO",
	minZoom: 2,
	maxZoom: 17
    });
    
urbanRuralCEF.options.zIndex = 1;
urbanRuralCEF.legend = function(colour) {
    if (colour.r > 0) {
	if (colour.g > colour.r) {
	    return "Mixed (zoom in for more detail)";
	} else {
	    return "Urban";
	}
    } else {
	return "Rural";
    }
};

var setupPixelHover = function(tileLayer) {
    var colourChanged = callbackFactory();
    tileLayer.colourChanged = colourChanged.add;

    if (tileLayer.legend !== undefined) {

	tileLayer.on("tileload", function(e) {
	    var cache;

	    d3.select(e.tile)
		.on("mousemove", function() {
		    if (cache === undefined) {
			cache = document.createElement("canvas").getContext("2d");
			cache.drawImage(this, 0, 0);
		    }

		    var rect = this.getBoundingClientRect(),
			x = d3.event.offsetX ? d3.event.offsetX : d3.event.clientX - rect.left,
			y = d3.event.offsetY ? d3.event.offsetY : d3.event.clientY - rect.top,
			colourData = cache.getImageData(x, y, 1, 1).data;

		    if (colourData[3] > 0) {
			colourChanged(d3.rgb(colourData[0], colourData[1], colourData[2]));
		    }
		});
	});
    }
};

module.exports = function(map, errors) {
    setupPixelHover(urbanRuralCEF);

    return {
	base: osmLayer,
	overlay: urbanRuralCEF
    };
};


