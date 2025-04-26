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
    <h2>Compliance Center</h2>
    <p>Status: All systems normal ✅</p>
  `;
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
  const msg = input.value.trim();
  if (!msg) return alert("Type a message first.");
  const history = document.getElementById("messageHistory");
  const time = new Date().toLocaleTimeString();
  history.innerHTML += `<div>📨 ${time}: ${msg}</div>`;
  input.value = "";
}

function loadSatNav() {
  document.getElementById("featureSection").innerHTML = `
    <h2>SatNav (Simulated)</h2>
    <select id="vehicleType">
      <option value="coach">Coach</option>
      <option value="lorry">HGV</option>
      <option value="van">Van</option>
    </select>
    <button onclick="startNavigation()">Start Navigation</button>
  `;
}

function startNavigation() {
  const type = document.getElementById("vehicleType").value;
  document.getElementById("featureSection").innerHTML += `
    <p>🧭 Navigating as ${type.toUpperCase()} (simulated)</p>
  `;
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
    } else {
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("uploadScreen").style.display = "block";
    }
  }
};

 