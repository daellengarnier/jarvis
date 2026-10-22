// Kulturspinnerei Bern: Programm Herbst/Winter 2026, 9:16, schwarz/weiss.
// Alles hängt am Beat des Tracks; Tempo, Länge und Breaks kommen aus features.js (window.CFG). render(t) zeichnet den Frame zur Zeit t (Sekunden).
const W = 1080, H = 1920, BPM = 60 / window.CFG.beat, BEAT = 60 / BPM, FPS = 60;
const END_BEATS = window.CFG.endBeats;
const STOP = window.CFG.stop; // letzter Schlag bzw. Schlusskarte
const cv = document.getElementById('c');
let ctx = cv.getContext('2d');
const DISP = '"Inter Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", monospace';
const M = 72;
const BLACK = '#000', WHITE = '#fff';
let FG = WHITE, BG = BLACK;

// ---------- Helfer ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const eOut = t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const eIn = t => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10));
const eInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eBack = t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const pulse = (lb, k = 6) => (lb < 0 ? 0 : Math.exp(-(lb - Math.floor(lb)) * k));
const P = (lb, start, dur) => clamp((lb - start) / dur);

function bg() { ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); }
function setFont(size, w = 900, fam = DISP) { ctx.font = `${w} ${size}px ${fam}`; }
function T(s, x, y, size, o = {}) {
  const { w = 900, fam = DISP, align = 'left', ls = -0.045, col = FG, stroke = 0 } = o;
  setFont(size, w, fam);
  ctx.letterSpacing = ls * size + 'px';
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  if (stroke) { ctx.strokeStyle = col; ctx.lineWidth = stroke; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
  else { ctx.fillStyle = col; ctx.fillText(s, x, y); }
}
function measure(s, size, o = {}) {
  const { w = 900, fam = DISP, ls = -0.045 } = o;
  setFont(size, w, fam); ctx.letterSpacing = ls * size + 'px';
  return ctx.measureText(s).width - ls * size; // ohne nachlaufendes Spacing
}
function fit(s, maxW, o = {}, cap = 9999) { return Math.min(cap, (100 * maxW) / measure(s, 100, o)); }
// Text steigt aus einer Maske auf
function rise(s, x, y, size, p, o = {}) {
  if (p <= 0) return;
  const e = eOut(clamp(p));
  ctx.save();
  ctx.beginPath(); ctx.rect(-20, y - size * 1.08, W + 40, size * 1.36); ctx.clip();
  T(s, x, y + (1 - e) * size * 1.25, size, o);
  ctx.restore();
}
function mono(s, x, y, size = 30, o = {}) { T(s, x, y, size, { w: 700, fam: MONO, ls: 0.02, ...o }); }
// Schreibmaschine mit Blockcursor
function typeOn(s, x, y, size, p, o = {}) {
  if (p <= 0) return;
  const n = Math.floor(clamp(p) * s.length);
  mono(s.slice(0, n), x, y, size, o);
  if (p < 1) {
    const w = measure(s.slice(0, n), size, { w: 700, fam: MONO, ls: 0.02 }) + (n ? size * 0.02 : 0);
    ctx.fillStyle = o.col || FG;
    ctx.fillRect(x + w + 4, y - size * 0.78, size * 0.58, size * 0.9);
  }
}
// Gross reinknallen
function slam(fn, cx, cy, p, from = 1.5) {
  if (p <= 0) return;
  const s = lerp(from, 1, eOut(clamp(p)));
  ctx.save(); ctx.globalAlpha = clamp(p * 5);
  ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
  fn(); ctx.restore();
}
// Balken-Label: Box wischt auf, Text darin
function label(s, x, y, size, p, o = {}) {
  if (p <= 0) return;
  const { boxCol = WHITE, txtCol = BLACK, pad = 0.22, fam = DISP, w = 900, ls = -0.04 } = o;
  const tw = measure(s, size, { fam, w, ls });
  const bw = tw + size * pad * 2, bh = size * 1.0;
  const e = eOut(clamp(p));
  ctx.save();
  ctx.fillStyle = boxCol;
  ctx.fillRect(x, y - size * 0.86, bw * e, bh);
  ctx.beginPath(); ctx.rect(x, y - size * 0.86, bw * e, bh); ctx.clip();
  T(s, x + size * pad, y, size, { fam, w, ls, col: txtCol });
  ctx.restore();
  return bw;
}
// Datum oben links, in allen Event-Szenen gleich
function dateBlock(lb, weekday, date, o = {}) {
  const { col = FG, y = 560 } = o;
  typeOn(weekday, M, y - 300, 32, P(lb, 0.05, 0.4), { col });
  slam(() => T(date, M, y, 290, { col, ls: -0.06 }), M + 300, y - 110, P(lb, 0, 0.45));
}
function rule(x, y, w, p, col = FG, th = 3) {
  if (p <= 0) return; ctx.fillStyle = col; ctx.fillRect(x, y, w * eOut(clamp(p)), th);
}

// Spirale: Faden auf der Spule, das Motiv der Spinnerei
function spiral(cx, cy, rMax, rot, alpha, col = FG, lw = 2, turns = 14) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = lw;
  ctx.beginPath();
  const N = turns * 90;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * turns * Math.PI * 2;
    const r = (i / N) * rMax;
    const x = cx + Math.cos(a + rot) * r, y = cy + Math.sin(a + rot) * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke(); ctx.restore();
}

