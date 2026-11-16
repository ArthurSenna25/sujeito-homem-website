# Sujeito Homem — Design System

Barbearia em **Jales, SP**, fundada em **2018** por **Renan Dutra**. Slogan: *“Além de cortar cabelo, melhoramos sua autoestima.”*
Marca: **precisão · calor humano · orgulho de bairro · ambição**. Não é barbearia hipster genérica nem luxo frio — é uma casa que cresceu do zero e trata o cliente como alguém que merece o melhor.

**Fontes recebidas:** logo (monograma SH em script + “barba · cabelo · bigode”, preto e branco), fotos reais (equipe, fachada, atendimento), 4 imagens conceituais escuras, `uploads/04-DESIGN-UI-UX.md` (processo, UX, UI, a11y WCAG 2.2 AA, motion nível 1–2, anti-“site de IA”). Sem Figma, sem repositório.
Produto único: **site/landing** (5 atos). Há um UI kit dele.

## Direção em uma frase
Uma barbearia quente e escura onde **o ouro é luz, não tinta** — uma lamparina sobre a bancada — e **um fio de navalha** liga cada ato do site até a porta.

## Paletas (decisão pendente: recomendo A)
| | A · **Lamparina** (padrão) | B · **Latão** (`data-palette="latao"`) |
|---|---|---|
| Ouro | `#E3A24B` âmbar | `#C8A457` ouro queimado |
| Base / sup.1 / sup.2 | `#13100D` / `#1C1814` / `#272119` | `#11110F` / `#1A1A17` / `#242420` |
| Texto | `#F3EBDD` (16:1) | `#F2EEE4` (16,3:1) |
| Ardósia (só sombra) | `#2E3A47` | `#2A3440` |
Justificativa: **A** é o ouro da luz que já está nas fotos (lâmpadas pendentes, moldura do espelho) → calor humano e coerência fotográfica; risco: pender a laranja (contido por saturação e uso ≤ 5%). **B** é mais sóbrio, metal escovado; risco: virar o luxo frio recusado. Todos os pares medidos ≥ 4,5:1 (texto) / 3:1 (UI) — ver card “Contraste AA medido”.

## CONTENT FUNDAMENTALS
- **Idioma/voz:** pt-BR, **“você”**, frases curtas, afirmativas. Fala como o barbeiro que conhece o cliente pelo nome: direto, caloroso, sem gíria forçada, sem superlativo vazio (“premium”, “experiência única”).
- **Caixa:** sentence case em títulos e botões (“Agendar horário”). Caixa-alta só em overlines pequenos com tracking.
- **Verbos de ação nos CTAs:** “Agendar horário”, “Como chegar”, “Agendar com Vitor”. Um CTA primário por tela, repetido.
- **Ambição sem arrogância:** “Venha. A cadeira é sua.” · “Monte o seu atendimento.” · “Quem vai cuidar de você.”
- **Prova antes de promessa:** “desde 2018 em Jales”, foto real da equipe, horário de hoje (“Aberto agora · até 20:20”).
- **Sem emoji. Sem numeração 01/02/03 decorativa.** Sem preços/durações inventados — sempre do cliente.
- **Textos de exemplo** (história, serviços) são rascunho: confirmar com Renan.

