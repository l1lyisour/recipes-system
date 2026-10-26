const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [html, outDir, ...specs] = process.argv.slice(2);
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const spec of specs) {
    const [s, v] = spec.split(':');
    await pg.goto('file://' + path.resolve(html) + '?s=' + s + (v ? '&v=' + v : ''));
    await pg.screenshot({ path: path.join(outDir, s + (v ? '_' + v : '') + '.png') });
  }
  await b.close();
})();
