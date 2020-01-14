/*****************************************************************
    Mapping USGS Earth Data with Leaflet
 *****************************************************************/

 // Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl, function(data) {
// Once we get a response, send the data.features object to the createFeatures function.
createFeatures(data.features);
});

// Function mag2color takes a number (magnitude) and returns an r,g,b color 
// based on a scale of 1(red) to 50(yellow) to 100(red).
function mag2color(mag) {
  var perc = (mag + 1) * 10;
	var r, g, b = 0;
	if(perc > 50) {
		r = 255;
		g =  Math.round(510 - 5.10 * perc);//Math.round(5.1 * perc);
	}
	else {
		g = 255;
		r = Math.round(5.1 * perc);//Math.round(510 - 5.10 * perc);
	}
	var h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}

// Function makeCircle is returns circle marker parameters by using earthquake
// magnitude to scale the color.
function circleParams(mag) {
  var params = {
    radius: mag * 7.5,
    color: mag2color(mag),
    fillColor: mag2color(mag),
    fillOpacity: 0.6,
    opacity: 1,
  };
  //console.log(params);
  return params;
}

// Function createFeatures takes the earthquake geoJson and adds the popups and
// circle markers to a layer.
function createFeatures(quakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  // Use pointToLayer to create a circle marker
  function pointToLayer(feature, latlng) {
    marker =  new L.circleMarker(latlng, circleParams(feature.properties.mag));
    console.log(marker);
    return marker;
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(quakeData, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });//.addTo(myMap);

  // Create a map object
  var myMap = L.map("map", {
    center: [44.58, -103.46],
    zoom: 4,
    layers: [lightMap, earthquakes]
  });

  // 
  
  var legend = L.control({position: 'bottomleft'});
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend");
    const mags = new Array(1, 2.5, 5, 7.5, 9);
    const colors = [];
    
    for (var i=0; i < mags.length; i++) {
      var color = mag2color(mags[i]);
      colors.push(color);
    }
   
    var labels = [];
    //console.log(colors);
    var legendInfo = "<h2>Recorded Earthquakes</h2>" +
      "<h3>Within Past Day</h3>" +
      "<div class=\"labels\">" +
        "<div class=\"min-max\"><PRE>1       5        9 </PRE></div>" +
      "</div>";

    // Add legendInfo to the HTML
    div.innerHTML = legendInfo;

    mags.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });
    // Add the color scale labels to the HTML
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}