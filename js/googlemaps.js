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
        gestureHandling: 'greedy',
        clickableIcons: false

    });

    // redMarker
    var redMarker = {
        url: "https://www.meat-map.com/svg/marker-red.svg",
        fillOpacity: .9,
        anchor: new google.maps.Point(15, 50),
        strokeWeight: 0,
        scaledSize: new google.maps.Size(43, 49),
    };

    // BlueMarker
    var blueMarker = {
        url: "https://www.meat-map.com/svg/marker-blue.svg",
        fillOpacity: .9,
        anchor: new google.maps.Point(24, 24),
        strokeWeight: 0,
        scaledSize: new google.maps.Size(48, 48)
    };

    // positionMarker
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
    // Defiing selectedMarker
    ////////////////////////////////////////////////////////////////////////////

    var selectedMarker


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
            $('#infobox').animate({
                marginTop: "-" + screenHeight / 2
            }, 500);
            map.panTo(marker.getPosition());
            map.panBy(0, screenHeight / 7);
            map.setZoom(15);

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
            icon: blueMarker,
            title: data.title
        });

        // Creating a closure to retain the correct data, notice how I pass the current data in the loop into the closure (marker, data)
        (function(marker, data) {
            // Attaching a click event to the current marker
            google.maps.event.addListener(marker, "click", function(e) {

                // change selected Marker to selected state
                if (selectedMarker) {
                    selectedMarker.setIcon(blueMarker);
                    geoPosition.setIcon(positionMarker);
                }
                marker.setIcon(redMarker);
                selectedMarker = marker;

                // Animate content Box into view
                $('#infobox').animate({
                    marginTop: "-" + screenHeight / 2
                }, 500);
                map.panTo(marker.getPosition());
                map.panBy(0, screenHeight / 7);
                map.setZoom(15);

                // Add selection to Browser history
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

            map.panTo(pos);
            map.setZoom(15);
            geoPosition.setPosition(pos);

            history.pushState(data, null, "?=" + data["id"]);

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
                map.panTo(marker.getPosition());
                map.setZoom(15);

            })(marker, data);

        };
    };


    ////////////////////////////////////////////////////////////////////////////
    // Adding transparency class to overlying header while drgging map
    ////////////////////////////////////////////////////////////////////////////

    google.maps.event.addListener(map, 'click', function() {
        $('#infobox').animate({
            marginTop: '0'
        }, 500);
        map.panTo(marker.getPosition());
        map.setZoom(15);
    });

    // When dragging
    google.maps.event.addListener(map, 'dragstart', function() {
        var d = document.getElementById("header");
        d.className += " map_drag";
        $('#infobox').animate({
            marginTop: '0'
        }, 500);
    });

    // When dragging ends
    google.maps.event.addListener(map, 'dragend', function() {
        var d = document.getElementById("header");
        d.className -= " map_drag";
        $('#infobox').animate({
            marginTop: '0'
        }, 500);
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
    map.setZoom(15);
}
