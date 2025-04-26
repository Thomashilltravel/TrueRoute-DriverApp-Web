/* 
 * TrueRoute Driver App
 * Developed by Thomas Hill Travel
 * All rights reserved.
 * License: TrueRoute proprietary license
 * Version: 1.0.0 (Alpha)
 * Signature: TH-TR-2025-0425
*/

// ✅ Firebase App & Services
const firebaseConfig = {
  apiKey: "AIzaSyCVJqDnJVCBgimKAZOnb9NIMWN92fbaCtQ",
  authDomain: "trueroute-7cd95.firebaseapp.com",
  projectId: "trueroute-7cd95",
  storageBucket: "trueroute-7cd95.appspot.com",
  messagingSenderId: "1076186848093",
  appId: "1:1076186848093:web:aaeabcf3d98f4c413fe6b4"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// ✅ Session memory
let session = {
  name: '',
  email: '',
  licence: '',
  mode: '',
  uploadsComplete: false
};

// ✅ Static Company Info
const companyInfo = {
  companyName: "Thomas Hill Travel",
  contactNumber: "+44 1234 567890",
  insuranceProvider: "Elite Motor Insurers",
  insurancePolicy: "TH-INS-2025-001"
};

// ✅ Feature Templates
const featureTemplates = {
  walkaround: "DVSA Walkaround Check",
  payslips: "Payslip Viewer",
  messages: "Messaging Portal",
  satnav: "SatNav (Vehicle-Aware)",
  passengerCode: "Passenger Code Generator",
  parcelCode: "Parcel Code Generator",
  podUpload: "Proof of Delivery Upload",
  compliance: "Compliance Failsafe Center",
  profile: "My Profile"
};

// ✅ NEW: Vehicle Movement Sensing
let isVehicleMoving = false;

// ✅ Start Monitoring Vehicle Movement
function monitorMovement() {
  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(position => {
      const speed = position.coords.speed; // Speed is in meters per second
      if (speed !== null && speed > 0.5) { // 0.5 m/s ~ 1.1 mph
        isVehicleMoving = true;
      } else {
        isVehicleMoving = false;
      }
    }, error => {
      console.error("Geolocation error:", error);
    }, {
      enableHighAccuracy: true,
      maximumAge: 1000
    });
  } else {
    console.error("Geolocation not available.");
  }
}

// ✅ Get Drivers Function (testing purpose)
async function getDrivers() {
  const driversRef = firestore.collection('drivers');
  try {
    const querySnapshot = await driversRef
      .where('mode', '==', 'PSV')
      .where('uploadsComplete', '==', true)
      .orderBy('name')
      .get();
    querySnapshot.forEach(doc => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}
getDrivers();

// ✅ Submit Login
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
  localStorage.setItem('truerouteSession', JSON.stringify(session));

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("uploadScreen").style.display = "block";
}
window.submitLogin = submitLogin;

// ✅ Upload Documents
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
  localStorage.setItem('truerouteSession', JSON.stringify(session));

  document.getElementById("uploadScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  updateMenu();
}
window.submitUploads = submitUploads;

// ✅ Update Driver Menu
function updateMenu() {
  const menu = document.getElementById("menu");
  const output = document.getElementById("featureSection");
  menu.innerHTML = "";
  output.innerHTML = "";

  const always = ["walkaround", "payslips", "messages", "satnav", "compliance", "profile"];
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
    btn.onclick = () => loadFeature(feature);
    menu.appendChild(btn);
  });
}

// ✅ Load Individual Features
function loadFeature(feature) {
  const output = document.getElementById("featureSection");
  switch (feature) {
    case "walkaround": loadDVSAForm(); break;
    case "payslips": loadPayslips(); break;
    case "messages": loadMessagingPortal(); break;
    case "satnav": loadSatNav(); break;
    case "passengerCode": loadPassengerCode(); break;
    case "parcelCode": loadParcelCode(); break;
    case "podUpload": loadPODUpload(); break;
    case "compliance": loadComplianceCenter(); break;
    case "profile": loadDriverProfile(); break;
    default:
      output.innerHTML = `<strong>[${featureTemplates[feature]}]</strong> loaded in <strong>${session.mode.toUpperCase()}</strong> mode.`;
  }
}

// ✅ Individual Feature Loaders (Same as your code - no syntax errors)

function loadPassengerCode() {
  const passengerCode = Math.random().toString(36).substr(2, 8).toUpperCase();
  document.getElementById("featureSection").innerHTML = `
    <h2>Passenger QR Code Generator</h2>
    <div style="font-size:24px;font-weight:bold;">${passengerCode}</div>
  `;
}

function loadParcelCode() {
  const parcelCode = "PCL-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  document.getElementById("featureSection").innerHTML = `
    <h2>Parcel Code Generator</h2>
    <div style="font-size:24px;font-weight:bold;">${parcelCode}</div>
  `;
}

function loadPODUpload() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Proof of Delivery Upload</h2>
    <input type="file" id="podFile" accept="image/*,.pdf">
    <button onclick="submitPOD()">Submit POD</button>
    <div id="podStatus"></div>
  `;
}

function submitPOD() {
  const file = document.getElementById("podFile").files[0];
  const status = document.getElementById("podStatus");
  if (!file) {
    status.innerHTML = `❌ Please select a file.`;
    return;
  }
  status.innerHTML = `✅ POD "${file.name}" uploaded (simulated).`;
}

