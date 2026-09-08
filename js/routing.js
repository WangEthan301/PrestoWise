// * file js/routing.js

export async function getRoutes(start, destination, timingMode, selectedDate)   {

    const endpointComputeRoutes = "https://routes.googleapis.com/directions/v2:computeRoutes";

    const requestBody = {
        "origin":{
            "placeId": start,
        },
        "destination":{
            "placeId": destination,
        },
        "travelMode": "TRANSIT",
        [timingMode === "leaveBy" ? 'departureTime' : 'arrivalTime']: selectedDate.toISOString(), 
        "computeAlternativeRoutes": true,
        "languageCode": "en-CA",
        "regionCode": "ca",
    }

    const response = await fetch(endpointComputeRoutes, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': CONFIG.MAPS_API_KEY,

            /* data i want back (specified for cost savings)
                https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes?authuser=3#routelegsteptransitdetails
            */
            'X-Goog-FieldMask': 'routes.legs.steps.transitDetails',
        },
        body: JSON.stringify(requestBody)
    });
    
    const data = await response.json(); 
    console.log("Route Data:", data);
    
    return data;
}

