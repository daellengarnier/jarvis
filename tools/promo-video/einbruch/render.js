// node render.js out.mp4 | node render.js dir/ f1 f2 ... (Einzelbilder)
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const out = process.argv[2];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  await page.goto('file://' + path.resolve(__dirname, 'index.html'));
  await page.evaluate(() => window.ready);
  const total = await page.evaluate(() => window.TOTAL_FRAMES);
  if (out.endsWith('/')) {
    for (const f of process.argv.slice(3).map(Number)) {
      await page.evaluate(f => window.renderFrame(f), f);
      await page.screenshot({ path: `${out}f${String(f).padStart(5, '0')}.png` });
    }
    await browser.close(); return;
  }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '60', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < total; f++) {
    await page.evaluate(f => window.renderFrame(f), f);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 300 === 0) console.log(f, '/', total, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
})();
