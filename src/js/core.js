/* Sujeito Homem — site v3 · núcleo: config, utilitários, selo, hero, manifesto, fio, barra de CTA.
   Scroll nativo + GSAP ScrollTrigger. Pin só em (min-width:900px) e (min-height:720px). Ver /MOTION.md */


import { BOOKING_URL as BOOKING_CFG, WHATSAPP, GOOGLE_REVIEWS_URL, ADDRESS_Q, DEST, ROUTING, A, HAS, SLOTS, HR, HOURS } from "./config.js";

// ===== util =====
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PIN = '(min-width:900px) and (min-height:720px)', NOPIN = '(max-width:899px), (max-height:719px)';
const PINM = PIN + ' and (prefers-reduced-motion: no-preference)', FLOWM = NOPIN + ', (prefers-reduced-motion: reduce)'; // cenas fixadas: só em ≥900×720 e sem reduced-motion
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 2600); }
const waUrl = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const vh = () => innerHeight;
// Rolagem de navegação (abas, pontos, setas): UMA rolagem até o ponto EXATO do passo (sem offset), com flag anti-reentrada.
// Antes: scrollTo(y±3px) + snap do ScrollTrigger puxando de volta = loop snap↔scrollTo. Flag solta em scrollend (ou 1,2 s).
let navBusy = false;
function goToY(y, behavior) {
  y = Math.round(y); if (navBusy || Math.abs(y - scrollY) < 1) return;
  navBusy = true; let t; const free = () => { navBusy = false; clearTimeout(t); removeEventListener("scrollend", free); };
  addEventListener("scrollend", free, { once: true }); t = setTimeout(free, 1200);
  scrollTo({ top: y, behavior: behavior || (REDUCE ? "auto" : "smooth") });
}
const BOOKING_URL = BOOKING_CFG || waUrl("Olá! Quero agendar um horário na Sujeito Homem."); // vazio → WhatsApp
function spNow() {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const g = (t) => p.find((x) => x.type === t).value;
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: +g('hour') * 60 + +g('minute') };
}
const DN = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
function openStatus() {
  const { day, min } = spNow(), t = HR[day];
  if (t && min >= t[0] && min < t[1]) return { open: true, detail: `até ${fmt(t[1])}` };
  if (t && min < t[0]) return { open: false, detail: `abre hoje ${fmt(t[0])}` };
  for (let i = 1; i <= 7; i++) { const d = (day + i) % 7; if (HR[d]) return { open: false, detail: `abre ${i === 1 ? 'amanhã' : DN[d]} ${fmt(HR[d][0])}` }; }
  return { open: false, detail: '' };
}
function statusLine() {
  const { day, min } = spNow(), t = HR[day];
  if (t && min >= t[0] && min < t[1]) return { open: true, text: `Hoje atendemos até ${fmt(t[1])}` };
  if (t && min < t[0]) return { open: false, text: `Hoje abrimos às ${fmt(t[0])}` };
  for (let i = 1; i <= 7; i++) { const d = (day + i) % 7; if (HR[d]) return { open: false, text: i === 1 ? `Abrimos amanhã às ${fmt(HR[d][0])}` : `Abrimos ${DN[d]} às ${fmt(HR[d][0])}` }; }
  return { open: false, text: '' };
}

// módulos de cena leem estes nomes como globais (portado do protótipo sem reescrever a lógica)
Object.assign(globalThis, { BOOKING_URL, WHATSAPP, GOOGLE_REVIEWS_URL, ADDRESS_Q, DEST, ROUTING, A, HAS, SLOTS, $, $$, REDUCE, PIN, NOPIN, PINM, FLOWM, clamp, lerp, fmt, toast, waUrl, vh, goToY, spNow, openStatus, statusLine });

