# Synthetischer Soundtrack, 120 BPM, synchron zu video.html (Cues aus render.js cues)
# Usage: python3 soundtrack.py cues.json out.wav
import json, sys, wave
import numpy as np
from scipy.signal import butter, lfilter

SR, DUR, BEAT = 48000, 120.0, 0.5
N = int(SR * DUR)
cues = json.load(open(sys.argv[1]))
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)
duck = np.ones(N)

def lp(x, f, o=2): b, a = butter(o, f / (SR / 2)); return lfilter(b, a, x)
def hp(x, f, o=2): b, a = butter(o, f / (SR / 2), 'high'); return lfilter(b, a, x)
def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0: return
    j0 = max(0, -i); sig = sig[j0:]; i = max(i, 0); n = min(len(sig), N - i)
    L[i:i+n] += sig[:n] * gain * (1 - max(0, pan)); R[i:i+n] += sig[:n] * gain * (1 + min(0, pan))
def tt(d): return np.arange(int(d * SR)) / SR
def saw(f, t): return 2 * ((f * t) % 1) - 1

# ---------- sections ----------
def full(t): return 8 <= t < 108 or 115 <= t < 117
def brk(t): return 108 <= t < 115

# ---------- drums ----------
def kick():
    t = tt(0.4); f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) + 0.3 * np.sin(ph * 2) * np.exp(-t * 30)
K = kick()
def hat(d=0.05):
    t = tt(d); return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * 90)
def clap():
    t = tt(0.25); n = hp(lp(rng.standard_normal(len(t)), 5000), 900)
    env = np.exp(-t * 22) + 0.5 * np.exp(-((t - 0.012) % 0.011) * 300) * (t < 0.035)
    return n * env

dk = np.ones(int(0.32 * SR)); dt_ = np.arange(len(dk)) / SR; dk = 1 - 0.75 * np.exp(-dt_ * 9)
nb = int(DUR / BEAT)
for b in range(nb):
    t = b * BEAT
    if full(t) or (brk(t) and b % 2 == 0):
        add(K, t, 0.95)
        i = int(t * SR); n = min(len(dk), N - i); duck[i:i+n] = np.minimum(duck[i:i+n], dk[:n])
    if full(t):
        add(hat(), t + BEAT / 2, 0.22, 0.3)
        add(hat(0.025), t + BEAT / 4, 0.08, -0.3); add(hat(0.025), t + 3 * BEAT / 4, 0.08, -0.3)
        if b % 2 == 1: add(clap(), t, 0.42)

# ---------- harmony: Am F C G ----------
prog = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [55, 60, 64]), (55, [55, 59, 62])]
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
padL = np.zeros(N); padR = np.zeros(N); bass = np.zeros(N)
for bar in range(int(DUR / 2)):
    t0 = bar * 2.0; root, chord = prog[bar % 4]
    t = tt(2.0); i = int(t0 * SR)
    a = np.minimum(1, t / 0.08) * np.minimum(1, (2.0 - t) / 0.08)
    sl = sum(saw(mf(m) * 1.004, t) + saw(mf(m + 12) * 0.997, t) * 0.4 for m in chord)
    sr = sum(saw(mf(m) * 0.996, t) + saw(mf(m + 12) * 1.003, t) * 0.4 for m in chord)
    padL[i:i+len(t)] += sl * a; padR[i:i+len(t)] += sr * a
    for e in range(4 * 2):  # 8tel-Bass
        te = t0 + e * 0.25
        if not (full(te) or brk(te)): continue
        tb = tt(0.24); f = mf(root - 24 + (12 if e % 4 == 3 else 0))
        s = (saw(f, tb) + 0.6 * np.sin(2 * np.pi * f * tb)) * np.exp(-tb * 6) * np.minimum(1, tb / 0.005)
        j = int(te * SR); bass[j:j+len(tb)] += s
tline = np.arange(N) / SR
# Filterfahrt: Intro zu, Drop offen, Breakdown zu
cut = np.interp(tline, [0, 7.9, 8, 39.0, 40.0, 41.5, 107.9, 108, 114.9, 115, 120], [500, 2600, 3200, 3200, 600, 3200, 3200, 700, 1800, 3200, 900])
def sweep_lp(x):
    out = np.zeros_like(x); seg = SR // 10
    zi = None
    for s in range(0, len(x), seg):
        b, a = butter(2, cut[s] / (SR / 2))
        from scipy.signal import lfilter_zi
        if zi is None: zi = lfilter_zi(b, a) * 0
        out[s:s+seg], zi = lfilter(b, a, x[s:s+seg], zi=zi)
    return out
padL = sweep_lp(padL); padR = sweep_lp(padR); bass = lp(bass, 900)
fadein = np.minimum(1, tline / 2.0); fadeout = np.clip((120 - tline) / 2.0, 0, 1)
L += padL * 0.05 * duck * fadein * fadeout; R += padR * 0.05 * duck * fadein * fadeout
bass_g = np.where((tline >= 8) & (tline < 117), 0.32, 0.0) * np.where((tline >= 108) & (tline < 115), 0.6, 1)
L += bass * bass_g * duck; R += bass * bass_g * duck

# ---------- FX ----------
def riser(d):
    t = tt(d); n = rng.standard_normal(len(t)); out = np.zeros_like(n); seg = SR // 50
    for s in range(0, len(n), seg):
        f = 300 + 7000 * (s / len(n)) ** 2; b, a = butter(2, [f / (SR / 2), min(0.99, f * 1.6 / (SR / 2))], 'band')
        out[s:s+seg] = lfilter(b, a, n[s:s+seg])
    return out * (t / d) ** 2
def impact():
    t = tt(1.4); f = 30 + 60 * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.5) + lp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 9) * 0.5
def blip(f, d=0.09, dec=40):
    t = tt(d); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * dec)
def whoosh(d=0.5):
    t = tt(d); n = rng.standard_normal(len(t)); env = np.sin(np.pi * t / d) ** 2
    return lp(hp(n, 400), 4000) * env

for r0, r1 in cues['risers']: add(riser(r1 - r0), r0, 0.45)
for B in cues['hits']: add(impact(), B, 0.8)
for x in cues['whoosh']: add(whoosh(0.7), x - 0.1, 0.32, 0.4 if int(x) % 2 else -0.4)
for x in cues['ticks']: add(blip(1760, 0.08, 50), x, 0.22, 0.2)
for k, x in enumerate(cues['checks']): add(blip(880 * 2 ** ((k * 2) / 12)) + blip(1320 * 2 ** ((k * 2) / 12)) * 0.5, x + 0.1, 0.2)
for x in cues['pops']: add(blip(520, 0.14, 25), x, 0.3)
for x in cues['coins']:
    for k in range(12): add(blip(2400 + 300 * (k % 3), 0.12, 30), x + k * 0.1, 0.08, (k % 3 - 1) * 0.5)
for x in cues['stamp']: add(impact()[:int(0.5 * SR)], x, 0.6)
for k, x in enumerate(cues['bars']): add(blip(660 * 2 ** (k / 12), 0.07, 45), x, 0.15, 0.3)

# ---------- master ----------
mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix /= np.max(np.abs(mix)) / 0.89
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok', mix.shape)
