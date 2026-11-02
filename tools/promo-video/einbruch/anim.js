// Info fürs Haus: Einbruch-Saison, 9:16, schwarz/weiss. Motor und Effekte aus anim.js (Programmvideo).
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
function spiral(cx, cy, rMax, rot, alpha, col = FG, lw = 2, turns = 14, mod = null) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = lw;
  ctx.beginPath();
  const N = turns * 90;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * turns * Math.PI * 2;
    const r = (i / N) * rMax + (mod ? mod(i / N) : 0);
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
  mono('INFO FÜRS HAUS', M, 128, 26);
  mono('EINBRUCH-SAISON', W - M, 128, 26, { align: 'right' });
  const by = H - 128;
  ctx.fillStyle = FG;
  ctx.globalAlpha = 0.35; ctx.fillRect(M, by, W - 2 * M, 2); ctx.globalAlpha = 1;
  ctx.fillRect(M, by - 2, (W - 2 * M) * clamp(B / STOP), 6);
  for (let k = 0; k <= 8; k++) ctx.fillRect(M + ((W - 2 * M) * k) / 8 - 1, by - 10, 2, 22);
  const bw = (W - 2 * M) / 32;
  for (let b = 0; b < 32; b++) {
    const v = (specAt(FRAME, b) + specAt(FRAME - 1, b) + specAt(FRAME - 2, b)) / 3;
    const h = 2 + Math.pow(v, 1.5) * 44;
    ctx.fillRect(M + b * bw + 2, by - 72 - h, bw - 6, h);
  }
  mono(idx >= 0 ? `${String(idx + 1).padStart(2, '0')} / 07` : 'HERBST 2026', M, by - 34, 26);
  mono('QUELLE: BZ / DER BUND', W - M, by - 34, 26, { align: 'right' });
}

// Haus mit Fenstern, lit(k) sagt, ob Fenster k leuchtet
function house(x0, y0, w, h, lit, col = FG) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0 - 30, y0); ctx.lineTo(x0 + w / 2, y0 - h * 0.32); ctx.lineTo(x0 + w + 30, y0); ctx.stroke();
  ctx.strokeRect(x0, y0, w, h);
  const cw = w / 3, rh = h / 3;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const k = r * 3 + c, x = x0 + c * cw + cw * 0.28, y = y0 + r * rh + rh * 0.25;
    if (r === 2 && c === 1) { ctx.strokeRect(x0 + cw * 1.25, y0 + 2 * rh + rh * 0.15, cw * 0.5, rh * 0.85); continue; }
    ctx.strokeRect(x, y, cw * 0.44, rh * 0.5);
    if (lit(k)) { ctx.fillStyle = col; ctx.fillRect(x, y, cw * 0.44, rh * 0.5); }
  }
  ctx.restore();
}

