const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

canvas.focus();

let player = { x: 200, y: 550, width: 40, height: 40 };
let enemies = [];
let score = 0;
let lives = 3;
let gameOver = false;
let lastTime = performance.now();
let spawnTimer = 0;

// Kontrol Keyboard
const keys = {};
canvas.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
    e.preventDefault();
  }
});
canvas.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

canvas.addEventListener('click', () => {
  canvas.focus();
});

// Kontrol Sentuh (Touch / Drag langsung di Canvas)
let isTouching = false;
let touchStartX = 0;
let playerStartX = 0;

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  touchStartX = touch.clientX - rect.left;
  playerStartX = player.x;
  isTouching = true;
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  if (!isTouching) return;
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const currentTouchX = touch.clientX - rect.left;
  const deltaX = currentTouchX - touchStartX;
  let newX = playerStartX + deltaX;
  player.x = Math.max(0, Math.min(canvas.width - player.width, newX));
}, { passive: false });

canvas.addEventListener('touchend', () => {
  isTouching = false;
});

// Kontrol Tombol Virtual HP
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');

btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowLeft'] = true; });
btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); keys['ArrowLeft'] = false; });
btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowRight'] = true; });
btnRight.addEventListener('touchend', (e) => { e.preventDefault(); keys['ArrowRight'] = false; });

function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 30,
    speed: 100 + Math.random() * 150
  });
}

function update(dt) {
  if (keys['ArrowLeft'] && player.x > 0) player.x -= 300 * dt;
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 300 * dt;
  
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnEnemy();
    spawnTimer = 0.5 + Math.random() * 0.5;
  }
  
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.y += enemy.speed * dt;
    
    if (enemy.y > canvas.height) {
      enemies.splice(i, 1);
      score += 10;
    }
    
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      enemies.splice(i, 1);
      lives--;
      if (lives <= 0) {
        gameOver = true;
        document.getElementById('gameOverlay').style.display = 'flex';
        document.getElementById('finalScore').textContent = score;
      }
    }
  }
  
  document.getElementById('score').textContent = `SKOR: ${score}`;
  document.getElementById('lives').textContent = '❤️'.repeat(Math.max(0, lives));
}

function draw() {
  ctx.fillStyle = '#050805';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#0d3b1f';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
  
  ctx.fillStyle = '#39ff6a';
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#39ff6a';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(player.x, player.y, player.width, player.height);
  
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ff3355';
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
  
  ctx.shadowBlur = 0;
}

function gameLoop(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;
  
  if (!gameOver) {
    update(dt);
    draw();
  }
  
  requestAnimationFrame(gameLoop);
}

function restartGame() {
  score = 0;
  lives = 3;
  gameOver = false;
  enemies = [];
  spawnTimer = 0;
  document.getElementById('gameOverlay').style.display = 'none';
  canvas.focus();
}

canvas.focus();
requestAnimationFrame(gameLoop);
