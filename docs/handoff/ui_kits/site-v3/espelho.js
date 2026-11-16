/* Espelho embaçado (canvas 2D, destination-out, raio ~60px, sem WebGL; scroll também limpa) + CTA final */
(function () {
  const box = $('#mirrorBox'), cv = $('#mirrorFog'), sec = $('#espelho'), bar = $('.mirror__bar', sec);
  const IMG = box.querySelector('.mirror__img');
  // vidro oval (frações da imagem 1024×1536) — elipse inclinada, medida sobre nitido.webp
  const G = { cx: 0.549, cy: 0.446, rx: 0.292, ry: 0.381, rot: -6 };
  const poly = (() => { const r = G.rot * Math.PI / 180, pts = []; for (let k = 0; k < 72; k++) { const t = k / 72 * 2 * Math.PI, x = G.rx * Math.cos(t), y = G.ry * Math.sin(t); pts.push(`${((G.cx + x * Math.cos(r) - y * Math.sin(r) * (1536 / 1024)) * 100).toFixed(2)}% ${((G.cy + (x * Math.sin(r) * (1024 / 1536) + y * Math.cos(r))) * 100).toFixed(2)}%`); } return `polygon(${pts.join(',')})`; })();
  if (REDUCE || !cv.getContext) { sec.classList.add('mirror--static'); $('#mirrorHint').hidden = true; if (!window.gsap) return; }
  let clean = 0, fingerClean = 0, scrollClean = 0;
  function setClean() {
    clean = Math.max(fingerClean, scrollClean); sec.style.setProperty('--clean', clean.toFixed(3)); bar.parentNode.style.setProperty('--clean', clean.toFixed(3));
    sec.classList.toggle('is-clear', clean >= 0.6); cv.style.opacity = String(1 - scrollClean);
  }
  if (!sec.classList.contains('mirror--static')) {
    cv.style.clipPath = poly; const ctx = cv.getContext('2d'); const GW = 20, GH = 30, cells = new Uint8Array(GW * GH); let cleared = 0, dpr = 1, W = 0, H = 0;
    function fog() {
      dpr = Math.min(devicePixelRatio || 1, 2); W = cv.width = Math.max(2, Math.round(cv.clientWidth * dpr)); H = cv.height = Math.max(2, Math.round(cv.clientHeight * dpr));
      ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
      if ('filter' in ctx && IMG.complete && IMG.naturalWidth) { ctx.filter = `blur(${Math.round(16 * dpr)}px) brightness(1.15) saturate(.55)`; ctx.drawImage(IMG, -20, -20, W + 40, H + 40); ctx.filter = 'none'; ctx.fillStyle = 'rgba(206,194,172,.46)'; }
      else ctx.fillStyle = 'rgba(206,194,172,.9)';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(255,248,235,${0.03 + Math.random() * 0.06})`; ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, (1 + Math.random() * 5) * dpr, 0, 7); ctx.fill(); }
      cells.fill(0); cleared = 0; fingerClean = 0; setClean();
    }
    if (IMG.complete) fog(); else IMG.addEventListener('load', fog);
    addEventListener('resize', () => { if (!clean || clean < 0.02) fog(); });
    const R = 60; let last = null;
    function wipe(x, y) {
      const r = R * dpr, g = ctx.createRadialGradient(x, y, r * 0.35, x, y, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      const cx = x / W * GW, cy = y / H * GH, rr = R * dpr / W * GW * 0.7; // cobertura (só células dentro do vidro)
      for (let j = Math.max(0, Math.floor(cy - rr)); j <= Math.min(GH - 1, cy + rr); j++) for (let i = Math.max(0, Math.floor(cx - rr)); i <= Math.min(GW - 1, cx + rr); i++) { if (cells[j * GW + i]) continue; const px = (i + 0.5) / GW, py = (j + 0.5) / GH, ex = (px - G.cx) / G.rx, ey = (py - G.cy) / G.ry; if (ex * ex + ey * ey > 1) continue; if (Math.hypot(i + 0.5 - cx, j + 0.5 - cy) <= rr) { cells[j * GW + i] = 1; cleared++; } }
    }
    let inside = 0; for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) { const ex = ((i + 0.5) / GW - G.cx) / G.rx, ey = ((j + 0.5) / GH - G.cy) / G.ry; if (ex * ex + ey * ey <= 1) inside++; }
    function at(e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
    function stroke(e) { const [x, y] = at(e); if (last) { const d = Math.hypot(x - last[0], y - last[1]), k = Math.max(1, Math.ceil(d / (R * dpr * 0.3))); for (let s = 1; s <= k; s++) wipe(lerp(last[0], x, s / k), lerp(last[1], y, s / k)); } else wipe(x, y); last = [x, y]; fingerClean = Math.min(1, cleared / inside / 0.8); setClean(); }
    box.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons || last) stroke(e); });
    box.addEventListener('pointerdown', (e) => { last = null; stroke(e); }); const rel = () => { last = null; };
    box.addEventListener('pointerup', rel); box.addEventListener('pointerleave', rel); box.addEventListener('pointercancel', rel);
    // a rolagem também limpa, gradualmente (0–100%)
    if (window.gsap && window.ScrollTrigger) {
      mm.add(PIN, () => { const t = ScrollTrigger.create({ trigger: '.mirror__scene', start: 'top top', end: () => '+=' + vh() * 1.1, pin: true, invalidateOnRefresh: true, onUpdate: (s) => { scrollClean = clamp((s.progress - 0.08) / 0.8); setClean(); } }); return () => t.kill(); });
      mm.add(NOPIN, () => { const t = ScrollTrigger.create({ trigger: box, start: 'top 85%', end: 'bottom 40%', onUpdate: (s) => { scrollClean = s.progress; setClean(); } }); return () => t.kill(); });
    }
  }

  // ===== CTA FINAL =====
  const fh = $('#finalH'), big = $('#bigBook');
  if (!window.IntersectionObserver) fh.classList.add('in'); else new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { fh.classList.add('in'); o.disconnect(); } }), { threshold: 0.35 }).observe(fh);
  const live = () => { const s = statusLine(); $('#finalLiveT').textContent = s.text; $('#finalLive').querySelector('.sh-seal__dot').style.background = s.open ? 'var(--state-ok)' : 'var(--text-3)'; }; live(); setInterval(live, 60000);
  if (window.gsap && window.ScrollTrigger && !REDUCE) {
    const qy = gsap.quickTo(fh, 'y', { duration: 0.6, ease: 'power3.out' }), qs = gsap.quickTo(fh, 'skewY', { duration: 0.6, ease: 'power3.out' });
    ScrollTrigger.create({ trigger: '#agendar', start: 'top bottom', end: 'bottom top', onUpdate: (s) => { const v = s.getVelocity(); qs(clamp(v / -500, -4, 4)); qy(clamp(v / -120, -30, 30)); } });
    ScrollTrigger.addEventListener('scrollEnd', () => { qs(0); qy(0); });
    const mx = gsap.quickTo(big, 'x', { duration: 0.4, ease: 'power3.out' }), my = gsap.quickTo(big, 'y', { duration: 0.4, ease: 'power3.out' });
    // botão magnético discreto: raio 80px em volta do botão, máx. 6px, força .12; só mouse (sem touch / reduced-motion)
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      const sec = $('#agendar'), RAD = 80, MAX = 6, K = 0.12, pull = (v) => clamp(v * K, -MAX, MAX);
      sec.addEventListener('pointermove', (ev) => {
        if (ev.pointerType !== 'mouse') return; const r = big.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const ex = Math.max(r.left - ev.clientX, 0, ev.clientX - r.right), ey = Math.max(r.top - ev.clientY, 0, ev.clientY - r.bottom);
        if (Math.hypot(ex, ey) < RAD) { mx(pull(ev.clientX - cx)); my(pull(ev.clientY - cy)); } else { mx(0); my(0); }
      });
      sec.addEventListener('pointerleave', () => { mx(0); my(0); });
    }
  }
  // mobile: usa a foto vertical da cadeira
  if (matchMedia('(max-width:899px)').matches) $('.final__bg img').src = A + 'cta/cadeira-mobile.webp';
})();
