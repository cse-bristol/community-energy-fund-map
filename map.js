"use strict";

/*global module, require*/

/*
 This file is where all the mess and wiring goes.
 We should always aim to reduce its size.
 */
var startCoordinates = [55.5, 0],
    zoom = 6,
    d3 = require("d3"),
    _ = require("lodash"),
    leaflet = require("leaflet"),
    body = d3.select("body"),
    mapDiv = body.append("div").attr("id", "map"),
    legend = body.append("div").attr("id", "legend"),
    map = new leaflet.Map("map", {
	/* WGS 84 World Mercator */
	crs: leaflet.CRS.EPSG3857
    })
	.setView(startCoordinates, zoom),
    tileLayers = require("./js/tile-layers.js")(map),
    reverseColour = require("./js/colour.js").reverse;

require("leaflet-control-geocoder");
var geocoder = new leaflet.Control.Geocoder({
    collapsed: false,
    email: "research@cse.org.uk",
    geocoder: require("./js/geocoder.js")()
});

require("./js/search-legend.js")(map, tileLayers.overlay).modifyGeocoder(geocoder);
    
map
    .addControl(geocoder)
    .addLayer(tileLayers.base)
    .addLayer(tileLayers.overlay);

tileLayers.overlay.colourChanged(function(colour) {
    var mouse = d3.mouse(document.body);

    legend
    	.style("left", mouse[0] + "px")
	.style("top", mouse[1] + "px")
	.style("background-color", colour)
	.style("color", reverseColour(colour))
	.html(tileLayers.overlay.legend(colour));

    legend.selectAll("a")
	.style("color", reverseColour(colour));
});
