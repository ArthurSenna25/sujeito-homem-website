/* Como chegar — MapLibre GL (carregado sob demanda) + tiles vetoriais OpenFreeMap retintados na paleta.
   Cena de scroll: fly-to SP → Jales → bairro → rua. Rota: ROUTING (ORS) ou modo degradado "demo". */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mapEl = $('#map'), panel = $('#mapPanel');
  const nav = $('#mapNav'), ifG = $('#ifG'), navView = $('#navView'); let URLS = {}, failT = 0, drawId = 0, drawing = false, routeState = null;
  const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty', PHOTON = 'https://photon.komoot.io/api/';
  let map = null, dest = DEST.lat != null ? { lat: DEST.lat, lng: DEST.lng } : null, destMarker = null, originMarker = null, routeMode = false, KEYS = null, ready = false, origin = null, raf = 0, pinEl = null;

  const C = { bg: '#13100D', land: '#191510', land2: '#1c1814', water: '#1d2733', park: '#1a1d16', road: '#4a4033', major: '#6a5c49', casing: '#13100D', bldg: '#2a231b', text: '#968B79' };
  function tint(st) {
    st.layers.forEach((l) => {
      const id = l.id; l.paint = l.paint || {}; const p = l.paint;
      if (l.type === 'background') p['background-color'] = C.bg;
      else if (l.type === 'raster') l.layout = Object.assign({}, l.layout, { visibility: 'none' });
      else if (l.type === 'fill') { p['fill-color'] = /water/.test(id) ? C.water : /park|wood|grass|wetland|pitch/.test(id) ? C.park : /building/.test(id) ? C.bldg : /residential|school|hospital|cemetery/.test(id) ? C.land2 : C.land; delete p['fill-pattern']; if (p['fill-outline-color']) p['fill-outline-color'] = C.land; }
      else if (l.type === 'fill-extrusion') { p['fill-extrusion-color'] = C.bldg; p['fill-extrusion-opacity'] = 0.92; delete p['fill-extrusion-pattern']; }
      else if (l.type === 'line') { if (/boundary|admin/.test(id)) { l.layout = Object.assign({}, l.layout, { visibility: 'none' }); return; } p['line-color'] = /waterway/.test(id) ? C.water : /casing/.test(id) ? C.casing : /motorway|trunk|primary/.test(id) ? C.major : /rail|transit/.test(id) ? C.land2 : C.road; delete p['line-pattern']; }
      else if (l.type === 'symbol') { p['text-color'] = C.text; p['text-halo-color'] = C.bg; if (p['icon-opacity'] !== undefined) p['icon-opacity'] = 0.55; }
    });
    return st;
  }
  const loadLib = async () => { if (window.maplibregl) return; const [lib] = await Promise.all([import("maplibre-gl"), import("maplibre-gl/dist/maplibre-gl.css")]); window.maplibregl = lib.default || lib; }; // npm + chunk separado: só baixa perto da seção
  const hav = (a, b) => { const R = 6371000, r = Math.PI / 180, dLa = (b[1] - a[1]) * r, dLo = (b[0] - a[0]) * r, x = Math.sin(dLa / 2) ** 2 + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
  const bearing = (a, b) => { const r = Math.PI / 180, y = Math.sin((b[0] - a[0]) * r) * Math.cos(b[1] * r), x = Math.cos(a[1] * r) * Math.sin(b[1] * r) - Math.sin(a[1] * r) * Math.cos(b[1] * r) * Math.cos((b[0] - a[0]) * r); return (Math.atan2(y, x) / r + 360) % 360; };

  async function geocode(q) { const r = await fetch(`${PHOTON}?q=${encodeURIComponent(q)}&limit=5`); const j = await r.json(); return j.features || []; }
  const label = (f) => { const p = f.properties; return [p.name || [p.street, p.housenumber].filter(Boolean).join(' '), p.district || p.locality, p.city, p.state].filter(Boolean).join(', '); };

  function buildKeys() { const d = [dest.lng, dest.lat]; KEYS = [{ t: 0, c: [-48.7, -22.2], z: 5.1, p: 0, b: 0 }, { t: 0.36, c: d, z: 11.4, p: 22, b: 0 }, { t: 0.68, c: d, z: 14.6, p: 48, b: -18 }, { t: 1, c: d, z: 17.5, p: 62, b: -34 }]; }
  const ease = (x) => x * x * (3 - 2 * x), lerp = (a, b, k) => a + (b - a) * k;
  function cam(p) {
    if (!ready || routeMode) return;
    let i = 0; while (i < KEYS.length - 2 && p > KEYS[i + 1].t) i++;
    const a = KEYS[i], b = KEYS[i + 1], k = ease(clamp((p - a.t) / (b.t - a.t)));
    map.jumpTo({ center: [lerp(a.c[0], b.c[0], k), lerp(a.c[1], b.c[1], k)], zoom: lerp(a.z, b.z, k), pitch: lerp(a.p, b.p, k), bearing: lerp(a.b, b.b, k) });
    if (pinEl) pinEl.style.opacity = clamp((p - 0.6) / 0.25);
  }

  function pinNode(o) { const d = document.createElement('div'); d.className = 'sh-pin' + (o.origin ? ' sh-pin--origin' : ''); d.innerHTML = `${o.label ? `<div class="sh-pin__label"><span class="sh-pin__name">${o.label}</span>${o.sub ? `<span class="sh-pin__sub">${o.sub}</span>` : ''}</div>` : ''}<span class="sh-pin__core"></span>`; return d; }

  async function boot() {
    try {
      if (!dest) { const fs = await geocode(ADDRESS_Q); const f = fs.find((x) => x.properties.housenumber === '1946') || fs[0]; if (!f) throw 0; dest = { lng: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] }; }
      buildKeys(); await loadLib();
      const style = tint(await (await fetch(STYLE_URL)).json());
      map = new maplibregl.Map({ container: 'map', style, center: KEYS[0].c, zoom: KEYS[0].z, pitch: 0, bearing: 0, attributionControl: false, cooperativeGestures: matchMedia('(max-width:899px)').matches, maxPitch: 75 });
      map.addControl(new maplibregl.AttributionControl({ compact: true }));
      map.scrollZoom.disable();
      await new Promise((res) => map.on('load', res));
      pinEl = pinNode({ label: 'Sujeito Homem', sub: 'Rua Nova Iorque, 1946' }); pinEl.style.opacity = 0;
      destMarker = new maplibregl.Marker({ element: pinEl, anchor: 'bottom', offset: [0, 10] }).setLngLat([dest.lng, dest.lat]).addTo(map);
      ['route', 'head'].forEach((s) => map.addSource(s, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } }));
      map.addLayer({ id: 'route-glow', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#E3A24B', 'line-width': 12, 'line-blur': 7, 'line-opacity': 0.4 } });
      map.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#F2BC6A', 'line-width': 3.5 } });
      map.addLayer({ id: 'head-glow', type: 'circle', source: 'head', paint: { 'circle-radius': 13, 'circle-color': '#E3A24B', 'circle-opacity': 0.5, 'circle-blur': 0.8 } });
      map.addLayer({ id: 'head-dot', type: 'circle', source: 'head', paint: { 'circle-radius': 5, 'circle-color': '#fff3d6' } });
      ready = true; wireScroll(); cam(0);
    } catch (e) { console.warn('mapa indisponível', e); $('#mapFallback').hidden = false; $('#map').hidden = true; }
  }
  function wireScroll() {
    const mm = gsap.matchMedia();
    mm.add('(min-width:900px) and (min-height:720px)', () => { const t = ScrollTrigger.create({ trigger: '.mapa__scene', start: 'top top', end: '+=170%', pin: true, scrub: true, onUpdate: (s) => cam(s.progress) }); return () => t.kill(); });
    mm.add('(max-width:899px), (max-height:719px)', () => { const t = ScrollTrigger.create({ trigger: '.mapa__scene', start: 'top 85%', end: 'center 45%', scrub: true, onUpdate: (s) => cam(s.progress) }); return () => t.kill(); });
    if (reduce) cam(1);
    ScrollTrigger.sort(); ScrollTrigger.refresh();
  }
  (function lazy() { let done = false; const chk = () => { if (done) return; if ($('#mapa').getBoundingClientRect().top < innerHeight + 1800) { done = true; removeEventListener('scroll', chk); boot(); } }; addEventListener('scroll', chk, { passive: true }); chk(); })();

  // ----- rota -----
  function densify(pts, step) { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], k = Math.max(1, Math.round(hav(a, b) / step)); for (let j = 1; j <= k; j++) out.push([lerp(a[0], b[0], j / k), lerp(a[1], b[1], j / k)]); } return out; }
  function demoRoute(o) {
    const d = [dest.lng, dest.lat], m1 = [o[0], lerp(o[1], d[1], 0.45)], m2 = [lerp(o[0], d[0], 0.62), m1[1]], m3 = [m2[0], d[1]];
    const coords = densify([o, m1, m2, m3, d], 40); let dist = 0; for (let i = 1; i < coords.length; i++) dist += hav(coords[i - 1], coords[i]);
    return { coords, dist: dist * 1.18, dur: (dist * 1.18) / 8.3, steps: [], demo: true };
  }
  async function getRoute(o) {
    if (ROUTING.provider === 'ors' && (ROUTING.key || ROUTING.endpoint)) {
      try {
        const r = await fetch(ROUTING.endpoint || 'https://api.openrouteservice.org/v2/directions/driving-car/geojson', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, ROUTING.key ? { Authorization: ROUTING.key } : {}), body: JSON.stringify({ coordinates: [o, [dest.lng, dest.lat]], language: 'pt', instructions: true }) });
        if (!r.ok) throw 0; const f = (await r.json()).features[0], s = f.properties.segments[0];
        return { coords: f.geometry.coordinates, dist: s.distance, dur: s.duration, steps: s.steps.map((x) => x.instruction), demo: false };
      } catch (e) { /* tenta OSRM */ }
    }
    try {
      const ac = new AbortController(), to = setTimeout(() => ac.abort(), 7000);
      const r = await fetch('https://router.project-osrm.org/route/v1/driving/' + o[0] + ',' + o[1] + ';' + dest.lng + ',' + dest.lat + '?overview=full&geometries=geojson', { signal: ac.signal }); clearTimeout(to);
      if (!r.ok) throw 0; const rt = ((await r.json()).routes || [])[0]; if (!rt || !rt.geometry.coordinates.length) throw 0;
      return { coords: rt.geometry.coordinates, dist: rt.distance, dur: rt.duration, steps: [], demo: false };
    } catch (e) { /* cai no modo degradado */ }
    return demoRoute(o);
  }
  function info(r) {
    const el = $('#routeInfo'); el.hidden = false;
    el.innerHTML = `<div class="route__n"><span>${(r.dist / 1000).toFixed(1).replace('.', ',')}<small>km</small></span><span>${Math.max(1, Math.round(r.dur / 60))}<small>min</small></span></div><span class="route__tag">Rota estimada</span>`;
  }
  // enquadra a rota inteira + os dois pinos no espaço livre entre formulário e painel (larguras medidas)
  function frameRoute(dur) {
    if (!routeState || drawing || !map) return;
    const mob = matchMedia('(max-width:899px)').matches, sc = $('#mapScene'), cs = getComputedStyle(sc), on = nav.classList.contains('is-open');
    let pad;
    if (mob) { const nh = on ? (nav.classList.contains('is-min') ? 44 : nav.offsetHeight) : 36; pad = { top: 70, bottom: 60 + nh + 24, left: 40, right: 40 }; }
    else pad = { top: 96, bottom: 96, left: panel.offsetWidth + parseFloat(cs.paddingLeft) + 48, right: (on ? nav.offsetWidth + parseFloat(cs.paddingRight) : 0) + 48 };
    const fit = (a, b, size) => { const mx = Math.max(60, size - 120); if (pad[a] + pad[b] > mx) { const k = mx / (pad[a] + pad[b]); pad[a] *= k; pad[b] *= k; } };
    fit('left', 'right', sc.clientWidth); fit('top', 'bottom', sc.clientHeight);
    map.fitBounds(routeState.bounds, { padding: pad, maxZoom: 16, pitch: 38, bearing: 0, duration: reduce ? 0 : dur });
  }
  let refitT = 0; const refit = () => { clearTimeout(refitT); refitT = setTimeout(() => frameRoute(600), 150); };
  addEventListener('resize', refit); if (window.ResizeObserver) new ResizeObserver(refit).observe(nav);
  function showNav() { nav.classList.remove('is-min'); nav.classList.add('is-open'); $('#navHandle').setAttribute('aria-expanded', 'true'); frameRoute(900); }
  function hideNav() { nav.classList.remove('is-open', 'is-preview', 'is-min'); navView.hidden = true; $('#prevBtn').textContent = 'Ver prévia no Google Maps'; $('#prevBtn').setAttribute('aria-expanded', 'false'); }
  async function draw(o, text) {
    const id = ++drawId; hideNav(); URLS = urlsFor(Array.isArray(o) && o.length ? o : null); setApps();
    if (!ready) { const r = demoRoute(o.length ? o : [dest.lng - 0.01, dest.lat - 0.008]); info(r); nav.classList.add('is-open'); return; }
    const r = await getRoute(o); if (id !== drawId) return; info(r); routeMode = true; drawing = true; routeState = null; cancelAnimationFrame(raf);
    if (originMarker) originMarker.remove(); originMarker = new maplibregl.Marker({ element: pinNode({ origin: true, label: 'Você' }), anchor: 'bottom', offset: [0, 10] }).setLngLat(o).addTo(map);
    pinEl.style.opacity = 1;
    const cs = r.coords, cum = [0]; for (let i = 1; i < cs.length; i++) cum[i] = cum[i - 1] + hav(cs[i - 1], cs[i]); const total = cum[cum.length - 1] || 1;
    const src = map.getSource('route'), head = map.getSource('head'), fc = (g) => ({ type: 'FeatureCollection', features: [{ type: 'Feature', geometry: g, properties: {} }] });
    const bounds = cs.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(cs[0], cs[0]));
    bounds.extend(o); bounds.extend([dest.lng, dest.lat]);
    // (b) rota desenhada com o mapa 100% visível → enquadra → (c) +600ms depois o painel surge
    const finish = () => {
      src.setData(fc({ type: 'LineString', coordinates: cs })); head.setData(fc({ type: 'Point', coordinates: cs[cs.length - 1] }));
      drawing = false; routeState = { bounds }; frameRoute(1500);
      let fired = false; const go = () => { if (fired || id !== drawId) return; fired = true; setTimeout(() => { if (id === drawId) showNav(); }, 600); };
      map.once('moveend', go); setTimeout(go, (reduce ? 0 : 1500) + 500);
    };
    if (reduce) return finish();
    const dur = clamp(total * 1.1, 2600, 5600), t0 = performance.now(); let hd = map.getBearing();
    (function frame(now) {
      if (id !== drawId) return;
      const k = clamp((now - t0) / dur), e = ease(k), d = e * total; let j = 1; while (j < cs.length - 1 && cum[j] < d) j++;
      const a = cs[j - 1], b = cs[j], seg = (d - cum[j - 1]) / ((cum[j] - cum[j - 1]) || 1), tip = [lerp(a[0], b[0], clamp(seg)), lerp(a[1], b[1], clamp(seg))];
      src.setData(fc({ type: 'LineString', coordinates: cs.slice(0, j).concat([tip]) })); head.setData(fc({ type: 'Point', coordinates: tip }));
      let tb = bearing(a, b); let diff = ((tb - hd + 540) % 360) - 180; hd += diff * 0.08;
      map.jumpTo({ center: tip, zoom: 15.4, pitch: 56, bearing: hd });
      if (k < 1) raf = requestAnimationFrame(frame); else finish();
    })(t0);
  }

  // ----- campo de origem (autocomplete acessível) -----
  const input = $('#from'), sug = $('#sug'); let items = [], act = -1, deb = 0;
  const closeSug = () => { sug.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); act = -1; };
  function show() { sug.innerHTML = items.map((f, i) => `<li role="option" id="sg${i}" aria-selected="false" data-i="${i}">${label(f)}</li>`).join(''); sug.hidden = !items.length; input.setAttribute('aria-expanded', String(!!items.length)); }
  function mark(i) { act = i; $$('li', sug).forEach((li, k) => li.setAttribute('aria-selected', k === i)); if (i >= 0) input.setAttribute('aria-activedescendant', 'sg' + i); }
  function pick(i) { const f = items[i]; if (!f) return; input.value = label(f); origin = f.geometry.coordinates; closeSug(); }
  input.addEventListener('input', () => { origin = null; clearTimeout(deb); const q = input.value.trim(); if (q.length < 3) { items = []; return closeSug(); } deb = setTimeout(async () => { try { const near = dest ? `&lat=${dest.lat}&lon=${dest.lng}` : ''; const j = await (await fetch(`${PHOTON}?q=${encodeURIComponent(q + ' Jales')}&limit=5${near}`)).json(); items = j.features || []; show(); } catch (e) { items = []; closeSug(); } }, 320); });
  input.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); mark(Math.min(items.length - 1, act + 1)); } else if (e.key === 'ArrowUp') { e.preventDefault(); mark(Math.max(0, act - 1)); } else if (e.key === 'Enter' && act >= 0 && !sug.hidden) { e.preventDefault(); pick(act); } else if (e.key === 'Escape') closeSug(); });
  sug.addEventListener('mousedown', (e) => { const li = e.target.closest('li'); if (li) { e.preventDefault(); pick(+li.dataset.i); } });
  input.addEventListener('blur', () => setTimeout(closeSug, 120));
  $('#routeForm').addEventListener('submit', async (e) => {
    e.preventDefault(); if (!dest) return toast('Mapa indisponível agora');
    const q = input.value.trim(); if (!q) { input.focus(); return toast('Digite de onde você vem'); }
    try { if (!origin) { const fs = await geocode(q + ' Jales'); if (!fs.length) return toast('Endereço não encontrado'); origin = fs[0].geometry.coordinates; } } catch (er) { return toast('Não consegui buscar o endereço'); }
    closeSug(); draw(origin, q);
  });
  $('#geoBtn').addEventListener('click', () => {
    if (!navigator.geolocation) return toast('Localização indisponível neste aparelho');
    navigator.geolocation.getCurrentPosition((p) => { origin = [p.coords.longitude, p.coords.latitude]; input.value = 'Minha localização'; draw(origin, ''); }, () => toast('Sem permissão de localização — digite o endereço'), { timeout: 8000 });
  });
  $('#sheetGrip').addEventListener('click', () => { const o = panel.classList.toggle('is-open'); $('#sheetGrip').setAttribute('aria-expanded', o); });
  $('#facadeBtn').addEventListener('click', () => { $('#dlgBody').innerHTML = `<img src="../../assets/fachada/fachada-real.webp" alt="Fachada da Sujeito Homem: letreiro azul-escuro com o logo, número ao lado da porta e tabela de horários na vitrine" style="max-width:340px;margin:auto"><p class="dlg__cap">Letreiro azul-escuro com o logo, número ao lado da porta e horários na vitrine. Rua Nova Iorque, 1946.</p>`; $('#dlg').showModal(); });

  // ----- painel compacto: distância/tempo, abrir nos apps, prévia opcional (nunca abre sozinha) -----
  function urlsFor(o) {
    const org = o ? `${o[1]},${o[0]}` : '', d = dest ? `${dest.lat},${dest.lng}` : ADDRESS_Q;
    return { g: `https://www.google.com/maps?saddr=${encodeURIComponent(org)}&daddr=${encodeURIComponent(d)}&output=embed`,
      appG: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(d)}${org ? '&origin=' + encodeURIComponent(org) : ''}`, appW: dest ? `https://waze.com/ul?ll=${dest.lat},${dest.lng}&navigate=yes` : `https://waze.com/ul?q=${encodeURIComponent(ADDRESS_Q)}&navigate=yes` };
  }
  function setApps() { $$('[data-app]', nav).forEach((a) => { a.href = URLS['app' + a.dataset.app.toUpperCase()] || '#'; }); }
  function loadPrev() {
    const u = URLS.g; navView.classList.remove('is-fail'); if (!u) { navView.classList.add('is-fail'); return; }
    if (ifG.dataset.src !== u) { ifG.dataset.src = u; delete ifG.dataset.ok; ifG.onload = () => { ifG.dataset.ok = 1; clearTimeout(failT); }; ifG.src = u; clearTimeout(failT); failT = setTimeout(() => { if (!ifG.dataset.ok) navView.classList.add('is-fail'); }, 7000); }
  }
  $('#prevBtn').addEventListener('click', () => {
    const open = navView.hidden; navView.hidden = !open; nav.classList.toggle('is-preview', open);
    $('#prevBtn').textContent = open ? 'Ocultar prévia' : 'Ver prévia no Google Maps'; $('#prevBtn').setAttribute('aria-expanded', String(open)); if (open) loadPrev();
  });
  $('#navX').addEventListener('click', () => { hideNav(); frameRoute(700); });
  // mobile: handle arrastável (ou toque) para minimizar / expandir
  (function () {
    const hd = $('#navHandle'); let y0 = null, moved = false;
    const set = (min) => { nav.classList.toggle('is-min', min); hd.setAttribute('aria-expanded', String(!min)); frameRoute(500); };
    hd.addEventListener('pointerdown', (e) => { y0 = e.clientY; moved = false; hd.setPointerCapture(e.pointerId); });
    hd.addEventListener('pointermove', (e) => { if (y0 != null && Math.abs(e.clientY - y0) > 6) moved = true; });
    hd.addEventListener('pointerup', (e) => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null; if (moved && Math.abs(dy) > 24) set(dy > 0); else if (!moved) set(!nav.classList.contains('is-min')); });
    hd.addEventListener('pointercancel', () => { y0 = null; });
  })();
})();
