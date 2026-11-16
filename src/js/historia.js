
/* História — uma cena fixada (100svh): [ano + texto | spine | polaroid], 5 marcos + 6º passo com a citação. Índice = round(progress × 5), snap por marco.
   Sem pin: marcos empilhados (ano, texto, foto). */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  const M = [ // texto na voz do Renan — rascunho, confirmar. Anos intermediários são ilustrativos (contagem 2018 → 2024). TROCAR: foto = assets/historia/mN.webp (HAS.historia)
    { year: 2018, title: 'Começou depois das 18h', text: 'Eu cortava depois das 18h e nos fins de semana, num salão simples na casa dos meus pais.', ph: 'foto do Renan aqui', slot: 'historia/m1.webp', cap: '2018 · onde tudo começou' },
    { year: 2019, title: 'Os primeiros anos', text: 'Precisava de um lugar maior. Aluguei o salão atual sem ter o dinheiro do aluguel.', img: SLOTS.fachada, slot: 'historia/m2.webp', cap: 'Fachada real · Rua Nova Iorque, 1946' },
    { year: 2021, title: 'A primeira reforma', text: 'Os clientes chegaram, e o salão precisou crescer junto.', ph: 'foto do Renan aqui', slot: 'historia/m3.webp', cap: 'a primeira reforma' },
    { year: 2022, title: 'O primeiro funcionário', text: 'A cadeira deixou de ser só minha.', ph: 'foto do Renan aqui', slot: 'historia/m4.webp', cap: 'o primeiro colaborador' },
    { year: 2024, title: 'Reestruturação', text: 'Mudamos muita coisa de verdade — e melhoramos um pouco todos os dias.', img: SLOTS.trio, slot: 'historia/m5.webp', cap: 'Renan, Vitor e Edivaldo' },
  ];
  const n = M.length, STEPS = n + 1, sec = $('#historia'), scene = $('.hist__scene');
  const yearEl = $('#histYear'), copy = $('#histCopy'), nodes = $('#histNodes'), polImg = $('#polImg'), cap = $('#polCap'), pol = $('#pol'), fill = $('#histFill'), cols = $('.hist__cols'), q = $('#histQ');
  // ano: 4 colunas de dígitos (roll vertical)
  yearEl.innerHTML = [0, 1, 2, 3].map(() => '<span class="dg"><span class="dg__s">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => '<i>' + d + '</i>').join('') + '</span></span>').join('');
  const strips = $$('.dg__s', yearEl);
  copy.innerHTML = M.map((m, i) => '<div class="hist__m" data-i="' + i + '"><div class="hist__ln"><h3>' + m.title + '</h3></div><div class="hist__ln"><p>' + m.text + '</p></div></div>').join('');
  const ms = $$('.hist__m', copy), parts = ms.map((e) => $$('.hist__ln>*', e));
  nodes.innerHTML = M.map(() => '<li></li>').join(''); const nd = $$('li', nodes);
  const phHtml = (m) => m.img ? '<img src="' + m.img + '" alt="' + m.cap + '" draggable="false">' : '<div class="pol__ph"><span>' + m.ph + '<br>' + m.slot + ' · TROCAR</span></div>';
  polImg.innerHTML = M.map(phHtml).join(''); const ph = [...polImg.children];
  // sem pin
  $('#histFlow').innerHTML = '<header class="sec-head"><p class="sh-overline">Nossa história</p><h2>Uma cadeira, um bairro, uma promessa.</h2></header>' + M.map((m) => '<article class="hist__fm"><div class="ft"><p class="fy">' + m.year + '</p><h3 style="font-size:var(--text-h3);color:var(--accent)">' + m.title + '</h3><p>' + m.text + '</p></div><figure class="pol" style="--ph:300px"><div class="pol__img">' + phHtml(m) + '</div><figcaption>' + m.cap + '</figcaption></figure></article>').join('') + '<blockquote class="hist__fq"><p>“Comecei de onde pude, com o que tinha e com um sonho de ser um dos melhores.”</p><footer>— Renan Dutra, fundador</footer></blockquote>';

  let cur = -1;
  const setYear = (y, instant) => String(y).split('').forEach((d, k) => gsap.to(strips[k], { yPercent: -(+d) * 10, duration: instant || REDUCE ? 0 : 0.7, ease: 'power3.inOut', overwrite: 'auto' }));
  function show(i, instant) {
    if (i === cur) return; const prev = cur, dir = i > prev ? 1 : -1; cur = i; const quote = i >= n, k = Math.min(i, n - 1), d = instant || prev < 0 || REDUCE ? 0 : 1;
    nd.forEach((e, j) => { e.classList.toggle('is-lit', j <= k); e.classList.toggle('is-cur', j === k); });
    setYear(M[k].year, !d);
    gsap.to(fill, { scaleY: k / (n - 1), duration: d ? 0.7 : 0, ease: 'power2.inOut', overwrite: 'auto' });
    ms.forEach((e, j) => { // texto troca por máscara de linha
      if (j === k && (k !== Math.min(prev, n - 1) || prev < 0)) gsap.fromTo(parts[j], { yPercent: dir * 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d * 0.55, stagger: 0.07, ease: 'power3.out', delay: d * 0.2, overwrite: true });
      else if (j !== k && (j === Math.min(prev, n - 1) && prev >= 0)) gsap.to(parts[j], { yPercent: -dir * 110, opacity: 0, duration: d * 0.35, stagger: 0.05, ease: 'power2.in', overwrite: true });
      else if (j !== k) gsap.set(parts[j], { yPercent: 110, opacity: 0 });
    });
    ph.forEach((e, j) => { const to = j <= k ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)'; gsap.to(e, { clipPath: to, duration: d * 0.8, ease: 'power3.inOut', overwrite: 'auto' }); });
    cap.textContent = M[k].cap; gsap.fromTo(cap, { opacity: 0 }, { opacity: 1, duration: d * 0.5 + 0.001 });
    gsap.to(pol, { rotation: k % 2 ? 2 : -2, duration: d * 0.8, ease: 'power2.inOut', overwrite: 'auto' });
    // 6º passo: conteúdo some em fade, citação entra centralizada
    gsap.to(cols, { opacity: quote ? 0 : 1, duration: d * 0.4, overwrite: 'auto' });
    gsap.to(q, { autoAlpha: quote ? 1 : 0, y: quote ? 0 : 16, duration: d * 0.6, delay: quote ? d * 0.25 : 0, ease: 'power3.out', overwrite: 'auto' });
    cols.style.pointerEvents = quote ? 'none' : '';
  }
  let st = null;
  const goTo = (i) => { if (st) goToY(st.start + clamp(i, 0, STEPS - 1) / (STEPS - 1) * (st.end - st.start)); };
  nd.forEach((e, i) => { e.style.cursor = 'pointer'; });
  mm.add(PINM, () => {
    sec.classList.add('hist--pin'); cur = -1; gsap.set(parts.flat().slice(2), { yPercent: 110, opacity: 0 });
    st = ScrollTrigger.create({ trigger: scene, start: 'top top', end: () => '+=' + STEPS * vh() * 0.7, pin: true, invalidateOnRefresh: true,
      snap: { snapTo: 1 / (STEPS - 1), duration: 0.25, ease: 'power2.inOut' }, onUpdate: (s) => show(Math.round(s.progress * (STEPS - 1))) });
    show(Math.round(st.progress * (STEPS - 1)), true);
    return () => { sec.classList.remove('hist--pin'); st = null; };
  });
  mm.add(FLOWM, () => { sec.classList.remove('hist--pin'); });
})();
