# Sujeito Homem — site

Site de uma página da barbearia Sujeito Homem (Jales-SP). Vite + HTML/CSS/JS vanilla, GSAP/ScrollTrigger, MapLibre (carregado sob demanda). Sem backend.

## Rodar
```
npm i
npm run dev        # desenvolvimento
npm run build      # gera dist/
npm run preview    # serve o build
npm run smoke      # smoke test (precisa de `npm run build` antes; usa Playwright)
```

## Estrutura
`index.html` · `src/js/` (config, core, uma cena por arquivo, `main.js`) · `src/css/` (tokens, componentes, site) · `public/` (assets e fontes otimizados) · `docs/` (processo, handoff do design, `_projeto/` decisões e pendências).

## Onde trocar dados
Tudo em `src/js/config.js`: `BOOKING_URL`, `WHATSAPP`, `DEST`, `ROUTING`, `INSTAGRAM`, horários, flags `HAS`. Chaves só via `.env` (`.env.example`). Pendências do cliente: `docs/_projeto/PENDENCIAS-CLIENTE.md`. Decisões: `docs/_projeto/DECISOES.md`.

## Deploy (Vercel, painel)
1. vercel.com → Add New → Project → importar o repo (privado).
2. Framework **Vite**, Build `npm run build`, Output `dist` (já em `vercel.json`).
3. Deploy. URL esperada: `https://sujeito-homem-website.vercel.app`.
