
document.getElementById("checkinForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const name = document.getElementById("driverName").value.trim();
  const fitToDrive = document.getElementById("fitToDrive").checked;
  const message = document.getElementById("message");

  if (!name) {
    message.textContent = "Please enter your name.";
    return;
  }
  if (!fitToDrive) {
    message.textContent = "Please confirm you are fit to drive.";
    return;
  }

  message.textContent = `Check-in complete. Welcome, ${name}.`;
});
    