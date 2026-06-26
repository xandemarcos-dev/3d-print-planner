/* modules/printfarm.js — simulação de print farm */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  const OPCOES = [1, 2, 3, 5, 10];

  M.printfarm = {
    title: "Print Farm",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const printer = Planner.store.getImpressora();

      if (!printer) {
        el.innerHTML = `
          ${ui.sectionTitle("Print Farm", "Simule o crescimento da sua operação aumentando o número de impressoras")}
          <div class="card printer-banner empty">
            <span class="card-icon">🏭</span>
            <div>
              <strong>Escolha uma impressora primeiro</strong>
              <p class="muted">A simulação usa a capacidade e o ticket da impressora selecionada. <a href="#impressoras">Ver impressoras</a></p>
            </div>
          </div>`;
        return;
      }

      const qtd = s.printFarm.qtdImpressoras;
      const sim = Planner.calc.printFarm(qtd, s.config, printer);
      const meta = s.config.objetivoMensal;
      const atingeMeta = sim.faturamento >= meta;

      el.innerHTML = `
        ${ui.sectionTitle("Print Farm", "Simule o crescimento da sua operação aumentando o número de impressoras")}
        <div class="card printer-banner">
          <span class="card-icon">${printer.tipo === "Resina" ? "🧴" : "🖨️"}</span>
          <div>
            <strong>${ui.escapeHtml(printer.nome)}</strong>
            <p class="muted">${printer.pecasMes} peças/mês · ticket ${ui.money(printer.ticket)} · ${printer.tipo} — <a href="#impressoras">trocar impressora</a></p>
          </div>
        </div>
        <div class="card">
          <div class="seg-control">
            ${OPCOES.map((o) => `<button class="seg ${o === qtd ? "active" : ""}" data-qtd="${o}">${o} ${o === 1 ? "impressora" : "impressoras"}</button>`).join("")}
          </div>
        </div>

        <div class="kpi-grid farm-kpis">
          ${ui.kpi("Produção mensal", `${ui.num(sim.producaoMensal)} peças`, "estimativa")}
          ${ui.kpi("Faturamento mensal", ui.money(sim.faturamento), atingeMeta ? `<span class="pos">Atinge a meta ✅</span>` : `Meta: ${ui.money(meta)}`)}
          ${ui.kpi("Lucro mensal", ui.money(sim.lucro), "após custos")}
          ${ui.kpi("Tempo p/ próxima impressora", ui.meses(sim.tempoExpansao), "reinvestindo o lucro")}
        </div>

        <div class="card">
          <h3>Comparativo de cenários</h3>
          <table class="cmp-table">
            <thead><tr><th>Impressoras</th><th>Produção/mês</th><th>Faturamento</th><th>Lucro</th><th>Meta</th></tr></thead>
            <tbody>
              ${OPCOES.map((o) => {
                const r = Planner.calc.printFarm(o, s.config, printer);
                const ok = r.faturamento >= meta;
                return `<tr class="${o === qtd ? "row-active" : ""}">
                  <td><strong>${o}</strong></td>
                  <td>${ui.num(r.producaoMensal)} peças</td>
                  <td>${ui.money(r.faturamento)}</td>
                  <td>${ui.money(r.lucro)}</td>
                  <td>${ok ? '<span class="pos">✅</span>' : '<span class="muted">—</span>'}</td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
          <small class="muted">Premissas (${ui.escapeHtml(printer.nome)}): ~${printer.pecasMes} peças/mês por máquina, ticket médio ${ui.money(printer.ticket)}, margem 60%.</small>
        </div>
      `;

      el.querySelectorAll("button[data-qtd]").forEach((b) =>
        b.addEventListener("click", () => Planner.store.setPrintFarm(parseInt(b.dataset.qtd, 10)))
      );
    },
  };
})();
