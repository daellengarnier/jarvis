# Audio-Merkmale pro Videoframe (60 fps) -> features.js für anim.js
import numpy as np, librosa, json, sys
# Aufruf: python3 features.py music.wav BEAT END_BEATS STOP '[[30,32]]'
src = sys.argv[1] if len(sys.argv) > 1 else 'music2.wav'
cfg = {'beat': float(sys.argv[2]) if len(sys.argv) > 2 else 0.44877,
       'endBeats': float(sys.argv[3]) if len(sys.argv) > 3 else 67.5,
       'stop': float(sys.argv[4]) if len(sys.argv) > 4 else 64,
       'breaks': json.loads(sys.argv[5]) if len(sys.argv) > 5 else [[30, 32]]}
y, sr = librosa.load(src, sr=48000, mono=True)
hop = 800
S = np.abs(librosa.stft(y, n_fft=4096, hop_length=hop)); f = librosa.fft_frequencies(sr=sr, n_fft=4096)
def band(lo, hi): return S[(f >= lo) & (f < hi)].sum(0)
def flux(lo, hi): x = S[(f >= lo) & (f < hi)]; return np.r_[0, np.maximum(0, np.diff(x, axis=1)).sum(0)][: x.shape[1]]
def norm(x, p=98): return np.clip(x / (np.percentile(x, p) + 1e-9), 0, 1.5)
def hold(x, d):  # Spitze halten, dann abklingen
    o = np.zeros_like(x); v = 0
    for i, a in enumerate(x): v = max(a, v * d); o[i] = v
    return o
def smooth(x, k): return np.convolve(x, np.ones(k) / k, 'same')
kick, hat, clap = norm(flux(30, 120)), norm(flux(7000, 16000)), norm(flux(1200, 5000))
onsets = [int(i) for i in range(2, len(kick) - 2) if kick[i] > 0.55 and kick[i] == kick[i - 2:i + 3].max()]
out = {
  'kick': hold(kick, 0.82), 'hat': hold(hat, 0.7), 'clap': hold(clap, 0.8),
  'low': smooth(norm(band(30, 200), 95), 9), 'high': smooth(norm(band(4000, 16000), 95), 9),
  'rms': smooth(norm(librosa.feature.rms(y=y, frame_length=3200, hop_length=hop)[0], 95), 7),
}
out = {k: [round(float(v), 3) for v in x] for k, x in out.items()}
# Spektrum: 32 log-Bänder 40 Hz bis 12 kHz, in dB auf 0..99 skaliert (flach, 32 Werte pro Frame)
edges = np.geomspace(40, 12000, 33)
ix = np.searchsorted(f, edges)
B = np.stack([S[ix[i]:max(ix[i + 1], ix[i] + 1)].mean(0) for i in range(32)])
dB = 20 * np.log10(B + 1e-6); lo, hi = np.percentile(dB, 30), np.percentile(dB, 99.5)
spec = np.clip((dB - lo) / (hi - lo), 0, 1)
out['spec'] = [int(v) for v in (spec.T * 99).round().ravel()]
# Wellenform fürs Oszilloskop: 96 Punkte über 40 ms je Frame, -99..99
peak = np.percentile(np.abs(y), 99.5)
wv = []
for i in range(S.shape[1]):
    c = i * hop; seg = y[max(0, c - 960):c + 960]
    seg = np.r_[seg, np.zeros(1920 - len(seg))]
    wv += [int(v) for v in np.clip(seg[::20] / peak * 99, -99, 99).round()]
out['wave'] = wv
out['kicks'] = [o for k, o in enumerate(onsets) if k == 0 or o - onsets[k - 1] > 8]
open('features.js', 'w').write('window.CFG = ' + json.dumps(cfg) + ';\nwindow.FEAT = ' + json.dumps(out) + ';\n')
print('frames', len(out['kick']), 'kick onsets', len(out['kicks']))
