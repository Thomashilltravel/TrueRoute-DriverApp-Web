
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

function updateMenu() {
  const mode = document.getElementById("modeSelect").value;
  const menu = document.getElementById("menu");
  const output = document.getElementById("output");
  menu.innerHTML = ""; // clear menu

  const always = ["walkaround", "payslips", "messages", "satnav", "compliance"];
  const psvOnly = ["passengerCode"];
  const hgvOnly = ["parcelCode", "podUpload"];
  const dualOnly = ["passengerCode", "parcelCode", "podUpload"];

  let features = [...always];
  if (mode === "psv") features.push(...psvOnly);
  if (mode === "hgv") features.push(...hgvOnly);
  if (mode === "dual") features.push(...dualOnly);

  features.forEach(feature => {
    const btn = document.createElement("button");
    btn.innerText = featureTemplates[feature];
    btn.onclick = () => {
      output.innerHTML = `<strong>[${featureTemplates[feature]}]</strong> loaded in <strong>${mode.toUpperCase()}</strong> mode. (Function not implemented yet)`;
    };
    menu.appendChild(btn);
  });
}

window.onload = updateMenu;
    