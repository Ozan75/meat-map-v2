// VARS

// passing over last known Geo location from Local Storage as an ARRAY
var lastPos = JSON.parse(localStorage.getItem('currentPos'));
var jsonMarker;
var mapStyle;

// DEFINING VAR & SAVING JSON STYLE FILE INTO VAR
$.getJSON("https://www.meat-map.com/json/mapstyles/lunar_landscape.json", function(json) {
    mapStyle = json;
});


// DEFINING VAR JSON Marker
$.getJSON("https://www.meat-map.com/json/marker.json", function(json) {
    jsonMarker = json;
});
