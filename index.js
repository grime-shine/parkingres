import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://parkingres-c638a-default-rtdb.firebaseio.com/"
};

// Firebase initializing
const app = initializeApp(appSettings);
const database = getDatabase(app);
const parkingRef = ref(database, "parkingRes");


// Sections
const topSectionEl = document.getElementById("top-section");
const modelSection = document.getElementById("model")
const container = document.getElementById("container")
const menuBar = document.getElementById("menu-bar")
const reserveBox = document.getElementsByClassName("reserve-box")
// User input Inputs
const spaceNumberInput = document.getElementById("spacenumber-input");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const dateInput = document.getElementById("date-input");
const startTimeInput = document.getElementById("starttime-input");
const endTimeInput = document.getElementById("endtime-input");

// Buttons
const submitBtn = document.getElementById("submit-btn");
const deleteBtn = document.getElementById("delete-btn");
const yesBtn = document.getElementById("yes-btn")
const noBtn = document.getElementById("no-btn")
const nightBtn = document.getElementById("night-mode")
// modelActive
let modelActive = false
//night mode Active
let nightModeActive = false
//images
let nightImg = "nightmode.png"
let dayImg = "daymode.png"
const nightDayToggle = document.getElementById("nightday-img")

// Event listener for the submit button
submitBtn.addEventListener("click", submitForm);

//Event listener for the Delete all button
deleteBtn.addEventListener("click", function(){

  if(!modelActive){
    modelActive = true
    modelSection.classList.remove("hidden")
  }
})

//Event listener for Model buttons
yesBtn.addEventListener("click", function(){

  if (modelActive){
    modelActive = false
    remove(parkingRef)
    modelSection.classList.toggle("hidden")
  }
})
noBtn.addEventListener("click", function(){

  if (modelActive){
    modelActive = false
    modelSection.classList.toggle("hidden")
  }
})

//Event listener for dark mode toggle

nightBtn.addEventListener("click", function() {
  nightModeActive = !nightModeActive;
  container.classList.toggle("night-1")
  menuBar.classList.toggle("night-3");
  //reserve box night mode toggle
  document.querySelectorAll('.reserve-box').forEach(element => {
    element.classList.toggle('night-2');

        // Check the current image source and change it to the other one
        if (nightDayToggle.src.endsWith(nightImg)) {
          nightDayToggle.src = dayImg;
      } else {
          nightDayToggle.src = nightImg;
      }
  });
});


// Submit button  event handler
function submitForm() {
  const spaceNumber = spaceNumberInput.value;
  const name = nameInput.value;
  const email = emailInput.value;
  const date = dateInput.value;
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  const newParkingReservation = {
    spacenumber: spaceNumber,
    name: name,
    email: email,
    date: date,
    starttime: startTime,
    endtime: endTime
  };

  const newParkingKey = push(parkingRef);
  set(newParkingKey, newParkingReservation);
  console.log(`New Parking Key Generated: ${newParkingKey}`);

  clearInputFields();
}

// Clear input fields
function clearInputFields() {
  spaceNumberInput.value = "";
  nameInput.value = "";
  emailInput.value = "";
  dateInput.value = "";
  startTimeInput.value = "";
  endTimeInput.value = "";
}

// Listen for changes in the parking reservations
onValue(parkingRef, handleParkingData);

// Handle parking data snapshot
function handleParkingData(snapshot) {
  if (snapshot.exists()) {
    const parkingData = snapshot.val();
    const parkingArray = Object.entries(parkingData);

    clearTopSectionHTML();
    appendParkingReservations(parkingArray);
  } else {
    topSectionEl.innerHTML = "";
  }
}

// Append parking reservations HTML
function appendParkingReservations(parkingArray) {
  for (let i = 0; i < parkingArray.length; i++) {
    const currentParking = parkingArray[i];
    const currentParkingID = currentParking[0];
    const currentParkingValue = currentParking[1];

    const parkingHTMLString = `
      <div class="reserve-box" id="reserve-box-${currentParkingID}">
      <button class="btn-remove" data-parking-id="${currentParkingID}">X</button>
        <h1>${currentParkingValue.spacenumber}</h1>
        <h3 >Name:</h3><h4>${currentParkingValue.name}<h4>
        <h3>Email:</h3><h4> ${currentParkingValue.email}</h4>
        <h3>Date:</h3><h4> ${currentParkingValue.date}</h4>
        <h3>Start time:</h3><h4> ${currentParkingValue.starttime}</h4>
        <h3>End time:</h3><h4> ${currentParkingValue.endtime}</h4>
      </div>
    `;

    topSectionEl.innerHTML += parkingHTMLString;
  }

  // Add event listeners to remove buttons
  const removeButtons = document.getElementsByClassName("btn-remove");
  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", removeParkingReservation);
  }
}

// Remove parking reservation
function removeParkingReservation(event) {
  const parkingID = event.target.getAttribute("data-parking-id");
  const reservationDiv = document.getElementById(`reserve-box-${parkingID}`);
  reservationDiv.remove();
  const reservationRef = ref(database, `parkingRes/${parkingID}`);
  remove(reservationRef);
}


// Clear top section HTML
function clearTopSectionHTML() {
  topSectionEl.innerHTML = "";
}
