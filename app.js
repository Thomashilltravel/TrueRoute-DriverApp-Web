/* 
 * TrueRoute Driver App
 * Developed by Thomas Hill Travel LTD
 * All rights reserved.
 * License: TrueRoute proprietary license
 * Version: 1.0.0 (Alpha)
 * Signature: TH-TR-2025-0425
*/

// ✅ Initialize Firebase
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

// ✅ Session Memory
let session = {
  name: '',
  email: '',
  licence: '',
  mode: '',
  uploadsComplete: false
};

const companyInfo = {
  companyName: "Thomas Hill Travel LTD",
  contactNumber: "+44 1234 567890",
  insuranceProvider: "Elite Motor Insurers",
  insurancePolicy: "TH-INS-2025-001"
};

const featureTemplates = {
  walkaround: "DVSA Walkaround Check",
  messages: "Messaging Portal",
  satnav: "SatNav (Vehicle-Aware)",
  passengerCode: "Passenger Code Generator",
  parcelCode: "Parcel Code Generator",
  podUpload: "Proof of Delivery Upload",
  compliance: "Compliance Failsafe Center",
  profile: "My Profile"
};

// ✅ Driver Login
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

// 🧠 SUBMIT DRIVER DETAILS FUNCTION (new)
function submitDriverDetails() {
  const name = document.getElementById("driverName").value.trim();
  const email = document.getElementById("driverEmail").value.trim();
  const licence = document.getElementById("driverLicence").value.trim();
  const mode = document.getElementById("modeSelect").value;

  if (!name || !email || !licence) {
    alert("Please complete all fields.");
    return;
  }

  session = { name, email, licence, mode, uploadsComplete: false };
  localStorage.setItem('truerouteSession', JSON.stringify(session)); // Save

  // 🧠 NEW: Push driver profile to Firestore automatically
  firestore.collection('drivers').doc(email).set({
    name: name,
    email: email,
    licence: licence,
    mode: mode,
    uploadsComplete: false
  })
  .then(() => {
    console.log("✅ Driver profile saved to Firestore!");
  })
  .catch((error) => {
    console.error("❌ Error saving driver profile:", error);
  });

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("uploadScreen").style.display = "block";
}

window.submitDriverDetails = submitDriverDetails;

// 🧠 UPLOADS SCREEN FUNCTION (your original code below it)
function submitUploads() {
  const requiredFields = [
    "licenceFront", "licenceBack",
    "cpcFront", "cpcBack",
    "digiFront", "selfieUpload"
  ];
  
  for (const fieldId of requiredFields) {
    if (document.getElementById(fieldId).files.length === 0) {
      alert("Please upload all required files including front and back of each card.");
      return;
    }
  }

  session.uploadsComplete = true;
  localStorage.setItem('truerouteSession', JSON.stringify(session)); // Update local session

  // 🧠 NEW: Update driver profile in Firestore
  firestore.collection('drivers').doc(session.email).update({
    uploadsComplete: true
  })
  .then(() => {
    console.log("✅ Driver upload status updated in Firestore!");
  })
  .catch((error) => {
    console.error("❌ Error updating upload status:", error);
  });

  document.getElementById("uploadScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  updateMenu();
}

window.submitUploads = submitUploads;

// ✅ Menu Loader
function updateMenu() {
  const menu = document.getElementById("menu");
  const output = document.getElementById("featureSection");
  menu.innerHTML = "";
  output.innerHTML = "";

  const always = ["walkaround", "messages", "satnav", "compliance", "profile"];
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
      switch (feature) {
        case "walkaround": loadDVSAForm(); break;
        case "messages": loadMessagingPortal(); break;
        case "satnav": loadSatNav(); break;
        case "passengerCode": loadPassengerCode(); break;
        case "parcelCode": loadParcelCode(); break;
        case "podUpload": loadPODUpload(); break;
        case "compliance": loadComplianceCenter(); break;
        case "profile": loadDriverProfile(); break;
      }
    };
    menu.appendChild(btn);
  });
}

