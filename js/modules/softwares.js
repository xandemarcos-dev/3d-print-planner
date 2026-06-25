/* modules/softwares.js — tabela comparativa */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  M.softwares = {
    title: "Softwares",
    render(el) {
      const ui = Planner.ui;
      const printer = Planner.store.getImpressora();
      const reco = printer.softwares || [];
      // recomendados para a impressora primeiro, depois por prioridade
      const list = [...Planner.data.softwares].sort((a, b) =>
        (reco.includes(b.id) ? 100 : 0) + b.prioridade - ((reco.includes(a.id) ? 100 : 0) + a.prioridade)
      );

      el.innerHTML = `
        ${ui.sectionTitle("Softwares", "Ferramentas de modelagem, slicing e IA — destaques conforme a sua impressora")}
        <p class="reco-hint">⭐ Stack recomendada para a <strong>${ui.escapeHtml(printer.nome)}</strong> (inclui o slicer da marca)</p>
        <div class="card table-card">
          <table class="cmp-table">
            <thead>
              <tr><th>Software</th><th>Finalidade</th><th>Custo</th><th>Curva</th><th>Prioridade</th></tr>
            </thead>
            <tbody>
              ${list.map((sw) => {
                const isReco = reco.includes(sw.id);
                return `
                <tr class="${isReco ? "row-active" : ""}">
                  <td>
                    <strong>${ui.escapeHtml(sw.nome)}</strong>
                    ${isReco ? `<span class="pill-reco">⭐ Recomendado</span>` : ""}
                    ${sw.marca ? `<span class="tag-marca">${ui.escapeHtml(sw.marca)}</span>` : ""}
                  </td>
                  <td>${ui.escapeHtml(sw.finalidade)}</td>
                  <td>${ui.escapeHtml(sw.custo)}</td>
                  <td>${ui.badge(ui.nivelLabel(sw.curvaAprendizado), 6 - sw.curvaAprendizado)}</td>
                  <td>${ui.badge(ui.nivelLabel(sw.prioridade), sw.prioridade)}</td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
        <div class="card">
          <h3>Stack recomendada para a ${ui.escapeHtml(printer.nome)}</h3>
          <ul class="rec-list">
            ${reco.map((id) => {
              const sw = Planner.data.softwares.find((w) => w.id === id);
              return sw ? `<li><strong>${ui.escapeHtml(sw.nome)}</strong> — ${ui.escapeHtml(sw.finalidade)}.</li>` : "";
            }).join("")}
          </ul>
        </div>
      `;
    },
  };
})();
