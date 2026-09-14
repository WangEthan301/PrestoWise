// * file api/getRoutes.js

export default async function handler(req, res) {
    // only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { start, destination, timingMode, selectedDate } = req.body;

    const endpointComputeRoutes = "https://routes.googleapis.com/directions/v2:computeRoutes";

    const requestBody = {
        "origin":{
            "placeId": start,
        },
        "destination":{
            "placeId": destination,
        },
        "travelMode": "TRANSIT",
        [timingMode === "leaveBy" ? 'departureTime' : 'arrivalTime']: selectedDate, 
        "computeAlternativeRoutes": true,
        "languageCode": "en-CA",
        "regionCode": "ca",
    }

    try {
        const response = await fetch(endpointComputeRoutes, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // use environment variable for secret key
                'X-Goog-Api-Key': process.env.ROUTES_API_KEY, 
                
                /* data i want back (specified for cost savings)
                    https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes?authuser=3#routelegsteptransitdetails
                */
                'X-Goog-FieldMask': 'routes.legs.steps.transitDetails',
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json(); 
        
        // send response back to frontend
        return res.status(200).json(data);
        
    } catch (error) {
        console.error("Routing error:", error);
        return res.status(500).json({ error: 'Failed to fetch routes' });
    }
}
