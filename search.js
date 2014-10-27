"use strict";

/*global module, require*/

/*
 Produces a page which is a single search box with a list of results.
 */
var d3 = require("d3"),
    _ = require("lodash"),
    leaflet = require("leaflet"),
    body = d3.select("body"),
    map = new leaflet.Map("map", {
	/* WGS 84 World Mercator */
	crs: leaflet.CRS.EPSG3857
    }),
    tileLayers = require("./tile-layers.js")(map),
    reverseColour = require("./colour.js").reverse,
    colourResult = require("./search-legend.js")(map, tileLayers.overlay).colourResult;

require("leaflet-control-geocoder");

var geocoder = new leaflet.Control.Geocoder.Nominatim({
    geocodingQueryParams: {
	countrycodes: "gb",
	limit: 20
    },
    email: "research@cse.org.uk"
});

d3.select("#geo-search")
    .attr("placeholder", "Postcode")
    .on("input", function(d, i) {
	geocoder.geocode(
	    this.value,
	    function(results) {
		var r = d3.select("#results")
			.selectAll("li")
			.data(
			    results,
			    function(d, i) {
				return d.name;
			    });

		r.exit().remove();
		r.enter().append("li")
		    .text(function(d, i) {
			return d.name;
		    })
		    .each(function(d, i) {
			colourResult(this, d);
		    });
	    }, 
	    this);
    });
