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

    const providers = "GO Transit|Miway|TTC|York Region Transit|Oakville Transit|Burlington Transit|Hamilton Street Railway|Brampton Transit|Durham Region Transit)"
    const cleanText = rawText.replaceAll("\u202f", ' ').replaceAll(RegExp("\r?\n",'g'), '\n');

    const regexMetadata = /\(\d+\sstops\)/i;
    const globalRegexMetadata = /\(\d+\sstops\)/ig;
    let segments = cleanText.split('\n\n').map(l => l.trim()).filter(l => regexMetadata.test(l));

    let legs = [];

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
                }
            }
            console.log(`last index: ${segments[i]}`);
            let [full, boardTime,boardStop,mode, route,provider,alightTime,alightStop] = segments[i].match(singleLegSegment);
            legs.push({boardTime:boardTime,boardStop:boardStop,alightTime:alightTime,mode:mode,route:route,provider:provider,alightStop:alightStop});
            legs[rides-2].alightStop = boardStop;

        }
        else    {
            console.log("single");
            let [full, boardTime,boardStop,mode, route,provider,alightTime,alightStop] = segments[i].match(singleLegSegment);
            legs.push({boardTime:boardTime,boardStop:boardStop,alightTime:alightTime,mode:mode,route:route,provider:provider,alightStop:alightStop});
        }
    }

    console.log(legs);
    return legs;
}


const test1 = `
9:53 AM
Kipling Bus Terminal
Etobicoke, ON M9B 6H8
WalkWalk
About 2 min, 160 m

9:55 AM
Dundas St At Poplar Ave
9:57 AM
Bus111East Mall Eglinton
2 min (4 stops) · Stop ID: 5022 ·
9:56 AM
Dundas St West at Wilmar Rd
9:57 AM
Dundas St At Shaver Ave
9:57 AM
Dundas St West at Paulart Dr
Service run by TTC
Ticket information
10:03 AM
Dundas St West at East Mall Cres
Bus109109 N Express Meadowvale Exp
46 min (16 stops) · Stop ID: 0815 ·
10:12 AM
Renforth Station West Platform 1
10:13 AM
Orbitor Station West Platform B
10:15 AM
Spectrum Station West Platform B
10:16 AM
Etobicoke Creek Station West Platform B
10:18 AM
Tahoe Station West Platform B
10:20 AM
Dixie station
10:21 AM
Tomken Station East Platform A
10:22 AM
Cawthra Station East Platform A
10:24 AM
Central Parkway Station West Platform B
10:26 AM
City Centre Transit Terminal Platform O
10:37 AM
Erin Mills Station West Platform 4
10:39 AM
Winston Churchill Station West Platform 4
10:42 AM
Winston Churchill Blvd At Eglinton Ave
10:44 AM
Winston Churchill Blvd At Erin Centre Blvd
10:46 AM
Winston Churchill Blvd At Thomas St
Service run by MiWay
Ticket information
10:49 AM
Winston Churchill Blvd At Britannia Rd
WalkWalk
About 10 min, 750 m

10:59 AM
2866 Termini Terrace
Mississauga, ON L5M 5S3
`


const test2 = `
1:42 PM
The Woodlands School - Secondary
3225 Erindale Station Rd, Mississauga, ON L5C 1Y5
WalkWalk
About 3 min, 250 m

1:49 PM
1:45 PM
Mcbride Ave At Erindale Station Rd
Bus66 E Credit Woodlands To City Centre
33 min (34 stops) 4 min early · Stop ID: 1118 ·
1:46 PM
Mcbride Ave At Carillion Ave
1:46 PM
Mcbride Ave At Ellengale Dr
1:47 PM
Mcbride Ave At The Credit Woodlands
1:48 PM
The Credit Woodlands At Erinmore Dr
1:48 PM
The Credit Woodlands At Queenston Dr
1:49 PM
Queenston Dr At Fellmore Dr
1:50 PM
Queenston Dr At Ashcroft Cres
1:50 PM
Queenston Dr At Chalice Cres
1:51 PM
Queenston Dr At Freeport Dr
1:51 PM
Queenston Dr At The Credit Woodlands
1:52 PM
Burnhamthorpe Rd At The Credit Woodlands
1:53 PM
Burnhamthorpe Rd At Erindale Go Station
1:54 PM
Burnhamthorpe Rd At Central Pky
1:55 PM
Burnhamthorpe Rd At Erindale Station Rd
1:57 PM
Erindale Station Rd South Of Burnhamthorpe Rd
1:57 PM
Central Pky At Erindale Station Rd
1:58 PM
Central Pky At Semenyk Crt
1:59 PM
Central Pky At Hawkestone Rd
2:00 PM
Central Pky At Wolfedale Rd
2:02 PM
Central Pky At Mavis Rd
2:04 PM
Grand Park Dr At Central Pky
2:05 PM
Grand Park Dr South Of Webb Dr
2:06 PM
Webb Dr At Redmond Rd
2:07 PM
Webb Dr At Confederation Pky
2:09 PM
Webb Dr At Duke Of York Blvd
2:10 PM
Burnhamthorpe Rd At Living Arts Dr
2:11 PM
Living Arts Dr At City Centre Dr
2:12 PM
Living Arts Dr At Princess Royal Dr
2:12 PM
Living Arts Dr At Prince Of Wales Dr
2:13 PM
Living Arts Dr At Square One Dr
2:14 PM
Living Arts Dr At Rathburn Rd
2:14 PM
Rathburn Rd At Duke Of York Blvd
2:16 PM
City Centre Transit Terminal Drop Off
Service run by MiWay
Ticket information
2:18 PM
City Centre Transit Terminal Platform H
WalkWalk
About 3 min

2:55 PM
Square One, Mississauga
Bus25C - U of Waterloo
1 hr 15 min (3 stops) on time · Stop ID: 100133 ·
3:57 PM
University Ave. E. @ Weber St. N.
4:00 PM
Wilfrid Laurier University
Service run by GO Transit
Ticket information
4:10 PM
University of Waterloo Terminal
WalkWalk
About 4 min, 350 m

4:14 PM
Engineering 7 (E7)
200 University Ave W, Waterloo, ON N2L 3G5
`

parseInput(test1);
// parseInput(test2);
