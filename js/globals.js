////////////////////////////////////////////////////////////////////////////////
// globals
////////////////////////////////////////////////////////////////////////////////

function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
};

////////////////////////////////////////////////////////////////////////////////
// Global VARS
////////////////////////////////////////////////////////////////////////////////

// 1. passing over last known Geo location from Local Storage as an ARRAY
var lastPos = JSON.parse(localStorage.getItem('currentPos'));
var jsonMarker;
var mapStyle;
var map;

// 2. DEFINING VAR & SAVING JSON STYLE FILE INTO VAR
$.getJSON("https://www.meat-map.com/json/mapstyles/lunar_landscape.json", function(json) {
    mapStyle = json;
});


// 3. DEFINING VAR JSON Marker
$.getJSON("https://www.meat-map.com/json/marker.json", function(json) {
    jsonMarker = json;
});


////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////

// 1. Geolocation
var locateMe = function() {
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
        handleLocationError(false, geoPosition, map, map.getCenter()); //Should be set to a default LatLang
    };
};

//
