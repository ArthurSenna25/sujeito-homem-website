# Decisões do projeto

- **Stack**: Vite + HTML/CSS/JS vanilla, GSAP e MapLibre por npm, deploy estático (Vercel). Desvio consciente do `docs/05` (Next): o design já é vanilla/GSAP; portar = risco sem ganho. Nível N1 lean.
- **Portagem sem reescrita**: as cenas do protótipo continuam como estavam. `core.js` publica utilitários em `globalThis` (`$`, `REDUCE`, `HAS`…) e `globals.js` publica gsap/ScrollTrigger, para os módulos de cena lerem como antes. Ordem de import em `main.js` = ordem dos `<script>` do protótipo. Refatorar para imports explícitos fica para depois.
- **Classes**: BEM do protótipo mantido; `sh-` só em código novo (decisão do dono).
- **Config**: `src/js/config.js` (BOOKING_URL vazio → WhatsApp; chave ORS só por `VITE_ORS_KEY`, ver `.env.example`).
- **Bug snap↔scrollTo**: removido o `scrollTo(y±3px)` (atendimento, equipe, resultado, história). `goToY()` em `core.js` rola ao ponto exato, uma vez, com flag anti-reentrada solta em `scrollend`/1,2 s. Snap do ScrollTrigger mantido no padrão.
- **MapLibre**: `import()` dinâmico (chunk separado, ~210 KB gzip), carregado só quando `mapa.js` o pede (perto da seção).
- **Fora do git** (`.gitignore`): `docs/handoff/{uploads,screenshots,assets}`, `docs/_ambiente-global`, `docs/_projeto/qa`. Só as versões em `public/` vão no repo.
- **Git**: sem `gh`/PR; commits direto na `main`; push só após o dono confirmar repo privado.
- **Vercel**: deploy pelo painel (dono). Hobby é uso não-comercial: site de cliente que gera receita precisa de plano pago ou host estático equivalente. Sem CSP na v1 (risco com MapLibre/tiles).
- **Não feito (escopo)**: JSON-LD, sitemap, OG 1200×630 dedicado, otimização extra de imagens, Lighthouse, suíte Playwright completa.
