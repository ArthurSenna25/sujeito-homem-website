Barra de CTA fixa no rodapé do mobile (<768px): ação primária ouro à esquerda, WhatsApp e rota como botões 44×44. Respeita safe-area do iPhone e leva um filete de luz no topo (eco do fio).

```jsx
<MobileCtaBar visible={scrolledPastHero} bookHref="#agendar" whatsappHref="https://wa.me/..." routeHref="#endereco" />
```

Desktop: some (o CTA primário já está no cabeçalho). Reserve `padding-bottom: 72px` no fim da página.
