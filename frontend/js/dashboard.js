import { fetchData, API_BASE } from "./app.js";

const crowdList = document.getElementById("crowd-data");
const loadingIndicator = document.getElementById("loading-indicator");

async function updateDashboard() {
  loadingIndicator.style.display = "block"; 

  try {
    const data = await fetchData(`${API_BASE}?minutes=30`);

    crowdList.innerHTML = "";

    if (data.length > 0) {
      data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong>${item.station}</strong>
          <p>Crowd Level: ${item.crowd_level}</p>
          <small>Reported at: ${new Date(item.time).toLocaleTimeString()}</small>
        `;
        crowdList.appendChild(listItem);
      });
    } else {
      crowdList.innerHTML = "<p>No reports in the past 30 minutes.</p>";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    crowdList.innerHTML = `<p style="color: red;">Failed to load data.</p>`;
  } finally {
    loadingIndicator.style.display = "none"; 
  }
}

updateDashboard();

setInterval(updateDashboard, 30000);