// Filmkorn
const grains = [];
for (let k = 0; k < 6; k++) {
  const c = document.createElement('canvas'); c.width = 540; c.height = 960;
  const g = c.getContext('2d'); const im = g.createImageData(540, 960);
  let seed = 1234 + k * 999;
  for (let i = 0; i < im.data.length; i += 4) {
    seed = (seed * 16807) % 2147483647;
    const v = (seed / 2147483647) * 255;
    im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0); grains.push(c);
}
function grain(frame) {
  ctx.save(); ctx.globalAlpha = 0.07; ctx.imageSmoothingEnabled = false;
  const c = grains[frame % grains.length];
  ctx.drawImage(c, -((frame * 37) % 60), -((frame * 53) % 60), 1200, 2040);
  ctx.restore();
}

// ---------- HUD ----------
function hud(idx, B) {
  mono('KULTURSPINNEREI BERN', M, 128, 26);
  mono('PROGRAMM HERBST 26', W - M, 128, 26, { align: 'right' });
  const by = H - 128;
  ctx.fillStyle = FG;
  ctx.globalAlpha = 0.35; ctx.fillRect(M, by, W - 2 * M, 2); ctx.globalAlpha = 1;
  ctx.fillRect(M, by - 2, (W - 2 * M) * clamp(B / 64), 6);
  for (let k = 0; k <= 8; k++) ctx.fillRect(M + ((W - 2 * M) * k) / 8 - 1, by - 10, 2, 22);
  mono(idx >= 0 ? `${String(idx + 1).padStart(2, '0')} / 05` : 'OKT BIS DEZ 2026', M, by - 34, 26);
  mono('SPINNEREIWEG 17, BERN', W - M, by - 34, 26, { align: 'right' });
}

// ---------- Szenen (lb = Beat innerhalb der Szene, 8 Beats pro Anlass) ----------

function sIntro(lb) {
  const words = ['KULTUR', 'SPINNEREI', 'BERN', 'HERBST', 'WINTER', '2026'];
  if (lb < 6) {
    const i = clamp(Math.floor(lb), 0, 5), f = lb - i;
    const inv = i === 2 || i === 5;
    BG = inv ? WHITE : BLACK; FG = inv ? BLACK : WHITE; bg();
    spiral(W / 2, H / 2, 1000, lb * 1.4, 0.22, FG, 2, 18);
    const word = words[i];
    const size = fit(word, W - 2 * M, {}, 430);
    const s = lerp(1.18, 1, eOut(clamp(f * 2.2)));
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(s, s);
    T(word, 0, size * 0.36, size, { align: 'center' });
    ctx.restore();
    mono(`[${String(i + 1).padStart(2, '0')}]`, W / 2, H / 2 + size * 0.36 + 90, 30, { align: 'center' });
    // Off-beat Blitzlinien
    if (f > 0.5 && f < 0.62) {
      ctx.fillStyle = FG;
      for (let k = 0; k < 7; k++) ctx.fillRect(0, hash(i * 10 + k) * H, W, 2 + hash(k + i) * 10);
    }
    return;
  }
  BG = BLACK; FG = WHITE; bg();
  const l = lb - 6;
  spiral(W - 120, 560, 420, lb * 2.2, 0.9, FG, 3, 11);
  const s1 = fit('GRAMM', W - 2 * M, {}, 400);
  rise('PRO', M, 980, s1, P(l, 0, 0.45));
  rise('GRAMM', M, 980 + s1 * 0.92, s1, P(l, 0.18, 0.45));
  typeOn('5 ANLÄSSE, OKTOBER BIS DEZEMBER', M, 980 + s1 * 0.92 + 110, 34, P(l, 0.5, 0.9));
  hud(-1, 6 + l);
}

