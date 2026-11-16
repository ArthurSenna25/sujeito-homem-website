# Pendências do cliente (Sujeito Homem)

| Item | Onde | Hoje |
|---|---|---|
| Link de agendamento (AppBarber) | `src/js/config.js → BOOKING_URL` | vazio: "Agendar" abre WhatsApp |
| Coordenadas do endereço | `config.js → DEST` | nulas: geocodifica "Rua Nova Iorque 1946" na carga |
| Horários confirmados | `config.js → HR/HOURS` | lidos da fachada (Seg 13:40–19:40; Ter–Sex 08:40–20:20; Sáb 08:00–18:20; Dom fechado) — **a confirmar** |
| @ do Instagram | `config.js → INSTAGRAM` | `@shbarbearia` — **a confirmar** |
| Link das avaliações do Google | `config.js → GOOGLE_REVIEWS_URL` | busca genérica no Maps |
| Depoimentos reais (com autorização) | `src/js/depoimentos.js → FB` | 6 cartões rotulados "exemplo" |
| 6 vídeos (reels) 9:16 | `public/assets/reels/`, `HAS.reels=true` | pôsteres das fotos atuais, rótulo "TROCAR" |
| Fotos de cortes / antes-depois | `public/assets/cortes/`, `HAS.cortes` | retratos ilustrativos rotulados |
| Fotos da história (m1…m5) + datas dos marcos | `public/assets/historia/`, `HAS.historia` | quadro "foto do Renan aqui"; anos intermediários ilustrativos |
| Fotos limpas da equipe (sem legenda) | `public/assets/equipe/` | versões retocadas `-limpa` |
| Foto real do salão (hero, CTA, espelho) | `public/assets/{hero,cta,espelho}` | imagens de IA, rotuladas conceito/ilustrativas |
| Logo vetorial | `public/assets/logo/` | PNG 152×140 (baixa resolução) |
| Chave de rota (ORS), restrita por domínio | `.env` → `VITE_ORS_KEY` | vazio: rota ilustrativa "demo" |
