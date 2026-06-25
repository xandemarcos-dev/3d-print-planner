/* modules/matriz.js — matriz de decisão (Canvas) */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  M.matriz = {
    title: "Matriz de Decisão",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const { estrategias } = Planner.data;

      el.innerHTML = `
        ${ui.sectionTitle("Matriz de Decisão", "Estratégias posicionadas por lucro × dificuldade. As selecionadas ficam em destaque")}
        <div class="two-col matriz-layout">
          <div class="card chart-card">
            <canvas id="matrizCanvas"></canvas>
          </div>
          <div class="card">
            <h3>Legenda das estratégias</h3>
            <ol class="legend-list">
              ${estrategias.map((e, i) => {
                const on = s.estrategiasSelecionadas.includes(e.id);
                return `<li class="${on ? "on" : ""}"><span class="legend-num">${i + 1}</span> ${ui.escapeHtml(e.nome)} ${on ? '<span class="pill-on">selecionada</span>' : ""}</li>`;
              }).join("")}
            </ol>
          </div>
        </div>
      `;

      // desenha após o layout existir
      requestAnimationFrame(() => {
        const cv = el.querySelector("#matrizCanvas");
        Planner.charts.drawMatriz(cv, estrategias, s.estrategiasSelecionadas);
      });
    },
  };
})();
