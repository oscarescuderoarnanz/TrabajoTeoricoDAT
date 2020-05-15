'use strict'

let casaMarker = new L.Icon({
  iconUrl: './images/casa.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50]
});

let personaMarker = new L.Icon({
  iconUrl: './images/persona.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50]
});

function printMarcador(map, clave, marcador) {
  var coordsLocalStorage = JSON.parse(localStorage.getItem(clave));
  if (coordsLocalStorage !== null && coordsLocalStorage !== undefined) {
    var valores = Object.values(coordsLocalStorage);
    var coords = [valores[0], valores[1]];
    var mi_marcador = L.marker(coords, {
      icon: marcador
    }).addTo(map);
  }
}

function createmap() {
  var coords = JSON.parse(localStorage.getItem("casa"));
  if (coords === null || coords === undefined) {
    var valores = [40.319613, -3.875987]
  } else {
    var valores = Object.values(coords);
  }
  var zoom = 15;
  var map = L.map('map').setView([valores[0], valores[1]], zoom);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  return map;
}

function guardarCoordsCasa() {
  var dicc = {
    "latitud": $("#latitud01").val(),
    "longitud": $("#longitud01").val()
  }
  localStorage.setItem("casa", JSON.stringify(dicc));
}

function guardarCoordsMiPosicion() {
  var dicc = {
    "latitud": $("#latitud02").val(),
    "longitud": $("#longitud02").val()
  }
  localStorage.setItem("yo", JSON.stringify(dicc));
}

function guardarCoordsPosActual(clave) {
  let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    let x = pos.coords;
    var dicc = {
      "latitud": x.latitude,
      "longitud": x.longitude,
    }
    console.log(clave)
    localStorage.setItem(clave, JSON.stringify(dicc));
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };
  navigator.geolocation.getCurrentPosition(success, error, options);
}

function printCirculo(map) {
  var coords = JSON.parse(localStorage.getItem("casa"))
  if (coords !== null && coords !== undefined) {
    var valores = Object.values(coords);
    coords = [valores[0], valores[1]];
    var circle = L.circle(coords, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);
  }
}

function calculoDistanciaEntrePuntos(map) {
  var msg;

  var coords = JSON.parse(localStorage.getItem("casa"))
  if (coords !== null && coords !== undefined) {
    var valores = Object.values(coords);
    var latlngcasa = L.latLng(valores[0], valores[1]);

    coords = JSON.parse(localStorage.getItem("yo"))
    valores = Object.values(coords);
    var latlngyo = L.latLng(valores[0], valores[1]);

    var distancia = map.distance(latlngcasa, latlngyo);

    if (distancia > 500) {
      msg = "Estas fuera de los límites establecidos. Entre dentro del círculo o podrá ser multado."
    } else {
      msg = "Se encuentra dentro del círculo. No corre peligro de ser multado."
    }
    return msg;
  } else {
    return "Aún no ha establecido coordenadas."
  }
}

function deletepasswords() {
  localStorage.clear();
}


$(document).ready(function() {
  let map;

  $("#casa01").click(function() {
    guardarCoordsCasa();
  });
  $("#casa02").click(function() {
    guardarCoordsPosActual("casa");
  });

  $("#yo01").click(function() {
    guardarCoordsMiPosicion();
  });
  $("#yo02").click(function() {
    guardarCoordsPosActual("yo");
  });


  map = L.map('map');
  var myRenderer = L.canvas({
    padding: 0.5
  });
  var line = L.polyline([40.283155, -3.819714], {
    renderer: myRenderer
  });
  var circle = L.circle([40.283155, -3.819714], {
    renderer: myRenderer
  });
  printMarcador(map, "casa", casaMarker);
  printMarcador(map, "yo", personaMarker);
  // Pinto un circulo de 1 km
  printCirculo(map);

  $("#out").text(calculoDistanciaEntrePuntos(map));

  $("#boton02").click(function() {
    deletepasswords();
  });

  var circle = L.circleMarker([40.283155, -3.819714], {
    radius: 50
  }).addTo(map);

});
