
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
    <div class="dvsa-checklist">
      ${[
        "Tyres", "Lights", "Indicators", "Mirrors", "Horn", "Brakes",
        "Oil Level", "Fuel Level", "Emergency Exits", "Bodywork", "First Aid Kit", "Fire Extinguishers"
      ].map((item, i) => `
        <label>${item}</label>
        <div class="check-options">
          <label><input type="radio" name="item${i}" value="pass"> Pass</label>
          <label><input type="radio" name="item${i}" value="na"> N/A</label>
          <label><input type="radio" name="item${i}" value="fail"> Fail</label>
          <input type="file" id="upload${i}" style="display:none;" accept="image/*">
        </div>
      `).join('')}
    </div>
    <label><input type="checkbox" id="fitToDrive"> I confirm I am fit to drive</label>
    <p class="disclaimer">⚠️ If any item is marked as Fail, seek advice before continuing your journey.</p>
    <h3>Driver Signature:</h3>
    <canvas id="signature" width="300" height="100" style="border:1px solid #ccc;"></canvas><br>
    <button type="button" onclick="clearSignature()">Clear Signature</button>
    <br><br>
    <button onclick="submitDVSA()">Submit Walkaround</button>
  `;

  // logic to show file upload only when fail is selected
  const radios = document.querySelectorAll("input[type='radio']");
  radios.forEach(r => {
    r.addEventListener("change", e => {
      const name = e.target.name;
      const index = name.replace("item", "");
      const upload = document.getElementById("upload" + index);
      if (e.target.value === "fail") {
        upload.style.display = "block";
      } else {
        upload.style.display = "none";
      }
    });
  });

  // canvas signature pad
  const canvas = document.getElementById("signature");
  const ctx = canvas.getContext("2d");
  let drawing = false;

  canvas.addEventListener("mousedown", () => drawing = true);
  canvas.addEventListener("mouseup", () => drawing = false);
  canvas.addEventListener("mouseout", () => drawing = false);
  canvas.addEventListener("mousemove", e => {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  window.clearSignature = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function submitDVSA() {
  if (!document.getElementById("fitToDrive").checked) {
    alert("You must confirm you are fit to drive.");
    return;
  }
  alert("✅ DVSA Check Submitted!");
}
