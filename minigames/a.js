const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

// Fokus otomatis ke canvas
canvas.focus();

let player = { x: 200, y: 550, width: 40, height: 40 };
let enemies = [];
let score = 0;
let lives = 3;
let gameOver = false;
let lastTime = performance.now();
let spawnTimer = 0;

// Kontrol keyboard
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

// Klik untuk fokus
canvas.addEventListener('click', () => {
  canvas.focus();
});

// Spawn musuh
function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 30,
    speed: 100 + Math.random() * 150
  });
}

// Update game
function update(dt) {
  // Gerak player
  if (keys['ArrowLeft'] && player.x > 0) player.x -= 300 * dt;
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 300 * dt;
  
  // Spawn musuh
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnEnemy();
    spawnTimer = 0.5 + Math.random() * 0.5;
  }
  
  // Update musuh
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.y += enemy.speed * dt;
    
    // Hapus yang keluar layar
    if (enemy.y > canvas.height) {
      enemies.splice(i, 1);
      score += 10;
    }
    
    // Deteksi tabrakan
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
  
  // Update HUD
  document.getElementById('score').textContent = `SKOR: ${score}`;
  document.getElementById('lives').textContent = '❤️'.repeat(Math.max(0, lives));
}

// Gambar
function draw() {
  // Background
  ctx.fillStyle = '#050805';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Grid
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
  
  // Player
  ctx.fillStyle = '#39ff6a';
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#39ff6a';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(player.x, player.y, player.width, player.height);
  
  // Musuh
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ff3355';
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
  
  ctx.shadowBlur = 0;
}

// Game loop
function gameLoop(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;
  
  if (!gameOver) {
    update(dt);
    draw();
  }
  
  requestAnimationFrame(gameLoop);
}

// Restart
function restartGame() {
  score = 0;
  lives = 3;
  gameOver = false;
  enemies = [];
  spawnTimer = 0;
  document.getElementById('gameOverlay').style.display = 'none';
  canvas.focus();
}

// Mulai
canvas.focus();
requestAnimationFrame(gameLoop);
