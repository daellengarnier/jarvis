// Info fürs Haus: Einbruch-Saison. Eigener Look: Nacht, Taschenlampe, Serifenschrift, Signalrot.
// Zeichnungen liegen im Dunkeln und werden nur im Lichtkegel sichtbar. Takt und Länge aus features.js (window.CFG).
const C = window.CFG, F = window.FEAT;
const W = 1080, H = 1920, BEAT = C.beat, FPS = 60, END_BEATS = C.endBeats, STOP = C.stop;
const cv = document.getElementById('c');
const out = cv.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const artC = mk(), txtC = mk(), glowC = mk(), frA = mk(), frB = mk();
const LAY = { art: artC.getContext('2d'), txt: txtC.getContext('2d'), glow: glowC.getContext('2d') };
let ctx = LAY.art;
const NIGHT = '#0a0a0c', LIGHT = '#f2e9d4', RED = '#e8402f';
const SERIF = '"Bitstream Charter", "Liberation Serif", serif';
const TYPE = '"Courier 10 Pitch", "Liberation Mono", monospace';
const M = 80;

// ---------- Helfer ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const eOut = t => 1 - Math.pow(1 - clamp(t), 3);
const eIn = t => Math.pow(clamp(t), 3);
const eInOut = t => (t = clamp(t), t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const P = (lb, start, dur) => clamp((lb - start) / dur);
const use = k => (ctx = LAY[k]);

function font(size, o) { return `${o.it ? 'italic ' : ''}${o.w || 'bold'} ${size}px ${o.fam || SERIF}`; }
function T(s, x, y, size, o = {}) {
  ctx.font = font(size, o); ctx.letterSpacing = (o.ls || 0) * size + 'px';
  ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = o.col || LIGHT; ctx.fillText(s, x, y);
}
function measure(s, size, o = {}) { ctx.font = font(size, o); ctx.letterSpacing = (o.ls || 0) * size + 'px'; return ctx.measureText(s).width; }
function fit(s, maxW, o = {}, cap = 999) { return Math.min(cap, (100 * maxW) / measure(s, 100, o)); }
// ruhiges Einblenden: Laufweite zieht sich zusammen, Text steigt leicht
function appear(s, x, y, size, p, o = {}) {
  if (p <= 0) return;
  const e = eOut(p);
  ctx.save(); ctx.globalAlpha = e;
  T(s, x, y + (1 - e) * size * 0.22, size, { ...o, ls: (o.ls || -0.01) + (1 - e) * 0.12 });
  ctx.restore();
}
// Schreibmaschine
function typew(s, x, y, size, p, o = {}) {
  if (p <= 0) return;
  const n = Math.floor(clamp(p) * s.length);
  T(s.slice(0, n), x, y, size, { fam: TYPE, w: 'normal', ...o });
  if (p < 1 && Math.floor(p * 40) % 2 === 0) {
    const w = measure(s.slice(0, n), size, { fam: TYPE, w: 'normal' });
    ctx.fillStyle = o.col || LIGHT; ctx.fillRect(x + w + 3, y + 6, size * 0.55, 4);
  }
}
// handgezogene Ellipse, p = gezeichneter Anteil
function scribble(cx, cy, rx, ry, p, col = RED, lw = 6, seed = 1) {
  if (p <= 0) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath();
  const n = Math.floor(80 * clamp(p) * 1.15);
  for (let i = 0; i <= n; i++) {
    const a = -2.2 + (i / 80) * Math.PI * 2.3, wob = 1 + 0.06 * Math.sin(i * 0.4 + seed);
    const x = cx + Math.cos(a) * rx * wob, y = cy + Math.sin(a) * ry * wob;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke(); ctx.restore();
}
function check(x, y, s, p, col = RED) {
  if (p <= 0) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const a = [x - s * 0.45, y], b = [x - s * 0.1, y + s * 0.35], c = [x + s * 0.5, y - s * 0.45];
  const q = eOut(p) * 2;
  ctx.beginPath(); ctx.moveTo(...a);
  if (q < 1) ctx.lineTo(lerp(a[0], b[0], q), lerp(a[1], b[1], q));
  else { ctx.lineTo(...b); ctx.lineTo(lerp(b[0], c[0], q - 1), lerp(b[1], c[1], q - 1)); }
  ctx.stroke(); ctx.restore();
}
// Keyframes für den Lichtkegel: [[lb, x, y, r], ...]
function kf(lb, keys) {
  if (lb <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    if (lb <= keys[i][0]) {
      const [t0, ...a] = keys[i - 1], [t1, ...b] = keys[i], e = eInOut((lb - t0) / (t1 - t0));
      return a.map((v, k) => lerp(v, b[k], e));
    }
  }
  return keys[keys.length - 1].slice(1);
}

// ---------- Audio ----------
let FRAME = 0, AF = { kick: 0, hat: 0, low: 0, rms: 0 };
const NF = F.kick.length;
const KC = []; F.kick.reduce((a, v, i) => (KC[i] = a + v / 27), 0);
const kickCum = fr => KC[clamp(fr, 0, NF - 1)];
const specAt = (fr, b) => (fr < 0 ? 0 : (F.spec[Math.min(fr, NF - 1) * 32 + clamp(b, 0, 31)] || 0) / 99);
const waveAt = (fr, k) => (fr < 0 ? 0 : (F.wave[Math.min(fr, NF - 1) * 96 + clamp(k, 0, 95)] || 0) / 99);
const kicksUntil = fr => { let n = 0; for (const k of F.kicks) { if (k <= fr) n++; else break; } return n; };
const sinceKick = fr => { let d = 1e9; for (const k of F.kicks) { if (k <= fr) d = fr - k; else break; } return d; };
function feat(frame) { FRAME = frame; const i = clamp(frame, 0, NF - 1); for (const k in AF) AF[k] = F[k][i] || 0; }

// ---------- Szenen-Zustand ----------
let BEAM, AMB_ART, AMB_TXT, SKY, LIGHTS, SHAKE;
function reset() {
  BEAM = { x: W / 2, y: H / 2, r: 420 }; AMB_ART = 0.07; AMB_TXT = 0.72; SKY = NIGHT; LIGHTS = 1; SHAKE = 0;
}
function beam(x, y, r) { BEAM = { x, y, r }; }
function chrome(idx) {
  use('txt');
  T('Via 1, Herbst 2026', M, 120, 28, { fam: TYPE, w: 'normal' });
  if (idx >= 0) T(`${idx + 1}/7`, W - M - 70, 120, 28, { fam: TYPE, w: 'normal', align: 'right' });
  { const cx = W - M - 22, cy = 110, r = 22, a = kicksUntil(FRAME) * Math.PI / 30 - Math.PI / 2 + Math.PI / 30 * Math.exp(-sinceKick(FRAME) / 3) * 0;
    ctx.strokeStyle = LIGHT; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    use('glow'); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r * 0.85, cy + Math.sin(a) * r * 0.85); ctx.stroke(); use('txt'); }
  ctx.fillStyle = LIGHT; ctx.globalAlpha = 0.5; ctx.fillRect(M, H - 170, W - 2 * M, 1.5); ctx.globalAlpha = 1;
  T('Quelle: Berner Zeitung / Der Bund', M, H - 125, 26, { fam: TYPE, w: 'normal' });
  // Seismograf: zeichnet den Ton der letzten Sekunden auf, rote Feder rechts
  const sy = H - 215, n = 160, x1 = W - M;
  ctx.save(); ctx.strokeStyle = LIGHT; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.8; ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const fr = FRAME - (n - 1 - i), v = (F.rms[clamp(fr, 0, NF - 1)] || 0) * (fr < 0 ? 0 : 1);
    const y = sy - waveAt(fr, (i * 7) % 96) * 34 * v - (F.kick[clamp(fr, 0, NF - 1)] || 0) * 6 * (fr < 0 ? 0 : 1);
    const x = M + (x1 - M) * i / (n - 1); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke(); ctx.restore();
  use('glow'); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x1, sy - waveAt(FRAME, 0) * 34 * AF.rms - AF.kick * 6, 5, 0, Math.PI * 2); ctx.fill(); use('txt');
}
function stroke(lw = 4) { ctx.strokeStyle = LIGHT; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; }

