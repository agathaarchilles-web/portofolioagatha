const grid = document.getElementById('grid');
const levelEl = document.getElementById('level');
const scoreEl = document.getElementById('score');
const gameOverlay = document.getElementById('gameOverlay');

let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let gameOver = false;
let acceptingInput = false;

// Buat grid
function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.index = i;
    cell.addEventListener('click', () => handleCellClick(i));
    grid.appendChild(cell);
  }
}

// Tambah urutan baru
function addToSequence() {
  const random = Math.floor(Math.random() * 9);
  sequence.push(random);
}

// Tampilkan urutan
async function showSequence() {
  acceptingInput = false;
  for (let i = 0; i < sequence.length; i++) {
    const cell = grid.children[sequence[i]];
    cell.classList.add('active');
    await new Promise(resolve => setTimeout(resolve, 500));
    cell.classList.remove('active');
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  acceptingInput = true;
}

// Handle klik sel
function handleCellClick(index) {
  if (!acceptingInput || gameOver) return;
  
  const cell = grid.children[index];
  cell.classList.add('active');
  setTimeout(() => cell.classList.remove('active'), 200);
  
  playerSequence.push(index);
  
  // Cek apakah benar
  if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
    gameOver = true;
    document.getElementById('finalScore').textContent = score;
    gameOverlay.style.display = 'flex';
    return;
  }
  
  // Jika selesai urutan
  if (playerSequence.length === sequence.length) {
    score += 10 * level;
    scoreEl.textContent = score;
    level++;
    levelEl.textContent = level;
    playerSequence = [];
    addToSequence();
    setTimeout(showSequence, 500);
  }
}

// Restart
function restartGame() {
  gameOver = false;
  sequence = [];
  playerSequence = [];
  level = 1;
  score = 0;
  levelEl.textContent = level;
  scoreEl.textContent = score;
  gameOverlay.style.display = 'none';
  
  // Mulai
  addToSequence();
  showSequence();
}

// Inisialisasi
createGrid();
addToSequence();
showSequence();