// ✅ DVSA Walkaround
function loadDVSAForm() {
  const checklistItems = [
    "Access Equipment", "AdBlue", "Air Build-Up", "Battery", "Bodywork",
    "Brakes", "Cleanliness", "Coupling", "Dashboard Warning Lights",
    "Doors", "Driver's Seat", "Emergency Exits", "Exhaust System",
    "Fire Extinguishers", "First Aid Kit", "Flooring", "Fuel Level",
    "Horn", "Lights", "Load Security", "Mirrors", "Number Plates",
    "Oil Level", "Seatbelts", "Seats"
  ];

  const section = checklistItems.map((item, i) => `
    <label>${item}</label>
    <div class="check-options">
      <input type="radio" name="item${i}" value="pass"> Pass
      <input type="radio" name="item${i}" value="na"> N/A
      <input type="radio" name="item${i}" value="fail"> Fail
      <input type="file" id="upload${i}" style="display:none;">
    </div>
  `).join("");

  document.getElementById("featureSection").innerHTML = `
    <h2>DVSA Walkaround Check</h2>
    <input type="text" id="vehicleReg" placeholder="Vehicle Registration">
    <input type="number" id="odometer" placeholder="Odometer Reading (miles)">
    ${section}
    <label><input type="checkbox" id="fitToDrive"> Confirm fit to drive</label>
    <h3>Signature:</h3>
    <canvas id="signature" width="300" height="100" style="border:1px solid #ccc;"></canvas><br>
    <button onclick="clearSignature()">Clear Signature</button><br><br>
    <button onclick="submitDVSA()">Submit Walkaround</button>
  `;

  const radios = document.querySelectorAll("input[type='radio']");
  radios.forEach(r => {
    r.addEventListener("change", e => {
      const name = e.target.name;
      const index = name.replace("item", "");
      const upload = document.getElementById("upload" + index);
      upload.style.display = e.target.value === "fail" ? "block" : "none";
    });
  });

  const canvas = document.getElementById("signature");
  const ctx = canvas.getContext("2d");
  let drawing = false;
  canvas.addEventListener("mousedown", () => drawing = true);
  canvas.addEventListener("mouseup", () => drawing = false);
  canvas.addEventListener("mousemove", e => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });
}

function clearSignature() {
  const canvas = document.getElementById("signature");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function submitDVSA() {
  if (!document.getElementById("fitToDrive").checked) {
    alert("Please confirm you are fit to drive.");
    return;
  }
  alert("✅ DVSA Walkaround Submitted!");
  updateMenu();
}

// ✅ Messaging Portal
function loadMessagingPortal() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Messaging Portal</h2>
    <textarea id="messageInput" placeholder="Type your message..." rows="4"></textarea>
    <button onclick="sendMessage()">Send Message</button>
    <div id="messageHistory" style="margin-top:20px;"><ul id="logList"></ul></div>
  `;
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const msg = input.value.trim();
  if (!msg) {
    alert("Please type a message.");
    return;
  }
  if (vehicleMoving) {
    alert("Cannot send message while vehicle is moving!");
    return;
  }
  const logList = document.getElementById("logList");
  const li = document.createElement("li");
  li.textContent = `📨 ${new Date().toLocaleTimeString()}: ${msg}`;
  logList.prepend(li);
  input.value = "";
}

// ✅ SatNav
function loadSatNav() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Vehicle-Aware SatNav</h2>
    <select id="vehicleType">
      <option value="coach">Coach</option>
      <option value="lorry">Lorry</option>
      <option value="van">Van</option>
    </select><br><br>
    <button onclick="startNavigation()">Start Navigation</button>
    <button onclick="stopNavigation()">Stop Navigation</button>
    <div id="navStatus"></div>
  `;
}

function startNavigation() {
  const type = document.getElementById("vehicleType").value;
  document.getElementById("navStatus").innerHTML = `🧭 Navigation started for ${type.toUpperCase()}`;
}

function stopNavigation() {
  document.getElementById("navStatus").innerHTML = `🛑 Navigation stopped`;
}

