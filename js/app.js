import { fares } from "./fares.js";

const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const ageGroupEl = document.getElementById("age-group");

let ageGroup = ageGroupEl.value;
ageGroupEl.addEventListener("change", () => {
    ageGroup = ageGroupEl.value;
});

let input = inputEl.value;
inputEl.addEventListener("input", () => {
    input = inputEl.value;
})
