// * file js/parser.js

export function parseRouteData(routeData)  {

    // Check if routes exists and has length
    if (!routeData || !routeData.routes || routeData.routes.length === 0) {
        return []; 
    }
    

    // Array of routes (step by step transit details)
    const routes = routeData.routes; 

    let parsedRoutes = [];
    routes.map(routeObj => {
        let requiredIndexes = [];

        // only 1 leg so only leg[0] is needed
        const leg = routeObj.legs[0];
        leg.steps.map((step, index) => {
            // adds index if the step object has transitDetails
            Object.hasOwn(step, "transitDetails") && requiredIndexes.push(index);
        });
        
        // required info: boardTime,boardStop,mode,color,route,provider,alightTime,alightStop
        let parsedSteps = [];
        for(let index of requiredIndexes)   {
            const transitDetails = leg.steps[index].transitDetails;
            // Change Narrow No-Break Space to regular space
            const boardTime = transitDetails.localizedValues.departureTime.time.text.replace("\u202f", ' ');
            const boardStop = transitDetails.stopDetails.departureStop.name;
            const mode = transitDetails.transitLine.vehicle.name.text;
            const color = transitDetails.transitLine.color;
            const route = transitDetails.transitLine.nameShort + " " + transitDetails.transitLine.name;
            const provider = transitDetails.transitLine.agencies[0].name; // should always only be 1 agency
            // Change Narrow No-Break Space to regular space
            const alightTime = transitDetails.localizedValues.arrivalTime.time.text.replace("\u202f", ' ');
            const alightStop = transitDetails.stopDetails.arrivalStop.name;
            
            parsedSteps.push({boardTime:boardTime,boardStop:boardStop,mode:mode,color:color,route:route,provider:provider,alightTime:alightTime,alightStop:alightStop})
        }
        parsedRoutes.push(parsedSteps);
    });
    return parsedRoutes;
}