// ---------- Szenen (lb = Beat in der Szene, 8 Beats je Szene) ----------
function sIntro(lb) {
  if (lb < 4) {
    const night = lb >= 3;
    BG = night ? BLACK : WHITE; FG = night ? WHITE : BLACK; bg();
    const hz = 960;
    if (!night) {
      const cy = lerp(620, 1060, eInOut(clamp(lb / 3)));
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, hz); ctx.clip();
      ctx.fillStyle = FG; ctx.beginPath(); ctx.arc(W / 2, cy, 230, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else {
      for (let i = 0; i < 60; i++) { ctx.fillStyle = FG; ctx.globalAlpha = 0.3 + 0.7 * hash(i + Math.floor(lb * 4)); ctx.fillRect(hash(i) * W, 180 + hash(i + 9) * 720, 3, 3); }
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = FG; ctx.fillRect(0, hz, W, 4);
    const s = fit('DIE TAGE', W - 2 * M, {}, 250);
    rise('DIE TAGE', M, 1200, s, P(lb, 0, 0.35));
    rise('WERDEN', M, 1200 + s * 0.9, s, P(lb, 1, 0.35));
    rise('KÜRZER.', M, 1200 + s * 1.8, s, P(lb, 2, 0.35));
    hud(-1, lb);
    return;
  }
  const l = lb - 4;
  BG = BLACK; FG = WHITE; bg();
  house(320, 520, 440, 400, k => l < 0.4 + k * 0.17);
  typeOn('ES IST WIEDER', M, 1130, 40, P(l, 0.2, 0.5));
  const s = fit('EINBRUCH-', W - 2 * M, {}, 260);
  rise('EINBRUCH-', M, 1180 + s * 0.8, s, P(l, 0.8, 0.4));
  rise('SAISON.', M, 1180 + s * 1.7, s, P(l, 1.1, 0.4));
  hud(-1, lb);
}

function sWann(lb) {
  BG = WHITE; FG = BLACK; bg();
  typeOn('WANN WIRD AM MEISTEN EINGEBROCHEN?', M, 300, 34, P(lb, 0, 0.6));
  const days = ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'], bw = (W - 2 * M) / 7;
  const act = lb < 1.6 ? Math.floor(lb * 6) % 7 : 4;
  days.forEach((d, k) => {
    const x = M + k * bw, p = P(lb, 0.1 + k * 0.05, 0.3);
    if (p <= 0) return;
    ctx.globalAlpha = eOut(p);
    ctx.strokeStyle = BLACK; ctx.lineWidth = 3; ctx.strokeRect(x + 4, 360, bw - 8, 110);
    if (k === act) { ctx.fillStyle = BLACK; ctx.fillRect(x + 4, 360, bw - 8, 110); }
    mono(d, x + bw / 2, 432, 36, { align: 'center', col: k === act ? WHITE : BLACK });
    ctx.globalAlpha = 1;
  });
  rise('FREITAG', M, 690, fit('FREITAG', W - 2 * M, {}, 230), P(lb, 1.6, 0.4));
  typeOn('18 % ALLER EINBRÜCHE IM KANTON BERN', M, 770, 32, P(lb, 2, 0.7));
  // Uhr: dreht auf 17 Uhr, Feld 17 bis 18 füllt sich
  const cx = W / 2, cy = 1110, r = 180, cp = P(lb, 2.8, 0.3);
  if (cp > 0) {
    ctx.save(); ctx.globalAlpha = eOut(cp);
    const toA = h => (h % 12) / 12 * Math.PI * 2 - Math.PI / 2;
    const fill = eOut(P(lb, 4.1, 0.6));
    if (fill > 0) { ctx.fillStyle = BLACK; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, toA(17), toA(17) + (Math.PI / 6) * fill); ctx.closePath(); ctx.fill(); }
    ctx.strokeStyle = BLACK; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 0.86, cy + Math.sin(a) * r * 0.86); ctx.lineTo(cx + Math.cos(a) * r * 0.97, cy + Math.sin(a) * r * 0.97); ctx.stroke(); }
    const sp = eInOut(P(lb, 3, 1.1)), hh = lerp(8, 17, sp) + Math.min(lb - 4.1, 0) * 0;
    const ha = toA(hh), ma = toA(hh * 12);
    ctx.lineCap = 'round';
    ctx.strokeStyle = fill > 0.5 ? WHITE : BLACK; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ha) * r * 0.5, cy + Math.sin(ha) * r * 0.5); ctx.stroke();
    ctx.strokeStyle = BLACK; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ma) * r * 0.8, cy + Math.sin(ma) * r * 0.8); ctx.stroke();
    ctx.restore();
  }
  rise('17 BIS 18 UHR', M, 1450, fit('17 BIS 18 UHR', W - 2 * M, {}, 160), P(lb, 4.4, 0.4));
  typeOn('ZU DIESER ZEIT AM HÄUFIGSTEN', M, 1530, 32, P(lb, 4.9, 0.7));
}

