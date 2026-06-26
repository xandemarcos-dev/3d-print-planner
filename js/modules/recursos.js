/* modules/recursos.js — central de links do ecossistema + links próprios */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  const GRUPOS = [
    {
      titulo: "📚 Bibliotecas de Modelos (STL)", desc: "Baixe modelos prontos para imprimir e treinar o fluxo",
      links: [
        { nome: "MakerWorld", url: "https://makerworld.com", desc: "Modelos da Bambu Lab, prontos para o AMS" },
        { nome: "Printables", url: "https://www.printables.com", desc: "Comunidade da Prusa, enorme acervo gratuito" },
        { nome: "Thingiverse", url: "https://www.thingiverse.com", desc: "O acervo clássico de modelos 3D" },
        { nome: "Cults3D", url: "https://cults3d.com", desc: "Modelos gratuitos e pagos (bom p/ vender STL)" },
        { nome: "Thangs", url: "https://thangs.com", desc: "Busca de modelos com geometria e versões" },
      ],
    },
    {
      titulo: "🧰 Softwares & Slicers", desc: "Fatie, modele e gere modelos",
      links: [
        { nome: "Bambu Studio", url: "https://bambulab.com/en/download/studio", desc: "Slicer oficial da Bambu Lab (AMS)" },
        { nome: "OrcaSlicer", url: "https://github.com/SoftFever/OrcaSlicer", desc: "Slicer avançado para tuning fino" },
        { nome: "Fusion 360", url: "https://www.autodesk.com/products/fusion-360", desc: "Modelagem paramétrica / engenharia" },
        { nome: "Blender", url: "https://www.blender.org", desc: "Modelagem orgânica e arte 3D (gratuito)" },
        { nome: "Meshy", url: "https://www.meshy.ai", desc: "Texto/imagem → modelo 3D com IA" },
      ],
    },
    {
      titulo: "🤖 IA & Base de Conhecimento", desc: "Pesquisa, documentação e geração de ideias",
      links: [
        { nome: "NotebookLM", url: "https://notebooklm.google.com", desc: "Sua base de conhecimento sobre impressão 3D" },
        { nome: "ChatGPT", url: "https://chatgpt.com", desc: "Ideias, copy, automação e scripts" },
        { nome: "Claude", url: "https://claude.ai", desc: "Análise, planejamento e documentação" },
      ],
    },
    {
      titulo: "🎓 Aprendizado & Operação", desc: "Configurar, calibrar e dominar a impressora",
      links: [
        { nome: "Bambu Lab Wiki", url: "https://wiki.bambulab.com", desc: "Manuais, calibração e solução de problemas" },
        { nome: "Bambu Handy", url: "https://bambulab.com/en/handy", desc: "App de monitoramento e controle remoto" },
        { nome: "Bambu Lab — Suporte", url: "https://bambulab.com/en/support", desc: "Firmware, downloads e ajuda oficial" },
      ],
    },
    {
      titulo: "🛒 Canais de Venda", desc: "Onde anunciar e vender",
      links: [
        { nome: "Shopee — Vender", url: "https://seller.shopee.com.br", desc: "Central do vendedor Shopee" },
        { nome: "Mercado Livre — Vender", url: "https://www.mercadolivre.com.br/vender", desc: "Comece a vender no Mercado Livre" },
        { nome: "Instagram", url: "https://www.instagram.com", desc: "Vitrine visual e vendas diretas" },
        { nome: "TikTok", url: "https://www.tiktok.com", desc: "Timelapses e alcance orgânico" },
      ],
    },
  ];

  function isValidUrl(u) { return /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(u); }

  M.recursos = {
    title: "Recursos",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;

      el.innerHTML = `
        ${ui.sectionTitle("Recursos", "Central de links do seu ecossistema de impressão 3D — e os seus próprios atalhos")}

        ${GRUPOS.map((g) => `
          <div class="card">
            <h3>${g.titulo}</h3>
            <p class="muted" style="margin-top:-6px;margin-bottom:12px">${ui.escapeHtml(g.desc)}</p>
            <div class="links-grid">
              ${g.links.map((l) => `
                <a class="link-card" href="${l.url}" target="_blank" rel="noopener">
                  <strong>${ui.escapeHtml(l.nome)} ↗</strong>
                  <span>${ui.escapeHtml(l.desc)}</span>
                </a>`).join("")}
            </div>
          </div>`).join("")}

        <div class="card">
          <h3>⭐ Meus links</h3>
          <p class="muted" style="margin-top:-6px;margin-bottom:12px">Salve seus próprios atalhos (NotebookLM, planilhas, pastas, lojas…).</p>
          <div class="save-product">
            <input type="text" id="rNome" placeholder="Nome (ex.: Meu NotebookLM)" />
            <input type="text" id="rUrl" placeholder="https://..." />
            <button class="btn btn-primary" id="rAdd">＋ Adicionar</button>
          </div>
          <p class="alert neg" id="rErro" style="display:none">Informe um link válido começando com http:// ou https://</p>
          ${s.recursos.length
            ? `<div class="links-grid" style="margin-top:14px">
                ${s.recursos.map((l, i) => `
                  <div class="link-card custom">
                    <a href="${ui.escapeHtml(l.url)}" target="_blank" rel="noopener"><strong>${ui.escapeHtml(l.nome)} ↗</strong><span>${ui.escapeHtml(l.url)}</span></a>
                    <button class="btn btn-sm btn-ghost link-del" data-del="${i}">✕</button>
                  </div>`).join("")}
              </div>`
            : `<p class="muted" style="margin-top:12px">Nenhum link salvo ainda.</p>`}
        </div>
      `;

      const add = () => {
        const nome = (el.querySelector("#rNome").value || "").trim();
        let url = (el.querySelector("#rUrl").value || "").trim();
        if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;
        const erro = el.querySelector("#rErro");
        if (!nome || !isValidUrl(url)) { erro.style.display = "block"; return; }
        erro.style.display = "none";
        Planner.store.addRecurso({ nome, url });
      };
      el.querySelector("#rAdd").addEventListener("click", add);
      el.querySelector("#rUrl").addEventListener("keydown", (e) => { if (e.key === "Enter") add(); });

      el.querySelectorAll("button[data-del]").forEach((b) =>
        b.addEventListener("click", () => Planner.store.removeRecurso(parseInt(b.dataset.del, 10)))
      );
    },
  };
})();
