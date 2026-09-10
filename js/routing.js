// * file js/routing.js

export async function getRoutes(start, destination, timingMode, selectedDate)   {
    // package the variables for our serverless function
    const requestBody = {
        start,
        destination,
        timingMode,
        selectedDate: selectedDate.toISOString() 
    };

    // fetch from Vercel serverless endpoint
    const response = await fetch('/api/getRoutes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    const data = await response.json(); 
    console.log("Route Data:", data);
    
    return data;
}
