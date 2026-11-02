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
function feat(frame) { FRAME = frame; const i = clamp(frame, 0, NF - 1); for (const k in AF) AF[k] = F[k][i] || 0; }

// ---------- Szenen-Zustand ----------
let BEAM, AMB_ART, AMB_TXT, SKY, LIGHTS, SHAKE;
function reset() {
  BEAM = { x: W / 2, y: H / 2, r: 420 }; AMB_ART = 0.07; AMB_TXT = 0.72; SKY = NIGHT; LIGHTS = 1; SHAKE = 0;
}
function beam(x, y, r) { BEAM = { x, y, r }; }
function chrome(idx) {
  use('txt');
  T('Hausinfo, Herbst 2026', M, 120, 28, { fam: TYPE, w: 'normal' });
  if (idx >= 0) T(`${idx + 1}/7`, W - M, 120, 28, { fam: TYPE, w: 'normal', align: 'right' });
  ctx.fillStyle = LIGHT; ctx.globalAlpha = 0.5; ctx.fillRect(M, H - 170, W - 2 * M, 1.5); ctx.globalAlpha = 1;
  T('Quelle: Berner Zeitung / Der Bund', M, H - 125, 26, { fam: TYPE, w: 'normal' });
}
function stroke(lw = 4) { ctx.strokeStyle = LIGHT; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; }

function house(x0, y0, w, h, lit) {
  use('art'); ctx.save(); stroke(4);
  ctx.beginPath(); ctx.moveTo(x0 - 30, y0); ctx.lineTo(x0 + w / 2, y0 - h * 0.32); ctx.lineTo(x0 + w + 30, y0); ctx.stroke();
  ctx.strokeRect(x0, y0, w, h);
  const cw = w / 3, rh = h / 3;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const k = r * 3 + c, x = x0 + c * cw + cw * 0.28, y = y0 + r * rh + rh * 0.25;
    use('art');
    if (r === 2 && c === 1) { ctx.strokeRect(x0 + cw * 1.25, y0 + 2 * rh + rh * 0.15, cw * 0.5, rh * 0.85); continue; }
    ctx.strokeRect(x, y, cw * 0.44, rh * 0.5);
    const l = lit(k);
    if (l > 0) { use('glow'); ctx.fillStyle = `rgba(242,233,212,${0.85 * l})`; ctx.fillRect(x, y, cw * 0.44, rh * 0.5); }
  }
  use('art'); ctx.restore();
}

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
  const [bx, by, br] = kf(l, [[0, 150, 700, 260], [2.4, 930, 700, 300], [3.4, 540, 1300, 520]]);
  beam(bx, by, br);
  house(330, 580, 420, 380, k => clamp(1 - (l - 0.2 - k * 0.2) * 4));
  use('txt');
  typew('Es ist wieder', M, 1180, 42, P(l, 0.3, 0.6));
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
    } else { use('art'); ctx.fillStyle = LIGHT; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill(); }
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
    use('txt'); appear(w, M + 90, 480 + k * 150, 130, p);
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
  for (let k = 0; k < 100; k++) { const a = k / 100 * Math.PI * 2 - Math.PI / 2; ctx.lineWidth = k % 10 ? 1.5 : 3; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (r - 14), cy + Math.sin(a) * (r - 14)); ctx.lineTo(cx + Math.cos(a) * (r - (k % 10 ? 26 : 40)), cy + Math.sin(a) * (r - (k % 10 ? 26 : 40))); ctx.stroke(); }
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
  const x0 = 300, y0 = 360, w = 480, h = 800, open = lb < 1 ? 1 - eIn((lb - 0.2) / 0.8) : 0;
  use('art'); ctx.save(); stroke(5);
  ctx.strokeRect(x0 - 10, y0 - 10, w + 20, h + 20);
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
    const s = 220;
    use('txt'); T('Türen', M, 1400, s); const tw = measure('Türen ', s, {});
    use('glow'); T('zu.', M + tw, 1400, s, { col: RED });
  }
  use('txt');
  typew('Eingangstür nie offen lassen.', M, 1490, 36, P(lb, 2.2, 1));
  typew('Auch nicht kurz.', M, 1545, 36, P(lb, 3.5, 0.6));
  chrome(4);
}

