// Smoke: carrega dist (vite preview), sem erro de console, rola topo→fim sem travar, 1440×900 e 390×844.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const srv = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { shell: true, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const b = await chromium.launch(); let fail = 0;
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = [];
  p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  p.on('console', (m) => m.type() === 'error' && !/tiles|openfreemap|photon|osrm|ERR_|Failed to load resource/.test(m.text()) && errs.push('console: ' + m.text()));
  await p.goto('http://localhost:4173/', { waitUntil: 'load' }); await p.waitForTimeout(1500);
  const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  let last = -1, stuck = 0;
  for (let y = 0; y <= max; y += Math.round(h * 0.6)) {
    await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(120);
  }
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(900);
  const end = await p.evaluate(() => Math.round(scrollY)); const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const ovf = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  if (end < total - 4) { errs.push(`não chegou ao fim: ${end}/${total}`); }
  if (ovf) errs.push('overflow horizontal');
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
  console.log(`${w}×${h}: fim=${end}/${total} ${errs.length ? 'ERROS\n  ' + errs.join('\n  ') : 'OK'}`); fail += errs.length;
  await p.screenshot({ path: `docs/_projeto/qa/smoke-${w}.png` });
}
await b.close(); srv.kill(); process.exit(fail ? 1 : 0);
