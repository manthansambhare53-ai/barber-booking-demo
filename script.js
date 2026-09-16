const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!name || !service || !date || !time) {
    alert("Please fill all booking details.");
    return;
  }

  // Demo barber WhatsApp number
  // Replace this with the real barber's number when selling the website.
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
});
