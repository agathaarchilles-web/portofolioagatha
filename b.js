/* ================================================
   b.js — Logika Catatan Kantong
   ================================================ */

// ================= DATA =================
function ambilData() {
  const raw = localStorage.getItem('catatanKantong');
  if (!raw) return { uang: [], kuotaAwal: null, kuotaLog: [] };
  return JSON.parse(raw);
}
function simpanData(d) {
  localStorage.setItem('catatanKantong', JSON.stringify(d));
}
let data = ambilData();

// ================= UTIL =================
function formatRp(n) {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}
function formatTgl(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function idBaru() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
function tglHariIniISO() {
  const now = new Date();
  const off = now.getTimezoneOffset();
  const lokal = new Date(now.getTime() - off * 60000);
  return lokal.toISOString().slice(0, 10);
}
function escapeHTML(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ================= TAB =================
function gantiTab(mode) {
  document.getElementById('secUang').classList.toggle('active', mode === 'uang');
  document.getElementById('secKuota').classList.toggle('active', mode === 'kuota');
  document.getElementById('tabUang').classList.toggle('active', mode === 'uang');
  document.getElementById('tabKuota').classList.toggle('active', mode === 'kuota');
}

// ================= UANG =================
let jenisUangDipilih = 'keluar';
function pilihJenisUang(j) {
  jenisUangDipilih = j;
  document.getElementById('btnKeluar').classList.toggle('aktif', j === 'keluar');
  document.getElementById('btnMasuk').classList.toggle('aktif', j === 'masuk');
}

let filterUangAktif = 'semua';
function filterUang(f, el) {
  filterUangAktif = f;
  document.querySelectorAll('.filter-cepat button').forEach(b => b.classList.remove('aktif'));
  el.classList.add('aktif');
  renderUang();
}

function simpanUang(e) {
  e.preventDefault();
  const jumlah = parseFloat(document.getElementById('uangJumlah').value);
  const kategori = document.getElementById('uangKategori').value;
  const ket = document.getElementById('uangKet').value.trim();
  const tanggal = document.getElementById('uangTanggal').value;
  if (!jumlah || jumlah <= 0) return;

  data.uang.unshift({
    id: idBaru(),
    jenis: jenisUangDipilih,
    jumlah,
    kategori,
    ket: ket || kategori,
    tanggal
  });
  simpanData(data);
  e.target.reset();
  document.getElementById('uangTanggal').value = tglHariIniISO();
  renderUang();
  renderRingkasanUang();
}

function hapusUang(id) {
  data.uang = data.uang.filter(x => x.id !== id);
  simpanData(data);
  renderUang();
  renderRingkasanUang();
}

function renderRingkasanUang() {
  const now = new Date();
  const bulanIni = data.uang.filter(x => {
    const d = new Date(x.tanggal + 'T00:00:00');
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const masuk = bulanIni.filter(x => x.jenis === 'masuk').reduce((s, x) => s + x.jumlah, 0);
  const keluar = bulanIni.filter(x => x.jenis === 'keluar').reduce((s, x) => s + x.jumlah, 0);
  document.getElementById('totalMasuk').textContent = formatRp(masuk);
  document.getElementById('totalKeluar').textContent = formatRp(keluar);
  document.getElementById('saldoBulanIni').textContent = formatRp(masuk - keluar);
}

function renderUang() {
  const list = document.getElementById('listUang');
  let items = data.uang;
  if (filterUangAktif !== 'semua') {
    items = items.filter(x => x.jenis === filterUangAktif);
  }
  if (items.length === 0) {
    list.innerHTML = '<p class="kosong">Belum ada catatan.</p>';
    return;
  }
  list.innerHTML = items.map(x => `
    <div class="item ${x.jenis === 'keluar' ? 'uang-keluar' : 'uang-masuk'}">
      <div class="ikon">${x.jenis === 'keluar' ? '−' : '+'}</div>
      <div class="info">
        <p class="ket">${escapeHTML(x.ket)}</p>
        <p class="sub">${x.kategori} · ${formatTgl(x.tanggal)}</p>
      </div>
      <div class="nilai">${x.jenis === 'keluar' ? '-' : '+'}${formatRp(x.jumlah)}</div>
      <button class="hapus" onclick="hapusUang('${x.id}')" aria-label="Hapus">✕</button>
    </div>
  `).join('');
}

// ================= KUOTA =================
function simpanKuotaAwal(e) {
  e.preventDefault();
  const total = parseFloat(document.getElementById('kuotaTotal').value.replace(',', '.'));
  const tgl = document.getElementById('kuotaTglBeli').value;
  if (!total || total <= 0) return;

  data.kuotaAwal = { total, tanggal: tgl };
  data.kuotaLog.unshift({
    id: idBaru(),
    tipe: 'beli',
    jumlah: total,
    ket: 'Paket kuota baru',
    tanggal: tgl
  });
  simpanData(data);
  e.target.reset();
  document.getElementById('kuotaTglBeli').value = tglHariIniISO();
  renderKuota();
}

function simpanPakaiKuota(e) {
  e.preventDefault();
  const jumlah = parseFloat(document.getElementById('pakaiJumlah').value.replace(',', '.'));
  const ket = document.getElementById('pakaiKet').value;
  const tgl = document.getElementById('pakaiTanggal').value;
  if (!jumlah || jumlah <= 0) return;

  data.kuotaLog.unshift({
    id: idBaru(),
    tipe: 'pakai',
    jumlah,
    ket,
    tanggal: tgl
  });
  simpanData(data);
  e.target.reset();
  document.getElementById('pakaiTanggal').value = tglHariIniISO();
  renderKuota();
}

function hapusKuotaLog(id) {
  data.kuotaLog = data.kuotaLog.filter(x => x.id !== id);
  simpanData(data);
  renderKuota();
}

function renderKuota() {
  const total = data.kuotaAwal ? data.kuotaAwal.total : 0;
  const terpakai = data.kuotaLog
    .filter(x => x.tipe === 'pakai')
    .reduce((s, x) => s + x.jumlah, 0);
  const sisa = Math.max(0, total - terpakai);

  document.getElementById('kuotaAwal').textContent = total.toFixed(1).replace(/\.0$/, '') + ' GB';
  document.getElementById('kuotaTerpakai').textContent = terpakai.toFixed(1).replace(/\.0$/, '') + ' GB';
  document.getElementById('sisaKuota').textContent = sisa.toFixed(1).replace(/\.0$/, '') + ' GB';

  const list = document.getElementById('listKuota');
  if (data.kuotaLog.length === 0) {
    list.innerHTML = '<p class="kosong">Belum ada catatan kuota.</p>';
    return;
  }
  list.innerHTML = data.kuotaLog.map(x => `
    <div class="item kuota">
      <div class="ikon">${x.tipe === 'beli' ? '↻' : '↓'}</div>
      <div class="info">
        <p class="ket">${escapeHTML(x.ket)}</p>
        <p class="sub">${formatTgl(x.tanggal)}</p>
      </div>
      <div class="nilai">${x.tipe === 'beli' ? '+' : '-'}${x.jumlah} GB</div>
      <button class="hapus" onclick="hapusKuotaLog('${x.id}')" aria-label="Hapus">✕</button>
    </div>
  `).join('');
}

// ================= INIT =================
document.getElementById('uangTanggal').value = tglHariIniISO();
document.getElementById('pakaiTanggal').value = tglHariIniISO();
document.getElementById('kuotaTglBeli').value = tglHariIniISO();
document.getElementById('tanggalHariIni').textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

renderUang();
renderRingkasanUang();
renderKuota();

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

      if (y > height && Math.random() > 0.975) {
        drops[i] = Math.random() * -40;
      }
      drops[i] += 0.45;
    }
  }
  setInterval(draw, 40);
})();