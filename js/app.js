const API_BASE = "http://localhost:5001/api/crowd";

// Helper to fetch data
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
}

// Helper to post data
async function postData(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit data");
  return response.json();
}