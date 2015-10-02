var map;

function initMap() {
    var customMapType = new google.maps.StyledMapType([
      // {
      //   stylers: [
      //     {hue: '#FFF600'},
      //     {visibility: 'simplified'},
      //     {gamma: 0.5},
      //     {weight: 0.5}
      //   ]
      // },
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{visibility: 'on'}
          ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'all',
        stylers: [{color: '#ffe24d'},
                  {visibility: 'simplified'}
          ]
      },
      {
        featureType: "landscape.man_made",
        elementType: "geometry",
        stylers: [{weight: 0.9},
                  {visibility: 'off'}
          ]
      },
      {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [{visibility: 'on'},
                  {color: '#83CEAD'}
          ]
      },
      {
        featureType: 'road',
        elementType: 'all',
        stylers: [{color: '#FFFFFF'},
                  {visibility: 'on'}
          ]
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [{visibility: 'simplified'},
                  {color: '#158c28'}]
      },
      {
        featureType: 'water',
        stylers: [{color: '#B3DEE5'}]
      },
      {
        featureType: 'road.arterial',
        stylers: [{visibility: 'on'},
                  {color: '#FEE379'}
          ]
      },
      {
        featureType: 'road.highway',
        stylers: [{visibility: 'on'},
                  {color: '#FEE379'}
        ]
      }
    ], {
      name: 'Custom Style'
  });
  var customMapTypeId = 'custom_style';
  // set up the map
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(36.778259, -119.417931),
    zoom: 6
  });


  map.mapTypes.set(customMapTypeId, customMapType);
  map.setMapTypeId(customMapTypeId);
}

function loadGeoJsonString(geoString) {
  var geojson = JSON.parse(geoString);
  map.data.addGeoJson(geojson);
  zoom(map);
  map.data.setStyle({
    draggable: true, // turn off if it gets annoying
    editable: true,
    strokeColor: '#2E3253',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#2E3253',
    fillOpacity: 0.35
  });

}

/**
 * Update a map's viewport to fit each geometry in a dataset
 * @param {google.maps.Map} map The map to adjust
 */
function zoom(map) {
  var bounds = new google.maps.LatLngBounds();
  map.data.forEach(function(feature) {
    processPoints(feature.getGeometry(), bounds.extend, bounds);
  });
  console.log(bounds);
  map.fitBounds(bounds);
}

/**
 * Process each point in a Geometry, regardless of how deep the points may lie.
 * @param {google.maps.Data.Geometry} geometry The structure to process
 * @param {function(google.maps.LatLng)} callback A function to call on each
 *     LatLng point encountered (e.g. Array.push)
 * @param {Object} thisArg The value of 'this' as provided to 'callback' (e.g.
 *     myArray)
 */
function processPoints(geometry, callback, thisArg) {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry);
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get());
  } else {
    geometry.getArray().forEach(function(g) {
      processPoints(g, callback, thisArg);
    });
  }
}



/* DOM (drag/drop) functions */

function initEvents() {
  // set up the drag & drop events
  var mapContainer = document.getElementById('map');
  var dropContainer = document.getElementById('drop-container');

  // map-specific events
  mapContainer.addEventListener('dragenter', showPanel, false);

  // overlay specific events (since it only appears once drag starts)
  dropContainer.addEventListener('dragover', showPanel, false);
  dropContainer.addEventListener('drop', handleDrop, false);
  dropContainer.addEventListener('dragleave', hidePanel, false);

}

function showPanel(e) {
  e.stopPropagation();
  e.preventDefault();
  document.getElementById('drop-container').style.display = 'block';
  return false;
}

function hidePanel(e) {
  document.getElementById('drop-container').style.display = 'none';
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  hidePanel(e);

  var files = e.dataTransfer.files;

  if (files.length) {
    // process file(s) being dropped
    // grab the file data from each file
    for (var i = 0, file; file = files[i]; i++) {
      var reader = new FileReader();
      console.log(reader);
      reader.onload = function(e) {
        loadGeoJsonString(e.target.result);
      };
      reader.onerror = function(e) {
        console.error('reading failed');
      };
      reader.readAsText(file);
    }
  } else {
    // process non-file (e.g. text or html) content being dropped
    // grab the plain text version of the data
    var plainText = e.dataTransfer.getData('text/plain');
    if (plainText) {
      loadGeoJsonString(plainText);
    }
  }

  // prevent drag event from bubbling further
  return false;
}


function initialize() {
  initMap();
  initEvents();
}
