// Hero mobile: WebKit/Chromium, rede lenta, screenshots + console + visibilidade. Uso: node scripts/hero-check.mjs [slow]
import { chromium, webkit } from 'playwright';
import { spawn } from 'node:child_process';
const slow = process.argv.includes('slow');
const srv = spawn('npx', ['vite', 'preview', '--port', '4174', '--strictPort'], { shell: true, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const cases = [['webkit', webkit, 390, 844], ['webkit', webkit, 360, 740], ['chromium', chromium, 412, 915], ['chromium', chromium, 1440, 900]];
let bad = 0;
for (const [name, eng, w, h] of cases) {
  const b = await eng.launch(); const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 700 });
  const p = await ctx.newPage(); const log = [];
  p.on('pageerror', (e) => log.push('PAGEERROR ' + e.message)); p.on('console', (m) => m.type() === 'error' && log.push('console.error ' + m.text()));
  if (slow) {
    await p.route('**/*', async (rt) => { await new Promise((r) => setTimeout(r, 350)); rt.continue(); }); // ~RTT 3G; WebKit não tem CDP
    if (name === 'chromium') { const c = await ctx.newCDPSession(p); await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 180e3, uploadThroughput: 84e3 }); await c.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
  }
  await p.goto('http://localhost:4174/', { waitUntil: 'commit' });
  const t0 = Date.now(); const tag = `${name}-${w}x${h}${slow ? '-slow' : ''}`;
  for (const s of slow ? [1, 3, 6] : [1, 3]) { await p.waitForTimeout(Math.max(0, s * 1000 - (Date.now() - t0))); await p.screenshot({ path: `docs/_projeto/qa/hero-${tag}-${s}s.png` }).catch(() => {}); }
  const vis = await p.evaluate(() => { const lines = [...document.querySelectorAll('.hero__h1 .ln>span')].map((e) => Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight))); const q = (s) => { const e = document.querySelector(s); if (!e) return null; const cs = getComputedStyle(e), r = e.getBoundingClientRect(); return { op: cs.opacity, clip: cs.clipPath, inFold: r.top < innerHeight && r.bottom > 0, h: Math.round(r.height), bottom: Math.round(r.bottom) }; };
    return { cls: document.documentElement.className, h1span: q('.hero__h1 .ln>span'), photo: q('#heroPhoto'), btn: q('.hero__copy .sh-btn--primary'), seal: q('.hero__copy .sh-seal'), fold: innerHeight, lines, ovfX: document.documentElement.scrollWidth > innerWidth }; });
  console.log(tag, JSON.stringify(vis)); log.forEach((l) => console.log('   ', l.slice(0, 200))); bad += log.length;
  await b.close();
}
srv.kill(); process.exit(0);
