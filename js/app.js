// * file js/app.js

import { fares } from "./fares.js";
import { getRoutes } from "./routing.js";
import { parseRouteData } from "./parser.js";
import {
  initTripInputs,
  startPlaceId,
  destinationPlaceId,
  timingMode,
  selectedDate,
} from "./trip.js";

const outputEl = document.getElementById("output");
const outputSection = document.getElementById("output-section");
const ageGroupEl = document.getElementById("age-group");
const routeTripBtn = document.getElementById("route-trip");
const nextRouteBtn = document.getElementById("next-route");
const prevRouteBtn = document.getElementById("prev-route");
const routeIndexEl = document.getElementById("route-indexEl");

initTripInputs();

let routeData;
let routeIndex = 0;

let ageGroup = ageGroupEl.value;
ageGroupEl.addEventListener("change", () => {
    ageGroup = ageGroupEl.value;
    if (routeData?.length) {
        calculateFare();
    }
});

routeTripBtn.disabled = true;
nextRouteBtn.disabled = true;
prevRouteBtn.disabled = true;
outputSection.hidden = true;

const incrementRouteIndex = () => {
    if (!routeData?.length) return;
    if(routeIndex<routeData.length-1) { // stored as 0 based
        routeIndex++;
        updateRouteIndex();
    }
}

const decrementRouteIndex = () => {
    if (!routeData?.length) return;
    if(routeIndex > 0) { // stored as 0 based
        routeIndex--;
        updateRouteIndex();
    }
}

const updateRouteIndex = () =>    {
    if (!routeData?.length) return;
    calculateFare();
    // displayed as 1 based
    routeIndexEl.textContent = `${routeIndex+1}/${routeData.length}`;

    nextRouteBtn.disabled = routeIndex >= routeData.length-1;
    prevRouteBtn.disabled = routeIndex <= 0;
}

nextRouteBtn.addEventListener("click",incrementRouteIndex);
prevRouteBtn.addEventListener("click",decrementRouteIndex);

async function tryToRoute() {
    if (startPlaceId && destinationPlaceId) {

        outputSection.removeAttribute("hidden");

        // Handle same start and end location (save api credits)
        if(startPlaceId === destinationPlaceId) {
            outputEl.innerHTML = `<p class="error-msg">No transit routes found for this trip. Try using different start and end locations.</p>`;
            return; // stop routing request from being sent
        }

        routeTripBtn.disabled = true; // prevent request spamming
        showSkeletonCards();
        routeIndex = 0;
        console.log("--- Routing Request ---");
        console.log("From:", startPlaceId);
        console.log("To:", destinationPlaceId);
        console.log("Timing:", timingMode, selectedDate);
        routeData = await getRoutes(startPlaceId,destinationPlaceId,timingMode,selectedDate);
        routeData = parseRouteData(routeData);

        // Handle the "No Routes Found" state
        if (routeData.length === 0) {
            outputEl.innerHTML = `<p class="error-msg">No transit routes found for this trip. Try a different time or location.</p>`;
            return;
        }

        updateRouteIndex(); // Calls calculate fare

        
        routeTripBtn.disabled = false;
    }
}

routeTripBtn.addEventListener("click",tryToRoute);

const showSkeletonCards = () => {
    outputEl.innerHTML = `
        <div class="skeleton-card">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line body"></div>
            <div class="skeleton-line body short"></div>
            <div class="skeleton-line divider"></div>
            <div class="skeleton-line fare"></div>
            <div class="skeleton-line discount"></div>
        </div>
    `;
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
};


const timeToMinutes = (timeStr) => {
    // split time and modifier
    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    // normalize 12-hour clock
    if (hours === 12) {
        hours = 0;
    }
    
    if (modifier.toLowerCase().includes("p")) {
        hours += 12; // Add 12 hours for PM times
    }

    // return minutes
    return (hours * 60) + minutes;
};

const minutesPassed = (startTimeStr, endTimeStr) => {
    const startMins = timeToMinutes(startTimeStr);
    const endMins = timeToMinutes(endTimeStr);

    let diff = endMins - startMins;

    // add 24 hrs if time diff negative
    if (diff < 0) {
        diff += 1440; 
    }

    return diff;
};

const hasGoTransit = steps => steps.some(step => step.provider === "GO Transit");

