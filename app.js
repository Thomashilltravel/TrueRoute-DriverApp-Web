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

  }function loadPassengerCode() {
    document.getElementById("featureSection").innerHTML = "<p>[Passenger Code Generator Placeholder]</p>";
  }
  
  function loadParcelCode() {
    document.getElementById("featureSection").innerHTML = "<p>[Parcel Code Generator Placeholder]</p>";
  }
  
  function loadPODUpload() {
    document.getElementById("featureSection").innerHTML = "<p>[Proof of Delivery Upload Placeholder]</p>";
  }
  
  function loadComplianceCenter() {
    document.getElementById("featureSection").innerHTML = "<p>[Compliance Failsafe Center Placeholder]</p>";
  }
  
  
    features.forEach(feature => {
        const btn = document.createElement("button");
        btn.innerText = featureTemplates[feature];
        btn.onclick = () => {
            switch (feature) {
              case "walkaround":
                loadDVSAForm();
                break;
              case "payslips":
                loadPayslips();
                break;
              case "messages":
                loadMessagingPortal();
                break;
              case "satnav":
                loadSatNav();
                break;
              case "passengerCode":
                loadPassengerCode();
                break;
              case "parcelCode":
                loadParcelCode();
                break;
              case "podUpload":
                loadPODUpload();
                break;
              case "compliance":
                loadComplianceCenter();
                break;
              default:
                output.innerHTML = `<strong>[${featureTemplates[feature]}]</strong> loaded in <strong>${session.mode.toUpperCase()}</strong> mode.`;
            }
          };
          
        menu.appendChild(btn);
      });
      
  function loadDVSAForm() {
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
  }

  function submitDVSA() {
    if (!document.getElementById("fitToDrive").checked) {
      alert("You must confirm you are fit to drive.");
      return;
    }
    alert("✅ DVSA Check Submitted!");
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
  }
  
  