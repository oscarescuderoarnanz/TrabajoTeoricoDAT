'use strict'

var latitud = 40.2;
var longitud = -3.6;
var zoom = 2;
var map = L.map('map').setView([latitud, longitud], zoom);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var markerClusters = L.markerClusterGroup();

for (var i = 0; i < markers.length; ++i) {
  var popup = markers[i].name +
    '<br/>' + markers[i].city +
    '<br/><b>IATA/FAA:</b> ' + markers[i].iata_faa +
    '<br/><b>ICAO:</b> ' + markers[i].icao +
    '<br/><b>Altitude:</b> ' + Math.round(markers[i].alt * 0.3048) + ' m' +
    '<br/><b>Timezone:</b> ' + markers[i].tz;

  var m = L.marker([markers[i].lat, markers[i].lng])
    .bindPopup(popup);

  markerClusters.addLayer(m);
}

map.addLayer(markerClusters);
