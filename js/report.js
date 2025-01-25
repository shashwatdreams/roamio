document.getElementById("crowd-report-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const station = document.getElementById("station").value;
    const crowdLevel = document.getElementById("crowd-level").value;
  
    try {
      await postData(`${API_BASE}/report_crowd`, { station, crowd_level: crowdLevel });
      alert("Report submitted successfully!");
      document.getElementById("crowd-report-form").reset();
    } catch (error) {
      alert("Failed to submit report.");
      console.error(error);
    }
  });