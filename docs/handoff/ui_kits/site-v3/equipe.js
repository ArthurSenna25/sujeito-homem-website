
/* Equipe — uma cena fixada (2 colunas), 3 passos por scroll: RENAN → VITOR → EDIVALDO. Timeline com scrub + snap em 0, .5, 1. Sem pin: 3 blocos empilhados. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  const TEAM = [
    { id: 'renan', name: 'Renan Dutra', first: 'Renan', role: 'Empreendedor · Barbeiro', tags: ['Corte infantil', 'Cortes tradicionais e modernos', 'Barba'] },
    { id: 'vitor', name: 'Vitor', first: 'Vitor', role: 'Barbeiro', tags: ['Cortes na tesoura', 'Low fade', 'Barba'] },
    { id: 'edivaldo', name: 'Edivaldo', first: 'Edivaldo', role: 'Barbeiro', tags: ['Corte degradê', 'Tradicional e moderno', 'Barba'] },
  ]; // TROCAR: fotos limpas (sem texto do story) — SLOTS.equipe em core.js aponta para versões retocadas
  const N = TEAM.length, sec = $('#equipe'), scene = $('.eq__scene'), pad = (v) => String(v).padStart(2, '0');
  const alt = (m) => m.name + ', barbeiro da Sujeito Homem';
  const tagsHtml = (m) => m.tags.map((t) => '<li>' + t + '</li>').join('');
  $('#eqStack').innerHTML = TEAM.map((m, i) => '<div class="eq__info" data-i="' + i + '"><div class="eq__ln"><p class="sh-overline">' + m.role + '</p></div><div class="eq__ln"><h3>' + m.name + '</h3></div><div class="eq__ln"><ul class="eq__tags">' + tagsHtml(m) + '</ul></div></div>').join('');
  $('#eqBookL').innerHTML = TEAM.map((m) => '<span>Agendar com ' + m.first + '</span>').join('');
  $('#eqFrame').innerHTML = TEAM.map((m) => '<img class="eq__ph" src="' + SLOTS.equipe[m.id] + '" alt="' + alt(m) + '" draggable="false">').join('');
  $('#eqTabs').innerHTML = TEAM.map((m, i) => '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + m.first + '</button>').join('');
  const infos = $$('.eq__info'), phs = $$('.eq__ph'), tabs = $$('#eqTabs button'), labels = $$('#eqBookL span');
  const parts = infos.map((el, k) => [...$$('.eq__ln>*', el), labels[k]]);
  // sem pin: três blocos empilhados
  $('#eqFlow').innerHTML = '<header class="sec-head"><p class="sh-overline">Equipe</p><h2>Quem vai cuidar de você.</h2></header>' + TEAM.map((m, i) => '<article class="eq__item"><figure><img src="' + SLOTS.equipe[m.id] + '" alt="' + alt(m) + '" loading="lazy"></figure><div class="eq__fi"><span class="eq__num" aria-hidden="true">' + pad(i + 1) + ' / ' + pad(N) + '</span><p class="sh-overline">' + m.role + '</p><h3>' + m.name + '</h3><ul class="eq__tags">' + tagsHtml(m) + '</ul><a class="sh-btn sh-btn--primary" data-book data-barber="' + m.first + '" href="#agendar"><i class="ic ic-calendar"></i>Agendar com ' + m.first + '</a></div></article>').join('');
  $$('#eqFlow [data-book]').forEach((a) => { a.addEventListener('click', (e) => { window.SH && SH.setBarber && SH.setBarber(a.dataset.barber); if (BOOKING_URL.startsWith('#')) { e.preventDefault(); toast('Defina BOOKING_URL (AppBarber) em core.js'); } }); if (!BOOKING_URL.startsWith('#')) { a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener'; } });

  let cur = 0, st = null;
  function setCur(i) {
    if (i === cur) return; cur = i;
    $('#eqNum').textContent = pad(i + 1) + ' / ' + pad(N);
    tabs.forEach((b, k) => b.setAttribute('aria-selected', k === i)); infos.forEach((e, k) => e.setAttribute('aria-hidden', k !== i));
  }
  const nudge = (y) => y + (y < scrollY ? 3 : -3); // alvo 3px além do ponto de snap, no sentido do movimento (snap direcional não empurra para o passo vizinho)
  const at = (i) => nudge(st.start + i / (N - 1) * (st.end - st.start));
  const goTo = (i) => { if (st) scrollTo({ top: at(clamp(i, 0, N - 1)), behavior: REDUCE ? 'auto' : 'smooth' }); };
  tabs.forEach((b) => b.addEventListener('click', () => goTo(+b.dataset.i)));
  $('#eqFrame').addEventListener('keydown', (e) => { const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!d) return; e.preventDefault(); goTo(cur + d); });
  $('#eqBook').addEventListener('click', () => window.SH && SH.setBarber && SH.setBarber(TEAM[cur].first));

  mm.add(PINM, () => {
    sec.classList.add('eq--pin'); cur = -1; setCur(0); $('#eqNum').textContent = '01 / 03';
    gsap.set('#eqSpot', { xPercent: -14 }); // holofote: -14% → 0 → +14% entre os três
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
    for (let k = 0; k < N - 1; k++) {
      const t = k + 0.1;
      tl.to(parts[k], { yPercent: -120, opacity: 0, duration: 0.4, stagger: 0.06, ease: 'power2.in' }, t)
        .fromTo(parts[k + 1], { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }, t + 0.3)
        .fromTo(phs[k + 1], { clipPath: 'ellipse(0% 100% at 100% 50%)', x: 24 }, { clipPath: 'ellipse(135% 100% at 100% 50%)', x: 0, duration: 0.8, ease: 'power3.inOut' }, t)
        .to('#eqSpot', { xPercent: k * 14 , duration: 0.8, ease: 'sine.inOut' }, t);
    }
    tl.fromTo('#eqFill', { scaleY: 1 / N }, { scaleY: 1, duration: N - 1, ease: 'none' }, 0).set({}, {}, N - 1);
    st = ScrollTrigger.create({ trigger: scene, start: 'top top', end: () => '+=' + 3 * vh(), pin: true, animation: tl, scrub: 0.5, invalidateOnRefresh: true,
      snap: { snapTo: [0, 0.5, 1], duration: 0.25, ease: 'power2.inOut' }, onUpdate: (s) => setCur(Math.round(s.progress * (N - 1))) });
    return () => { sec.classList.remove('eq--pin'); st = null; };
  });
  mm.add(FLOWM, () => { sec.classList.remove('eq--pin'); });
})();
