"use strict";

/*global module, require*/

var leaflet = require("leaflet"),
    d3 = require("d3"),
    callbackFactory = require("./helpers.js").callbackHandler,

    Esri_WorldTopoMap = leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }),

    urbanRuralCEF = leaflet.tileLayer('tiles/Z{z}/{x}/{y}.png', {
	attribution: "TODO",
	minZoom: 2,
	maxZoom: 17
    });
    
urbanRuralCEF.options.zIndex = 1;
urbanRuralCEF.options.opacity = 0.6;
urbanRuralCEF.legend = function(colour) {
    if (colour.r === 0 && colour.g === 0 && colour.b === 0) {
	return "N/A";
    } else if (colour.r > 0) {
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
			var canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;

			var cache = canvas.getContext("2d");
			cache.drawImage(this, 0, 0);
		    }

		    var rect = this.getBoundingClientRect(),
			x = d3.event.offsetX ? d3.event.offsetX : d3.event.clientX - rect.left,
			y = d3.event.offsetY ? d3.event.offsetY : d3.event.clientY - rect.top,
			colourData = cache.getImageData(x, y, 1, 1).data;

		    colourChanged(d3.rgb(colourData[0], colourData[1], colourData[2]));
		});
	});
    }
};

module.exports = function(map, errors) {
    setupPixelHover(urbanRuralCEF);

    return {
	base: Esri_WorldTopoMap,
	overlay: urbanRuralCEF
    };
};


