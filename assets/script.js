var map = L.map('map').setView([51.505, -0.09], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

if (!navigator.geolocation) {
    console.log("Geolocation is not supported by this browser.");
} else {
    setInterval(() => {
        navigator.geolocation.getCurrentPosition(getPosition);
    }, 5000);
}

var marker, circle, secondMarker, destinationCircle, routingControl;
var fitBoundsExecuted = false;
var lat, long;
var destinationLat, destinationLng;

// Custom red marker icon
var redIcon = L.icon({
    iconUrl: 'location-pin.png', // Replace with the path to your red marker icon
    iconSize: [40, 40], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    shadowUrl: '', // Replace with the path to your marker shadow icon
    shadowSize: [41, 41]  // size of the shadow
});

function getPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    var accuracy = position.coords.accuracy;

    if (marker) {
        map.removeLayer(marker);
    }
    if (circle) {
        map.removeLayer(circle);
    }

    marker = L.marker([lat, long]).bindPopup("This is your current location");
    circle = L.circle([lat, long], { radius: accuracy });

    var featureGroup = L.featureGroup([marker, circle]).addTo(map);
    if (!fitBoundsExecuted) {
        map.fitBounds(featureGroup.getBounds());
        fitBoundsExecuted = true;
    }

    // Check if the current location is within 100 meters of the destination
    if (destinationLat && destinationLng) {
        var distance = map.distance([lat, long], [destinationLat, destinationLng]);
        if (distance <= 100) {
            triggerAlarm();
        }
    }
}

map.on("click", (e) => {
    if (!secondMarker) {
        secondMarker = L.marker([e.latlng.lat, e.latlng.lng], { draggable: true, icon: redIcon }).addTo(map);
        createDestinationCircle(e.latlng);
        destinationLat = e.latlng.lat;
        destinationLng = e.latlng.lng;

        secondMarker.on('dragend', function (event) {
            var marker = event.target;
            var position = marker.getLatLng();
            updateRoute(position);
            createDestinationCircle(position);
            destinationLat = position.lat;
            destinationLng = position.lng;
        });

        addRoute([lat, long], [e.latlng.lat, e.latlng.lng]);
    } else {
        secondMarker.setLatLng([e.latlng.lat, e.latlng.lng]);
        secondMarker.setIcon(redIcon);
        updateRoute([e.latlng.lat, e.latlng.lng]);
        createDestinationCircle(e.latlng);
        destinationLat = e.latlng.lat;
        destinationLng = e.latlng.lng;
    }
});

function addRoute(start, end) {
    if (routingControl) {
        map.removeControl(routingControl);
    }

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(start[0], start[1]),
            L.latLng(end[0], end[1])
        ],
        createMarker: function() { return null; } // Do not create default markers
    }).addTo(map);
}

function updateRoute(newPosition) {
    if (routingControl) {
        var waypoints = routingControl.getWaypoints();
        waypoints[1].latLng = L.latLng(newPosition.lat, newPosition.lng);
        routingControl.setWaypoints(waypoints);
    }
}

function createDestinationCircle(position) {
    if (destinationCircle) {
        map.removeLayer(destinationCircle);
    }
    destinationCircle = L.circle([position.lat, position.lng], { radius: 100, color: 'red' }).addTo(map);
}

function triggerAlarm() {
    
    // Play alarm sound
    var alarmSound = document.getElementById("alarmSound");
    alarmSound.play();

    // Vibrate phone
    if (navigator.vibrate) {
        navigator.vibrate([500, 500, 500]);
    }
}

//burger menu 

const burgerMenu = document.getElementById("burger");
const navbarMenu = document.getElementById("menu");

// Responsive Navbar Toggle
burgerMenu.addEventListener("click", function () {
  navbarMenu.classList.toggle("active");
  burgerMenu.classList.toggle("active");
  console.log("first")
});