// Unser Haus, Spinnereiweg 17, nach der Ostansicht: breites Dach mit Kamin, drei Geschosse,
// zwei Laubengänge, Feuertreppe aussen links, runder Turm rechts, unten Keller und Saal.
// Ursprung = Boden links vom Haupthaus, Masse in Planeinheiten, s = Massstab. lit(k, n) für Fenster.
const VIA_WIN = (() => {
  const w = [];
  for (const fy of [-300, -450]) for (const x of [150, 290, 430, 570]) { w.push([x, fy + 40, 28, 58]); w.push([x + 36, fy + 40, 28, 58]); }
  for (const fy of [-150, -300]) for (const x of [785, 830]) w.push([x, fy - 110, 22, 52]);
  return w;
})();
function via(ox, gy, s, lit = () => 0, o = {}) {
  use('art'); ctx.save(); ctx.translate(ox, gy); ctx.scale(s, s);
  const lw = v => (ctx.lineWidth = v / s);
  ctx.strokeStyle = LIGHT; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  lw(3); ctx.beginPath(); ctx.moveTo(-130, 0); ctx.lineTo(1010, 0); ctx.stroke();
  lw(4); ctx.strokeRect(100, -450, 660, 450);
  // Dach mit Vordach und Kamin
  ctx.beginPath(); ctx.moveTo(40, -440); ctx.lineTo(210, -565); ctx.lineTo(650, -565); ctx.lineTo(820, -440); ctx.closePath(); ctx.stroke();
  lw(2); ctx.beginPath(); ctx.moveTo(60, -455); ctx.lineTo(800, -455); ctx.stroke();
  lw(3); ctx.strokeRect(410, -615, 42, 50); ctx.strokeRect(404, -622, 54, 8);
  // Geschossdecken
  lw(1.5); for (const y of [-150, -300]) { ctx.beginPath(); ctx.moveTo(100, y); ctx.lineTo(760, y); ctx.stroke(); }
  // Turm rechts
  lw(3.5); ctx.beginPath(); ctx.moveTo(760, 0); ctx.lineTo(760, -470); ctx.arc(820, -470, 60, Math.PI, 0); ctx.lineTo(880, 0); ctx.stroke();
  lw(1); for (let x = 772; x < 880; x += 14) { ctx.beginPath(); ctx.moveTo(x, -6); ctx.lineTo(x, -470 + (Math.abs(x - 820) > 50 ? 25 : 0)); ctx.globalAlpha = 0.35; ctx.stroke(); ctx.globalAlpha = 1; }
  // Fenster und Türen
  lw(2.2); VIA_WIN.forEach(([x, y, w, h]) => ctx.strokeRect(x, y, w, h));
  for (const x of [165, 490]) ctx.strokeRect(x, -100, 40, 100);
  lw(3); for (const [x, y] of VIA_DOORS) { ctx.strokeRect(x, y - 100, 40, 100); ctx.beginPath(); ctx.moveTo(x + 32, y - 55); ctx.lineTo(x + 32, y - 42); ctx.stroke(); }
  lw(2.2);
  // Laubengänge mit Geländer
  for (const y of [-150, -300]) {
    lw(4); ctx.beginPath(); ctx.moveTo(120, y); ctx.lineTo(745, y); ctx.stroke();
    lw(2); ctx.beginPath(); ctx.moveTo(120, y - 46); ctx.lineTo(745, y - 46); ctx.stroke();
    lw(0.8); ctx.globalAlpha = 0.5; for (let x = 128; x < 745; x += 11) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 46); ctx.stroke(); } ctx.globalAlpha = 1;
  }
  // Feuertreppe aussen links: Boden bis 1. OG, dann bis 2. OG
  const flight = (x0, y0, x1, y1, n) => {
    lw(3); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.moveTo(x0, y0 - 44); ctx.lineTo(x1, y1 - 44); ctx.stroke();
    lw(1.5); for (let k = 1; k < n; k++) { const t = k / n, x = lerp(x0, x1, t), y = lerp(y0, y1, t); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 14, y); ctx.stroke(); }
  };
  flight(-110, 0, 120, -150, 12); flight(120, -150, 280, -300, 11);
  // unten: Keller und Saal unter dem Boden
  if (o.under !== false) { lw(2); ctx.setLineDash([10 / s, 9 / s]); ctx.strokeRect(100, 6, 660, 165); ctx.setLineDash([]); ctx.strokeRect(130, 40, 50, 110); ctx.strokeRect(560, 40, 60, 110); }
  ctx.restore();
  // leuchtende Fenster
  use('glow'); ctx.save(); ctx.translate(ox, gy); ctx.scale(s, s);
  VIA_WIN.forEach(([x, y, w, h], k) => { const l = lit(k, VIA_WIN.length); if (l > 0) { ctx.fillStyle = `rgba(242,233,212,${0.85 * l})`; ctx.fillRect(x, y, w, h); } });
  ctx.restore(); use('art');
}
const viaPt = (ox, gy, s, x, y) => [ox + x * s, gy + y * s];
// Türen auf die Laubengänge, je zwei pro Stock: [x, Boden-y]
const VIA_DOORS = [[325, 0], [645, 0], [232, -150], [672, -150], [232, -300], [672, -300]];

