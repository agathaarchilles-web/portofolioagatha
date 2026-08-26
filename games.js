(function matrixRain() {
  const canvas = document.getElementById('matrix-rain');
  const ctx = canvas.getContext('2d');

  const FONT_SIZE = 24;
  const chars = "01";
  const SPACING = 36;

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

      for (let t = 0; t < 12; t++) {
        const ty = y - t * FONT_SIZE;
        if (ty < -FONT_SIZE || ty > height) continue;

        const ch = chars[Math.floor(Math.random() * chars.length)];

        if (t === 0) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#39ff6a";
        } else {
          const alpha = Math.max(0, 1 - t / 12);
          ctx.fillStyle = `rgba(57, 255, 106, ${alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(57, 255, 106, 0.3)";
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

function glitchEffect() {
  const h1 = document.querySelector('.glitch');
  if (!h1) return;

  setInterval(() => {
    h1.style.textShadow = `
      0 0 10px rgba(57,255,106,0.5),
      2px 2px 0 rgba(255,51,85,0.7),
      -2px -2px 0 rgba(53,193,255,0.7)
    `;
    
    setTimeout(() => {
      h1.style.textShadow = '0 0 20px rgba(57,255,106,0.4)';
    }, 100);
  }, 2000);
}

document.addEventListener('DOMContentLoaded', glitchEffect);