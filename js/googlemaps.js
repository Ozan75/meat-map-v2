////////////////////////////////////////////////////////////////////////////////
function initMap() { // BEGIN OF MAP INIT //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    //CREATE MAP
    var map = new google.maps.Map(document.getElementById('meat-map'), {
        center: lastPos,
        zoom: 15,
        disableDefaultUI: true,
        styles: mapStyle // Styles a map in night mode.
    });

    // Creating redMarker
    var redMarker = {
        url: "https://www.meat-map.com/svg/marker-red.svg",
        fillOpacity: .9,
        anchor: new google.maps.Point(5, 50),
        strokeWeight: 0,
        scaledSize: new google.maps.Size(43, 49),
    };

    // Creating blue marker
    var positionMarker = {
        url: "https://www.meat-map.com/svg/geolocation.svg",
        fillOpacity: .9,
        anchor: new google.maps.Point(24, 24),
        strokeWeight: 0,
        scaledSize: new google.maps.Size(48, 48)
    };


    ////////////////////////////////////////////////////////////////////////////
    // Creating a global infoWindow object that will be reused by all markers
    ////////////////////////////////////////////////////////////////////////////

    var infoWindow = new google.maps.InfoWindow();


    ////////////////////////////////////////////////////////////////////////////
    // POI Marker
    ////////////////////////////////////////////////////////////////////////////

    // Looping through the jsonMarker data
    for (var i = 0, length = jsonMarker.length; i < length; i++) {
        var data = jsonMarker[i],
            latLng = new google.maps.LatLng(data.lat, data.lng);

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


    ////////////////////////////////////////////////////////////////////////////
    // Geolocation Marker
    ////////////////////////////////////////////////////////////////////////////

    var geoPosition = new google.maps.Marker({
        position: lastPos,
        map: map,
        icon: positionMarker
    });


    ////////////////////////////////////////////////////////////////////////////
    // Try HTML5 geolocation.
    ////////////////////////////////////////////////////////////////////////////

    loadScript("/js/globals.js", locateMe);

    ////////////////////////////////////////////////////////////////////////////
    // Adding transparency class to overlying header while drgging map
    ////////////////////////////////////////////////////////////////////////////

    // When dragging
    google.maps.event.addListener(map, 'drag', function() {
        var d = document.getElementById("header");
        d.className += " map_drag";
    });

    // When dragging ends
    google.maps.event.addListener(map, 'dragend', function() {
        var d = document.getElementById("header");
        d.className -= " map_drag";
    });


    ////////////////////////////////////////////////////////////////////////////
}; //END OF MAP INIT ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Use localStorage lastPos
////////////////////////////////////////////////////////////////////////////////

function handleLocationError(browserHasGeolocation, geoPosition, map, pos) {
    geoPosition.setPosition(lastPos);
    map.setCenter(lastPos);
}