## VISUAL FOUNDATIONS
- **Cor:** base quase-preto quente (nunca `#000`), duas superfícies de grafite, texto off-white quente, **um** metal (ouro) ≤ 5% da área, ardósia só em sombras/contraste frio. Estados: ok `#8CC49A`, erro `#EE8B76`.
- **Tipografia:** display **Bricolage Grotesque** 800 (tracking −0,025em) · corpo **Figtree** 400/600 · script **Yellowtail** só em 1 palavra pontual (eco do monograma). Escala fluida 360→1280px (razão 1,2→1,25). Corpo ≥ 16px, medida 62ch. Máx. 3 pesos.
- **Espaçamento:** 8pt (`--space-1…16`), 4px só como meio-passo. Gutter fluido, seção `clamp(64,10vw,128)`.
- **Raios:** pequenos (2/4/8/16) = precisão; pílula só em chip e selo.
- **Bordas:** hairline decorativo `#4A4033` (1,9:1) — nunca delimita controle; controles usam `--border-control` `#8B7E6B` (≥ 3:1).
- **Sombras:** tingidas de ardósia `rgba(8,12,18,…)`, frias e por baixo; **brilho** dourado (`--glow-*`) quente, só em hover/seleção/fio. Filete de luz de 1px no topo de cartões em hover.
- **Fundos:** foto real com gradiente de proteção (`--photo-protect`) ou superfícies lisas. Sem padrão, sem textura, sem gradiente dourado como tinta; poça de luz (`--light-pool`) opcional.
- **Imagens:** quentes, âmbar dominante, sombras profundas, filtro `saturate(.92) contrast(1.04)`. **Fotos reais** da equipe/fachada primeiro; conceituais só atmosfera. Sem banco de imagem.
- **Cartões:** surface-1, raio 8, sombra-1 + borda interna de luz sutil; hover sobe 4px + sombra-3 + filete de luz.
- **Hover:** ouro → ouro claro + glow, `translateY(-1px)`. **Press:** afunda 1px, brilho −8%. **Foco:** anel `2px base + 2px ouro claro`. Disabled: surface-2 + texto-3.
- **Transparência/blur:** só em header sticky e barra de CTA mobile (`blur(14px)` sobre base .82–.88).
- **Motion:** só `transform`/`opacity` (exceção: `stroke-dashoffset` do fio). Easings `--ease-corte|assenta|afia|fio|brilho`; durações 100/160/240/400/800ms + pulso 2400ms. Reveal 800ms com 16px de deslocamento. `prefers-reduced-motion` zera tudo e desenha o fio inteiro. Um motor por seção (GSAP+ScrollTrigger no site real; aqui, rAF).
- **Layout fixo:** header sticky, barra de CTA mobile (<768), fio da navalha (z 4, pointer-events none).
- **Anti-referências (proibido):** cream + serifada + terracota · preto + neon · hairlines numeradas 01/02/03 · cursor customizado que esconde o nativo · foto de banco.

## ELEMENTO-ASSINATURA — o fio da navalha
Linha fina de luz dourada pela margem esquerda, **desenhada pelo scroll** (stroke-dashoffset), com faísca na ponta; acende o que cruza (`data-lit`); no último ato **vira a rota** até o pin do endereço. Regras por seção e mobile: `guidelines/fio-da-navalha.md` + card “O fio da navalha · comportamento”. Implementação: `components/signature/FioDaNavalha.jsx`.

## ICONOGRAPHY
Lucide (ISC), traço 1,75, `currentColor`, 18–22px, **copiado** para `assets/icons/` e embutido em `components/core/Icon.jsx` (15 ícones usados). Sem emoji, sem ícone preenchido, sem unicode como ícone. Lucide não tem marcas: WhatsApp usa `message-circle` + rótulo; Instagram só com texto até o cliente fornecer o glifo oficial. Ouro apenas em estado ativo.

## Assets (`assets/`)
`logo/logo-sh-circle.png` (152×140 — **baixa resolução**) · `img/team-renan|vitor|edivaldo|trio.png` · `img/facade.png` · `img/work-capa-escura|clara.png` · `img/concept-barba|cena|corte|interior` (IA, atmosfera) · `icons/*.svg`.
`team-vitor/edivaldo.png` são recortes de stories do Instagram com a legenda sobreposta apagada por retoque — **substituir por fotos limpas**.

## Índice
- `styles.css` → importa `tokens/` (`fonts, colors, typography, spacing, effects, motion, base`) e `components/components.css`
- `fonts/` Bricolage Grotesque, Figtree, Yellowtail (woff2 latin, Google Fonts OFL)
- `components/` — `core` (Icon, Button) · `booking` (ServiceChip) · `team` (BarberCard) · `status` (OpenNowSeal) · `story` (TimelineItem) · `map` (MapPin) · `mobile` (MobileCtaBar) · `signature` (FioDaNavalha); cada um com `.jsx`, `.d.ts`, `.prompt.md`, e um card por pasta
- `guidelines/` — cards de fundamentos + `fio-da-navalha.md`
- `ui_kits/site/` — `index.html` (landing, 5 atos), `mobile.html` (390px)
- `ui_kits/site-v3/` — **landing v3 (execução, rodada 3)**: `index.html`, `QA.md`, `ASSETS.md`, `MOTION.md` na raiz
- `ds-load.js` — carrega os `.jsx` em páginas estáticas sem build
- `SKILL.md` — uso como Agent Skill

## Intentional additions
`Icon` (envoltório do set Lucide) e `FioDaNavalha` (assinatura exigida). Nenhum outro primitivo foi adicionado além dos 8 pedidos.

## Pendências a confirmar com o cliente
Endereço completo e coordenadas · horários (lidos da fachada) · identificação de Renan na foto de retrato · serviços, valores e durações · @ do Instagram · vetor do logo · fotos limpas de Vitor e Edivaldo (e do 3º barbeiro da foto da equipe).
