const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const gameOverlay = document.getElementById('gameOverlay');

let score = 0;
let timeLeft = 30;
let gameOver = false;
let currentAnswer = 0;
let timerInterval = null;

// Buat pertanyaan baru
function newQuestion() {
  // Generate angka random 1-255
  const decimal = Math.floor(Math.random() * 255) + 1;
  const binary = decimal.toString(2).padStart(8, '0');
  
  questionEl.textContent = binary;
  currentAnswer = decimal;
  
  // Buat opsi
  const options = [decimal];
  while (options.length < 4) {
    const wrong = Math.floor(Math.random() * 255) + 1;
    if (!options.includes(wrong)) {
      options.push(wrong);
    }
  }
  
  // Acak opsi
  options.sort(() => Math.random() - 0.5);
  
  optionsEl.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => checkAnswer(opt, btn));
    optionsEl.appendChild(btn);
  });
}

// Cek jawaban
function checkAnswer(answer, btn) {
  if (gameOver) return;
  
  // Hilangkan semua styling
  document.querySelectorAll('.option-btn').forEach(b => {
    b.style.pointerEvents = 'none';
  });
  
  if (answer === currentAnswer) {
    btn.classList.add('correct');
    score += 10;
    scoreEl.textContent = score;
    
    // Pertanyaan baru setelah jeda
    setTimeout(newQuestion, 800);
  } else {
    btn.classList.add('wrong');
    
    // Tampilkan jawaban benar
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.textContent == currentAnswer) {
        b.classList.add('correct');
      }
    });
    
    // Pertanyaan baru setelah jeda
    setTimeout(newQuestion, 1000);
  }
}

// Timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver = true;
      document.getElementById('finalScore').textContent = score;
      gameOverlay.style.display = 'flex';
    }
  }, 1000);
}

// Restart
function restartGame() {
  gameOver = false;
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = '0';
  timerEl.textContent = '30';
  gameOverlay.style.display = 'none';
  clearInterval(timerInterval);
  startTimer();
  newQuestion();
}

// Mulai
startTimer();
newQuestion();