// ✅ Compliance Center
function loadComplianceCenter() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Compliance Failsafe Center</h2>
    <ul>
      <li>Walkaround Check: ✅</li>
      <li>Licence Documents: ✅</li>
      <li>Tachograph: ✅</li>
      <li>Working Time: ✅</li>
    </ul>
    <button onclick="openIncidentReport()">Report Road Traffic Accident</button>
  `;
}

// ✅ Incident Report
function openIncidentReport() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Incident Report (Road Traffic Accident)</h2>
    <input type="text" id="incidentLocation" placeholder="Accident Location"><br><br>
    <input type="datetime-local" id="incidentDateTime"><br><br>
    <textarea id="incidentDescription" rows="4" placeholder="Describe what happened..."></textarea><br><br>
    <button onclick="generateIncidentReport()">Generate Shareable Report</button>
    <div id="incidentShareLink"></div>
  `;
}

function generateIncidentReport() {
  const location = document.getElementById("incidentLocation").value.trim();
  const dateTime = document.getElementById("incidentDateTime").value;
  const description = document.getElementById("incidentDescription").value.trim();

  if (!location || !dateTime || !description) {
    alert("Please fill in all required fields!");
    return;
  }

  const reportText = `
🚗 Road Traffic Accident Report
🗓️ Date/Time: ${new Date(dateTime).toLocaleString()}
📍 Location: ${location}
📝 Description:
${description}

Company: ${companyInfo.companyName}
Contact: ${companyInfo.contactNumber}
Insurance: ${companyInfo.insuranceProvider}
Policy: ${companyInfo.insurancePolicy}
  `.trim();

  const encoded = encodeURIComponent(reportText);
  const shareLink = `https://wa.me/?text=${encoded}`;

  document.getElementById("incidentShareLink").innerHTML = `
    <p><strong>Ready to Send:</strong></p>
    <a href="${shareLink}" target="_blank">📤 Share via WhatsApp</a>
  `;
}

// ✅ Passenger Code
function loadPassengerCode() {
  const code = Math.random().toString(36).substr(2, 8).toUpperCase();
  document.getElementById("featureSection").innerHTML = `
    <h2>Passenger QR Code Generator</h2>
    <div style="font-size:24px;font-weight:bold;">${code}</div>
  `;
}

