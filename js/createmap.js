$.when(lastPos, mapStyle, jsonMarker).done(function createMap() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyApvU9qq_94kSmbOrB0qgV8c6W__CAiKV4&callback=initMap';
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(script);
});
