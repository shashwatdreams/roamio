export async function postData(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit data");
  }

  return await response.json();
}
export const API_BASE = "http://localhost:5001/api/crowd";