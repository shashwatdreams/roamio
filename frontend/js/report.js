import { postData, API_BASE } from "./app.js";

const stationsByBorough = {
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
  bronx: ["Yankee Stadium - 161st St", "Fordham Rd", "Pelham Bay Park"],
  staten_island: ["St. George", "Great Kills", "Tottenville"],
};

document.getElementById("borough").addEventListener("change", (e) => {
  const borough = e.target.value;
  const stationSelect = document.getElementById("station");

  stationSelect.innerHTML = `<option value="">Select a station</option>`;
  if (stationsByBorough[borough]) {
    stationsByBorough[borough].forEach((station) => {
      const option = document.createElement("option");
      option.value = station;
      option.textContent = station;
      stationSelect.appendChild(option);
    });
  }
});

document.getElementById("crowd-report-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const borough = document.getElementById("borough").value;
  const station = document.getElementById("station").value;
  const crowdLevel = parseInt(document.getElementById("crowd-level").value, 10);

  if (!borough || !station) {
    alert("Please select a borough and a station.");
    return;
  }

  if (isNaN(crowdLevel) || crowdLevel < 1 || crowdLevel > 5) {
    alert("Please enter a valid crowd level between 1 and 5.");
    return;
  }

  const submitButton = document.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    await postData(`${API_BASE}/report_crowd`, { station, crowd_level: crowdLevel });
    alert("Report submitted successfully!");
    document.getElementById("crowd-report-form").reset();
  } catch (error) {
    console.error("Error submitting report:", error);
    alert("Failed to submit report. Please try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
});