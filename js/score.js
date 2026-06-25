/* score.js — cálculos derivados: score geral, finanças e print farm */
(function () {
  const Planner = (window.Planner = window.Planner || {});

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function avg(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }

  /** Finanças derivadas da calculadora de investimento */
  function financas(config) {
    const investimentoTotal =
      (config.custoImpressora || 0) +
      (config.filamentos || 0) +
      (config.ferramentas || 0) +
      (config.marketing || 0) +
      (config.reserva || 0);

    const objetivoMensal = config.objetivoMensal || 0;
    const margem = 0.6; // margem de lucro estimada padrão (60%)
    const lucroMensal = objetivoMensal * margem;

    // custos fixos mensais aproximados (energia, manutenção, filamento de reposição)
    const custoFixoMensal = (config.filamentos || 0) * 0.5 + 150;
    // ponto de equilíbrio: faturamento mensal necessário para cobrir custos
    const pontoEquilibrio = custoFixoMensal / margem;

    // tempo de retorno do investimento (meses) com base no lucro mensal líquido
    const lucroLiquidoMensal = Math.max(lucroMensal - custoFixoMensal, 0);
    const tempoRetorno = lucroLiquidoMensal > 0 ? investimentoTotal / lucroLiquidoMensal : Infinity;

    // ROI anual estimado (%)
    const roiAnual = investimentoTotal > 0 ? (lucroLiquidoMensal * 12 / investimentoTotal) * 100 : 0;

    const saldoAposInvestir = (config.capital || 0) - investimentoTotal;

    return {
      investimentoTotal,
      pontoEquilibrio,
      tempoRetorno,
      roiAnual,
      lucroLiquidoMensal,
      custoFixoMensal,
      saldoAposInvestir,
    };
  }

  /** Simulação de print farm para uma quantidade de impressoras (usa a impressora escolhida) */
  function printFarm(qtd, config, printer) {
    // premissas vêm da impressora selecionada (capacidade e ticket médio)
    const pecasMesPorImpressora = printer && printer.pecasMes ? printer.pecasMes : 90;
    const ticketMedio = printer && printer.ticket ? printer.ticket : 35;
    const margem = 0.6;

    const producaoMensal = pecasMesPorImpressora * qtd;
    const faturamento = producaoMensal * ticketMedio;
    const custoVariavel = faturamento * (1 - margem);
    const custoFixo = 150 * qtd; // energia + manutenção por máquina
    const lucro = faturamento - custoVariavel - custoFixo;

    // tempo (meses) para juntar o custo de uma nova impressora reinvestindo o lucro
    const custoNovaImpressora = config.custoImpressora || 3500;
    const tempoExpansao = lucro > 0 ? custoNovaImpressora / lucro : Infinity;

    return { producaoMensal, faturamento, lucro, tempoExpansao };
  }

  /** Score geral 0–100 combinando completude + qualidade das escolhas + viabilidade */
  function calcularScore(state) {
    const { nichos, estrategias, canais } = Planner.data;
    const cfg = state.config;

    // 1) Completude do planejamento (25 pts)
    let completude = 0;
    if (cfg.capital > 0) completude += 8;
    if (cfg.objetivoMensal > 0) completude += 6;
    if (cfg.prazoMeses > 0) completude += 5;
    if (cfg.custoImpressora > 0) completude += 6;

    // 2) Qualidade dos nichos selecionados (25 pts): potencial alto, risco baixo
    const nSel = nichos.filter((n) => state.nichosSelecionados.includes(n.id));
    const nichoScore = nSel.length
      ? clamp(avg(nSel.map((n) => (n.potencial * 1.2 + n.escalabilidade - n.riscoNivel))) / 6, 0, 1) * 25
      : 0;

    // 3) Qualidade das estratégias (25 pts): impacto + facilidade - risco
    const eSel = estrategias.filter((e) => state.estrategiasSelecionadas.includes(e.id));
    const estrScore = eSel.length
      ? clamp(avg(eSel.map((e) => (e.impactoFinanceiro + e.facilidade + e.velocidadeRetorno - e.riscoOperacional))) / 12, 0, 1) * 25
      : 0;

    // 4) Cobertura de marketing (12 pts)
    const cSel = canais.filter((c) => state.canaisMarketing.includes(c.id));
    const mktScore = clamp(cSel.length / 3, 0, 1) * 12;

    // 5) Viabilidade financeira (13 pts): ROI alto e retorno dentro do prazo
    const fin = financas(cfg);
    let viab = 0;
    if (isFinite(fin.tempoRetorno) && cfg.prazoMeses > 0) {
      viab += clamp(cfg.prazoMeses / Math.max(fin.tempoRetorno, 1), 0, 1) * 7;
    }
    viab += clamp(fin.roiAnual / 150, 0, 1) * 6;
    if (fin.saldoAposInvestir < 0) viab *= 0.6; // penaliza orçamento estourado

    const total = completude + nichoScore + estrScore + mktScore + viab;
    return Math.round(clamp(total, 0, 100));
  }

  Planner.calc = { financas, printFarm, calcularScore };
})();
