/* Feedbacks (faixa dupla em sentidos opostos + depoimento em destaque) e FAQ (lista × painel; <details> no mobile) */
(function () {
  const FB = [ // TROCAR: depoimentos reais, com autorização. Enquanto isso, EXEMPLO (sem estrelas, sem números).
    ['Saí com o corte exatamente como pedi, e com a barba no ponto.', 'Cliente'],
    ['Atendimento de quem presta atenção em cada detalhe.', 'Cliente'],
    ['Ambiente bom, horário respeitado, resultado que dura.', 'Cliente'],
    ['Levei meu filho e ele saiu querendo voltar.', 'Cliente'],
    ['Cheguei sem saber o que queria. Saí com o corte certo.', 'Cliente'],
    ['A barba ficou no desenho que eu imaginava.', 'Cliente'],
  ];
  const big = $('#fbBig'), strips = $('#fbStrips');
  big.innerHTML = FB.map((f, i) => `<figure class="${i === 0 ? 'is-cur' : ''}" data-i="${i}"><span class="fb__tag">exemplo</span><blockquote>“${f[0]}”</blockquote><figcaption>${f[1]} · exemplo</figcaption></figure>`).join('');
  const card = (f, i, dup) => `<button type="button" class="fb__card" data-i="${i}" ${dup ? 'aria-hidden="true" tabindex="-1"' : ''}><span class="fb__tag">exemplo</span><blockquote>“${f[0]}”</blockquote><span class="who">${f[1]} · exemplo</span></button>`;
  const row = (arr, cls) => `<div class="fb__strip ${cls}">${arr.map((f, i) => card(f, FB.indexOf(f), false)).join('')}${arr.map((f) => card(f, FB.indexOf(f), true)).join('')}</div>`;
  const a = FB.slice(0, 3), b = FB.slice(3);
  strips.innerHTML = row(a.concat(a), '') + row(b.concat(b), 'fb__strip--r'); // cada faixa tem 6 cartões (3 + repetição) + cópia p/ loop contínuo
  const figs = $$('figure', big);
  function pick(i) { figs.forEach((f, k) => f.classList.toggle('is-cur', k === i)); $$('.fb__card', strips).forEach((c) => c.classList.toggle('is-cur', +c.dataset.i === i)); }
  strips.addEventListener('click', (e) => { const c = e.target.closest('.fb__card'); if (c) pick(+c.dataset.i); });
  pick(0);

  // ===== FAQ =====
  const WA = typeof waUrl === 'function';
  const Q = [
    { q: 'Como agendar?', a: 'Pelo botão “Agendar” (AppBarber) ou pelo WhatsApp (17) 99753-1959.' },
    { q: 'Posso chegar sem horário?', a: 'Dá para tentar: se houver cadeira livre, atendemos por ordem de chegada. Para não esperar, agende.', prov: true },
    { q: 'Como remarcar ou cancelar?', a: 'Avise pelo WhatsApp com antecedência para liberarmos o horário.', prov: true },
    { q: 'Vocês atendem crianças?', a: 'Sim. O corte infantil faz parte dos serviços, com paciência e capricho.' },
    { q: 'Onde fica e onde estacionar?', a: 'Rua Nova Iorque, 1946 · Jales, SP. Veja a rota em “Como chegar”. Sobre estacionamento: confirmar com a equipe.', prov: true },
    { q: 'Quais as formas de pagamento?', a: 'Formas de pagamento: confirmar com a equipe.', prov: true },
  ];
  const qBox = $('#faqQ'), h = $('#faqH'), p = $('#faqP'), acc = $('#faqAcc'); let cur = -1, typing = null;
  const tag = (x) => (x.prov ? '<span class="prov">confirmar</span>' : '');
  qBox.innerHTML = Q.map((x, i) => `<button type="button" role="tab" id="fq${i}" aria-selected="false" aria-controls="faqPanel" data-i="${i}">${x.q}</button>`).join('');
  acc.innerHTML = Q.map((x) => `<details><summary>${x.q}</summary><p>${x.a}${tag(x)}</p></details>`).join('') + '<div class="faq__foot" style="padding:var(--space-3) 0 0;display:flex;gap:var(--space-2);flex-wrap:wrap;align-items:center;color:var(--text-2)"><span>Não achou?</span><a class="sh-btn sh-btn--secondary" data-wa href="#"><i class="ic ic-message-circle"></i>Chama no WhatsApp</a></div>';
  $$('[data-wa]', acc).forEach((a2) => { a2.href = waUrl('Olá! Tenho uma dúvida.'); a2.target = '_blank'; a2.rel = 'noopener'; });
  const btns = $$('button', qBox);
  function type(el, html) {
    el.innerHTML = html; if (typing) typing.kill();
    if (REDUCE || !window.gsap) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    const ws = []; nodes.forEach((t) => { if (!t.parentNode.closest('.prov')) { const f = document.createDocumentFragment(); t.textContent.split(/(\s+)/).forEach((s) => { if (!s) return; if (/^\s+$/.test(s)) f.append(s); else { const w = document.createElement('span'); w.className = 'w'; w.textContent = s; w.style.opacity = 0; ws.push(w); f.append(w); } }); t.replaceWith(f); } });
    typing = gsap.to(ws, { opacity: 1, duration: 0.01, stagger: 0.022, ease: 'none' }); // digitação curta (~0,6 s)
  }
  function sel(i, first) {
    if (i === cur) return; cur = i; btns.forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
    h.textContent = Q[i].q; panelFade(); type(p, Q[i].a + tag(Q[i])); $('#faqPanel').setAttribute('aria-labelledby', 'fq' + i);
  }
  function panelFade() { if (REDUCE || !window.gsap) return; gsap.fromTo('#faqPanel', { opacity: 0.4, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }); }
  qBox.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) sel(+b.dataset.i); });
  qBox.addEventListener('keydown', (e) => { const d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0; if (!d) return; e.preventDefault(); const i = clamp(cur + d, 0, Q.length - 1); sel(i); btns[i].focus(); });
  sel(0);
})();
