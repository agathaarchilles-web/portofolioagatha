const targetText = document.getElementById('targetText');
const typingInput = document.getElementById('typingInput');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const correctEl = document.getElementById('correct');
const wrongEl = document.getElementById('wrong');
const gameOverlay = document.getElementById('gameOverlay');

// Kumpulan kata-kata bahasa Indonesia
const kataKata = [
  "hack", "matrix", "cyber", "koding", "server", "data", "jaringan",
  "enam", "tujuh", "delapan", "sembilan", "sepuluh",
  "makan", "minum", "tidur", "belajar", "kerja", "main",
  "cepat", "lambat", "kuat", "lemah", "pintar", "bodoh",
  "hijau", "merah", "biru", "kuning", "hitam", "putih",
  "rumah", "sekolah", "kantor", "pasar", "kota", "desa",
  "kucing", "anjing", "burung", "ikan", "ular", "harimau",
  "senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu",
  "pagi", "siang", "sore", "malam", "subuh", "dini",
  "buku", "pensil", "kertas", "papan", "meja", "kursi",
  "indonesia", "jakarta", "bandung", "surabaya", "medan",
  "satu", "dua", "tiga", "empat", "lima",
  "api", "air", "angin", "tanah", "batu", "pasir",
  "sepeda", "motor", "mobil", "bus", "kereta", "pesawat",
  "bahagia", "sedih", "marah", "takut", "semangat",
  "bersih", "kotor", "panas", "dingin", "basah", "kering",
  "kiri", "kanan", "atas", "bawah", "depan", "belakang",
  "kamu", "aku", "dia", "kami", "mereka", "kita",
  "maju", "mundur", "berhenti", "jalan", "lari", "duduk",
  "terang", "gelap", "lembut", "keras", "halus", "kasar"
];

// Kalimat pendek dengan kata acak
const templateKalimat = [
  "kamu {kata} dan aku {kata}",
  "{kata} itu sangat {kata}",
  "belajar {kata} itu {kata}",
  "hari ini {kata} besok {kata}",
  "jangan {kata} terus {kata}",
  "aku suka {kata} kamu suka {kata}",
  "{kata} dan {kata} adalah {kata}",
  "di {kata} ada {kata}",
  "{kata} membuat aku {kata}",
  "kamu bisa {kata} dengan {kata}"
];

// Generate teks acak
function generateRandomText() {
  // Pilih template acak
  const template = templateKalimat[Math.floor(Math.random() * templateKalimat.length)];
  
  // Pilih kata acak untuk menggantikan placeholder
  let result = template;
  while (result.includes("{kata}")) {
    const randomKata = kataKata[Math.floor(Math.random() * kataKata.length)];
    result = result.replace("{kata}", randomKata);
  }
  
  return result;
}

let currentText = '';
let timeLeft = 60;
let gameOver = false;
let correctCount = 0;
let wrongCount = 0;
let startTime = null;
let timerInterval = null;

// Ambil teks baru
function getRandomText() {
  return generateRandomText();
}

// Tampilkan teks
function displayText(inputValue = '') {
  let html = '';
  for (let i = 0; i < currentText.length; i++) {
    if (i < inputValue.length) {
      if (inputValue[i] === currentText[i]) {
        html += `<span class="correct">${currentText[i]}</span>`;
      } else {
        html += `<span class="wrong">${currentText[i]}</span>`;
      }
    } else {
      html += currentText[i];
    }
  }
  targetText.innerHTML = html;
}

// Update stats
function updateStats() {
  const elapsed = (Date.now() - startTime) / 1000 / 60;
  if (elapsed > 0) {
    const wpm = Math.round((correctCount / 5) / elapsed);
    wpmEl.textContent = wpm;
  }
  correctEl.textContent = correctCount;
  wrongEl.textContent = wrongCount;
}

// Mulai game
function startGame() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver = true;
      document.getElementById('finalWpm').textContent = wpmEl.textContent;
      document.getElementById('finalCorrect').textContent = correctCount;
      document.getElementById('finalWrong').textContent = wrongCount;
      gameOverlay.style.display = 'flex';
      typingInput.disabled = true;
    }
  }, 1000);
}

// Input listener
typingInput.addEventListener('input', (e) => {
  if (gameOver) return;
  
  if (!startTime) {
    startGame();
  }
  
  const inputValue = e.target.value;
  displayText(inputValue);
  
  // Hitung benar & salah
  correctCount = 0;
  wrongCount = 0;
  for (let i = 0; i < inputValue.length; i++) {
    if (inputValue[i] === currentText[i]) {
      correctCount++;
    } else {
      wrongCount++;
    }
  }
  
  updateStats();
  
  // Jika selesai semua teks
  if (inputValue.length >= currentText.length) {
    typingInput.value = '';
    currentText = getRandomText();
    displayText();
  }
});

// Restart
function restartGame() {
  gameOver = false;
  timeLeft = 60;
  correctCount = 0;
  wrongCount = 0;
  startTime = null;
  typingInput.disabled = false;
  typingInput.value = '';
  timerEl.textContent = '60';
  wpmEl.textContent = '0';
  correctEl.textContent = '0';
  wrongEl.textContent = '0';
  gameOverlay.style.display = 'none';
  
  currentText = getRandomText();
  displayText();
  typingInput.focus();
}

// Mulai
currentText = getRandomText();
displayText();
typingInput.focus();