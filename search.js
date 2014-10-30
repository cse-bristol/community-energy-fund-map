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
    tileLayers = require("./js/tile-layers.js")(map),
    reverse = require("./js/colour.js").reverse,
    colourResult = require("./js/search-legend.js")(map, tileLayers.overlay).colourResult;

var geocoder = require("./js/geocoder.js")(),
    geocode = _.debounce(geocoder.geocode, 50);


d3.select("#geo-search")
    .attr("placeholder", "Postcode")
    .on("input", function(d, i) {
	var search = this.value,
	    searchEl = this;

	geocode(
	    search,
	    function(results) {
		if (search !== searchEl.value) {
		    /* If the search text has changed, throw away these results.. */
		    return;
		}
		    
		var r = d3.select("#results")
			.selectAll("li")
			.data(
			    results,
			    function(d, i) {
				return d.name;
			    });

		r.exit().remove();
		var li = r.enter().append("li");

		li
		    .append("span")
		    .classed("search-result", true)
		    .text(function(d, i) {
			return d.name;
		    });

		li
		    .each(function(d, i) {
			var el = d3.select(this);

			colourResult(d, function(colour, legend) {
			    el
				.style("background-color", colour)
				.style("color", reverse(colour))
				.append("span")
				.html(legend)
				.classed("search-result-legend", true);

			    el.selectAll("a").style("color", reverse(colour));
			});
		    });
	    }, 
	    this);
    });
