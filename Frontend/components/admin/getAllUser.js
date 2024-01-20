"use-strict";

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
      renderAllUserData(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderAllUserData(data) {
  console.log("Rendering data for all:", data);
  const container = document.getElementById("data-container");

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((item) => {
      const div = document.createElement("div");
      const imgDiv = document.createElement("div");
      const imgDiv1 = document.createElement("div");
      const imgDiv2 = document.createElement("div");
      div.setAttribute("key", item._id);

      const user_id = document.createElement("p");
      const name = document.createElement("p");
      const dispImage = document.createElement("img");
      const btnDiv = document.createElement("div");
      user_id.textContent = `${item.user_id}`;

      name.textContent = `${item.name}`;
      dispImage.src = `../../../Backend/uploadedImages/${item.dispImage}.jpeg`;

      if (item.dispImage[0] !== "u") {
        dispImage.src = `../../../Backend/uploadedImages/userDummy.png`;
      }

      imgDiv1.appendChild(user_id)
      div.appendChild(imgDiv1);
      imgDiv2.appendChild(name)
      div.appendChild(imgDiv2);
      imgDiv.appendChild(dispImage)
      div.appendChild(imgDiv);



      if (item.approval === false  && item.uploaded === true) {
        const form = document.createElement("form");
        form.action = `http://localhost:3000/approved/${item.user_id}`;
        form.method = "post";

        const btndone = document.createElement("button");
        btndone.classList.add("btndone");
        btndone.innerText = "Done";

        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "user_id";
        hiddenInput.value = item.user_id;

        form.appendChild(hiddenInput);
        form.appendChild(btndone);

        btnDiv.appendChild(form);
      }

      const deleteForm = document.createElement("form");
      deleteForm.action = `http://localhost:3000/delete/${item.user_id}`;
      deleteForm.method = "post";

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("deleteBtn");
      deleteBtn.innerText = "delete";

      deleteForm.appendChild(deleteBtn);
      btnDiv.appendChild(deleteForm);
      btnDiv.classList.add("two-buttons");

      div.appendChild(btnDiv);
      container.appendChild(div);
      div.classList.add("allData");
    });
  } else {
    container.innerHTML = "<p>No data available</p>";
  }
}
