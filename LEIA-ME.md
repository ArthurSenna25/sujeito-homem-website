# Kit de Documentos v4 — como usar

## Estrutura
```
docs-kit/
├─ LEIA-ME.md                     (este arquivo)
├─ docs/                          ← COPIE esta pasta para a raiz de cada projeto novo
│  ├─ README.md                   índice + roteador "gatilho → arquivo"
│  ├─ 00-TRIAGEM-E-PROFUNDIDADE   obrigatório: classifica o projeto e limita a profundidade
│  ├─ 01 … 11                     fluxo, protocolo, requisitos, design, arquitetura, glossário,
│  │                              dados, segurança, qualidade, Claude Code/tokens, bibliografia
│  └─ templates/                  CLAUDE.md, briefing + prompt mestre, Claude Design, fase, etc.
└─ _ambiente-global/              NÃO vai nos projetos (setup da máquina)
```

## Em cada projeto novo (3 passos)
1. Copie `docs/` para a raiz e `docs/templates/CLAUDE.md.template` para a raiz como `CLAUDE.md` (preencha o topo).
2. Siga `docs/01-FLUXO-DE-TRABALHO.md` (atalho N0 no topo).
3. Cole o prompt de `docs/templates/00-BRIEFING-E-PROMPT-MESTRE.md` no Claude Code (plan mode).

## Por que economiza tokens
O `CLAUDE.md` importa **só** o `00-TRIAGEM` (curto). Todo o resto é lido sob demanda por gatilho (`docs/README.md`). `11-BIBLIOGRAFIA` e `01-FLUXO` são para você, não para o Claude.

## Manutenção
Depois de cada projeto: anote consumo real no `PROGRESS.md`, ajuste prazos no `01-FLUXO` e rode `extract-approach`. Revise versões de stack (`05`, `06`) a cada poucos meses.
