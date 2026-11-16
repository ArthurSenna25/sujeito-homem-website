Chip de serviço selecionável (role checkbox) — o cliente monta o atendimento antes de agendar.

```jsx
const [on, setOn] = React.useState(false);
<ServiceChip label="Barba" selected={on} onToggle={setOn} />
<ServiceChip label="Corte + Barba" meta="combo" selected />
```

Selecionado = borda ouro + wash âmbar 12% + tique. Alvo 44px. Valores/durações são sempre do cliente — não invente.
