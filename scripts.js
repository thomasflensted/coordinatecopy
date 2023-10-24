const ACCESS_TOKEN = 'pk.eyJ1IjoidGhvbWFzZmxlbnN0ZWQiLCJhIjoiY2xsdDl0ZDlmMTJ3YTRvcHNlZGttdGlwbyJ9.tBYiw1WNmLoAYxRMd_a3dw';
const DECIMALPOINTS = 5;
mapboxgl.accessToken = ACCESS_TOKEN;

document.addEventListener("DOMContentLoaded", function () {

    var highPrecision = false;
    document.getElementById("precision-check").checked = false;

    // generate map
    const map = new mapboxgl.Map({
        container: 'map', //container ID
        style: 'mapbox://styles/thomasflensted/clltb8sq500aq01qx45ve35k7',
        projection: 'mercator',
        center: [12.5, 25],
        zoom: 1.5
    });

    // show and copy coordinates when map is clicked
    map.on('click', function (e) {

        // create object that holds coordinates
        var coords = {
            lat: highPrecision ? e.lngLat.lat : e.lngLat.lat.toFixed(DECIMALPOINTS),
            lng: highPrecision ? e.lngLat.lng : e.lngLat.lng.toFixed(DECIMALPOINTS),
        };

        hideInstructionsAndShowCoords(coords.lat, coords.lng); // see function name
        copyCoordsToClipboard(coords.lat, coords.lng); // copy coordinates to clipboard
        addMarkerAndRemovePrevious(coords.lat, coords.lng, map); // see function name

    });

    // fly to user's position, display coordinates
    const loc_btn = document.getElementById("loc-btn");
    loc_btn.addEventListener("click", function () {
        getUserPosition(map, highPrecision);
    })

    // show about dialogue when about button is clicked, close when clicked again
    const about = document.getElementById("about-btn");
    about.addEventListener("click", function () {
        current_status = document.getElementById("about-dialogue").style.display;
        document.getElementById("about-dialogue").style.display = current_status == "block" ? "none" : "block";
    })

    // close about dialogue when close button is clicked
    const close_btn = document.getElementById("close-btn");
    close_btn.addEventListener("click", function () {
        document.getElementById("about-dialogue").style.display = "none";
    })

    // zoom out and recenter map when reset button is clicked
    const reset_btn = document.getElementById("reset-btn");
    reset_btn.addEventListener("click", function () {
        resetMap(map)
    })

    // reload site when site name is clicked
    const site_name = document.getElementById("site-name");
    site_name.addEventListener("click", function () {
        location.reload();
    })

    const highPrecisionCheck = document.getElementById("precision-check");
    highPrecisionCheck.addEventListener("click", function () {
        highPrecision = highPrecisionCheck.checked;
    });

});

function flyToUserPos(map, pos, highPrecision) {
    const lat = highPrecision ? pos.coords.latitude : pos.coords.latitude.toFixed(DECIMALPOINTS);
    const lng = highPrecision ? pos.coords.longitude : pos.coords.longitude.toFixed(DECIMALPOINTS);
    addMarkerAndRemovePrevious(lat, lng, map);
    hideInstructionsAndShowCoords(lat, lng);
    copyCoordsToClipboard(lat, lng);
    map.flyTo({
        center: [lng, lat],
        zoom: 16,
        speed: 2,
    });
}

function getUserPosition(map, highPrecision) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            flyToUserPos(map, position, highPrecision);
        }, (error) => {
            handleError(error);
        }
    );
}

function handleError(err) {

    const errors = {
        1: "Access to location denied. Check privacy settings or connection.",
        2: "Unable to retrieve location. Check connection.",
        3: "Request timed out. Check connection."
    };

    const errorMsg = document.getElementById("error-msg");
    document.getElementById("instructions").style.display = "none";
    document.getElementById("coord-container").style.display = "none";
    errorMsg.innerHTML = errors[err.code];
    errorMsg.style.display = "block";
}

function resetMap(map) {
    map.flyTo({
        center: [12.5, 25],
        zoom: 1.5,
    })
}

function addMarkerAndRemovePrevious(lat, lng, map) {

    new mapboxgl.Marker({ color: "#eccc68", scale: 0.7 })
        .setLngLat([lng, lat])
        .addTo(map);

    var allMarkers = document.getElementsByClassName("mapboxgl-marker");
    if (allMarkers.length != 1) {
        allMarkers[0].remove();
    }

}

function copyCoordsToClipboard(lat, lng) {

    const txt = lat + ", " + lng;
    navigator.clipboard.writeText(txt);
    document.execCommand("copy");

}

function hideInstructionsAndShowCoords(lat, lng) {

    document.getElementById("error-msg").style.display = "none"; // hide error message
    document.getElementById("instructions").style.display = "none"; // hide instructions
    document.getElementById("coords").innerHTML = lat + ", " + lng; // display coordinates on screen
    document.getElementById("coord-container").style.display = "block"; // display coordinates on screen

}