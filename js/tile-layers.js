"use strict";

/*global module, require*/

var leaflet = require("leaflet"),
    d3 = require("d3"),
    callbackFactory = require("./helpers.js").callbackHandler,
    imageData = require("./image-data.js"),

    Esri_WorldTopoMap = leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }),

    urbanRuralCEF = leaflet.tileLayer('tiles/Z{z}/{x}/{y}.png', {
	attribution: '<a href="./method.html">RCEF/UCEF map tiles by the Centre for Sustainable Energy</a>',
	minZoom: 2,
	maxNativeZoom: 16
    });
    
urbanRuralCEF.options.zIndex = 1;
urbanRuralCEF.options.opacity = 0.6;
urbanRuralCEF.legend = function(colour) {
    if (colour.r === 0 && colour.g === 0 && colour.b === 0) {
	return "n/a";

    } else if (colour.r  === colour.b && colour.r === colour.g) {
	return "UCEF";

    } else if (colour.g > 0 && colour.b > 0) {
	return "Mixed (zoom in for more detail)";

    } else if (colour.g > 0) {
	return "Not UCEF";

    } else if (colour.b > 0) {
	return 'Contact DEFRA to determine';
    
    } else {
	return "n/a";
    }
};

var setupPixelHover = function(tileLayer) {
    var colourChanged = callbackFactory();
    tileLayer.colourChanged = colourChanged.add;

    if (tileLayer.legend !== undefined) {

	tileLayer.on("tileload", function(e) {
	    e.tile.cache = imageData(e.tile);

	    d3.select(e.tile)
		.on("mousemove", function() {
		    var rect = this.getBoundingClientRect(),
			x = d3.event.offsetX ? d3.event.offsetX : d3.event.clientX - rect.left,
			y = d3.event.offsetY ? d3.event.offsetY : d3.event.clientY - rect.top,
			colourData = this.cache.getImageData(this, x, y, 1, 1).data;

		    colourChanged(d3.rgb(colourData[0], colourData[1], colourData[2]));
		});
	});
    }
};

module.exports = function(map) {
    setupPixelHover(urbanRuralCEF);

    return {
	base: Esri_WorldTopoMap,
	overlay: urbanRuralCEF
    };
};


