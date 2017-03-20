function initMap() {
    //CREATE MAP //////////////////////////////////////////
    var map = new google.maps.Map(document.getElementById('meat-map'), {
        center: lastPos,
        zoom: 15,
        disableDefaultUI: true,
        styles: mapStyle // Styles a map in night mode.
    });

    // Creating a global infoWindow object that will be reused by all markers
    var infoWindow = new google.maps.InfoWindow();

    // Looping through the JSONMARKER data
    for (var i = 0, length = jsonMarker.length; i < length; i++) {
        var data = jsonMarker[i],
            latLng = new google.maps.LatLng(data.lat, data.lng);

    // Creating a marker and putting it on the map
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: data.title
        });

    // Creating a closure to retain the correct data, notice how I pass the current data in the loop into the closure (marker, data)
        (function(marker, data) {

    // Attaching a click event to the current marker
            google.maps.event.addListener(marker, "click", function(e) {
                infoWindow.setContent(data.description);
                infoWindow.open(map, marker);
            });
        })(marker, data);
    }

    // Define Marker
    var blueMarker = {
        url: "https://www.meat-map.com/svg/geolocation.svg",
        fillOpacity: .9,
        anchor: new google.maps.Point(3, 18),
        strokeWeight: 0,
        scaledSize: new google.maps.Size(30, 36),
    };

    // Set special Marker to last position.
    var geoPosition = new google.maps.Marker({
        position: lastPos,
        map: map,
        icon: blueMarker
    });

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
            geoPosition.setPosition(pos);

        }, function() {
    // Information send to HandleLocationError Function - Browser supports Geolocation
            handleLocationError(true, geoPosition, map, map.getCenter());
        });
    } else {
    // Information send to HandleLocationError Function - Browser doesn't support Geolocation
        handleLocationError(false, marker, map, lastPos); //Should be set to a default LatLang
    };
}; //END OF MAP INIT //////////////////////////////////////////

function handleLocationError(browserHasGeolocation, geoPosition, map, lastPos) {
    geoPosition.setPosition(lastPos);
    map.setCenter(lastPos);
}
