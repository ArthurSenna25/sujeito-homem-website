// Carrega os .jsx do design system em páginas estáticas (cards, UI kit) sem build.
// Uso: <script src="…/ds-load.js"></script> <script>DS_load(['components/core/Icon.jsx',…]).then(…)</script>
// Requer React 18 + Babel standalone na página.
window.DS_load = async function (files, base) {
  base = base || '';
  let code = '';
  for (const f of files) {
    let t = await (await fetch(base + f)).text();
    t = t.replace(/^import .*$/gm, '').replace(/^export (declare )?(function|const) /gm, '$2 ');
    const names = [...t.matchAll(/^(?:function|const) ([A-Z]\w*|getOpenStatus|SH_SCHEDULE)/gm)].map((m) => m[1]);
    code += t + '\n' + names.map((n) => `window.${n}=${n};`).join('') + '\n';
  }
  (0, eval)(Babel.transform(code, { presets: ['react'] }).code);
};
// Cards: carrega componentes e monta <script type="text/plain" id="demo"> (define function Demo) em #root.
window.DS_run = async function (files, base) {
  await DS_load(files, base);
  const src = document.getElementById('demo').textContent;
  (0, eval)(Babel.transform(src + ';window.Demo=Demo;', { presets: ['react'] }).code);
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(window.Demo));
};
