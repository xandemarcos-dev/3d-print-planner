/* modules/investimento.js — calculadora de investimento */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  const FIELDS = [
    { key: "capital", label: "Capital inicial disponível", help: "Quanto você tem para investir" },
    { key: "custoImpressora", label: "Custo da impressora", help: "Definido pela impressora escolhida (ajustável)" },
    { key: "filamentos", label: "Filamentos", help: "Estoque inicial de filamento" },
    { key: "ferramentas", label: "Ferramentas e acessórios", help: "Espátulas, lixas, tintas, etc." },
    { key: "marketing", label: "Marketing", help: "Anúncios e divulgação inicial" },
    { key: "reserva", label: "Reserva financeira", help: "Capital de giro / emergência" },
    { key: "objetivoMensal", label: "Objetivo de faturamento mensal", help: "Meta de receita por mês" },
    { key: "prazoMeses", label: "Prazo para atingir a meta (meses)", help: "", suffix: true },
  ];

  M.investimento = {
    title: "Calculadora de Investimento",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const fin = Planner.calc.financas(s.config);
      const printer = Planner.store.getImpressora();

      const banner = printer
        ? `<div class="card printer-banner">
            <span class="card-icon">${printer.tipo === "Resina" ? "🧴" : "🖨️"}</span>
            <div>
              <strong>${ui.escapeHtml(printer.nome)} — ${ui.money(printer.preco)}</strong>
              <p class="muted">Impressora do plano. <a href="#impressoras">Comparar e trocar</a></p>
            </div>
          </div>`
        : `<div class="card printer-banner empty">
            <span class="card-icon">🖨️</span>
            <div>
              <strong>Nenhuma impressora escolhida</strong>
              <p class="muted">Escolha uma impressora para preencher os valores automaticamente. <a href="#impressoras">Ver impressoras</a></p>
            </div>
          </div>`;

      el.innerHTML = `
        ${ui.sectionTitle("Calculadora de Investimento", "Informe seus números e veja a viabilidade em tempo real")}
        ${banner}
        <div class="two-col">
          <div class="card">
            <h3>Seus números</h3>
            <div class="form-grid">
              ${FIELDS.map((f) => `
                <label class="field">
                  <span>${f.label}</span>
                  <div class="input-wrap">
                    ${f.suffix ? "" : `<span class="prefix">R$</span>`}
                    <input type="number" min="0" step="${f.suffix ? 1 : 50}" data-key="${f.key}" value="${s.config[f.key]}" />
                  </div>
                  ${f.help ? `<small>${f.help}</small>` : ""}
                </label>`).join("")}
            </div>
          </div>

          <div class="card results-card">
            <h3>Resultados</h3>
            <div class="result-row"><span>Investimento total</span><strong>${ui.money(fin.investimentoTotal)}</strong></div>
            <div class="result-row"><span>Saldo após investir</span><strong class="${fin.saldoAposInvestir < 0 ? "neg" : "pos"}">${ui.money(fin.saldoAposInvestir)}</strong></div>
            <div class="result-row"><span>Ponto de equilíbrio (faturamento/mês)</span><strong>${ui.money(fin.pontoEquilibrio)}</strong></div>
            <div class="result-row"><span>Lucro líquido mensal estimado</span><strong>${ui.money(fin.lucroLiquidoMensal)}</strong></div>
            <div class="result-row"><span>ROI estimado (ano)</span><strong>${Math.round(fin.roiAnual)}%</strong></div>
            <div class="result-row"><span>Tempo de retorno</span><strong>${ui.meses(fin.tempoRetorno)}</strong></div>
            ${fin.saldoAposInvestir < 0
              ? `<p class="alert neg">⚠️ O investimento total ultrapassa seu capital em ${ui.money(-fin.saldoAposInvestir)}.</p>`
              : `<p class="alert pos">✅ Investimento cabe no seu capital, com folga de ${ui.money(fin.saldoAposInvestir)}.</p>`}
            <small class="muted">Estimativas com margem de lucro de 60%. Ajuste seus números para refinar.</small>
          </div>
        </div>
      `;

      el.querySelectorAll("input[data-key]").forEach((inp) => {
        inp.addEventListener("input", () => {
          const v = parseFloat(inp.value) || 0;
          Planner.store.setConfig({ [inp.dataset.key]: v });
        });
      });
    },
  };
})();
