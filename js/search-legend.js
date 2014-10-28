"use strict";

/*global module, require, d3*/

var reverse = require("./colour.js").reverse,
    leaflet = require("leaflet"),
    imageData = require("./image-data.js");

module.exports = function(map, tileLayer) {
    var cache = d3.map();

    var tileLookup = function(latlng, zoom) {
	var s = tileLayer.options.tileSize,
	    pixel = map.project(latlng, zoom),
	    tileX = Math.floor(pixel.x / s),
	    tileY = Math.floor(pixel.y / s),
	    offsetX = Math.floor(pixel.x % s),
	    offsetY = Math.floor(pixel.y % s);

	return {
	    tile: {
		x: tileX,
		y: tileY,
		z: zoom
	    },
	    offset: {
		x: offsetX,
		y: offsetY
	    }
	};
    };

    var colourAndLegend = function(key, offset) {
	var colourData = cache.get(key).getImageData(offset.x, offset.y, 1, 1).data,
	    colour = d3.rgb(colourData[0], colourData[1], colourData[2]);

	if (colourData[3] === 0) {
	    return {
		colour: null,
		legend: ""
	    };
	} else {
	    return {
		colour: colour,
		legend: tileLayer.legend(colour)
	    };
	}
    };

    var colourResult = function(data, callback) {
	var zoom = map.getBoundsZoom(data.bbox);

	if (zoom > tileLayer.options.maxZoom) {
	    zoom = tileLayer.options.maxZoom;
	}
	
	var center = tileLookup(data.center, zoom),
	    key = center.tile.x + ':' + center.tile.y + ':' + center.tile.z,
	    callbackWithParams = function() {
		var result = colourAndLegend(key, center.offset);
		callback(result.colour, result.legend);
	    };


	if (cache.has(key)) {
	    // Re-use the image if we've already looked at it.
	    callbackWithParams();

	} else if (tileLayer._tiles && key in tileLayer._tiles) {
	    // If this tile has been requested by the map, use it.
	    cache.set(key, tileLayer._tiles[key].cache);
	    callbackWithParams();

	} else {
	    // Otherwise, load the tile.
	    var img = document.createElement('img');
	    img.onload = function() {
		cache.set(key, imageData(img));
		callbackWithParams();
	    };
	    img.onerror = function() {
		callback(null, "");
	    };
	    img.src = tileLayer.getTileUrl(center.tile);
	}
    };

    return {
	modifyGeocoder: function(geocoder) {
	    var wrapped = geocoder._createAlt;

	    geocoder._createAlt = function(d, i) {
		var result = wrapped.call(geocoder, d, i);

		colourResult(d, function(colour, legend) {
		    var el = d3.select(result);
		    el
			.style("background-color", colour)
			.selectAll("span")
			.style("color", reverse(colour));
		});

		return result;
	    };
	},
	colourResult: colourResult 
    };
};

