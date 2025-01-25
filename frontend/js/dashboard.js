import { fetchData, API_BASE } from "./app.js";

(async () => {
  const crowdList = document.getElementById("crowd-data");

  try {

    crowdList.innerHTML = "<p>Loading data...</p>";

    const data = await fetchData(`${API_BASE}?minutes=30`);
    console.log("Fetched data:", data); 

    crowdList.innerHTML = "";

    if (data.length > 0) {
      data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.station}: ${item.crowd_level} (Reported at ${new Date(
          item.time
        ).toLocaleTimeString()})`;
        crowdList.appendChild(listItem);
      });
    } else {
      crowdList.innerHTML = "<p>No reports in the past 30 minutes.</p>";
    }
  } catch (error) {
    console.error("Error fetching crowd data:", error);

    crowdList.innerHTML = `<p style="color: red;">Failed to load crowd data.</p>`;
  }
})();