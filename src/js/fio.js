/* O fio da navalha — versão vanilla. Desenha por scroll (stroke-dashoffset), acende [data-fio-lit], termina em [data-fio-end].
   Uso: const fio = FioDaNavalha(document.getElementById('site')); fio.measure() após mudanças de layout. */
(function () {
  const NS = 'http://www.w3.org/2000/svg', clamp = (v) => Math.max(0, Math.min(1, v));
  function rounded(raw, r) {
    const pts = raw.filter((p, i) => i === 0 || p[0] !== raw[i - 1][0] || p[1] !== raw[i - 1][1]);
    if (pts.length < 2) return '';
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
      const l1 = Math.hypot(cx - px, cy - py), l2 = Math.hypot(nx - cx, ny - cy), rr = Math.min(r, l1 / 2, l2 / 2);
      d += ` L${cx - (cx - px) / l1 * rr} ${cy - (cy - py) / l1 * rr} Q${cx} ${cy} ${cx + (nx - cx) / l2 * rr} ${cy + (ny - cy) / l2 * rr}`;
    }
    const l = pts[pts.length - 1];
    return d + ` L${l[0]} ${l[1]}`;
  }
  const el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };

  window.FioDaNavalha = function (host, o = {}) {
    const bp = o.breakpoint || 768, anchor = o.anchor || 0.55;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gid = 'fio' + Math.random().toString(36).slice(2, 7);
    const svg = el('svg', { class: 'sh-fio', 'aria-hidden': 'true', focusable: 'false' });
    const grad = el('linearGradient', { id: gid, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: 1 });
    [['0', '--sh-gold-lo'], ['.45', '--sh-gold'], ['1', '--sh-gold-hi']].forEach(([o2, v]) => { const s = el('stop', { offset: o2 }); s.style.stopColor = `var(${v})`; grad.appendChild(s); });
    const defs = el('defs', {}); defs.appendChild(grad);
    const mk = (cls) => el('path', { class: cls, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const ghost = mk('sh-fio__ghost'), glow = mk('sh-fio__glow'), line = mk('');
    ghost.setAttribute('stroke', 'var(--sh-gold-lo)'); ghost.setAttribute('stroke-width', 1);
    glow.setAttribute('stroke', `url(#${gid})`); line.setAttribute('stroke', `url(#${gid})`);
    const spark = el('circle', { class: 'sh-fio__spark', r: 3.5, cx: 0, cy: 0, fill: 'var(--sh-gold-hi)' }); spark.style.opacity = 0;
    svg.append(defs, ghost, glow, line, spark); host.prepend(svg);

    const S = { len: 0, startY: 0, endY: 1, lits: [], mobile: false };
    function calc() {
      if (o.progress != null) return clamp(o.progress);
      if (reduce) return 1;
      return clamp((innerHeight * anchor - host.getBoundingClientRect().top - S.startY) / Math.max(1, S.endY - S.startY));
    }
    function apply() {
      if (!S.len) return;
      const p = calc(), len = S.len, off = len * (1 - p);
      line.style.strokeDashoffset = off; glow.style.strokeDashoffset = off;
      const pt = line.getPointAtLength(len * p);
      spark.style.transform = `translate(${pt.x}px,${pt.y}px)`; spark.style.opacity = p > 0.002 ? 1 : 0;
      S.lits.forEach((l) => { const on = p >= 0.999 || l.y <= pt.y; if (on !== l.on) { l.on = on; l.el.setAttribute('data-lit', on); } });
    }
    function measure() {
      const hr = host.getBoundingClientRect(), w = host.clientWidth, h = host.offsetHeight;
      const rel = (e) => { const r = e.getBoundingClientRect(); return { x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height }; };
      const mobile = w < bp, rail = mobile ? 12 : Math.min(36, Math.max(12, w * 0.025));
      const pts = []; let routeY = null;
      host.querySelectorAll('[data-fio-stop]').forEach((st) => {
        const r = rel(st), y = r.y + (parseFloat(st.dataset.fioY) || 40);
        if (!pts.length) pts.push([rail, y]);
        if (st.dataset.fioStop === 'route') routeY = y;
      });
      if (!pts.length) pts.push([rail, 0]);
      let endY = h; const end = host.querySelector('[data-fio-end]');
      if (end) {
        const e = rel(end), ex = e.x + e.w / 2, ey = e.y + e.h / 2, y0 = routeY != null ? routeY : pts[pts.length - 1][1] + 40;
        endY = ey; pts.push([rail, y0]);
        if (ey > y0 + 80) { const dx = ex - rail, x1 = rail + dx * 0.3, x2 = rail + dx * 0.7, y2 = y0 + (ey - y0) * 0.5; pts.push([x1, y0], [x1, y2], [x2, y2], [x2, ey], [ex, ey]); }
        else pts.push([rail, ey], [ex, ey]);
      } else pts.push([rail, h - 24]);
      S.startY = pts[0][1]; S.endY = endY; S.mobile = mobile;
      S.lits = [...host.querySelectorAll('[data-fio-lit]')].map((e) => ({ el: e, y: rel(e).y + 20, on: null }));
      svg.setAttribute('width', w); svg.setAttribute('height', h); svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      grad.setAttribute('y2', h);
      const d = rounded(pts, mobile ? 10 : 16), sw = mobile ? 1.25 : 1.5;
      [ghost, glow, line].forEach((p) => p.setAttribute('d', d));
      line.setAttribute('stroke-width', sw); glow.setAttribute('stroke-width', sw * 4); spark.setAttribute('r', mobile ? 3 : 3.5);
      S.len = line.getTotalLength(); [line, glow].forEach((p) => { p.style.strokeDasharray = S.len; });
      apply();
    }
    let raf = 0; const tick = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); };
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick);
    if (window.ResizeObserver) new ResizeObserver(() => measure()).observe(host);
    addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    if (window.ScrollTrigger) ScrollTrigger.addEventListener('refresh', measure);
    measure();
    return { measure, apply, svg };
  };
})();
