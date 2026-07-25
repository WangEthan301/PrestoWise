import { fares } from "./fares.js";

const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const ageGroupEl = document.getElementById("age-group");
const instructionsEl = document.querySelector(".summary");
const instructionVideo = document.getElementById("instruction-video");

let ageGroup = ageGroupEl.value;
ageGroupEl.addEventListener("change", () => {
    ageGroup = ageGroupEl.value;
});

let input = inputEl.value;
inputEl.addEventListener("input", () => {
    input = inputEl.value;
});

instructionsEl.addEventListener("click",() => instructionVideo.currentTime = 0);


const parseInput = rawText => {


}


const test = `11:29 AM
The Woodlands School - Secondary
3225 Erindale Station Rd, Mississauga, ON L5C 1Y5
WalkWalk
About 4 min, 250 m

11:33 AM
Mcbride Ave At Erindale Station Rd
Bus66 E Credit Woodlands To City Centre
30 min (34 stops) on time · Stop ID: 1118 ·
11:34 AM
Mcbride Ave At Carillion Ave
12:02 PM
City Centre Transit Terminal Drop Off
Service run by MiWay
Ticket information
12:03 PM
City Centre Transit Terminal Platform H
WalkWalk
About 3 min

12:10 PM
Square One, Mississauga
Bus25K - U of Waterloo
1 hr 55 min (11 stops) · Stop ID: 100133 ·
12:18 PM
Erin Mills Station
12:21 PM
Winston Churchill
12:36 PM
Steeles Ave. @ Trafalgar Rd. (Toronto Premium Outlets)
12:48 PM
Regional Rd. 25 @ Hwy. 401 Park & Ride
1:05 PM
Brock Rd. @ McLean Rd. (Aberfoyle) Park & Ride
1:21 PM
Cambridge Smart Centre
1:22 PM
Hespeler Rd. @ Pinebush Rd.
1:31 PM
Sportsworld Dr. @ Hwy. 8 Park & Ride
1:52 PM
University Ave. E. @ Weber St. N.
1:55 PM
Wilfrid Laurier University
Service run by GO Transit
Ticket information
2:05 PM
University of Waterloo Terminal
WalkWalk
About 4 min, 350 m

2:09 PM
Engineering 7 (E7)
200 University Ave W, Waterloo, ON N2L 3G5
`
const test2 = `
1:21 PM
Kipling Bus Terminal
Etobicoke, ON M9B 6H8
WalkWalk
About 3 min, 160 m

1:24 PM
Dundas St At Poplar Ave
1:26 PM
Bus112CWest Mall to Disco Rd via Renforth Station
2 min (4 stops) · Stop ID: 5022 ·
1:24 PM
Dundas St West at Wilmar Rd
1:25 PM
Dundas St At Shaver Ave
1:26 PM
Dundas St West at Paulart Dr
Service run by TTC
Ticket information
1:32 PM
Dundas St West at East Mall Cres
Bus109109 N Express Meadowvale Exp
53 min (16 stops) · Stop ID: 0815 ·
1:41 PM
Renforth Station West Platform 1
1:43 PM
Orbitor Station West Platform B
1:45 PM
Spectrum Station West Platform B
1:46 PM
Etobicoke Creek Station West Platform B
1:48 PM
Tahoe Station West Platform B
1:51 PM
Dixie station
1:53 PM
Tomken Station East Platform A
1:53 PM
Cawthra Station East Platform A
1:55 PM
Central Parkway Station West Platform B
1:58 PM
City Centre Transit Terminal Platform O
2:10 PM
Erin Mills Station West Platform 4
2:13 PM
Winston Churchill Station West Platform 4
2:17 PM
Winston Churchill Blvd At Eglinton Ave
2:19 PM
Winston Churchill Blvd At Erin Centre Blvd
2:22 PM
Winston Churchill Blvd At Thomas St
Service run by MiWay
Ticket information
2:25 PM
Winston Churchill Blvd At Britannia Rd
WalkWalk
About 10 min, 750 m

2:35 PM
2866 Termini Terrace
Mississauga, ON L5M 5S3
`
