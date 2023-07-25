const appSettings = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  firebase.initializeApp(appSettings);
  
  const database = firebase.database();
  const parkingRef = database.ref("parking");
  
  // Retrieve input elements
  const nameInput = document.getElementById("name-input");
  const emailInput = document.getElementById("email-input");
  const dateInput = document.getElementById("date-input");
  const parkingSpaceInput = document.getElementById("parking-space-input");
  const durationInput = document.getElementById("duration-input");
  const submitButton = document.getElementById("submit-button");
  const parkingList = document.getElementById("parking-list");
  
  // Add event listener to submit button
  submitButton.addEventListener("click", function() {
    // Get values from input elements
    const name = nameInput.value;
    const email = emailInput.value;
    const date = dateInput.value;
    const parkingSpace = parkingSpaceInput.value;
    const duration = durationInput.value;
  
    // Generate a unique key for the parking reservation
    const newParkingKey = parkingRef.push().key;
  
    // Create a new parking reservation object with the user input values
    const newParkingReservation = {
      name: name,
      email: email,
      date: date,
      parkingSpace: parkingSpace,
      duration: duration
    };
  
    // Push the new parking reservation to the Firebase server
    parkingRef.child(newParkingKey).set(newParkingReservation);
  
    // Clear input values
    nameInput.value = "";
    emailInput.value = "";
    dateInput.value = "";
    parkingSpaceInput.value = "";
    durationInput.value = "";
  });
  
  // Listen for changes in the parking reservations
  parkingRef.onValue(function(snapshot) {
    // Clear the parking list
    parkingList.innerHTML = "";
  
    // Check if there are any parking reservations
    if (snapshot.exists()) {
      const childSnapshotArray = snapshot.val();
      const childKeys = Object.keys(childSnapshotArray);
  
      for (let i = 0; i < childKeys.length; i++) {
        const childSnapshotKey = childKeys[i];
        const parkingReservation = childSnapshotArray[childSnapshotKey];
  
        // Create a new list item for each parking reservation
        const listItem = document.createElement("li");
        listItem.textContent = `
          Name: ${parkingReservation.name}
          Email: ${parkingReservation.email}
          Date: ${parkingReservation.date}
          Parking Space: ${parkingReservation.parkingSpace}
          Duration: ${parkingReservation.duration}
        `;
  
        parkingList.appendChild(listItem);
      }
    }
  });
  