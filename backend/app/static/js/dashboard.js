const loadingIndicator = document.getElementById("loading-indicator");
const boroughSelect = document.getElementById("borough-select");
const stationSelect = document.getElementById("station-select");
const reportContainer = document.getElementById("report-container");

const stationsWithCoordinates = {
  manhattan: {
    "Times Square - 42nd St": [40.755290, -73.987495],
    "Grand Central - 42nd St": [40.752726, -73.977229],
    "125th St": [40.804138, -73.937594],
    "Columbus Circle - 59th St": [40.768247, -73.981929],gi
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

async function updateDashboard() {
  loadingIndicator.style.display = "block";
  try {
    const data = await fetchData(`${API_BASE}?minutes=30`);
    reportContainer.innerHTML = "";
    if (data.length > 0) {
      const groupedData = groupReportsByBoroughAndStation(data);
      boroughSelect.innerHTML = `<option value="">Select a Borough</option>`;
      Object.keys(groupedData).forEach((borough) => {
        const option = document.createElement("option");
        option.value = borough;
        option.textContent = capitalizeFirstLetter(borough);
        boroughSelect.appendChild(option);
      });
      boroughSelect.addEventListener("change", (e) => {
        const borough = e.target.value;
        if (borough) {
          populateStationsDropdown(groupedData[borough]);
        }
      });
      stationSelect.addEventListener("change", (e) => {
        const station = e.target.value;
        if (station) {
          displayReports(groupedData[boroughSelect.value][station]);
        }
      });
    } else {
      reportContainer.innerHTML = "<p>No reports available in the past 30 minutes.</p>";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    reportContainer.innerHTML = `<p style="color: red;">Failed to load data.</p>`;
  } finally {
    loadingIndicator.style.display = "none";
  }
}

function groupReportsByBoroughAndStation(data) {
  const grouped = {};
  data.forEach((report) => {
    const { borough, station } = getBoroughAndStation(report.station);
    if (!grouped[borough]) grouped[borough] = {};
    if (!grouped[borough][station]) grouped[borough][station] = [];
    grouped[borough][station].push(report);
  });
  return grouped;
}

function getBoroughAndStation(station) {
  for (const borough in stationsWithCoordinates) {
    if (stationsWithCoordinates[borough][station]) {
      return { borough, station };
    }
  }
  return { borough: "unknown", station };
}

function populateStationsDropdown(stations) {
  stationSelect.innerHTML = `<option value="">Select a Station</option>`;
  Object.keys(stations).forEach((station) => {
    const option = document.createElement("option");
    option.value = station;
    option.textContent = station;
    stationSelect.appendChild(option);
  });
}

function displayReports(reports) {
  reportContainer.innerHTML = "";
  reports.forEach((report) => {
    const reportItem = document.createElement("div");
    reportItem.innerHTML = `
      <p><strong>Station:</strong> ${report.station}</p>
      <p><strong>Crowd Level:</strong> ${report.crowd_level}</p>
      <p><small>Reported at: ${new Date(report.time).toLocaleTimeString()}</small></p>
      <hr />
    `;
    reportContainer.appendChild(reportItem);
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

updateDashboard();
setInterval(updateDashboard, 30000);
