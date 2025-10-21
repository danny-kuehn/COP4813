const canvas = document.getElementById("spiroCanvas");
const ctx = canvas.getContext("2d");
const spiroBtn = document.getElementById("spiroBtn");

function drawSpirograph(R, r, O) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const size = Math.min(canvas.width, canvas.height);
  const padding = 0.9; // 90% fit inside canvas

  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  // First pass: find true bounds
  for (let t = 0; t < Math.PI * 40; t += 0.01) {
    const x = (R + r) * Math.cos(t) - (r + O) * Math.cos(((R + r) / r) * t);
    const y = (R + r) * Math.sin(t) - (r + O) * Math.sin(((R + r) / r) * t);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const scale = (size * padding) / Math.max(width, height);

  const x0 = canvas.width / 2;
  const y0 = canvas.height / 2;

  // Second pass: actually draw
  ctx.beginPath();
  ctx.strokeStyle = "#0a66c2";
  ctx.lineWidth = 1;

  for (let t = 0; t < Math.PI * 40; t += 0.01) {
    const x =
      ((R + r) * Math.cos(t) - (r + O) * Math.cos(((R + r) / r) * t)) * scale;
    const y =
      ((R + r) * Math.sin(t) - (r + O) * Math.sin(((R + r) / r) * t)) * scale;

    if (t === 0) ctx.moveTo(x0 + x, y0 + y);
    else ctx.lineTo(x0 + x, y0 + y);
  }

  ctx.stroke();
}

spiroBtn.addEventListener("click", () => {
  const R =
    parseFloat(document.getElementById("R").value) ||
    Math.floor(Math.random() * 150 + 50);
  const r =
    parseFloat(document.getElementById("r").value) ||
    Math.floor(Math.random() * 80 + 10);
  const O =
    parseFloat(document.getElementById("O").value) ||
    Math.floor(Math.random() * 80 + 10);

  if (R > 0 && r > 0 && O >= 0) {
    // show the hidden card
    const spiroCard = document.getElementById("spiroCard");
    spiroCard.style.display = "block";

    // smooth scroll into view
    spiroCard.scrollIntoView({ behavior: "smooth", block: "start" });

    // draw the spirograph
    drawSpirograph(R, r, O);
  } else {
    alert("Please enter valid values for R, r, and O.");
  }
});
