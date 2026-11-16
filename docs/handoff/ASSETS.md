# ASSETS — Sujeito Homem · site v3

Protótipo: `ui_kits/site-v3/index.html`. Slots em `assets/`. Todo placeholder está marcado `// TROCAR` no código (`core.js`, `resultado.js`, `historia.js`, `depoimentos.js`) ou com a etiqueta visível "TROCAR" na tela.
Flags em `core.js → HAS = { reels, cortes, historia, seq }`: ficam `false` até os arquivos existirem (evita 404); trocar para `true` ao subir o material.

## Em uso (recebido na Rodada 3, copiado para `assets/`)
| Slot | Arquivo | Tam. nativo | Origem | Onde aparece | Status |
|---|---|---|---|---|---|
| Hero fundo desktop | `hero/plate-desktop.webp` | 1536×1024 | IA, sem pessoas | Hero (canvas V1, pôster) | **conceito visual** — trocar por foto real do salão |
| Hero fundo mobile | `hero/plate-mobile.webp` | 1024×1536 | IA, sem pessoas | Hero mobile | idem |
| Hero moldura em arco | `hero/capa-clara.png` | 394×581 | **foto real** (barbeiro atrás do cliente) | Hero, em ≤ 394 px de largura | baixa resolução: nunca ampliada |
| Palco (8 estados) | `stage/base,degrade,low-fade,tesoura,tradicional,barba,bigode,combo.webp` | 1024×1536 | IA, **modelo fictício** | Monte o atendimento · Cortes prontos (provisório) | selo "Imagem ilustrativa" sempre visível. Não há estado "infantil": o serviço mostra a base |
| Cartões de serviço | `cards/degrade,low-fade,tesoura,tradicional,barba,bigode,infantil,combo.webp` | 1024×1536 | IA, objetos | Carrossel | prontos (arte editorial, não os equipamentos reais) |
| Equipe | `equipe/renan,vitor,edivaldo.webp` | ~390×650 | **fotos reais** | Equipe (arco, ≤ resolução nativa) | **têm legenda embutida** (nome + serviços) — pedir fotos limpas |
| Trio | `equipe/trio.webp` | 574×700 | **foto real** | História (marco "Hoje"), pôster do baralho | ok |
| Fachada | `fachada/fachada-real.webp` | 312×562 | **foto real** | História (polaroid, marco 2) · Como chegar (miniatura + ampliar) | nunca em tela cheia |
| Espelho | `espelho/nitido.webp` | 1024×1536 | IA, espelho vazio | Cena do espelho (vidro oval embaçado) | **provisório**; elipse do vidro em `espelho.js → G` |
| CTA final | `cta/cadeira-desktop.webp` · `cadeira-mobile.webp` | 1536×1024 · 1024×1536 | IA, cadeira vazia | CTA final | **conceito visual** |

## Slots ainda vazios (placeholder em uso)
| Slot | Tam. alvo | Placeholder atual | Marca |
|---|---|---|---|
| `reels/01.mp4 … 06.mp4` (+ pôster) | 9:16, 720×1280, ≤ 4 MB, H.264 mudo | pôsteres das fotos reais atuais; legenda "barbeiro · tipo de corte" é rascunho | etiqueta "vídeo 0N.mp4 · TROCAR" no card |
| `cortes/ilustrativo-1…6.webp` | 4:5, ≥ 800×1000 | retratos `stage/*` (modelo fictício) rotulados "Imagem ilustrativa" | `CUTS` em `resultado.js` |
| `cortes/antes-1,2.webp` · `depois-1,2.webp` | 4:5, mesmo enquadramento | `stage/base` × `stage/degrade` e `stage/barba` | idem |
| `historia/m1…m5.webp` | 4:5, ≥ 640×800 | m2 = fachada real, m5 = trio real; m1/m3/m4 = quadro listrado "foto do Renan aqui" | `M` em `historia.js` |
| `seq/s1/manifest.json` + `f_001.webp…` (hero) | 1920×1080, 90–120 frames, ≤ 55 KB | pôster `plate-desktop.webp` (modo fallback do componente) | `HAS.seq` |
| Depoimentos reais | texto + autorização | 6 cartões **exemplo** (selo "exemplo", sem estrelas, sem números) | `FB` em `depoimentos.js` |
| Link das avaliações do Google | URL | busca genérica no Google Maps | `GOOGLE_REVIEWS_URL` |
| `BOOKING_URL` (AppBarber) · coordenadas `DEST` · chave ORS | — | `#agendar` · geocodifica o endereço (Photon) · rota ilustrativa "demo" | `core.js` |

## Regras que o protótipo segue
- Nenhuma imagem de banco, Pinterest ou hotlink. Único externo: tiles do OpenFreeMap/MapLibre (mapa) e iframes oficiais Google Maps / Waze (aparecem só ao traçar rota).
- Nenhum rosto inventado associado à equipe: os retratos fictícios são sempre "Imagem ilustrativa".
- Fotos reais de baixa resolução (`capa-clara`, `equipe/*`, `fachada`) aparecem em tamanho ≤ nativo, em moldura. Sem fundo de tela cheia, sem blur de rosto.
- Datas dos marcos intermediários da História (entre 2018 e 2024) **não existem**: a contagem do ano é só efeito visual — confirmar com o Renan.
- Respostas do FAQ marcadas "confirmar" onde não há dado real.
