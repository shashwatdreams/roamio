import { postData, API_BASE } from "./app.js";

const stationsWithCoordinates = {
  manhattan: [
    "Times Square - 42nd St",
    "Grand Central - 42nd St",
    "125th St",
    "Columbus Circle - 59th St",
  ],
  queens: [
    "Flushing - Main St",
    "Jackson Heights - Roosevelt Ave",
    "Astoria - Ditmars Blvd",
  ],
  brooklyn: [
    "Atlantic Ave - Barclays Center",
    "Coney Island - Stillwell Ave",
    "Bedford Ave",
  ],
  bronx: [
    "Yankee Stadium - 161st St",
    "Fordham Rd",
    "Pelham Bay Park",
  ],
  staten_island: [
    "St. George",
    "Great Kills",
    "Tottenville",
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const boroughSelect = document.getElementById("borough");
  const stationSelect = document.getElementById("station");

  boroughSelect.addEventListener("change", () => {
    const selectedBorough = boroughSelect.value;

    // Clear the station dropdown
    stationSelect.innerHTML = `<option value="">Choose Station</option>`;

    if (selectedBorough && stationsWithCoordinates[selectedBorough]) {
      // Populate the station dropdown
      stationsWithCoordinates[selectedBorough].forEach((station) => {
        const option = document.createElement("option");
        option.value = station;
        option.textContent = station;
        stationSelect.appendChild(option);
      });
    }
  });
});