// 1: Die Tage werden kürzer, Einbruch-Saison
function sIntro(lb) {
  if (lb < 4) {
    const day = 1 - clamp(lb / 3.4);
    SKY = `rgb(${lerp(10, 74, day) | 0},${lerp(10, 64, day) | 0},${lerp(12, 52, day) | 0})`;
    AMB_ART = lerp(0.1, 1, day); AMB_TXT = 1; beam(-900, -900, 10);
    use('art'); const hz = 960, cy = lerp(620, 1080, eInOut(lb / 3.4));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, hz); ctx.clip();
    ctx.fillStyle = LIGHT; ctx.beginPath(); ctx.arc(W / 2, cy, 210, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = LIGHT; ctx.fillRect(0, hz, W, 3);
    use('txt');
    const s = fit('werden kürzer.', W - 2 * M, {}, 150);
    appear('Die Tage', M, 1220, s, P(lb, 0.1, 0.8));
    appear('werden kürzer.', M, 1220 + s * 1.05, s, P(lb, 1.1, 0.8), { it: true });
    chrome(-1);
    return;
  }
  const l = lb - 4;
  const [bx, by, br] = kf(l, [[0, 180, 760, 280], [2.4, 900, 760, 320], [3.4, 540, 1300, 520]]);
  beam(bx, by, br);
  via(150, 1000, 0.8, (k, n) => clamp(1 - (l - 0.2 - hash(k * 3.1) * 2) * 4) * (0.8 + 0.2 * hash(FRAME + k) * clamp(AF.hat)), { under: false });
  use('txt');
  typew('Es ist wieder', M, 1190, 42, P(l, 0.3, 0.6));
  const s = fit('Einbruch-Saison.', W - 2 * M, {}, 140);
  appear('Einbruch-Saison.', M, 1180 + s * 1.15, s, P(l, 1, 0.8));
  use('glow'); ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.lineCap = 'round';
  const u = eOut(P(l, 1.8, 0.7)); ctx.beginPath(); ctx.moveTo(M, 1180 + s * 1.15 + 26); ctx.lineTo(M + (W - 2 * M) * u, 1180 + s * 1.15 + 26 + Math.sin(u * 3) * 4); ctx.stroke(); ctx.restore();
  chrome(-1);
}

