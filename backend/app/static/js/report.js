window.API_BASE = "http://roamio-nyc-824eaa7752e7.herokuapp.com/api/crowd";

async function postData(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit data");
  return await response.json();
}

const boroughSelect = document.getElementById("borough");
const stationSelect = document.getElementById("station");
const crowdReportForm = document.getElementById("crowd-report-form");

const stationsWithCoordinates = {
  manhattan: {
    "Times Square - 42nd St": [40.755290, -73.987495],
    "Grand Central - 42nd St": [40.752726, -73.977229],
    "125th St": [40.804138, -73.937594],
    "Columbus Circle - 59th St": [40.768247, -73.981929],
  },
  queens: {
    "Flushing - Main St": [40.759599, -73.830314],
    "Jackson Heights - Roosevelt Ave": [40.746644, -73.891338],
    "Astoria - Ditmars Blvd": [40.775036, -73.912034],
  },
  brooklyn: {
    "Atlantic Ave - Barclays Center": [40.683595, -73.978689],
    "Coney Island - Stillwell Ave": [40.577281, -73.981410],
    "Bedford Ave": [40.717930, -73.956589],
  },
  bronx: {
    "Yankee Stadium - 161st St": [40.827994, -73.925104],
    "Fordham Rd": [40.862028, -73.897669],
    "Pelham Bay Park": [40.852462, -73.827798],
  },
  staten_island: {
    "St. George": [40.643748, -74.073440],
    "Great Kills": [40.551842, -74.151535],
    "Tottenville": [40.512765, -74.251118],
  },
};

boroughSelect.addEventListener("change", () => {
  const borough = boroughSelect.value;
  stationSelect.innerHTML = `<option value="">Choose Station</option>`;
  if (stationsWithCoordinates[borough]) {
    Object.keys(stationsWithCoordinates[borough]).forEach((station) => {
      const option = document.createElement("option");
      option.value = station;
      option.textContent = station;
      stationSelect.appendChild(option);
    });
  }
});

crowdReportForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const borough = boroughSelect.value;
  const station = stationSelect.value;
  const crowdLevel = parseInt(document.getElementById("crowd-level").value, 10);

  if (!borough || !station) {
    alert("Please select a borough and station.");
    return;
  }

  if (isNaN(crowdLevel) || crowdLevel < 1 || crowdLevel > 5) {
    alert("Please enter a valid crowd level between 1 and 5.");
    return;
  }

  const submitButton = e.target.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    await postData(`${API_BASE}/report_crowd`, { station, crowd_level: crowdLevel });
    alert("Report submitted successfully!");
    crowdReportForm.reset();
  } catch (error) {
    console.error("Error submitting report:", error);
    alert("Failed to submit report. Please try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
});
