import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
  getFirestore,
  doc,
  runTransaction,
  serverTimestamp
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


  // Create unique ID for DATE + TIME
  const slotId =
    date.replace(/-/g, "") + "_" +
    time.replace(/[^a-zA-Z0-9]/g, "");


  const bookingRef = doc(db, "bookings", slotId);


  try {

    await runTransaction(db, async (transaction) => {

      const bookingDoc = await transaction.get(bookingRef);


      // Slot already booked
      if (bookingDoc.exists()) {
        throw new Error("SLOT_ALREADY_BOOKED");
      }


      // Save new booking
      transaction.set(bookingRef, {

        customerName: name,
        service: service,
        date: date,
        time: time,
        status: "booked",
        createdAt: serverTimestamp()

      });

    });


    // Booking successful
    alert("Appointment booked successfully!");


    // WhatsApp
    const barberNumber = "918446348928";

    const message =
      `Hello Gent's Craft Barber!\n\n` +
      `I would like to book an appointment.\n\n` +
      `Name: ${name}\n` +
      `Service: ${service}\n` +
      `Date: ${date}\n` +
      `Time: ${time}\n\n` +
      `Please confirm my appointment.`;


    const whatsappURL =
      `https://wa.me/${barberNumber}?text=${encodeURIComponent(message)}`;


    window.open(whatsappURL, "_blank");

    bookingForm.reset();


  } catch (error) {

    console.error("Booking error:", error);


    if (error.message === "SLOT_ALREADY_BOOKED") {

      alert(
        "Sorry! This time slot is already booked. Please select another time."
      );

    } else {

      alert(
        "Booking failed. Please try again.\n\n" +
        error.message
      );

    }

  }

});
