// * file autocomplete.js

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