function sBern(lb) {
  BG = BLACK; FG = WHITE; bg();
  typeOn('STADT BERN, 2025', M, 280, 34, P(lb, 0, 0.4));
  const v = 10.1 * eOut(P(lb, 0.2, 1.6));
  slam(() => T(v.toFixed(1).replace('.', ','), M, 560, 290, { ls: -0.06 }), M + 300, 450, P(lb, 0.1, 0.4));
  typeOn('EINBRÜCHE PRO 1000 EINWOHNER:INNEN', M, 640, 32, P(lb, 0.6, 0.7));
  // 1000 Punkte, 10 davon leuchten
  const cols = 40, rows = 25, sx = (W - 2 * M) / cols, y0 = 730, rev = P(lb, 0.5, 1);
  const hot = [37, 151, 266, 309, 428, 515, 602, 688, 777, 893];
  for (let i = 0; i < cols * rows; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    if (r / rows > rev * 1.05) continue;
    const x = M + c * sx + sx / 2, y = y0 + r * sx;
    const k = hot.indexOf(i), on = k >= 0 ? P(lb, 2 + k * 0.18, 0.25) : 0;
    ctx.fillStyle = WHITE; ctx.globalAlpha = on > 0 ? 1 : 0.35;
    ctx.beginPath(); ctx.arc(x, y, on > 0 ? 3 + 8 * eOut(on) * (1 + 0.25 * clamp(AF.kick, 0, 1.2)) : 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  rise('RUND 1 VON 100.', M, 1420, fit('RUND 1 VON 100.', W - 2 * M, {}, 130), P(lb, 4.1, 0.4));
}

function bike(cx, cy, s, rot) {
  ctx.save(); ctx.strokeStyle = FG; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const r = 0.42 * s, A = [cx - 0.62 * s, cy], B = [cx + 0.62 * s, cy], Bb = [cx - 0.05 * s, cy], S = [cx - 0.22 * s, cy - 0.62 * s], Hd = [cx + 0.42 * s, cy - 0.7 * s];
  for (const [x, y] of [A, B]) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 2;
    for (let k = 0; k < 8; k++) { const a = rot + k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.stroke(); }
    ctx.lineWidth = 6;
  }
  ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(S[0], S[1]); ctx.lineTo(Bb[0], Bb[1]); ctx.lineTo(A[0], A[1]);
  ctx.moveTo(S[0], S[1]); ctx.lineTo(Hd[0] - 0.04 * s, Hd[1] + 0.12 * s); ctx.lineTo(Bb[0], Bb[1]);
  ctx.moveTo(Hd[0], Hd[1]); ctx.lineTo(B[0], B[1]);
  ctx.moveTo(S[0] - 0.1 * s, S[1] - 0.08 * s); ctx.lineTo(S[0] + 0.12 * s, S[1] - 0.08 * s);
  ctx.moveTo(Hd[0] - 0.1 * s, Hd[1]); ctx.lineTo(Hd[0] + 0.1 * s, Hd[1] - 0.04 * s);
  ctx.stroke(); ctx.restore();
}
function sBeute(lb) {
  BG = WHITE; FG = BLACK; bg();
  typeOn('WONACH SUCHEN EINBRECHER:INNEN?', M, 300, 34, P(lb, 0, 0.6));
  const items = ['SCHMUCK', 'BARGELD', 'VELOS', 'E-BIKES'], s = fit('BARGELD', W - 2 * M, {}, 190);
  items.forEach((w, k) => {
    const p = P(lb, 0.6 + k * 0.5, 0.35);
    slam(() => T(w, M, 500 + k * s * 0.92, s), M + 300, 450 + k * s * 0.92, p, 1.25);
  });
  const bx = lerp(-500, 560, eOut(P(lb, 2.2, 0.8)));
  bike(bx, 1300, 380, kickCum(FRAME) * 2.2);
  typeOn('VELOS UND E-BIKES OFT AUS DEM KELLER', M, 1560, 32, P(lb, 3.2, 0.7));
}

function sQuote(lb) {
  BG = BLACK; FG = WHITE; bg();
  typeOn('NUR', M, 300, 40, P(lb, 0, 0.3));
  const cx = W / 2, cy = 800, r = 300, p = eOut(P(lb, 0.4, 1.4)) * 0.22;
  ctx.save(); ctx.lineWidth = 36; ctx.strokeStyle = WHITE; ctx.globalAlpha = 0.18;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
  ctx.lineCap = 'butt'; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); ctx.stroke(); ctx.restore();
  T(Math.round(p * 100) + ' %', cx, cy + 80, 220, { align: 'center' });
  rise('WERDEN AUFGEKLÄRT.', M, 1300, fit('WERDEN AUFGEKLÄRT.', W - 2 * M, {}, 120), P(lb, 2, 0.4));
  typeOn('EINBRUCHDIEBSTÄHLE IM KANTON BERN, 2025', M, 1380, 32, P(lb, 2.5, 0.8));
  rise('VORBEUGEN LOHNT SICH.', M, 1520, fit('VORBEUGEN LOHNT SICH.', W - 2 * M, {}, 90), P(lb, 4, 0.4));
}

