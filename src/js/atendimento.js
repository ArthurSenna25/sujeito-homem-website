
/* Monte o seu atendimento — cena fixada (pin). Fonte única de verdade = índice ativo, derivado do scroll.
   palco (crossfade) | lista (translateY centralizada) | comanda (voo do thumbnail em camada fixed no <body>). */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);
  const SERVICES = [
    { id: 'degrade', name: 'Corte degradê', short: 'degradê', blurb: 'Transição suave nas laterais, linha limpa.', card: 'degrade', stage: 'degrade', cap: 'Laterais em transição suave, linha limpa.' },
    { id: 'lowfade', name: 'Low fade', short: 'low fade', blurb: 'Linha baixa, rente à orelha.', card: 'low-fade', stage: 'low-fade', cap: 'Linha baixa, rente à orelha.' },
    { id: 'tesoura', name: 'Corte na tesoura', short: 'tesoura', blurb: 'Volume e textura no topo.', card: 'tesoura', stage: 'tesoura', cap: 'Volume e textura no topo.' },
    { id: 'tradicional', name: 'Tradicional / moderno', short: 'tradicional', blurb: 'Risca e acabamento do jeito que você usa.', card: 'tradicional', stage: 'tradicional', cap: 'Risca e acabamento do seu jeito.' },
    { id: 'barba', name: 'Barba', short: 'barba', blurb: 'Contorno desenhado e aparado.', card: 'barba', stage: 'barba', cap: 'Contorno desenhado e aparado.' },
    { id: 'bigode', name: 'Bigode', short: 'bigode', blurb: 'Traço preciso sob o nariz.', card: 'bigode', stage: 'bigode', cap: 'Traço preciso sob o nariz.' },
    { id: 'infantil', name: 'Corte infantil', short: 'infantil', blurb: 'Com paciência e capricho.', card: 'infantil', stage: 'base', cap: 'Mesma precisão, no tamanho dos pequenos. (Sem imagem ilustrativa infantil.)' },
    { id: 'combo', name: 'Corte + barba', short: 'corte + barba', blurb: 'Degradê e barba na mesma cadeira.', card: 'combo', stage: 'combo', cap: 'Corte e barba na mesma cadeira.' },
  ];
  const BARBERS = ['Sem preferência', 'Renan', 'Vitor', 'Edivaldo'];
  const N = SERVICES.length, pad = (v) => String(v).padStart(2, '0'), byId = (id) => SERVICES.find((s) => s.id === id);
  const scene = $('.atd__scene'), grid = $('.atd__grid'), cf = $('#cf'), view = $('#cfView'), track = $('#cfTrack'), dotsEl = $('#cfDots'), ticket = $('#ticket'), list = $('#tkList'), media = $('#stMedia');
  let selected = [], barber = BARBERS[0], active = -1, pinST = null, snapMode = false, flying = false, barMode = false, inView = false, curImg = null;

  // ----- DOM: cartões, pontos, imagens do palco (todas pré-carregadas) -----
  track.innerHTML = SERVICES.map((s, i) => '<article class="cf__card" data-i="' + i + '" aria-label="' + s.name + '"><div class="cf__art"><img src="' + A + 'cards/' + s.card + '.webp" width="1024" height="1536" alt="" draggable="false"><span class="cf__badge" aria-hidden="true"><i class="ic ic-check"></i></span></div><div class="cf__body"><h3>' + s.name + '</h3><div class="cf__more"><p>' + s.blurb + '</p><button type="button" class="sh-btn sh-btn--secondary sh-btn--sm" data-add aria-pressed="false">Adicionar</button></div></div></article>').join('');
  dotsEl.innerHTML = SERVICES.map((s, i) => '<button type="button" data-i="' + i + '" aria-label="' + (i + 1) + ' de ' + N + ': ' + s.name + '"></button>').join('');
  const cards = $$('.cf__card', track), dots = $$('button', dotsEl), mores = cards.map((c) => $('.cf__more', c));
  const stImgs = {};
  media.insertAdjacentHTML('afterbegin', [...new Set(SERVICES.map((s) => s.stage))].map((f) => '<img class="stage__img" data-f="' + f + '" src="' + A + 'stage/' + f + '.webp" width="1024" height="1536" alt="" decoding="async">').join(''));
  $$('.stage__img', media).forEach((im) => { stImgs[im.dataset.f] = im; });

  // ----- palco: crossfade 0.5s + translateY 12px -----
  function paintStage(i, instant) {
    const s = SERVICES[i], im = stImgs[s.stage], d = instant || REDUCE ? 0 : 0.5;
    if (im !== curImg) {
      if (curImg) { curImg.alt = ''; curImg.style.zIndex = 1; gsap.to(curImg, { opacity: 0, duration: d, ease: 'power1.out', overwrite: true }); }
      im.style.zIndex = 2; im.alt = 'Retrato ilustrativo — ' + s.name;
      gsap.fromTo(im, { opacity: d ? 0 : 1, y: d ? 12 : 0 }, { opacity: 1, y: 0, duration: d, ease: 'power2.out', overwrite: true });
      curImg = im;
    }
    $('#stName').textContent = s.name; $('#stText').textContent = s.cap;
    if (d) gsap.fromTo('#stageCap', { opacity: 0 }, { opacity: 1, duration: 0.4, overwrite: true });
  }

  // ----- lista: desloca para centralizar o ativo; vizinhos 0.94 / .55; só 3 visíveis -----
  function layoutList(instant) {
    const d = instant || REDUCE ? 0 : 0.5, cH = cards[0].offsetHeight, vH = view.clientHeight; if (!cH || active < 0) return;
    const gap = parseFloat(getComputedStyle(track).rowGap) || 16;
    gsap.to(track, { y: vH / 2 - (active * (cH + gap) + cH / 2), duration: d, ease: 'power3.out', overwrite: 'auto' });
    cards.forEach((c, k) => {
      const off = Math.abs(k - active), on = off === 0;
      gsap.to(c, { scale: on ? 1 : 0.94, autoAlpha: on ? 1 : off === 1 ? 0.55 : 0, duration: d * 0.8, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(mores[k], { autoAlpha: on ? 1 : 0, duration: d * 0.8, overwrite: 'auto' });
      $('[data-add]', c).tabIndex = on ? 0 : -1;
    });
  }
  function clearList() { gsap.set([track, ...cards, ...mores], { clearProps: 'transform,opacity,visibility,scale,y' }); cards.forEach((c) => { $('[data-add]', c).tabIndex = 0; }); }

  // única porta de entrada do estado: setActive (chamada só pelo scroll)
  function setActive(i, instant) {
    i = clamp(i, 0, N - 1); if (i === active && !instant) return; active = i;
    $('#cfCount').textContent = pad(i + 1) + ' / ' + pad(N);
    cards.forEach((c, k) => { c.classList.toggle('is-active', k === i); c.setAttribute('aria-current', k === i); });
    dots.forEach((b, k) => b.setAttribute('aria-current', k === i));
    paintStage(i, instant); if (!snapMode) layoutList(instant);
  }
  // clicar rola até o ponto exato do índice; nunca altera o estado por fora do scroll
  function goTo(i) {
    i = clamp(i, 0, N - 1); const beh = REDUCE ? 'auto' : 'smooth';
    if (!snapMode && pinST) { const y = pinST.start + i * (pinST.end - pinST.start) / (N - 1); goToY(y, beh); }
    else view.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: beh });
  }
  dotsEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) goTo(+b.dataset.i); });
  track.addEventListener('click', (e) => { const c = e.target.closest('.cf__card'); if (!c) return; const i = +c.dataset.i; if (e.target.closest('[data-add]')) toggle(SERVICES[i].id); else if (i !== active) goTo(i); });
  cf.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); goTo(active + 1); } else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
    else if ((k === 'Enter' || k === ' ') && e.target === cf) { e.preventDefault(); toggle(SERVICES[active].id); }
  });

  // ----- comanda -----
  function makeRow(s) {
    const li = document.createElement('li'); li.dataset.id = s.id; li.style.opacity = 0;
    li.innerHTML = '<img class="tk__ic" src="' + A + 'cards/' + s.card + '.webp" width="32" height="32" alt=""><span class="tk__nm">' + s.name + '</span><button type="button" aria-label="Remover ' + s.name + '">×</button><i class="tk__pulse" aria-hidden="true"></i>';
    list.appendChild(li); return li;
  }
  function sync() {
    const ss = selected.map(byId), k = ss.length, book = $('#tkBook'), wa = $('#tkWa');
    $('#tkEmpty').hidden = k > 0; $('#tkTotal').textContent = k + ' ' + (k === 1 ? 'serviço' : 'serviços');
    $('#tkSum').textContent = k ? 'Sua comanda · ' + k + ' ' + (k > 1 ? 'itens' : 'item') : 'Sua comanda · vazia';
    $('#tkBookT').textContent = k ? 'Agendar' : 'Escolha um serviço'; $('#tkBookN').textContent = k ? '(' + k + ')' : '';
    book.setAttribute('aria-disabled', k ? 'false' : 'true'); wa.setAttribute('aria-disabled', k ? 'false' : 'true');
    wa.href = k ? waUrl('Olá! Quero agendar: ' + ss.map((s) => s.name).join(' + ') + '.' + (barber !== BARBERS[0] ? ' Barbeiro: ' + barber + '.' : '') + ' Pode me passar os horários?') : '#';
    if (!BOOKING_URL.startsWith('#')) { book.href = BOOKING_URL; book.target = '_blank'; book.rel = 'noopener'; }
    wa.target = '_blank'; wa.rel = 'noopener';
    cards.forEach((c, i) => { const on = selected.includes(SERVICES[i].id); c.classList.toggle('is-on', on); const b = $('[data-add]', c); b.setAttribute('aria-pressed', on); b.textContent = on ? 'Remover da comanda' : 'Adicionar'; });
  }
  const tick = () => { if (REDUCE) return; gsap.fromTo(['#tkTotal', '#tkBookN', '#tkSum'], { scale: 1.06 }, { scale: 1, duration: 0.3, ease: 'power2.out', overwrite: true }); };
  const pulse = (row) => gsap.fromTo($('.tk__pulse', row), { opacity: 1, scale: 1 }, { opacity: 0, scale: REDUCE ? 1 : 1.04, duration: 0.7, ease: 'power2.out' });
  const showRow = (row) => { if (REDUCE) { row.style.opacity = 1; return; } gsap.fromTo(row, { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.3, ease: 'power2.out', clearProps: 'clipPath' }); };
  const lockBtns = (v) => $$('[data-add]').forEach((b) => { b.disabled = v; });

  function toggle(id) {
    if (flying) return;
    const s = byId(id), i = SERVICES.indexOf(s);
    if (selected.includes(id)) { // remover: fade curto
      selected = selected.filter((x) => x !== id); const row = $('li[data-id="' + id + '"]', list); sync(); tick();
      if (row) { if (REDUCE) row.remove(); else gsap.to(row, { opacity: 0, duration: 0.2, onComplete: () => row.remove() }); }
      return;
    }
    // 1) insere a linha primeiro (opacity 0) e mede o destino real
    selected.push(id); const row = makeRow(s); sync();
    const art = $('.cf__art', cards[i]);
    if (REDUCE || !art.offsetWidth) { showRow(row); pulse(row); tick(); return; }
    const sheetShut = barMode && !ticket.classList.contains('is-open');
    if (!sheetShut) list.scrollTop = list.scrollHeight;
    const o = art.getBoundingClientRect(), t = (sheetShut ? $('#tkGrip') : $('.tk__ic', row)).getBoundingClientRect();
    const SZ = 56, x0 = o.left + (o.width - SZ) / 2, y0 = o.top + (o.height - SZ) / 2, sc = sheetShut ? 0.45 : t.width / SZ;
    const x1 = sheetShut ? t.left + 16 : t.left, y1 = sheetShut ? t.top + (t.height - SZ * sc) / 2 : t.top;
    // 2) clone em camada position:fixed no <body> (fora do pin-spacer)
    const fly = document.createElement('div'); fly.className = 'fly'; fly.innerHTML = '<img src="' + A + 'cards/' + s.card + '.webp" alt="">'; document.body.appendChild(fly);
    gsap.set(fly, { x: x0, y: y0, scale: 1 }); flying = true; lockBtns(true);
    const end = () => { fly.remove(); flying = false; lockBtns(false); showRow(row); pulse(row); tick(); };
    // 3) arco suave 0.65s
    if (window.MotionPathPlugin) gsap.to(fly, { duration: 0.65, ease: 'power2.inOut', scale: sc, motionPath: { path: [{ x: x0, y: y0 }, { x: (x0 + x1) / 2, y: Math.min(y0, y1) - 32 }, { x: x1, y: y1 }], curviness: 1.2 }, onComplete: end });
    else gsap.timeline({ onComplete: end }).to(fly, { x: x1, duration: 0.65, ease: 'power2.inOut' }, 0).to(fly, { y: y1, duration: 0.65, ease: 'power3.out' }, 0).to(fly, { scale: sc, duration: 0.65, ease: 'power2.inOut' }, 0);
  }
  list.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) toggle(b.closest('li').dataset.id); });
  $('#tkBarbers').innerHTML = BARBERS.map((b, i) => '<span><input type="radio" name="barber" id="b' + i + '" value="' + b + '"' + (i === 0 ? ' checked' : '') + '><label for="b' + i + '">' + b + '</label></span>').join('');
  $('#tkBarbers').addEventListener('change', (e) => { barber = e.target.value; sync(); });
  window.SH = {
    qaFill() { SERVICES.forEach((s) => { if (!selected.includes(s.id)) { selected.push(s.id); makeRow(s).style.opacity = 1; } }); sync(); },
    setBarber(first) { const r = $$('#tkBarbers input').find((x) => x.value === first); if (r) { r.checked = true; barber = first; sync(); } },
  };
  $('#tkBook').addEventListener('click', (e) => { if ($('#tkBook').getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; } if (BOOKING_URL.startsWith('#')) { e.preventDefault(); toast('Defina BOOKING_URL (AppBarber) em core.js'); } });
  $('#tkWa').addEventListener('click', (e) => { if ($('#tkWa').getAttribute('aria-disabled') === 'true') e.preventDefault(); });
  $('#tkGrip').addEventListener('click', () => { const o = ticket.classList.toggle('is-open'); $('#tkGrip').setAttribute('aria-expanded', o); });

  // comanda: coluna (≥1100×720) ou barra inferior de 64px com bottom sheet
  function live() { ticket.classList.toggle('is-away', !inView); document.body.classList.toggle('atd-live', barMode && inView); }
  function mount(bar) { barMode = bar; ticket.classList.toggle('ticket--bar', bar); if (bar) document.body.appendChild(ticket); else { ticket.classList.remove('is-open'); $('#tkGrip').setAttribute('aria-expanded', 'false'); grid.appendChild(ticket); } live(); }
  new IntersectionObserver((es) => { inView = es[0].isIntersecting; live(); }, { threshold: 0.04 }).observe($('#atendimento'));
  mm.add('(min-width:1100px) and (min-height:720px)', () => { mount(false); });
  mm.add('(max-width:1099px), (max-height:719px)', () => { mount(true); });

  // ----- modos: pin (≥900×720) × lista horizontal com scroll-snap -----
  mm.add(PIN, () => {
    snapMode = false; cf.classList.remove('cf--snap'); clearList();
    pinST = ScrollTrigger.create({ trigger: scene, start: 'top top', end: () => '+=' + (N * vh() * 0.7), pin: true, scrub: 0.6, invalidateOnRefresh: true,
      snap: { snapTo: 1 / (N - 1), duration: 0.25, ease: 'power2.inOut' },
      onUpdate: (s) => setActive(Math.round(s.progress * (N - 1))) });
    setActive(Math.round(pinST.progress * (N - 1)), true); layoutList(true);
    return () => { pinST && pinST.kill(); pinST = null; };
  });
  mm.add(NOPIN, () => {
    snapMode = true; cf.classList.add('cf--snap'); clearList();
    const on = () => { const max = view.scrollWidth - view.clientWidth, st = cards[1].offsetLeft - cards[0].offsetLeft; setActive(view.scrollLeft >= max - 2 ? N - 1 : Math.round(view.scrollLeft / st)); };
    view.addEventListener('scroll', on, { passive: true }); setActive(0, true); on();
    return () => { view.removeEventListener('scroll', on); snapMode = false; cf.classList.remove('cf--snap'); };
  });
  ScrollTrigger.addEventListener('refresh', () => { if (!snapMode) layoutList(true); });
  sync();
})();
