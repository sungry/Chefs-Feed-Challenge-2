// var file = document.getElementById('file').files[0];

function initialize() {
  var mapCanvas = document.getElementById('map');
  var map = new google.maps.Map(mapCanvas);
  google.maps.event.addDomListener(window, 'load', initialize);
}