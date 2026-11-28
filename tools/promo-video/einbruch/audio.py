# Soundtrack "Einbruch-Saison", 124 BPM, D-Moll, dunkel. Alles synthetisiert.
# Szenen à 8 Beats: Intro 0, Wann 8, Bern 16, Beute 24, Quote 32, Tür 40, Zugänge 48, Melden 56, Outro 64-72.
import numpy as np, wave, sys
from scipy.signal import butter, sosfilt

SR = 48000; BPM = 124; BEAT = 60 / BPM
TOTAL = 76; N = int(TOTAL * BEAT * SR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(11)
def at(b): return int(round(b * BEAT * SR))
def add(sig, b, g=1.0, pan=0.0):
    i = at(b); j = min(N, i + len(sig)); sig = sig[: j - i]
    L[i:j] += sig * g * (1 - max(0, pan)); R[i:j] += sig * g * (1 + min(0, pan))
def env(n, d): return np.exp(-np.arange(n) / SR / d)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
note = lambda m: 440 * 2 ** ((m - 69) / 12)
def saw(f, dur, det=0.0):
    t = np.arange(int(dur * SR)) / SR
    return sum(2 * ((t * f * (1 + d) + ph) % 1) - 1 for d, ph in ((-det, .1), (0, .5), (det, .8))) / 3

def kick(g=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(42 + 120 * np.exp(-t / 0.03)) / SR) * env(n, 0.18)
    return np.tanh(s * 2.4) * 0.9 * g
def hat(o=False):
    n = int((0.18 if o else 0.04) * SR); return hp(rng.standard_normal(n), 8000, 4) * env(n, 0.06 if o else 0.01)
def clap():
    n = int(0.35 * SR); x = bp(rng.standard_normal(n), 800, 3000); e = env(n, 0.09)
    for d in (0.0, 0.012, 0.024): e += np.r_[np.zeros(int(d * SR)), env(n - int(d * SR), 0.006)] * 0.7
    return x * e * 0.7
def tick(hi=True):  # Uhrwerk
    n = int(0.03 * SR); f = 3200 if hi else 2400; t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) * env(n, 0.004) + hp(rng.standard_normal(n), 5000) * env(n, 0.002) * 0.5) * 0.5
def sub(f, dur):
    t = np.arange(int(dur * SR)) / SR
    s = np.sin(2 * np.pi * f * t) + 0.3 * lp(saw(f, dur), 300)
    a = np.minimum(1, t / 0.01) * env(len(t), dur * 0.6)
    return np.tanh(s * a * 1.6) * 0.6
def pad(ms, dur):
    s = sum(saw(note(m), dur, 0.01) for m in ms) / len(ms); t = np.arange(len(s)) / SR
    a = np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.8)
    return lp(s, 900) * a * 0.35
def riser(beats):
    n = at(beats); t = np.linspace(0, 1, n)
    return (hp(rng.standard_normal(n), 2500) * t + np.sin(2 * np.pi * np.cumsum(150 + 1400 * t ** 2) / SR) * 0.12) * t ** 2 * 0.45
def slam():  # Tür knallt zu: tiefer Schlag, Holz, Hall
    n = int(2.8 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 90 * np.exp(-t / 0.05)) / SR) * env(n, 0.5)
    wood = bp(rng.standard_normal(n), 200, 1800) * env(n, 0.035) * 1.6
    tail = lp(rng.standard_normal(n), 900) * env(n, 0.9) * 0.08
    return np.tanh((boom + wood + tail) * 1.8)
def lock():  # Schloss rastet ein
    out = np.zeros(int(0.25 * SR))
    for d, f, g in ((0, 2600, 1), (0.07, 1800, 1.2)):
        n = int(0.05 * SR); i = int(d * SR)
        out[i:i + n] += (bp(rng.standard_normal(n), f - 600, f + 600) * env(n, 0.006)) * g
    return out * 1.4
def twotone(beats):  # leise Zweiton-Melodie, an ein Martinshorn angelehnt
    out = np.zeros(at(beats)); seg = at(1)
    for k in range(int(beats)):
        f = note(69) if k % 2 == 0 else note(74)
        s = saw(f, seg / SR, 0.004); s = lp(s, 2500) * np.minimum(1, np.arange(len(s)) / 800) * env(len(s), 0.5)
        out[k * seg:k * seg + len(s)] += s[: len(out) - k * seg]
    return out * 0.22

ROOT = {0: 38, 8: 38, 16: 41, 24: 36, 32: 34, 40: 38, 48: 41, 56: 36, 64: 38}
CH = {38: [62, 65, 69], 41: [65, 69, 72], 36: [60, 64, 67], 34: [58, 62, 65]}

# Intro: Drone, Uhr tickt, Herzschlag, Aufbau
add(pad([50, 57, 62, 65], 8 * BEAT + 0.5), 0, 1.0)
for k in range(16): add(tick(k % 2 == 0), k / 2, 0.8, pan=0.3 * (-1) ** k)
for b in (0, 1, 2, 3, 4, 5): add(kick(0.55), b); add(kick(0.3), b + 0.25)
add(riser(2), 6, 0.9)
for k in range(8): add(clap(), 6 + k / 4, 0.15 + 0.35 * k / 8)

def groove(b0, b1, heavy=1.0):
    for b in np.arange(b0, b1, 0.25):
        q = (b - b0) % 1
        if q == 0:
            add(kick(heavy), b)
            if int(b - b0) % 2 == 1: add(clap(), b, 0.6)
        if q == 0.5: add(hat(True), b, 0.3, pan=0.25)
        if q in (0.25, 0.75): add(hat(), b, 0.25, pan=-0.3)
        if q == 0.5 or q == 0.75:
            r = ROOT[int((b // 8) * 8)]
            add(sub(note(r + (12 if q == 0.75 and int(b) % 4 == 3 else 0)), 0.2), b, 0.8)
    for s in range(int(b0 // 8) * 8, int(b1), 8):
        if s >= b0:
            add(pad(CH[ROOT[s]], 8 * BEAT), s, 0.8)
            add(hp(rng.standard_normal(int(1.4 * SR)), 4500) * env(int(1.4 * SR), 0.4) * 0.3, s, 0.8)

groove(8, 40)
# Uhr tickt in der Szene "Wann"
for k in range(16): add(tick(k % 2 == 0), 8 + k / 2, 0.5)
add(riser(1), 39, 0.6)
# Tür knallt auf 40.5, dann Stille bis 42, Schloss rastet auf 42 ein
add(slam(), 40.5, 1.0)
add(lock(), 42, 0.9)
groove(42, 56, 1.1)
add(riser(1), 55, 0.5)
groove(56, 64, 1.0)
add(twotone(8), 56, 1.0)
# Outro: Groove fällt weg, Pad und Uhr, Schlussschlag auf 64
add(kick(1.2), 64); add(slam() * 0.5, 64, 0.8)
add(pad([50, 57, 62, 65, 69], 10 * BEAT), 64, 1.0)
for k in range(16): add(tick(k % 2 == 0), 64 + k / 2, 0.45 * (1 - k / 18))

mix = np.stack([L, R], 1); mix = np.tanh(mix / np.max(np.abs(mix)) * 1.5) * 0.9
fo = int(1.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok', N / SR, 's')
