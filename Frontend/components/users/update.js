"use strict";

document.addEventListener("DOMContentLoaded", fetchData);
const URL = "http://localhost:3000/get-id";
const INFO_URL = "http://localhost:3000/info";

function fetchData() {
  const endpoint = URL;

  fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((idData) => {
      const userId = idData.UPDATE_USER_ID;
      console.log(userId);

      // Fetch all user data from INFO_URL
      fetch(INFO_URL, {
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((allUserData) => {
          // Find the user with the matching ID
          const matchingUser = allUserData.find(user => user.user_id === userId);
            checkUploaded(matchingUser);

        })
        .catch((error) => console.error("Error fetching all user data:", error));
    })
    .catch((error) => console.error("Error fetching ID:", error));
}

function checkUploaded(userData) {
    console.log(userData), "in funtion approval";
  const viewBtn = document.querySelector(".viewBtn");

  // Check if the uploaded property is set to false for the retrieved user
//   console.log(userData.uploaded, ' uploading sttaus')
  if (userData.uploaded === false) {
      viewBtn.style.display = "none";
    // console.log(userData,' value of uploaded')
    // If condition is met, hide the button
  }else{
    // viewBtn.style.display = "block";
    const user = document.getElementById('user-photo');
    const img = document.createElement('img');
    img.src = `/Backend/uploadedImages/${userData.dispImage}.jpeg`;
    
    user.appendChild(img);
    img.classList.add('approvalImage');
    const approvalStatus = document.getElementById('approval-status');
    const status = document.createElement('p');

    const name_of_user = document.getElementById('name-user');
    name_of_user.innerHTML = userData.name;
    if(userData.approval === true){
       
        status.innerHTML = 'Accepted By Admin';
       
    }else{
        status.innerHTML = ' Not Accepted By Admin';
    }
     status.classList.add('status');
    approvalStatus.appendChild(status);
  }
}
