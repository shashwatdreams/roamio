export const API_BASE = "http://localhost:5001/api/crowd/";

export async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return await response.json();
}

export async function postData(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
ç
  if (!response.ok) throw new Error("Failed to submit data");
  return await response.json();
}