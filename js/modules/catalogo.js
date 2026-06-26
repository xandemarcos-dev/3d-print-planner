/* modules/catalogo.js — biblioteca de produtos (alimenta a Print Farm) */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  const PROCURA = { 1: "Muito baixa", 2: "Baixa", 3: "Média", 4: "Alta", 5: "Muito alta" };

  // calcula custo/preço/lucro de uma peça com os parâmetros globais de precificação
  function precoDe(peso, tempo) {
    const s = Planner.store.get();
    const printer = Planner.store.getImpressora();
    const estado = { ...s, precificacao: { ...s.precificacao, peso: peso, tempo: tempo } };
    return Planner.modules.precificacao.calcular(estado, printer);
  }

  M.catalogo = {
    title: "Catálogo",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const cats = Planner.data.categoriasProduto;
      const produtos = s.produtos;

      // estatísticas
      const n = produtos.length;
      const margemMedia = n ? produtos.reduce((a, p) => a + (p.preco > 0 ? (p.lucro / p.preco) * 100 : 0), 0) / n : 0;
      const lucroHoraMedio = n ? produtos.reduce((a, p) => a + (p.tempo > 0 ? p.lucro / p.tempo : 0), 0) / n : 0;
      const porCategoria = {};
      produtos.forEach((p) => { porCategoria[p.categoria || "Outros"] = (porCategoria[p.categoria || "Outros"] || 0) + 1; });

      el.innerHTML = `
        ${ui.sectionTitle("Catálogo de Produtos", "Sua biblioteca de produtos — registre tempo, custo, preço, margem e procura de cada peça")}

        <div class="kpi-grid catalogo-kpis">
          ${ui.kpi("Produtos", ui.num(n), "no catálogo")}
          ${ui.kpi("Margem média", n ? Math.round(margemMedia) + "%" : "—", "por peça")}
          ${ui.kpi("Lucro/hora médio", n ? ui.moneyCents(lucroHoraMedio) + "/h" : "—", "de máquina")}
          ${ui.kpi("Categorias", ui.num(Object.keys(porCategoria).length), "usadas")}
        </div>

        <div class="card">
          <h3>Adicionar produto</h3>
          <div class="form-grid catalogo-form">
            <label class="field"><span>Nome</span><div class="input-wrap"><input type="text" id="cNome" placeholder="Ex.: Porta-controle"/></div></label>
            <label class="field"><span>Categoria</span><div class="input-wrap"><select id="cCat">${cats.map((c) => `<option>${c}</option>`).join("")}</select></div></label>
            <label class="field"><span>Peso</span><div class="input-wrap"><input type="number" min="0" step="1" id="cPeso" value="50"/><span class="suffix">g</span></div></label>
            <label class="field"><span>Tempo</span><div class="input-wrap"><input type="number" min="0" step="0.5" id="cTempo" value="3"/><span class="suffix">h</span></div></label>
            <label class="field"><span>Procura</span><div class="input-wrap"><select id="cProcura">${[5, 4, 3, 2, 1].map((v) => `<option value="${v}" ${v === 3 ? "selected" : ""}>${PROCURA[v]}</option>`).join("")}</select></div></label>
          </div>
          <button class="btn btn-primary" id="cAdd" style="margin-top:14px">＋ Adicionar ao catálogo</button>
          <small class="muted" style="display:block;margin-top:8px">Custo e preço são calculados com os parâmetros da aba <a href="#precificacao">Precificação</a> (filamento, margem, etc.).</small>
        </div>

        <div class="card table-card">
          <h3>Produtos ${n ? `(${n})` : ""}</h3>
          ${n ? `
            <table class="cmp-table catalogo-table">
              <thead><tr><th>Produto</th><th>Categoria</th><th>Procura</th><th>Peso</th><th>Tempo</th><th>Custo</th><th>Preço</th><th>Lucro</th><th>R$/h</th><th></th></tr></thead>
              <tbody>
                ${produtos.map((p, i) => `<tr>
                  <td><strong>${ui.escapeHtml(p.nome)}</strong></td>
                  <td><span class="tag-marca">${ui.escapeHtml(p.categoria || "Outros")}</span></td>
                  <td>
                    <select class="mini-select" data-procura="${i}">
                      ${[5, 4, 3, 2, 1].map((v) => `<option value="${v}" ${v === (p.procura || 3) ? "selected" : ""}>${PROCURA[v]}</option>`).join("")}
                    </select>
                  </td>
                  <td>${ui.num(p.peso)} g</td>
                  <td>${p.tempo} h</td>
                  <td>${ui.moneyCents(p.custo)}</td>
                  <td>${ui.moneyCents(p.preco)}</td>
                  <td class="pos">${ui.moneyCents(p.lucro)}</td>
                  <td>${p.tempo > 0 ? ui.moneyCents(p.lucro / p.tempo) : "—"}</td>
                  <td><button class="btn btn-sm btn-ghost" data-del="${i}">✕</button></td>
                </tr>`).join("")}
              </tbody>
            </table>
            <small class="muted">Estes produtos alimentam a simulação da <a href="#printfarm">Print Farm</a> (médias reais em vez de estimativa).</small>
          ` : `<p class="muted">Nenhum produto ainda. Adicione acima ou salve direto pela aba <a href="#precificacao">Precificação</a>.</p>`}
        </div>
      `;

      el.querySelector("#cAdd").addEventListener("click", () => {
        const nome = (el.querySelector("#cNome").value || "").trim();
        if (!nome) { el.querySelector("#cNome").focus(); return; }
        const peso = parseFloat(el.querySelector("#cPeso").value) || 0;
        const tempo = parseFloat(el.querySelector("#cTempo").value) || 0;
        const c = precoDe(peso, tempo);
        Planner.store.addProduto({
          nome,
          categoria: el.querySelector("#cCat").value,
          procura: parseInt(el.querySelector("#cProcura").value, 10),
          peso, tempo, custo: c.custoReal, preco: c.precoBase, lucro: c.lucro,
        });
      });

      el.querySelectorAll("select[data-procura]").forEach((sel) =>
        sel.addEventListener("change", () => Planner.store.updateProduto(parseInt(sel.dataset.procura, 10), { procura: parseInt(sel.value, 10) }))
      );
      el.querySelectorAll("button[data-del]").forEach((b) =>
        b.addEventListener("click", () => Planner.store.removeProduto(parseInt(b.dataset.del, 10)))
      );
    },
  };
})();
