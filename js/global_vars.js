// VARS

// passing over last known Geo location from Local Storage as an ARRAY
var lastPos = JSON.parse(localStorage.getItem('currentPos'));

// DEFINING VAR & SAVING JSON STYLE FILE INTO VAR
var mapStyle;

$.getJSON("https://www.meat-map.com/json/mapstyles/lunar_landscape.json", function(json) {
    mapStyle = json;
});
