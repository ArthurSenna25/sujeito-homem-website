Selo de status em tempo real: "Aberto agora · até 20:20" ou "Fechado agora · abre amanhã 08:40", sempre no fuso de Jales.

```jsx
<OpenNowSeal />
<OpenNowSeal forceOpen={false} />
```

Ponto pulsa em 2,4s (transform/opacity); fechado = ponto cinza, sem pulso. role="status". Texto nunca depende só da cor.
