/* 
 * TrueRoute Driver App
 * Developed by Thomas Hill Travel
 * All rights reserved.
 * License: TrueRoute proprietary license
 * Version: 1.0.0 (Alpha)
 * Signature: TH-TR-2025-0425
*/

// Initialize Firebase (already loaded via <script> in index.html)
const firebaseConfig = {
  apiKey: "AIzaSyCVJqDnJVCBgimKAZOnb9NIMWN92fbaCtQ",
  authDomain: "trueroute-7cd95.firebaseapp.com",
  projectId: "trueroute-7cd95",
  storageBucket: "trueroute-7cd95.firebasestorage.app",
  messagingSenderId: "1076186848093",
  appId: "1:1076186848093:web:aaeabcf3d98f4c413fe6b4"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// ✅ Query Function
async function getDrivers() {
  const driversRef = firestore.collection('drivers');
  const q = driversRef.where('mode', '==', 'PSV')
                       .where('uploadsComplete', '==', true)
                       .orderBy('name');

  try {
    const querySnapshot = await q.get();
    querySnapshot.forEach(doc => {
      console.log(doc.id, " => ", doc.data()); // Log each driver's data
    });
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}

// ✅ Call the function after Firebase setup
getDrivers();


const featureTemplates = {
    walkaround: "DVSA Walkaround Check",
    payslips: "Payslip Viewer",
    messages: "Messaging Portal",
    satnav: "SatNav (Vehicle-Aware)",
    passengerCode: "Passenger Code Generator",
    parcelCode: "Parcel Code Generator",
    podUpload: "Proof of Delivery Upload",
    compliance: "Compliance Failsafe Center",
    profile: "My Profile" // ✅ ADD THIS
  };
  

  let session = {
    name: '',
    email: '',
    licence: '',
    mode: '',
    uploadsComplete: false
  };
  
  // ✅ This must be OUTSIDE the session block!
  const companyInfo = {
    companyName: "Thomas Hill Travel",
    contactNumber: "+44 1234 567890",
    insuranceProvider: "Elite Motor Insurers",
    insurancePolicy: "TH-INS-2025-001"
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

    // ✅ ADD THIS at the bottom
window.submitLogin = submitLogin;
  
    session = { name, email, licence, mode, uploadsComplete: false };
    localStorage.setItem('truerouteSession', JSON.stringify(session)); // ✅ Save to memory
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("uploadScreen").style.display = "block";

  }// Firebase Authentication: Handle Account Creation
function createAccount() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log('Account created:', user);
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error ${errorCode}: ${errorMessage}`);
    });
}

// Firebase Authentication: Handle Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log('Logged in:', user);
      session.email = user.email;
      localStorage.setItem('truerouteSession', JSON.stringify(session)); // Save session
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error ${errorCode}: ${errorMessage}`);
    });
}

