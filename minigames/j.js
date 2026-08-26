const mineGrid = document.getElementById('mineGrid');
const flagCountEl = document.getElementById('flagCount');
const scoreEl = document.getElementById('score');
const gameOverlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');

const GRID_SIZE = 5;
const MINE_COUNT = 5;

let grid = [];
let flags = 0;
let revealed = 0;
let gameOver = false;
let score = 0;

// Buat grid baru
function createGrid() {
  grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = {
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0
      };
    }
  }
  
  // Tempatkan ranjau
  let placed = 0;
  while (placed < MINE_COUNT) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!grid[x][y].mine) {
      grid[x][y].mine = true;
      placed++;
    }
  }
  
  // Hitung ranjau tetangga
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (!grid[i][j].mine) {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = i + dx;
            const ny = j + dy;
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && grid[nx][ny].mine) {
              count++;
            }
          }
        }
        grid[i][j].adjacent = count;
      }
    }
  }
}

// Render grid
function renderGrid() {
  mineGrid.innerHTML = '';
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = document.createElement('div');
      cell.className = 'mine-cell';
      cell.dataset.x = i;
      cell.dataset.y = j;
      
      if (grid[i][j].revealed) {
        cell.classList.add('revealed');
        if (grid[i][j].mine) {
          cell.classList.add('mine');
          cell.textContent = '💣';
        } else if (grid[i][j].adjacent > 0) {
          cell.textContent = grid[i][j].adjacent;
          cell.style.color = ['#35c1ff', '#39ff6a', '#ffd700', '#ff3355'][grid[i][j].adjacent - 1] || '#eafff0';
        }
      } else if (grid[i][j].flagged) {
        cell.classList.add('flagged');
        cell.textContent = '🚩';
      }
      
      cell.addEventListener('click', () => revealCell(i, j));
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(i, j);
      });
      
      mineGrid.appendChild(cell);
    }
  }
}

// Reveal cell
function revealCell(x, y) {
  if (gameOver || grid[x][y].revealed || grid[x][y].flagged) return;
  
  if (grid[x][y].mine) {
    // Kena ranjau
    gameOver = true;
    overlayTitle.textContent = '💥 GAME OVER';
    overlayMessage.textContent = 'Kena ranjau!';
    gameOverlay.style.display = 'flex';
    
    // Reveal semua ranjau
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j].mine) {
          grid[i][j].revealed = true;
        }
      }
    }
    renderGrid();
    return;
  }
  
  // Reveal cell
  grid[x][y].revealed = true;
  revealed++;
  score += 10;
  scoreEl.textContent = score;
  
  // Flood fill jika 0
  if (grid[x][y].adjacent === 0) {
    floodFill(x, y);
  }
  
  renderGrid();
  
  // Cek menang
  if (revealed === GRID_SIZE * GRID_SIZE - MINE_COUNT) {
    gameOver = true;
    overlayTitle.textContent = '🏆 MENANG!';
    overlayMessage.textContent = 'Semua ranjau ditemukan!';
    gameOverlay.style.display = 'flex';
  }
}

// Flood fill
function floodFill(x, y) {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && !grid[nx][ny].revealed && !grid[nx][ny].mine && !grid[nx][ny].flagged) {
        grid[nx][ny].revealed = true;
        revealed++;
        if (grid[nx][ny].adjacent === 0) {
          floodFill(nx, ny);
        }
      }
    }
  }
}

// Toggle flag
function toggleFlag(x, y) {
  if (gameOver || grid[x][y].revealed) return;
  
  grid[x][y].flagged = !grid[x][y].flagged;
  flags = grid.flat().filter(cell => cell.flagged).length;
  flagCountEl.textContent = MINE_COUNT - flags;
  renderGrid();
}

// Restart
function restartGame() {
  gameOver = false;
  flags = 0;
  revealed = 0;
  score = 0;
  scoreEl.textContent = '0';
  flagCountEl.textContent = MINE_COUNT;
  gameOverlay.style.display = 'none';
  createGrid();
  renderGrid();
}

// Mulai
createGrid();
renderGrid();