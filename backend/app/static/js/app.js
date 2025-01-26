window.API_BASE = "http://roamio-nyc-824eaa7752e7.herokuapp.com/api/crowd";

window.fetchData = async function (url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return await response.json();
};

window.postData = async function (url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit data");
  return await response.json();
};
