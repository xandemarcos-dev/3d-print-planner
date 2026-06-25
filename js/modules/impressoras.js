/* modules/impressoras.js — catálogo comparativo + filtros; a escolhida dirige o plano */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  // estado de filtro (em memória, sobrevive aos re-renders reativos do módulo)
  const filtros = { marcas: [], tipos: [], multicor: false, precoMax: 0 };

  function corLabel(n) {
    if (n >= 16) return `Multicor (até ${n})`;
    if (n >= 2) return `Multicor (${n} cores)`;
    return "Cor única";
  }

  function aplicarFiltros(lista) {
    return lista.filter((p) => {
      if (filtros.marcas.length && !filtros.marcas.includes(p.marca)) return false;
      if (filtros.tipos.length && !filtros.tipos.includes(p.tipo)) return false;
      if (filtros.multicor && p.multicor < 2) return false;
      if (filtros.precoMax && p.preco > filtros.precoMax) return false;
      return true;
    });
  }

  const PRECOS = [
    { v: 3000, l: "Até R$ 3 mil" },
    { v: 5000, l: "Até R$ 5 mil" },
    { v: 10000, l: "Até R$ 10 mil" },
    { v: 0, l: "Todos" },
  ];

  M.impressoras = {
    title: "Impressoras",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const { impressoras, nichos, softwares } = Planner.data;
      const selId = s.impressoraSelecionada;
      const sel = Planner.store.getImpressora();

      const recoNichos = (sel.nichos || []).map((id) => nichos.find((n) => n.id === id)).filter(Boolean);
      const recoSofts = (sel.softwares || []).map((id) => softwares.find((w) => w.id === id)).filter(Boolean);

      const marcas = [...new Set(impressoras.map((p) => p.marca))];
      const tipos = [...new Set(impressoras.map((p) => p.tipo))];
      const filtrada = aplicarFiltros(impressoras).sort((a, b) => a.preco - b.preco);

      el.innerHTML = `
        ${ui.sectionTitle("Impressoras", "Compare e escolha a impressora — ela atualiza custo, velocidade e capacidade em todo o plano")}

        <div class="card reco-card">
          <h3>🎯 Recomendações para a ${ui.escapeHtml(sel.nome)}</h3>
          <div class="reco-block">
            <span class="reco-label">Nichos mais apropriados</span>
            <div class="chips">
              ${recoNichos.map((n) => {
                const on = s.nichosSelecionados.includes(n.id);
                return `<button class="chip chip-action ${on ? "chip-on" : ""}" data-addniche="${n.id}">${n.icone} ${ui.escapeHtml(n.nome)} ${on ? "✓" : "+"}</button>`;
              }).join("")}
            </div>
          </div>
          <div class="reco-block">
            <span class="reco-label">Softwares recomendados</span>
            <div class="chips">
              ${recoSofts.map((w) => `<span class="chip">${ui.escapeHtml(w.nome)}${w.marca ? ` · ${w.marca}` : ""}</span>`).join("")}
            </div>
          </div>
          <small class="muted">Os nichos recomendados aparecem destacados na aba <a href="#nichos">Nichos</a> e os softwares na aba <a href="#softwares">Softwares</a>.</small>
        </div>

        <div class="card filter-bar">
          <div class="filter-row">
            <span class="filter-label">Marca</span>
            <div class="filter-pills">
              ${marcas.map((m) => `<button class="seg ${filtros.marcas.includes(m) ? "active" : ""}" data-fmarca="${ui.escapeHtml(m)}">${ui.escapeHtml(m)}</button>`).join("")}
            </div>
          </div>
          <div class="filter-row">
            <span class="filter-label">Tipo</span>
            <div class="filter-pills">
              ${tipos.map((t) => `<button class="seg ${filtros.tipos.includes(t) ? "active" : ""}" data-ftipo="${t}">${t}</button>`).join("")}
              <button class="seg ${filtros.multicor ? "active" : ""}" data-fmulti="1">🌈 Multicor</button>
            </div>
          </div>
          <div class="filter-row">
            <span class="filter-label">Preço</span>
            <div class="filter-pills">
              ${PRECOS.map((p) => `<button class="seg ${filtros.precoMax === p.v ? "active" : ""}" data-fpreco="${p.v}">${p.l}</button>`).join("")}
            </div>
          </div>
          <div class="filter-foot">
            <span class="muted">${filtrada.length} de ${impressoras.length} impressoras</span>
            <button class="btn btn-ghost btn-sm" data-fclear="1">Limpar filtros</button>
          </div>
        </div>

        ${filtrada.length === 0
          ? `<div class="card"><p class="muted">Nenhuma impressora corresponde aos filtros. <a href="#impressoras" data-fclear="1">Limpar filtros</a>.</p></div>`
          : `
        <div class="card table-card">
          <table class="cmp-table printer-table">
            <thead>
              <tr><th>Impressora</th><th>Tipo</th><th>Cores</th><th>Velocidade</th><th>Volume</th><th>Preço</th><th>Aval.</th><th></th></tr>
            </thead>
            <tbody>
              ${filtrada.map((p) => `
                <tr class="${p.id === selId ? "row-active" : ""}">
                  <td><strong>${ui.escapeHtml(p.nome)}</strong></td>
                  <td>${p.tipo}</td>
                  <td>${p.multicor >= 2 ? `<span class="tag-multi">${p.multicor}🎨</span>` : "1"}</td>
                  <td>${p.velocidade ? p.velocidade + " mm/s" : "—"}</td>
                  <td>${ui.escapeHtml(p.volume)}</td>
                  <td>${ui.money(p.preco)}</td>
                  <td>⭐ ${p.avaliacao.toFixed(1)}</td>
                  <td>${p.id === selId
                    ? `<span class="pill-on">Escolhida</span>`
                    : `<button class="btn btn-sm" data-sel="${p.id}">Escolher</button>`}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>

        <div class="cards-grid">
          ${filtrada.map((p) => {
            const on = p.id === selId;
            return `
            <div class="card printer-card ${on ? "selected" : ""}">
              <div class="card-top">
                <span class="card-icon">${p.tipo === "Resina" ? "🧴" : "🖨️"}</span>
                <h3>${ui.escapeHtml(p.nome)}</h3>
                ${on ? `<span class="pill-on">Escolhida</span>` : ""}
              </div>
              <div class="printer-specs">
                <span>${p.tipo}</span><span>${corLabel(p.multicor)}</span>
                <span>${p.velocidade ? p.velocidade + " mm/s" : "Alta precisão"}</span>
                <span>⭐ ${p.avaliacao.toFixed(1)}</span>
              </div>
              <div class="printer-price">${ui.money(p.preco)}</div>
              <p class="muted">${ui.escapeHtml(p.destaque)}</p>
              <div class="printer-actions">
                <button class="btn ${on ? "btn-ghost" : "btn-primary"}" data-sel="${p.id}">
                  ${on ? "Selecionada ✓" : "Usar no plano"}
                </button>
                <a class="btn btn-ghost" href="${p.link}" target="_blank" rel="noopener">Comprar · ${p.loja}</a>
              </div>
            </div>`;
          }).join("")}
        </div>`}
      `;

      const rerender = () => M.impressoras.render(el);

      el.querySelectorAll("button[data-sel]").forEach((b) =>
        b.addEventListener("click", () => Planner.store.setImpressora(b.dataset.sel))
      );
      el.querySelectorAll("button[data-addniche]").forEach((b) =>
        b.addEventListener("click", () => Planner.store.toggle("nichosSelecionados", b.dataset.addniche))
      );
      el.querySelectorAll("[data-fmarca]").forEach((b) =>
        b.addEventListener("click", () => { toggle(filtros.marcas, b.dataset.fmarca); rerender(); })
      );
      el.querySelectorAll("[data-ftipo]").forEach((b) =>
        b.addEventListener("click", () => { toggle(filtros.tipos, b.dataset.ftipo); rerender(); })
      );
      el.querySelectorAll("[data-fmulti]").forEach((b) =>
        b.addEventListener("click", () => { filtros.multicor = !filtros.multicor; rerender(); })
      );
      el.querySelectorAll("[data-fpreco]").forEach((b) =>
        b.addEventListener("click", () => { const v = parseInt(b.dataset.fpreco, 10); filtros.precoMax = filtros.precoMax === v ? 0 : v; rerender(); })
      );
      el.querySelectorAll("[data-fclear]").forEach((b) =>
        b.addEventListener("click", (e) => { e.preventDefault(); filtros.marcas = []; filtros.tipos = []; filtros.multicor = false; filtros.precoMax = 0; rerender(); })
      );
    },
  };

  function toggle(arr, v) {
    const i = arr.indexOf(v);
    if (i === -1) arr.push(v); else arr.splice(i, 1);
  }
})();
