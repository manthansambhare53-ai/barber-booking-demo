import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
  getFirestore,
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBnCngQWr6n5yewJf_RumAcySXeBwxXr3g",
  authDomain: "nexora-barber-demo.firebaseapp.com",
  projectId: "nexora-barber-demo",
  storageBucket: "nexora-barber-demo.firebasestorage.app",
  messagingSenderId: "560046964997",
  appId: "1:560046964997:web:6fa575c63b1aa6e669376c",
  measurementId: "G-VNH7NX3253"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const selectedDateTitle = document.getElementById("selectedDate");
const bookingList = document.getElementById("bookingList");

const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");


let currentDate = new Date();
let selectedDate = null;
let bookings = [];


// Load bookings from Firestore
onSnapshot(collection(db, "bookings"), (snapshot) => {

  bookings = [];

  snapshot.forEach((doc) => {

    bookings.push({
      id: doc.id,
      ...doc.data()
    });

  });

  renderCalendar();

  if (selectedDate) {
    showBookings(selectedDate);
  }

}, (error) => {

  console.error("Firestore error:", error);

  bookingList.innerHTML =
    `<div class="empty">Unable to load bookings.</div>`;

});


// Calendar
function renderCalendar() {

  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("en-IN", {
    month: "long"
  });

  monthYear.textContent = `${monthName} ${year}`;


  // Day names
  const dayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];


  dayNames.forEach((day) => {

    const element = document.createElement("div");

    element.className = "day-name";
    element.textContent = day;

    calendar.appendChild(element);

  });


  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(year, month + 1, 0).getDate();


  // Empty spaces before first day
  for (let i = 0; i < firstDay; i++) {

    const empty = document.createElement("div");

    calendar.appendChild(empty);

  }


  // Days
  for (let day = 1; day <= daysInMonth; day++) {

    const cell = document.createElement("div");

    cell.className = "day";


    const number = document.createElement("div");

    number.className = "day-number";
    number.textContent = day;

    cell.appendChild(number);


    const dateString =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    // Today
    const today = new Date();

    const todayString =
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


    if (dateString === todayString) {
      cell.classList.add("today");
    }


    // Selected day
    if (dateString === selectedDate) {
      cell.classList.add("selected");
    }


    // Check bookings
    const dayBookings =
      bookings.filter((booking) => booking.date === dateString);


    if (dayBookings.length > 0) {

      cell.classList.add("has-booking");

      const dot = document.createElement("span");

      dot.className = "booking-dot";

      cell.appendChild(dot);

    }


    cell.addEventListener("click", () => {

      selectedDate = dateString;

      renderCalendar();

      showBookings(dateString);

    });


    calendar.appendChild(cell);

  }

}


// Show bookings for selected date
function showBookings(date) {

  const dateObject = new Date(date + "T00:00:00");

  const formattedDate =
    dateObject.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });


  selectedDateTitle.textContent =
    formattedDate;


  const dayBookings =
    bookings
      .filter((booking) => booking.date === date)
      .sort((a, b) => {

        return convertTime(a.time) -
               convertTime(b.time);

      });


  if (dayBookings.length === 0) {

    bookingList.innerHTML =
      `<div class="empty">No appointments for this day.</div>`;

    return;

  }


  bookingList.innerHTML = "";


  dayBookings.forEach((booking) => {

    const card = document.createElement("div");

    card.className = "booking-card";


    card.innerHTML = `
      <div class="booking-time">
        ${escapeHTML(booking.time || "")}
      </div>

      <div class="booking-name">
        ${escapeHTML(booking.customerName || "Customer")}
      </div>

      <div class="booking-service">
        ${escapeHTML(booking.service || "")}
      </div>

      <span class="status">
        ${escapeHTML(booking.status || "booked")}
      </span>
    `;


    bookingList.appendChild(card);

  });

}


// Convert 4:00 PM → minutes
function convertTime(time) {

  if (!time) return 0;

  const parts = time.trim().split(" ");

  const hm = parts[0].split(":");

  let hour = parseInt(hm[0]);
  const minute = parseInt(hm[1]);

  const period = parts[1]?.toUpperCase();


  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }


  return hour * 60 + minute;

}


// Prevent HTML from being inserted into the page
function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// Previous month
prevMonthButton.addEventListener("click", () => {

  currentDate.setMonth(currentDate.getMonth() - 1);

  renderCalendar();

});


// Next month
nextMonthButton.addEventListener("click", () => {

  currentDate.setMonth(currentDate.getMonth() + 1);

  renderCalendar();

});


// Show today's date initially
const today = new Date();

selectedDate =
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


renderCalendar();

showBookings(selectedDate);
