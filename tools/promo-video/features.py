# Audio-Merkmale pro Videoframe (60 fps) -> features.js für anim.js
import numpy as np, librosa, json, sys
src = sys.argv[1] if len(sys.argv) > 1 else 'music2.wav'
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
out['kicks'] = [o for k, o in enumerate(onsets) if k == 0 or o - onsets[k - 1] > 8]
open('features.js', 'w').write('window.FEAT = ' + json.dumps(out) + ';\n')
print('frames', len(out['kick']), 'kick onsets', len(out['kicks']))
