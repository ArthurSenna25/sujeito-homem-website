Elemento-assinatura: uma linha fina de luz dourada que corre pela margem esquerda, é desenhada pelo scroll (stroke-dashoffset), acende os nós por onde passa e termina como a rota até o pin do endereço.

```jsx
<div style={{position:'relative', paddingLeft:'var(--fio-rail)'}}>
  <FioDaNavalha />
  <section data-fio-stop="rail">…hero…</section>
  <section data-fio-stop="spine">… <ol><span data-fio-spine/>…</ol></section>
  <section data-fio-stop="rail">…serviços…</section>
  <section data-fio-stop="route">… <MapPin label="Sujeito Homem" /> …</section>   {/* o MapPin destino leva data-fio-end */}
</div>
```

- Qualquer elemento com `data-fio-lit` recebe `data-lit="true"` quando a ponta passa por ele (nós da timeline, chips, cards).
- Reduced-motion: fio inteiro desenhado, sem scrub. Sem JS: o trilho fantasma não existe — use a borda `--border-hairline` como fallback.
- Regras completas por seção e mobile: `guidelines/fio-da-navalha.md`.
