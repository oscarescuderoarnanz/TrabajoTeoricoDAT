'use strict'

function createmap(){
  var latitud = 40;
  var longitud = -5;
  var zoom = 4;
  var map = L.map('map').setView([latitud, longitud], zoom);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  L.control.scale().addTo(map);

  return map;
}

function getRadius(r) {
  return r >= 100000 ? 25 :
    r >= 10000 ? 15 :
    r >= 5000 ? 7 :
    r >= 1000 ? 3 :
    3;
};

function estilo_covid(feature) {
  return {
    radius: getRadius(feature.properties.Confirmed),
  };
};

function popup_covid(feature, layer) {
  layer.bindPopup("<div style=text-align:center><h3>" + feature.properties.Country_Region +
    "<h3></div><hr><table><tr><td>Confirmados: " + feature.properties.Confirmed +
    "</td></tr><tr><td>Muertes: " + feature.properties.Deaths +
    "</td></tr><tr><td>Recuperados: " + feature.properties.Recovered +
    "</td></tr></table>", {
      minWidth: 150,
      maxWidth: 200
    });
};

$(document).ready(function() {
  var map = createmap();

  var MarkerOptions = {
    fillColor: "#FF4000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  var covidMundo = L.geoJSON(covid, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, MarkerOptions);
    },
    style: estilo_covid,
    onEachFeature: popup_covid
  });
  map.addLayer(covidMundo);


  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend');
    var grades = [1000, 5000, 10000, 100000];
    var labels = ['<strong>Número de afectados</strong>'];
    var categories = ['< 5000', '5000-10000', '10000-100000', '>100000'];

    for (var i = 0; i < grades.length; i++) {
      var grade = grades[i];
      labels.push(
        '<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadius(grade))) + 'px;"></i> <i style="background: #FF4000; width: ' + getRadius(grade) * 2 + 'px; height: ' + getRadius(grade) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadius(grade))) + 'px;"></i><i class="circlepadding" style="width: ' + Math.max(2, (25 - 2 * getRadius(grade))) + 'px;"></i> ' + categories[i]);
    }
    div.innerHTML = labels.join('<br>');
    return div;
  };
  legend.addTo(map);


  var title = L.control();

  title.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info');
    div.innerHTML +=
      '<h2>COVID-19</h2>Número de afectados por país.';
    return div;
  };

  title.addTo(map);
});