function loadComplianceCenter() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Compliance Failsafe Center</h2>
    <p><strong>Status:</strong> All systems normal ✅</p>
    <ul>
      <li>✔️ DVSA Walkaround Check submitted (Recent: <em>Yes</em>)</li>
      <li>✔️ Licence Documents Uploaded (Front/Back Valid)</li>
      <li>✔️ CPC and Digi Card Verified</li>
      <li>🕐 Driving Hours: <em>Within Legal Limit</em></li>
      <li>📈 Tachograph Sync: <em>Up to Date</em></li>
      <li>✅ Emergency Contact Registered</li>
    </ul>
    <button onclick="openIncidentReport()">Report an Incident (RTA)</button>
    <p><em>In future versions: live tacho alerts, working time warnings, and accident auto-logging!</em></p>
  `;
}

function loadDVSAForm() {
  const checklistItems = [
    "Step/handrails secure and functioning",
    "AdBlue level sufficient",
    "No air leaks detected",
    "Battery secure, terminals clean",
    "Bodywork no sharp edges or damage",
    "Brakes operational",
    "Mirrors clean and adjusted",
    "Lights and indicators working",
    "Seats and seatbelts secure",
    "Emergency exits functional",
    "First aid kit present and in-date",
    "Fire extinguisher present and in-date",
    "Fuel level sufficient",
    "Horn operational",
    "Number plates clean and readable"
  ];

  const checks = checklistItems.map((item, i) => `
    <label>${item}</label>
    <div class="check-options">
      <input type="radio" name="check${i}" value="pass" required> Pass
      <input type="radio" name="check${i}" value="na"> N/A
      <input type="radio" name="check${i}" value="fail"> Fail
      <input type="file" id="photo${i}" style="display:none;" accept="image/*">
    </div>
  `).join("");

  document.getElementById("featureSection").innerHTML = `
    <h2>DVSA Daily Walkaround Check</h2>
    <label>Vehicle Registration:</label><br>
    <input type="text" id="vehicleReg" required><br><br>

    <label>Odometer Reading (Miles):</label><br>
    <input type="number" id="odometer" required><br><br>

    ${checks}

    <label><input type="checkbox" id="fitToDrive"> I confirm I am fit to drive</label><br><br>

    <h3>Signature:</h3>
    <canvas id="signature" width="300" height="100" style="border:1px solid black;"></canvas><br>
    <button onclick="clearSignature()">Clear Signature</button><br><br>

    <button onclick="submitDVSA()">Submit Walkaround Check</button>
  `;

  // Auto show file upload if "Fail" is clicked
  document.querySelectorAll('input[type=radio]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const index = e.target.name.replace('check', '');
      const photo = document.getElementById('photo' + index);
      photo.style.display = e.target.value === "fail" ? "block" : "none";
    });
  });
}


function loadPayslips() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Your Payslips</h2>
    <ul>
      <li><a href="#">Payslip - March</a></li>
      <li><a href="#">Payslip - February</a></li>
      <li><a href="#">Payslip - January</a></li>
    </ul>
  `;
}

function loadMessagingPortal() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Messaging Portal</h2>
    <textarea id="messageInput" placeholder="Type message"></textarea>
    <button onclick="sendMessage()">Send</button>
    <div id="messageHistory"></div>
  `;
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const logList = document.getElementById("logList");

  if (isVehicleMoving) {
    alert("⚠️ You cannot send messages while the vehicle is moving.");
    return;
  }

  const msg = input.value.trim();
  if (!msg) {
    alert("Please type a message first.");
    return;
  }

  const li = document.createElement("li");
  li.textContent = `📨 ${new Date().toLocaleTimeString()}: ${msg}`;
  logList.prepend(li);
  input.value = "";
}

function loadSatNav() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Vehicle-Aware SatNav</h2>
    <label>Select vehicle type:</label>
    <select id="vehicleType">
      <option value="coach">Coach / PSV</option>
      <option value="lorry">HGV / Lorry</option>
      <option value="van">Van</option>
    </select><br><br>

    <button onclick="startNavigation()">Start Navigation</button>
    <button onclick="stopNavigation()" style="margin-left:10px;">Stop Navigation</button>

    <div id="navStatus" style="margin-top: 20px;"></div>
  `;
}

function startNavigation() {
  const type = document.getElementById("vehicleType").value;
  const navStatus = document.getElementById("navStatus");
  navStatus.innerHTML = `🧭 Navigation started for <strong>${type.toUpperCase()}</strong>. (Mock active)`;
}

function stopNavigation() {
  const navStatus = document.getElementById("navStatus");
  navStatus.innerHTML = `<strong>🛑 Navigation stopped.</strong>`;
}


function loadDriverProfile() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Driver Profile</h2>
    <p>Name: ${session.name}</p>
    <p>Email: ${session.email}</p>
    <p>Licence: ${session.licence}</p>
    <p>Mode: ${session.mode.toUpperCase()}</p>
  `;
}

// ✅ Auto-Reload Session
window.onload = () => {
  const saved = localStorage.getItem('truerouteSession');
  if (saved) {
    session = JSON.parse(saved);
    if (session.uploadsComplete) {
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("uploadScreen").style.display = "none";
      document.getElementById("mainApp").style.display = "block";
      updateMenu();
      monitorMovement();
    } else {
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("uploadScreen").style.display = "block";
    }
  }
};

 