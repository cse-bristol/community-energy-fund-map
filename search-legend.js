"use strict";

/*global module, require, d3*/

var reverse = require("./colour.js").reverse,
    leaflet = require("leaflet"),
    imageData = require("./image-data.js");

module.exports = function(map, geocoder, tileLayer) {
    var wrapped = geocoder._createAlt,
	cache = d3.map();

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

    var annotateResult = function(r, key, offset) {
	var colourData = cache.get(key).getImageData(offset.x, offset.y, 1, 1).data,
	    colour = d3.rgb(colourData[0], colourData[1], colourData[2]);

	r.append("span")
	    .text(tileLayer.legend(colour));

	r
	    .style("background-color", colour)
	    .style("color", reverse(colour));
    };

    geocoder._createAlt = function(d, i) {
	var result = wrapped.call(geocoder, d, i),
	    zoom = map.getBoundsZoom(d.bbox);

	if (zoom > tileLayer.options.maxZoom) {
	    zoom = tileLayer.options.maxZoom;
	}
	
	var center = tileLookup(d.center, zoom),
	    key = center.tile.x + ':' + center.tile.y + ':' + center.tile.z,
	    r = d3.select(result);

	if (cache.has(key)) {
	    // Re-use the image if we've already looked at it.
	    console.log(key);
	    annotateResult(r, key, center.offset);

	} else if (key in tileLayer._tiles) {
	    // If this tile has been requested by the map, use it.
	    cache.set(key, tileLayer._tiles[key].cache);
	    annotateResult(r, key, center.offset);

	} else {
	    // Otherwise, load the tile.
	    var img = document.createElement('img');
	    img.src = tileLayer.getTileUrl(center.tile);
	    img.onload = function() {
		cache.set(key, imageData(img));
		annotateResult(r, key, center.offset);
	    };
	}

	return result;
    };
};

