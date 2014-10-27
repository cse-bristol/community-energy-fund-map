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
    geocoderClass = require("leaflet-control-geocoder"),
    leaflet = require("leaflet"),
    body = d3.select("body"),
    mapDiv = body.append("div").attr("id", "map"),
    legend = body.append("div").attr("id", "legend"),
    map = new leaflet.Map("map", {
	doubleClickZoom: false
	/* WGS 84 World Mercator */
	,crs: leaflet.CRS.EPSG3857,
	maxZoom: 17
    })
	.setView(startCoordinates, zoom),
    tileLayers = require("./tile-layers.js")(map),
    reverseColour = require("./colour.js").reverse,
    geocoder = new geocoderClass({
	email: "research@cse.org.uk"
    });

require("./search-legend.js")(map, tileLayers.overlay).modifyGeocoder(geocoder);
    
map
    .addControl(geocoder)
    .addLayer(tileLayers.base)
    .addLayer(tileLayers.overlay);

tileLayers.overlay.colourChanged(function(colour) {
    legend
	.style("background-color", colour)
	.style("color", reverseColour(colour))
	.text(tileLayers.overlay.legend(colour));
});
