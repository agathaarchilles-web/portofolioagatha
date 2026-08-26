const reactionArea = document.getElementById('reactionArea');
const avgTimeEl = document.getElementById('avgTime');
const bestTimeEl = document.getElementById('bestTime');
const attemptsEl = document.getElementById('attempts');
const gameOverlay = document.getElementById('gameOverlay');

let state = 'idle'; // idle, waiting, ready, too-soon, result
let waitTimer = null;
let startTime = 0;
let times = [];
let maxAttempts = 5;

// Klik area
reactionArea.addEventListener('click', () => {
  switch(state) {
    case 'idle':
    case 'result':
      startRound();
      break;
    case 'waiting':
      clearTimeout(waitTimer);
      tooSoon();
      break;
    case 'ready':
      const reactionTime = Date.now() - startTime;
      showResult(reactionTime);
      break;
  }
});

// Mulai ronde
function startRound() {
  state = 'waiting';
  reactionArea.className = 'reaction-area waiting';
  reactionArea.textContent = 'Tunggu...';
  
  // Tunggu 1-3 detik acak
  const delay = 1000 + Math.random() * 2000;
  waitTimer = setTimeout(() => {
    state = 'ready';
    reactionArea.className = 'reaction-area ready';
    reactionArea.textContent = 'KLIK!';
    startTime = Date.now();
  }, delay);
}

// Terlalu cepat
function tooSoon() {
  state = 'too-soon';
  reactionArea.className = 'reaction-area too-soon';
  reactionArea.textContent = 'Terlalu cepat! Klik untuk coba lagi';
}

// Tampilkan hasil
function showResult(time) {
  state = 'result';
  reactionArea.className = 'reaction-area result';
  reactionArea.textContent = `${time} ms`;
  
  times.push(time);
  attemptsEl.textContent = times.length;
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  avgTimeEl.textContent = Math.round(avg);
  
  const best = Math.min(...times);
  bestTimeEl.textContent = best;
  
  // Jika sudah 5 percobaan
  if (times.length >= maxAttempts) {
    setTimeout(() => {
      document.getElementById('finalAvg').textContent = Math.round(avg);
      document.getElementById('finalBest').textContent = best;
      gameOverlay.style.display = 'flex';
    }, 1000);
  }
}

// Restart
function restartGame() {
  times = [];
  state = 'idle';
  reactionArea.className = 'reaction-area';
  reactionArea.textContent = 'Klik untuk mulai';
  avgTimeEl.textContent = '-';
  bestTimeEl.textContent = '-';
  attemptsEl.textContent = '0';
  gameOverlay.style.display = 'none';
}