// 2: Freitag, 17 bis 18 Uhr
function sWann(lb) {
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'], cw = (W - 2 * M) / 7;
  const act = lb < 1.5 ? Math.floor(lb * 5) % 7 : 4, ccx = k => M + cw * k + cw / 2;
  const [bx, by, br] = lb < 2.7 ? [ccx(act), 440, 170] : kf(lb, [[2.7, ccx(4), 440, 170], [3.2, W / 2, 1110, 300], [4.5, W / 2, 1300, 520]]);
  beam(bx, by, br);
  use('txt'); typew('Wann wird eingebrochen?', M, 300, 40, P(lb, 0, 0.6));
  days.forEach((d, k) => {
    use('art'); stroke(2.5); ctx.strokeRect(M + k * cw + 6, 380, cw - 12, 120);
    use('txt'); T(d, ccx(k), 455, 40, { fam: TYPE, w: 'normal', align: 'center' });
  });
  use('glow'); scribble(ccx(4), 440, cw * 0.62, 78, P(lb, 1.5, 0.5));
  use('txt');
  appear('Freitags.', M, 700, 150, P(lb, 1.8, 0.7));
  typew('18 % aller Einbrüche im Kanton Bern', M, 775, 32, P(lb, 2.2, 0.8));
  // Uhr
  const cx = W / 2, cy = 1110, r = 175, toA = h => (h % 12) / 12 * Math.PI * 2 - Math.PI / 2;
  const fill = eOut(P(lb, 4, 0.6));
  if (fill > 0) { use('glow'); ctx.fillStyle = 'rgba(232,64,47,0.9)'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r - 6, toA(17), toA(17) + Math.PI / 6 * fill); ctx.closePath(); ctx.fill(); }
  use('art'); stroke(5); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 0.85, cy + Math.sin(a) * r * 0.85); ctx.lineTo(cx + Math.cos(a) * r * 0.95, cy + Math.sin(a) * r * 0.95); ctx.stroke(); }
  const hh = lerp(9, 17, eInOut(P(lb, 2.9, 1.1)));
  stroke(10); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(toA(hh)) * r * 0.5, cy + Math.sin(toA(hh)) * r * 0.5); ctx.stroke();
  stroke(5); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(toA(hh * 12)) * r * 0.78, cy + Math.sin(toA(hh * 12)) * r * 0.78); ctx.stroke();
  { const sa = kicksUntil(FRAME) * Math.PI / 30 - Math.PI / 2; use('glow'); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - Math.cos(sa) * 30, cy - Math.sin(sa) * 30); ctx.lineTo(cx + Math.cos(sa) * r * 0.9, cy + Math.sin(sa) * r * 0.9); ctx.stroke(); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill(); use('art'); }
  use('txt');
  appear('Zwischen 17 und 18 Uhr.', M, 1450, fit('Zwischen 17 und 18 Uhr.', W - 2 * M, {}, 110), P(lb, 4.3, 0.7));
  typew('am häufigsten (Bundesamt für Statistik)', M, 1520, 30, P(lb, 4.8, 0.8));
  chrome(0);
}

// 3: Stadt Bern 10,1 pro 1000
function sBern(lb) {
  const [bx, by, br] = kf(lb, [[0, M, 760, 240], [3.6, W - M, 1200, 300], [4.3, W / 2, 1400, 480]]);
  beam(bx, by, br);
  use('txt'); typew('Stadt Bern, 2025', M, 290, 40, P(lb, 0, 0.5));
  use('glow'); T((10.1 * eOut(P(lb, 0.2, 1.6))).toFixed(1).replace('.', ','), M - 8, 590, 300, { col: RED, ls: -0.03 });
  use('txt'); typew('Einbrüche pro 1000 Einwohner:innen', M, 665, 32, P(lb, 0.8, 0.8));
  const cols = 40, rows = 25, sx = (W - 2 * M) / cols, y0 = 760;
  const hot = [37, 151, 266, 309, 428, 515, 602, 688, 777, 893];
  for (let i = 0; i < cols * rows; i++) {
    const x = M + (i % cols) * sx + sx / 2, y = y0 + Math.floor(i / cols) * sx, k = hot.indexOf(i);
    if (k >= 0 && lb > 1.8 + k * 0.2) {
      use('glow'); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x, y, 3 + 6 * eOut(P(lb, 1.8 + k * 0.2, 0.3)) * (1 + 0.2 * clamp(AF.kick, 0, 1.2)), 0, Math.PI * 2); ctx.fill();
    } else { const c = i % cols, rr = Math.floor(i / cols), v = specAt(FRAME, Math.floor(c * 32 / cols)), on = (rows - rr) / rows < v * 1.1; use('art'); ctx.fillStyle = LIGHT; ctx.beginPath(); ctx.arc(x, y, on ? 4.2 : 2.2, 0, Math.PI * 2); ctx.fill(); }
  }
  use('txt'); appear('Rund 1 von 100.', M, 1440, 130, P(lb, 4.2, 0.7), { it: true });
  chrome(1);
}

