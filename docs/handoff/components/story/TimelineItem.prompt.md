Item de linha do tempo da história da barbearia. Dentro de `<ol>` com um `<span data-fio-spine>` posicionado em left:16px, o fio da navalha vira a espinha da timeline.

```jsx
<ol style={{position:'relative',padding:0,margin:0}}>
  <span data-fio-spine style={{position:'absolute',left:16,top:0,bottom:0,width:1}} />
  <TimelineItem year="2018" title="A primeira cadeira" state="past">Renan abre as portas em Jales.</TimelineItem>
  <TimelineItem year="Hoje" title="Equipe e padrão" state="current">…</TimelineItem>
</ol>
```
