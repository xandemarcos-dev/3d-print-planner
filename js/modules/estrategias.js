/* modules/estrategias.js */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  M.estrategias = {
    title: "Estratégias",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const { estrategias } = Planner.data;

      el.innerHTML = `
        ${ui.sectionTitle("Estratégias", `Selecione as táticas para o seu negócio — ${s.estrategiasSelecionadas.length}/${estrategias.length} ativas`)}
        <div class="cards-grid">
          ${estrategias.map((e, i) => {
            const on = s.estrategiasSelecionadas.includes(e.id);
            return `
            <div class="card strat-card ${on ? "selected" : ""}">
              <div class="card-top">
                <span class="num-badge">${i + 1}</span>
                <h3>${ui.escapeHtml(e.nome)}</h3>
                ${on ? `<span class="pill-on">Selecionada</span>` : ""}
              </div>
              <p class="muted">${ui.escapeHtml(e.descricao)}</p>
              ${ui.bar("Impacto financeiro", e.impactoFinanceiro)}
              ${ui.bar("Facilidade de implementação", e.facilidade)}
              ${ui.bar("Velocidade de retorno", e.velocidadeRetorno)}
              ${ui.bar("Risco operacional", e.riscoOperacional, 5, { invert: true })}
              <button class="btn ${on ? "btn-ghost" : "btn-primary"}" data-strat="${e.id}">
                ${on ? "Remover" : "Selecionar Estratégia"}
              </button>
            </div>`;
          }).join("")}
        </div>
      `;

      el.querySelectorAll("button[data-strat]").forEach((b) =>
        b.addEventListener("click", () => Planner.store.toggle("estrategiasSelecionadas", b.dataset.strat))
      );
    },
  };
})();