// 4: Beute
function bike(cx, cy, s, rot) {
  use('art'); ctx.save(); stroke(5);
  const r = 0.42 * s, A = [cx - 0.62 * s, cy], B = [cx + 0.62 * s, cy], Bb = [cx - 0.05 * s, cy], S = [cx - 0.22 * s, cy - 0.62 * s], Hd = [cx + 0.42 * s, cy - 0.7 * s];
  for (const [x, y] of [A, B]) {
    ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1.5;
    for (let k = 0; k < 12; k++) { const a = rot + k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.stroke(); }
  }
  ctx.lineWidth = 5; ctx.beginPath();
  ctx.moveTo(...A); ctx.lineTo(...S); ctx.lineTo(...Bb); ctx.lineTo(...A);
  ctx.moveTo(...S); ctx.lineTo(Hd[0] - 0.04 * s, Hd[1] + 0.12 * s); ctx.lineTo(...Bb);
  ctx.moveTo(...Hd); ctx.lineTo(...B);
  ctx.moveTo(S[0] - 0.1 * s, S[1] - 0.06 * s); ctx.lineTo(S[0] + 0.12 * s, S[1] - 0.06 * s);
  ctx.moveTo(Hd[0] - 0.1 * s, Hd[1]); ctx.lineTo(Hd[0] + 0.1 * s, Hd[1] - 0.04 * s);
  ctx.stroke(); ctx.restore();
}
function sBeute(lb) {
  const [bx, by, br] = kf(lb, [[0, 380, 520, 260], [2.2, 380, 860, 300], [2.9, 560, 1290, 360], [4.5, 560, 1330, 420]]);
  beam(bx, by, br);
  use('txt'); typew('Gesucht wird vor allem:', M, 300, 40, P(lb, 0, 0.6));
  ['Schmuck', 'Bargeld', 'Velos', 'E-Bikes'].forEach((w, k) => {
    const p = P(lb, 0.5 + k * 0.45, 0.6);
    use('glow'); if (p > 0) T(String(k + 1).padStart(2, '0'), M, 470 + k * 150, 34, { fam: TYPE, w: 'bold', col: RED });
    use('txt'); ctx.save(); const z = 1 + 0.025 * clamp(AF.kick, 0, 1.2) * (p >= 1); ctx.translate(M + 90, 480 + k * 150); ctx.scale(z, z); appear(w, 0, 0, 130, p); ctx.restore();
  });
  bike(lerp(-400, 560, eOut(P(lb, 2.2, 1))), 1300, 360, kickCum(FRAME) * 1.6);
  use('txt'); typew('Velos und E-Bikes oft aus dem Keller.', M, 1570, 32, P(lb, 3.3, 0.9));
  chrome(2);
}

// 5: nur 22 % aufgeklärt
function sQuote(lb) {
  const [bx, by, br] = kf(lb, [[0, W / 2, 720, 380], [2.6, W / 2, 760, 400], [3.4, W / 2, 1300, 520]]);
  beam(bx, by, br);
  use('txt'); typew('Aufgeklärt werden nur', M, 300, 40, P(lb, 0, 0.6));
  const cx = W / 2, cy = 730, r = 300, p = eOut(P(lb, 0.5, 1.5)) * 0.22;
  use('art'); stroke(3); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  for (let k = 0; k < 100; k++) { const a = k / 100 * Math.PI * 2 - Math.PI / 2; const v = specAt(FRAME, Math.floor(Math.abs(k - 50) / 50 * 31)), len = (k % 10 ? 22 : 36) + v * 60; ctx.lineWidth = k % 10 ? 1.5 : 3; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (r - 14), cy + Math.sin(a) * (r - 14)); ctx.lineTo(cx + Math.cos(a) * (r - 14 - len), cy + Math.sin(a) * (r - 14 - len)); ctx.stroke(); }
  use('glow'); ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); ctx.stroke(); ctx.restore();
  T(Math.round(p * 100) + ' %', cx, cy + 75, 210, { col: RED, align: 'center' });
  use('txt');
  typew('der Einbruchdiebstähle im Kanton Bern, 2025.', M, 1140, 32, P(lb, 2, 0.9));
  appear('Vorbeugen', M, 1360, 130, P(lb, 3.3, 0.7), { it: true });
  appear('lohnt sich.', M, 1500, 130, P(lb, 3.6, 0.7), { it: true });
  chrome(3);
}

