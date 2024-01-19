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
      const dispImage = document.createElement("img");
      const btnDiv = document.createElement("div");
      const btn = document.createElement('button');
      btn.classList.add('deleteBtn')
      btn.innerText = 'delete' 
      const btndone = document.createElement('button');
      btndone.classList.add('btndone')
      btndone.innerText = 'Done'
      user_id.textContent = `${item.user_id}`;
      
      name.textContent = `${item.name}`
      dispImage.src = `../../../Backend/uploadedImages/${item.dispImage}.jpeg`;
      // user is updated the value the it will start with 'u'
      if(item.dispImage[0] !== 'u'){
        dispImage.src = `../../../Backend/uploadedImages/userDummy.png`;
      }

      div.appendChild(user_id);
      div.appendChild(name)
      div.appendChild(dispImage);
      btnDiv.appendChild(btn)
      btnDiv.appendChild(btndone)

      div.appendChild(btnDiv);

      container.appendChild(div);
      div.classList.add("allData");
    });
  } else {
    container.innerHTML = "<p>No data available</p>";
  }
}