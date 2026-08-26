/* ================================================
   kalkulator.js — Logika Kalkulator Matrix
   ================================================ */

// ================= KALKULATOR BIASA (EXPERT) =================
let display = document.getElementById('calcDisplay');
let currentInput = '';

function tekan(val) {
  const funcs = ['sin(', 'cos(', 'tan(', 'log(', 'sqrt('];
  if (funcs.includes(val)) {
    currentInput += val;
    display.value = currentInput;
    return;
  }
  if (val === 'Math.PI') {
    currentInput += Math.PI;
    display.value = currentInput;
    return;
  }
  if (val === 'Math.E') {
    currentInput += Math.E;
    display.value = currentInput;
    return;
  }
  if (val === 'Math.LN') {
    currentInput += 'Math.log(';
    display.value = currentInput;
    return;
  }
  if (val === '**') {
    currentInput += '**';
    display.value = currentInput;
    return;
  }
  currentInput += val;
  display.value = currentInput;
}

function clearDisplay() {
  currentInput = '';
  display.value = '0';
}

function hapusSatu() {
  currentInput = currentInput.slice(0, -1);
  display.value = currentInput || '0';
}

function faktorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let hasil = 1;
  for (let i = 2; i <= n; i++) hasil *= i;
  return hasil;
}

function hasil() {
  try {
    let expr = currentInput;

    // 1. Ganti simbol operasi
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

    // 2. Faktorial
    expr = expr.replace(/(\d+)!/g, (match, num) => faktorial(parseInt(num)));

    // 3. Persen
    expr = expr.replace(/(\d+)%/g, (match, num) => parseFloat(num) / 100);

    // 4. SIN — ubah sin(30) jadi Math.sin(30 * Math.PI / 180)
    expr = expr.replace(/sin\(/g, 'Math.sin(DEG2RAD(');

    // 5. COS
    expr = expr.replace(/cos\(/g, 'Math.cos(DEG2RAD(');

    // 6. TAN
    expr = expr.replace(/tan\(/g, 'Math.tan(DEG2RAD(');

    // 7. LOG (basis 10)
    expr = expr.replace(/log\(/g, 'Math.log10(');

    // 8. LN (log natural) — udah pake Math.log(
    // 9. AKAR
    expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');

    // 10. PANGKAT ** udah otomatis

    // 11. FUNGSI KONVERSI DERAJAT KE RADIAN
    const DEG2RAD = (deg) => deg * Math.PI / 180;

    // 12. Evaluasi
    const result = new Function(`"use strict"; return (${expr})`)();

    if (result === Infinity || isNaN(result)) {
      display.value = 'Error';
      currentInput = '';
      return;
    }

    const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));
    display.value = formatted;
    currentInput = String(formatted);

  } catch (e) {
    display.value = 'Error';
    currentInput = '';
  }
}

// ================= KALKULATOR SUHU =================
function konversiSuhu() {
  const input = parseFloat(document.getElementById('suhuInput').value);
  const dari = document.getElementById('suhuDari').value;
  const ke = document.getElementById('suhuKe').value;
  if (isNaN(input)) {
    document.getElementById('suhuHasil').value = 'Masukkan angka!';
    return;
  }
  let celsius;
  switch (dari) {
    case 'C': celsius = input; break;
    case 'F': celsius = (input - 32) * 5 / 9; break;
    case 'K': celsius = input - 273.15; break;
    case 'R': celsius = input * 5 / 4; break;
    default: celsius = input;
  }
  let hasil;
  switch (ke) {
    case 'C': hasil = celsius; break;
    case 'F': hasil = (celsius * 9 / 5) + 32; break;
    case 'K': hasil = celsius + 273.15; break;
    case 'R': hasil = celsius * 4 / 5; break;
    default: hasil = celsius;
  }
  document.getElementById('suhuHasil').value = hasil.toFixed(2);
}

// ================= KALKULATOR UKURAN =================
const ukuranFaktor = { km: 1000, m: 1, cm: 0.01, mm: 0.001, mi: 1609.34, ft: 0.3048, in: 0.0254 };

function konversiUkuran() {
  const input = parseFloat(document.getElementById('ukuranInput').value);
  const dari = document.getElementById('ukuranDari').value;
  const ke = document.getElementById('ukuranKe').value;
  if (isNaN(input)) {
    document.getElementById('ukuranHasil').value = 'Masukkan angka!';
    return;
  }
  const dalamMeter = input * ukuranFaktor[dari];
  const hasil = dalamMeter / ukuranFaktor[ke];
  document.getElementById('ukuranHasil').value = hasil.toFixed(4);
}

// ================= KALKULATOR PEMROGRAMAN =================
function konversiProgram() {
  const input = document.getElementById('progInput').value.trim();
  const dari = parseInt(document.getElementById('progDari').value);
  if (!input) {
    document.getElementById('hasilDesimal').textContent = '-';
    document.getElementById('hasilBiner').textContent = '-';
    document.getElementById('hasilOktal').textContent = '-';
    document.getElementById('hasilHeks').textContent = '-';
    return;
  }
  let desimal;
  try {
    desimal = parseInt(input, dari);
    if (isNaN(desimal)) throw new Error();
  } catch {
    document.getElementById('hasilDesimal').textContent = '❌ Error';
    document.getElementById('hasilBiner').textContent = '❌ Error';
    document.getElementById('hasilOktal').textContent = '❌ Error';
    document.getElementById('hasilHeks').textContent = '❌ Error';
    return;
  }
  document.getElementById('hasilDesimal').textContent = desimal;
  document.getElementById('hasilBiner').textContent = desimal.toString(2);
  document.getElementById('hasilOktal').textContent = desimal.toString(8);
  document.getElementById('hasilHeks').textContent = desimal.toString(16).toUpperCase();
}

// ================= TAB =================
function gantiTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.querySelector(`.tab-btn[data-tab="${id}"]`).classList.add('active');
}

// ================= HUJAN MATRIX =================
(function matrixRain() {
  const canvas = document.getElementById('matrix-rain');
  const ctx = canvas.getContext('2d');
  const FONT_SIZE = 20;
  const chars = "01";
  const SPACING = 30;
  let width, height, columns, drops;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const newColumns = Math.floor(width / SPACING);
    if (drops && drops.length) {
      if (newColumns > drops.length) {
        for (let i = drops.length; i < newColumns; i++) drops.push(Math.random() * -60);
      } else {
        drops = drops.slice(0, newColumns);
      }
    } else {
      drops = [];
      for (let i = 0; i < newColumns; i++) drops.push(Math.random() * -60);
    }
    columns = newColumns;
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.fillStyle = "rgba(5, 8, 5, 0.06)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `bold ${FONT_SIZE}px monospace`;
    ctx.textAlign = 'center';
    for (let i = 0; i < drops.length; i++) {
      const x = i * SPACING + SPACING / 2;
      const y = drops[i] * FONT_SIZE;
      for (let t = 0; t < 10; t++) {
        const ty = y - t * FONT_SIZE;
        if (ty < -FONT_SIZE || ty > height) continue;
        const ch = chars[Math.floor(Math.random() * chars.length)];
        if (t === 0) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#39ff6a";
        } else {
          const alpha = Math.max(0, 1 - t / 10);
          ctx.fillStyle = `rgba(57, 255, 106, ${alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(57, 255, 106, 0.2)";
        }
        ctx.fillText(ch, x, ty);
      }
      if (y > height && Math.random() > 0.975) drops[i] = Math.random() * -40;
      drops[i] += 0.45;
    }
  }
  setInterval(draw, 40);
})();

// ================= INIT =================
document.getElementById('tanggalHariIni').textContent =
  new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

konversiProgram();