// 6: Türen zu
function sTuer(lb) {
  const [bx, by, br] = kf(lb, [[0, 540, 760, 420], [4.6, 540, 760, 420], [5.4, 560, 1120, 640]]);
  beam(bx, by, br);
  // Tür knallt auf lb 1, genau wenn die Musik wegbricht: Licht fällt aus und flackert wieder an
  if (lb > 1 && lb < 1.15) LIGHTS = 0;
  else if (lb >= 1.15 && lb < 1.6) LIGHTS = hash(FRAME * 3) > 0.35 ? 1 : 0.2;
  SHAKE = lb > 1 ? Math.exp(-(lb - 1) * 4) * 18 : 0;
  const x0 = 320, y0 = 300, w = 440, h = 740, open = lb < 1 ? 1 - eIn((lb - 0.2) / 0.8) : 0;
  use('art'); ctx.save(); stroke(5);
  ctx.lineWidth = 5 + 5 * clamp(AF.low, 0, 1.2); ctx.strokeRect(x0 - 10, y0 - 10, w + 20, h + 20); ctx.lineWidth = 5;
  const a = open * 1.25, dw = Math.max(10, w * Math.cos(a)), sk = h * 0.09 * Math.sin(a);
  ctx.fillStyle = NIGHT; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + dw, y0 - sk); ctx.lineTo(x0 + dw, y0 + h + sk); ctx.lineTo(x0, y0 + h); ctx.closePath(); ctx.fill(); ctx.stroke();
  for (let k = 0; k < 3; k++) { ctx.lineWidth = 2; ctx.strokeRect(x0 + dw * 0.12, y0 + 60 + k * 240, dw * 0.76, 190); }
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0 + dw * 0.86, y0 + h * 0.5 - 30); ctx.lineTo(x0 + dw * 0.86, y0 + h * 0.5 + 30); ctx.stroke();
  ctx.restore();
  if (lb >= 4.95) {
    use('glow'); const c = eOut(P(lb, 5, 0.2)), px = x0 + w * 0.86, py = y0 + h * 0.5 + 150, s = 100;
    ctx.save(); ctx.strokeStyle = RED; ctx.fillStyle = RED; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.arc(px, py - s * 0.35 - (1 - c) * 30, s * 0.3, Math.PI, 0); ctx.stroke();
    ctx.fillRect(px - s * 0.48, py - s * 0.3, s * 0.96, s * 0.78); ctx.restore();
  }
  if (lb >= 1.15) {
    use('txt'); T('Fischöiglers,', M, 1215, 90, { it: true });
    const s = 220;
    use('txt'); T('Türen', M, 1420, s); const tw = measure('Türen ', s, {});
    use('glow'); T('zu.', M + tw, 1420, s, { col: RED });
  }
  use('txt');
  typew('Eingangstür nie offen lassen.', M, 1510, 36, P(lb, 2.2, 1));
  typew('Sie schliesst nicht immer von selbst.', M, 1565, 36, P(lb, 3.5, 1));
  chrome(4);
}

// 7: alle Zugänge
function sZugang(lb) {
  const ox = 175, gy = 1030, sc = 0.84, pt = (x, y) => viaPt(ox, gy, sc, x, y);
  const items = [
    { t: 'UNTEN: Eingangstür', at: [pt(155, 95)] },
    { t: 'OBEN: Feuertreppe', at: [pt(10, -80), pt(200, -228)] },
    { t: 'Türen auf jedem Stock', at: VIA_DOORS.map(([x, y]) => pt(x + 20, y - 50)) },
    { t: 'Keller und Waschküche', at: [pt(590, 95)] },
  ];
  const keys = [[0, W / 2, 800, 520]];
  items.forEach((it, k) => { const [x, y] = it.at[0]; keys.push([0.75 + k, x, y, k === 2 ? 380 : 230]); keys.push([1.6 + k, k === 2 ? W / 2 : x, k === 2 ? 870 : y, k === 2 ? 420 : 230]); });
  keys.push([4.6, W / 2, 1450, 560]);
  const [bx, by, br] = kf(lb, keys); beam(bx, by, br);
  use('txt'); typew('Alle Zugänge zu:', M, 290, 40, P(lb, 0, 0.5));
  via(ox, gy, sc, (k, n) => 0.35 + 0.15 * hash(k));
  use('txt');
  T('OBEN', ...pt(-120, -330), 30, { fam: TYPE, w: 'bold' });
  T('UNTEN', ...pt(-120, 120), 30, { fam: TYPE, w: 'bold' });
  T('Keller', ...pt(330, 110), 28, { fam: TYPE, w: 'normal' });
  items.forEach((it, k) => {
    const p = P(lb, 1 + k, 0.25), ty = 1390 + k * 62;
    use('glow'); it.at.forEach(([x, y], j) => check(x, y, 40, P(lb, 1 + k + j * (k === 2 ? 0.125 : 0.25), 0.2)));
    use('art'); stroke(2.5); ctx.strokeRect(M, ty - 30, 34, 34);
    use('glow'); check(M + 17, ty - 13, 30, p);
    use('txt'); appear(it.t, M + 60, ty, 40, P(lb, 0.5 + k * 0.1, 0.5), { fam: TYPE, w: 'normal' });
  });
  chrome(5);
}

