/* modules/consultora.js — análise heurística (sem API) */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  function analisar(s) {
    const { data } = Planner;
    const ui = Planner.ui;
    const nichosSel = data.nichos.filter((n) => s.nichosSelecionados.includes(n.id));
    const estrSel = data.estrategias.filter((e) => s.estrategiasSelecionadas.includes(e.id));
    const baseNichos = nichosSel.length ? nichosSel : data.nichos;
    const baseEstr = estrSel.length ? estrSel : data.estrategias;
    const fin = Planner.calc.financas(s.config);
    const printer = Planner.store.getImpressora();

    // alerta de compatibilidade: plano multicor sem impressora multicor (ou sem impressora)
    const querMulticor =
      s.nichosSelecionados.includes("multicolor") ||
      s.estrategiasSelecionadas.includes("e_multicolor");
    let alertaMulticor = null;
    if (querMulticor) {
      if (!printer) alertaMulticor = "Você priorizou produtos multicoloridos, mas ainda não escolheu uma impressora. Escolha uma com AMS/CFS (ex.: Bambu A1 Combo ou Creality K2).";
      else if (printer.multicor < 2) alertaMulticor = `Você priorizou produtos multicoloridos, mas a ${printer.nome} é de cor única. Considere uma impressora com AMS/CFS (ex.: Bambu A1 Combo ou Creality K2).`;
    }

    // Maior potencial (potencial + escalabilidade - risco)
    const melhorNicho = [...baseNichos].sort(
      (a, b) => (b.potencial + b.escalabilidade - b.riscoNivel) - (a.potencial + a.escalabilidade - a.riscoNivel)
    )[0];

    // ROI mais rápido (velocidade + facilidade)
    const roiRapido = [...baseEstr].sort(
      (a, b) => (b.velocidadeRetorno + b.facilidade) - (a.velocidadeRetorno + a.facilidade)
    )[0];

    // Riscos a evitar (maior risco)
    const maiorRiscoEstr = [...baseEstr].sort((a, b) => b.riscoOperacional - a.riscoOperacional)[0];
    const maiorRiscoNicho = [...baseNichos].sort((a, b) => b.riscoNivel - a.riscoNivel)[0];

    // Próximo passo
    let proximoPasso;
    if (!printer) {
      proximoPasso = "Comece escolhendo sua impressora na aba Impressoras — ela preenche custos, capacidade e recomendações.";
    } else if (s.config.capital <= 0) {
      proximoPasso = "Defina seu capital inicial na Calculadora de Investimento para validar a viabilidade.";
    } else if (fin.saldoAposInvestir < 0) {
      proximoPasso = `Seu plano de investimento estoura o capital em ${ui.money(-fin.saldoAposInvestir)}. Reduza custos iniciais ou comece com bootstrapping.`;
    } else if (s.nichosSelecionados.length === 0) {
      proximoPasso = `Escolha 1–2 nichos. Sugestão: comece por ${melhorNicho.nome}.`;
    } else if (s.estrategiasSelecionadas.length < 2) {
      proximoPasso = `Selecione ao menos 2 estratégias. A de ROI mais rápido é "${roiRapido.nome}".`;
    } else if (s.canaisMarketing.length === 0) {
      proximoPasso = "Ative pelo menos um canal de marketing (TikTok tem o melhor alcance orgânico).";
    } else {
      proximoPasso = "Plano completo! Gere o Plano Estratégico e comece pela Fase 1 (Aprendizado) do roadmap.";
    }

    return { melhorNicho, roiRapido, maiorRiscoEstr, maiorRiscoNicho, proximoPasso, fin, printer, alertaMulticor };
  }

  M.consultora = {
    title: "IA Consultora",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const a = analisar(s);
      const score = Planner.calc.calcularScore(s);

      el.innerHTML = `
        ${ui.sectionTitle("IA Consultora", "Análise automática das suas escolhas com recomendações práticas")}
        <div class="card advisor-head">
          <div class="advisor-avatar">🤖</div>
          <div>
            <h3>Diagnóstico do seu plano</h3>
            <p class="muted">Impressora: <strong>${a.printer ? ui.escapeHtml(a.printer.nome) : "nenhuma escolhida"}</strong> · Score: <strong>${score}/100</strong> · ${s.nichosSelecionados.length} nichos · ${s.estrategiasSelecionadas.length} estratégias · ${s.canaisMarketing.length} canais</p>
          </div>
        </div>

        ${a.alertaMulticor ? `<div class="card alert neg" style="margin-top:0">⚠️ ${ui.escapeHtml(a.alertaMulticor)}</div>` : ""}

        <div class="cards-grid advisor-grid">
          <div class="card advisor-card">
            <h4>🏆 Qual nicho tem maior potencial?</h4>
            <p><strong>${ui.escapeHtml(a.melhorNicho.nome)}</strong> — ${ui.escapeHtml(a.melhorNicho.resumo)}</p>
          </div>
          <div class="card advisor-card">
            <h4>⚡ Qual estratégia gera ROI mais rápido?</h4>
            <p><strong>${ui.escapeHtml(a.roiRapido.nome)}</strong> — ${ui.escapeHtml(a.roiRapido.descricao)}</p>
          </div>
          <div class="card advisor-card">
            <h4>⚠️ Quais riscos evitar?</h4>
            <p><strong>${ui.escapeHtml(a.maiorRiscoNicho.nome)}:</strong> ${ui.escapeHtml(a.maiorRiscoNicho.riscos)}</p>
            <p class="muted">Atenção também ao risco operacional de "${ui.escapeHtml(a.maiorRiscoEstr.nome)}".</p>
          </div>
          <div class="card advisor-card highlight">
            <h4>👉 Próximo passo recomendado</h4>
            <p>${ui.escapeHtml(a.proximoPasso)}</p>
          </div>
        </div>
      `;
    },
    analisar,
  };
})();
