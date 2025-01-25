import { postData, API_BASE } from "./app.js";

document.getElementById("crowd-report-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const station = document.getElementById("station").value.trim();
  const crowdLevel = parseInt(document.getElementById("crowd-level").value.trim(), 10);

  try {
    await postData(`${API_BASE}/report_crowd`, { station, crowd_level: crowdLevel });
    alert("Report submitted successfully!");
    document.getElementById("crowd-report-form").reset();
  } catch (error) {
    console.error("Error submitting report:", error);
    alert("Failed to submit report.");
  }
});