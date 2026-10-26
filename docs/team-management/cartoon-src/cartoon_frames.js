// Usage: node cartoon_frames.js <anim.html> check|png <outDir> <t1,t2,...>  |  video <out.mp4> <fromFrame> <toFrame>
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const [html, mode, ...rest] = process.argv.slice(2);
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + path.resolve(html));
  await pg.waitForFunction('window.READY === true || window.__err', null, { timeout: 30000 }).catch(() => {});
  await pg.evaluate(() => document.fonts.ready);
  if (errs.length) { console.error('PAGE ERRORS', errs); process.exit(1); }
  const missing = await pg.evaluate(() => window.MISSING);
  if (mode === 'check') { console.log('missing:', JSON.stringify(missing)); await b.close(); return; }
  if (missing.length) { console.error('MISSING', missing); process.exit(1); }
  const fps = await pg.evaluate(() => DATA.fps);
  if (mode === 'png') {
    const [out, times] = rest;
    for (const t of times.split(',')) {
      await pg.evaluate(f => render(f), Math.round(parseFloat(t) * fps));
      await pg.screenshot({ path: path.join(out, `t_${t}.png`) });
    }
  } else {
    const [out, from, to] = rest;
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '27', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = +from; f < +to; f++) {
      await pg.evaluate(fr => render(fr), f);
      const buf = await pg.screenshot({ type: 'jpeg', quality: 88 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((f - from) % 500 === 0) console.log(path.basename(out), f, '/', to);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
