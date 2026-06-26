/* modules/roadmap.js — roadmap em 5 fases gerado dinamicamente */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const M = (Planner.modules = Planner.modules || {});

  function buildFases(s) {
    const { data } = Planner;
    const nichos = data.nichos.filter((n) => s.nichosSelecionados.includes(n.id));
    const estr = data.estrategias.filter((e) => s.estrategiasSelecionadas.includes(e.id));
    const canais = data.canais.filter((c) => s.canaisMarketing.includes(c.id));
    const printer = Planner.store.getImpressora();

    const nichoTxt = nichos.length ? nichos.map((n) => n.nome).join(", ") : "definir nicho prioritário";
    const canalTxt = canais.length ? canais.map((c) => c.nome).join(", ") : "escolher canais de venda";

    const fases = [
      {
        nome: "Aprendizado",
        icone: "📚",
        bullets: [
          "Dominar o Bambu Studio e o fluxo do AMS (troca de cor, perfis).",
          nichos.length ? `Estudar referências e concorrentes em: ${nichoTxt}.` : "Pesquisar nichos e validar demanda local.",
          estr.some((e) => e.id === "e_cadcam" || e.id === "e_hibrida")
            ? "Aprender Fusion 360 / Blender para modelar peças próprias."
            : "Aprender o básico de modelagem ou curadoria de STLs prontos.",
          "Imprimir testes para calibrar qualidade e custo por peça.",
        ],
      },
      {
        nome: "Compra da impressora",
        icone: "🖨️",
        bullets: [
          printer
            ? `Adquirir a ${printer.nome} (${Planner.ui.money(printer.preco)}) — ${printer.tipo}, ${printer.multicor >= 2 ? printer.multicor + " cores" : "cor única"}.`
            : "Escolher e adquirir a impressora (compare opções na aba Impressoras).",
          `Montar estoque inicial de filamento (${Planner.ui.money(s.config.filamentos)}).`,
          "Organizar bancada, ferramentas e área de pós-processamento.",
          s.config.reserva > 0 ? `Manter reserva de ${Planner.ui.money(s.config.reserva)} como capital de giro.` : "Separar uma reserva de capital de giro.",
        ],
      },
      {
        nome: "Produção",
        icone: "⚡",
        bullets: [
          nichos.length ? `Produzir os primeiros produtos de: ${nichoTxt}.` : "Definir os 3 primeiros produtos âncora.",
          estr.some((e) => e.id === "e_multicolor") ? "Priorizar peças multicoloridas para diferenciação (AMS)." : "Padronizar peças com bom custo-benefício.",
          estr.some((e) => e.id === "e_247") ? "Configurar operação contínua com monitoramento remoto." : "Definir uma rotina diária de impressão.",
          "Fotografar produtos e gravar timelapses para conteúdo.",
        ],
      },
      {
        nome: "Validação",
        icone: "🎯",
        bullets: [
          `Listar produtos em: ${canalTxt}.`,
          "Medir conversão, ticket médio e custo de aquisição.",
          estr.some((e) => e.id === "e_render") ? "Usar pré-venda com renders para validar antes de produzir." : "Ajustar preços e mix com base nas primeiras vendas.",
          `Buscar o ponto de equilíbrio (${Planner.ui.money(Planner.calc.financas(s.config).pontoEquilibrio)}/mês).`,
        ],
      },
      {
        nome: "Escala",
        icone: "🚀",
        bullets: [
          estr.some((e) => e.id === "e_boot") ? "Reinvestir o lucro em filamento, anúncios e nova máquina." : "Reinvestir parte do lucro em crescimento.",
          `Atingir a meta de ${Planner.ui.money(s.config.objetivoMensal)}/mês.`,
          "Avaliar a compra da 2ª/3ª impressora (print farm).",
          estr.some((e) => e.id === "e_stl") ? "Criar linha de STLs para renda passiva escalável." : "Sistematizar processos e considerar terceirização.",
        ],
      },
    ];
    return fases;
  }

  M.roadmap = {
    title: "Roadmap",
    render(el) {
      const s = Planner.store.get();
      const ui = Planner.ui;
      const fases = buildFases(s);

      el.innerHTML = `
        ${ui.sectionTitle("Roadmap", "Plano de execução em 5 fases, personalizado pelas suas escolhas")}
        <div class="timeline">
          ${fases.map((f, i) => `
            <div class="tl-item">
              <div class="tl-marker">${f.icone}</div>
              <div class="card tl-card">
                <h3><span class="tl-phase">Fase ${i + 1}</span> ${ui.escapeHtml(f.nome)}</h3>
                <ul>${f.bullets.map((b) => `<li>${ui.escapeHtml(b)}</li>`).join("")}</ul>
              </div>
            </div>`).join("")}
        </div>
      `;
    },
    buildFases,
  };
})();
