/* modules/precificacao.js — calculadora de preço por peça */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  const FIELDS = [
    { key: "peso", label: "Peso da peça", suffix: "g", step: 1 },
    { key: "tempo", label: "Tempo de impressão", suffix: "h", step: 0.5 },
    { key: "precoKg", label: "Preço do filamento", prefix: "R$", suffix: "/kg", step: 10 },
    { key: "margem", label: "Margem de lucro", suffix: "%", step: 5 },
    { key: "posMin", label: "Pós-processamento", suffix: "min", step: 5 },
    { key: "valorHora", label: "Seu valor/hora", prefix: "R$", step: 5 },
    { key: "embalagem", label: "Embalagem", prefix: "R$", step: 0.5 },
    { key: "falha", label: "Taxa de falha/refugo", suffix: "%", step: 1 },
    { key: "vidaUtil", label: "Vida útil da impressora", suffix: "h", step: 500 },
    { key: "tarifaKwh", label: "Tarifa de energia", prefix: "R$", suffix: "/kWh", step: 0.05 },
  ];

  function calcular(s, printer) {
    const p = s.precificacao;
    const potenciaKw = printer && printer.tipo === "Resina" ? 0.06 : 0.1;
    const custoFilamento = (p.peso / 1000) * p.precoKg;
    const custoEnergia = potenciaKw * p.tempo * p.tarifaKwh;
    const custoMaquinaHora = printer && p.vidaUtil > 0 ? printer.preco / p.vidaUtil : 0;
    const custoMaquina = custoMaquinaHora * p.tempo;
    const custoPos = (p.posMin / 60) * p.valorHora;
    const custoDireto = custoFilamento + custoEnergia + custoMaquina + custoPos + (p.embalagem || 0);
    const custoReal = custoDireto * (1 + p.falha / 100);
    const precoBase = custoReal * (1 + p.margem / 100);
    const lucro = precoBase - custoReal;
    const margemReal = precoBase > 0 ? (lucro / precoBase) * 100 : 0;
    const lucroHora = p.tempo > 0 ? lucro / p.tempo : 0;
    return { custoFilamento, custoEnergia, custoMaquina, custoMaquinaHora, custoPos, embalagem: p.embalagem || 0, custoDireto, custoReal, precoBase, lucro, margemReal, lucroHora };
  }

  function precoCanal(precoBase, taxa) { return taxa > 0 && taxa < 1 ? precoBase / (1 - taxa) : precoBase; }

  // HTML do painel de resultados (regenerado sozinho, sem tocar nos inputs)
  function resultadosInner(s, printer) {
    const ui = Planner.ui;
    const c = calcular(s, printer);
    const canais = Planner.data.canais;
    const row = (label, val, cls) => `<div class="result-row"><span>${label}</span><strong class="${cls || ""}">${val}</strong></div>`;
    return `
      <h3>Custo de produção</h3>
      ${row("Filamento", ui.moneyCents(c.custoFilamento))}
      ${row("Energia", ui.moneyCents(c.custoEnergia))}
      ${row(`Máquina (${ui.moneyCents(c.custoMaquinaHora)}/h)`, ui.moneyCents(c.custoMaquina))}
      ${row("Pós-processamento", ui.moneyCents(c.custoPos))}
      ${row("Embalagem", ui.moneyCents(c.embalagem))}
      ${row("Custo real (com falhas)", ui.moneyCents(c.custoReal), "pos")}

      <h3 style="margin-top:18px">Preço sugerido</h3>
      ${row("Preço de venda (base)", ui.moneyCents(c.precoBase))}
      ${row("Lucro por peça", ui.moneyCents(c.lucro), "pos")}
      ${row("Margem real", Math.round(c.margemReal) + "%")}
      ${row("Lucro por hora de máquina", ui.moneyCents(c.lucroHora) + "/h", "pos")}

      <h3 style="margin-top:18px">Preço por canal (com taxa)</h3>
      <table class="cmp-table">
        <thead><tr><th>Canal</th><th>Taxa</th><th>Preço final</th><th>Lucro líq.</th></tr></thead>
        <tbody>
          ${canais.map((canal) => {
            const ativo = s.canaisMarketing.includes(canal.id);
            const pf = precoCanal(c.precoBase, canal.taxa || 0);
            const lucroLiq = pf - c.custoReal - pf * (canal.taxa || 0);
            return `<tr class="${ativo ? "row-active" : ""}">
              <td>${canal.icone} ${ui.escapeHtml(canal.nome)}</td>
              <td>${Math.round((canal.taxa || 0) * 100)}%</td>
              <td>${ui.moneyCents(pf)}</td>
              <td class="pos">${ui.moneyCents(lucroLiq)}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
      <small class="muted">Para vender no marketplace mantendo a margem, repassamos a taxa no preço. Canais ativos no seu plano em destaque.</small>`;
  }

  function fieldHtml(s, f) {
    const ui = Planner.ui;
    return `
      <label class="field">
        <span>${f.label}</span>
        <div class="input-wrap">
          ${f.prefix ? `<span class="prefix">${f.prefix}</span>` : ""}
          <input type="number" min="0" step="${f.step}" data-pkey="${f.key}" value="${s.precificacao[f.key]}" />
          ${f.suffix ? `<span class="suffix">${f.suffix}</span>` : ""}
        </div>
      </label>`;
  }

  M.precificacao = {
    title: "Precificação",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const printer = Planner.store.getImpressora();

      const banner = printer
        ? `<div class="card printer-banner">
            <span class="card-icon">${printer.tipo === "Resina" ? "🧴" : "🖨️"}</span>
            <div>
              <strong>${ui.escapeHtml(printer.nome)}</strong>
              <p class="muted">Custo de máquina = preço ÷ vida útil · energia conforme o tipo (${printer.tipo === "Resina" ? "60W" : "100W"}). <a href="#impressoras">trocar</a></p>
            </div>
          </div>`
        : `<div class="card printer-banner empty">
            <span class="card-icon">🖨️</span>
            <div>
              <strong>Sem impressora: custo de máquina não será incluído</strong>
              <p class="muted">Escolha uma impressora para considerar depreciação e energia. <a href="#impressoras">Ver impressoras</a></p>
            </div>
          </div>`;

      el.innerHTML = `
        ${ui.sectionTitle("Precificação de Peça", "Descubra o custo e o preço de venda ideal de uma peça — por canal")}
        ${banner}
        <div class="two-col">
          <div class="card">
            <h3>Dados da peça</h3>
            <div class="form-grid">${FIELDS.map((f) => fieldHtml(s, f)).join("")}</div>
            <div class="save-product">
              <input type="text" id="prodNome" placeholder="Nome da peça (ex.: Chaveiro de time)" />
              <button class="btn btn-primary" id="prodSave">＋ Salvar no catálogo</button>
            </div>
          </div>
          <div class="card results-card precificacao-results">${resultadosInner(s, printer)}</div>
        </div>

        <div class="card">
          <h3>Catálogo de produtos ${s.produtos.length ? `(${s.produtos.length})` : ""}</h3>
          ${s.produtos.length
            ? `<table class="cmp-table">
                <thead><tr><th>Produto</th><th>Peso</th><th>Tempo</th><th>Custo</th><th>Preço</th><th>Lucro</th><th></th></tr></thead>
                <tbody>
                  ${s.produtos.map((p, i) => `<tr>
                    <td><strong>${ui.escapeHtml(p.nome)}</strong></td>
                    <td>${ui.num(p.peso)} g</td>
                    <td>${p.tempo} h</td>
                    <td>${ui.moneyCents(p.custo)}</td>
                    <td>${ui.moneyCents(p.preco)}</td>
                    <td class="pos">${ui.moneyCents(p.lucro)}</td>
                    <td><button class="btn btn-sm btn-ghost" data-del="${i}">✕</button></td>
                  </tr>`).join("")}
                </tbody>
              </table>`
            : `<p class="muted">Nenhum produto salvo. Preencha os dados, dê um nome e clique em "Salvar no catálogo".</p>`}
        </div>
      `;

      const results = el.querySelector(".precificacao-results");
      el.querySelectorAll("input[data-pkey]").forEach((inp) => {
        inp.addEventListener("input", () => {
          const v = parseFloat(inp.value) || 0;
          Planner.store.setPrecificacao({ [inp.dataset.pkey]: v }, true);
          results.innerHTML = resultadosInner(Planner.store.get(), Planner.store.getImpressora());
        });
      });

      el.querySelector("#prodSave").addEventListener("click", () => {
        const nome = (el.querySelector("#prodNome").value || "").trim();
        if (!nome) { el.querySelector("#prodNome").focus(); return; }
        const st = Planner.store.get();
        const c = calcular(st, Planner.store.getImpressora());
        Planner.store.addProduto({ nome, categoria: "Outros", procura: 3, peso: st.precificacao.peso, tempo: st.precificacao.tempo, custo: c.custoReal, preco: c.precoBase, lucro: c.lucro });
      });

      el.querySelectorAll("button[data-del]").forEach((b) =>
        b.addEventListener("click", () => Planner.store.removeProduto(parseInt(b.dataset.del, 10)))
      );
    },
    calcular,
  };
})();
