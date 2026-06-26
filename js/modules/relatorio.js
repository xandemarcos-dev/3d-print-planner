/* modules/relatorio.js — relatório / plano estratégico final */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  M.relatorio = {
    title: "Relatório Final",
    render(el) {
      const ui = Planner.ui;
      el.innerHTML = `
        ${ui.sectionTitle("Relatório Final", "Consolide tudo em um plano estratégico pronto para executar")}
        <div class="card center-cta">
          <p>Gere um plano estratégico completo a partir de todas as suas escolhas.</p>
          <button class="btn btn-primary btn-lg" id="genReport">📄 Gerar Plano Estratégico</button>
        </div>
        <div id="reportOut"></div>
      `;
      el.querySelector("#genReport").addEventListener("click", () => {
        el.querySelector("#reportOut").innerHTML = build();
        const out = el.querySelector("#reportOut");
        out.querySelector("#printReport")?.addEventListener("click", () => window.print());
        out.scrollIntoView({ behavior: "smooth" });
      });
    },
  };

  function build() {
    const s = Planner.store.get();
    const ui = Planner.ui;
    const { data } = Planner;
    const fin = Planner.calc.financas(s.config);
    const score = Planner.calc.calcularScore(s);
    const a = Planner.modules.consultora.analisar(s);
    const fases = Planner.modules.roadmap.buildFases(s);
    const printer = Planner.store.getImpressora();

    const nichos = data.nichos.filter((n) => s.nichosSelecionados.includes(n.id));
    const estr = data.estrategias.filter((e) => s.estrategiasSelecionadas.includes(e.id));
    const canais = data.canais.filter((c) => s.canaisMarketing.includes(c.id));
    const softs = [...data.softwares].filter((sw) => sw.prioridade >= 4);
    const recoNichos = printer ? (printer.nichos || []).map((id) => data.nichos.find((n) => n.id === id)).filter(Boolean) : [];
    const recoSofts = printer ? (printer.softwares || []).map((id) => data.softwares.find((w) => w.id === id)).filter(Boolean) : [];
    const pNome = printer ? printer.nome : "(impressora não escolhida)";

    // Lean Canvas: usa o que o usuário editou, senão a sugestão gerada
    const canvasGen = Planner.modules.canvas.gerar(s);
    const canvasTexto = (key) => {
      const edit = (s.canvas && s.canvas[key] || "").trim();
      return edit || canvasGen[key] || "—";
    };
    const canvasBlocos = [
      { key: "problema", n: 1, nome: "Problema" },
      { key: "segmentos", n: 2, nome: "Segmento de Clientes" },
      { key: "proposta", n: 3, nome: "Proposta de Valor" },
      { key: "solucao", n: 4, nome: "Solução" },
      { key: "canais", n: 5, nome: "Canais" },
      { key: "receitas", n: 6, nome: "Receitas" },
      { key: "custos", n: 7, nome: "Estrutura de Custos" },
      { key: "metricas", n: 8, nome: "Métricas-Chave" },
      { key: "vantagem", n: 9, nome: "Vantagem Injusta" },
    ];

    // Projeção 12 meses (crescimento simples até a meta)
    const meta = s.config.objetivoMensal;
    const proj = [];
    for (let m = 1; m <= 12; m++) {
      const fator = Math.min(1, m / Math.max(s.config.prazoMeses, 1));
      const fat = Math.round(meta * (0.2 + 0.8 * fator));
      proj.push({ mes: m, fat, lucro: Math.round(fat * 0.5) });
    }

    const li = (x) => `<li>${ui.escapeHtml(x)}</li>`;

    return `
      <div class="card report">
        <div class="report-actions no-print">
          <button class="btn btn-ghost" id="printReport">🖨️ Imprimir / Salvar PDF</button>
        </div>

        <div class="report-title">
          <h2>Plano Estratégico — Negócio de Impressão 3D 2026</h2>
          <p class="muted">${ui.escapeHtml(pNome)} · Score do projeto: <strong>${score}/100</strong> · Gerado em ${new Date().toLocaleDateString("pt-BR")}</p>
        </div>

        <section>
          <h3>1. Resumo Executivo</h3>
          <p>Operação de impressão 3D iniciando com <strong>${ui.num(s.config.impressoras)}</strong> × <strong>${ui.escapeHtml(pNome)}</strong>${printer ? ` (${printer.tipo}, ${printer.multicor >= 2 ? printer.multicor + " cores" : "cor única"})` : ""} e investimento total de
          <strong>${ui.money(fin.investimentoTotal)}</strong>, mirando faturamento mensal de <strong>${ui.money(meta)}</strong>
          em <strong>${s.config.prazoMeses} meses</strong>. ROI estimado de <strong>${Math.round(fin.roiAnual)}%/ano</strong>,
          com retorno do investimento em <strong>${ui.meses(fin.tempoRetorno)}</strong>. Maior aposta: <strong>${ui.escapeHtml(a.melhorNicho.nome)}</strong>.</p>
        </section>

        <section>
          <h3>2. Configuração Ideal da Impressora</h3>
          ${printer ? `
          <p><strong>${ui.escapeHtml(printer.nome)}</strong> · ${printer.tipo} · ${printer.multicor >= 2 ? printer.multicor + " cores" : "cor única"} · ${printer.velocidade ? printer.velocidade + " mm/s" : "alta precisão"} · volume ${ui.escapeHtml(printer.volume)} · ${ui.money(printer.preco)} (${printer.loja}).</p>
          <p class="muted">${ui.escapeHtml(printer.destaque)}</p>
          <p><strong>Nichos mais apropriados:</strong> ${recoNichos.map((n) => ui.escapeHtml(n.nome)).join(", ") || "—"}.</p>
          <p><strong>Softwares recomendados:</strong> ${recoSofts.map((w) => ui.escapeHtml(w.nome) + (w.marca ? ` (${w.marca})` : "")).join(", ") || "—"}.</p>`
          : `<p class="muted">Nenhuma impressora selecionada. Escolha uma na aba Impressoras para preencher esta seção e os valores da calculadora.</p>`}
        </section>

        <section>
          <h3>3. Nichos Escolhidos</h3>
          ${nichos.length ? `<ul>${nichos.map((n) => li(`${n.nome} — ${n.resumo}`)).join("")}</ul>` : `<p class="muted">Nenhum nicho selecionado. Recomendado: ${ui.escapeHtml(a.melhorNicho.nome)}.</p>`}
        </section>

        <section>
          <h3>4. Estratégias Selecionadas</h3>
          ${estr.length ? `<ul>${estr.map((e) => li(`${e.nome} — ${e.descricao}`)).join("")}</ul>` : `<p class="muted">Nenhuma estratégia selecionada. ROI mais rápido: ${ui.escapeHtml(a.roiRapido.nome)}.</p>`}
        </section>

        <section>
          <h3>5. Softwares Recomendados</h3>
          <ul>${softs.map((sw) => li(`${sw.nome} — ${sw.finalidade} (${sw.custo})`)).join("")}</ul>
        </section>

        <section>
          <h3>6. Plano de Marketing</h3>
          ${canais.length ? `<ul>${canais.map((c) => li(`${c.nome} — ${c.nota}`)).join("")}</ul>` : `<p class="muted">Nenhum canal ativo. Sugestão: começar por TikTok (timelapses) + Shopee.</p>`}
        </section>

        <section>
          <h3>7. Projeção Financeira (12 meses)</h3>
          <table class="cmp-table">
            <thead><tr><th>Mês</th><th>Faturamento</th><th>Lucro estimado</th></tr></thead>
            <tbody>${proj.map((p) => `<tr><td>${p.mes}</td><td>${ui.money(p.fat)}</td><td>${ui.money(p.lucro)}</td></tr>`).join("")}</tbody>
          </table>
          <p class="muted">Ponto de equilíbrio: ${ui.money(fin.pontoEquilibrio)}/mês · Investimento: ${ui.money(fin.investimentoTotal)}.</p>
        </section>

        <section>
          <h3>8. Roadmap de 12 Meses</h3>
          ${fases.map((f, i) => `<div class="rep-phase"><strong>${f.icone} Fase ${i + 1}: ${ui.escapeHtml(f.nome)}</strong><ul>${f.bullets.map(li).join("")}</ul></div>`).join("")}
        </section>

        <section>
          <h3>9. Próximas Ações</h3>
          <ul>
            ${li(a.proximoPasso)}
            ${li(`Validar o nicho "${a.melhorNicho.nome}" com 3 produtos âncora.`)}
            ${li(`Implementar a estratégia de ROI mais rápido: ${a.roiRapido.nome}.`)}
            ${li(`Mitigar o risco principal: ${a.maiorRiscoNicho.riscos}`)}
            ${li("Configurar gravação de timelapses desde a primeira impressão.")}
          </ul>
        </section>

        <section>
          <h3>10. Lean Canvas (modelo de negócio em 1 página)</h3>
          <div class="rep-canvas">
            ${canvasBlocos.map((b) => `
              <div class="rep-canvas-cell">
                <strong>${b.n}. ${ui.escapeHtml(b.nome)}</strong>
                <p>${ui.escapeHtml(canvasTexto(b.key))}</p>
              </div>`).join("")}
          </div>
        </section>
      </div>
    `;
  }
})();
