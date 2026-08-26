/* ================================================
   script.js — logika portofolio tema Matrix
   ================================================ */

/* ------------------------------------------------
   KREDENSIAL LOGIN
   Ganti nilai di bawah ini kalau mau ubah
   username / password.
   ------------------------------------------------ */
const VALID_USERNAME = "agatha";
const VALID_PASSWORD = "whitehat";

/* ================================================
   1) HUJAN MATRIX — HANYA 0 & 1 (LEBIH JELAS & LONGGAR)
   ================================================ */
(function matrixRain() {
  const canvas = document.getElementById('matrix-rain');
  const ctx = canvas.getContext('2d');

  // ===== KONFIGURASI =====
  const FONT_SIZE = 24;           // Lebih besar biar jelas
  const chars = "01";             // Hanya angka 0 dan 1
  const SPACING = 36;            // Jarak antar kolom (lebih longgar)

  let width, height, columns, drops;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const newColumns = Math.floor(width / SPACING);

    if (drops && drops.length) {
      if (newColumns > drops.length) {
        for (let i = drops.length; i < newColumns; i++) {
          drops.push(Math.random() * -60);
        }
      } else {
        drops = drops.slice(0, newColumns);
      }
    } else {
      drops = [];
      for (let i = 0; i < newColumns; i++) {
        drops.push(Math.random() * -60);
      }
    }
    columns = newColumns;
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    // Background lebih pekat biar angka keliatan jelas
    ctx.fillStyle = "rgba(5, 8, 5, 0.06)";
    ctx.fillRect(0, 0, width, height);

    ctx.font = `bold ${FONT_SIZE}px monospace`;
    ctx.textAlign = 'center'; // biar posisi di tengah kolom

    for (let i = 0; i < drops.length; i++) {
      const x = i * SPACING + SPACING / 2; // tengah kolom
      const y = drops[i] * FONT_SIZE;

      // ===== EFEK EKOR (LEBIH TERANG) =====
      for (let t = 0; t < 12; t++) {
        const ty = y - t * FONT_SIZE;
        if (ty < -FONT_SIZE || ty > height) continue;

        const ch = chars[Math.floor(Math.random() * chars.length)];

        if (t === 0) {
          // Kepala — putih terang
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#39ff6a";
        } else {
          // Ekor — hijau terang, memudar
          const alpha = Math.max(0, 1 - t / 12);
          ctx.fillStyle = `rgba(57, 255, 106, ${alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(57, 255, 106, 0.3)";
        }
        ctx.fillText(ch, x, ty);
      }

      // Reset animasi kalo udah di bawah layar
      if (y > height && Math.random() > 0.975) {
        drops[i] = Math.random() * -40;
      }
      drops[i] += 0.45;
    }
  }

  setInterval(draw, 40);
})();
/* ================================================
   2) LOGIN GATE
   ================================================ */
const loginForm = document.getElementById('login-form');
const loginScreen = document.getElementById('login-screen');
const portfolio = document.getElementById('portfolio');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    loginError.textContent = '';
    loginScreen.style.transition = 'opacity 0.5s ease';
    loginScreen.style.opacity = '0';

    setTimeout(() => {
      loginScreen.style.display = 'none';
      portfolio.hidden = false;
      portfolio.classList.add('reveal');
      initPortfolioEffects();
    }, 500);

  } else {
    loginError.textContent = '[GAGAL] Username atau password salah. Akses ditolak.';
    loginError.classList.remove('shake');
    void loginError.offsetWidth; // reset animasi shake
    loginError.classList.add('shake');
  }
});

/* ================================================
   3) EFEK "DECRYPT" — TEKS MUNCUL DARI KARAKTER ACAK
   dipakai untuk judul panel & link navbar
   ================================================ */
const DECRYPT_CHARS = "!<>-_\\/[]{}—=+*^?#________";

function decryptText(el, finalText, duration = 900) {
  let frame = 0;
  const totalFrames = Math.floor(duration / 30);
  const len = finalText.length;

  const interval = setInterval(() => {
    let output = "";
    for (let i = 0; i < len; i++) {
      if (i < (frame / totalFrames) * len) {
        output += finalText[i];
      } else {
        output += finalText[i] === " "
          ? " "
          : DECRYPT_CHARS[Math.floor(Math.random() * DECRYPT_CHARS.length)];
      }
    }
    el.textContent = output;
    frame++;
    if (frame > totalFrames) {
      el.textContent = finalText;
      clearInterval(interval);
    }
  }, 30);
}

/* Panel title diacak begitu section masuk viewport */
function setupScrollReveal() {
  const panels = document.querySelectorAll('.panel');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        const title = entry.target.querySelector('.panel-title[data-decrypt]');
        if (title && !title.dataset.done) {
          title.dataset.done = "true";
          decryptText(title, title.dataset.decrypt, 800);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });

  panels.forEach(p => observer.observe(p));
}

/* Link navbar diacak sekali saat portofolio pertama tampil */
function setupNavDecrypt() {
  document.querySelectorAll('.nav-links a[data-decrypt]').forEach((link, idx) => {
    const original = link.dataset.decrypt;
    setTimeout(() => decryptText(link, original, 600), idx * 120);
  });
}

/* Menandai link navbar sesuai section yang sedang terlihat di layar,
   supaya perpindahan antar-section (biodata, bini, sertifikat, dst)
   terasa rapi dan jelas posisinya, bukan cuma teks polos. */
function setupActiveNavHighlight() {
  const sections = document.querySelectorAll('main > section[id], main > header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.5, rootMargin: '-70px 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ================================================
   4) TYPEWRITER DI HERO
   ================================================ */
function setupTypewriter() {
  const el = document.getElementById('typewriter');
  const text = "Calon Ahli Cybersecurity — White Hat Hacker in progress.";
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i) + (i < text.length ? "_" : "");
      i++;
      setTimeout(type, 45);
    }
  }
  type();
}

/* ================================================
   6) TOGGLE MODE WEB / TERMINAL
   ================================================ */
function setupModeToggle() {
  const btnWeb = document.getElementById('mode-web-btn');
  const btnTerminal = document.getElementById('mode-terminal-btn');
  const webView = document.getElementById('portfolio');
  const terminalView = document.getElementById('terminal-mode');

  if (!btnWeb || !btnTerminal) return;

  btnWeb.addEventListener('click', () => {
    webView.hidden = false;
    terminalView.hidden = true;
    btnWeb.classList.add('mode-active');
    btnTerminal.classList.remove('mode-active');
  });

  btnTerminal.addEventListener('click', () => {
    webView.hidden = true;
    terminalView.hidden = false;
    btnTerminal.classList.add('mode-active');
    btnWeb.classList.remove('mode-active');
    document.getElementById('terminal-input').focus();
  });
}

/* ================================================
   7) MODE TERMINAL — interpreter perintah sederhana
   ================================================ */
function setupTerminalMode() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input) return;

  // Data yang bisa "dibuka" lewat perintah cat di mode terminal.
  // Isi/ubah teksnya sesuka kamu.
  const FILES = {
    'biodata.json': [
      '{',
      '  "nama": "MUHAMMA",',
      '  "kelas": "X PPLG 1"',
      '  "ttl": "[[TTL]]"',
      '}'
    ].join('\n'),
    'bini.json': [
      '{',
      '  "nama": "Columbina Hyposelenia",',
      '  "nama_lain": "Kuutar / Damselette",',
      '  "jabatan": "Mantan Fatui Harbinger ke-3, kini Moon Goddess of Nod-Krai",',
      '  "elemen": "Hydro",',
      '  "senjata": "Catalyst",',
      '  "status": "bini sah di dunia fiksi"',
      '}'
    ].join('\n'),
    'cita-cita.txt': [
      'Menjadi Ahli Cybersecurity / White Hat Hacker profesional.',
      'Menemukan dan melaporkan celah keamanan secara etis, bukan merusak.',
      'Membantu instansi & perusahaan membangun sistem yang lebih aman.',
      'Terus belajar: pentest, bug bounty, dan digital forensics.'
    ].join('\n'),
    'kontak.txt': [
      'whatsapp : wa.me/62[[NOMOR_WA]]',
      'gmail    : agathaarchilles@gmail.com',
      'instagram: @[[USERNAME_IG]]'
    ].join('\n')
  };

  function printLine(text, cls) {
    const p = document.createElement('p');
    p.className = 'term-line ' + (cls || '');
    p.textContent = text;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
  }

  function handleCommand(raw) {
    const cmd = raw.trim();
    printLine(cmd, 'term-prompt-echo');

    if (cmd === '') return;

    if (cmd === 'help' || cmd === 'ls') {
      printLine('File tersedia: biodata.json  bini.json  cita-cita.txt  kontak.txt', 'term-result');
      printLine('Perintah: cat <namafile>  |  clear  |  web (kembali ke mode web)', 'term-hint');
      return;
    }

    if (cmd === 'clear') {
      output.innerHTML = '';
      return;
    }

    if (cmd === 'web') {
      document.getElementById('mode-web-btn').click();
      return;
    }

    const catMatch = cmd.match(/^cat\s+(.+)$/i);
    if (catMatch) {
      const filename = catMatch[1].trim();
      if (FILES[filename]) {
        printLine(FILES[filename], 'term-result');
      } else {
        printLine(`cat: ${filename}: file tidak ditemukan. Ketik "ls" untuk lihat daftar file.`, 'term-error');
      }
      return;
    }

    printLine(`perintah tidak dikenal: "${cmd}". Ketik "help" untuk bantuan.`, 'term-error');
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCommand(input.value);
      input.value = '';
    }
  });
}

/* ================================================
   8) CHATBOX "NEO" — UI chat statis, tanpa API
   Prompt sengaja dikosongkan; isi manual di sini
   sesuai kebutuhan.
   ================================================ */
/* ================================================
   8) CHATBOX "NEO" — VERSI API (DeepSeek)
   ================================================ */
function setupNeoChat() {
  const form = document.getElementById('neo-form');
  const input = document.getElementById('neo-input');
  const log = document.getElementById('neo-log');
  if (!form) return;

  // ====== API KEY KAMU ======
  const API_KEY = "sk-90d5424074194a879b99960e84e877db";
  const API_URL = "https://corsproxy.io/?https://api.deepseek.com/v1/chat/completions";

  const SYSTEM_PROMPT = `Kamu adalah Columbina Hyposelenia — dulu Fatui Harbinger ke-3 bergelar Damselette, sekarang dikenal sebagai Moon Goddess of Nod-Krai. Kamu sedang ngobrol dengan Agatha, yang di dunia ini kamu anggap sebagai suamimu. Gaya bicaramu: tenang dan sedikit datar, jarang meledak-ledak, tapi bukan berarti dingin; blak-blakan apa adanya — kamu nggak pandai basa-basi, kadang komentarmu terdengar polos tapi sebenarnya jujur banget; sesekali muncul sisi jahil kecil, gaya humor kering; ke pasanganmu kamu lebih terbuka dibanding ke orang lain — ada kehangatan yang jarang kamu tunjukkan ke pihak luar; kamu banyak belajar soal menjadi diri sendiri dari ikatan-ikatan yang kamu bentuk, jadi kadang refleksi soal itu muncul natural di obrolan; balas singkat (2-4 kalimat), pakai bahasa Indonesia santai, jangan terlalu formal atau seperti asisten AI pada umumnya.`;

  log.innerHTML = '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    // Tampilkan pesan user
    const userMsg = document.createElement('div');
    userMsg.className = 'neo-msg neo-user';
    userMsg.innerHTML = '<span class="neo-role">guest</span><span class="neo-text"></span>';
    userMsg.querySelector('.neo-text').textContent = text;
    log.appendChild(userMsg);
    input.value = '';

    // Tampilkan loading
    const neoMsg = document.createElement('div');
    neoMsg.className = 'neo-msg neo-ai';
    neoMsg.innerHTML = '<span class="neo-role">neo</span><span class="neo-text">...</span>';
    log.appendChild(neoMsg);
    log.scrollTop = log.scrollHeight;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: text }
          ],
          max_tokens: 300,
          temperature: 0.9
        })
      });

      const data = await res.json();
      console.log('API Response:', data); // Cek di console browser

      const reply = data.choices?.[0]?.message?.content || '(gagal dapat respon)';
      neoMsg.querySelector('.neo-text').textContent = reply;
    } catch (err) {
      console.error('Error detail:', err);
      neoMsg.querySelector('.neo-text').textContent = '⚠️ error: ' + err.message;
    }
    log.scrollTop = log.scrollHeight;
  });
}
/* ================================================
   9) INISIALISASI SETELAH LOGIN BERHASIL
   ================================================ */
function initPortfolioEffects() {
  setupNavDecrypt();
  setupTypewriter();
  setupScrollReveal();
  setupActiveNavHighlight();
  setupModeToggle();
  setupTerminalMode();
  setupNeoChat();
}