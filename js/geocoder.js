"use strict";

/*global module, require*/

var L = require("leaflet"),
    d3 = require("d3");

require("leaflet-control-geocoder");

module.exports = function() {
    return {
	geocode: function(query, cb, context) {
	    var params = {
		singleLine: query + " England",
		f: "pjson"
	    };

	    L.Control.Geocoder.getJSON(
		"http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates", 
		params, 
		function(data) {
		    var results = d3.map();

		    if (data.candidates && data.candidates.length) {
			for (var i = 0; i <= data.candidates.length - 1; i++) {
			    var loc = data.candidates[i],
				northEast = L.latLng(loc.extent.ymax, loc.extent.xmin),
				southWest = L.latLng(loc.extent.ymin, loc.extent.xmax);

			    results.set(loc.address, {
				rank: i,
				name: loc.address,
				bbox: L.latLngBounds(northEast, southWest),
				center: L.latLng(loc.location.y, loc.location.x)
			    });
			}
		    }

		    cb.call(
			context, 
			results.values().sort(function(a, b) {
			    return a.rank - b.rank;
			}));
		});
	}
    };
};
