
const checks = [
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

function createChecklist() {
  const section = document.getElementById("checklistSection");
  checks.forEach((text, idx) => {
    const group = document.createElement("div");
    group.className = "checklist-group";
    const label = document.createElement("label");
    label.textContent = text;

    const options = document.createElement("div");
    options.className = "check-options";

    ["Pass", "N/A", "Fail"].forEach(opt => {
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `check_${idx}`;
      radio.value = opt.toLowerCase();
      radio.required = true;
      const radioLabel = document.createElement("label");
      radioLabel.appendChild(radio);
      radioLabel.append(" " + opt);
      options.appendChild(radioLabel);
    });

    const fileUpload = document.createElement("input");
    fileUpload.type = "file";
    fileUpload.accept = "image/*";
    fileUpload.style.display = "none";
    fileUpload.id = `upload_${idx}`;

    options.querySelectorAll("input").forEach(input => {
      input.addEventListener("change", () => {
        fileUpload.style.display = input.value === "fail" ? "block" : "none";
      });
    });

    group.appendChild(label);
    group.appendChild(options);
    group.appendChild(fileUpload);
    section.appendChild(group);
  });
}

const canvas = document.getElementById("signature");
const ctx = canvas.getContext("2d");
let drawing = false;

canvas.addEventListener("mousedown", () => { drawing = true; ctx.beginPath(); });
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseout", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById("dvsaForm").addEventListener("submit", function(e) {
  e.preventDefault();
  if (!document.getElementById("fitToDrive").checked) {
    alert("⚠️ You must confirm you are fit to drive.");
    return;
  }
  alert("✅ DVSA Walkaround submitted with signature and inspection results.");
  this.reset();
  clearSignature();
});

createChecklist();
    