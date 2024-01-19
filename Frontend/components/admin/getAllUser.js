"use-strict"

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
        
      const user_id = document.createElement("p");
      const name = document.createElement("p");
      const nameid = document.createElement("p");
      const dispImage = document.createElement("img");
      const btn = document.createElement('button');
      btn.innerText = 'delete'
      user_id.textContent = `User ID: ${item.user_id}`;
      
      name.textContent = `Name : ${item.name}`
      dispImage.src = `../../../Backend/uploadedImages/${item.dispImage}.jpeg`;
      // user is updated the value the it will start with 'u'
      if(item.dispImage[0] !== 'u'){
        dispImage.src = `../../../Backend/uploadedImages/userDummy.png`;
      }

      div.appendChild(user_id);
      div.appendChild(name)
      div.appendChild(dispImage);
      div.appendChild(nameid);
      div.appendChild(btn);

      container.appendChild(div);
      div.style.border = "1px solid #000"; 
      div.style.padding = '1rem',
      div.style.margin = '1rem 0',
      div.style.display = 'flex',
      div.style.justifyContent = 'space-between'
      div.classList.add("special-user");
    });
  } else {
    container.innerHTML = "<p>No data available</p>";
  }
}