"use strict";

/*global module, require*/

var L = require("leaflet");

require("leaflet-control-geocoder");

module.exports = function() {
    return {
	geocode: function(query, cb, context) {
	    var params = {
		singleLine: query, // + " England"
		f: "pjson"
	    };

	    L.Control.Geocoder.getJSON(
		"http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates", 
		params, 
		function(data) {
		    var results = [];

		    if (data.candidates && data.candidates.length) {
			for (var i = 0; i <= data.candidates.length - 1; i++) {
			    var loc = data.candidates[i],
				northEast = L.latlng(loc.extent.ymax, loc.extent.xmin),
				southWest = L.latlng(loc.extend.ymin, loc.extend.xmax);

			    results[i] = {
				name: loc.address,
				bbox: L.latLngBounds(northEast, southWest),
				center: L.latLng(loc.location.y, loc.location.x)
			    };
			}
		    }

		    cb.call(context, results);
		});
	}
    };
};
