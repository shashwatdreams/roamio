// Define API base URL
window.API_BASE = "http://localhost:5001/api/crowd";

// Define a global fetchData function
window.fetchData = async function (url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return await response.json();
};

// Define a global postData function
window.postData = async function (url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit data");
  return await response.json();
};
