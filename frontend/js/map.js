import { stationsWithCoordinates } from "./report.js";

console.log("Starting map script...");

try {
  const map = L.map("map").setView([40.7128, -74.0060], 11); 
  console.log("Map initialized:", map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);
  console.log("Tile layer added successfully");

  console.log("Station data loaded in map.js:", stationsWithCoordinates);

  Object.keys(stationsWithCoordinates).forEach((borough) => {
    const stations = stationsWithCoordinates[borough];
    Object.keys(stations).forEach((stationName) => {
      const coords = stations[stationName];
      if (!coords) {
        console.error(`No coordinates for station: ${stationName}`);
        return;
      }

      const marker = L.marker(coords).addTo(map);
      console.log(`Marker added for station: ${stationName} at ${coords}`);

      marker.bindPopup(`
        <strong>${stationName}</strong><br>
        <button onclick="viewReports('${stationName}')">View Reports</button>
        <button onclick="submitReport('${stationName}')">Submit Report</button>
      `);
    });
  });

  console.log("All markers added successfully.");
} catch (error) {
  console.error("Error initializing the map:", error);
}

window.viewReports = (station) => {
  window.location.href = `dashboard.html?station=${encodeURIComponent(station)}`;
};

window.submitReport = (station) => {
  window.location.href = `report.html?station=${encodeURIComponent(station)}`;
};