// 8: Polizei 117
function sMelden(lb) {
  const [bx, by, br] = kf(lb, [[0, W / 2, 340, 380], [0.8, W / 2, 560, 420], [1.6, W / 2, 900, 460], [3, W / 2, 1180, 460], [3.6, W / 2, 1420, 520]]);
  beam(bx, by, br);
  use('txt'); appear('Verdächtiges bemerkt?', M, 330, fit('Verdächtiges bemerkt?', W - 2 * M, {}, 110), P(lb, 0, 0.6));
  appear('Reto holen', M, 560, 170, P(lb, 0.7, 0.7), { it: true });
  typew('oder die Polizei anrufen:', M, 650, 36, P(lb, 1.3, 0.6));
  const p = P(lb, 1.8, 0.5), kk = clamp(AF.kick, 0, 1.2);
  if (p > 0) {
    use('glow');
    const g = ctx.createRadialGradient(W / 2, 880, 0, W / 2, 880, 360 + 200 * kk); g.addColorStop(0, `rgba(232,64,47,${0.1 + 0.3 * kk})`); g.addColorStop(1, 'rgba(232,64,47,0)'); ctx.fillStyle = g; ctx.fillRect(0, 500, W, 800);
    ctx.save(); ctx.globalAlpha = eOut(p) * (0.75 + 0.25 * kk); T('117', W / 2, 1030, 400, { col: RED, align: 'center', ls: -0.02 }); ctx.restore();
  }
  use('txt');
  typew('Fremde im Haus? Komische Geräusche?', M, 1150, 32, P(lb, 2.4, 0.9));
  const s = fit('den Nachbar:innen.', W - 2 * M, {}, 100);
  appear('Und sag es', M, 1400, s, P(lb, 3.4, 0.7));
  appear('den Nachbar:innen.', M, 1400 + s * 1.05, s, P(lb, 3.7, 0.7));
  chrome(6);
}

// 9: Passt aufeinander auf
function sOutro(lb) {
  beam(W / 2, lerp(640, 760, eOut(P(lb, 0, 3))), lerp(380, 600, eOut(P(lb, 0, 3))));
  AMB_TXT = 0.85;
  via(190, 800, 0.62, (k, n) => eOut(P(lb, 0.4 + hash(k * 7.7) * 3, 0.15)) * (0.85 + 0.15 * clamp(AF.kick, 0, 1)), { under: false });
  use('txt');
  const s = fit('richtig trennen.', W - 2 * M, {}, 140);
  appear('Türen zu und', M, 1000, s, P(lb, 0.4, 0.8));
  appear('Abfall', M, 1000 + s * 1.05, s, P(lb, 0.8, 0.8));
  appear('richtig trennen.', M, 1000 + s * 2.1, s, P(lb, 1.1, 0.8));
  use('glow'); appear('Das Einzige, was hilft.', M, 1000 + s * 2.1 + 90, 46, P(lb, 2, 0.8), { it: true, col: RED });
  use('txt');
  typew('Quellen: Berner Zeitung / Der Bund,', M, 1500, 28, P(lb, 2.8, 0.6));
  typew('Kantonspolizei Bern, BFS, Mobiliar', M, 1542, 28, P(lb, 3.2, 0.6));
  chrome(-1);
}

const SECTIONS = [
  { s: 0, f: sIntro }, { s: 8, f: sWann }, { s: 16, f: sBern }, { s: 24, f: sBeute }, { s: 32, f: sQuote },
  { s: 39, f: sTuer }, { s: 48, f: sZugang }, { s: 56, f: sMelden }, { s: 64, f: sOutro },
];