// ✅ Parcel Code
function loadParcelCode() {
  const code = "PCL-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  document.getElementById("featureSection").innerHTML = `
    <h2>Parcel QR Code Generator</h2>
    <div style="font-size:24px;font-weight:bold;">${code}</div>
  `;
}

// ✅ Proof of Delivery
function loadPODUpload() {
  document.getElementById("featureSection").innerHTML = `
    <h2>Proof of Delivery (POD) Upload</h2>
    <input type="file" id="podFile" accept="image/*, .pdf"><br><br>
    <button onclick="submitPOD()">Submit POD</button>
    <div id="podStatus"></div>
  `;
}

function submitPOD() {
  const file = document.getElementById("podFile").files[0];
  if (!file) {
    document.getElementById("podStatus").innerHTML = "❌ No file selected.";
    return;
  }
  document.getElementById("podStatus").innerHTML = `✅ Uploaded: ${file.name}`;
}

// ✅ Driver Profile (with Selfie at Top)
function loadDriverProfile() {
  const emergencyContact = session.emergencyContact || "Not set yet";

  // Set up the better profile layout
  document.getElementById("featureSection").innerHTML = `
    <h2>My Profile</h2>

    <div style="text-align:center;margin-bottom:20px;">
      <img id="selfieThumb" alt="Driver Selfie" style="width:120px;height:150px;object-fit:cover;border-radius:8px;border:2px solid #dac640;">
      <p><strong>${session.name}</strong><br>${session.email}<br>Licence: ${session.licence}<br>Mode: ${session.mode.toUpperCase()}</p>
    </div>

    <h3>Uploaded Documents</h3>
    <div style="display:flex;flex-wrap:wrap;gap:10px;">
      <div><strong>Licence Front:</strong><br><img id="licenceFrontThumb" alt="Licence Front" style="width:80px;"></div>
      <div><strong>Licence Back:</strong><br><img id="licenceBackThumb" alt="Licence Back" style="width:80px;"></div>
      <div><strong>CPC Front:</strong><br><img id="cpcFrontThumb" alt="CPC Front" style="width:80px;"></div>
      <div><strong>CPC Back:</strong><br><img id="cpcBackThumb" alt="CPC Back" style="width:80px;"></div>
      <div><strong>Digi Card:</strong><br><img id="digiThumb" alt="Digi Card" style="width:80px;"></div>
      <div><strong>DBS Certificate:</strong><br><img id="dbsThumb" alt="DBS Certificate" style="width:80px;"></div>
    </div>

    <br>
    <button onclick="uploadNewDBS()">📄 Upload New DBS</button>

    <h3>Emergency Contact</h3>
    <p id="emergencyContact">${emergencyContact}</p>

    <h3>Payslips</h3>
    <ul>
      <li><a href="#">March 2024</a></li>
      <li><a href="#">February 2024</a></li>
      <li><a href="#">January 2024</a></li>
    </ul>

    <br>
    <button onclick="loadEditProfile()">✏️ Edit Profile</button>
  `;

  // 🔥 Fetch uploaded images from Firebase Storage
  const uploadsPath = `uploads/${session.email}/`;
  const docImages = {
    selfieUpload: "selfieThumb",
    licenceFront: "licenceFrontThumb",
    licenceBack: "licenceBackThumb",
    cpcFront: "cpcFrontThumb",
    cpcBack: "cpcBackThumb",
    digiFront: "digiThumb",
    dbsCertificate: "dbsThumb"
  };

  for (const [fileName, imgId] of Object.entries(docImages)) {
    storage.ref(uploadsPath + fileName + ".jpg").getDownloadURL()
      .then(url => {
        document.getElementById(imgId).src = url;
      })
      .catch(err => {
        console.log(`No ${fileName} uploaded yet`, err);
      });
  }
}

function uploadNewDBS() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*,.pdf";

  fileInput.onchange = async (event) => {  // ✅ NO TYPE ANNOTATION
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = storage.ref(`uploads/${session.email}/dbsCertificate.jpg`);
    try {
      await storageRef.put(file);
      alert("✅ New DBS Certificate uploaded!");

      const url = await storageRef.getDownloadURL();
      document.getElementById("dbsThumb").src = url;
    } catch (error) {
      console.error("❌ Error uploading DBS:", error);
      alert("❌ Error uploading DBS file.");
    }
  };

  fileInput.click();
}


function submitDBSUpload() {
  const file = document.getElementById("dbsFile").files[0];
  const status = document.getElementById("dbsUploadStatus");

  if (!file) {
    status.innerHTML = "❌ Please select a file to upload.";
    return;
  }

  const dbsRef = storage.ref(`uploads/${session.email}/dbsCertificate.${file.name.split('.').pop()}`);

  dbsRef.put(file)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      console.log("✅ DBS uploaded at:", url);

      // Save DBS URL to Firestore under the driver's profile
      return firestore.collection('drivers').doc(session.email).update({
        dbsCertificateUrl: url
      });
    })
    .then(() => {
      status.innerHTML = "✅ DBS Certificate uploaded and saved successfully!";
      alert("✅ New DBS uploaded successfully!");
      loadDriverProfile(); // Return to profile
    })
    .catch(error => {
      console.error("❌ Error uploading DBS:", error);
      status.innerHTML = "❌ Upload failed. Please try again.";
    });
}

// ✅ Movement Detection (GPS)
let vehicleMoving = false;
function monitorMovement() {
  if (!navigator.geolocation) return;
  let lastPos = null;
  navigator.geolocation.watchPosition(pos => {
    if (lastPos) {
      const distanceMoved = Math.sqrt(
        Math.pow(pos.coords.latitude - lastPos.latitude, 2) +
        Math.pow(pos.coords.longitude - lastPos.longitude, 2)
      );
      vehicleMoving = distanceMoved > 0.0005; // Only if moved more than 0.0005 units
    }
    lastPos = pos.coords;
  }, err => {
    console.warn("GPS Error:", err);
  }, { enableHighAccuracy: true });
}

// ✅ On Page Load
window.onload = function() {
  const savedSession = localStorage.getItem('truerouteSession');
  if (savedSession) {
    session = JSON.parse(savedSession);
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
  monitorMovement();
};
