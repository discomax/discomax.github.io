

const MAP_KEY = "pk.eyJ1IjoiZGlzY29tYXgiLCJhIjoiY2p0bGtwdjdvMGN0ZzRhcGVoaHBrdGRvNiJ9.1FRcT1k-Vdo3ZLHVSp28Fg";
// Creating map object

// Arrays to store created restMarkers
var allRestaurants = [];
var greenRestaurants = [];
var violetRestaurants = []; 
var yellowRestaurants = [];
var redRestaurants = [];

// loop through the cities array, create a new marker for each city. 
// for (var i = 0; i < restaurants.length; i++) {
d3.json("final.json", function(data) {
   
   //var restString = JSON.stringify(data);
   var restaurants = data;
   // console.log(restaurants);
   
   // Create custom markers
   var greenMarker = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    var violetMarker = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }); 

    var yellowMarker = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }); 

    var redMarker = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }); 
   // Function to determine the custom marker color based on price
   function chooseMarker(price) {
      switch(price) {
         case "$$$$": return greenMarker;
         case "$$$": return violetMarker;
         case "$$": return yellowMarker;
         case "$": return redMarker;
      }
   }

   // Frunction popupString creates string for a restaurants pop-up.
   function popupString(restaurant) {
      var string = "<h2>" + restaurant.name + "</h2><hr> \
         <p><font size='3'> \
         Category: " + restaurant.type + "<br> \
         Prince: " + restaurant.price + "<br> \
         Rating: " + restaurant.rating + "<br><br> \
         Address: <br> \
         " + restaurant.address + "<br>" + restaurant.city + " " + restaurant.zip + "\
         </font></p>";

      return string;
   }
   
   // Function chooseArray uses the price to determine what color array
   // To push the marker to the correspondingn array.
   function chooseArray(price, marker) {
      switch(price) {
         case "$$$$": greenRestaurants.push(marker);
         case "$$$": violetRestaurants.push(marker);
         case "$$": yellowRestaurants.push(marker);
         case "$": redRestaurants.push(marker);
      }
   }
   
   for (var i=0; i < restaurants.length; i++) {
   // Make a variables to hold info about each restaurant for use in markers.
      var rName = restaurants[i].name;
      var rLocation = [restaurants[i].lat, restaurants[i].long];
      var rPrice = restaurants[i].price;
      // Create the restaurant's marker using the coordinates using loc,
      // Bind a pop-up with restaurant info & push it to the allRestaurants array.
      var restaurantMarker = L.marker(rLocation, {icon: chooseMarker(rPrice), title: rName, riseOnHover: true})
         .bindPopup(popupString(restaurants[i]));
      // Push marker to the allRestaurants array.
      allRestaurants.push(restaurantMarker);
      // Use chooseArray to push marker to corresponding color array.
      chooseArray(rPrice, restaurantMarker);
      
   }

   // Create variables for the base layers.
   var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: MAP_KEY
   });

   var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: MAP_KEY
});
   // Use the marker arrays to create layers.
   var allLayer = L.layerGroup(allRestaurants);
   var greenLayer = L.layerGroup(greenRestaurants);
   var violetLayer = L.layerGroup(violetRestaurants);
   var yellowLayer = L.layerGroup(yellowRestaurants);
   var redLayer = L.layerGroup(redRestaurants);
   
   // Create a baseMaps object
   var baseMaps = {
      "Street Map": streetMap,
      "Dark Map": darkMap
   };

   // Create an overlay object
   var overlayMaps = {
      "All Restaurants": allLayer,
      "Price: $": redLayer,
      "Price: $$": yellowLayer,
      "Price: $$$": violetLayer,
      "Price: $$$$": greenLayer
   };

   //Create the map with Charlotte's lat and long.
   var charlotteLat, charlotteLong;
   charlotteLat = 35.227085;
   charlotteLong = -80.843124;

   var restaurantMap = L.map("map", {
      center: [charlotteLat, charlotteLong],
      zoom: 10.25,
      layers: [streetMap, allLayer]
   });

   // Create the layer control and add to map
   L.control.layers(baseMaps, overlayMaps, {
         collapsed: false
      }).addTo(restaurantMap);
   });



