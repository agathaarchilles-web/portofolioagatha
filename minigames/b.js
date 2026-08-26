/* ================================================
   b.js — HACKER TYPER (FIXED: Bisa Ngetik)
   ================================================ */

const gameContainer = document.getElementById('gameContainer');
const hackOutput = document.getElementById('hackOutput');
const hackScreen = document.getElementById('hackScreen');
const wordCountEl = document.getElementById('wordCount');
const wpmEl = document.getElementById('wpm');
const timerEl = document.getElementById('timer');
const gameOverlay = document.getElementById('gameOverlay');

const hackTexts = [
  "ACCESSING MAINFRAME...\n",
  "INJECTING PAYLOAD...\n",
  "BYPASSING FIREWALL...\n",
  "DECRYPTING DATA...\n",
  "HACKING NASA...\n",
  "LOADING MALWARE...\n",
  "BREACHING SECURITY...\n",
  "EXECUTING EXPLOIT...\n",
  "TRACING IP ADDRESS...\n",
  "STEALING COOKIES...\n",
  "CRACKING PASSWORD...\n",
  "ENCRYPTING FILES...\n",
  "DOWNLOADING DATA...\n",
  "UPLOADING VIRUS...\n",
  "DELETING LOGS...\n"
];

let currentText = '';
let wordCount = 0;
let startTime = null;
let timeLeft = 30;
let gameOver = false;
let timerInterval = null;

// Fokus otomatis ke container
gameContainer.focus();

// Tambah teks acak
function addRandomText() {
  const random = hackTexts[Math.floor(Math.random() * hackTexts.length)];
  currentText += random;
  hackOutput.textContent = currentText;
  hackScreen.scrollTop = hackScreen.scrollHeight;
}

// Hitung WPM
function updateStats() {
  if (!startTime) return;
  const elapsed = (Date.now() - startTime) / 1000 / 60; // menit
  if (elapsed > 0) {
    const wpm = Math.round(wordCount / elapsed);
    wpmEl.textContent = wpm;
  }
  wordCountEl.textContent = wordCount;
}

// Mulai game
function startGame() {
  startTime = Date.now();
  timeLeft = 30;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver = true;
      document.getElementById('finalWords').textContent = wordCount;
      document.getElementById('finalWpm').textContent = wpmEl.textContent;
      gameOverlay.style.display = 'flex';
    }
  }, 1000);
}

// Event listener keyboard di container
gameContainer.addEventListener('keydown', (e) => {
  if (gameOver) return;
  
  if (!startTime) {
    startGame();
  }
  
  if (e.key.length === 1) {
    wordCount++;
    addRandomText();
    updateStats();
  }
});

// Klik untuk fokus
gameContainer.addEventListener('click', () => {
  gameContainer.focus();
});

// Restart
function restartGame() {
  gameOver = false;
  wordCount = 0;
  currentText = '';
  startTime = null;
  timeLeft = 30;
  hackOutput.textContent = '';
  wordCountEl.textContent = '0';
  wpmEl.textContent = '0';
  timerEl.textContent = '30';
  document.getElementById('finalWords').textContent = '0';
  document.getElementById('finalWpm').textContent = '0';
  gameOverlay.style.display = 'none';
  gameContainer.focus();
}

// Inisialisasi
gameContainer.focus();