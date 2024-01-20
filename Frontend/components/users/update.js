"use strict";

document.addEventListener("DOMContentLoaded", fetchData);

const URL = "http://localhost:3000/get-id";
const INFO_URL = "http://localhost:3000/info";

function fetchData() {
  try {
    const endpoint = URL;

    fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching ID: ${response.status}`);
        }
        return response.json();
      })
      .then((idData) => {
        const userId = idData.UPDATE_USER_ID;
        console.log(userId);

        // Fetch all user data from INFO_URL
        fetch(INFO_URL, {
          headers: {
            Accept: "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error fetching all user data: ${response.status}`);
            }
            return response.json();
          })
          .then((allUserData) => {
            // Find the user with the matching ID
            const matchingUser = allUserData.find((user) => user.user_id === userId);
            checkUploaded(matchingUser);
          })
          .catch((error) => console.error("Error fetching all user data:", error));
      })
      .catch((error) => console.error("Error fetching ID:", error));
  } catch (error) {
    console.error("Error in fetchData:", error);
  }
}

function checkUploaded(userData) {
  try {
    console.log(userData, "in function approval");
    const viewBtn = document.querySelector(".viewBtn");

    // Check if the uploaded property is set to false for the retrieved user
    if (userData.uploaded === false) {
      viewBtn.style.display = "none";
    } else {
      const user = document.getElementById('user-photo');
      const img = document.createElement('img');
      img.src = `/Backend/uploadedImages/${userData.dispImage}.jpeg`;

      user.appendChild(img);
      img.classList.add('approvalImage');
      const approvalStatus = document.getElementById('approval-status');
      const status = document.createElement('p');

      const nameOfUser = document.getElementById('name-user');
      nameOfUser.innerHTML = userData.name;
      
      if (userData.approval === true) {
        status.innerHTML = 'Accepted By Admin';
      } else {
        status.innerHTML = 'Not Accepted By Admin';
      }
      status.classList.add('status');
      approvalStatus.appendChild(status);
    }
  } catch (error) {
    console.error("Error in checkUploaded:", error);
  }
}
