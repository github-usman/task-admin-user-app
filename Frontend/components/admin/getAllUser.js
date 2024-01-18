document.addEventListener("DOMContentLoaded", fetchData);
const URL = "http://localhost:3000/info";

function fetchData() {
  const endpoint = URL;

  fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      renderAllUserData(data); // Use the appropriate function name
    })
    .catch((error) => console.error("Error fetching data:", error));
}



function renderAllUserData(data) {
    console.log("Rendering data for all:", data);
  const container = document.getElementById("data-container");

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((item) => {
      const div = document.createElement("div");
      div.setAttribute("key", item._id);

      const paragraph = document.createElement("p");
      paragraph.textContent = `User ID: ${item.user_id}`;
      div.classList.add("special-user");
      div.appendChild(paragraph);
      container.appendChild(div);
    });
  } else {
    container.innerHTML = "<p>No data available</p>";
  }
}