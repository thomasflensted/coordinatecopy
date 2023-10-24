const ACCESS_TOKEN = 'pk.eyJ1IjoidGhvbWFzZmxlbnN0ZWQiLCJhIjoiY2xsdDl0ZDlmMTJ3YTRvcHNlZGttdGlwbyJ9.tBYiw1WNmLoAYxRMd_a3dw';
const DECIMALPOINTS = 5;
mapboxgl.accessToken = ACCESS_TOKEN;

document.addEventListener("DOMContentLoaded", function () {

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
            lat: e.lngLat.lat.toFixed(DECIMALPOINTS),
            lng: e.lngLat.lng.toFixed(DECIMALPOINTS),
        };

        hideInstructionsAndShowCoords(coords.lat, coords.lng); // see function name
        copyCoordsToClipboard(coords.lat, coords.lng); // copy coordinates to clipboard
        addMarkerAndRemovePrevious(coords.lat, coords.lng, map); // see function name

    });

    // fly to user's position, display coordinates
    const loc_btn = document.getElementById("loc-btn");
    loc_btn.addEventListener("click", function () {
        getUserPosition(map);
    })

    // show about dialogue when about button is clicked
    const about = document.getElementById("about-btn");
    about.addEventListener("click", function () {
        document.getElementById("about-dialogue").style.display = "block";
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

});

function flyToUserPos(map, pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    addMarkerAndRemovePrevious(lat, lng, map);
    hideInstructionsAndShowCoords(lat.toFixed(DECIMALPOINTS), lng.toFixed(DECIMALPOINTS));
    copyCoordsToClipboard(lat.toFixed(DECIMALPOINTS), lng.toFixed(DECIMALPOINTS));
    console.log(lng, lat);
    map.flyTo({
        center: [lng, lat],
        zoom: 16,
        speed: 2,
    });
}

function getUserPosition(map) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            flyToUserPos(map, position);
        }, (error) => {
            handleError(error);
        }
    );
}

function handleError(err) {

    const errors = {
        1: "User denied access to location",
        2: "Unable to retrieve location",
        3: "Time out"
    };
    console.log(errors[err.code]);
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

    document.getElementById("instructions").style.display = "none"; // hide instructions
    document.getElementById("coord-container").style.display = "block"; // display coordinates on screen
    document.getElementById("coords").innerHTML = lat + ", " + lng; // display coordinates on screen

}