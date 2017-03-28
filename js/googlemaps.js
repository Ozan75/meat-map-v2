////////////////////////////////////////////////////////////////////////////////
function initMap() { // BEGIN OF MAP INIT //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    loadScript("js/globals.js", geoLocation);
    console.log(pos);

    ////////////////////////////////////////////////////////////////////////////
    // Defining Map and Elements
    ////////////////////////////////////////////////////////////////////////////

    // Map definition
    var map = new google.maps.Map(document.getElementById('meat-map'), {
        center: pos,
        zoom: 15,
        disableDefaultUI: true,
        styles: mapStyle, // Styles a map in night mode.
        gestureHandling: 'greedy'
    });

    // redMarker
    var redMarker = {
        url: "https://www.meat-map.com/svg/marker-red.svg",
        fillOpacity: .9,
        anchor: new google.maps.Point(5, 50),
        strokeWeight: 0,
        scaledSize: new google.maps.Size(43, 49),
    };

    // blueMarker
    var positionMarker = {
        url: "https://www.meat-map.com/svg/geolocation.svg",
        fillOpacity: .9,
        anchor: new google.maps.Point(24, 24),
        strokeWeight: 0,
        scaledSize: new google.maps.Size(48, 48)
    };

    // InfoWindow
    var infoWindow = new google.maps.InfoWindow();

    ////////////////////////////////////////////////////////////////////////////
    // Geolocation Marker
    ////////////////////////////////////////////////////////////////////////////

    var geoPosition = new google.maps.Marker({
        position: pos,
        map: map,
        icon: positionMarker
    });


    ////////////////////////////////////////////////////////////////////////////
    // check URL and center on Marker
    ////////////////////////////////////////////////////////////////////////////

    if (getUrl === "https://" + cleanURL + "/" || getUrl === "https://" + cleanURL) {

        // Centering Map and repositionig Marker
        map.setCenter(pos);
        geoPosition.setPosition(pos);

    } else {

        // loading the Marker related to id on URL ID base
        var i = urlID - 1;
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
            map.setCenter(marker.getPosition());

        })(marker, data);
    };


    ////////////////////////////////////////////////////////////////////////////
    // POI Marker and click function
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

                history.pushState(data, null, "?=" + data["id"]);
                //infoWindow.setContent(data.description);
                //infoWindow.open(map, marker);
            });
        })(marker, data);
    };

    ////////////////////////////////////////////////////////////////////////////
    // Saving and calling Markers in Browser history
    ////////////////////////////////////////////////////////////////////////////

    window.onpopstate = function(event) {
        // history chanvged because of pushState/replaceState
        // if history back ends at meat-map.com load geolocation instead of Marker
        if (event.state === null) {

            map.setCenter(pos);
            geoPosition.setPosition(pos);

        } else {

            var id = JSON.stringify(event.state.id);
            var i = id - 1;
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
                map.setCenter(marker.getPosition());

            })(marker, data);

        };
    };


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
    geoPosition.setPosition(pos);
    map.setCenter(pos);
}
