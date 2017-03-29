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
var pos = JSON.parse(localStorage.getItem('currentPos'));
var jsonMarker = "";
var getUrl = window.location.href; //https://www.meat-map.com/?=1
var cleanURL = window.location.host; //www.meat-map.com
var urlID = window.location.href.replace('https://www.meat-map.com/?=', ''); //1
var mapStyle = "";
var map = "";

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


var geoLocation = function() {

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
    };

    function error() {
        alert("Unable to retrieve your location");
    };

    navigator.geolocation.getCurrentPosition(success, error);
};