// 7: alle Zugänge
function sZugang(lb) {
  const bx0 = 170, bx1 = 720, gy = 1110, fh = 160;
  const spots = [[455, gy - 60], [230, gy + 85], [800, gy - 2.5 * fh], [bx0 + 505, gy + 85]];
  const keys = [[0, W / 2, 800, 520]];
  spots.forEach(([x, y], k) => { keys.push([0.8 + k * 0.8, x, y, 230]); keys.push([1.35 + k * 0.8, x, y, 230]); });
  keys.push([4.6, W / 2, 1450, 560]);
  const [bx, by, br] = kf(lb, keys); beam(bx, by, br);
  use('txt'); typew('Alle Zugänge zu:', M, 290, 40, P(lb, 0, 0.5));
  use('art'); ctx.save(); stroke(4);
  ctx.strokeRect(bx0, gy - 4 * fh, bx1 - bx0, 4 * fh);
  ctx.beginPath(); ctx.moveTo(bx0 - 25, gy - 4 * fh); ctx.lineTo((bx0 + bx1) / 2, gy - 4 * fh - 110); ctx.lineTo(bx1 + 25, gy - 4 * fh); ctx.stroke();
  ctx.lineWidth = 2;
  for (let f = 1; f < 4; f++) { ctx.beginPath(); ctx.moveTo(bx0, gy - f * fh); ctx.lineTo(bx1, gy - f * fh); ctx.stroke(); }
  for (let f = 1; f <= 3; f++) for (let c = 0; c < 3; c++) ctx.strokeRect(bx0 + 60 + c * 150, gy - f * fh - 120, 80, 66);
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
  ctx.setLineDash([10, 9]); ctx.strokeRect(bx0, gy + 4, bx1 - bx0, 150); ctx.setLineDash([]);
  ctx.lineWidth = 3;
  for (let f = 0; f < 4; f++) {
    const y = gy - f * fh;
    ctx.beginPath(); ctx.moveTo(bx1, y - fh + 2); ctx.lineTo(bx1 + 170, y - fh + 2); ctx.stroke();
    ctx.beginPath(); for (let k = 0; k <= 6; k++) { const x = f % 2 ? bx1 + 20 + k * 25 : bx1 + 170 - k * 25, yy = y - k * (fh / 6); k ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke();
  }
  const doors = [[[420, gy - 120, 70, 120]], [[200, gy + 30, 60, 110]], [0, 1, 2, 3].map(f => [bx1 - 48, gy - f * fh - 115, 44, 105]), [[bx0 + 470, gy + 30, 70, 110]]];
  ctx.lineWidth = 3; doors.flat().forEach(([x, y, w, h]) => ctx.strokeRect(x, y, w, h));
  ctx.restore();
  use('txt'); T('Keller', bx0 + 280, gy + 95, 30, { fam: TYPE, w: 'normal' }); T('Feuertreppe', bx1 + 85, gy - 4 * fh - 25, 26, { fam: TYPE, w: 'normal', align: 'center' });
  const items = ['Eingangstür', 'Untere Türen und Wege', 'Türen zur Feuertreppe', 'Keller und Waschküche'];
  items.forEach((t, k) => {
    const p = P(lb, 1.05 + k * 0.8, 0.3), ty = 1390 + k * 62;
    use('glow'); doors[k].forEach(([x, y, w, h]) => check(x + w / 2, y + h / 2, 44, p));
    use('art'); stroke(2.5); ctx.strokeRect(M, ty - 30, 34, 34);
    use('glow'); check(M + 17, ty - 13, 30, p);
    use('txt'); appear(t, M + 60, ty, 40, P(lb, 0.5 + k * 0.1, 0.5), { fam: TYPE, w: 'normal' });
  });
  chrome(5);
}

// 8: Polizei 117
function sMelden(lb) {
  const [bx, by, br] = kf(lb, [[0, W / 2, 340, 380], [0.8, W / 2, 860, 460], [3, W / 2, 1150, 460], [3.6, W / 2, 1420, 520]]);
  beam(bx, by, br);
  use('txt'); appear('Verdächtiges bemerkt?', M, 340, fit('Verdächtiges bemerkt?', W - 2 * M, {}, 110), P(lb, 0, 0.6));
  const p = P(lb, 0.7, 0.5), odd = lb > 1.2 && Math.floor(lb) % 2 === 1;
  if (p > 0) {
    use('glow');
    if (odd) { const g = ctx.createRadialGradient(W / 2, 760, 0, W / 2, 760, 520); g.addColorStop(0, 'rgba(232,64,47,0.35)'); g.addColorStop(1, 'rgba(232,64,47,0)'); ctx.fillStyle = g; ctx.fillRect(0, 300, W, 900); }
    ctx.save(); ctx.globalAlpha = eOut(p) * (odd ? 1 : 0.8); T('117', W / 2, 930, 480, { col: RED, align: 'center', ls: -0.02 }); ctx.restore();
  }
  use('txt');
  appear('Polizei', M, 1100, 120, P(lb, 1.3, 0.7), { it: true });
  typew('Fremde im Haus? Komische Geräusche?', M, 1180, 32, P(lb, 1.9, 0.9));
  const s = fit('den Nachbar:innen.', W - 2 * M, {}, 110);
  appear('Und sag es', M, 1390, s, P(lb, 3.3, 0.7));
  appear('den Nachbar:innen.', M, 1390 + s * 1.05, s, P(lb, 3.6, 0.7));
  chrome(6);
}

// 9: Passt aufeinander auf
function sOutro(lb) {
  beam(W / 2, lerp(700, 860, eOut(P(lb, 0, 3))), lerp(380, 560, eOut(P(lb, 0, 3))));
  AMB_TXT = 0.85;
  house(370, 520, 340, 300, k => eOut(P(lb, 0.3 + k * 0.18, 0.4)));
  use('txt');
  const s = fit('Passt aufeinander', W - 2 * M, {}, 150);
  appear('Passt aufeinander', M, 1150, s, P(lb, 0.4, 0.8));
  appear('auf.', M, 1150 + s * 1.05, s, P(lb, 0.8, 0.8), { it: true });
  typew('Quellen: Berner Zeitung / Der Bund,', M, 1470, 28, P(lb, 2, 0.6));
  typew('Kantonspolizei Bern, BFS, Mobiliar', M, 1512, 28, P(lb, 2.5, 0.6));
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
  const fl = LIGHTS * (0.9 + 0.1 * clamp(AF.kick, 0, 1.2) - 0.08 * hash(FRAME) * clamp(AF.hat - 0.7, 0, 1));
  const r = BEAM.r * (1 + 0.012 * Math.sin(B * 5.3));
  // Lichtkegel auf der Wand
  if (r > 20) {
    const g = t.createRadialGradient(BEAM.x, BEAM.y, 0, BEAM.x, BEAM.y, r * 1.3);
    g.addColorStop(0, `rgba(242,233,212,${0.14 * fl})`); g.addColorStop(0.65, `rgba(242,233,212,${0.05 * fl})`); g.addColorStop(1, 'rgba(242,233,212,0)');
    t.fillStyle = g; t.fillRect(0, 0, W, H);
    // Staub im Licht
    for (let i = 0; i < 40; i++) {
      const a = hash(i) * 6.283 + B * 0.1 * (hash(i + 4) - 0.5), d = Math.sqrt(hash(i + 7)) * r;
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
