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
      renderDataTwo(data); // Use the appropriate function name
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderDataTwo(data) {
    console.log("Rendering data for two:", data);
  const container = document.getElementById("cardOfUser");

  if (Array.isArray(data) && data.length > 0) {
    let cnt = 0;

    data.forEach((item) => {
      
      if (cnt++ < 2) {
        const div = document.createElement("div");
        div.setAttribute("key", item._id);

        const paragraph = document.createElement("p");
        const badge = document.createElement("p");
        paragraph.textContent = item.user_id;
        badge.textContent = cnt;
        div.classList.add("outerView");
        paragraph.classList.add("innerView");
        badge.classList.add("badge");
        div.appendChild(badge);
        div.appendChild(paragraph);
        container.appendChild(div);
      } else {
        // processed the first two elements, exit the loop
        return;
      }
    });
  } else {
    container.innerHTML = "<p>No data available</p>";
  }
}


