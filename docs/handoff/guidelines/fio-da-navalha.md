# O fio da navalha — especificação

Uma linha de luz dourada (1,5px desktop / 1,25px mobile) que nasce no hero, corre pela **margem esquerda**, atravessa os 5 atos e termina como a **rota até o endereço**. Ela é desenhada pelo scroll: `stroke-dasharray = comprimento`, `stroke-dashoffset = comprimento × (1 − progresso)`.

## Anatomia
- **Trilho fantasma** — o caminho inteiro a 22% de opacidade (`--sh-gold-lo`): promete para onde vai e é o estado final em reduced-motion.
- **Fio** — gradiente vertical `gold-lo → gold → gold-hi` (mais claro conforme desce).
- **Halo** — mesmo traçado 4× mais grosso, blur 3px, 28% de opacidade.
- **Faísca** — círculo de 3,5px (`--sh-gold-hi`) na ponta, com `drop-shadow` dourado.
- **Cantos** — todo desvio é 90° com raio 16px (10px no mobile): lê como rua no último ato.

## Progresso
Linear com o scroll (`--ease-fio`). A ponta fica a **55% da altura da viewport**. Início = y do 1º `data-fio-stop` (+`data-fio-y`); fim = centro do pin `data-fio-end`. Sem suavização: o fio segue o dedo.

## Comportamento por ato
| Ato | Marcação | Fio |
|---|---|---|
| I · Hero | `data-fio-stop="rail" data-fio-y="150"` | Nasce ao lado da 1ª linha do título; com scroll 0 só a faísca está acesa. |
| II · História | `data-fio-stop="spine"` + `<span data-fio-spine>` | Desvia 90° para dentro, vira a **espinha da timeline**; cada `TimelineItem` (`data-fio-lit`) acende o nó quando a ponta o alcança; volta à margem. |
| III · Serviços | `rail` | Reto pela margem. Chips/itens com `data-fio-lit` podem acender. |
| IV · Equipe | `rail` | Reto; cartões podem usar `data-lit` para acender o filete de luz do topo. |
| V · Endereço | `data-fio-stop="route"` sobre o mapa + `MapPin` (`data-fio-end`) | Sai da margem e vira **rota** (degraus de 90°) até o núcleo do pin; ao chegar (p = 1) o pin já pulsa. |

## Mobile (< 768px de largura do contêiner)
- Trilho de **12px** (`--fio-rail` 28px de margem), traço 1,25px.
- **Sem desvio** de espinha: a timeline é deslocada (`margin-left` negativo) para alinhar os nós ao trilho — o fio *é* a espinha o tempo todo.
- Rota final com cantos de 10px, usando a largura toda do mapa.
- A **barra de CTA** (z 50) cobre o fio por baixo; o fio nunca recebe toque (`pointer-events:none`).
- Sem hover: acender (`data-lit`) é só por scroll.

## Acessibilidade e fallback
`aria-hidden`, decorativo. `prefers-reduced-motion`: fio inteiro desenhado, sem scrub, sem pulso. Sem JS: nada some — conteúdo e CTAs não dependem do fio; use `--border-hairline` como régua estática na margem.

## Regras
Um fio por página. Nunca em outra cor. Nunca sobre texto (a margem é dele; desvios só em áreas sem texto). Não animar nada além de `stroke-dashoffset`, `transform` e `opacity`.
