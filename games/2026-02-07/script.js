const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const resetBtn = document.getElementById("reset");

const state = {
  paddle: { w: 120, h: 14, x: 260, y: 330, speed: 6 },
  ball: { r: 8, x: 320, y: 220, vx: 3.2, vy: -3.6 },
  score: 0,
  best: 0,
  running: true,
  input: { left: false, right: false }
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function resetBall() {
  state.ball.x = canvas.width / 2;
  state.ball.y = canvas.height / 2;
  const dir = Math.random() > 0.5 ? 1 : -1;
  state.ball.vx = dir * (2.6 + Math.random() * 1.2);
  state.ball.vy = -3.6;
}

function resetGame() {
  state.score = 0;
  state.running = true;
  state.paddle.x = (canvas.width - state.paddle.w) / 2;
  resetBall();
  updateHud();
}

function updateHud() {
  scoreEl.textContent = state.score;
  bestEl.textContent = state.best;
}

function drawBackground() {
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(125,211,252,0.25)";
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPaddle() {
  ctx.fillStyle = "#7dd3fc";
  ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h);
}

function drawBall() {
  ctx.fillStyle = "#fda4af";
  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2);
  ctx.fill();
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e9f0ff";
  ctx.font = "700 28px 'Trebuchet MS'";
  ctx.textAlign = "center";
  ctx.fillText("Missed!", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "16px 'Trebuchet MS'";
  ctx.fillText("Press Space to serve again", canvas.width / 2, canvas.height / 2 + 18);
}

function update() {
  if (!state.running) return;

  if (state.input.left) {
    state.paddle.x -= state.paddle.speed;
  }
  if (state.input.right) {
    state.paddle.x += state.paddle.speed;
  }
  state.paddle.x = clamp(state.paddle.x, 0, canvas.width - state.paddle.w);

  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  if (state.ball.x - state.ball.r <= 0 || state.ball.x + state.ball.r >= canvas.width) {
    state.ball.vx *= -1;
    state.ball.x = clamp(state.ball.x, state.ball.r, canvas.width - state.ball.r);
  }
  if (state.ball.y - state.ball.r <= 0) {
    state.ball.vy *= -1;
    state.ball.y = state.ball.r;
  }

  const paddleTop = state.paddle.y;
  const paddleBottom = state.paddle.y + state.paddle.h;
  const paddleLeft = state.paddle.x;
  const paddleRight = state.paddle.x + state.paddle.w;

  if (
    state.ball.y + state.ball.r >= paddleTop &&
    state.ball.y - state.ball.r <= paddleBottom &&
    state.ball.x >= paddleLeft &&
    state.ball.x <= paddleRight &&
    state.ball.vy > 0
  ) {
    const hitPos = (state.ball.x - paddleLeft) / state.paddle.w;
    const angle = (hitPos - 0.5) * Math.PI * 0.7;
    const speed = Math.min(7, Math.hypot(state.ball.vx, state.ball.vy) + 0.15);
    state.ball.vx = Math.sin(angle) * speed;
    state.ball.vy = -Math.cos(angle) * speed;
    state.ball.y = paddleTop - state.ball.r - 0.5;
    state.score += 1;
    if (state.score > state.best) state.best = state.score;
    updateHud();
  }

  if (state.ball.y - state.ball.r > canvas.height) {
    state.running = false;
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPaddle();
  drawBall();
  if (!state.running) drawGameOver();
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft" || event.code === "KeyA") state.input.left = true;
  if (event.code === "ArrowRight" || event.code === "KeyD") state.input.right = true;
  if (event.code === "Space" && !state.running) {
    state.running = true;
    resetBall();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft" || event.code === "KeyA") state.input.left = false;
  if (event.code === "ArrowRight" || event.code === "KeyD") state.input.right = false;
});

resetBtn.addEventListener("click", resetGame);

resetGame();
loop();
