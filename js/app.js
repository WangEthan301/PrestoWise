import { fares } from "./fares.js";

const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const outputSection = document.getElementById("output-section");
const ageGroupEl = document.getElementById("age-group");
const instructionsEl = document.querySelector(".summary");
const instructionVideo = document.getElementById("instruction-video");
const detailsEl = document.querySelector("details");


detailsEl.addEventListener('toggle', (event) => {
    if (detailsEl.open) {
        detailsEl.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
});

let ageGroup = ageGroupEl.value;
ageGroupEl.addEventListener("change", () => {
    ageGroup = ageGroupEl.value;
    calculateFare(parseInput(userInput));
});

let userInput = inputEl.value;
inputEl.addEventListener("input", () => {
    userInput = inputEl.value;
    calculateFare(parseInput(userInput));

});

instructionsEl.addEventListener("click",() => instructionVideo.currentTime = 0);


const parseInput = rawText => {

    const cleanText = rawText.replaceAll("\u202f", ' ').replaceAll(RegExp("\r?\n",'g'), '\n');

    const regexMetadata = /\(\d+\sstops\)|\(non-stop\)/i;
    const globalRegexMetadata = /\(\d+\sstops\)|\(non-stop\)/ig;
    let segments = cleanText.split('\n\n').map(l => l.trim()).filter(l => regexMetadata.test(l));

    let legs = [];

    //multiple bus rides in one segment (same alight stop as board stop)
    const multiLegSegment = /((?:0?[1-9]|1[0-2]):[0-5][0-9] (?:AM|PM))\s(.+?)\s((?:0?[1-9]|1[0-2]):[0-5][0-9] (?:AM|PM))\s*(bus|subway|streetcar|train)\s*(.+)[\s\S]*?Service run by (.+)/i;
    const singleLegSegment = /((?:0?[1-9]|1[0-2]):[0-5][0-9] (?:AM|PM))\s(.+?)\s(bus|subway|streetcar|train)\s*(.+)[\s\S]*?Service run by (.+)[\s\S]*?((?:0?[1-9]|1[0-2]):[0-5][0-9] (?:AM|PM))\s*(.+)/i;

    for(let i = 0; i < segments.length; i++)    {
        let rides = segments[i].match(globalRegexMetadata).length;
        if(rides>1) {
            let lastIndex = 0;
            for(let j = 0; j < rides-1;j++) {
                let [full, boardTime,boardStop,alightTime,mode,route,provider] = segments[i].match(multiLegSegment);
                legs.push({boardTime:boardTime,boardStop:boardStop,alightTime:alightTime,mode:mode,route:route,provider:provider});
                lastIndex = segments[i].indexOf("Service run by")+1;
                segments[i] = segments[i].slice(lastIndex);
                if(j>0) {
                    legs[j-1].alightStop = boardStop;
                    //set board stop as previous alight stop
                }
            }
            let [full, boardTime,boardStop,mode, route,provider,alightTime,alightStop] = segments[i].match(singleLegSegment);
            legs.push({boardTime:boardTime,boardStop:boardStop,alightTime:alightTime,mode:mode,route:route,provider:provider,alightStop:alightStop});
            legs[rides-2].alightStop = boardStop;

        }
        else    {
            let [full, boardTime,boardStop,mode, route,provider,alightTime,alightStop] = segments[i].match(singleLegSegment);
            legs.push({boardTime:boardTime,boardStop:boardStop,alightTime:alightTime,mode:mode,route:route,provider:provider,alightStop:alightStop});
        }
    }

    // console.log(legs);
    return legs;
}

const timeToMinutes = (timeStr) => {
    // split time and modifier
    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    // mormalize 12-hour clock
    if (hours === 12) {
        hours = 0;
    }
    
    if (modifier.toUpperCase() === 'PM') {
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

const hasGoTransit = legs => legs.some(leg => leg.provider === "GO Transit");

const calculateFare = parsedInput =>    {

    const legs = [...parsedInput];

    let transferWindow = 120;
    let transferWindowBegin = legs[0].boardTime;
    let activeLocalFare = 0;


    for(let i = 0; i < legs.length; i++)    {
        const leg = legs[i];
        let passedTime = minutesPassed(transferWindowBegin, leg.boardTime);
        let isValidTransfer = passedTime < transferWindow;
        const isGoTransit = leg.provider === "GO Transit";

        // If the transfer expired, reset the clock and limits for this new leg
        if (!isValidTransfer) {
            transferWindowBegin = leg.boardTime;
            transferWindow = isGoTransit ? 180 : 120;
            activeLocalFare = 0; 
        }

        if (isGoTransit) {
            // Case 1: GO Transit Leg
            leg.cost = 0; 
            leg.requiresUserInput = true;
            
            // If valid transfer, apply the local fare we paid earlier as a discount
            leg.discountAmount = isValidTransfer ? activeLocalFare : 0;
            leg.discountText = leg.discountAmount > 0 
                ? `One Fare (Local Transit Fare Discount)` 
                : "Enter full GO fare";
            
            // GO Transit expands the window to 3 hours (180 mins) for any subsequent legs
            if (!isValidTransfer || i === 0) {
                transferWindow = 180;
            }

        } else {
            if (i === 0 || !isValidTransfer) {
                // Case 2: First leg (no GO) OR an expired transfer window -> Pay flat fare
                leg.cost = fares[leg.provider][ageGroup]; 
                leg.requiresUserInput = false;
                leg.discountAmount = 0;
                leg.discountText = "";
                
                // Store this fare in case they transfer to GO later (deduct)
                activeLocalFare = leg.cost; 

            } else {
                // Case 3: Valid transfer to a local agency -> Free
                leg.cost = 0;
                leg.requiresUserInput = false;
                leg.discountAmount = fares[leg.provider][ageGroup];
                leg.discountText = "OneFare (Free Transfer)";
            }
        }
    }
    renderLegCards(legs);

    outputSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

const renderLegCards = (legs) => {
    outputEl.innerHTML = ""; // Clear any previous results
    
    const cardsHTML = legs.map((leg, index) => {
        let fareUI = "";
        
        // If it's a GO Transit leg, render an input field
        if (leg.requiresUserInput) {
            fareUI = `
                <div class="fare-input-group">
                    <label>Enter GO Fare: $</label>
                    <input type="number" step="0.01" min="0" class="go-cost-input" data-index="${index}" placeholder="0.00">
                    <br>
                    <span class="leg-final-cost" id="leg-cost-${index}">$0.00</span>
                    <a target="_blank" href="https://www.gotransit.com/en/plan-your-trip">Calculate Here</a>
                </div>
            `;
        } else {
            // Otherwise, just show the flat fare
            fareUI = `<div class="leg-final-cost">Cost: $${leg.cost.toFixed(2)}</div>`;
        }

        let discountUI = leg.discountText ? `<div class="discount-text">Save $${leg.discountAmount.toFixed(2)} from ${leg.discountText}</div>` : "";

        return `
            <div class="leg-card" data-provider="${leg.provider}">
                <h3>${leg.provider} - ${getModeIconHTML(leg.mode)} ${leg.route}</h3>
                <p><b>Board:</b> ${leg.boardTime} @ ${leg.boardStop}</p>
                <p><b>Alight:</b> ${leg.alightTime} @ ${leg.alightStop || "Destination"}</p>
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
    attachGoInputListeners(legs);
    updateGrandTotal(legs);
};

const attachGoInputListeners = (legs) => {
    const inputs = document.querySelectorAll(".go-cost-input");
    
    inputs.forEach(input => {
        input.addEventListener("input", (e) => {
            const legIndex = e.target.getAttribute("data-index");
            const leg = legs[legIndex];
            
            // Get the value typed, fallback to 0 if they delete everything
            const inputtedFare = parseFloat(e.target.value) || 0;
            
            // Subtract the OneFare discount, ensuring it never drops below $0
            leg.cost = Math.max(0, inputtedFare - leg.discountAmount);
            
            // Update the display for this specific leg so the user sees the math working
            const legCostDisplay = document.getElementById(`leg-cost-${legIndex}`);
            if (legCostDisplay) {
                legCostDisplay.innerText = `Cost: $${leg.cost.toFixed(2)}`;
            }
            
            // Recalculate the grand total
            updateGrandTotal(legs);
        });
    });
};

const updateGrandTotal = (legs) => {
    const total = legs.reduce((sum, leg) => sum + (leg.cost || 0), 0);
    const totalEl = document.getElementById("grand-total");
    const totalSavings = legs.reduce((sum, leg) => sum + (leg.discountAmount || 0), 0);
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
