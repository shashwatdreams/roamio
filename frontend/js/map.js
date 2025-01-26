import { stationsWithCoordinates } from "./report.js";

const map = L.map("map").setView([40.7128, -74.0060], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

let currentMarkers = [];

function addMarkersForStation(station) {
  clearMarkers();

  Object.keys(stationsWithCoordinates).forEach((borough) => {
    const stations = stationsWithCoordinates[borough];
    Object.keys(stations).forEach((stationName) => {
      if (station && stationName !== station) return;

      const coords = stations[stationName];
      const marker = L.marker(coords).addTo(map);
      currentMarkers.push(marker);

      marker.bindPopup(`
        <strong>${stationName}</strong><br>
        <button onclick="viewReports('${stationName}')">View Reports</button>
        <button onclick="submitReport('${stationName}')">Submit Report</button>
      `);
    });
  });
}

function clearMarkers() {
  currentMarkers.forEach((marker) => map.removeLayer(marker));
  currentMarkers = [];
}

window.viewReports = (station) => {
  window.location.href = `dashboard.html?station=${encodeURIComponent(station)}`;
};

window.submitReport = (station) => {
  window.location.href = `report.html?station=${encodeURIComponent(station)}`;
};

addMarkersForStation(null);