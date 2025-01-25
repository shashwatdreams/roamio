(async () => {
    const crowdList = document.getElementById("crowd-data");
  
    try {
      const data = await fetchData(API_BASE);
      data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.station}: ${item.crowd_level}`;
        crowdList.appendChild(listItem);
      });
    } catch (error) {
      crowdList.innerHTML = `<p style="color: red;">Failed to load data</p>`;
      console.error(error);
    }
  })();