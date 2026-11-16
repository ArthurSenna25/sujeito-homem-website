/* frameSequence — fundo de sequência de frames controlado pelo scroll (sem scroll-jacking).
   frameSequence({ canvas, manifestUrl, mobileManifestUrl, trigger, start, end, poster, poster2, effect })
   manifest.json: { "pattern": "f_{n}.webp", "count": 120, "width": 1920, "height": 1080 }   ({n}|{nn}|{nnn})
   - Com frames: desenha o frame = round(progress × (count-1)), preload progressivo + 5 frames à frente na direção do scroll.
   - Sem manifest / falha / reduced-motion / saveData / conexão lenta: modo PÔSTER.
       effect 'push'  → empurrão de câmera + parallax sobre o pôster (fundo desfocado do próprio salão)
       effect 'reveal'→ varredura antes (poster) → depois (poster2) com fio de luz */
(function () {
  window.frameSequence = function (o) {
    const canvas = o.canvas, ctx = canvas.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, conn = navigator.connection || {};
    const lite = !!conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || '');
    const effect = o.effect || 'push';
    let frames = [], count = 0, mode = 'poster', p = effect === 'reveal' && (reduce || lite) ? 1 : 0, idx = 0, dir = 1, pImg = null, p2Img = null, back = null, man = null;
    const load = (src) => new Promise((res) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
    const name = (n) => man.pattern.replace(/\{n{1,3}\}/, (m) => String(n).padStart(m.length - 2, '0'));
    const fix = (u) => (/^(https?:|\/)/.test(u) ? u : new URL(u, new URL(man.__url, location.href)).href);

    function size() { canvas.width = Math.max(2, canvas.clientWidth * dpr); canvas.height = Math.max(2, canvas.clientHeight * dpr); draw(); }
    function cover(img, sc, ox, oy) {
      const cw = canvas.width, ch = canvas.height, r = Math.max(cw / img.width, ch / img.height) * (sc || 1), w = img.width * r, h = img.height * r;
      ctx.drawImage(img, (cw - w) / 2 + (ox || 0) * cw, (ch - h) / 2 + (oy || 0) * ch, w, h);
    }
    function tiny(img) { const c = document.createElement('canvas'); c.width = 72; c.height = Math.round(72 * img.height / img.width); const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height); return c; }
    function draw() {
      if (!canvas.width) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (mode === 'frames') { const f = frames[idx] || frames.slice(0, idx + 1).filter(Boolean).pop(); if (f) cover(f); return; }
      if (!pImg) return;
      if (effect === 'push') { cover(pImg, 1 + 0.05 * p, -0.012 * p, -0.006 * p); return; }
      const cw = canvas.width, ch = canvas.height;
      cover(pImg, 1.02);                                   // antes (escurecido via overlay)
      ctx.fillStyle = 'rgba(19,16,13,.42)'; ctx.fillRect(0, 0, cw, ch);
      if (p2Img) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, cw * p, ch); ctx.clip(); cover(p2Img, 1.02); ctx.restore();
        ctx.fillStyle = 'rgba(242,188,106,.9)'; ctx.fillRect(cw * p - 1, 0, 2, ch);
      }
    }
    function ensure() {
      if (mode !== 'frames') return;
      for (let k = 0; k < 6; k++) { const i = Math.max(0, Math.min(count - 1, idx + k * dir)); if (!frames[i]) { frames[i] = 0; load(fix(name(i + 1))).then((im) => { frames[i] = im || undefined; if (i === idx) draw(); }); } }
    }
    async function init() {
      const pUrl = (matchMedia('(max-width:767px)').matches && o.posterMobile) || o.poster;
      pImg = pUrl ? await load(pUrl) : null; p2Img = o.poster2 ? await load(o.poster2) : null;
      const mUrl = (matchMedia('(max-width:767px)').matches && o.mobileManifestUrl) || o.manifestUrl;
      if (mUrl && !reduce && !lite) {
        try {
          const r = await fetch(mUrl); if (!r.ok) throw 0; man = await r.json(); man.__url = mUrl; count = man.count; frames = new Array(count);
          const f0 = await load(fix(name(1))); if (!f0) throw 0; frames[0] = f0; mode = 'frames';
          for (let i = 8; i < count; i += 8) { frames[i] = 0; load(fix(name(i + 1))).then((im) => { frames[i] = im || undefined; }); }
        } catch (e) { mode = 'poster'; }
      }
      canvas.classList.add('is-ready'); size();
      if (!reduce && window.gsap && window.ScrollTrigger) {
        const st = { p: p }; let last = 0;
        gsap.to(st, { p: 1, ease: 'none', scrollTrigger: { trigger: o.trigger, start: o.start || 'top top', end: o.end || 'bottom top', scrub: 0.5 },
          onUpdate() { p = st.p; dir = p >= last ? 1 : -1; last = p; if (mode === 'frames') { idx = Math.round(p * (count - 1)); ensure(); } draw(); } });
      }
      draw();
    }
    addEventListener('resize', size);
    init();
    return { redraw: draw, get mode() { return mode; } };
  };
})();
