/* modules/marketing.js */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  M.marketing = {
    title: "Marketing",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const { canais } = Planner.data;

      el.innerHTML = `
        ${ui.sectionTitle("Marketing", "Ative os canais de venda e divulgação do seu negócio")}
        <div class="cards-grid">
          ${canais.map((c) => {
            const on = s.canaisMarketing.includes(c.id);
            return `
            <div class="card channel-card ${on ? "selected" : ""}">
              <div class="card-top">
                <span class="card-icon">${c.icone}</span>
                <h3>${ui.escapeHtml(c.nome)}</h3>
                <label class="switch">
                  <input type="checkbox" data-canal="${c.id}" ${on ? "checked" : ""}/>
                  <span class="slider"></span>
                </label>
              </div>
              <p class="muted">${ui.escapeHtml(c.nota)}</p>
              ${ui.bar("Alcance potencial", c.alcance)}
              ${ui.bar("ROI estimado", c.roiEstimado)}
              ${ui.bar("Dificuldade", c.dificuldade, 5, { invert: true })}
              ${ui.bar("Custo", c.custo, 5, { invert: true })}
            </div>`;
          }).join("")}
        </div>
      `;

      el.querySelectorAll("input[data-canal]").forEach((cb) =>
        cb.addEventListener("change", () => Planner.store.toggle("canaisMarketing", cb.dataset.canal))
      );
    },
  };
})();