function calculateFare()   {

    const steps = routeData[routeIndex];

    let transferWindow = 120;
    let transferWindowBegin = steps[0].boardTime;
    let activeLocalFare = 0;


    for(let i = 0; i < steps.length; i++)    {
        const step = steps[i];
        let passedTime = minutesPassed(transferWindowBegin, step.boardTime);
        let isValidTransfer = passedTime < transferWindow;
        const isGoTransit = step.provider === "GO Transit";

        // If the transfer expired, reset the clock and limits for this new step
        if (!isValidTransfer) {
            transferWindowBegin = step.boardTime;
            transferWindow = isGoTransit ? 180 : 120;
            activeLocalFare = 0; 
        }

        if (isGoTransit) {
            // Case 1: GO Transit step
            step.cost = 0; 
            step.requiresUserInput = true;
            
            // If valid transfer, apply the local fare we paid earlier as a discount
            step.discountAmount = isValidTransfer ? activeLocalFare : 0;
            step.discountText = step.discountAmount > 0 
                ? `One Fare (Local Transit Fare Discount)` 
                : "Enter full GO fare";
            
            // GO Transit expands the window to 3 hours (180 mins) for any subsequent steps
            if (!isValidTransfer || i === 0) {
                transferWindow = 180;
            }

        } else {
            if (i === 0 || !isValidTransfer) {
                // Case 2: First step (no GO) OR an expired transfer window -> Pay flat fare
                step.cost = fares[step.provider][ageGroup]; 
                step.requiresUserInput = false;
                step.discountAmount = 0;
                step.discountText = "";
                
                // Store this fare in case they transfer to GO later (deduct)
                activeLocalFare = step.cost; 

            } else {
                // Case 3: Valid transfer to a local agency -> Free
                step.cost = 0;
                step.requiresUserInput = false;
                step.discountAmount = fares[step.provider][ageGroup];
                step.discountText = "OneFare (Free Transfer)";
            }
        }
    }
    renderstepCards(steps);
}

const renderstepCards = (steps) => {
    outputEl.innerHTML = ""; // Clear any previous results
    
    const cardsHTML = steps.map((step, index) => {
        let fareUI = "";
        
        // If it's a GO Transit step, render an input field
        if (step.requiresUserInput) {
            fareUI = `
                <div class="fare-input-group">
                    <label>Enter GO Fare: $</label>
                    <input type="number" step="0.01" min="0" class="go-cost-input" data-index="${index}" placeholder="0.00">
                    <br>
                    <span class="step-final-cost" id="step-cost-${index}">$0.00</span>
                    <a target="_blank" href="https://www.gotransit.com/en/plan-your-trip">Calculate Here</a>
                </div>
            `;
        } else {
            // Otherwise, just show the flat fare
            fareUI = `<div class="step-final-cost">Cost: $${step.cost.toFixed(2)}</div>`;
        }

        let discountUI = step.discountText ? `<div class="discount-text">Save $${step.discountAmount.toFixed(2)} from ${step.discountText}</div>` : "";

        return `
            <div style="border-left-color: ${step.color};" class="step-card" data-provider="${step.provider}">
                <h3 style="color: ${step.color};">${step.provider} - ${getModeIconHTML(step.mode)} ${step.route}</h3>
                <p><b>Board:</b> ${step.boardTime} @ ${step.boardStop}</p>
                <p><b>Alight:</b> ${step.alightTime} @ ${step.alightStop || "Destination"}</p>
                <div class="fare-section">
                    ${fareUI}
                    ${discountUI}
                </div>
            </div>
        `;
    }).join("");

    // Add the Grand Total at the bottom
    const totalHTML = `
        <div class="grand-total-card">
            <h3>Total Trip Fare: <span id="grand-total">$0.00</span></h2>
            <h3>Total One Fare Savings: <span id="total-savings">$0.00</span></h2>
        </div>
    `;

    // Inject it all into the DOM
    outputEl.innerHTML = cardsHTML + totalHTML;

    // Attach the event listeners and run the initial total calculation
    attachGoInputListeners(steps);
    updateGrandTotal(steps);
};

const attachGoInputListeners = (steps) => {
    const inputs = document.querySelectorAll(".go-cost-input");
    
    inputs.forEach(input => {
        input.addEventListener("input", (e) => {
            const stepIndex = e.target.getAttribute("data-index");
            const step = steps[stepIndex];
            
            // Get the value typed, fallback to 0 if they delete everything
            const inputtedFare = parseFloat(e.target.value) || 0;
            
            // Subtract the OneFare discount, ensuring it never drops below $0
            step.cost = Math.max(0, inputtedFare - step.discountAmount);
            
            // Update the display for this specific step so the user sees the math working
            const stepCostDisplay = document.getElementById(`step-cost-${stepIndex}`);
            if (stepCostDisplay) {
                stepCostDisplay.innerText = `Cost: $${step.cost.toFixed(2)}`;
            }
            
            // Recalculate the grand total
            updateGrandTotal(steps);
        });
    });
};

const updateGrandTotal = (steps) => {
    const total = steps.reduce((sum, step) => sum + (step.cost || 0), 0);
    const totalEl = document.getElementById("grand-total");
    const totalSavings = steps.reduce((sum, step) => sum + (step.discountAmount || 0), 0);
    const savingsEl = document.getElementById("total-savings");

    if (totalEl) {
        totalEl.innerText = `$${total.toFixed(2)}`;
        savingsEl.innerText = `$${totalSavings.toFixed(2)}`;
    }
};


const modeIcons = {
    bus: 'assets/icons/bus.svg',
    subway: 'assets/icons/subway.svg',
    streetcar: 'assets/icons/streetcar.svg',
    train: 'assets/icons/train.svg'
};

const getModeIconHTML = mode => {
    const key = mode ? mode.toLowerCase() : '';
    const iconSrc = modeIcons[key] || 'assets/icons/bus.svg'; // Fallback icon
    return `<img src="${iconSrc}" alt="${mode}" class="mode-icon" />`;
};