// 1: Kinderdisco
function discoBall(cx, cy, r, rot, lb) {
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = BLACK; ctx.fill(); ctx.clip();
  const rows = 14, cols = 30, beatSeed = Math.floor(lb * 4);
  const L = [-0.55, -0.6, 0.58];
  for (let i = 0; i < rows; i++) {
    const la0 = -Math.PI / 2 + (Math.PI * i) / rows, la1 = la0 + Math.PI / rows;
    for (let j = 0; j < cols; j++) {
      const lo0 = (Math.PI * 2 * j) / cols + rot, lo1 = lo0 + (Math.PI * 2) / cols;
      const lm = (la0 + la1) / 2, om = (lo0 + lo1) / 2;
      const nz = Math.cos(lm) * Math.cos(om);
      if (nz <= 0.02) continue;
      const nx = Math.cos(lm) * Math.sin(om), ny = Math.sin(lm);
      const pts = [[la0, lo0], [la0, lo1], [la1, lo1], [la1, lo0]].map(([a, o]) => [cx + r * Math.cos(a) * Math.sin(o), cy + r * Math.sin(a)]);
      const mx = (pts[0][0] + pts[2][0]) / 2, my = (pts[0][1] + pts[2][1]) / 2;
      const sh = 0.8;
      let shade = clamp(nx * L[0] + ny * L[1] + nz * L[2]) * 0.85 + 0.08;
      if (hash(i * 131 + j * 7 + beatSeed * 17) > 0.9) shade = 1;
      ctx.fillStyle = `rgb(${shade * 255 | 0},${shade * 255 | 0},${shade * 255 | 0})`;
      ctx.beginPath();
      pts.forEach(([x, y], k) => { const px = mx + (x - mx) * sh, py = my + (y - my) * sh; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.strokeStyle = BLACK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
}
function star(x, y, s, col) {
  ctx.fillStyle = col; ctx.beginPath();
  ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.16, y - s * 0.16); ctx.lineTo(x + s, y); ctx.lineTo(x + s * 0.16, y + s * 0.16);
  ctx.lineTo(x, y + s); ctx.lineTo(x - s * 0.16, y + s * 0.16); ctx.lineTo(x - s, y); ctx.lineTo(x - s * 0.16, y - s * 0.16);
  ctx.closePath(); ctx.fill();
}
function sDisco(lb) {
  BG = WHITE; FG = BLACK; bg();
  const cx = 770, r = 230;
  const cy = lerp(-300, 830, eBack(P(lb, 0.1, 0.8)));
  // Lichtpunkte, die durch den Raum drehen
  if (lb > 0.6) for (let i = 0; i < 70; i++) {
    const a = hash(i) * Math.PI * 2 + lb * 0.55;
    const rad = 280 + hash(i + 3) * 760;
    const x = cx + Math.cos(a) * rad, y = 830 + Math.sin(a) * rad * 1.15;
    const sz = 4 + hash(i + 9) * 9;
    ctx.globalAlpha = clamp((lb - 0.6) * 3) * (0.35 + 0.65 * hash(i + Math.floor(lb * 2)));
    ctx.fillStyle = BLACK; ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = BLACK; ctx.fillRect(cx - 2, 0, 4, cy - r);
  discoBall(cx, cy, r, lb * 0.9, lb);
  if (lb > 1) for (let k = 0; k < 3; k++) {
    const a = hash(k + Math.floor(lb * 2) * 3) * Math.PI * 2, d = hash(k * 7 + Math.floor(lb * 2)) * r * 0.85;
    star(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 46 * pulse(lb * 2, 4), WHITE);
  }
  dateBlock(lb, 'SAMSTAG', '24.10');
  const info = ['BEATS FÜR', 'GROSS & KLEIN', '', '14 BIS 17 UHR', 'EINTRITT 5 CHF'];
  info.forEach((s, k) => typeOn(s, M, 680 + k * 50, 32, P(lb, 2.2 + k * 0.25, 0.4)));
  const sz = fit('KINDER', W - 2 * M, {}, 270);
  const b = pulse(lb, 7);
  slam(() => T('KINDER', M, 1300, sz), W / 2, 1200, P(lb, 1, 0.4), 1.3);
  slam(() => T('DISCO', M, 1300 + sz * 0.9, sz), W / 2, 1200 + sz, P(lb, 1.5, 0.4), 1.3);
  if (lb > 2) { // Hüpfer auf jeden Beat
    ctx.save(); ctx.fillStyle = BLACK;
    ctx.fillRect(M, 1300 + sz * 0.9 + 30, (W - 2 * M) * b, 8); ctx.restore();
  }
  typeOn('DJS TINO, SIMÄ B2B LUCIEN', M, 1300 + sz * 0.9 + 100, 32, P(lb, 3.2, 0.6));
}

// 2: QUM Queersicht Dance
function sQum(lb) {
  BG = BLACK; FG = WHITE; bg();
  const rowH = 250, rows = 9;
  const unit = measure('QUM ', 280, { ls: -0.02 }) + -0.02 * 280;
  ctx.save(); ctx.globalAlpha = 0.18;
  for (let k = 0; k < rows; k++) {
    const dir = k % 2 ? 1 : -1;
    const off = (((lb * 160 * dir) % unit) + unit) % unit;
    T('QUM '.repeat(6), -unit + off, 120 + k * rowH, 280, { ls: -0.02, stroke: 2 });
  }
  ctx.restore();
  // Datum auf schwarzem Feld
  const pd = P(lb, 0.15, 0.4);
  ctx.fillStyle = BLACK; ctx.fillRect(0, 0, W, 165);
  if (pd > 0) { ctx.fillStyle = BLACK; ctx.fillRect(0, 165, (M + 640) * eOut(pd), 495); }
  dateBlock(lb - 0.15, 'SAMSTAG', '31.10');
  // weisses Panel
  const p1 = eOut(P(lb, 1, 0.5));
  if (p1 > 0) {
    ctx.fillStyle = WHITE; ctx.fillRect(0, 640, W * p1, 640);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 640, W * p1, 640); ctx.clip();
    const s0 = 230, s1 = fit('QUEERSICHT', W - 2 * M, {}, 300), s2 = 230;
    const y0 = 640 + 40 + s0 * 0.76, y1 = y0 + s1 * 0.98, y2 = y1 + s2 * 0.9;
    rise('QUM', M, y0, s0, P(lb, 1.1, 0.4), { col: BLACK });
    rise('QUEERSICHT', M, y1, s1, P(lb, 1.3, 0.4), { col: BLACK });
    rise('DANCE', M, y2, s2, P(lb, 1.5, 0.4), { col: BLACK });
    ctx.restore();
  }
  // schwarzes Panel unten
  const p2 = eOut(P(lb, 2.4, 0.5));
  if (p2 > 0) {
    ctx.fillStyle = BLACK; ctx.fillRect(W * (1 - p2), 1280, W * p2, H - 1280);
    const djs = ['DJ CLAUSETTE', 'AUDIOPHIL', 'MOUDE-E', 'DJ ANDREAM'];
    djs.forEach((d, k) => rise(d, M + (k % 2) * 470, 1370 + Math.floor(k / 2) * 72, 48, P(lb, 2.8 + k * 0.3, 0.35), { ls: -0.03 }));
    rule(M, 1490, W - 2 * M, P(lb, 4.1, 0.5));
    typeOn('WARM-UP ZUM 30. QUEERSICHT', M, 1550, 32, P(lb, 4.3, 0.6));
    typeOn('16 BIS 24 UHR, 20 CHF', M, 1598, 32, P(lb, 4.8, 0.5));
  }
}

// 3: Kitchen
function sKitchen(lb) {
  BG = WHITE; FG = BLACK; bg();
  dateBlock(lb, 'SAMSTAG', '07.11');
  const N = 30, top = 640, gap = 17, x0 = M, x1 = W - M;
  const t = lb * BEAT;
  const amp = 0.55 + AF.low * 0.45 + clamp(AF.kick, 0, 1.3) * 0.8;
  const reveal = eOut(P(lb, 0.2, 1.2));
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, x0 + (x1 - x0) * reveal + 4, H); ctx.clip();
  for (let i = 0; i < N; i++) {
    const y0 = top + i * gap + 120;
    ctx.beginPath(); ctx.moveTo(x0, y0);
    for (let x = x0; x <= x1; x += 6) {
      const u = (x - x0) / (x1 - x0);
      const env = Math.pow(Math.max(0, 1 - Math.abs(u - 0.5) * 2.6), 2);
      const n = Math.sin(u * 23 + hash(i) * 40 + t * 2.1) * 0.5 + Math.sin(u * 51 + hash(i + 50) * 30 - t * 3.3) * 0.3 + Math.sin(u * 97 + i + t * 5) * 0.2;
      const y = y0 - (Math.abs(n) * 120 * env * amp + hash(i * 999 + Math.floor(x / 6)) * 4);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(x1, y0 + 30); ctx.lineTo(x0, y0 + 30); ctx.closePath();
    ctx.fillStyle = WHITE; ctx.fill();
    ctx.beginPath(); ctx.moveTo(x0, y0);
    for (let x = x0; x <= x1; x += 6) {
      const u = (x - x0) / (x1 - x0);
      const env = Math.pow(Math.max(0, 1 - Math.abs(u - 0.5) * 2.6), 2);
      const n = Math.sin(u * 23 + hash(i) * 40 + t * 2.1) * 0.5 + Math.sin(u * 51 + hash(i + 50) * 30 - t * 3.3) * 0.3 + Math.sin(u * 97 + i + t * 5) * 0.2;
      ctx.lineTo(x, y0 - (Math.abs(n) * 120 * env * amp + hash(i * 999 + Math.floor(x / 6)) * 4));
    }
    ctx.strokeStyle = BLACK; ctx.lineWidth = 2.5; ctx.stroke();
  }
  ctx.restore();
  // KITCHEN, Buchstabe für Buchstabe
  const word = 'KITCHEN', sz = fit(word, W - 2 * M, {}, 300);
  let x = M; const y = 1430;
  for (let k = 0; k < word.length; k++) {
    const ch = word[k], cw = measure(ch, sz) + -0.045 * sz;
    const p = P(lb, 1 + k * 0.125, 0.35);
    if (p > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(x - 5, y - sz, cw + 10, sz * 1.1); ctx.clip();
      T(ch, x, y + (1 - eOut(p)) * -sz, sz);
      ctx.restore();
    }
    x += cw;
  }
  typeOn('INSTRUMENTAL TRIP POP AUS BERN', M, 1500, 32, P(lb, 2.2, 0.7));
  typeOn('TÜRE 21:00, SHOW 21:45, 20 CHF', M, 1550, 32, P(lb, 2.8, 0.7));
}

// 4: Artlu Bubble, Plattentaufe 16:26
function vinyl(cx, cy, r, rot) {
  ctx.save();
  ctx.fillStyle = '#0b0b0b'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = WHITE; ctx.lineWidth = 3; ctx.stroke();
  ctx.lineWidth = 1;
  for (let k = 0; k < 34; k++) {
    const rr = r * 0.4 + (r * 0.57 * k) / 34;
    ctx.globalAlpha = 0.25 + 0.2 * hash(k); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 0.22; ctx.fillStyle = WHITE;
  for (const a of [rot, rot + Math.PI]) {
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r * 0.97, a - 0.22, a + 0.22); ctx.closePath(); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(cx, cy, r * 0.36, 0, Math.PI * 2); ctx.fill();
  ctx.translate(cx, cy); ctx.rotate(rot);
  T('16:26', 0, r * 0.07, r * 0.2, { align: 'center', col: BLACK, ls: -0.03 });
  mono('ARTLU BUBBLE', 0, -r * 0.16, r * 0.05, { align: 'center', col: BLACK });
  mono('SIDE A  33', 0, r * 0.2, r * 0.045, { align: 'center', col: BLACK });
  ctx.fillStyle = BLACK; ctx.beginPath(); ctx.arc(0, r * 0.27, r * 0.025, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function sArtlu(lb) {
  BG = BLACK; FG = WHITE; bg();
  // Blasen
  for (let i = 0; i < 46; i++) {
    const rr = 10 + hash(i + 1) * 60, sp = 0.5 + hash(i + 2) * 1.2;
    const y = H + 120 - (((lb + 3) * sp * 210 + hash(i + 3) * (H + 300)) % (H + 300));
    const x = hash(i + 4) * W + Math.sin(lb * 2 + i) * 26;
    const born = P(lb, hash(i + 5) * 1.2, 0.3);
    if (born <= 0) continue;
    ctx.strokeStyle = WHITE; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.arc(x, y, rr * eOut(born), 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, rr * 0.7 * eOut(born), Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  dateBlock(lb, 'SAMSTAG, PLATTENTAUFE', '14.11');
  const vx = lerp(W + 400, 700, eOut(P(lb, 0.3, 0.7)));
  vinyl(vx, 900, 290, lb * 1.6 + (1 - eOut(P(lb, 0.3, 0.7))) * 4);
  const s1 = fit('ARTLU BUBBLE', W - 2 * M, {}, 200);
  rise('ARTLU BUBBLE', M, 1340, s1, P(lb, 1.6, 0.4));
  const s2 = fit('AND THE DEAD ANIMAL GANG', W - 2 * M, {}, 120);
  rise('AND THE DEAD ANIMAL GANG', M, 1340 + s2 * 1.15, s2, P(lb, 1.9, 0.4));
  typeOn('GARAGE ROCK, TÜRE 21:00, 30 CHF', M, 1340 + s2 * 1.15 + 75, 32, P(lb, 2.6, 0.6));
  typeOn('ERSTES KONZERT SEIT FAST 10 JAHREN', M, 1340 + s2 * 1.15 + 125, 32, P(lb, 3.2, 0.7));
}

// 5: Soirée Tropicale #4
function sSoiree(lb) {
  BG = WHITE; FG = BLACK; bg();
  const cx = 740, r = 270, horizon = 990;
  const cy = lerp(1400, 770, eOut(P(lb, 0.2, 1.1)));
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, W, horizon); ctx.clip();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = BLACK; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  ctx.fillStyle = WHITE;
  const scroll = (lb * 40) % 60;
  for (let k = 0; k < 14; k++) {
    const yy = cy - r + k * 60 + scroll;
    const th = Math.max(0, (yy - (cy - r * 0.4)) / (2 * r)) * 34;
    ctx.fillRect(cx - r, yy, 2 * r, th);
  }
  ctx.restore();
  // Meer
  ctx.strokeStyle = BLACK; ctx.lineWidth = 4;
  for (let k = 0; k < 5; k++) {
    const y0 = horizon + 18 + k * 22, ph = lb * 2.2 + k * 0.9;
    const pk = eOut(P(lb, 0.1 + k * 0.08, 0.6));
    ctx.beginPath();
    for (let x = 0; x <= W * pk; x += 8) {
      const y = y0 + Math.sin(x * 0.018 + ph * (k % 2 ? 1 : -1)) * (8 + k * 2);
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  dateBlock(lb, 'SAMSTAG', '28.11');
  ['TROPISCH', 'KARIBISCH', 'BRASILIANISCH'].forEach((s, k) => typeOn(s, M, 690 + k * 50, 32, P(lb, 1 + k * 0.3, 0.4)));
  const s1 = fit('TROPICALE', W - 2 * M, {}, 220);
  const by = 1465;
  rise('SOIRÉE', M, by - s1 * 0.92, s1, P(lb, 1.3, 0.4));
  rise('TROPICALE', M, by, s1, P(lb, 1.55, 0.4));
  slam(() => T('#4', W - M, by - s1 * 0.92, s1 * 1.1, { align: 'right', stroke: 5 }), W - M - 110, by - s1 * 1.2, P(lb, 2, 0.4), 2);
  typeOn('ÂMY B. (LYON), ROOTS GLIDER (GENF)', M, by + 70, 32, P(lb, 2.6, 0.7));
  typeOn('MO PÂLIDO, TÜRE 21:00, 20 CHF', M, by + 120, 32, P(lb, 3.2, 0.6));
}

// 6: Mother's Cake & Fancy and the Boys
function tunnel(cx, cy, lb, alpha) {
  ctx.save(); ctx.globalAlpha = alpha;
  const sectors = 24, phase = (lb * 0.75) % 1;
  for (let k = 26; k >= 0; k--) {
    const r1 = 22 * Math.pow(1.2, k + phase), r0 = 22 * Math.pow(1.2, k - 1 + phase);
    const tw = lb * 0.35 + k * 0.09 * Math.sin(lb * 0.7);
    for (let j = 0; j < sectors; j++) {
      if ((j + k) % 2) continue;
      const a0 = (j / sectors) * Math.PI * 2 + tw, a1 = a0 + (Math.PI * 2) / sectors;
      ctx.beginPath(); ctx.arc(cx, cy, r1, a0, a1); ctx.arc(cx, cy, Math.max(0, r0), a1, a0, true); ctx.closePath();
      ctx.fillStyle = WHITE; ctx.fill();
    }
  }
  ctx.restore();
}
function sMothers(lb) {
  BG = BLACK; FG = WHITE; bg();
  const sh = pulse(lb, 8) * (lb > 1 ? 10 : 0);
  tunnel(W / 2 + sh * (hash(Math.floor(lb)) - 0.5), 820, lb, eOut(P(lb, 0, 0.6)));
  // Datum als Label
  label('12.12', M, 520, 250, P(lb, 0.1, 0.45), { boxCol: BLACK, txtCol: WHITE, pad: 0.12, ls: -0.06 });
  label('SAMSTAG', M, 250, 32, P(lb, 0.05, 0.3), { boxCol: BLACK, txtCol: WHITE, fam: MONO, w: 700, ls: 0.02, pad: 0.4 });
  const s1 = fit("MOTHER'S CAKE", W - 2 * M - 60, {}, 170);
  label("MOTHER'S CAKE", M, 1240, s1, P(lb, 1, 0.45), { pad: 0.16 });
  label('PSYCHEDELIC ROCK, INNSBRUCK (AT)', M, 1310, 30, P(lb, 1.5, 0.4), { boxCol: BLACK, txtCol: WHITE, fam: MONO, w: 700, ls: 0.02, pad: 0.4 });
  const s2 = fit('+ FANCY AND THE BOYS', W - 2 * M - 40, {}, 110);
  label('+ FANCY AND THE BOYS', M, 1310 + s2 * 1.12, s2, P(lb, 2, 0.45), { pad: 0.16 });
  label('GRUNGE, THUN', M, 1310 + s2 * 1.12 + 70, 30, P(lb, 2.5, 0.4), { boxCol: BLACK, txtCol: WHITE, fam: MONO, w: 700, ls: 0.02, pad: 0.4 });
  label('TÜRE 21:00, 35 CHF', M, 1310 + s2 * 1.12 + 128, 30, P(lb, 2.9, 0.4), { boxCol: BLACK, txtCol: WHITE, fam: MONO, w: 700, ls: 0.02, pad: 0.4 });
}

// Outro: Übersicht, Tickets, Absender
const LIST = [
  ['SA 31.10', ['QUM QUEERSICHT DANCE']],
  ['SA 07.11', ['KITCHEN']],
  ['SA 14.11', ['ARTLU BUBBLE', 'AND THE DEAD ANIMAL GANG']],
  ['SA 28.11', ['SOIRÉE TROPICALE #4']],
  ['SA 12.12', ["MOTHER'S CAKE", '+ FANCY AND THE BOYS']],
];
function sOutro(lb) {
  if (lb < 6) {
    BG = WHITE; FG = BLACK; bg();
    typeOn('PROGRAMM HERBST/WINTER 2026', M, 330, 32, P(lb, 0, 0.5));
    // Zeilenhöhe je nach Anzahl Namenszeilen, Namen immer vollständig
    const LH = 78, rowH = n => 82 + n.length * LH;
    let y = 420;
    const hot = lb > 2.6 ? Math.floor((lb - 2.6) * 1.6) : -1;
    LIST.forEach(([d, n], k) => {
      const rh = rowH(n), p = P(lb, 0.25 + k * 0.3, 0.4);
      if (k === hot) { ctx.fillStyle = BLACK; ctx.fillRect(0, y, W, rh); }
      const col = k === hot ? WHITE : BLACK;
      rule(M, y, W - 2 * M, p, col, 3);
      if (p > 0) {
        mono(d, M, y + 52, 30, { col });
        const sz = Math.min(...n.map(l => fit(l, W - 2 * M, {}, 76)));
        n.forEach((l, i) => rise(l, M, y + 128 + i * LH, sz, P(lb, 0.25 + k * 0.3 + i * 0.12, 0.4), { col }));
      }
      y += rh;
    });
    rule(M, y, W - 2 * M, P(lb, 1.9, 0.4));
    hud(-1, 48 + lb);
    return;
  }
  if (lb < 10) {
    const l = lb - 6;
    BG = BLACK; FG = WHITE; bg();
    spiral(W / 2, H / 2, 1100, lb * 1.8, 0.25, FG, 2, 20);
    rise('TICKETS', M, 860, 110, P(l, 0, 0.35));
    const s = fit('PETZI.CH', W - 2 * M, {}, 360);
    slam(() => T('PETZI.CH', M, 860 + s * 0.95, s), W / 2, 860 + s * 0.6, P(l, 0.3, 0.45), 1.4);
    typeOn('VORVERKAUF UND ABENDKASSE', M, 860 + s * 0.95 + 110, 32, P(l, 0.8, 0.7));
    hud(-1, 48 + lb);
    return;
  }
  const l = lb - 10, fr = Math.min(lb, 16);
  BG = WHITE; FG = BLACK; bg();
  spiral(W / 2, 640, lerp(0, 330, eOut(P(l, 0, 1))), fr * 2.4, 1, FG, 3.5, 12);
  ctx.fillStyle = BLACK; ctx.beginPath(); ctx.arc(W / 2, 640, 18 * eOut(P(l, 0, 0.5)), 0, Math.PI * 2); ctx.fill();
  const s = fit('SPINNEREI', W - 2 * M, {}, 400);
  rise('KULTUR', M, 1180, s, P(l, 0.15, 0.4));
  rise('SPINNEREI', M, 1180 + s * 0.9, s, P(l, 0.3, 0.4));
  rule(M, 1180 + s * 0.9 + 50, W - 2 * M, P(l, 0.6, 0.6));
  typeOn('KULTURSPINNEREI.CH', M, 1180 + s * 0.9 + 120, 40, P(l, 0.8, 0.6));
  typeOn('SPINNEREIWEG 17, 3004 BERN', M, 1180 + s * 0.9 + 175, 32, P(l, 1.2, 0.6));
}

const SECTIONS = [
  { s: 0, f: sIntro, i: -1 },
  { s: 8, f: sQum, i: 0 },
  { s: 16, f: sKitchen, i: 1 },
  { s: 24, f: sArtlu, i: 2 },
  { s: 32, f: sSoiree, i: 3 },
  { s: 40, f: sMothers, i: 4 },
  { s: 48, f: sOutro, i: -1 },
];

// Audio-Merkmale des Tracks pro Frame (features.js): kick, hat, clap, low, high, rms, kicks (Onset-Frames)
const F = window.FEAT;
let AF = { kick: 0, hat: 0, clap: 0, low: 0, high: 0, rms: 0 };
function feat(frame) {
  const i = clamp(frame, 0, F.kick.length - 1);
  for (const k in AF) AF[k] = F[k][i] || 0;
}

function drawScene(k, B) {
  const sec = SECTIONS[k], lb = B - sec.s;
  ctx.save();
  if (sec.i >= 0) {
    const z = 1 + 0.022 * clamp(AF.kick, 0, 1.2);
    ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  }
  sec.f(lb);
  ctx.restore();
  if (sec.i >= 0) hud(sec.i, B);
}

// ---------- Psychedelische Nachbearbeitung ----------
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const sc = mk(), mir = mk(), prev = mk();
const sctx = sc.getContext('2d'), mctx = mir.getContext('2d'), pctx = prev.getContext('2d');
const octx = cv.getContext('2d');

// Stärke der Effekte je nach Songteil (B in Beats)
function fx(B) {
  if (B >= STOP) return { echo: 0.22 * clamp(1 - (B - STOP) / 1.5), warp: 0, mirror: false, waves: false };
  if (B < 8) return { echo: 0.45, warp: 5, mirror: false, waves: true };
  if (window.CFG.breaks.some(([a, b]) => B >= a && B < b)) return { echo: 0.55, warp: 16, mirror: true, waves: true }; // Break: Kick fällt weg
  if (B >= 40 && B < 48) return { echo: 0.4, warp: 6, mirror: false, waves: true };
  if (B >= 58) return { echo: 0.2, warp: 2, mirror: false, waves: false }; // Absender lesbar halten
  if (B >= 48) return { echo: 0.32, warp: 4, mirror: false, waves: true }; // Schlussteigerung
  return { echo: 0.28, warp: 4, mirror: false, waves: true };
}

function rorschach(src) {
  mctx.setTransform(1, 0, 0, 1, 0, 0);
  mctx.drawImage(src, 0, 0);
  mctx.save(); mctx.translate(W, 0); mctx.scale(-1, 1);
  mctx.drawImage(src, 0, 0, W / 2, H, 0, 0, W / 2, H); mctx.restore();
  mctx.save(); mctx.translate(0, H); mctx.scale(1, -1);
  mctx.drawImage(mir, 0, 0, W, H / 2, 0, 0, W, H / 2); mctx.restore();
  return mir;
}

function post(t, frame, B, dark) {
  const f = fx(B);
  ctx = octx;
  octx.setTransform(1, 0, 0, 1, 0, 0);
  octx.globalAlpha = 1; octx.globalCompositeOperation = 'source-over';
  octx.fillStyle = dark ? BLACK : WHITE; octx.fillRect(0, 0, W, H);
  const src = f.mirror ? rorschach(sc) : sc;
  // flüssiges Verziehen, Ausschlag auf die Kicks
  const amp = f.warp * (1 + 2.6 * clamp(AF.kick, 0, 1.3)) + 6 * AF.low * (f.warp > 0);
  const st = 8;
  for (let y = 0; y < H; y += st) {
    const off = amp * (Math.sin(y * 0.011 + t * 5.2) + 0.5 * Math.sin(y * 0.027 - t * 3.1 + AF.rms * 2));
    octx.drawImage(src, 0, y, W, st, off, y, W, st);
  }
  // Echo: letztes Bild leicht vergrössert und gedreht darüber
  if (f.echo > 0.01) {
    octx.save();
    octx.globalAlpha = f.echo;
    octx.globalCompositeOperation = dark ? 'lighten' : 'darken';
    const z = 1.02 + 0.045 * clamp(AF.kick, 0, 1.3);
    const rot = 0.007 * Math.sin(t * 1.3) + (B >= 40 && B < 48 ? 0.02 : 0);
    octx.translate(W / 2, H * 0.45); octx.rotate(rot); octx.scale(z, z); octx.translate(-W / 2, -H * 0.45);
    octx.drawImage(prev, 0, 0);
    octx.restore();
  }
  // Schockwellen auf den Kicks
  if (f.waves) {
    octx.save(); octx.globalCompositeOperation = 'difference'; octx.strokeStyle = WHITE;
    for (const kf of F.kicks) {
      const q = ((kf / FPS / BEAT) % 4 + 4) % 4;
      if (q > 0.25 && q < 3.75) continue; // nur Takt-Eins
      const age = (frame - kf) / 70;
      if (age < 0 || age >= 1) continue;
      octx.globalAlpha = (1 - age) * 0.3;
      octx.lineWidth = 8 * (1 - age) + 1.5;
      octx.beginPath(); octx.arc(W / 2, H * 0.45, 80 + eOut(age) * 1200, 0, Math.PI * 2); octx.stroke();
    }
    octx.restore();
  }
  // Glitch-Streifen auf starken Hi-Hats
  if (f.waves && AF.hat > 1.05) {
    const n = 2 + Math.floor(hash(frame) * 3);
    for (let k = 0; k < n; k++) {
      const y = hash(frame * 7 + k) * H, h = 6 + hash(frame * 3 + k) * 46, dx = (hash(frame + k * 11) - 0.5) * 160;
      octx.drawImage(sc, 0, y, W, h, dx, y, W, h);
    }
  }
  grain(frame);
  pctx.drawImage(cv, 0, 0);
}

function render(t, frame) {
  const B = t / BEAT;
  feat(frame);
  let k = 0;
  while (k + 1 < SECTIONS.length && B >= SECTIONS[k + 1].s) k++;
  ctx = sctx;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  drawScene(k, B);
  let dark = BG === BLACK;
  // Wischblende in die nächste Szene
  const nx = SECTIONS[k + 1], WIN = 0.25;
  if (nx && B > nx.s - WIN) {
    const p = eInOut((B - (nx.s - WIN)) / WIN);
    ctx.save(); ctx.beginPath();
    if (k % 2 === 0) ctx.rect(W * (1 - p), 0, W * p, H);
    else ctx.rect(0, H * (1 - p), W, H * p);
    ctx.clip(); drawScene(k + 1, B); ctx.restore();
    if (p > 0.5) dark = BG === BLACK;
  }
  // Blitz auf jedem Szenenstart und auf dem letzten Schlag
  const ls = B - SECTIONS[k].s;
  if ((k > 0 && ls < 0.07) || (B >= STOP && B < STOP + 0.07)) {
    ctx.save(); ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H); ctx.restore();
    dark = !dark;
  }
  post(t, frame, B, dark);
}

window.TOTAL_FRAMES = Math.ceil(END_BEATS * BEAT * FPS);
window.FPS = FPS;
// Das Echo braucht die Vorgänger: bei Sprüngen ein paar Frames vorlaufen lassen
let lastF = -10;
window.renderFrame = f => {
  if (f !== lastF + 1) for (let k = Math.max(0, f - 40); k < f; k++) render(k / FPS, k);
  render(f / FPS, f); lastF = f;
};
window.ready = document.fonts.load(`900 100px "Inter Display"`)
  .then(() => document.fonts.load(`700 30px "JetBrains Mono"`))
  .then(() => document.fonts.load(`900 100px "Inter"`))
  .then(() => true);

// Vorschau im Browser: abspielen
if (location.hash === '#play') {
  const t0 = performance.now();
  const loop = () => { const f = Math.floor(((performance.now() - t0) / 1000) * FPS) % window.TOTAL_FRAMES; window.renderFrame(f); requestAnimationFrame(loop); };
  window.ready.then(loop);
}
