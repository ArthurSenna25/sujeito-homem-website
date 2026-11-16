
/* O resultado fala por si — A: baralho de vídeos guiado pelo scroll (cena fixada) · B: carrossel de cortes (inércia, lightbox, antes/depois) */
(function () {
  if (!window.gsap) return;
  // ===== A · BARALHO — fonte única de verdade: índice ativo (derivado do scroll no pin) =====
  const REELS = [ // TROCAR: src = assets/reels/0X.mp4 (HAS.reels) · poster = frame do vídeo · legenda = barbeiro real + tipo de corte
    { who: 'Renan', what: 'Corte tradicional', poster: SLOTS.equipe.renan, src: A + 'reels/01.mp4' },
    { who: 'Vitor', what: 'Low fade', poster: SLOTS.equipe.vitor, src: A + 'reels/02.mp4' },
    { who: 'Edivaldo', what: 'Degradê', poster: SLOTS.equipe.edivaldo, src: A + 'reels/03.mp4' },
    { who: 'Equipe', what: 'Corte e barba', poster: A + 'hero/capa-clara.png', src: A + 'reels/04.mp4' },
    { who: 'Equipe', what: 'Acabamento', poster: A + 'hero/capa-escura.png', src: A + 'reels/05.mp4' },
    { who: 'Trio', what: 'A equipe', poster: A + 'equipe/trio.webp', src: A + 'reels/06.mp4' },
  ];
  const deck = $('#deck'), sec = $('#resultado'), N = REELS.length, pad = (v) => String(v).padStart(2, '0');
  deck.innerHTML = REELS.map((r, i) => '<figure class="vcard" data-i="' + i + '" aria-hidden="' + (i ? 'true' : 'false') + '">' + (HAS.reels ? '<video muted playsinline loop preload="none" poster="' + r.poster + '" data-src="' + r.src + '"></video>' : '<img src="' + r.poster + '" alt="" draggable="false" loading="' + (i < 4 ? 'eager' : 'lazy') + '">') + (HAS.reels ? '' : '<span class="vcard__slot">vídeo ' + pad(i + 1) + '.mp4 · TROCAR</span>') + '<figcaption class="vcard__who"><b>' + r.what + '</b>' + r.who + '</figcaption></figure>').join('');
  const cardsEl = $$('.vcard', deck);
  let active = -1, pinST = null, busy = 0;
  const POS = [{ x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 }, { x: 20, y: -14, scale: 0.95, rotation: 3, opacity: 1 }, { x: 38, y: -26, scale: 0.9, rotation: 6, opacity: 1 }, { x: 54, y: -36, scale: 0.85, rotation: 9, opacity: 1 }];
  const depth = (i, a) => (i - a + N) % N, posFor = (d) => (d < 4 ? POS[d] : Object.assign({}, POS[3], { opacity: 0 }));
  function meta() {
    const r = REELS[active];
    $('#deckCap').innerHTML = '<b>' + r.what + '</b><span>' + r.who + ' · tipo de corte</span>'; $('#deckCount').textContent = pad(active + 1) + '/' + pad(N);
    cardsEl.forEach((c, i) => { c.setAttribute('aria-hidden', i !== active); const v = $('video', c); if (!v) return; if (i === active) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause(); });
  }
  // o card do topo desce e gira −4° enquanto o próximo sobe
  function layout(prev) {
    cardsEl.forEach((c, i) => {
      const d = depth(i, active), to = posFor(d);
      if (prev < 0 || REDUCE) { c.style.zIndex = N - d; gsap.set(c, to); return; }
      if (depth(i, prev) === 0 && d !== 0 && active > prev) {
        c.style.zIndex = N + 1;
        gsap.timeline().to(c, { y: 34, x: -10, rotation: -4, duration: 0.28, ease: 'power2.out', overwrite: 'auto' }).add(() => { c.style.zIndex = N - d; }).to(c, Object.assign({ duration: 0.34, ease: 'power2.inOut' }, to));
      } else { c.style.zIndex = N - d; gsap.to(c, Object.assign({ duration: 0.6, ease: 'power3.inOut', overwrite: 'auto', delay: d === 0 ? 0.12 : 0 }, to)); }
    });
  }
  function setActive(i) { i = clamp(i, 0, N - 1); if (i === active) return; const prev = active; active = i; layout(prev); meta(); }
  const goTo = (i) => {
    if (pinST) goToY(pinST.start + clamp(i, 0, N - 1) * (pinST.end - pinST.start) / (N - 1));
    else setActive(((i % N) + N) % N);
  };
  const next = () => goTo(active + 1), prev = () => goTo(active - 1);
  setActive(0);
  $('#deckNext').onclick = next; $('#deckPrev').onclick = prev;
  deck.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); next(); } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); } });
  // clique / arrasto / swipe: só pedem o próximo índice (o estado vem do scroll)
  let drag = null;
  deck.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, dx: 0 }; deck.setPointerCapture(e.pointerId); gsap.killTweensOf(cardsEl[active]); });
  deck.addEventListener('pointermove', (e) => { if (!drag) return; drag.dx = e.clientX - drag.x; if (Math.abs(drag.dx) > 6) gsap.set(cardsEl[active], { x: drag.dx, rotation: drag.dx * 0.06, y: -Math.abs(drag.dx) * 0.04 }); });
  const end = () => { if (!drag) return; const d = drag; drag = null; gsap.to(cardsEl[active], Object.assign({ duration: 0.4, ease: 'back.out(2)' }, POS[0])); if (Math.abs(d.dx) > 80) (d.dx < 0 ? next : prev)(); else if (Math.abs(d.dx) <= 6) next(); };
  deck.addEventListener('pointerup', end); deck.addEventListener('pointercancel', () => { if (drag) { drag = null; gsap.to(cardsEl[active], Object.assign({ duration: 0.3 }, POS[0])); } });
  mm.add(PINM, () => {
    sec.classList.add('res--pin');
    pinST = ScrollTrigger.create({ trigger: '.res__scene', start: 'top top', end: () => '+=' + N * vh() * 0.7, pin: true, invalidateOnRefresh: true,
      snap: { snapTo: 1 / (N - 1), duration: 0.25, ease: 'power2.inOut' }, onUpdate: (s) => setActive(Math.round(s.progress * (N - 1))) });
    setActive(Math.round(pinST.progress * (N - 1)));
    return () => { sec.classList.remove('res--pin'); pinST = null; };
  });
  mm.add(FLOWM, () => { sec.classList.remove('res--pin'); });

  // ===== B · CARROSSEL DE CORTES =====
  const IL = 'Imagem ilustrativa';
  const CUTS = [ // TROCAR: slot = assets/cortes/ilustrativo-N.webp (HAS.cortes) · antes/depois = antes-N / depois-N · fotos reais autorizadas
    { h: 380, what: 'Degradê', who: IL, src: 'stage/degrade', slot: 'cortes/ilustrativo-1' },
    { ba: true, h: 430, what: 'Antes e depois · degradê', who: IL, before: 'stage/base', after: 'stage/degrade', slot: 'cortes/antes-1 · depois-1' },
    { h: 320, what: 'Low fade', who: IL, src: 'stage/low-fade', slot: 'cortes/ilustrativo-2' },
    { h: 450, what: 'Tradicional', who: IL, src: 'stage/tradicional', slot: 'cortes/ilustrativo-3' },
    { h: 350, what: 'Bigode', who: IL, src: 'stage/bigode', slot: 'cortes/ilustrativo-4' },
    { ba: true, h: 400, what: 'Antes e depois · barba', who: IL, before: 'stage/base', after: 'stage/barba', slot: 'cortes/antes-2 · depois-2' },
    { h: 420, what: 'Barba', who: IL, src: 'stage/barba', slot: 'cortes/ilustrativo-5' },
    { h: 340, what: 'Corte e barba', who: IL, src: 'stage/combo', slot: 'cortes/ilustrativo-6' },
  ];
  const gal = $('#gal'), tr = $('#galTrack');
  tr.innerHTML = CUTS.map((c, i) => `<li class="cut" data-i="${i}"><div class="cut__img" style="--h:${c.h}px">${c.ba ? `<img class="ba__a" src="${A + c.before}.webp" alt="" draggable="false"><img class="ba__b" src="${A + c.after}.webp" alt="${c.what}" draggable="false"><span class="ba__h"></span><span class="tag-ill ba__lbl">antes ⟷ depois</span><input class="ba__r" type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois — ${c.what}">` : `<img src="${A + c.src}.webp" alt="${c.what} — ${c.who}" draggable="false" loading="lazy">`}<button type="button" class="cut__zoom" aria-label="Ampliar: ${c.what}">⤢</button></div><div class="cut__cap"><b>${c.what}</b>${c.who}</div></li>`).join('');
  $$('.ba__r', tr).forEach((r) => { const li = r.closest('.cut__img'); r.addEventListener('input', () => li.style.setProperty('--ba', r.value + '%')); r.addEventListener('pointerdown', (e) => e.stopPropagation()); });
  let x = 0, v = 0, dragging = false, moved = 0, lastX = 0, raf = 0;
  const lim = () => Math.min(0, gal.clientWidth - tr.scrollWidth);
  const paint = () => { tr.style.transform = `translate3d(${x}px,0,0)`; };
  function glide() { if (dragging) return; x += v; v *= 0.94; const L = lim(); if (x > 0) { x *= 0.8; v = 0; } if (x < L) { x = L + (x - L) * 0.8; v = 0; } paint(); if (Math.abs(v) > 0.2 || x > 0.5 || x < L - 0.5) raf = requestAnimationFrame(glide); }
  gal.addEventListener('pointerdown', (e) => { if (e.target.closest('.ba__r,.cut__zoom')) return; dragging = true; moved = 0; lastX = e.clientX; v = 0; cancelAnimationFrame(raf); gal.setPointerCapture(e.pointerId); });
  gal.addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); x += dx; v = dx; const L = lim(); if (x > 0 || x < L) x -= dx * 0.6; paint(); });
  const up = () => { if (!dragging) return; dragging = false; if (REDUCE) { x = clamp(x, lim(), 0); paint(); } else raf = requestAnimationFrame(glide); };
  gal.addEventListener('pointerup', up); gal.addEventListener('pointercancel', up);
  gal.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); x = clamp(x - e.deltaX, lim(), 0); paint(); } }, { passive: false });
  gal.addEventListener('keydown', (e) => { const k = e.key === 'ArrowRight' ? -1 : e.key === 'ArrowLeft' ? 1 : 0; if (!k) return; e.preventDefault(); v = k * 26; cancelAnimationFrame(raf); raf = requestAnimationFrame(glide); });
  gal.addEventListener('click', (e) => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
  addEventListener('resize', () => { x = clamp(x, lim(), 0); paint(); });
  // lightbox com navegação
  const dlg = $('#dlg'); let li = 0;
  function openLb(i) { li = (i + CUTS.length) % CUTS.length; const c = CUTS[li]; $('#dlgBody').innerHTML = `<img src="${A + (c.ba ? c.after : c.src)}.webp" alt="${c.what}"><p class="dlg__cap"><b style="color:var(--text-1)">${c.what}</b> · ${c.who}</p>`; $('#dlgCount').textContent = `${li + 1} / ${CUTS.length}`; if (!dlg.open) dlg.showModal(); }
  tr.addEventListener('click', (e) => { const z = e.target.closest('.cut__zoom'); if (z) openLb(+z.closest('.cut').dataset.i); });
  $('#dlgPrev').onclick = () => openLb(li - 1); $('#dlgNext').onclick = () => openLb(li + 1); $('#dlgX').onclick = () => dlg.close();
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') openLb(li + 1); else if (e.key === 'ArrowLeft') openLb(li - 1); });
})();
