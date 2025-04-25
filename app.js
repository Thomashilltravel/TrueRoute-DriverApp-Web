
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
  const output = document.getElementById("featureSection");
  menu.innerHTML = "";
  output.innerHTML = "";

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
      if (feature === "walkaround") {
        loadDVSAForm();
      } else {
        output.innerHTML = `<strong>[${featureTemplates[feature]}]</strong> loaded in <strong>${session.mode.toUpperCase()}</strong> mode.`;
      }
    };
    menu.appendChild(btn);
  });
}

function loadDVSAForm() {
  document.getElementById("featureSection").innerHTML = `
    <h2>DVSA Walkaround Check</h2>
    <label>Vehicle Registration:</label>
    <input type="text" id="vehicleReg" placeholder="e.g. AB12 CDE">
    <label>Odometer Reading (miles):</label>
    <input type="number" id="odometer" placeholder="e.g. 102345">
    <h3>Checklist:</h3>
    <label><input type="checkbox" class="dvsa-item"> Tyres</label>
    <label><input type="checkbox" class="dvsa-item"> Lights</label>
    <label><input type="checkbox" class="dvsa-item"> Indicators</label>
    <label><input type="checkbox" class="dvsa-item"> Mirrors</label>
    <label><input type="checkbox" class="dvsa-item"> Horn</label>
    <label><input type="checkbox" class="dvsa-item"> Brakes</label>
    <label><input type="checkbox" class="dvsa-item"> Fuel / Oil / Coolant Levels</label>
    <label><input type="checkbox" id="fitToDrive"> I confirm I am fit to drive</label>
    <label>Driver Signature:</label>
    <input type="text" id="driverSignature" placeholder="Type your name as signature">
    <button onclick="submitDVSA()">Submit DVSA Check</button>
  `;
}

function submitDVSA() {
  const vehicleReg = document.getElementById("vehicleReg").value.trim();
  const odometer = document.getElementById("odometer").value.trim();
  const signature = document.getElementById("driverSignature").value.trim();
  const fitToDrive = document.getElementById("fitToDrive").checked;
  const items = document.querySelectorAll(".dvsa-item");
  const checked = Array.from(items).filter(i => i.checked);

  if (!vehicleReg || !odometer || !signature || !fitToDrive || checked.length < items.length) {
    alert("Please complete all checks, fields, and confirm you are fit to drive.");
    return;
  }

  document.getElementById("featureSection").innerHTML = `
    ✅ DVSA Check submitted successfully at ${new Date().toLocaleString()} for vehicle <strong>${vehicleReg}</strong> with <strong>${odometer} miles</strong>.
  `;
}
    