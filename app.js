
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

  const licence = document.getElementById("licenceUpload").files.length;
  const cpc = document.getElementById("cpcUpload").files.length;
  const digi = document.getElementById("digiUpload").files.length;

  if (!licence || !cpc || !digi) {
    message.textContent = "Please upload all required documents.";
    return;
  }

  message.textContent = `Check-in complete. Welcome, ${name}.`;
});
    