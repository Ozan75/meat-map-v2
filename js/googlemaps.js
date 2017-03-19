function initMap() {

var map = new google.maps.Map(document.getElementById('meat-map'), {
  center: lastPos,
  zoom: 15,
  disableDefaultUI: true,
  styles: mapStyle // Styles a map in night mode.
});


var icon = {
    url: "https://www.meat-map.com/svg/geolocation.svg",
    fillOpacity: .9,
    anchor: new google.maps.Point(3,18),
    strokeWeight: 0,
    scaledSize: new google.maps.Size(30, 36),
};

var marker = new google.maps.Marker({position: lastPos, map: map, icon: icon}); // Set special Marker to last position.

// Try HTML5 geolocation.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

  // Saving current geo location to Local Storage as a STRING
  localStorage.setItem('currentPos', JSON.stringify(pos));
  var pos = JSON.parse(localStorage.getItem('currentPos'));

  // Centering Map and repositionig Marker
  map.setCenter(pos);
  marker.setPosition(pos);

  }, function() {
    // Information send to HandleLocationError Function - Browser supports Geolocation
    handleLocationError(true, marker, map, map.getCenter());
  });
} else {
  // Information send to HandleLocationError Function - Browser doesn't support Geolocation
  handleLocationError(false, marker, map, lastPos); //Should be set to a default LatLang
};
}; setTimeout(initMap, 20); // Timeout length & END OF MAP INIT

function handleLocationError(browserHasGeolocation, marker, map, lastPos) {
marker.setPosition(lastPos);
map.setCenter(lastPos);
}
