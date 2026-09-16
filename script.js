import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnCngQWr6n5yewJf_RumAcySXeBwxXr3g",
  authDomain: "nexora-barber-demo.firebaseapp.com",
  projectId: "nexora-barber-demo",
  storageBucket: "nexora-barber-demo.firebasestorage.app",
  messagingSenderId: "560046964997",
  appId: "1:560046964997:web:6fa575c63b1aa6e669376c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!name || !service || !date || !time) {
    alert("Please fill all booking details.");
    return;
  }

  try {
    await addDoc(collection(db, "bookings"), {
      customerName: name,
      service: service,
      date: date,
      time: time,
      status: "booked",
      createdAt: serverTimestamp()
    });

    const barberNumber = "918446348928";

    const message =
      `Hello Gent's Craft Barber!%0A%0A` +
      `I would like to book an appointment.%0A%0A` +
      `Name: ${encodeURIComponent(name)}%0A` +
      `Service: ${encodeURIComponent(service)}%0A` +
      `Date: ${encodeURIComponent(date)}%0A` +
      `Time: ${encodeURIComponent(time)}%0A%0A` +
      `Please confirm my appointment.`;

    const whatsappURL =
      `https://wa.me/${barberNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");

    bookingForm.reset();

  } catch (error) {
    console.error("Booking error:", error);
    alert("Booking could not be saved. Please try again.");
  }
});
