# Soundtrack, 128 BPM, synchron zu anim.js. Alles synthetisiert, keine Samples.
import numpy as np, wave, sys
from scipy.signal import butter, sosfilt

SR = 44100
BPM = 128
BEAT = 60 / BPM
TOTAL_BEATS = 70
N = int(TOTAL_BEATS * BEAT * SR) + SR
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def at(b): return int(round(b * BEAT * SR))
def add(sig, b, gain=1.0, pan=0.0):
    i = at(b); j = min(N, i + len(sig)); sig = sig[: j - i]
    L[i:j] += sig * gain * (1 - max(0, pan)); R[i:j] += sig * gain * (1 + min(0, pan))
def env(n, dec): return np.exp(-np.arange(n) / SR / dec)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)

def kick():
    n = int(0.42 * SR); t = np.arange(n) / SR
    f = 46 + 130 * np.exp(-t / 0.035)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.16)
    s += hp(rng.standard_normal(n), 2000) * env(n, 0.004) * 0.4
    return np.tanh(s * 2.2) * 0.9
def hat(open_=False):
    n = int((0.22 if open_ else 0.05) * SR)
    return hp(rng.standard_normal(n), 7500, 4) * env(n, 0.07 if open_ else 0.012)
def clap():
    n = int(0.3 * SR); x = bp(rng.standard_normal(n), 900, 3500); e = env(n, 0.07)
    for d in (0.0, 0.011, 0.022): e += np.r_[np.zeros(int(d * SR)), env(n - int(d * SR), 0.006)] * 0.8
    return x * e * 0.8
def saw(freq, dur, detune=0.0):
    t = np.arange(int(dur * SR)) / SR
    return sum(2 * ((t * freq * (1 + d) + ph) % 1) - 1 for d, ph in ((-detune, 0.1), (0, 0.5), (detune, 0.8))) / 3
def bass(freq, dur=0.2):
    s = saw(freq, dur) + 0.6 * np.sin(2 * np.pi * freq * np.arange(int(dur * SR)) / SR)
    return np.tanh(lp(s, 420) * env(len(s), 0.12) * 2.5) * 0.55
def stab(freqs, dur=0.5):
    s = sum(saw(f, dur, 0.006) for f in freqs) / len(freqs)
    return lp(s, 2200) * env(len(s), 0.16) * 0.5
def crash(dur=1.6):
    n = int(dur * SR); return hp(rng.standard_normal(n), 4000) * env(n, 0.45) * 0.35
def riser(beats):
    n = at(beats); t = np.linspace(0, 1, n)
    lo = hp(rng.standard_normal(n), 1200) * (1 - t); hi = hp(rng.standard_normal(n), 5000) * t
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 1800 * t ** 2) / SR) * 0.15
    return (lo * 0.6 + hi + sweep) * t ** 2 * 0.5
def boom():
    n = int(2.8 * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-t / 0.08)) / SR) * env(n, 0.9)
    return np.tanh(s * 1.6)

note = lambda m: 440 * 2 ** ((m - 69) / 12)
# Grundton pro Szene (A-Moll-Welt): Intro, Disco, QUM, Kitchen, Artlu, Soirée, Mothers, Outro
ROOTS = [45, 45, 41, 48, 43, 50, 40, 45]
CHORD = {45: [57, 60, 64], 41: [53, 57, 60], 48: [55, 60, 64], 43: [55, 59, 62], 50: [57, 62, 65], 40: [56, 59, 64]}
SEC = [0, 8, 16, 24, 32, 40, 48, 56]

# Intro: Schläge auf die Wörter, dann Wirbel
for b in range(6):
    add(kick(), b, 1.0); add(crash(0.5), b, 0.5)
    add(stab([note(m) for m in CHORD[45]], 0.3), b, 0.6)
for k in range(16):
    add(clap(), 6 + k / 8, 0.25 + 0.5 * k / 16, pan=0.2 * (-1) ** k)
add(riser(2), 6, 0.9)

# Hauptteil: Beat von 8 bis 61
for s, b0 in enumerate(SEC[1:], start=1):
    root = ROOTS[s]
    for b in np.arange(b0, b0 + 8, 0.25):
        if b >= 61: break
        bi = b - b0; q = bi % 1
        if q == 0:
            add(kick(), b, 1.0)
            if int(bi) % 2 == 1: add(clap(), b, 0.7)
        if q == 0.5:
            add(hat(True), b, 0.35, pan=0.25)
            add(bass(note(root + (12 if int(bi) % 4 == 3 else 0))), b, 0.9)
        if q in (0.25, 0.75): add(hat(), b, 0.3, pan=-0.3)
        if q == 0.75 and int(bi) % 2 == 0: add(bass(note(root + 7), 0.12), b, 0.5)
    add(crash(), b0, 0.8)
    add(stab([note(m) for m in CHORD[root]]), b0, 0.8)
    add(stab([note(m) for m in CHORD[root]], 0.3), b0 + 3.5, 0.5)
    if b0 + 8 <= 56: add(riser(1), b0 + 7, 0.5)

# Outro: Wirbel in den Schlussschlag
for k in range(24):
    add(clap(), 61 + k / 8, 0.2 + 0.6 * k / 24, pan=0.2 * (-1) ** k)
add(riser(3), 61, 1.0)
add(kick(), 64, 1.2); add(boom(), 64, 0.9); add(crash(3.0), 64, 1.0)
pad = sum(saw(note(m), 5.0, 0.008) for m in [45, 57, 60, 64, 69]) / 5
pad = lp(pad, 1400) * np.minimum(1, np.arange(len(pad)) / (0.05 * SR)) * env(len(pad), 1.6)
add(pad, 64, 0.7)

mix = np.stack([L, R], 1)
mix = mix / np.max(np.abs(mix)) * 1.4
mix = np.tanh(mix) * 0.92
mix = mix[: int(TOTAL_BEATS * BEAT * SR)]
fade = int(0.4 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok', mix.shape[0] / SR)
