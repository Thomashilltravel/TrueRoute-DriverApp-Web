
const featureTemplates = {
  walkaround: "DVSA Walkaround Check",
  payslips: "Payslip Viewer",
  messages: "Messaging Portal",
  satnav: "SatNav (Vehicle-Aware)",
  passengerCode: "Passenger Code Generator",
  parcelCode: "Parcel Code Generator",
  podUpload: "Proof of Delivery Upload",
  compliance: "Compliance Failsafe Center"
};

let session = {
  name: '',
  email: '',
  licence: '',
  mode: '',
  uploadsComplete: false
};

function submitLogin() {
  const name = document.getElementById("driverName").value.trim();
  const email = document.getElementById("driverEmail").value.trim();
  const licence = document.getElementById("driverLicence").value.trim();
  const mode = document.getElementById("modeSelect").value;

  if (!name || !email || !licence) {
    alert("Please complete all fields.");
    return;
  }

  session = { name, email, licence, mode, uploadsComplete: false };
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("uploadScreen").style.display = "block";
}

function submitUploads() {
  const requiredFields = [
    "licenceFront", "licenceBack",
    "cpcFront", "cpcBack",
    "digiFront", "digiBack",
    "selfieUpload"
  ];

  for (const fieldId of requiredFields) {
    if (document.getElementById(fieldId).files.length === 0) {
      alert("Please upload all required files including front and back of each card.");
      return;
    }
  }

  session.uploadsComplete = true;
  document.getElementById("uploadScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  updateMenu();
}

function updateMenu() {
  const menu = document.getElementById("menu");
  const output = document.getElementById("output");
  menu.innerHTML = "";

  const always = ["walkaround", "payslips", "messages", "satnav", "compliance"];
  const psvOnly = ["passengerCode"];
  const hgvOnly = ["parcelCode", "podUpload"];
  const dualOnly = ["passengerCode", "parcelCode", "podUpload"];

  let features = [...always];
  if (session.mode === "psv") features.push(...psvOnly);
  if (session.mode === "hgv") features.push(...hgvOnly);
  if (session.mode === "dual") features.push(...dualOnly);

  features.forEach(feature => {
    const btn = document.createElement("button");
    btn.innerText = featureTemplates[feature];
    btn.onclick = () => {
      output.innerHTML = `<strong>[${featureTemplates[feature]}]</strong> loaded in <strong>${session.mode.toUpperCase()}</strong> mode.`;
    };
    menu.appendChild(btn);
  });
}
    