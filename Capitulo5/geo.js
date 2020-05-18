'use strict'

// Iconos diseñados por <a href="https://www.flaticon.es/autores/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.es/" title="Flaticon"> www.flaticon.es</a>
// Iconos diseñados por <a href="https://www.flaticon.es/autores/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.es/" title="Flaticon"> www.flaticon.es</a>
// Iconos diseñados por <a href="https://www.flaticon.es/autores/xnimrodx" title="xnimrodx">xnimrodx</a> from <a href="https://www.flaticon.es/" title="Flaticon"> www.flaticon.es</a>
let data = [
  [40.4165000, -3.7025600, 0.7, 50000, 12000, 3500], //Comunidad de Madrid
  [39.2699200, -2.6011900, 2, 18000, 6000, 1750], // Castilla la Mancha
  [42.7932, -7.83653, 1.8, 6000, 2500, 700], // Galicia
  [42.0095500, -4.5240600, 1.5, 30000, 10000, 2000], //Castilla y Leon
  [39.4764900, -6.3722400, 2, 3000, 550, 90], // Extremadura
  [37.503440, -4.360360, 2.5, 15000, 5000, 1500], // Andalucia
  [41.9139, 1.68135, 0.7, 35000, 15000, 3000] //Cataluña
]

let enfermosIcon = new L.Icon({
  iconUrl: './images/enfermo.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50]
});

let curadosIcon = new L.Icon({
  iconUrl: './images/icon.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50]
});

let fallecidosIcon = new L.Icon({
  iconUrl: './images/caja.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50]
});

function coord(radio) {
  var x, sen, cos, coordrandom, r;

  x = Math.random() * (2 * Math.PI - 0);
  sen = Math.sin(x);
  cos = Math.cos(x);
  r = Math.random() * (radio - 0);
  coordrandom = sen * cos * r;

  return coordrandom
}

function pesosmarcadores(){
  // Peso de los marcadores: 10, 100 y 1000
  // El peso es proporcionado 10 para la etiqueta con menos pacientes
  // 1000 para la etiqueta con mas pacientes, siendo la etiqueta el marcador.
  var enfermos = 0;
  var curados = 0;
  var fallecidos = 0;
  var arr = [];
  var pesos = [];
  for (var a = 0; a < data.length; a++) {
    // enfermosIcon
    enfermos += data[a][3] - (data[a][4] + data[a][5]);
    // curadosIcon
    curados += data[a][4];
    //fallecidosIcon
    fallecidos += data[a][5];
  }
  arr = [enfermos, curados, fallecidos]
  for (var a = 0; a < arr.length; a++) {
    var variable = Math.round(arr[a]/7);
    switch (true) {
      case variable < 5000:
        pesos.push(100);
        break;
      case variable < 10000:
        pesos.push(500);
        break;
      default:
        pesos.push(1000);
    }
  }
  // [enfermos, curados, fallecidos]
  return pesos
}


function printmarcadores(latitud, longitud, r, map, pacientes, texto, marker, pesos) {
  var coords, mi_marcador, a;

  for (var b = 0; b < Math.round((pacientes / pesos)); b++) {
    coords = [latitud + coord(r), longitud + coord(r)];
    mi_marcador = L.marker(coords, {
      icon: marker
    }).addTo(map);
    mi_marcador.bindPopup(pesos + " " + texto).openPopup();
  }
}

function printmarcadorescomunidades(map) {
  var pesos = pesosmarcadores();
  for (var a = 0; a < data.length; a++) {
    var r;

    r = data[a][2];
    // enfermos
    printmarcadores(data[a][0], data[a][1], r, map, data[a][3] - (data[a][4] + data[a][5]), "enfermos", enfermosIcon, pesos[0]);
    // curados
    printmarcadores(data[a][0], data[a][1], r, map, data[a][4], "curados", curadosIcon, pesos[1]);
    //fallecidos
    printmarcadores(data[a][0], data[a][1], r, map, data[a][5], "fallecidos", fallecidosIcon, pesos[2]);
  }
}

function inserlegend(map){
  var leyenda = L.control({
    position: 'bottomright'
  });
  leyenda.onAdd = function(mapa) {
    var div = L.DomUtil.create('div', 'info leyenda');
    div.innerHTML += '<img alt="legend" src="./images/leyenda.png " width="150" height="120"/>'
    return div;
  };
  leyenda.addTo(map);
}

function insertmaptitle(map){
  var title = L.control();

  title.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info');
    div.innerHTML +=
      '<h2>COVID-19 - ESPAÑA</h2>';
    return div;
  };

  title.addTo(map);
}

function createmap(){
  var latitud = data[0][0];
  var longitud = data[0][1];
  var zoom = 7;
  var map = L.map('map').setView([latitud, longitud], zoom);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  L.control.scale().addTo(map);

  return map;
}

$(document).ready(function() {
  let map;
  map = createmap();
  printmarcadorescomunidades(map);
  inserlegend(map);
  insertmaptitle(map);
});