// Password Reset
function resetPassword() {
  const email = document.getElementById("email").value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error ${errorCode}: ${errorMessage}`);
    });

}function submitUploads() {
    const requiredFields = [
      "licenceFront", "licenceBack",
      "cpcFront", "cpcBack",
      "digiFront", "digiBack",
      "selfieUpload"
    ];
  
  }// Update the Dynamic Menu Based on the Driver's Mode
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
    btn.onclick = () => {
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
    };
    menu.appendChild(btn);
  });
}

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
  
    function loadPassengerCode() {
    const passengerCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    document.getElementById("featureSection").innerHTML = `
      <h2>Passenger QR Code Generator</h2>
      <p>Your unique code for this trip:</p>
      <div style="font-size: 24px; font-weight: bold;">${passengerCode}</div>
      <p><em>This code can be scanned by the customer or dispatcher to verify identity.</em></p>
    `;

  }function loadParcelCode() {
    const parcelCode = "PCL-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById("featureSection").innerHTML = `
      <h2>Parcel Code Generator</h2>
      <p>Your unique parcel reference:</p>
      <div style="font-size: 24px; font-weight: bold;">${parcelCode}</div>
      <p><em>This reference is for use with parcel deliveries and tracking.</em></p>
    `;

  }function loadPODUpload() {
    document.getElementById("featureSection").innerHTML = `
      <h2>Proof of Delivery Upload</h2>
      <label for="podFile">Upload POD document or photo:</label>
      <input type="file" id="podFile" accept="image/*,.pdf"><br><br>
      <button onclick="submitPOD()">Submit POD</button>
      <p id="podStatus" style="margin-top: 10px;"></p>
    `;
  }
  
  function submitPOD() {
    const file = document.getElementById("podFile").files[0];
    const status = document.getElementById("podStatus");
  
    if (!file) {
      status.innerHTML = `<span style="color: red;">❌ Please select a file to upload.</span>`;
      return;
    }
  
    // Placeholder logic
    status.innerHTML = `<span style="color: green;">✅ POD "${file.name}" uploaded (simulated).</span>`;

  }function loadComplianceCenter() {
    document.getElementById("featureSection").innerHTML = `
      <h2>Compliance Failsafe Center</h2>
      <p><strong>Status:</strong> All systems normal ✅</p>
      <ul>
        <li>DVSA Check submitted: <strong>✔</strong></li>
        <li>Licence Documents Valid: <strong>✔</strong></li>
        <li>Driving Hours: <em>Within legal limit</em></li>
        <li>Tachograph: <em>Sync scheduled</em></li>
      </ul>
      <button onclick="openIncidentReport()">Report an Incident (RTA)</button>
      <p><em>In the full version, this will include real-time tachograph alerts, working time limits, and safety warnings.</em></p>
    `;

  }function loadDVSAForm() {
    const checklistItems = [
      "Access Equipment - Step/handrails secure and functioning",
      "AdBlue - Level sufficient and system not leaking",
      "Air Build-Up - System pressurizes correctly with no audible leaks",
      "Battery - Securely mounted, terminals clean, no corrosion",
      "Bodywork - No sharp edges or loose panels",
      "Brakes - Including service brake and handbrake",
      "Cleanliness - Interior and exterior, mirrors/windows",
      "Coupling (if trailer attached) - Secure, no damage",
      "Dashboard Warning Lights - Function and extinguish as expected",
      "Doors - Open/close properly and are secure",
      "Driver's Seat - Secure and adjusted properly",
      "Emergency Exits - Marked, functional, and unobstructed",
      "Exhaust System - No excessive smoke or leaks",
      "Fire Extinguishers - Present, charged, and in date",
      "First Aid Kit - Present and contents complete/in date",
      "Flooring - Secure, not damaged or slippery",
      "Fuel Level - Adequate for journey, cap secure",
      "Horn - Operational",
      "Lights - Headlights, indicators, brake lights, reverse, fog",
      "Load Security - If applicable, safe and secure",
      "Mirrors - Clean, secure, and adjusted",
      "Number Plates - Present, secure, clean and legible",
      "Oil Level - Within correct range",
      "Seatbelts - Where fitted, functional and undamaged",
      "Seats - Fixed properly and clean"
    ];
  
    const section = checklistItems.map((item, i) => `
      <label>${item}</label>
      <div class="check-options">
        <label><input type="radio" name="item${i}" value="pass"> Pass</label>
        <label><input type="radio" name="item${i}" value="na"> N/A</label>
        <label><input type="radio" name="item${i}" value="fail"> Fail</label>
        <input type="file" id="upload${i}" style="display:none;" accept="image/*">
      </div>`).join("");
  
    document.getElementById("featureSection").innerHTML = `
      <h2>DVSA Walkaround Check</h2>
      <label>Vehicle Registration:</label>
      <input type="text" id="vehicleReg" placeholder="e.g. AB12 CDE">
      <label>Odometer Reading (miles):</label>
      <input type="number" id="odometer" placeholder="e.g. 102345">
      ${section}
      <label><input type="checkbox" id="fitToDrive"> I confirm I am fit to drive</label>
      <p class="disclaimer">⚠️ If any item is marked as Fail, seek advice before continuing your journey.</p>
      <h3>Driver Signature:</h3>
      <canvas id="signature" width="300" height="100" style="border:1px solid #ccc; touch-action: none;"></canvas><br>
      <button type="button" onclick="clearSignature()">Clear Signature</button><br><br>
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
  
    function getPosition(e) {
      return e.touches ? {
        x: e.touches[0].clientX - canvas.getBoundingClientRect().left,
        y: e.touches[0].clientY - canvas.getBoundingClientRect().top
      } : {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  
    canvas.addEventListener("mousedown", () => drawing = true);
    canvas.addEventListener("mouseup", () => drawing = false);
    canvas.addEventListener("mouseout", () => drawing = false);
    canvas.addEventListener("mousemove", e => {
      if (!drawing) return;
      const { x, y } = getPosition(e);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    });
  
    canvas.addEventListener("touchstart", e => {
      e.preventDefault();
      drawing = true;
    }, { passive: false });
  
    canvas.addEventListener("touchend", () => drawing = false);
    canvas.addEventListener("touchmove", e => {
      e.preventDefault();
      if (!drawing) return;
      const { x, y } = getPosition(e);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }, { passive: false });
  
    window.clearSignature = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

  }function submitDVSA() {
    if (!document.getElementById("fitToDrive").checked) {
      alert("You must confirm you are fit to drive.");
      return;
    }
  
    alert("✅ DVSA Check Submitted!");
  
    // Auto-close walkaround and return to dashboard
    const output = document.getElementById("featureSection");
    output.innerHTML = `
      <p>✅ Walkaround Check submitted successfully.</p>
      <p>Returning to dashboard...</p>
    `;
    
    setTimeout(updateMenu, 1500); // After 1.5 seconds, reload dashboard

  }function loadPayslips() {
    const payslipList = [
      { name: "Payslip - March 2024", url: "#" },
      { name: "Payslip - February 2024", url: "#" },
      { name: "Payslip - January 2024", url: "#" }
    ];
  
    document.getElementById("featureSection").innerHTML = `
      <h2>Your Payslips</h2>
      <ul>
        ${payslipList.map(p => `
          <li>
            <a href="${p.url}" target="_blank">${p.name}</a>
          </li>
        `).join("")}
      </ul>
      <p><em>Note: In the full version, these will be synced securely from the company payroll system.</em></p>
    `;

  }function loadMessagingPortal() {
    document.getElementById("featureSection").innerHTML = `
      <h2>Driver Messaging Portal</h2>
      <label><input type="checkbox" id="vehicleMoving"> Vehicle is moving</label>
      <textarea id="messageInput" placeholder="Type your message..." rows="4"></textarea>
      <button onclick="sendMessage()">Send Message</button>
      <div id="messageHistory" style="margin-top: 20px;"><strong>Message Log:</strong><ul id="logList"></ul></div>
    `;

  }function sendMessage() {
    const isMoving = document.getElementById("vehicleMoving").checked;
    const input = document.getElementById("messageInput");
    const logList = document.getElementById("logList");
  
    if (isMoving) {
      alert("⚠️ You cannot send messages while the vehicle is moving.");
      return;
    }
  
    const msg = input.value.trim();   // <<<< THIS LINE IS MISSING
  
    if (!msg) {
      alert("Please type a message first.");
      return;
    }
  
    const li = document.createElement("li");
    li.textContent = `📨 ${new Date().toLocaleTimeString()}: ${msg}`;
    logList.prepend(li);
    input.value = "";

  }function loadSatNav() {
    document.getElementById("featureSection").innerHTML = `
      <h2>Vehicle-Aware SatNav</h2>
      <label>Select vehicle type:</label>
      <select id="vehicleType">
        <option value="coach">Coach / PSV</option>
        <option value="lorry">HGV / Lorry</option>
        <option value="van">Van</option>
      </select>
      <br>
      <button onclick="startNavigation()">Start Navigation</button>
      <div id="navStatus" style="margin-top: 20px;"></div>
      <p><em>In the full version, this will include live route planning, dimension-aware routing, and GPS integration.</em></p>
    `;

  }function startNavigation() {
    const type = document.getElementById("vehicleType").value;
    const navStatus = document.getElementById("navStatus");
    navStatus.innerHTML = `🧭 Navigation started for <strong>${type.toUpperCase()}</strong>. (Mock routing active)`;

  }// Auto-load session if saved
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
  };  // 👈 CLOSE the window.onload function properly here!
  
  // Now the Incident Form function starts outside of it:
  function openIncidentReport() {
    document.getElementById("featureSection").innerHTML = `
      <h2>Incident Report Form (Road Traffic Accident)</h2>
      <label>Location:</label><br>
      <input type="text" id="incidentLocation" placeholder="Enter accident location"><br><br>
  
      <label>Time and Date:</label><br>
      <input type="datetime-local" id="incidentDateTime"><br><br>
  
      <label>Brief Description:</label><br>
      <textarea id="incidentDescription" rows="4" placeholder="Describe what happened..."></textarea><br><br>
  
      <label>Upload Any Photos:</label><br>
      <input type="file" id="incidentPhotos" accept="image/*" multiple><br><br>
  
      <button onclick="generateIncidentReport()">Generate Shareable Report</button>
  
      <div id="incidentShareLink" style="margin-top:20px;"></div>
    `;

 // 🚨 Start of the Incident Report System

  }function generateIncidentReport() {
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
  
  ===========================
  Company: ${companyInfo.companyName}
  Contact: ${companyInfo.contactNumber}
  Insurance: ${companyInfo.insuranceProvider}
  Policy Number: ${companyInfo.insurancePolicy}
  ===========================
    `.trim();
  
    const encoded = encodeURIComponent(reportText);
    const shareLink = `https://wa.me/?text=${encoded}`;
  
    document.getElementById("incidentShareLink").innerHTML = `
      <p><strong>Ready to Send:</strong></p>
      <a href="${shareLink}" target="_blank" style="font-size:18px;">📤 Share Incident Report via WhatsApp</a>
    `;
  }
  // 🚨 End of the Incident Report System
   
  // Load Driver Profile from Firestore (can store details here)
  function loadDriverProfile() {
    document.getElementById("featureSection").innerHTML = `
      <h2>Driver Profile</h2>
      <p><strong>Name:</strong> ${session.name}</p>
      <p><strong>Email:</strong> ${session.email}</p>
      <p><strong>Licence Number:</strong> ${session.licence}</p>
      <p><strong>Mode:</strong> ${session.mode.toUpperCase()}</p>
    `;
  
    // Correct Firestore storage
    const userRef = doc(firestore, 'drivers', session.email);
    setDoc(userRef, {
      name: session.name,
      email: session.email,
      licence: session.licence,
      mode: session.mode
    }).then(() => {
      console.log("Driver profile stored in Firestore!");
    }).catch(error => {
      console.error("Error storing profile: ", error);
    });
  }
  

  
  

  
