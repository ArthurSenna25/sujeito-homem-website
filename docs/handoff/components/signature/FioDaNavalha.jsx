import React from 'react';

const clamp = (v) => Math.max(0, Math.min(1, v));

function roundedPath(raw, r) {
  const pts = raw.filter((p, i) => i === 0 || p[0] !== raw[i - 1][0] || p[1] !== raw[i - 1][1]);
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(cx - px, cy - py), l2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = cx - ((cx - px) / l1) * rr, ay = cy - ((cy - py) / l1) * rr;
    const bx = cx + ((nx - cx) / l2) * rr, by = cy + ((ny - cy) / l2) * rr;
    d += ` L${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L${last[0]} ${last[1]}`;
}

/** O fio da navalha — linha de luz dourada desenhada pelo scroll (stroke-dashoffset).
 *  Coloque como 1º filho de um contêiner `position:relative` que envolva todos os atos. */
export function FioDaNavalha({
  progress, breakpoint = 768, strokeWidth, anchor = 0.55,
  stopSelector = '[data-fio-stop]', spineSelector = '[data-fio-spine]',
  endSelector = '[data-fio-end]', litSelector = '[data-fio-lit]', ...rest
}) {
  const svgRef = React.useRef(null), pathRef = React.useRef(null), glowRef = React.useRef(null), sparkRef = React.useRef(null);
  const gid = React.useRef('fio' + Math.random().toString(36).slice(2, 7)).current;
  const [geo, setGeo] = React.useState({ d: '', w: 0, h: 0, mobile: false });
  const S = React.useRef({ len: 0, startY: 0, endY: 1, lits: [] });
  const reduce = React.useRef(false);

  const calc = React.useCallback(() => {
    if (progress != null) return clamp(progress);
    if (reduce.current) return 1;
    const host = svgRef.current.parentElement;
    const top = host.getBoundingClientRect().top;
    const { startY, endY } = S.current;
    return clamp((window.innerHeight * anchor - top - startY) / Math.max(1, endY - startY));
  }, [progress, anchor]);

  const apply = React.useCallback(() => {
    const path = pathRef.current;
    if (!path || !S.current.len) return;
    const p = calc(), len = S.current.len;
    path.style.strokeDashoffset = len * (1 - p);
    glowRef.current.style.strokeDashoffset = len * (1 - p);
    const pt = path.getPointAtLength(len * p);
    sparkRef.current.style.transform = `translate(${pt.x}px,${pt.y}px)`;
    sparkRef.current.style.opacity = p > 0.002 ? 1 : 0;
    S.current.lits.forEach((l) => {
      const on = p >= 0.999 || l.y <= pt.y;
      if (on !== l.on) { l.on = on; l.el.setAttribute('data-lit', on ? 'true' : 'false'); }
    });
  }, [calc]);

  const measure = React.useCallback(() => {
    const svg = svgRef.current; if (!svg) return;
    const host = svg.parentElement, hr = host.getBoundingClientRect();
    const w = host.clientWidth, h = host.offsetHeight;
    const rel = (el) => { const r = el.getBoundingClientRect(); return { x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height }; };
    const mobile = w < breakpoint;
    const rail = mobile ? 12 : Math.min(36, Math.max(12, w * 0.025));
    const pts = []; let routeY = null;
    host.querySelectorAll(stopSelector).forEach((st) => {
      const r = rel(st), mode = st.dataset.fioStop || 'rail';
      const y = r.y + (parseFloat(st.dataset.fioY) || 40);
      if (!pts.length) pts.push([rail, y]);
      if (mode === 'spine' && !mobile) {
        const sp = st.querySelector(spineSelector);
        if (sp) { const s = rel(sp), sx = s.x + s.w / 2; pts.push([rail, s.y - 40], [sx, s.y - 40], [sx, s.y + s.h + 40], [rail, s.y + s.h + 40]); }
      }
      if (mode === 'route') routeY = y;
    });
    if (!pts.length) pts.push([rail, 0]);
    let endY = h;
    const end = host.querySelector(endSelector);
    if (end) {
      const e = rel(end), ex = e.x + e.w / 2, ey = e.y + e.h / 2;
      const y0 = routeY != null ? routeY : pts[pts.length - 1][1] + 40;
      endY = ey;
      pts.push([rail, y0]);
      if (ey > y0 + 80) {
        const dx = ex - rail, x1 = rail + dx * 0.28, x2 = rail + dx * 0.72, y2 = y0 + (ey - y0) * 0.5;
        pts.push([x1, y0], [x1, y2], [x2, y2], [x2, ey], [ex, ey]);
      } else pts.push([rail, ey], [ex, ey]);
    } else pts.push([rail, h - 24]);
    S.current.startY = pts[0][1]; S.current.endY = endY;
    S.current.lits = [...host.querySelectorAll(litSelector)].map((el) => { const r = rel(el); return { el, y: r.y + Math.min(r.h / 2, 28), on: null }; });
    setGeo({ d: roundedPath(pts, mobile ? 10 : 16), w, h, mobile });
  }, [breakpoint, stopSelector, spineSelector, endSelector, litSelector]);

  React.useLayoutEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    measure();
    const host = svgRef.current.parentElement;
    const ro = new ResizeObserver(measure); ro.observe(host);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    return () => { ro.disconnect(); window.removeEventListener('load', measure); };
  }, [measure]);

  React.useLayoutEffect(() => {
    const path = pathRef.current; if (!path || !geo.d) return;
    const len = path.getTotalLength(); S.current.len = len;
    [path, glowRef.current].forEach((p) => { p.style.strokeDasharray = len; });
    apply();
  }, [geo.d, apply]);

  React.useEffect(() => {
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [apply]);

  const sw = strokeWidth || (geo.mobile ? 1.25 : 1.5);
  const common = { d: geo.d, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg ref={svgRef} className="sh-fio" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w || 1} ${geo.h || 1}`} aria-hidden="true" focusable="false" {...rest}>
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.h || 1}>
          <stop offset="0" style={{ stopColor: 'var(--sh-gold-lo)' }} />
          <stop offset="0.45" style={{ stopColor: 'var(--sh-gold)' }} />
          <stop offset="1" style={{ stopColor: 'var(--sh-gold-hi)' }} />
        </linearGradient>
      </defs>
      <path className="sh-fio__ghost" {...common} stroke="var(--sh-gold-lo)" strokeWidth={1} />
      <path ref={glowRef} className="sh-fio__glow" {...common} stroke={`url(#${gid})`} strokeWidth={sw * 4} />
      <path ref={pathRef} {...common} stroke={`url(#${gid})`} strokeWidth={sw} />
      <circle ref={sparkRef} className="sh-fio__spark" r={geo.mobile ? 3 : 3.5} cx="0" cy="0" fill="var(--sh-gold-hi)" style={{ opacity: 0 }} />
    </svg>
  );
}
