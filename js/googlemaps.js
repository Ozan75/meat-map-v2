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

        // Creating red marker
        var redMarker = {
            url: "https://www.meat-map.com/svg/marker-red.svg",
            fillOpacity: .9,
            anchor: new google.maps.Point(5, 50),
            strokeWeight: 0,
            scaledSize: new google.maps.Size(43, 49),
        };
        // Putting Marker on the map
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: redMarker,
            title: data.title
        });

        // Creating a closure to retain the correct data, notice how I pass the current data in the loop into the closure (marker, data)
        (function(marker, data) {

            // Attaching a click event to the current marker
            google.maps.event.addListener(marker, "click", function(e) {
                map.setCenter(marker.getPosition());
                var d = document.getElementById("infobox");
                d.className += "box_slide_in";
                //infoWindow.setContent(data.description);
                //infoWindow.open(map, marker);
            });
        })(marker, data);
    }

    // Creating blue marker
    var blueMarker = {
        url: "https://www.meat-map.com/svg/geolocation.svg",
        fillOpacity: .9,
        anchor: new google.maps.Point(24, 24),
        strokeWeight: 0,
        scaledSize: new google.maps.Size(48, 48),
    };

    // Putting Marker on the map
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

    // Adding transparency toe overlying header while drgging map
    google.maps.event.addListener(map, 'drag', function() {
        var d = document.getElementById("header");
        d.className += " map_drag";
    });
    google.maps.event.addListener(map, 'dragend', function() {
        var d = document.getElementById("header");
        d.className -= " map_drag";
    });

}; //END OF MAP INIT //////////////////////////////////////////

function handleLocationError(browserHasGeolocation, geoPosition, map, lastPos) {
    geoPosition.setPosition(lastPos);
    map.setCenter(lastPos);
}
