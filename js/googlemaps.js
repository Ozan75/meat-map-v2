////////////////////////////////////////////////////////////////////////////////
function initMap() { // BEGIN OF MAP INIT //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////


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

    // SelectedMarker
    var selectedMarker = {
        url: "https://www.meat-map.com/svg/marker-red.svg",
        fillOpacity: .9,
        anchor: new google.maps.Point(16, 50),
        strokeWeight: 0,
        scaledSize: new google.maps.Size(43, 50)
    };

    // DefaultMarker
    var defaultMarker = {
        url: "https://www.meat-map.com/svg/marker-blue.svg",
        fillOpacity: .9,
        anchor: new google.maps.Point(16, 50),
        strokeWeight: 0,
        scaledSize: new google.maps.Size(43, 50)
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
    // Set geoposition Marker
    ////////////////////////////////////////////////////////////////////////////

    var geoPosition = new google.maps.Marker({
        position: pos,
        map: map,
        icon: positionMarker
    });


    ////////////////////////////////////////////////////////////////////////////
    // check URL and set center on Marker
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
            icon: defaultMarker,
            title: data.title
        });

        document.getElementById("infobox").style.marginTop = "-" + screenHeight * 0.4 + "px";
        map.panTo(marker.getPosition());
        //map.panBy(0, screenHeight / 7);
        map.setZoom(15);
    };


    ////////////////////////////////////////////////////////////////////////////
    // check GeoLocation and set center on users positions
    ////////////////////////////////////////////////////////////////////////////

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
    };

    function success(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        // Saving current geo location to Local Storage as a STRING
        localStorage.setItem('currentPos', JSON.stringify(pos));

        // Centering Map and repositionig Marker
        map.setCenter(pos);
        geoPosition.setPosition(pos);
    };

    function error() {
        alert("Unable to retrieve your location");
    };

    navigator.geolocation.getCurrentPosition(success, error);


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
            icon: defaultMarker,
            title: data.title
        });

        // Creating a closure to retain the correct data, notice how I pass the current data in the loop into the closure (marker, data)
        (function(marker, data) {
            // Attaching a click event to the current marker
            google.maps.event.addListener(marker, "click", function(e) {

                document.getElementById("infobox").style.marginTop = "-" + screenHeight * 0.4 + "px";
                map.panTo(marker.getPosition());
                //map.panBy(0, screenHeight / 7);
                map.setZoom(15);

                history.pushState(data, null, "?=" + data["id"]);
                //infoWindow.setContent(data.description);
                //infoWindow.open(map, marker);
            });
        })(marker, data);


        ////////////////////////////////////////////////////////////////////////////
        // Click to reGeolocate current position
        ////////////////////////////////////////////////////////////////////////////

        // Wait for the page to load first
        window.onload = function() {

            //Get a reference to the link on the page
            // with an id of "mylink"
            var a = document.getElementById("refresh");

            //Set code to run when the link is clicked
            // by assigning a function to "onclick"
            a.onclick = function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                // Saving current geo location to Local Storage as a STRING
                localStorage.setItem('currentPos', JSON.stringify(pos));

                // Centering Map and repositionig Marker
                map.setCenter(pos);
                geoPosition.setPosition(pos);

                return false;
            }
        }
    };


    ////////////////////////////////////////////////////////////////////////////
    // Saving and calling Markers in Browser history
    ////////////////////////////////////////////////////////////////////////////

    window.onpopstate = function(event) {
        // history chanvged because of pushState/replaceState
        // if history back ends at meat-map.com load geolocation instead of Marker
        if (event.state === null) {

            document.getElementById("infobox").style.marginTop = "0";
            map.panTo(pos);
            map.setZoom(15);
            geoPosition.setPosition(pos);

            history.pushState(data, null, "?=" + data["id"]);

        } else {


            // loading the Marker related to id on History ID base
            var id = JSON.stringify(event.state.id);
            var i = id - 1;
            var data = jsonMarker[i],
                latLng = new google.maps.LatLng(data.lat, data.lng);

            // Putting Marker on the map
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: defaultMarker,
                title: data.title
            });

            document.getElementById("infobox").style.marginTop = "-" + screenHeight * 0.4 + "px";
            map.panTo(marker.getPosition());
            //map.panBy(0, screenHeight / 7);
            map.setZoom(15);

        };
    };


    ////////////////////////////////////////////////////////////////////////////
    // Adding transparency class to overlying header while drgging map
    ////////////////////////////////////////////////////////////////////////////

    google.maps.event.addListener(map, 'click', function() {
        document.getElementById("infobox").style.marginTop = "0";
    });

    // When dragging
    google.maps.event.addListener(map, 'dragstart', function() {
        var d = document.getElementById("header");
        d.className += " map_drag";
        document.getElementById("infobox").style.marginTop = "0";
    });

    // When dragging ends
    google.maps.event.addListener(map, 'dragend', function() {
        var d = document.getElementById("header");
        d.className -= " map_drag";
        document.getElementById("infobox").style.marginTop = "0";
    });

    ////////////////////////////////////////////////////////////////////////////
}; //END OF MAP INIT ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
