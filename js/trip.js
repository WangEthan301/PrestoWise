// * file trip.js

import { getRoutes } from "./routing.js";

// Request needed libraries.
const { PlaceAutocompleteElement } = await google.maps.importLibrary('places');

// Shared configuration for both (Toronto 130km)
const toronto130kmBounds = {
    north: 44.8232, south: 42.4832, east: -77.7632, west: -81.0032,
};

// variables to hold place ids
let startPlaceId = null;
let destinationPlaceId = null;

// setup start
const startAutocomplete = new PlaceAutocompleteElement();
startAutocomplete.id = "start-input";
startAutocomplete.placeholder = "Enter starting point...";
startAutocomplete.locationRestriction = toronto130kmBounds;
startAutocomplete.includedRegionCodes = ['ca'];
startAutocomplete.requestedFields = ['id', 'displayName']; //limit for cost savings

document.getElementById("start-trip").appendChild(startAutocomplete);

// setup destination
const destinationAutocomplete = new PlaceAutocompleteElement();
destinationAutocomplete.id = "destination-input";
destinationAutocomplete.placeholder = "Enter destination...";
destinationAutocomplete.locationRestriction = toronto130kmBounds;
destinationAutocomplete.includedRegionCodes = ['ca'];
destinationAutocomplete.requestedFields = ['id', 'displayName']; //limit for cost savings

document.getElementById("destination-trip").appendChild(destinationAutocomplete);



// LISTENERS ------
startAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
    startPlaceId = placePrediction.placeId;
    const startName = String(placePrediction.mainText);
    console.log("Start set to:", startName, "ID:", startPlaceId);
    tryToRoute();
});

destinationAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
    destinationPlaceId = placePrediction.placeId;
    const destinationName = String(placePrediction.mainText);
    console.log("Destination set to:", destinationName, "ID:", destinationPlaceId);
    tryToRoute();
});


// TIME

const timeEl = document.getElementById("trip-time");
const modeEl = document.getElementById("time-mode");

let timingMode = "leaveBy"; 
let selectedDate = new Date(); // Default to now


// format Date object (YYYY-MM-DDTHH:MM) for init and handling invalid
function formatNowForInput() {
    const now = new Date();
    // Adjust for local timezone offset
    now.setMinutes(now.getMinutes()-now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}

timeEl.value = formatNowForInput();

modeEl.addEventListener("change", () => {
    timingMode = modeEl.value;
    console.log("Mode changed to:", timingMode);
    tryToRoute();
});

// 3. Listen for Time changes
timeEl.addEventListener("change", () => {
    const now = new Date();

    selectedDate = new Date(timeEl.value);
    
    // reset to now if date is invalid or in the past
    if (isNaN(selectedDate.getTime()) || selectedDate.getTime() < now.getTime()) {
        console.error("Date invalid or in past:",selectedDate.getTime());
        selectedDate = now;
        timeEl.value = formatNowForInput();
        return;
    }
    
    console.log("Time changed to:", selectedDate.toLocaleString());
    tryToRoute();
});


function tryToRoute() {
    if (startPlaceId && destinationPlaceId) {
        console.log("--- Routing Request ---");
        console.log("From:", startPlaceId);
        console.log("To:", destinationPlaceId);
        console.log("Timing:", timingMode, selectedDate);
        getRoutes(startPlaceId,destinationPlaceId,timingMode,selectedDate);
    }
}
