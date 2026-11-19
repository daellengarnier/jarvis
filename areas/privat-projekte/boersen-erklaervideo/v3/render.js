// Usage:
//   node render.js stills <outdir> t1 t2 ...      -> PNG-Kontrollbilder
//   node render.js video <out.mp4> [workers]       -> MP4 ohne Ton (30 fps)
//   node render.js cues <cues.json>                -> Audio-Cues exportieren
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30, DUR = 120;
const url = 'file://' + path.join(__dirname, 'video.html') + '?render';

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(url);
  await page.evaluate(() => window.READY);
  return page;
}

(async () => {
  const [mode, target, ...rest] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync'] });
  if (mode === 'stills') {
    fs.mkdirSync(target, { recursive: true });
    const page = await openPage(browser);
    for (const t of rest.map(Number)) {
      const b64 = await page.evaluate(([t]) => window.RENDER(t, Math.floor(t * 30), 0.9), [t]);
      fs.writeFileSync(path.join(target, `t${String(t).padStart(6, '0')}.jpg`), Buffer.from(b64, 'base64'));
    }
  } else if (mode === 'cues') {
    const page = await openPage(browser);
    fs.writeFileSync(target, JSON.stringify(await page.evaluate(() => window.CUES)));
  } else if (mode === 'video') {
    const workers = Number(rest[0] || 3), total = FPS * DUR, per = Math.ceil(total / workers);
    const parts = [];
    const t0 = Date.now();
    await Promise.all([...Array(workers)].map(async (_, w) => {
      const from = w * per, to = Math.min(total, from + per);
      const part = target.replace(/\.mp4$/, `.part${w}.mp4`);
      parts[w] = part;
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), part], { stdio: ['pipe', 'inherit', 'inherit'] });
      const page = await openPage(browser);
      for (let f = from; f < to; f++) {
        const b64 = await page.evaluate(([t, f]) => window.RENDER(t, f, 0.95), [f / FPS, f]);
        if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
        if (w === 0 && f % 150 === 0) console.log(`frame ${f}/${to} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      }
      ff.stdin.end();
      await new Promise(r => ff.on('close', r));
    }));
    fs.writeFileSync(target + '.txt', parts.map(p => `file '${p}'`).join('\n'));
    await new Promise(r => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', target + '.txt', '-c', 'copy', target], { stdio: 'inherit' }).on('close', r));
    parts.forEach(p => fs.unlinkSync(p)); fs.unlinkSync(target + '.txt');
    console.log('done', ((Date.now() - t0) / 1000).toFixed(0), 's');
  }
  await browser.close();
})();