// ---------- Komposition ----------
function maskLayer(c, amb, r, fl) {
  const x = c.getContext('2d'); x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-in';
  const g = x.createRadialGradient(BEAM.x, BEAM.y, r * 0.5, BEAM.x, BEAM.y, Math.max(r, 1));
  g.addColorStop(0, `rgba(0,0,0,${clamp(fl)})`); g.addColorStop(1, `rgba(0,0,0,${amb * clamp(LIGHTS + 0.15)})`);
  x.fillStyle = g; x.fillRect(0, 0, W, H); x.restore();
}
const grains = [];
for (let k = 0; k < 6; k++) {
  const c = document.createElement('canvas'); c.width = 540; c.height = 960;
  const g = c.getContext('2d'), im = g.createImageData(540, 960); let sd = 999 + k * 77;
  for (let i = 0; i < im.data.length; i += 4) { sd = (sd * 16807) % 2147483647; const v = (sd / 2147483647) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  g.putImageData(im, 0, 0); grains.push(c);
}
function compose(k, B, target) {
  const sec = SECTIONS[k], lb = B - sec.s;
  for (const c of Object.values(LAY)) { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, W, H); }
  reset(); sec.f(lb);
  const t = target.getContext('2d');
  t.setTransform(1, 0, 0, 1, 0, 0); t.globalAlpha = 1; t.globalCompositeOperation = 'source-over';
  t.fillStyle = SKY; t.fillRect(0, 0, W, H);
  const fl = LIGHTS * (0.8 + 0.28 * clamp(AF.kick, 0, 1.2) - 0.1 * hash(FRAME) * clamp(AF.hat - 0.6, 0, 1));
  const r = BEAM.r * (1 + 0.012 * Math.sin(B * 5.3) + 0.05 * clamp(AF.kick, 0, 1.2));
  BEAM.x += (hash(FRAME * 7) - 0.5) * 7 * clamp(AF.hat, 0, 1.3); BEAM.y += (hash(FRAME * 11) - 0.5) * 7 * clamp(AF.hat, 0, 1.3);
  // Lichtkegel auf der Wand
  if (r > 20) {
    const g = t.createRadialGradient(BEAM.x, BEAM.y, 0, BEAM.x, BEAM.y, r * 1.3);
    g.addColorStop(0, `rgba(242,233,212,${0.14 * fl})`); g.addColorStop(0.65, `rgba(242,233,212,${0.05 * fl})`); g.addColorStop(1, 'rgba(242,233,212,0)');
    t.fillStyle = g; t.fillRect(0, 0, W, H);
    // Staub im Licht
    for (let i = 0; i < 40; i++) {
      const a = hash(i) * 6.283 + B * (0.1 + 0.4 * AF.rms) * (hash(i + 4) - 0.5), d = Math.sqrt(hash(i + 7)) * r;
      t.fillStyle = `rgba(242,233,212,${0.25 * fl * (1 - d / r)})`; t.fillRect(BEAM.x + Math.cos(a) * d, BEAM.y + Math.sin(a) * d + ((B * 8 + i * 13) % 40) - 20, 2, 2);
    }
  }
  maskLayer(artC, AMB_ART, r, fl); maskLayer(txtC, AMB_TXT, r, Math.max(fl, AMB_TXT));
  const sx = (hash(FRAME) - 0.5) * SHAKE, sy = (hash(FRAME + 9) - 0.5) * SHAKE;
  t.drawImage(artC, sx, sy); t.drawImage(txtC, sx * 0.6, sy * 0.6); t.drawImage(glowC, sx, sy);
}
function render(time, frame) {
  feat(frame);
  const B = time / BEAT;
  let k = 0;
  while (k + 1 < SECTIONS.length && B >= SECTIONS[k + 1].s) k++;
  compose(k, B, frA);
  out.setTransform(1, 0, 0, 1, 0, 0); out.globalAlpha = 1; out.globalCompositeOperation = 'source-over';
  out.drawImage(frA, 0, 0);
  const nx = SECTIONS[k + 1], WIN = 0.5;
  if (nx && B > nx.s - WIN) { compose(k + 1, B, frB); out.globalAlpha = eInOut((B - (nx.s - WIN)) / WIN); out.drawImage(frB, 0, 0); out.globalAlpha = 1; }
  // Vignette und Korn
  const v = out.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)');
  out.fillStyle = v; out.fillRect(0, 0, W, H);
  out.save(); out.globalAlpha = 0.05; out.imageSmoothingEnabled = false;
  out.drawImage(grains[frame % grains.length], -((frame * 37) % 60), -((frame * 53) % 60), 1200, 2040); out.restore();
  // ausblenden am Schluss
  const fade = clamp((B - (END_BEATS - 3)) / 3);
  if (fade > 0) { out.fillStyle = `rgba(0,0,0,${fade})`; out.fillRect(0, 0, W, H); }
}

window.TOTAL_FRAMES = Math.ceil(END_BEATS * BEAT * FPS);
window.FPS = FPS;
window.renderFrame = f => render(f / FPS, f);
window.ready = document.fonts.load(`bold 100px "Bitstream Charter"`)
  .then(() => document.fonts.load(`italic bold 100px "Bitstream Charter"`))
  .then(() => document.fonts.load(`100px "Courier 10 Pitch"`))
  .then(() => document.fonts.load(`bold 100px "Courier 10 Pitch"`))
  .then(() => true);
if (location.hash === '#play') {
  const t0 = performance.now();
  const loop = () => { const f = Math.floor(((performance.now() - t0) / 1000) * FPS) % window.TOTAL_FRAMES; render(f / FPS, f); requestAnimationFrame(loop); };
  window.ready.then(loop);
}
