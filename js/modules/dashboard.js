/* modules/dashboard.js */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  M.dashboard = {
    title: "Dashboard",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const { data } = Planner;
      const fin = Planner.calc.financas(s.config);
      const score = Planner.calc.calcularScore(s);
      const printer = Planner.store.getImpressora();

      const nichosNomes = data.nichos
        .filter((n) => s.nichosSelecionados.includes(n.id))
        .map((n) => `${n.icone} ${n.nome}`);

      const scoreMsg =
        score >= 75 ? "Plano sólido e bem definido." :
        score >= 50 ? "Bom começo — refine as escolhas." :
        score >= 25 ? "Faltam decisões importantes." :
        "Comece preenchendo a calculadora e escolhendo nichos.";

      el.innerHTML = `
        ${ui.sectionTitle("Dashboard", "Visão geral do seu negócio de impressão 3D — Bambu Lab A1 Combo AMS")}

        <div class="dash-grid">
          <div class="card score-card">
            ${ui.scoreRing(score)}
            <div class="score-meta">
              <div class="score-title">Score Geral do Projeto</div>
              <p>${scoreMsg}</p>
            </div>
          </div>

          <div class="kpi-grid">
            ${ui.kpi("Capital disponível", ui.money(s.config.capital), fin.saldoAposInvestir < 0 ? `<span class="neg">Faltam ${ui.money(-fin.saldoAposInvestir)}</span>` : `Sobra ${ui.money(fin.saldoAposInvestir)} após investir`)}
            ${ui.kpi("Objetivo mensal", ui.money(s.config.objetivoMensal), `em ${s.config.prazoMeses} ${s.config.prazoMeses === 1 ? "mês" : "meses"}`)}
            ${ui.kpi("Investimento total", ui.money(fin.investimentoTotal), `Retorno em ${ui.meses(fin.tempoRetorno)}`)}
            ${ui.kpi("ROI estimado", `${Math.round(fin.roiAnual)}%`, "ao ano")}
            ${ui.kpi("Impressora", `<span class="kpi-printer">${ui.escapeHtml(printer.nome)}</span>`, `${printer.tipo} · ${printer.multicor >= 2 ? printer.multicor + " cores" : "cor única"}`)}
            ${ui.kpi("Estratégias ativas", ui.num(s.estrategiasSelecionadas.length), `de ${data.estrategias.length}`)}
          </div>
        </div>

        <div class="card">
          <h3>Nichos selecionados</h3>
          ${nichosNomes.length
            ? `<div class="chips">${nichosNomes.map((n) => `<span class="chip">${ui.escapeHtml(n)}</span>`).join("")}</div>`
            : `<p class="muted">Nenhum nicho escolhido ainda. Vá em <a href="#nichos">Nichos</a> para selecionar.</p>`}
        </div>

        <div class="card">
          <h3>Canais de marketing</h3>
          ${s.canaisMarketing.length
            ? `<div class="chips">${data.canais.filter((c) => s.canaisMarketing.includes(c.id)).map((c) => `<span class="chip">${c.icone} ${ui.escapeHtml(c.nome)}</span>`).join("")}</div>`
            : `<p class="muted">Nenhum canal ativo. Vá em <a href="#marketing">Marketing</a>.</p>`}
        </div>
      `;
    },
  };
})();
