/* modules/canvas.js — Lean Canvas gerado a partir da impressora e das escolhas */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  // Blocos na ordem numérica (boa leitura no mobile); o desktop reposiciona via grid-area
  const BLOCOS = [
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

  function linhas(arr) { return arr.filter(Boolean).join("\n"); }

  // Gera o conteúdo dos 9 blocos a partir do estado atual
  function gerar(state) {
    const { data } = Planner;
    const ui = Planner.ui;
    const printer = Planner.store.getImpressora();
    const nichos = data.nichos.filter((n) => state.nichosSelecionados.includes(n.id));
    const estr = state.estrategiasSelecionadas;
    const canais = data.canais.filter((c) => state.canaisMarketing.includes(c.id));
    const cfg = state.config;
    const has = (id) => estr.includes(id);
    const multic = printer && printer.multicor >= 2;

    const problema = nichos.length
      ? linhas(nichos.map((n) => "• " + n.canvas.problema))
      : "• Pessoas não encontram peças de reposição\n• Querem produtos personalizados e presentes únicos\n• Empresas precisam validar protótipos e tiragens pequenas";

    const segmentos = nichos.length
      ? linhas(nichos.map((n) => "• " + n.canvas.cliente))
      : "• Empresas locais, oficinas e assistências técnicas\n• Arquitetos, engenheiros e designers\n• Público geek, gamers e colecionadores";

    const proposta = printer
      ? `"Produzimos peças e soluções personalizadas em até 48h, com qualidade profissional${multic ? " e impressão multicolorida automática" : ""}."\n\nDa ideia ao produto físico em poucos dias, sem fabricação industrial.`
      : "Escolha uma impressora na aba Impressoras para gerar a proposta de valor ideal.";

    const exemplos = nichos.length
      ? [].concat.apply([], nichos.map((n) => n.canvas.exemplos)).slice(0, 8)
      : ["Peças de reposição", "Chaveiros e troféus personalizados", "Organizadores", "Brindes corporativos"];
    const solExtra = [
      has("e_render") ? "Pré-venda com renders (produz só o que é vendido)" : null,
      has("e_param") ? "Produtos personalizáveis (nome, cor, tamanho)" : null,
      has("e_stl") ? "Venda de arquivos STL" : null,
      has("e_pos") ? "Produtos acabados (pintura e montagem)" : null,
    ];
    const solucao = linhas(["Impressão 3D sob demanda + modelagem"].concat(solExtra)) +
      "\n\nExemplos:\n" + linhas(exemplos.map((e) => "• " + e));

    const canalList = canais.length ? canais.map((c) => c.nome) : ["Instagram", "WhatsApp Business", "Facebook Marketplace"];
    const canaisTxt = "Imediatos:\n" + linhas(canalList.map((c) => "• " + c)) +
      "\n\nApós validação:\n• Mercado Livre / Shopee / Site próprio";

    const meta = cfg.objetivoMensal || 0;
    const round = (n, s) => Math.round(n / s) * s;
    const recEsc = [has("e_stl") ? "Arquivos STL próprios" : null, "Produtos próprios e kits personalizados", has("e_b2b") ? "Contratos recorrentes B2B" : null];
    const receitas = "Recorrente:\n• Impressão sob encomenda\n\nEscalável:\n" + linhas(recEsc.filter(Boolean).map((x) => "• " + x)) +
      (meta ? `\n\nMetas mensais:\n• Mês 1-3: ${ui.money(round(meta * 0.3, 50))}\n• Mês 4-6: ${ui.money(round(meta * 0.7, 50))}\n• Mês 7-12: ${ui.money(round(meta * 1.2, 100))}+` : "");

    const total = (cfg.custoImpressora || 0) + (cfg.filamentos || 0) + (cfg.ferramentas || 0) + (cfg.marketing || 0) + (cfg.reserva || 0);
    const custos = linhas([
      `• Impressora${printer ? " (" + printer.nome + ")" : ""}: ${ui.money(cfg.custoImpressora)}`,
      `• Filamentos: ${ui.money(cfg.filamentos)}`,
      `• Ferramentas/acessórios: ${ui.money(cfg.ferramentas)}`,
      `• Marketing: ${ui.money(cfg.marketing)}`,
      `• Reserva financeira: ${ui.money(cfg.reserva)}`,
    ]) + `\n\nInvestimento total: ${ui.money(total)}`;

    const metricas = "• Pedidos recebidos e taxa de recompra\n• Lucro por peça\n• Custo de filamento por pedido\n• Faturamento mensal\n\n⭐ Indicador-chave: horas faturadas da impressora/semana\nMeta inicial: 20h · Meta ideal: 50h+";

    const vantagem = linhas([
      "• Entrega local rápida + atendimento via WhatsApp",
      multic ? "• Impressão multicolorida automática (poucos FDM oferecem)" : null,
      has("e_247") ? "• Produção contínua 24/7" : null,
      has("e_stl") ? "• Banco de modelos/STL exclusivos" : null,
      "\nMédio prazo: catálogo próprio\nLongo prazo: plataforma de orçamento automático (micro-SaaS)",
    ]);

    return { problema, segmentos, proposta, solucao, canais: canaisTxt, receitas, custos, metricas, vantagem };
  }

  M.canvas = {
    title: "Lean Canvas",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const sug = gerar(s);
      const printer = Planner.store.getImpressora();

      el.innerHTML = `
        ${ui.sectionTitle("Lean Canvas", "Modelo de negócio em 1 página — gerado pela sua impressora e escolhas, e editável")}

        <div class="card canvas-toolbar">
          <div>
            <strong>${printer ? ui.escapeHtml(printer.nome) : "Nenhuma impressora escolhida"}</strong>
            <p class="muted">As sugestões são geradas pelas suas escolhas. Edite à vontade — tudo é salvo automaticamente.</p>
          </div>
          <button class="btn btn-primary" id="canvasGen">✨ Gerar a partir das minhas escolhas</button>
        </div>

        <div class="canvas-grid">
          ${BLOCOS.map((b) => `
            <div class="card canvas-cell" style="grid-area:${b.key}">
              <div class="canvas-head"><span class="num-badge">${b.n}</span> ${ui.escapeHtml(b.nome)}</div>
              <textarea class="canvas-area" data-block="${b.key}" spellcheck="false" placeholder="${ui.escapeHtml(sug[b.key] || "")}">${ui.escapeHtml(s.canvas[b.key] || sug[b.key] || "")}</textarea>
            </div>`).join("")}
        </div>
      `;

      // edição inline silenciosa (não reconstrói os textareas → não perde o cursor)
      el.querySelectorAll("textarea[data-block]").forEach((ta) => {
        ta.addEventListener("input", () => {
          Planner.store.setCanvas({ [ta.dataset.block]: ta.value }, true);
        });
      });

      el.querySelector("#canvasGen").addEventListener("click", () => {
        const temEdicao = BLOCOS.some((b) => (s.canvas[b.key] || "").trim().length > 0);
        if (temEdicao && !confirm("Isto substitui o conteúdo atual dos blocos pelas sugestões geradas. Continuar?")) return;
        Planner.store.setCanvas(gerar(Planner.store.get()));
      });
    },
    gerar,
  };
})();
