// * file parser.js

export function parseRouteData(routeData)  {
    const routes = routeData.routes; // Array of routes (step by step transit details)

    let parsedRoutes = [];
    routes.map(routeObj => {
        let requiredIndexes = [];

        // only 1 leg so only leg[0] is needed
        const leg = routeObj.legs[0];
        leg.steps.map((step, index) => {
            // adds index if the step object has transitDetails
            Object.hasOwn(step, "transitDetails") && requiredIndexes.push(index);
        });
        console.log(requiredIndexes);
        
        // required info: boardTime,boardStop,mode,color,route,provider,alightTime,alightStop
        let parsedSteps = [];
        for(let index of requiredIndexes)   {
            const transitDetails = leg.steps[index].transitDetails;
            console.log(transitDetails);
            const boardTime = transitDetails.localizedValues.departureTime.time.text;
            const boardStop = transitDetails.stopDetails.departureStop.name;
            const mode = transitDetails.transitLine.vehicle.name.text;
            const color = transitDetails.transitLine.color;
            const route = transitDetails.transitLine.nameShort + " " + transitDetails.transitLine.name;
            const provider = transitDetails.transitLine.agencies[0].name; // should always only be 1 agency
            const alightTime = transitDetails.localizedValues.arrivalTime.time.text;
            const alightStop = transitDetails.stopDetails.arrivalStop.name;
            
            parsedSteps.push({boardTime:boardTime,boardStop:boardStop,mode:mode,color:color,route:route,provider:provider,alightTime:alightTime,alightStop:alightStop})
        }
        parsedRoutes.push(parsedSteps);
    });
    console.log(parsedRoutes);
    return parsedRoutes;
}
