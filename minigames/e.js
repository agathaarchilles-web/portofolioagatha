const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fokus otomatis ke canvas
canvas.focus();

const gridSize = 20;
const tileCount = 20;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let level = 1;
let gameOver = false;
let speed = 150;
let lastTime = 0;

// Kontrol keyboard di canvas
canvas.addEventListener('keydown', (e) => {
  if (gameOver) return;
  
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
      if (direction.y !== 1) direction = { x: 0, y: -1 };
      e.preventDefault();
      break;
    case 'ArrowDown':
    case 's':
      if (direction.y !== -1) direction = { x: 0, y: 1 };
      e.preventDefault();
      break;
    case 'ArrowLeft':
    case 'a':
      if (direction.x !== 1) direction = { x: -1, y: 0 };
      e.preventDefault();
      break;
    case 'ArrowRight':
    case 'd':
      if (direction.x !== -1) direction = { x: 1, y: 0 };
      e.preventDefault();
      break;
  }
});

// Klik untuk fokus
canvas.addEventListener('click', () => {
  canvas.focus();
});

// Generate makanan
function generateFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

// Update
function update(dt) {
  // Gerakan
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  
  // Cek tabrakan dinding
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver = true;
    document.getElementById('gameOverlay').style.display = 'flex';
    document.getElementById('finalScore').textContent = score;
    return;
  }
  
  // Cek tabrakan tubuh
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver = true;
    document.getElementById('gameOverlay').style.display = 'flex';
    document.getElementById('finalScore').textContent = score;
    return;
  }
  
  snake.unshift(head);
  
  // Makan makanan
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById('score').textContent = score;
    
    // Naik level
    if (score % 50 === 0) {
      level++;
      document.getElementById('level').textContent = level;
      speed = Math.max(80, speed - 10);
    }
    
    generateFood();
  } else {
    snake.pop();
  }
}

// Gambar
function draw() {
  ctx.fillStyle = '#050805';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Grid
  ctx.strokeStyle = '#0d3b1f';
  ctx.lineWidth = 1;
  for (let i = 0; i <= tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
  
  // Makanan
  ctx.fillStyle = '#ff3355';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ff3355';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  
  // Ular
  snake.forEach((segment, i) => {
    if (i === 0) {
      ctx.fillStyle = '#39ff6a';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#39ff6a';
    } else {
      const alpha = Math.max(0.3, 1 - i / snake.length);
      ctx.fillStyle = `rgba(57, 255, 106, ${alpha})`;
      ctx.shadowBlur = 5;
    }
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });
  
  ctx.shadowBlur = 0;
}

// Game loop
let lastFrame = 0;

function gameLoop(time) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;
  
  if (!gameOver) {
    if (time - (lastFrame || 0) >= speed) {
      update(dt);
      draw();
      lastFrame = time;
    }
  }
  
  requestAnimationFrame(gameLoop);
}

// Restart
function restartGame() {
  gameOver = false;
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  score = 0;
  level = 1;
  speed = 150;
  document.getElementById('score').textContent = '0';
  document.getElementById('level').textContent = '1';
  generateFood();
  document.getElementById('gameOverlay').style.display = 'none';
  canvas.focus();
}

// Mulai
canvas.focus();
generateFood();
requestAnimationFrame(gameLoop);