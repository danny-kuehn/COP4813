const container = document.getElementById("animation-area");
const canvas = document.createElement("canvas");
container.appendChild(canvas);
const ctx = canvas.getContext("2d");

const isMobile = window.matchMedia("(pointer: coarse)").matches;

function resizeCanvas() {
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = ((rect.width * 2) / 3) * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

let ball = {
  x: 150,
  y: 120,
  radius: isMobile ? 45 : 35,
  color: "#0a66c2",
  dx: isMobile ? 1.8 : 3.2, // slower on mobile, faster on desktop
  dy: isMobile ? 1.8 : 3.2,
  scale: 1,
  popping: false,
  lastClick: 0,
};

function getRandomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r}, ${g}, ${b})`;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius * ball.scale, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  ball.x += ball.dx;
  ball.y += ball.dy;

  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;

  if (ball.x + ball.radius > width || ball.x - ball.radius < 0)
    ball.dx = -ball.dx;
  if (ball.y + ball.radius > height || ball.y - ball.radius < 0)
    ball.dy = -ball.dy;

  if (ball.popping) {
    ball.scale += 0.1;
    if (ball.scale >= 1.3) {
      ball.scale = 1;
      ball.popping = false;
    }
  }

  requestAnimationFrame(update);
}

function handleInteraction(x, y) {
  const now = Date.now();
  if (now - ball.lastClick < 200) return;
  ball.lastClick = now;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const mx = ((x - rect.left) * scaleX) / window.devicePixelRatio;
  const my = ((y - rect.top) * scaleY) / window.devicePixelRatio;
  const dist = Math.hypot(mx - ball.x, my - ball.y);

  const clickRadius = ball.radius * (isMobile ? 2.2 : 1.3); // generous for touch, tighter for mouse

  if (dist <= clickRadius) {
    ball.color = getRandomColor();
    ball.dx = (Math.random() - 0.5) * (isMobile ? 4 : 8);
    ball.dy = (Math.random() - 0.5) * (isMobile ? 4 : 8);
    ball.popping = true;
  }
}

canvas.addEventListener("click", (e) =>
  handleInteraction(e.clientX, e.clientY),
);
canvas.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  handleInteraction(t.clientX, t.clientY);
  e.preventDefault();
});

update();
