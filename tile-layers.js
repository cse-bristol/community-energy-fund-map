"use strict";

/*global module, require*/

var leaflet = require("leaflet"),
    d3 = require("d3"),
    callbackFactory = require("./helpers.js").callbackHandler,

    osmLayer = leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),

    //http://test-tiles.0d9303a4.cdn.memsites.com/Total%20Heat%20Density/Z{z}/{y}/{x}.png
    nationalHeatMap = leaflet.tileLayer('/heat-map-cdn/Total%20Heat%20Density/Z{z}/{y}/{x}.png', {
	attribution: '<a href="http://tools.decc.gov.uk/nationalheatmap/">English National Heat Map</a>,',
	minZoom: 2,
	maxZoom: 17
    });
nationalHeatMap.options.zIndex = 1;

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
    nationalHeatMap.legend = require("./heat-map-legend.js")(map, errors);
    setupPixelHover(nationalHeatMap);

    return {
	base: osmLayer,
	overlay: nationalHeatMap
    };
};