function door(x0, y0, w, h, open) {
  ctx.fillStyle = BLACK; ctx.fillRect(x0, y0, w, h);
  const a = open * 1.25, dw = Math.max(8, w * Math.cos(a)), sk = h * 0.09 * Math.sin(a);
  ctx.fillStyle = WHITE; ctx.strokeStyle = BLACK; ctx.lineWidth = 6; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + dw, y0 - sk); ctx.lineTo(x0 + dw, y0 + h + sk); ctx.lineTo(x0, y0 + h); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = BLACK; ctx.fillRect(x0 + dw * 0.84 - 7, y0 + h * 0.52 - 34, 14, 68);
  ctx.lineWidth = 16; ctx.strokeRect(x0 - 8, y0 - 8, w + 16, h + 16);
}
function padlock(x, y, s, closed) {
  ctx.save(); ctx.strokeStyle = BLACK; ctx.fillStyle = BLACK; ctx.lineWidth = s * 0.16;
  const up = (1 - closed) * s * 0.35;
  ctx.beginPath(); ctx.arc(x, y - s * 0.35 - up, s * 0.32, Math.PI, 0); ctx.lineTo(x + s * 0.32, y - s * 0.1 - up * (closed < 1 ? 1 : 0));
  ctx.moveTo(x - s * 0.32, y - s * 0.35 - up); ctx.lineTo(x - s * 0.32, y - s * 0.1); ctx.stroke();
  ctx.fillRect(x - s * 0.5, y - s * 0.15, s, s * 0.8);
  ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(x, y + s * 0.2, s * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x - s * 0.04, y + s * 0.2, s * 0.08, s * 0.22);
  ctx.restore();
}
function sTuer(lb) {
  BG = WHITE; FG = BLACK; bg();
  const shake = lb > 0.5 ? Math.exp(-(lb - 0.5) * 5) * 22 : 0;
  ctx.save(); ctx.translate((hash(FRAME) - 0.5) * shake, (hash(FRAME + 3) - 0.5) * shake);
  const open = lb < 0.5 ? 1 - eIn(clamp(lb / 0.5)) : 0;
  door(300, 360, 480, 800, open);
  if (lb >= 1.9) padlock(300 + 480 * 0.84, 360 + 800 * 0.52 + 140, 110, eOut(P(lb, 2, 0.2)));
  ctx.restore();
  slam(() => T('TÜREN ZU.', M, 1400, fit('TÜREN ZU.', W - 2 * M, {}, 230)), W / 2, 1320, P(lb, 0.5, 0.3), 1.6);
  typeOn('EINGANGSTÜR NIE OFFEN LASSEN.', M, 1480, 34, P(lb, 2.1, 0.7));
  typeOn('AUCH NICHT KURZ.', M, 1530, 34, P(lb, 3, 0.4));
  if (lb > 0.5 && lb < 0.56) { ctx.save(); ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H); ctx.restore(); BG = BLACK; }
}

