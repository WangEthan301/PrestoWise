# PrestoWise 💳

> **Calculate multi-agency transit fares and Presto One Fare savings instantly.**

PrestoWise is an open-source web application designed for commuters who use multiple GTHA transit agencies with PRESTO. By parsing transit details requested from Google Maps Routes API, PrestoWise calculates exact cross-agency transit fares, accounts for Presto's **One Fare Program** discounts, and displays your total fare, savings, and step-by-step cost breakdown.

<img width="1920" height="1000" alt="image" src="https://github.com/user-attachments/assets/2edec3e3-630f-40ee-94ba-bb2c49864cb7" />

---

## 🌐 Demo

Try PrestoWise here: https://prestowise.vercel.app/

---

## 🎯 The Problem It Solves

* **Google Maps shows multi-agency routes, but not cross-agency fares:** Navigation apps give great step-by-step directions across the GTHA, but leave riders guessing when calculating total ticket and transfer costs across different transit systems.
* **One Fare rules are complex to calculate across agencies:** Commuters struggle to track discount windows, local fare deductions, and transfer limits when jumping between different networks (such as TTC, GO Transit, YRT, or MiWay).

**PrestoWise** bridges this gap by allowing riders to find multiple Google Maps itineraries to calculate the total cross-agency trip costs of top routes alongside the exact dollar amount saved through Ontario's One Fare Program.

---

## ✨ Features

<img width="1920" height="1000" alt="image" src="https://github.com/user-attachments/assets/f574a9b8-552b-4bc7-882e-dcb439f4955d" />

* **One Fare Integration:** Automatically calculates transfer windows (2-hour local transfer, 3-hour GO Transit window) and applies local fare discounts.
* **GO Transit Fare Calculation:** Supports customizable GO fare inputs and dynamically adjusts grand totals. Since GO Transit fares depend on distance and zones, users enter their GO fare while PrestoWise applies eligible One Fare discounts automatically.
* **Age Group Selection:** Calculates exact pricing for Adults, Seniors (>65), Youth (13–19), and Children (<12).## 🎨 UI/UX Highlights
* **Skeleton Loading:** Custom animations keep the interface engaging while waiting for asynchronous API responses
* **Auto-scrolling:** Smoothly snaps to the cost breakdown the moment routes are requested
* **Dynamic State Management:** Route pagination buttons automatically disable when reaching the ends of the fetched route array to prevent user error

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

1. **Plan a Trip:** Enter your multi-agency trip details directly into the web app.
2. **Route Trip:** Click "Route Trip" to request best transit routes from Google Maps. 
3. **Navigate Between Routes:** Click on the arrows to instantly navigate between routes and their step-by-step fare breakdown and total One Fare savings.
---

## 🛠️ Built With

* **HTML & CSS** — Structure, styling, and responsive layout
* **JavaScript** — Routing, Trip parsing, Fare calculations, and One Fare logic
* **Google Maps APIs** — Uses the **Places API** for location autocomplete and **Routes API** for finding transit routes
* **Vercel** — Hosting and deployment

---

## 📄 License

PrestoWise is licensed under the [MIT License](LICENSE).