// ===== links, selo, horários, barra de CTA =====
$$('[data-book]').forEach((a) => { a.addEventListener('click', (e) => { if (BOOKING_URL.startsWith('#')) { e.preventDefault(); toast('Defina BOOKING_URL (AppBarber) em core.js'); } }); if (!BOOKING_URL.startsWith('#')) { a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener'; } });
$$('[data-wa]').forEach((a) => { a.href = waUrl('Olá! Quero agendar um horário na Sujeito Homem.'); a.target = '_blank'; a.rel = 'noopener'; });
$('#gReviews').href = GOOGLE_REVIEWS_URL;
$$('[data-seal]').forEach((s) => { const o = openStatus(); s.className = 'sh-seal' + (o.open ? '' : ' sh-seal--closed'); s.setAttribute('role', 'status'); s.innerHTML = `<span class="sh-seal__dot" aria-hidden="true"></span><span>${o.open ? 'Aberto agora' : 'Fechado agora'}</span>${o.detail ? `<span class="sh-seal__detail">· ${o.detail}</span>` : ''}`; });
(function hours() { const { day } = spNow(); $('#hours').innerHTML = HOURS.map(([n, d, t]) => { const today = [].concat(d).includes(day); return `<dt class="${today ? 'today' : ''}">${n}</dt><dd class="${today ? 'today' : ''}">${t ? `${fmt(t[0])} – ${fmt(t[1])}` : 'Fechado'}</dd>`; }).join(''); })();
(function ctaBar() { const bar = $('#ctaBar'), hero = $('#inicio'); const on = () => bar.classList.toggle('is-hidden', scrollY < hero.offsetHeight * 0.6); on(); addEventListener('scroll', on, { passive: true }); })();

let mm = null;
Object.defineProperty(globalThis, "mm", { get: () => mm, configurable: true });
if (!window.gsap || !window.ScrollTrigger) { console.warn('GSAP indisponível — site estático'); document.documentElement.classList.add('is-ready'); } else {
  gsap.registerPlugin(ScrollTrigger);
  mm = gsap.matchMedia();
  window.__fio = FioDaNavalha($('#site'));

  // ===== 1 · HERO — fundo = sequência de frames (pôster + fallback); foto = "janela de cena" revelada por clip-path =====
  frameSequence({ canvas: $('.hero__seq'), manifestUrl: HAS.seq ? SLOTS.heroFrames : '', mobileManifestUrl: HAS.seq ? SLOTS.heroFramesMobile : '', trigger: '#inicio', start: 'top top', end: 'bottom top', poster: SLOTS.heroPlate, posterMobile: SLOTS.heroPlateMobile, effect: 'push' });
  (function () {
    const hero = $('#inicio'), photo = $('#heroPhoto'), copy = $('#heroCopy'), drift = $('#heroDrift'), sweep = $('#heroSweep');
    const lines = $$('.hero__h1 .ln>span', hero), rest = $$('.hero__copy>:not(.hero__h1)', hero), root = document.documentElement;
    // Entrada começa já (DOMContentLoaded): espera no máx. 800 ms por fonts.ready, nunca por imagens/load. Failsafe 1,5 s → tudo visível.
    // Bug anterior: o mm.add só rodava se "desktop" ou "reduce" casassem — no mobile nada casava, a entrada nunca rodava e o estado oculto ficava.
    const ready = () => { root.classList.add('is-ready'); root.classList.remove('js-hero'); };
    mm.add({ all: '(min-width:0px)', desktop: '(min-width:900px)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { desktop, reduce } = ctx.conditions;
      if (reduce || !root.classList.contains('js-hero')) { ready(); return; } // reduced-motion / saveData / 2g-3g: sem animação, conteúdo já visível
      let dead = false, tl = null;
      const fs = setTimeout(() => { if (tl) tl.progress(1); ready(); }, 1500);
      const fonts = document.fonts ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 800))]) : Promise.resolve();
      fonts.then(() => {
        if (dead) return;
        // entrada: foto por clip-path (desktop: direita→esquerda; mobile: de cima p/ baixo), linhas do título sobem de dentro da máscara
        gsap.set(lines, { yPercent: 105, opacity: 1 });
        tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => { clearTimeout(fs); ready(); } });
        if (desktop) {
          tl.fromTo(photo, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.1 }, 0.1)
            .to(lines, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 0.2)
            .fromTo(rest, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out' }, 0.6)
            .fromTo(sweep, { yPercent: -110 }, { yPercent: 520, duration: 0.9, ease: 'power1.inOut' }, 1.15)
            .fromTo(sweep, { opacity: 0 }, { opacity: 0.8, duration: 0.45, ease: 'none', yoyo: true, repeat: 1 }, 1.15);
        } else {
          tl.fromTo(photo, { clipPath: 'inset(0 0 100% 0)', opacity: 0 }, { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.8 }, 0)
            .to(lines, { yPercent: 0, duration: 0.7, stagger: 0.08 }, 0.15)
            .fromTo(rest, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, 0.4);
        }
      });
      if (!desktop) return () => { dead = true; clearTimeout(fs); };
      // deriva lenta do cenário
      gsap.fromTo(drift, { x: -12, y: -8 }, { x: 12, y: 8, duration: 30, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      if (desktop) {
        // foto sobe a 0.85× (desce 0.15× do scroll, máx. 40px); texto sai com opacity
        gsap.to(photo, { y: 40, ease: 'none', scrollTrigger: { trigger: hero, start: 0, end: 267, scrub: true } });
        gsap.to(copy, { opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: hero, start: 'top top', end: '70% top', scrub: true } });
        // luz de fundo reage ao mouse
        const items = $$('[data-depth]', hero).map((e) => ({ qx: gsap.quickTo(e, 'x', { duration: 1, ease: 'power3.out' }), qy: gsap.quickTo(e, 'y', { duration: 1, ease: 'power3.out' }), d: +e.dataset.depth }));
        const move = (nx, ny) => items.forEach((i) => { i.qx(-nx * 20 * i.d); i.qy(-ny * 12 * i.d); });
        const mv = (e) => { if (e.pointerType !== 'mouse') return; const r = hero.getBoundingClientRect(); move((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5); }, lv = () => move(0, 0);
        hero.addEventListener('pointermove', mv); hero.addEventListener('pointerleave', lv);
        return () => { dead = true; clearTimeout(fs); hero.removeEventListener('pointermove', mv); hero.removeEventListener('pointerleave', lv); };
      }
    });
  })();

  // ===== 2 · MANIFESTO =====
  (function () {
    const t = $('#manifestoT'); const words = t.textContent.trim().split(/\s+/); t.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
    if (REDUCE) return;
    gsap.fromTo($$('.w', t), { opacity: 0.2 }, { opacity: 1, ease: 'none', stagger: 0.06, scrollTrigger: { trigger: t, start: 'top 82%', end: 'bottom 48%', scrub: true } });
  })();
  ScrollTrigger.config({ ignoreMobileResize: true });
}
