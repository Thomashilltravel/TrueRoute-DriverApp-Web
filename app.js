
const canvas = document.getElementById('signature');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';
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
  alert("✅ Walkaround Check Submitted!");
  this.reset();
  clearSignature();
});
    