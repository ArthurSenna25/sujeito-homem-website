# QA — autoteste do site v3

Ferramenta: `ui_kits/site-v3/qa.html` (abre sozinho; `?only=1366` testa um viewport). Carrega o site em iframes com o tamanho real da viewport, no zoom 100%, e percorre cada cena.

## O que é medido
1. **Sobreposição** entre elementos irmãos importantes (`[data-qa-group]`: grid do hero, atendimento, equipe, baralho, história, depoimentos, FAQ, mapa, espelho, CTA) e entre cartões visíveis do carrossel — `getBoundingClientRect`, tolerância 6 px².
2. **Texto cortado** — `scrollWidth > clientWidth`, `scrollHeight > clientHeight`, texto fora de um ancestral `overflow:hidden/clip` e texto fora da viewport (também na vertical dentro de cenas pinned).
3. **Overflow horizontal** do documento.
4. **Pin maior que a viewport** — altura de cada elemento pinned (ScrollTrigger) vs. `innerHeight`.
5. Carrossel do atendimento: máx. 3 cartões visíveis.

Cenas pinned medidas em 4 pontos do progresso (3%, 34%, 68%, 97%). Pior casos forçados: **comanda com 8 itens** (p=68%) e **painel de navegação aberto** com rota (mapa, p=68%). Mobile: cada cena rolada até a tela (sem pin), painel do mapa aberto.
Faixas roláveis por desenho (`#gal`, `#cfView` no mobile, faixas de depoimentos) só validam o eixo vertical.

## Resultado final (rodada "últimos retoques": hero com janela de cena + atendimento reconstruído)
| Viewport | Pins (altura vs. viewport) | Sobreposição | Texto cortado | Overflow horizontal | Pin > viewport |
|---|---|---|---|---|---|
| 1366×768 | atendimento 768 · equipe 768 · história 768 · mapa 768 · espelho 768 ✓ | 0 | 0 | não | não |
| 1440×900 | 900 · 900 · 900 · 860 · 900 ✓ | 0 | 0 | não | não |
| 1920×1080 | 1080 · 1080 · 1080 · 860 · 1080 ✓ | 0 | 0 (1 falso positivo do título do CTA medido no meio da transição; reexecutado isolado = 0) | não | não |
| 390×844 | sem pin (por regra) | 0 | 0 | não | — |

**0 problemas nos 4 viewports.** Estado medido no atendimento: comanda com 8 itens (lista da comanda rola por desenho; o contêiner de rolagem não corta texto).

## Rodada 2 — equipe, resultado, história, feedbacks
Resultado: **0 problemas** em 1366×768, 1440×900, 1920×1080 e 390×844 (pins: atendimento, equipe, resultado, história, mapa, espelho — todos ≤ viewport). O tempo de espera por estado nos pins subiu de 0,9 s para 1,7 s (scrub .5 + snap .25 s): com 0,9 s o teste pegava a equipe no meio da transição (texto saindo da máscara).
- Equipe: pin +=300vh, timeline com scrub e snap [0, .5, 1]; sem pin = 3 blocos empilhados (DOM próprio).
- Resultado: pin 6 × 70vh, índice ativo = round(progress × 5); clique/arrasto/setas só pedem o próximo índice (rolam o scroll no desktop).
- História: pin 6 × 70vh (5 marcos + citação), snap 1/5; sem pin = marcos empilhados.
- Pins de equipe/resultado/história só nascem com prefers-reduced-motion: no-preference; com reduced-motion caem no layout empilhado.
- Fotos da equipe: os arquivos `vitor.webp` e `edivaldo.webp` estavam trocados (cada um tinha a legenda do outro); `*-limpa.webp` corrigem a troca e apagam o texto do story.

## Mudanças da rodada 1
- Hero: grade `texto | foto` (foto = `<figure>` na coluna direita, 100% da altura, ~44vw, máscara em gradiente, sem arco/borda/glow). Mobile: faixa de 56svh no topo.
- Atendimento: pin 100svh com `end = 8 × 70vh`, `snap 1/7`, índice ativo = round(progress × 7); clique em card/ponto rola até start + i × (end−start)/7. Comanda vira barra de 64px + bottom sheet abaixo de 1100×720.
- Voo do thumbnail: clone `position:fixed` no `<body>`, destino medido na linha já inserida (opacity 0).
- Escala 8px (`--sp-1…8`), `.container` único (1280px), `--section-y: clamp(72px,10vh,128px)`, cabeçalhos de seção empilhados.
- O teste achou: lista da comanda com 8 itens cortada pelo contêiner (`overflow:hidden` no wrapper) → o único scroller é a própria lista.
- Ainda manual: olhar a olho o hero a 1920 (foto 394×581 ampliada ~2×; vinheta + grão + grade âmbar escondem, mas a foto real em alta resolve).

## Problemas achados pelo teste e corrigidos (rodadas anteriores)
- Legenda do palco passava do quadro (a linha do grid crescia com a altura intrínseca da foto) → `grid-template: minmax(0,1fr)` no palco.
- Mapa: a classe do MapLibre trocava `position:absolute` por `relative`, jogando o mapa para dentro do grid → seletor `#map.mapa__map`.
- Título do CTA quebrava a linha em 1920 (`max-width` contava o padding) → corrigido; linhas com folga para acentos na máscara.
- Equipe mobile: o nome gigante (`nowrap`) alargava a coluna e empurrava as etiquetas para fora da tela → `minmax(0,1fr)`.
- Baralho: cartões herdavam a margem padrão de `<figure>` (ficavam com 120 px de largura) → `margin:0`.
- Pin do mapa só nasce depois que o MapLibre carrega (a 1800 px de distância); o teste rola até lá antes de medir.
- História sem pin mostrava o ano de 2018 com o marco "Hoje" → ano passa a seguir o marco.

## Limites honestos
- O teste é geométrico: não julga estética. Revisar a olho em 1366×768 e 1440×900, principalmente a cena do espelho (elipse do vidro estimada sobre `nitido.webp`; ajustar `G` em `espelho.js` se a imagem for trocada).
- Mapa: tiles, rota real e iframes Google/Waze dependem de rede e do navegador (o Google/Waze podem bloquear embed — o botão "Abrir no app" cobre isso). O teste simula o painel aberto, não a navegação em si.
- Vídeos dos reels, frames do hero e fotos reais ainda não existem: o teste cobre os placeholders (ver `ASSETS.md`).
- Não testado: zoom ≠ 100%, Safari, telas < 360 px e viewports baixas (< 720 px de altura caem no layout sem pin).
