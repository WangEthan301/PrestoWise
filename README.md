# PrestoWise 💳

> **Calculate multi-agency transit fares and Presto One Fare savings instantly.**

PrestoWise is an open-source web application designed for commuters who use multiple GTHA transit agencies with PRESTO. By parsing trip details copied directly from Google Maps, PrestoWise calculates exact cross-agency transit fares, accounts for Presto's **One Fare Program** discounts, and displays your total fare, savings, and leg-by-leg cost breakdown.

<img width="1920" height="1000" alt="image" src="https://github.com/user-attachments/assets/8871b35a-7a01-4885-b9d0-505171862df5" />

---

## 🌐 Demo

Try PrestoWise here:

https://wangethan301.github.io/PrestoWise/

Video Demo: https://youtu.be/1ohvGHeRx08?si=1fJTpW3ti3KlLQ0f

---

## 🎯 The Problem It Solves

* **Google Maps shows multi-agency routes, but not cross-agency fares:** Navigation apps give great step-by-step directions across the GTHA, but leave riders guessing when calculating total ticket and transfer costs across different transit systems.
* **One Fare rules are complex to calculate across agencies:** Commuters struggle to track discount windows, local fare deductions, and transfer limits when jumping between different networks (such as TTC, GO Transit, YRT, or MiWay).

**PrestoWise** bridges this gap by allowing riders to paste their raw multi-agency Google Maps route itinerary to instantly calculate the total cross-agency trip cost alongside the exact dollar amount saved through Ontario's One Fare Program.

---

## ✨ Features

<img width="1920" height="1000" alt="image" src="https://github.com/user-attachments/assets/c7aa7429-07d3-465a-bba0-c731b72037e4" />

* **Instant Trip Parsing:** Paste the transit itinerary copied directly from Google Maps into the site to immediately view transit legs, board/alight times, and agencies.
* **One Fare Integration:** Automatically calculates transfer windows (2-hour local transfer, 3-hour GO Transit window) and applies local fare discounts.
* **GO Transit Fare Calculation:** Supports customizable GO fare inputs and dynamically adjusts grand totals. Since GO Transit fares depend on distance and zones, users enter their GO fare while PrestoWise applies eligible One Fare discounts automatically.
* **Age Group Selection:** Calculates exact pricing for Adults, Seniors (>65), Youth (13–19), and Children (<12).
* **Auto Scrolling:** Smooth UI transitions that automatically focus on cost breakdowns as soon as trip details are processed.

---

## 🚌 Supported Transit Agencies

* **TTC** (Toronto Transit Commission)
* **MiWay** (Mississauga Transit)
* **GO Transit**
* **Brampton Transit**
* **YRT** (York Region Transit)
* **Oakville Transit**
* **Durham Region Transit**
* **Burlington Transit**
* **HSR** (Hamilton Street Railway)

---

## 🗺️ How It Works

1. **Plan a Trip:** Map your multi-agency route on Google Maps
2. **Copy Details:** Expand the transit itinerary details and copy the raw text.
3. **Paste & Calculate:** Paste the details into PrestoWise to immediately review your leg-by-leg fare breakdown and total One Fare savings.
---

## 🛠️ Built With

* **HTML** — Structure and content
* **CSS** — Styling and responsive layout
* **JavaScript** — Trip parsing, fare calculations, and One Fare logic
* **GitHub Pages** — Hosting and deployment

---

## 📄 License

PrestoWise is licensed under the [MIT License](LICENSE).
