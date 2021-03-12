var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [40.73, -74.0059],
    zoom: 3,
    layers:[lightmap]
  });

// Perform an API call to get quake information.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl, function(data) {
  function markerStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: markerColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: markerRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // set different color from magnitude
    function markerColor(depth) {
    switch (true) {
    case depth > 300:
      return "red";
    case depth  > 70:
      return "orange";
    default:
      return "yellow";
    }
  }
  // get the marker Radius using the magnitude
    function markerRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }
    // GeoJSON layer
    L.geoJson(data, {
      //the markers will be circles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // set the style
      style: markerStyle,
      // popup for the markers
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(map);
    var legend = L.control({
      position: "bottomleft"
    });
  
    // legend info
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "marker legend");
  
      var grades = ["shallow","medium","deep"];
      var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",

      ];
  
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'> " +
          grades[i] + "</i><br>";
      }
      return div;
    };
  
    // Add the legend.
    legend.addTo(map);

})