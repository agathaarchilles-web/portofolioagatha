const guessInput = document.getElementById('guessInput');
const attemptsEl = document.getElementById('attempts');
const scoreEl = document.getElementById('score');
const hintEl = document.getElementById('hint');
const lowRange = document.getElementById('lowRange');
const highRange = document.getElementById('highRange');
const guessHistory = document.getElementById('guessHistory');
const gameOverlay = document.getElementById('gameOverlay');

let secretNumber = 0;
let attempts = 0;
let score = 0;
let low = 1;
let high = 100;
let gameOver = false;

// Mulai game baru
function newGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  low = 1;
  high = 100;
  gameOver = false;
  attemptsEl.textContent = '0';
  hintEl.textContent = 'Mulai menebak!';
  lowRange.textContent = '1';
  highRange.textContent = '100';
  guessHistory.innerHTML = '';
  guessInput.value = '';
  guessInput.disabled = false;
  guessInput.focus();
}

// Buat tebakan
function makeGuess() {
  if (gameOver) return;
  
  const guess = parseInt(guessInput.value);
  if (isNaN(guess) || guess < 1 || guess > 100) {
    hintEl.textContent = '⚠️ Masukkan angka 1-100!';
    return;
  }
  
  attempts++;
  attemptsEl.textContent = attempts;
  
  // Tambah ke riwayat
  const historyItem = document.createElement('span');
  historyItem.className = 'guess-item';
  historyItem.textContent = guess;
  
  if (guess === secretNumber) {
    // BENAR!
    historyItem.classList.add('correct');
    score += Math.max(10, 100 - attempts * 5);
    scoreEl.textContent = score;
    hintEl.textContent = '🎉 BENAR!';
    gameOver = true;
    guessInput.disabled = true;
    document.getElementById('answer').textContent = secretNumber;
    document.getElementById('finalAttempts').textContent = attempts;
    setTimeout(() => {
      gameOverlay.style.display = 'flex';
    }, 500);
  } else if (guess < secretNumber) {
    historyItem.classList.add('low');
    hintEl.textContent = '📈 Lebih besar!';
    low = Math.max(low, guess + 1);
    lowRange.textContent = low;
  } else {
    historyItem.classList.add('high');
    hintEl.textContent = '📉 Lebih kecil!';
    high = Math.min(high, guess - 1);
    highRange.textContent = high;
  }
  
  guessHistory.appendChild(historyItem);
  guessInput.value = '';
  guessInput.focus();
}

// Enter key
guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    makeGuess();
  }
});

// Restart
function restartGame() {
  gameOverlay.style.display = 'none';
  newGame();
}

// Mulai
newGame();