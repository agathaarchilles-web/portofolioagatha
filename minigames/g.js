const cipherText = document.getElementById('cipherText');
const answerInput = document.getElementById('answerInput');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const gameOverlay = document.getElementById('gameOverlay');

const words = [
  "HACKER", "MATRIX", "CYBER", "SECURITY", "NEURAL",
  "NETWORK", "SYSTEM", "PASSWORD", "FIREWALL", "ENCRYPT",
  "PROTOCOL", "DATABASE", "TOKEN", "BINARY", "CODING"
];

let score = 0;
let level = 1;
let currentWord = '';
let currentCipher = '';
let gameOver = false;
let maxLevel = 10;

// Enkripsi Caesar
function encryptCaesar(text, shift) {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) { // A-Z
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }
    return char;
  }).join('');
}

// Buat pertanyaan baru
function newQuestion() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  const shift = Math.floor(Math.random() * 10) + 1; // Shift 1-10
  currentCipher = encryptCaesar(currentWord, shift);
  cipherText.textContent = currentCipher;
  answerInput.value = '';
  answerInput.focus();
}

// Cek jawaban
function checkAnswer() {
  if (gameOver) return;
  
  const answer = answerInput.value.trim().toUpperCase();
  
  if (answer === currentWord) {
    score += 10 * level;
    scoreEl.textContent = score;
    level++;
    levelEl.textContent = level;
    
    if (level > maxLevel) {
      gameOver = true;
      document.getElementById('finalScore').textContent = score;
      gameOverlay.style.display = 'flex';
    } else {
      newQuestion();
    }
  } else {
    // Beri feedback salah
    cipherText.style.color = '#ff3355';
    setTimeout(() => {
      cipherText.style.color = '#ffffff';
    }, 500);
  }
}

// Enter key
answerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    checkAnswer();
  }
});

// Restart
function restartGame() {
  gameOver = false;
  score = 0;
  level = 1;
  scoreEl.textContent = '0';
  levelEl.textContent = '1';
  gameOverlay.style.display = 'none';
  newQuestion();
}

// Mulai
newQuestion();