function sZugang(lb) {
  BG = BLACK; FG = WHITE; bg();
  typeOn('ALLE ZUGÄNGE ZU:', M, 290, 40, P(lb, 0, 0.5));
  const bx0 = 170, bx1 = 720, gy = 1120, fh = 165;
  ctx.save(); ctx.strokeStyle = WHITE; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  ctx.strokeRect(bx0, gy - 4 * fh, bx1 - bx0, 4 * fh);
  ctx.beginPath(); ctx.moveTo(bx0 - 25, gy - 4 * fh); ctx.lineTo((bx0 + bx1) / 2, gy - 4 * fh - 120); ctx.lineTo(bx1 + 25, gy - 4 * fh); ctx.stroke();
  ctx.globalAlpha = 0.35; ctx.lineWidth = 2;
  for (let f = 1; f < 4; f++) { ctx.beginPath(); ctx.moveTo(bx0, gy - f * fh); ctx.lineTo(bx1, gy - f * fh); ctx.stroke(); }
  for (let f = 1; f < 4; f++) for (let c = 0; c < 3; c++) ctx.strokeRect(bx0 + 60 + c * 150, gy - f * fh - 125, 80, 70);
  ctx.globalAlpha = 1; ctx.lineWidth = 4;
  ctx.fillRect(0, gy, W, 4);
  ctx.setLineDash([12, 10]); ctx.strokeRect(bx0, gy + 4, bx1 - bx0, 150); ctx.setLineDash([]);
  ctx.restore();
  mono('KELLER', bx0 + 300, gy + 90, 28);
  // Feuertreppe aussen rechts
  ctx.save(); ctx.strokeStyle = WHITE; ctx.lineWidth = 4;
  for (let f = 0; f < 4; f++) {
    const y = gy - f * fh;
    ctx.beginPath(); ctx.moveTo(bx1, y - fh + 2); ctx.lineTo(bx1 + 170, y - fh + 2); ctx.stroke();
    ctx.beginPath(); for (let k = 0; k <= 6; k++) { const x = f % 2 ? bx1 + 20 + k * 25 : bx1 + 170 - k * 25, yy = y - k * (fh / 6); k ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke();
  }
  ctx.restore();
  mono('FEUERTREPPE', bx1 + 85, gy - 4 * fh - 30, 24, { align: 'center' });
  const items = [
    { t: 'EINGANGSTÜR', r: [[420, gy - 125, 70, 125]] },
    { t: 'UNTERE TÜREN UND WEGE', r: [[200, gy + 30, 60, 110]] },
    { t: 'TÜREN ZUR FEUERTREPPE', r: [0, 1, 2, 3].map(f => [bx1 - 50, gy - f * fh - 120, 46, 110]) },
    { t: 'KELLER UND VELORAUM', r: [[bx0 + 470, gy + 30, 70, 110]] },
  ];
  items.forEach((it, k) => {
    const p = P(lb, 1 + k * 0.75, 0.2), ty = 1370 + k * 62;
    it.r.forEach(([x, y, w, h]) => {
      ctx.save(); ctx.strokeStyle = WHITE; ctx.lineWidth = 4;
      if (p > 0) { ctx.fillStyle = WHITE; ctx.globalAlpha = eOut(p); ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1; ctx.fillStyle = BLACK; ctx.fillRect(x + w * 0.3, y + h * 0.45, w * 0.4, h * 0.25); }
      else { ctx.globalAlpha = 0.5 + 0.5 * Math.sin(lb * 12); ctx.strokeRect(x, y, w, h); }
      ctx.restore();
    });
    if (lb > 0.6 + k * 0.1) {
      ctx.strokeStyle = WHITE; ctx.lineWidth = 3; ctx.strokeRect(M, ty - 30, 32, 32);
      if (p > 0) { ctx.fillStyle = WHITE; ctx.fillRect(M + 6, ty - 24, 20 * eOut(p), 20); }
      mono(it.t, M + 56, ty, 36);
    }
  });
}

function sMelden(lb) {
  BG = WHITE; FG = BLACK; bg();
  typeOn('VERDÄCHTIGES BEMERKT?', M, 300, 44, P(lb, 0, 0.6));
  const p = P(lb, 0.7, 0.35), inv = lb > 1 && Math.floor(lb) % 2 === 1;
  if (p > 0) {
    if (inv) { ctx.fillStyle = BLACK; ctx.fillRect(0, 420, W, 560); }
    slam(() => T('117', W / 2, 900, 520, { align: 'center', col: inv ? WHITE : BLACK, ls: -0.05 }), W / 2, 700, p, 1.6);
  }
  rise('POLIZEI', M, 1140, 130, P(lb, 1.4, 0.4));
  typeOn('FREMDE IM HAUS? KOMISCHE GERÄUSCHE?', M, 1220, 32, P(lb, 2, 0.7));
  const s = fit('DEN NACHBAR:INNEN.', W - 2 * M, {}, 110);
  rise('UND SAG ES', M, 1400, s, P(lb, 3.4, 0.4));
  rise('DEN NACHBAR:INNEN.', M, 1400 + s * 0.95, s, P(lb, 3.7, 0.4));
}

function sOutro(lb) {
  BG = BLACK; FG = WHITE; bg();
  house(370, 470, 340, 300, k => lb > 0.4 + k * 0.15);
  const s = fit('AUFEINANDER', W - 2 * M, {}, 300);
  rise('PASST', M, 980 + s * 0.2, s, P(lb, 0.2, 0.4));
  rise('AUFEINANDER', M, 980 + s * 1.1, s, P(lb, 0.4, 0.4));
  rise('AUF.', M, 980 + s * 2.0, s, P(lb, 0.6, 0.4));
  typeOn('QUELLEN: BERNER ZEITUNG / DER BUND,', M, 1520, 26, P(lb, 2, 0.6));
  typeOn('KANTONSPOLIZEI BERN, BFS, MOBILIAR', M, 1560, 26, P(lb, 2.4, 0.6));
  hud(-1, 64 + lb);
}

const SECTIONS = [
  { s: 0, f: sIntro, i: -1 },
  { s: 8, f: sWann, i: 0 },
  { s: 16, f: sBern, i: 1 },
  { s: 24, f: sBeute, i: 2 },
  { s: 32, f: sQuote, i: 3 },
  { s: 40, f: sTuer, i: 4 },
  { s: 48, f: sZugang, i: 5 },
  { s: 56, f: sMelden, i: 6 },
  { s: 64, f: sOutro, i: -1 },
];

// Audio-Merkmale des Tracks pro Frame (features.js): kick, hat, clap, low, high, rms, kicks (Onset-Frames)
const F = window.FEAT;
let AF = { kick: 0, hat: 0, clap: 0, low: 0, high: 0, rms: 0 };
let FRAME = 0;
const NF = F.kick.length;
const specAt = (fr, b) => (fr < 0 ? 0 : (F.spec[Math.min(fr, NF - 1) * 32 + clamp(b, 0, 31)] || 0) / 99);
const waveAt = (fr, k) => (fr < 0 ? 0 : (F.wave[Math.min(fr, NF - 1) * 96 + clamp(k, 0, 95)] || 0) / 99);
// aufsummierte Kick-Energie: Dinge, die auf jedem Kick einen Schub machen
const KC = []; F.kick.reduce((a, v, i) => (KC[i] = a + v / 27), 0);
const kickCum = fr => KC[clamp(fr, 0, NF - 1)];
// Clap auf 2 und 4 (Beat 1 und 3 im Takt), gewichtet mit der gemessenen Clap-Energie
function backbeat(lb) {
  const q = (((lb % 4) + 4) % 4), d = q >= 3 ? q - 3 : q >= 1 ? q - 1 : 9;
  return Math.exp(-d * 7) * clamp(AF.clap);
}
function feat(frame) {
  FRAME = frame;
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
  if (B >= STOP) return { echo: 0.18 * clamp(1 - (B - STOP) / 2), warp: 0, mirror: false, waves: false };
  if (B >= 40 && B < 42) return { echo: 0, warp: 0, mirror: false, waves: false }; // Tür knallt: sauber
  if (B < 8) return { echo: 0.4, warp: 4, mirror: false, waves: false };
  if (B >= 48 && B < 56) return { echo: 0.08, warp: 1, mirror: false, waves: false }; // Gebäudeplan lesbar halten
  return { echo: 0.2, warp: 3, mirror: false, waves: true };
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
    const rot = 0.007 * Math.sin(t * 1.3) + 0;
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
window.ready = Promise.resolve().then(() => document.fonts.load(`900 100px "Inter Display"`))
  .then(() => document.fonts.load(`700 30px "JetBrains Mono"`))
  .then(() => document.fonts.load(`900 100px "Inter"`))
  .then(() => true);

// Vorschau im Browser: abspielen
if (location.hash === '#play') {
  const t0 = performance.now();
  const loop = () => { const f = Math.floor(((performance.now() - t0) / 1000) * FPS) % window.TOTAL_FRAMES; window.renderFrame(f); requestAnimationFrame(loop); };
  window.ready.then(loop);
}
