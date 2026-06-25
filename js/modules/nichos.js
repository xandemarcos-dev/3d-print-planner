/* modules/nichos.js */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  M.nichos = {
    title: "Nichos",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const { nichos } = Planner.data;
      const printer = Planner.store.getImpressora();
      const reco = printer.nichos || [];
      // recomendados primeiro
      const ordenados = [...nichos].sort((a, b) => (reco.includes(b.id) ? 1 : 0) - (reco.includes(a.id) ? 1 : 0));

      el.innerHTML = `
        ${ui.sectionTitle("Escolha de Nicho", "Selecione os mercados que você quer atacar — afeta o score e o roadmap")}
        <p class="reco-hint">⭐ Destaques recomendados para a <strong>${ui.escapeHtml(printer.nome)}</strong></p>
        <div class="cards-grid">
          ${ordenados.map((n) => {
            const on = s.nichosSelecionados.includes(n.id);
            const isReco = reco.includes(n.id);
            return `
            <div class="card niche-card ${on ? "selected" : ""} ${isReco ? "reco" : ""}">
              <div class="card-top">
                <span class="card-icon">${n.icone}</span>
                <h3>${ui.escapeHtml(n.nome)}</h3>
                ${on ? `<span class="pill-on">No plano</span>` : isReco ? `<span class="pill-reco">⭐ Recomendado</span>` : ""}
              </div>
              <p class="muted">${ui.escapeHtml(n.resumo)}</p>
              ${ui.bar("Potencial financeiro", n.potencial)}
              ${ui.bar("Velocidade de retorno", n.velocidadeRetorno)}
              ${ui.bar("Escalabilidade", n.escalabilidade)}
              ${ui.bar("Dificuldade", n.dificuldade, 5, { invert: true })}
              <div class="risk"><strong>Riscos:</strong> ${ui.escapeHtml(n.riscos)}</div>
              <button class="btn ${on ? "btn-ghost" : "btn-primary"}" data-niche="${n.id}">
                ${on ? "Remover do plano" : "Adicionar ao plano"}
              </button>
            </div>`;
          }).join("")}
        </div>
      `;

      el.querySelectorAll("button[data-niche]").forEach((b) =>
        b.addEventListener("click", () => Planner.store.toggle("nichosSelecionados", b.dataset.niche))
      );
    },
  };
})();
